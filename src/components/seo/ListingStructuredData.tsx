/**
 * ListingStructuredData
 *
 * Injects JSON-LD structured data (schema.org) into the <head> of a listing page.
 * Enables Google Rich Results for real estate listings + breadcrumbs.
 *
 * Validates at: https://search.google.com/test/rich-results
 *
 * Usage (src/app/listings/[slug]/page.tsx):
 *   import { ListingStructuredData } from '@/components/seo/ListingStructuredData';
 *   export default function ListingPage({ listing }) {
 *     return (
 *       <>
 *         <ListingStructuredData listing={listing} />
 *         {... rest of page ...}
 *       </>
 *     );
 *   }
 *
 * See docs/growth/TASKS.md P0-005 for acceptance criteria.
 * Rollback: Remove import from page.tsx — no functional impact.
 */

import type { JSX } from 'react';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://subletly.com';

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface ListingStructuredDataProps {
  listing: {
    slug: string;
    name: string;
    description: string;
    city: string;
    state?: string;
    neighborhood?: string;
    streetAddress?: string;
    postalCode?: string;
    country?: string;
    priceMonthly: number;
    currency?: string;
    bedrooms: number;
    bathrooms?: number;
    squareFeet?: number;
    availableFrom?: string;  // ISO 8601
    availableTo?: string;    // ISO 8601
    photos?: string[];       // Absolute URLs
    listerName?: string;
    listerUrl?: string;
    reviews?: Array<{
      reviewerName: string;
      rating: number; // 1–5
      reviewBody: string;
      datePublished: string; // ISO 8601
    }>;
  };
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function ListingStructuredData({ listing }: ListingStructuredDataProps): JSX.Element {
  const canonicalUrl = `${BASE_URL}/listings/${listing.slug}`;
  const currency = listing.currency ?? 'USD';
  const country = listing.country ?? 'US';

  // Build breadcrumb items
  const breadcrumbItems: Array<{ id: string; name: string; url: string }> = [
    { id: '1', name: 'Home', url: BASE_URL },
    { id: '2', name: 'Sublets', url: `${BASE_URL}/sublets` },
  ];

  if (listing.city) {
    const citySlug = listing.city.toLowerCase().replace(/\s+/g, '-');
    breadcrumbItems.push({
      id: '3',
      name: listing.city,
      url: `${BASE_URL}/sublets/${citySlug}`,
    });
  }

  if (listing.neighborhood) {
    const citySlug = listing.city.toLowerCase().replace(/\s+/g, '-');
    const neighborhoodSlug = listing.neighborhood.toLowerCase().replace(/\s+/g, '-');
    breadcrumbItems.push({
      id: '4',
      name: listing.neighborhood,
      url: `${BASE_URL}/sublets/${citySlug}/${neighborhoodSlug}`,
    });
  }

  breadcrumbItems.push({
    id: String(breadcrumbItems.length + 1),
    name: listing.name,
    url: canonicalUrl,
  });

  // Accommodation schema
  const accommodationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Accommodation',
    '@id': canonicalUrl,
    name: listing.name,
    description: listing.description,
    url: canonicalUrl,
    numberOfRooms: listing.bedrooms,
    ...(listing.bathrooms && { numberOfBathroomsTotal: listing.bathrooms }),
    ...(listing.squareFeet && { floorSize: { '@type': 'QuantitativeValue', value: listing.squareFeet, unitCode: 'FTK' } }),
    address: {
      '@type': 'PostalAddress',
      ...(listing.streetAddress && { streetAddress: listing.streetAddress }),
      addressLocality: listing.neighborhood ?? listing.city,
      addressRegion: listing.state ?? '',
      ...(listing.postalCode && { postalCode: listing.postalCode }),
      addressCountry: country,
    },
    ...(listing.photos?.length && {
      image: listing.photos.map((url, i) => ({
        '@type': 'ImageObject',
        url,
        position: i + 1,
      })),
    }),
    offers: {
      '@type': 'Offer',
      price: listing.priceMonthly,
      priceCurrency: currency,
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: listing.priceMonthly,
        priceCurrency: currency,
        referenceQuantity: { '@type': 'QuantitativeValue', value: 1, unitCode: 'MON' },
      },
      ...(listing.availableFrom && { availabilityStarts: listing.availableFrom }),
      ...(listing.availableTo && { availabilityEnds: listing.availableTo }),
      seller: listing.listerName
        ? {
            '@type': 'Person',
            name: listing.listerName,
            ...(listing.listerUrl && { url: listing.listerUrl }),
          }
        : undefined,
    },
    ...(listing.reviews?.length && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: (
          listing.reviews.reduce((sum, r) => sum + r.rating, 0) / listing.reviews.length
        ).toFixed(1),
        reviewCount: listing.reviews.length,
        bestRating: 5,
        worstRating: 1,
      },
      review: listing.reviews.map((r) => ({
        '@type': 'Review',
        reviewBody: r.reviewBody,
        datePublished: r.datePublished,
        reviewRating: {
          '@type': 'Rating',
          ratingValue: r.rating,
          bestRating: 5,
          worstRating: 1,
        },
        author: { '@type': 'Person', name: r.reviewerName },
      })),
    }),
  };

  // Breadcrumb schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(accommodationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}

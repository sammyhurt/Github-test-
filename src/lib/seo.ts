/**
 * Subletly SEO Utilities
 *
 * Generates typed metadata objects for Next.js 13+ App Router.
 * Use in page.tsx files via the `generateMetadata` export.
 *
 * See docs/growth/TASKS.md P0-003 for acceptance criteria.
 *
 * Usage (src/app/listings/[slug]/page.tsx):
 *   import { generateListingMetadata } from '@/lib/seo';
 *   export async function generateMetadata({ params }) {
 *     const listing = await getListing(params.slug);
 *     return generateListingMetadata(listing);
 *   }
 */

import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://subletly.com';
const SITE_NAME = 'Subletly';
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-default.png`;

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface ListingMetaInput {
  slug: string;
  title?: string;
  description?: string;
  city: string;
  neighborhood?: string;
  bedrooms: number;
  priceMonthly: number;
  availableFrom?: string; // ISO date
  availableTo?: string;   // ISO date
  photos?: string[];      // Absolute URLs
}

export interface CityHubMetaInput {
  city: string;
  neighborhood?: string;
  listingCount: number;
  avgPrice?: number;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 1).trimEnd() + '…';
}

function citySlug(city: string): string {
  return city.toLowerCase().replace(/\s+/g, '-');
}

function neighborhoodSlug(n: string): string {
  return n.toLowerCase().replace(/\s+/g, '-');
}

// ─── Listing Page Metadata ─────────────────────────────────────────────────────

/**
 * Generates Next.js Metadata for a listing detail page.
 * Title format: "2BR Sublet in Lincoln Park, Chicago — from $1,850/mo | Subletly"
 */
export function generateListingMetadata(listing: ListingMetaInput): Metadata {
  const neighborhoodPart = listing.neighborhood ? `${listing.neighborhood}, ` : '';
  const title = `${listing.bedrooms}BR Sublet in ${neighborhoodPart}${listing.city} — from $${listing.priceMonthly.toLocaleString()}/mo | ${SITE_NAME}`;
  const description = listing.description
    ? truncate(listing.description, 155)
    : `${listing.bedrooms}-bedroom sublet in ${neighborhoodPart}${listing.city} for $${listing.priceMonthly.toLocaleString()}/month. Find verified short-term sublets on Subletly.`;

  const canonicalUrl = `${BASE_URL}/listings/${listing.slug}`;
  const ogImage = listing.photos?.[0] ?? DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${listing.bedrooms}BR sublet in ${listing.city}`,
        },
      ],
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

// ─── City / Neighborhood Hub Page Metadata ─────────────────────────────────────

/**
 * Generates metadata for hub pages like /sublets/chicago or /sublets/chicago/lincoln-park.
 * Title format: "Sublets in Lincoln Park, Chicago (47 listings) | Subletly"
 */
export function generateHubMetadata(hub: CityHubMetaInput): Metadata {
  const locationLabel = hub.neighborhood
    ? `${hub.neighborhood}, ${hub.city}`
    : hub.city;

  const title = `Sublets in ${locationLabel} (${hub.listingCount} listings) | ${SITE_NAME}`;
  const avgPricePart = hub.avgPrice
    ? ` Average price: $${hub.avgPrice.toLocaleString()}/mo.`
    : '';
  const description = `Browse ${hub.listingCount} verified sublets in ${locationLabel}.${avgPricePart} Short-term furnished and unfurnished rooms available on Subletly.`;

  const slugParts = [citySlug(hub.city)];
  if (hub.neighborhood) slugParts.push(neighborhoodSlug(hub.neighborhood));
  const canonicalUrl = `${BASE_URL}/sublets/${slugParts.join('/')}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630 }],
      type: 'website',
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

// ─── Static Page Metadata Helper ──────────────────────────────────────────────

export function buildMetadata({
  title,
  description,
  path,
  ogImage,
  noIndex = false,
}: {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  noIndex?: boolean;
}): Metadata {
  const canonicalUrl = `${BASE_URL}${path}`;
  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      images: [{ url: ogImage ?? DEFAULT_OG_IMAGE, width: 1200, height: 630 }],
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}

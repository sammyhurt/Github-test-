/**
 * Dynamic XML Sitemap — Next.js 13+ App Router
 *
 * Generates sitemap entries for:
 *   1. Static pages (home, search, about, etc.)
 *   2. City hub pages (/sublets/[city])
 *   3. Neighborhood hub pages (/sublets/[city]/[neighborhood])
 *   4. All published listing pages (/listings/[slug])
 *
 * How to validate:
 *   - Local: GET http://localhost:3000/sitemap.xml
 *   - Production: Submit in Google Search Console > Sitemaps
 *
 * Rollback: Delete this file. Sitemap endpoint returns 404, no functional
 *   impact to app. Re-add manually when ready.
 *
 * Update NEXT_PUBLIC_SITE_URL in .env (e.g. https://subletly.com)
 */

import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://subletly.com';

// ─── Types ─────────────────────────────────────────────────────────────────────
// Replace these with your actual DB client / ORM queries.
interface Listing {
  slug: string;
  updatedAt: Date;
  city: string;
  neighborhood?: string;
}

interface CityNeighborhood {
  city: string;
  neighborhood?: string;
}

// ─── Data Fetchers (replace with real DB calls) ────────────────────────────────

/**
 * Fetch all published listings for the sitemap.
 * Replace stub with: db.listings.findMany({ where: { status: 'active' }, select: { slug, updatedAt, city, neighborhood } })
 */
async function getPublishedListings(): Promise<Listing[]> {
  // STUB: replace with real DB query
  // Example with Prisma:
  // return prisma.listing.findMany({
  //   where: { status: 'active' },
  //   select: { slug: true, updatedAt: true, city: true, neighborhood: true },
  //   orderBy: { updatedAt: 'desc' },
  // });
  return [];
}

/**
 * Fetch all unique city + neighborhood combinations from active listings.
 */
async function getCityNeighborhoodPairs(): Promise<CityNeighborhood[]> {
  // STUB: replace with real DB query
  // Example with Prisma:
  // const rows = await prisma.listing.findMany({
  //   where: { status: 'active' },
  //   select: { city: true, neighborhood: true },
  //   distinct: ['city', 'neighborhood'],
  // });
  // return rows;
  return [];
}

// ─── Sitemap ───────────────────────────────────────────────────────────────────
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [listings, cityNeighborhoods] = await Promise.all([
    getPublishedListings(),
    getCityNeighborhoodPairs(),
  ]);

  // 1. Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/sublets`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/list-your-space`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];

  // 2. City hub pages  (e.g. /sublets/chicago)
  const cities = [...new Set(cityNeighborhoods.map((r) => r.city))];
  const cityPages: MetadataRoute.Sitemap = cities.map((city) => ({
    url: `${BASE_URL}/sublets/${encodeURIComponent(city.toLowerCase().replace(/\s+/g, '-'))}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.85,
  }));

  // 3. Neighborhood hub pages (e.g. /sublets/chicago/lincoln-park)
  const neighborhoodPages: MetadataRoute.Sitemap = cityNeighborhoods
    .filter((r) => !!r.neighborhood)
    .map((r) => ({
      url: `${BASE_URL}/sublets/${encodeURIComponent(
        r.city.toLowerCase().replace(/\s+/g, '-'),
      )}/${encodeURIComponent(r.neighborhood!.toLowerCase().replace(/\s+/g, '-'))}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    }));

  // 4. Individual listing pages
  const listingPages: MetadataRoute.Sitemap = listings.map((listing) => ({
    url: `${BASE_URL}/listings/${listing.slug}`,
    lastModified: listing.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.75,
  }));

  return [...staticPages, ...cityPages, ...neighborhoodPages, ...listingPages];
}

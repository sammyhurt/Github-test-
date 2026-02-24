# Subletly Growth OS — Internal & External Link Strategy

> PageRank flows through links. A deliberate link strategy consolidates authority
> to high-value pages and signals topical depth to Google.
> Updated: 2026-02-24

---

## Internal Linking Architecture

### Site Hierarchy

```
Homepage (/)
├── /sublets                          ← Renter search hub
│   ├── /sublets/[city]               ← City hub (L1)
│   │   └── /sublets/[city]/[hood]    ← Neighborhood hub (L2)
│   └── (search results, paginated)
├── /listings/[slug]                  ← Individual listing pages (L3)
├── /list-your-space                  ← Lister acquisition
├── /blog                             ← Content hub
│   └── /blog/[post-slug]             ← Blog posts
├── /faq                              ← FAQ
└── /about                            ← Brand
```

**PageRank priority:** Homepage → /sublets → City hubs → Neighborhood hubs → Listings

---

## Internal Link Rules

### Rule 1: Every page must be reachable within 3 clicks from the homepage.
- Homepage → /sublets → /sublets/chicago → /sublets/chicago/lincoln-park ✓
- Homepage → /sublets/chicago → listing/[slug] ✓

### Rule 2: Listing pages link back up the hierarchy (breadcrumbs).
Every listing page must have a breadcrumb:
```
Home > Sublets > Chicago > Lincoln Park > [Listing Title]
```
Each breadcrumb item is a clickable link. This consolidates hub page authority.

### Rule 3: City hub pages link to all their neighborhood hubs.
`/sublets/chicago` must include anchor links to every neighborhood sub-page.
Do not hide these in a dropdown — keep them as visible crawlable links.

### Rule 4: Neighborhood hub pages link to adjacent neighborhoods.
`/sublets/chicago/lincoln-park` should link to: Wicker Park, Logan Square, River North.
"Explore nearby neighborhoods" section with 3–5 links.

### Rule 5: Blog posts link to relevant hub pages.
"Best Neighborhoods in Chicago" blog post → link each neighborhood name to the hub page.
"How to Sublet in Chicago" → link "sublets in Chicago" to `/sublets/chicago`.

### Rule 6: Listings pages link to city/neighborhood hubs in the footer or "More like this" section.
```
Looking for more options? Browse all sublets in Lincoln Park →
```

### Rule 7: Homepage features city hub links prominently.
Above-fold section: "Popular cities" or "Find sublets in..." with links to top 8–10 city hubs.

---

## Internal Link Anchor Text Matrix

| Source page | Target page | Anchor text example |
|---|---|---|
| Blog: Best Chicago Neighborhoods | `/sublets/chicago/lincoln-park` | "sublets in Lincoln Park" |
| Blog: Best Chicago Neighborhoods | `/sublets/chicago` | "Chicago sublets" |
| City hub `/sublets/chicago` | `/sublets/chicago/lincoln-park` | "Lincoln Park" |
| Neighborhood hub | Adjacent neighborhood | "Wicker Park sublets" |
| Listing page | Neighborhood hub (breadcrumb) | "Lincoln Park" |
| Listing page | City hub (breadcrumb) | "Chicago" |
| Blog: How to sublet | `/list-your-space` | "list your space on Subletly" |
| FAQ | Blog: Is subletting legal | "subletting laws in Illinois" |
| Homepage | City hub | "Sublets in Chicago" |

**Anchor text diversity rule:** Vary anchors so the same target page receives a mix of exact-match, partial-match, and natural anchors. Example ratios for `/sublets/chicago`:
- 40%: "sublets in Chicago" (exact match)
- 30%: "Chicago sublets", "Chicago short-term rentals" (partial match)
- 20%: "sublets", "listings in Chicago" (generic with keyword)
- 10%: "here", "this page", or brand name (natural)

---

## External Linking (Link Acquisition)

### Target Domain Types

**Tier 1 — Easiest wins (low effort, high relevance)**
- University housing bulletin boards (`.edu` domains — high DA)
  - Process: email housing departments offering a free listing for off-campus students
  - Target: 20 university housing pages in top markets
- Local subreddit wikis (`r/chicago`, `r/newyorkcity`, `r/boston` housing threads)
  - Process: contribute genuinely useful advice, add Subletly link in bio/signature over time
- City-specific housing Facebook groups
  - Not backlinks but drive traffic; some groups allow link posts

**Tier 2 — Content-driven (medium effort)**
- Local news / lifestyle publications featuring rental market content
  - Angle: "Average sublet prices in Chicago hit $X — data from Subletly"
  - Provide a quarterly data report → pitch to local real estate reporters
- Personal finance blogs covering housing / relocation
  - Guest post: "How to Save Money on Housing Between Leases"
- Legal / tenant rights organizations
  - Provide a free sublet agreement template → earn backlinks from "resources" pages

**Tier 3 — Authority building (long-term)**
- Real estate data aggregators (e.g., StreetEasy blog, Curbed)
- National housing affordability reports
- University student newspaper articles about housing

### Link Acquisition Tracking

Track all outreach in a spreadsheet (or Airtable):

| Domain | DA | Type | Status | Outreach date | Live date |
|---|---|---|---|---|---|
| uchicago.edu/housing | 93 | Resource page | Outreach sent | 2026-02-24 | — |
| reddit.com/r/chicago | — | Community | Contributing | — | — |

---

## Pagination & Faceted Search

### Problem
Search result pages with filters create duplicate/near-duplicate content:
- `/sublets?city=chicago&page=1`
- `/sublets?city=chicago&page=2`
- `/sublets?city=chicago&bedrooms=2`

### Solution

```tsx
// In search result pages — canonical to first page, or noindex paginated pages:

// Option A (preferred): Canonical to page 1
<link rel="canonical" href="/sublets?city=chicago" />

// Option B: noindex paginated pages beyond page 1
if (page > 1) {
  return { robots: { index: false, follow: true } };
}

// Option C: Prev/Next pagination signals (deprecated by Google but harmless)
<link rel="prev" href="/sublets?city=chicago&page=1" />
<link rel="next" href="/sublets?city=chicago&page=3" />
```

**Rule:** Faceted filter combinations (bedroom count, price range) should be `noindex` unless they have sufficient volume to warrant a dedicated hub page. Dedicated hub pages (city, neighborhood) should NEVER be noindex.

---

## Hreflang (Future — International)

If Subletly expands to Canada or UK, add hreflang tags:

```html
<link rel="alternate" hreflang="en-us" href="https://subletly.com/sublets/chicago" />
<link rel="alternate" hreflang="en-ca" href="https://subletly.ca/sublets/toronto" />
```

Until then, no hreflang needed.

---

## Redirect Map

Maintain this list of redirects in `next.config.js` redirects array.
Add a row every time a URL changes.

```js
// next.config.js
module.exports = {
  async redirects() {
    return [
      // Example: slug change
      {
        source: '/listings/old-slug-:id',
        destination: '/listings/new-slug-:id',
        permanent: true,  // 301
      },
      // Deprecated city URL format
      {
        source: '/city/chicago',
        destination: '/sublets/chicago',
        permanent: true,
      },
    ];
  },
};
```

**Rule:** Never let a high-traffic URL return 404 — always 301 redirect to nearest relevant page.
**Check:** GSC Coverage → "Not found (404)" report monthly. Redirect any 404s with external links.

---

## Link Audit Schedule

| Frequency | Action |
|---|---|
| Monthly | Run Screaming Frog or Ahrefs internal link audit — find orphaned pages (0 internal links pointing to them) |
| Monthly | Check GSC Coverage for 404 errors — add redirects |
| Quarterly | Review top linked pages in Ahrefs — ensure they match target pages |
| Quarterly | Review external backlink profile — disavow spammy links if found |

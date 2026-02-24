# Subletly Growth OS — Technical SEO Audit Checklist

> Run this checklist: (1) on initial integration, (2) after major deploys, (3) monthly.
> Each item links to the relevant fix in PLUG_IN_GUIDE.md or TASKS.md.
> Updated: 2026-02-24

---

## How to Use

**Status codes:**
- `[x]` = Confirmed passing
- `[ ]` = Not yet checked
- `[!]` = Failing — needs fix

**Tools referenced:**
- GSC = Google Search Console
- RRT = [Google Rich Results Test](https://search.google.com/test/rich-results)
- PSI = [PageSpeed Insights](https://pagespeed.web.dev/)
- WAVE = [wave.webaim.org](https://wave.webaim.org/) (accessibility)

---

## Section 1 — Crawlability

### 1.1 robots.txt
- [ ] `https://subletly.com/robots.txt` returns HTTP 200
- [ ] `User-agent: *` / `Allow: /` is present
- [ ] `Disallow:` rules cover: `/api/`, `/dashboard/`, `/account/`, `/admin/`, `/auth/`
- [ ] `Sitemap:` directive points to correct sitemap URL
- [ ] No accidental `Disallow: /` on production (blocks entire site)

**Quick check:**
```bash
curl -s https://subletly.com/robots.txt | grep -E "Disallow|Sitemap|Allow"
```

---

### 1.2 XML Sitemap
- [ ] `https://subletly.com/sitemap.xml` returns HTTP 200
- [ ] Content-Type is `application/xml` or `text/xml`
- [ ] All published listing URLs present (spot-check 5 random slugs)
- [ ] All city hub URLs present (e.g. `/sublets/chicago`)
- [ ] All neighborhood hub URLs present
- [ ] `<lastmod>` dates are accurate (within 7 days for active listings)
- [ ] No URLs in sitemap return 404 or 301
- [ ] Sitemap submitted in GSC (Index > Sitemaps) and shows green status
- [ ] Sitemap error count in GSC = 0

**Quick check:**
```bash
curl -s https://subletly.com/sitemap.xml | grep -c "<url>"
# Should match approximate listing count + static pages
```

---

### 1.3 Indexation Status
- [ ] GSC Coverage report: "Valid" URLs include listing pages
- [ ] GSC Coverage report: "Excluded" does not include listing pages unexpectedly
- [ ] No listing pages in "Discovered - currently not indexed" for > 30 days
- [ ] `site:subletly.com/listings/` in Google returns expected listing pages

---

## Section 2 — On-Page SEO

### 2.1 Title Tags
- [ ] Every listing page has a unique `<title>` (no duplicates in GSC)
- [ ] Title format: `{N}BR Sublet in {Neighborhood}, {City} — from ${price}/mo | Subletly`
- [ ] City hub title: `Sublets in {City} ({N} listings) | Subletly`
- [ ] Title length: 50–60 characters (check GSC "Search results" report for truncation)
- [ ] No `| Subletly | Subletly` double-appending

**Check for duplicates:**
```bash
# GSC > Performance > Pages — sort by impressions, look for identical titles
```

---

### 2.2 Meta Descriptions
- [ ] Every listing page has a unique `<meta name="description">`
- [ ] Length: 120–155 characters
- [ ] Contains: city, neighborhood, bedroom count, price, action word
- [ ] No meta description is identical across pages

---

### 2.3 Canonical Tags
- [ ] Every listing page has `<link rel="canonical" href="https://subletly.com/listings/[slug]" />`
- [ ] Canonical URL exactly matches the page URL (no trailing slash mismatch)
- [ ] Search result pages (`/sublets?city=chicago&page=2`) have canonical pointing to `/sublets?city=chicago` (page 1) OR `noindex`
- [ ] No listing page self-canonicals pointing to a different URL

**Quick check:**
```bash
curl -s https://subletly.com/listings/[slug] | grep -i canonical
```

---

### 2.4 Heading Structure
- [ ] Every listing page has exactly one `<h1>` tag
- [ ] `<h1>` contains: address/title, neighborhood, city
- [ ] Heading hierarchy is logical (h1 → h2 → h3, no skips)
- [ ] City hub pages have `<h1>Sublets in [City]</h1>`

---

### 2.5 Open Graph + Social Tags
- [ ] `og:title` set on all listing and hub pages
- [ ] `og:description` set on all listing and hub pages
- [ ] `og:image` points to listing's first photo (absolute URL, ≥ 1200×630px)
- [ ] `og:url` matches canonical URL
- [ ] `og:type` = `website` (or `article` for blog posts)
- [ ] Twitter `<meta name="twitter:card" content="summary_large_image">` present
- [ ] Validated with [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) for a listing page

---

## Section 3 — Structured Data

### 3.1 Listing Pages
- [ ] `Accommodation` JSON-LD present in `<head>` of every listing page
- [ ] Required fields: `name`, `description`, `address.addressLocality`, `offers.price`, `offers.priceCurrency`
- [ ] `BreadcrumbList` JSON-LD present
- [ ] No structured data errors in RRT
- [ ] No structured data warnings that would prevent rich results
- [ ] If reviews exist: `aggregateRating` populated and valid

**Quick check:**
```bash
curl -s https://subletly.com/listings/[slug] | grep "application/ld+json" | head -5
```

---

### 3.2 Organization Schema (Homepage)
- [ ] `Organization` or `WebSite` schema on homepage
- [ ] `SearchAction` schema for sitelinks searchbox (optional but valuable for brand searches):
```json
{
  "@type": "WebSite",
  "url": "https://subletly.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://subletly.com/sublets?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

---

## Section 4 — Performance (Core Web Vitals)

### 4.1 Listing Page (Mobile) — PSI Test
- [ ] LCP (Largest Contentful Paint) < 2.5s
- [ ] INP (Interaction to Next Paint) < 200ms
- [ ] CLS (Cumulative Layout Shift) < 0.1
- [ ] Performance score ≥ 80

### 4.2 Image Optimization
- [ ] Listing hero image uses `<Image>` from `next/image` with `priority` prop
- [ ] All listing images have explicit `width` and `height` (prevents CLS)
- [ ] Images served in WebP or AVIF format
- [ ] Hero image `<img>` tag has `fetchpriority="high"` (auto-set by `next/image priority`)
- [ ] No images above fold > 200KB
- [ ] Next.js `next.config.js` has Firebase Storage domain in `images.remotePatterns`

```js
// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
    ],
  },
};
```

### 4.3 JavaScript
- [ ] No render-blocking scripts (check PSI "Eliminate render-blocking resources")
- [ ] Third-party scripts (PostHog, GA4) loaded `afterInteractive`
- [ ] Bundle size: main JS chunk < 200KB gzip (check with `next build` output)
- [ ] No unused JavaScript > 50KB on listing pages (check Coverage tab in DevTools)

### 4.4 Fonts
- [ ] Fonts loaded with `next/font` (auto-optimized) OR `font-display: swap`
- [ ] No FOUT (Flash of Unstyled Text) on listing pages

---

## Section 5 — Mobile UX

- [ ] All pages pass [Google Mobile Friendly Test](https://search.google.com/test/mobile-friendly)
- [ ] Tap targets (buttons, links) ≥ 44×44px
- [ ] No horizontal scroll on 375px viewport
- [ ] Lead form visible above fold on mobile without scrolling
- [ ] Text readable without zooming (min 16px body font)

---

## Section 6 — Security & Technical

- [ ] HTTPS enforced on all pages (no HTTP serving)
- [ ] `www.subletly.com` redirects to `subletly.com` (or vice versa) — consistent
- [ ] No mixed content warnings in browser console
- [ ] No `noindex` meta tag in production HTML
- [ ] No `X-Robots-Tag: noindex` in response headers on listing pages

**Check noindex:**
```bash
curl -I https://subletly.com/listings/[slug] | grep -i "x-robots"
curl -s https://subletly.com/listings/[slug] | grep -i "noindex"
# Both should return empty
```

---

## Section 7 — Google Search Console Weekly Review

- [ ] Coverage report: 0 new errors
- [ ] Sitemaps: submitted sitemap shows green, 0 errors
- [ ] Core Web Vitals report: 0 URLs in "Poor" category
- [ ] Rich Results: no new errors on Accommodation type
- [ ] Manual Actions: none (check Security & Manual Actions section)
- [ ] Search Performance: impressions and clicks trending up week-over-week for `/listings/` URLs

---

## Audit Log

| Date | Auditor | Critical Issues Found | Resolved |
|---|---|---|---|
| 2026-02-24 | Growth OS | No sitemap, no structured data, no meta tags | P0-002, P0-003, P0-005 in progress |

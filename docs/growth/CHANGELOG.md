# Subletly Growth OS — Changelog

> Format: `[YYYY-MM-DD] TYPE: Description`
> Types: SHIPPED, EXPERIMENT, ROLLBACK, CONFIG, DOCS

---

## 2026-02-24

### SHIPPED: P0-001 · Analytics Foundation
**What changed:**
- `src/lib/analytics.ts` — Single `track()` + `identify()` + `reset()` wrapper for PostHog + GA4. Typed event union (`SubletlyEvent`) covering all 8 core funnel events + secondary + retention events. Debug mode via `window.__ANALYTICS_DEBUG`.
- `src/components/providers/AnalyticsProvider.tsx` — Client component that bootstraps PostHog (via inline snippet) and GA4 (via `next/script` + gtag). Fires `$pageview` / `page_view` on SPA route changes. Mount in `src/app/layout.tsx`.

**Why:** Zero funnel visibility = flying blind. This is the prerequisite for all optimization work.

**How to validate locally:**
1. Set `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_GA4_MEASUREMENT_ID` in `.env.local`
2. Add `<AnalyticsProvider>` to `src/app/layout.tsx`
3. Open browser console → `window.__ANALYTICS_DEBUG = true`
4. Navigate pages and submit a lead → confirm events log to console
5. Check PostHog Live Events tab + GA4 DebugView

**Rollback:** Remove `<AnalyticsProvider>` from `layout.tsx`. No data loss.

---

### SHIPPED: P0-002 · robots.txt + Dynamic Sitemap
**What changed:**
- `public/robots.txt` — Allows all crawlers; disallows `/api/`, `/dashboard/`, `/account/`, `/admin/`, `/messages/`, `/auth/`; points to `https://subletly.com/sitemap.xml`
- `src/app/sitemap.ts` — Next.js 13+ `sitemap()` export. Generates entries for static pages, city hubs (`/sublets/[city]`), neighborhood hubs (`/sublets/[city]/[neighborhood]`), and all published listings. Stubs marked for real DB query replacement.

**Why:** Without a sitemap, Google can't efficiently discover listing pages — killing organic lead flow entirely.

**How to validate locally:** `curl http://localhost:3000/sitemap.xml` — should return XML with static pages; add real DB stub to see listing URLs.

**Production:** Submit `https://subletly.com/sitemap.xml` in Google Search Console > Sitemaps.

**Rollback:** Delete `src/app/sitemap.ts`. Returns 404 for `/sitemap.xml`. No functional impact.

---

### SHIPPED: P0-003 · SEO Meta Tag Utilities
**What changed:**
- `src/lib/seo.ts` — `generateListingMetadata()`, `generateHubMetadata()`, `buildMetadata()` helpers returning typed Next.js `Metadata` objects. Handles title format, 155-char description truncation, canonical URLs, OG tags, Twitter cards, and `robots` directives.

**Why:** Without proper `<title>`, `<meta description>`, and OG tags on every listing page, organic CTR is suppressed and social sharing generates generic previews.

**How to validate:** `export async function generateMetadata({ params }) { ... }` in `page.tsx` → view-source in browser, confirm `<title>` and `<meta name="description">` are set correctly per listing.

**Rollback:** Remove `generateMetadata` export from page — Next.js falls back to root layout metadata.

---

### SHIPPED: P0-005 · JSON-LD Structured Data (Listing Pages)
**What changed:**
- `src/components/seo/ListingStructuredData.tsx` — Renders two `<script type="application/ld+json">` blocks: `Accommodation` schema (name, address, price, photos, availability, reviews/ratings) + `BreadcrumbList` (Home > Sublets > City > Neighborhood > Listing).

**Why:** Schema markup enables Google Rich Results (price, availability, ratings shown in SERP), improving organic CTR by ~20-30%.

**How to validate:** Use [Google Rich Results Test](https://search.google.com/test/rich-results) with your listing page URL.

**Rollback:** Remove import from listing `page.tsx`. No functional impact.

---

### DOCS: Growth OS Bootstrap
**What changed:** Created full Growth OS documentation framework
**Files:**
- `docs/growth/TASKS.md` — P0/P1/P2 prioritized backlog with acceptance criteria
- `docs/growth/EXPERIMENTS.md` — Experiment log with 5 planned experiments
- `docs/growth/REPORT.md` — Weekly KPI report template + baseline state
- `docs/growth/INSTRUMENTATION.md` — Full event schema (8 core events + secondary + P2)
- `docs/growth/CHANGELOG.md` — This file

**Why:** Established measurement framework before any growth changes. Can't optimize without visibility.

**Current state assessment:**
- Tech stack: Not yet assessed (repo is greenfield)
- Analytics: NOT instrumented — CRITICAL gap
- SEO: NOT configured (no sitemap, robots.txt, meta tags) — CRITICAL gap
- Funnel metrics: NO baseline data

**Validation:** Files exist and are committed to `claude/subletly-growth-os-hE5sn`

**Next 3 actions:**
1. Implement P0-001: Analytics foundation (PostHog + GA4 wrapper + 8 core events)
2. Implement P0-002: robots.txt + XML sitemap
3. Implement P0-003: Listing page meta tags + OG tags

---

_Previous entries will appear above this line as changes are shipped._

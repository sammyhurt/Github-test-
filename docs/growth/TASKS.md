# Subletly Growth OS — Task Backlog

> Owner: Head of Growth + Product Engineering
> Updated: 2026-02-24
> North Star: Increase high-intent renter leads and successful matches, while growing verified supply.

---

## P0 — Ship Now (Funnel Visibility + Critical Blockers)

### P0-001 · Analytics Foundation — Core Funnel Events
**Status:** TODO
**Mechanism:** Can't optimize what you can't measure. Zero funnel visibility = flying blind.
**Acceptance criteria:**
- [ ] PostHog (or GA4) initialized on every page (Next.js `_app.tsx` / `layout.tsx`)
- [ ] `identify` called on signup/login with `user_id`, `role` (renter|lister), `created_at`
- [ ] 8 core funnel events firing (see INSTRUMENTATION.md)
- [ ] Verified in PostHog Live Events / GA4 DebugView
**Files:** `src/lib/analytics.ts`, `src/app/layout.tsx`, `src/components/providers/AnalyticsProvider.tsx`
**Rollback:** Remove provider import from layout; events stop firing, no data loss.

---

### P0-002 · SEO — robots.txt + XML Sitemap
**Status:** TODO
**Mechanism:** Without a sitemap, Google can't index listing pages — killing organic lead flow.
**Acceptance criteria:**
- [ ] `public/robots.txt` allows all crawlers, points to `/sitemap.xml`
- [ ] `/sitemap.xml` (or `/sitemap_index.xml`) generated dynamically including all published listing URLs
- [ ] Canonical tags on listing pages (`<link rel="canonical" href="..." />`)
- [ ] No accidental `noindex` in production `<head>`
- [ ] Submit sitemap in Google Search Console
**Files:** `public/robots.txt`, `src/app/sitemap.ts` (Next.js 13+ App Router) or `pages/sitemap.xml.ts`
**Rollback:** Delete `sitemap.ts`; fall back to static or no sitemap (low risk).

---

### P0-003 · SEO — Listing Page Meta Tags (OG + Title + Description)
**Status:** TODO
**Mechanism:** Each listing page needs unique `<title>`, `<meta description>`, and OG tags to rank and earn click-throughs from search + social sharing.
**Acceptance criteria:**
- [ ] Listing page `<title>` format: `{bedrooms}BR Sublet in {neighborhood}, {city} — from ${price}/mo | Subletly`
- [ ] `<meta name="description">` pulls from listing description (truncated to 155 chars)
- [ ] `og:title`, `og:description`, `og:image` (listing photo), `og:url` set correctly
- [ ] City/neighborhood hub pages (`/sublets/chicago`, `/sublets/chicago/lincoln-park`) have unique titles
- [ ] Validate with `curl -I` + view-source in staging
**Files:** `src/app/listings/[slug]/page.tsx`, `src/lib/seo.ts`
**Rollback:** Remove metadata export; falls back to default app-level meta.

---

### P0-004 · Funnel UX — Lead Form Friction Audit
**Status:** TODO
**Mechanism:** Every extra field in the lead form = drop-off. Benchmark against industry: 3-field forms convert 2x vs 6-field forms.
**Acceptance criteria:**
- [ ] Lead form has ≤ 4 fields (name, email, move-in date, message)
- [ ] Form is visible above-the-fold on mobile without scrolling
- [ ] Submit triggers `lead_submitted` event with `listing_id`, `lister_id`, `renter_id`
- [ ] Success state shows confirmation + "View similar listings" CTA
- [ ] Error states (validation, network) are explicit and recoverable
**Files:** `src/components/LeadForm.tsx`, `src/app/listings/[slug]/page.tsx`
**Rollback:** Revert component to previous version via git.

---

### P0-005 · Indexation — Structured Data (JSON-LD) on Listing Pages
**Status:** TODO
**Mechanism:** `RealEstateListing` + `BreadcrumbList` schema enables rich results in Google, improving CTR by ~20-30%.
**Acceptance criteria:**
- [ ] `ListingPage` or `Accommodation` JSON-LD injected in `<head>` of each listing page
- [ ] Includes: name, description, address, price, availability dates, images
- [ ] `BreadcrumbList`: Home > Sublets > {City} > {Neighborhood} > {Listing Title}
- [ ] Validated in Google Rich Results Test
**Files:** `src/components/seo/ListingStructuredData.tsx`
**Rollback:** Remove component import; no functional change.

---

## P1 — High Leverage (Conversion + Internal Linking + Performance)

### P1-001 · Conversion — "Complete Your Profile" Prompt
**Status:** TODO
**Mechanism:** Incomplete profiles block trust signals. Fire nudge at 48h post-signup if profile_complete = false.
**Acceptance criteria:**
- [ ] Email trigger: 48h after signup, if `profile_complete = false`
- [ ] In-app banner on dashboard: "Add a photo + bio to get 3x more replies"
- [ ] `profile_completion_nudge_shown` + `profile_completion_nudge_clicked` events
- [ ] Measure: profile complete rate (baseline vs variant)

---

### P1-002 · Conversion — Listing Quality Score + Completeness Meter
**Status:** TODO
**Mechanism:** Listers with photos + full descriptions get more leads. Show them a progress bar.
**Acceptance criteria:**
- [ ] Listing completeness score (0-100) based on: photos ≥3 (30pts), description ≥100 chars (20pts), price set (20pts), dates set (20pts), amenities filled (10pts)
- [ ] Progress bar visible in lister dashboard + listing editor
- [ ] `listing_quality_score_viewed` event on render
- [ ] Score stored in DB for filtering/sorting in search

---

### P1-003 · SEO — Internal Linking Hub Pages
**Status:** TODO
**Mechanism:** City and neighborhood hub pages consolidate PageRank and capture high-volume head terms ("sublets in Chicago").
**Acceptance criteria:**
- [ ] Hub pages at `/sublets/[city]` and `/sublets/[city]/[neighborhood]`
- [ ] Each hub lists active listings with thumbnail, price, bedrooms
- [ ] Hub pages link to each other (city links to neighborhoods)
- [ ] Listing pages breadcrumb back to hub pages
- [ ] Hub pages in sitemap

---

### P1-004 · Performance — Core Web Vitals Baseline
**Status:** TODO
**Mechanism:** LCP >4s tanks both SEO rankings and conversion (1s delay = ~7% conversion drop).
**Acceptance criteria:**
- [ ] Lighthouse score ≥ 80 on listing pages (mobile)
- [ ] LCP < 2.5s, CLS < 0.1, FID/INP < 200ms
- [ ] Listing images use `next/image` with explicit `width`/`height` + `priority` on hero
- [ ] No render-blocking third-party scripts without `async`/`defer`

---

### P1-005 · Marketplace Liquidity — Lister Onboarding Email Sequence
**Status:** TODO
**Mechanism:** Listers who publish within 24h of signup have 4x retention. Reduce time-to-first-listing.
**Acceptance criteria:**
- [ ] Email 1 (T+0): "Start your listing" — deep link to listing editor
- [ ] Email 2 (T+24h, if not published): "Tip: listings with 3+ photos get 60% more leads"
- [ ] Email 3 (T+72h, if not published): "Your neighborhood has X renters waiting"
- [ ] Track: `lister_onboarding_email_opened`, `lister_onboarding_cta_clicked`

---

### P1-006 · Marketplace Liquidity — "Renters Waiting in Your Area" Supply Trigger
**Status:** TODO
**Mechanism:** Show listers real demand signal to motivate publishing. Social proof + urgency.
**Acceptance criteria:**
- [ ] API endpoint: `GET /api/demand-signal?city=Chicago&neighborhood=Lincoln+Park` → `{ renters_searching: 47, avg_budget: 1850 }`
- [ ] Displayed in lister onboarding flow + listing editor sidebar
- [ ] Updates weekly from search query aggregation

---

## P2 — Retention + Referral + UGC

### P2-001 · Referral Program — Lister Referral ("Give $25, Get $25")
**Status:** TODO
**Mechanism:** CAC reduction via viral supply growth.
**Acceptance criteria:**
- [ ] Unique referral link per lister
- [ ] Credit applied when referred lister publishes first listing
- [ ] `referral_link_copied`, `referral_signup`, `referral_conversion` events

---

### P2-002 · UGC — Verified Renter Reviews on Listings
**Status:** TODO
**Mechanism:** Reviews increase trust → lead submission rate. "Verified renter" badge reduces scam perception.
**Acceptance criteria:**
- [ ] Review only unlocked after confirmed match (move-in date passed)
- [ ] Review displayed on listing page with verified badge
- [ ] Review schema (JSON-LD `Review`) for rich results

---

### P2-003 · Retention — "Saved Search" Email Alerts
**Status:** TODO
**Mechanism:** Re-engage renters who searched but didn't submit a lead. Bring them back when new listings match.
**Acceptance criteria:**
- [ ] Renter can save a search (city, neighborhood, price range, dates, bedrooms)
- [ ] Email alert when new matching listing published
- [ ] `saved_search_created`, `saved_search_alert_sent`, `saved_search_alert_clicked` events

---

## Metrics Baseline (to establish on P0 completion)

| Metric | Baseline | Target | Measurement |
|---|---|---|---|
| Sessions → Signup | ? | ≥ 8% | Analytics funnel |
| Signup → Profile Complete | ? | ≥ 60% | PostHog cohort |
| Listing Started → Published | ? | ≥ 55% | Funnel event |
| Renter Search → Lead Submitted | ? | ≥ 4% | Funnel event |
| Lead → Reply Rate | ? | ≥ 70% | DB query |
| Time-to-First-Lead (per listing) | ? | ≤ 72h | DB query |
| Verified Listing % | ? | ≥ 80% | DB query |
| Scam Report Rate | ? | ≤ 0.5% | DB query |

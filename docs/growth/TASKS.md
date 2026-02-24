# Subletly Growth OS — Task Backlog

> Owner: Head of Growth + Product Engineering
> Updated: 2026-02-24
> Mode: ONBOARDING — full starter backlog for a sublet marketplace on Next.js + Firebase
> North Star: Increase high-intent renter leads and successful matches, while growing verified supply.

---

## How to Use This Backlog

1. **Before starting any task:** confirm relevant metrics are being tracked (see INSTRUMENTATION.md)
2. **Acceptance criteria** are the definition of done — all boxes must be checked before marking complete
3. **Rollback plan** must be tested before merging to production
4. **Every shipped task** gets a CHANGELOG.md entry
5. Tasks reference playbooks in PLAYBOOKS.md for operational context

## Related Docs
- `docs/growth/PLUG_IN_GUIDE.md` — how to wire each task to the Next.js + Firebase codebase
- `docs/growth/METRICS_DEFINITIONS.md` — how each metric is calculated
- `docs/growth/EXPERIMENTS.md` — A/B tests spawned from these tasks
- `docs/growth/PLAYBOOKS.md` — operational runbooks
- `docs/seo/SEO_CHECKLIST.md` — SEO validation steps
- `docs/seo/KEYWORD_MAP.md` — keyword targets per task
- `docs/seo/CONTENT_TEMPLATES.md` — copy templates
- `docs/seo/CWV_CHECKLIST.md` — performance targets

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

---

## Additional P1 Tasks (Marketplace Liquidity + Trust)

### P1-007 · Trust — Identity Verification Badge
**Status:** TODO
**Mechanism:** Verified lister badge increases renter trust → lead submission. Scam listings typically have unverified accounts.
**Acceptance criteria:**
- [ ] Listers can verify via: email confirmed + phone number + government ID (Stripe Identity or similar)
- [ ] "Verified Lister" badge displays on listing cards and listing detail pages
- [ ] Verified listings sort above unverified in default search ranking
- [ ] `lister_verification_started`, `lister_verification_completed` events
- [ ] Track: verified_listing_% metric (see METRICS_DEFINITIONS.md)
**Files:** `src/app/dashboard/verify/page.tsx`, `src/components/VerifiedBadge.tsx`
**Rollback:** Hide badge component; verification data persists in Firestore.

---

### P1-008 · SEO — Programmatic Neighborhood Hub Pages
**Status:** TODO
**Mechanism:** Each indexed neighborhood page captures "sublets in [neighborhood] [city]" — low-KD, high-conversion keywords (see KEYWORD_MAP.md T2 tier).
**Acceptance criteria:**
- [ ] Dynamic route: `src/app/sublets/[city]/[neighborhood]/page.tsx`
- [ ] Page uses `generateHubMetadata()` from `src/lib/seo.ts`
- [ ] Lists active listings in that neighborhood (Firestore query by city + neighborhood)
- [ ] "Nearby neighborhoods" section with 3–5 internal links
- [ ] Included in sitemap (auto-populated from distinct city/neighborhood pairs)
- [ ] 10 neighborhood pages live and indexed within 30 days
**Target keywords:** See `docs/seo/KEYWORD_MAP.md` T2 tier per city
**Rollback:** Delete route — returns 404, no functional impact.

---

### P1-009 · Conversion — "Similar Listings" on Lead Confirmation
**Status:** TODO
**Mechanism:** After lead submission, showing 3 similar listings keeps renters engaged and increases total lead volume per session.
**Acceptance criteria:**
- [ ] After `lead_submitted`, show "3 similar listings in [neighborhood]" cards
- [ ] Similarity logic: same city, ± 1 bedroom, ± 20% price, different lister
- [ ] Each card is a full link to the listing page
- [ ] `similar_listing_clicked` event with `source: 'post_lead_confirmation'`
**Files:** `src/components/LeadForm.tsx` (success state), `src/lib/recommendations.ts`
**Rollback:** Remove similar listings section from success state.

---

### P1-010 · Performance — Web Vitals Real-User Monitoring
**Status:** TODO
**Mechanism:** Lab scores (Lighthouse) don't reflect real user experience. RUM identifies actual slow pages and devices.
**Acceptance criteria:**
- [ ] `web-vitals` npm package installed
- [ ] `reportWebVitals()` called in root layout (see `docs/seo/CWV_CHECKLIST.md` Section 6)
- [ ] `web_vital` event fires in PostHog with `name`, `value`, `rating` properties
- [ ] PostHog dashboard: filter `name=LCP, rating=poor` → identify worst pages
- [ ] Listing page p75 LCP < 2.5s (field data)
**Rollback:** Remove `<WebVitalsReporter />` from layout.

---

### P1-011 · Supply — "Time to First Lead" Lister Notification
**Status:** TODO
**Mechanism:** Listers who don't get a lead in 48h risk churning. Proactive notification + actionable advice retains them.
**Acceptance criteria:**
- [ ] Cloud Function triggered 48h after `listing.publishedAt` if `listing.leadCount = 0`
- [ ] Email: "Your listing hasn't received any leads yet. Here are 3 tips:" [photos / price / description checklist]
- [ ] In-app notification if user opens dashboard within 72h
- [ ] `time_to_first_lead_nudge_sent` event
- [ ] Track: does nudge improve time-to-first-lead median?
**Firebase:** Cloud Function with Firestore trigger or Cloud Scheduler
**Rollback:** Disable Cloud Function.

---

## Additional P2 Tasks

### P2-004 · Content — University Seasonal Sublet Guides
**Status:** TODO
**Mechanism:** University housing searches spike August + January. Low-KD, high-conversion keywords with no major competition.
**Acceptance criteria:**
- [ ] Guides published for top 5 university markets 8 weeks before move-in season
- [ ] Template from `docs/seo/CONTENT_TEMPLATES.md#4-university-neighborhood-sub-page`
- [ ] Each guide internally links to relevant neighborhood hub page
- [ ] Target keywords from `docs/seo/KEYWORD_MAP.md` University Market Keywords section
- [ ] Indexed and appearing in GSC within 3 weeks of publish
**Schedule:** Publish by June 1 (for August) and November 1 (for January)

---

### P2-005 · Trust — Scam Detection Automation
**Status:** TODO
**Mechanism:** Manual scam review doesn't scale. Automated flagging catches bad actors before renters are harmed.
**Acceptance criteria:**
- [ ] Cloud Function: flag listing if price < 50% of median price for same bedroom count + neighborhood
- [ ] Cloud Function: flag if listing photos match known scam image hashes (perceptual hash comparison)
- [ ] Flagged listings enter `status: 'under_review'` (hidden from search, visible to ops)
- [ ] Ops dashboard shows pending review queue
- [ ] `listing_auto_flagged` event with `reason`
**Rollback:** Disable Cloud Function; listings remain active.

---

### P2-006 · Retention — Lister "Listing Performance" Dashboard
**Status:** TODO
**Mechanism:** Transparent analytics for listers (views, leads, reply rate) increases platform trust and relisting behavior.
**Acceptance criteria:**
- [ ] Lister dashboard shows per-listing: views (last 7d/30d), leads received, reply rate
- [ ] Comparison to "similar listings in your area" benchmarks
- [ ] `listing_analytics_viewed` event
- [ ] Data sourced from `listing_viewed` + `lead_submitted` events aggregated to Firestore
**Rollback:** Hide dashboard section; underlying data unaffected.

---

### P2-007 · Growth — Lister Referral Program (Full Implementation)
**Status:** TODO (expands on P2-001 stub)
**Mechanism:** Viral supply growth. Each new lister who came via referral has same LTV as organic — pure CAC reduction.
**Acceptance criteria:**
- [ ] Unique referral code generated per lister (`users/{uid}.referralCode`)
- [ ] `/ref/[code]` landing page sets cookie + redirects to `/list-your-space`
- [ ] Referred signup links `referredBy: referrerUid` in user document
- [ ] Credit ($25 or fee waiver) applied when referee publishes first listing
- [ ] Referral stats visible in lister dashboard: "You've referred N listers"
- [ ] `referral_link_copied`, `referral_signup`, `referral_conversion` events
- [ ] Viral coefficient tracked weekly: referred signups / referring listers
**See also:** Playbook PB-05 in `docs/growth/PLAYBOOKS.md`

---

## Metrics Baseline (to establish on P0 completion)

| Metric | Baseline | Target | Measurement | Definition |
|---|---|---|---|---|
| Sessions → Signup | ? | ≥ 8% | PostHog funnel | See METRICS_DEFINITIONS.md #1 |
| Signup → Profile Complete | ? | ≥ 60% | PostHog cohort | See METRICS_DEFINITIONS.md #2 |
| Listing Started → Published | ? | ≥ 55% | PostHog funnel | See METRICS_DEFINITIONS.md #3 |
| Renter Search → Lead Submitted | ? | ≥ 4% | PostHog funnel | See METRICS_DEFINITIONS.md #4 |
| Lead → Reply Rate | ? | ≥ 70% | Firestore query | See METRICS_DEFINITIONS.md #5 |
| Time-to-First-Lead (per listing) | ? | ≤ 72h | Firestore query | See METRICS_DEFINITIONS.md #6 |
| Verified Listing % | ? | ≥ 80% | Firestore query | See METRICS_DEFINITIONS.md #7 |
| Scam Report Rate | ? | ≤ 0.5% | Firestore query | See METRICS_DEFINITIONS.md #8 |

## Full Task Count Summary

| Priority | Count | Status |
|---|---|---|
| P0 | 5 | All TODO — ship in order |
| P1 | 11 | TODO — start after P0 baseline established |
| P2 | 7 | TODO — start after P1 conversion gains |
| **Total** | **23** | **0 complete** |

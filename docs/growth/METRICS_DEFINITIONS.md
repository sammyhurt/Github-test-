# Subletly Growth OS — Metrics Definitions

> Every metric tracked by the Growth OS has an owner, formula, source, and cadence.
> If a metric is not defined here, it is not being tracked.
> Updated: 2026-02-24

---

## Metric Tiers

| Tier | Description | Review cadence |
|---|---|---|
| **North Star** | Single number that captures value for both sides of the marketplace | Weekly |
| **L1 — Input metrics** | Things we directly control that drive the North Star | Weekly |
| **L2 — Health metrics** | Guardrails — flag when something is broken | Daily alert |
| **L3 — Diagnostic** | Used when debugging a specific problem | Ad hoc |

---

## North Star Metric

### Successful Matches per Week
> A "successful match" = a lead that results in a confirmed move-in (or, as proxy before move-in data exists: a lead where the lister replies + renter views the listing again within 7 days).

**Formula (proxy):**
```
Successful Matches = COUNT(leads WHERE replied_at IS NOT NULL
                          AND renter_returned_within_7d = true)
```

**Source:** Firestore `leads` collection
**Owner:** Growth Lead
**Target:** Growing week-over-week. Set absolute target once baseline established.

---

## L1 — Input Metrics (Growth Levers)

### 1. Sessions → Signup Conversion Rate
**What it measures:** Of all visitors, what % create an account?
**Formula:**
```
sessions_to_signup_rate = signups_in_period / sessions_in_period
```
**Source:** PostHog funnel (`$pageview` → `user_signed_up`)
**Target:** ≥ 8%
**Owner:** Growth
**Notes:** Segment by traffic source (organic/paid/direct). Organic signup rate is the SEO health signal.

---

### 2. Signup → Profile Complete Rate
**What it measures:** Of new signups, what % fill out their full profile (photo + bio)?
**Formula:**
```
profile_complete_rate = profile_completed_events / user_signed_up_events
  (measured at 7-day cohort — "did they complete within 7 days of signup?")
```
**Source:** PostHog cohort (`user_signed_up` D+7 → `profile_completed`)
**Target:** ≥ 60%
**Owner:** Product
**Notes:** Low rate = profile UX is too much friction OR value prop unclear. Check by role (renters vs listers may differ significantly).

---

### 3. Listing Started → Listing Published Rate
**What it measures:** Of listers who begin a listing, what % publish it?
**Formula:**
```
listing_publish_rate = listing_published_events / listing_started_events
  (measured at 7-day cohort)
```
**Source:** PostHog funnel (`listing_started` → `listing_published`)
**Target:** ≥ 55%
**Owner:** Product (Supply)
**Notes:** Drop-off by step (which editor screen loses listers?) is a diagnostic metric. Use PostHog session recordings to find rage clicks.

---

### 4. Renter Search → Lead Submitted Rate
**What it measures:** Of search sessions that view ≥1 listing, what % submit a lead?
**Formula:**
```
search_to_lead_rate = lead_submitted_events / search_performed_events_with_results
```
**Source:** PostHog funnel (`search_performed` → `listing_viewed` → `lead_submitted`)
**Target:** ≥ 4%
**Owner:** Growth
**Notes:** This is the most sensitive conversion metric. Even a 0.5pp improvement = significant lead volume lift. Break down by: city, price range, mobile vs desktop.

---

### 5. Lead → Reply Rate
**What it measures:** Of submitted leads, what % get a reply from the lister?
**Formula:**
```
lead_reply_rate = COUNT(leads WHERE replied_at IS NOT NULL) / COUNT(all leads)
  (measured at 48h window from lead submission)
```
**Source:** Firestore `leads` collection
**Target:** ≥ 70%
**Owner:** Marketplace / Supply Quality
**Notes:** Low reply rate = dead supply or overwhelmed listers. Segment by lister tenure (new vs established). Alert if drops below 50%.

---

### 6. Time-to-First-Lead per Listing (Median)
**What it measures:** After a listing is published, how long until the first lead arrives?
**Formula:**
```
time_to_first_lead_median = MEDIAN(
  first_lead_created_at - listing_published_at
  WHERE listing has ≥1 lead
)
```
**Source:** Firestore cross-collection join (`listings.publishedAt` + `leads.createdAt`)
**Target:** ≤ 72 hours (median)
**Owner:** Growth
**Notes:** Drives lister retention. If a lister gets no leads in 72h, they churn. Use this to trigger "boost your listing" nudge.

---

## L2 — Health / Guardrail Metrics

### 7. Verified Listing %
**What it measures:** What % of active listings have been verified (identity check or manual review)?
**Formula:**
```
verified_listing_pct = COUNT(listings WHERE verified = true AND status = 'active')
                       / COUNT(listings WHERE status = 'active')
```
**Source:** Firestore `listings` collection
**Target:** ≥ 80%
**Alert threshold:** < 60% (triggers supply quality review)
**Owner:** Trust & Safety

---

### 8. Scam Report Rate
**What it measures:** What % of active listings have been reported in the past 30 days?
**Formula:**
```
scam_report_rate = COUNT(reports in last 30d) / COUNT(active listings) * 100
```
**Source:** Firestore `reports` or `flags` collection
**Target:** ≤ 0.5%
**Alert threshold:** > 1% (triggers immediate supply audit)
**Owner:** Trust & Safety

---

### 9. Listings with ≥3 Photos %
**What it measures:** Supply quality proxy — listings with fewer than 3 photos convert poorly.
**Formula:**
```
photo_quality_pct = COUNT(listings WHERE photos_count >= 3 AND status = 'active')
                    / COUNT(listings WHERE status = 'active')
```
**Source:** Firestore `listings`
**Target:** ≥ 70%
**Owner:** Product (Supply)

---

### 10. Organic Session Share
**What it measures:** What % of sessions come from organic search (not paid, not direct)?
**Formula:**
```
organic_session_share = organic_sessions / total_sessions
```
**Source:** GA4 (channel grouping) or PostHog (`$referring_domain` property)
**Target:** ≥ 35% of sessions (SEO health indicator)
**Owner:** Growth / SEO

---

## L3 — Diagnostic Metrics

### 11. Average Listing Completeness Score
**Formula:** See P1-002 in TASKS.md for scoring breakdown.
**Source:** Computed on listing write/update, stored in Firestore
**Use when:** Investigating low listing_publish_rate or low lead volume per listing.

### 12. Lead Form Abandonment Rate
**Formula:**
```
form_abandon_rate = 1 - (lead_submitted / lead_form_opened)
```
**Source:** PostHog (track `lead_form_opened` event on form mount)
**Use when:** Investigating drop in search_to_lead_rate.

### 13. Search Zero-Results Rate
**Formula:**
```
zero_results_rate = COUNT(search_performed WHERE results_count = 0) / COUNT(search_performed)
```
**Source:** `search_performed` event, `results_count` property
**Use when:** Investigating low search_to_lead_rate (supply gap in certain cities).
**Target:** < 10%

### 14. Listing Page Bounce Rate
**Formula:** Standard bounce rate on listing URLs
**Source:** GA4
**Target:** < 60%
**Use when:** Investigating low listing_view → lead_submitted conversion.

### 15. Mobile vs Desktop Lead Submission Rate
**Formula:** `lead_submitted` events segmented by `$device_type`
**Source:** PostHog
**Use when:** CWV or UX issues suspected on mobile (typically the majority of traffic).

---

## Metric Calculation Schedules

| Metric | Auto-calculated | Manual calc needed |
|---|---|---|
| Sessions → Signup | PostHog funnel (live) | — |
| Profile complete rate | PostHog cohort (live) | — |
| Listing publish rate | PostHog funnel (live) | — |
| Search → Lead rate | PostHog funnel (live) | — |
| Lead reply rate | — | Weekly Firestore query |
| Time-to-first-lead | — | Weekly Firestore query |
| Verified listing % | — | Weekly Firestore query |
| Scam report rate | — | Weekly Firestore query |

### Firestore Query Templates (for weekly manual metrics)

```js
// Lead reply rate (last 7 days)
const leads = await adminDb.collection('leads')
  .where('createdAt', '>=', sevenDaysAgo)
  .get();
const total = leads.size;
const replied = leads.docs.filter(d => d.data().repliedAt).length;
const replyRate = (replied / total * 100).toFixed(1);

// Median time-to-first-lead
const listingsWithLeads = await adminDb.collection('listings')
  .where('firstLeadAt', '!=', null)
  .where('publishedAt', '>=', thirtyDaysAgo)
  .select('publishedAt', 'firstLeadAt')
  .get();
const ttfls = listingsWithLeads.docs
  .map(d => (d.data().firstLeadAt.toMillis() - d.data().publishedAt.toMillis()) / 3_600_000)
  .sort((a, b) => a - b);
const median = ttfls[Math.floor(ttfls.length / 2)];
```

---

## Alerting Thresholds

Set these as PostHog alerts or Slack webhook triggers:

| Metric | Alert condition | Action |
|---|---|---|
| Lead reply rate | < 50% in 24h window | Page supply ops immediately |
| Scam report rate | > 1% rolling 30d | Freeze new listings, audit queue |
| Listing publish rate | < 30% 7d | Check editor for regressions |
| Search zero-results | > 20% | Check search index / city supply |
| `lead_submitted` events | 0 in any 4h window (business hours) | Check lead form for breakage |

# Subletly Growth OS — Growth Playbooks

> Tactical, step-by-step runbooks for each growth lever.
> Each playbook is self-contained: context → trigger → steps → success criteria → rollback.
> Updated: 2026-02-24

---

## Playbook Index

| # | Lever | North Star Impact | Priority |
|---|---|---|---|
| PB-01 | New City Launch | High (new supply + demand) | P0 when entering new market |
| PB-02 | Lister Re-engagement (stalled listings) | High (supply quality) | P1 weekly |
| PB-03 | Renter Re-engagement (searched, no lead) | High (conversion) | P1 weekly |
| PB-04 | Supply Crisis Response (city goes cold) | Critical | On-call |
| PB-05 | Viral / Referral Activation | Medium (CAC reduction) | P2 |
| PB-06 | Lead Form A/B Test Launch | High (conversion) | Before any experiment |
| PB-07 | SEO Content Sprint | Medium (organic growth) | Monthly |
| PB-08 | Trust & Safety Scam Response | Critical (marketplace health) | On-call |
| PB-09 | Weekly Growth Review | Baseline | Every Monday |

---

## PB-01 · New City Launch

**Trigger:** Decision to expand into a new city (e.g., Austin, Denver, Boston).
**Goal:** Reach 10 published listings and 5 lead submissions within 30 days of launch.

### Pre-Launch (2 weeks before)

- [ ] Create city hub page: `/sublets/[city]` with `generateHubMetadata()`
- [ ] Add city to sitemap — no listings yet, still submit for indexation head start
- [ ] Seed 5–10 fake "demand signals" query records in Firestore so listers see demand (or use estimated counts from similar-sized cities)
- [ ] Write city-specific landing page copy (see `docs/seo/CONTENT_TEMPLATES.md`)
- [ ] Create neighborhood sub-pages for the top 3–5 neighborhoods (research via Apartments.com + Google Trends)
- [ ] Set up Google Search Console property for new city pages

### Launch Week

- [ ] Activate lister outreach: post in local Facebook housing groups, university housing boards, Reddit (`r/[city]housing`)
- [ ] Set up Google Ads campaign: `[city] sublet`, `[city] short term rental` — $200/week budget cap
- [ ] Email any existing users in the city (filter by `profile.city` in Firestore)
- [ ] Fire `new_city_launched` analytics event with `{ city, target_listings: 10 }`

### Success Criteria
- 10 published listings within 30 days
- 5 lead submissions within 30 days
- City hub page indexed in GSC within 14 days

### Rollback
- Remove city from sitemap + navigation if supply never materializes (< 3 listings after 30 days)
- Archive hub page (301 redirect to `/sublets`)

---

## PB-02 · Lister Re-engagement (Stalled Listings)

**Trigger:** Weekly job — listers with a listing in `draft` status for > 7 days OR published listings with 0 leads in > 7 days.
**Goal:** Re-activate stalled supply. Target: 20% of stalled listers publish/reactivate within 48h.

### Identifying Stalled Listers

```js
// Stalled drafts (created > 7 days ago, never published):
const stalledDrafts = await adminDb.collection('listings')
  .where('status', '==', 'draft')
  .where('createdAt', '<=', sevenDaysAgo)
  .select('listerUid', 'city', 'createdAt', 'completenessScore')
  .get();

// Cold listings (published > 7 days, 0 leads):
const coldListings = await adminDb.collection('listings')
  .where('status', '==', 'active')
  .where('publishedAt', '<=', sevenDaysAgo)
  .where('leadCount', '==', 0)
  .select('listerUid', 'city', 'slug', 'completenessScore')
  .get();
```

### Re-engagement Steps

1. **Segment by reason:**
   - Low completeness score (< 60) → "Add photos" nudge
   - Complete listing, no leads → "Renters are waiting" demand signal email
   - Draft stuck at specific step → "You left off at [step]" email

2. **Email copy variants:**

   ```
   Subject (stalled draft): "Your listing is almost ready — 2 things missing"
   Body: "Hey [name], you started a listing in [city] but haven't published yet.
   Listings with 3+ photos get 60% more leads. Add photos → [deep link to editor]"
   ```

   ```
   Subject (cold listing): "47 renters searched [neighborhood] this week"
   Body: "Your listing at [address/title] hasn't gotten a lead yet.
   Here's what top listings in [city] have that yours doesn't: [checklist]"
   ```

3. **In-app banner:** Show on dashboard if listing cold for > 5 days.

4. **Track:** `lister_reengagement_email_sent`, `lister_reengagement_email_opened`, `lister_reengagement_cta_clicked`, `listing_published` (outcome)

### Success Criteria
- 20% of emailed listers take action within 48h
- 10% of stalled drafts publish within 7 days of nudge

---

## PB-03 · Renter Re-engagement (Searched, No Lead)

**Trigger:** Renter has `search_performed` events but 0 `lead_submitted` events in past 7 days.
**Goal:** Bring back high-intent renters who left without contacting a lister.

### Identification

```js
// Renters who searched in last 14 days but never submitted a lead:
// (Cross-reference PostHog events OR use Firestore if searches are stored)
const searchedNotConverted = await adminDb.collection('searches')
  .where('createdAt', '>=', fourteenDaysAgo)
  .where('leadSubmitted', '==', false)
  .select('uid', 'city', 'neighborhood', 'priceMax', 'moveInDate')
  .get();
```

### Re-engagement Steps

1. **"New listings match your search" email:**
   - Trigger: new listing published in the renter's saved search area
   - Personalize with: listing photo, price, bedrooms, distance to their search center
   - CTA: "View listing" → deep link to listing page

2. **"Still looking in [city]?" email:**
   - Trigger: 7 days since last search, no lead submitted
   - Show: top 3 matching listings (best quality score in their price range)
   - CTA: "See all listings in [neighborhood]"

3. **Retargeting pixel:**
   - Fire GA4 `view_item` event on `listing_viewed` for Google Ads remarketing
   - Create remarketing audience: visited listing page, no conversion (lead form submit)

4. **Track:** `renter_reengagement_email_sent`, `renter_reengagement_clicked`, `lead_submitted` (outcome)

### Success Criteria
- 15% of re-engaged renters submit a lead within 7 days
- Email open rate > 30%

---

## PB-04 · Supply Crisis Response (City Goes Cold)

**Trigger:** A city drops below 5 active listings OR listing count drops > 30% week-over-week.
**This is an on-call playbook. Page the supply operations contact immediately.**

### Immediate Actions (within 4 hours)

- [ ] Query Firestore: how many listings went inactive/expired this week vs last week?
- [ ] Check scam report rate — did a scam wave trigger listings being removed?
- [ ] Check if any listings bulk-expired (availability date passed): `where('availableTo', '<=', today)`
- [ ] Post in lister Slack/Discord community: "We have high renter demand in [city] right now"
- [ ] Temporarily suppress "no results" state with neighboring-city listings as fallback

### Recovery Actions (within 24 hours)

- [ ] Email all verified listers in the city who published in the past 90 days
- [ ] Offer temporary incentive: "List now — we'll promote your listing to our top 100 renters in [city]"
- [ ] Reach out to property management contacts in the city
- [ ] Consider Google Ads spend increase for supply-side keywords: "[city] list your sublet"

### Prevention
- Set Slack alert when `active_listing_count` drops below 10 in any city
- Track `listing_expired_count` weekly per city

---

## PB-05 · Referral Activation

**Trigger:** When a lister publishes their first listing (event: `listing_published`, `hours_since_started` = first ever listing).
**Goal:** Drive viral supply growth via lister-to-lister referrals.

### Activation Moment

Fire the referral prompt immediately after first successful listing publish:

```tsx
// Show modal after listing_published event fires for the first time:
<ReferralModal
  referralLink={`https://subletly.com/ref/${user.referralCode}`}
  reward="Give a friend $25 off listing fees when they publish"
/>
```

### Referral Flow

1. Lister A shares link → Lister B signs up via `?ref=[code]`
2. Lister B publishes first listing → Lister A credited $25 (or fee waiver)
3. Both events tracked: `referral_signup` + `referral_conversion`

### Measurement
- Referral viral coefficient (k): `referred_signups / referring_listers`
- Target k > 0.3 (each 10 listers brings in 3+ more)

---

## PB-06 · A/B Test Launch Checklist

**Use this every time an experiment from EXPERIMENTS.md moves to "Active".**

### Pre-Launch

- [ ] Hypothesis documented in EXPERIMENTS.md with expected mechanism
- [ ] Sample size calculated (Evans Miller calculator) — never launch underpowered
- [ ] Primary metric + guardrail metrics defined
- [ ] Variant implemented behind feature flag (PostHog feature flag or `cookies.get('variant')`)
- [ ] Both variants tested manually in staging
- [ ] Analytics events confirmed firing for both variants
- [ ] Runtime set (minimum 14 days, full business cycles)
- [ ] Rollback condition defined (e.g., "if reply rate drops below 50% in variant, kill immediately")

### During Experiment

- [ ] Check results at day 7 — do NOT make decisions yet (regression to mean)
- [ ] Monitor guardrail metrics daily
- [ ] Do NOT peek at results with intent to stop early (invalidates p-value)

### Post-Experiment

- [ ] Check sample sizes are met before calling result
- [ ] Calculate p-value — must be < 0.05 to claim significance
- [ ] Document result in EXPERIMENTS.md
- [ ] If winning: ship to 100%, document in CHANGELOG.md
- [ ] If losing: document learnings, propose follow-up experiment

---

## PB-07 · Monthly SEO Content Sprint

**Trigger:** First Monday of each month.
**Goal:** Publish 4–8 pieces of SEO-targeted content that drive organic renter/lister traffic.

### Content Types + Priority Order

1. **New neighborhood hub pages** (highest ROI) — target: 2 per sprint
   - Template: `docs/seo/CONTENT_TEMPLATES.md#neighborhood-hub`
   - Target keywords: `sublets in [neighborhood] [city]`

2. **"Best neighborhoods for sublets in [city]" guides** — target: 1 per sprint
   - Target keyword: `best neighborhoods for sublet in [city]`
   - Format: 1,500–2,000 words, internal links to neighborhood hub pages

3. **Seasonal content** — target: 1 per sprint
   - Summer: "Summer sublets in [city] 2026"
   - Jan: "Short-term rentals near [university] for spring semester"

4. **FAQ/How-to content** — target: 1 per sprint
   - "How does subletting work?"
   - "Sublet vs short-term rental: what's the difference?"
   - "How to list your apartment on Subletly"

### Sprint Process

1. Pull keyword opportunities from KEYWORD_MAP.md (look for KD < 30, volume > 500/mo)
2. Write content using CONTENT_TEMPLATES.md
3. Publish and add to sitemap
4. Add internal links from existing hub pages to new content
5. Submit updated sitemap to GSC
6. Track in CHANGELOG.md

---

## PB-08 · Trust & Safety Scam Response

**Trigger:** Scam report rate > 1% OR manual report of a specific listing.
**This is an on-call playbook.**

### Immediate Actions

- [ ] Pause the flagged listing (set `status: 'under_review'`)
- [ ] Send auto-response to reporting renter confirming receipt
- [ ] Review listing: photo match (Google reverse image search), price vs market, contact info
- [ ] Check lister's other listings and account history

### Escalation

If confirmed scam:
- [ ] Set `status: 'removed_scam'` on listing(s)
- [ ] Disable lister account (`disabled: true` on user document)
- [ ] Email all renters who submitted leads on the listing
- [ ] Track: `listing_removed_scam`, `user_banned`

### Prevention Metrics to Monitor
- New listings with stock photos (can detect via perceptual hash)
- Listings priced > 40% below market for the neighborhood
- Listers with < 5 account age days who publish multiple listings immediately

---

## PB-09 · Weekly Growth Review (Every Monday)

**Duration:** 30 minutes
**Required attendees:** Growth Lead, Product Lead, 1 Engineer

### Agenda

1. **Metrics review** (10 min) — Pull from REPORT.md, update all 8 North Star metrics
2. **Wins** (5 min) — What shipped last week? Any metric moved?
3. **Risks** (5 min) — Any metric regressing? Any production incidents?
4. **Experiment status** (5 min) — Active experiments: sample size met? Any early signals?
5. **Next week prioritization** (5 min) — What P0/P1 ships next week?

### Outputs

- Updated REPORT.md (committed same day)
- TASKS.md statuses updated
- If an experiment concluded: EXPERIMENTS.md updated + CHANGELOG.md entry

# Subletly Growth OS — Weekly KPI Report

> Updated: 2026-02-24 (Week of 2026-02-17)
> Author: Growth OS (automated + manual)

---

## Status: BASELINE WEEK — No Instrumentation Yet

**Critical gap:** Core funnel events are not yet instrumented. All metrics below are targets/benchmarks, not actuals. P0-001 (Analytics Foundation) must ship before Week 2 report has real data.

---

## Week of 2026-02-17

### Top-Line

| Metric | Actual | Target | Status |
|---|---|---|---|
| Weekly Active Sessions | — | — | No data |
| New Signups | — | — | No data |
| New Listings Published | — | — | No data |
| Leads Submitted | — | — | No data |
| Matches (lead → confirmed) | — | — | No data |

### Funnel Conversion Rates

| Funnel Step | Rate | Target | Status |
|---|---|---|---|
| Sessions → Signup | — | ≥ 8% | No data |
| Signup → Profile Complete | — | ≥ 60% | No data |
| Listing Started → Published | — | ≥ 55% | No data |
| Renter Search → Lead Submitted | — | ≥ 4% | No data |
| Lead → Reply Rate | — | ≥ 70% | No data |
| Time-to-First-Lead (median) | — | ≤ 72h | No data |

### Supply Quality

| Metric | Actual | Target | Status |
|---|---|---|---|
| Verified Listing % | — | ≥ 80% | No data |
| Listings with 3+ Photos | — | ≥ 70% | No data |
| Avg Listing Completeness Score | — | ≥ 75 | No data |
| Scam Report Rate | — | ≤ 0.5% | No data |

### SEO / Organic

| Metric | Actual | Target | Status |
|---|---|---|---|
| Indexed Pages (GSC) | — | — | Not submitted |
| Organic Sessions | — | — | No data |
| Avg Position (listing pages) | — | ≤ 20 | No data |
| Sitemap Submitted | No | Yes | BLOCKER |

---

## Wins This Week
- Growth OS framework initialized (docs, task backlog, experiment log, instrumentation schema)
- Feature branch `claude/subletly-growth-os-hE5sn` created
- P0 task list defined with acceptance criteria

## Risks / Blockers
- **CRITICAL:** No analytics instrumentation. Cannot measure any conversion metric.
- **CRITICAL:** No sitemap/robots.txt. Listing pages likely not indexed.
- **HIGH:** No structured data. Missing rich result eligibility.
- **HIGH:** SEO meta tags unverified — may have duplicate/missing titles on listing pages.

## Next Week Goals
1. Ship P0-001 (analytics) → establish all funnel baselines
2. Ship P0-002 (sitemap + robots.txt) → submit to GSC
3. Ship P0-003 (listing meta tags) → validate in GSC URL Inspection

---

## Historical Trend

```
Week         Sessions  Signups  Listings  Leads  Conversion
2026-02-17   —         —        —         —      —
```
_(Populate once P0-001 is live)_

---

## Report Template (weekly cadence)

Each Monday, update:
1. Pull events from PostHog/GA4 for prior 7 days
2. Update all table rows with actuals
3. Add wins (shipped tasks, metric improvements)
4. Add risks (regressions, blockers, dependencies)
5. Update historical trend row
6. Commit with message: `docs(growth): weekly report YYYY-MM-DD`

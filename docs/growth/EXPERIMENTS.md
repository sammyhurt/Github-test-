# Subletly Growth OS — Experiments Log

> Format: Hypothesis → Design → Result → Decision
> Updated: 2026-02-24

---

## Experiment Framework

**Before running any experiment:**
1. Define hypothesis with expected mechanism
2. Set primary metric + guardrail metrics
3. Determine minimum sample size (use [Evan Miller's calculator](https://www.evanmiller.org/ab-testing/sample-size.html))
4. Set runtime (minimum 2 weeks, full business cycles)
5. Define rollback condition

**Significance threshold:** p < 0.05, minimum 80% power
**Minimum detectable effect:** 10% relative lift on primary metric

---

## Active Experiments

_None running yet. Establish baseline metrics (P0-001) before launching experiments._

---

## Planned Experiments

### EXP-001 · Lead Form Length (P0-004 follow-up)
**Status:** Planned — pending baseline data
**Hypothesis:** Reducing lead form from 6 fields to 3 fields (name, email, move-in date) will increase lead submission rate by ≥15% without reducing reply rate.
**Primary metric:** `lead_submitted` / `listing_view` (lead submission rate)
**Guardrail metrics:** `lead_reply_rate` (don't let reply quality drop), `scam_report_rate`
**Design:**
- Control: Current form (all fields)
- Variant: Name + Email + Move-in Date only (message optional, collapsed)
- Split: 50/50 random on `session_id`
- Sample needed: ~1,200 listing views per variant (assuming 3% baseline rate, 15% MDE, 80% power)
**Rollback condition:** Lead reply rate drops below 50% in variant

---

### EXP-002 · Listing Hero Image Position
**Status:** Planned
**Hypothesis:** Moving listing photos above the fold (before price/details) will increase `listing_view_depth` and lead submission rate by ≥10%.
**Primary metric:** Lead submission rate
**Guardrail:** Bounce rate (don't increase it)
**Design:**
- Control: Price + details first, photos below
- Variant: Photo carousel full-width at top, price overlay

---

### EXP-003 · "Renters Waiting" Supply-Side Copy
**Status:** Planned (depends on P1-006)
**Hypothesis:** Showing listers "47 renters searched in Lincoln Park this week" during onboarding increases listing publish rate within 48h by ≥20%.
**Primary metric:** `listing_published` within 48h of signup (lister cohort)
**Guardrail:** Listing quality score (don't incentivize low-quality publishing)
**Design:**
- Control: Generic "List your space" CTA
- Variant: Dynamic demand signal copy + count

---

### EXP-004 · Lead Form CTA Copy
**Status:** Planned
**Hypothesis:** "Request a Showing" converts better than "Send Message" for high-intent renters.
**Primary metric:** Lead submission rate
**Variants:**
- A: "Send Message" (control)
- B: "Request a Showing"
- C: "Check Availability"

---

### EXP-005 · Listing Completeness Score Nudge Timing
**Status:** Planned (depends on P1-002)
**Hypothesis:** Showing the completeness score immediately after first save (vs. only in dashboard) increases listing completion rate by ≥25%.
**Primary metric:** `listing_published` rate
**Guardrail:** Time-to-publish (don't slow it down)

---

## Completed Experiments

_None completed yet._

---

## Experiment Results Template

```
### EXP-XXX · [Name]
**Status:** Complete
**Run dates:** YYYY-MM-DD to YYYY-MM-DD
**Sample size:** N control / N variant
**Result:**
- Control: X% (N events)
- Variant: Y% (N events)
- Lift: +Z% relative
- p-value: 0.0XX (significant / not significant)
**Decision:** Ship / Revert / Iterate
**Learnings:** [What mechanism drove the result? What does this tell us about our users?]
**Follow-up:** [Next experiment or implementation task]
```

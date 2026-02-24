# Waitlist Copy

All headline copy, microcopy, step labels, button text, error messages, and success messaging used in the waitlist system.

---

## Page-level copy (`/waitlist`)

### Hero

**Headline**
> Skip the broker.
> **Get matched.**

**Subheadline**
> Subletly connects furnished rental hosts and renters in Brooklyn — built specifically for travel nurses, healthcare workers, and people on the move.

**Trust signals** (below hero)
- No credit check to join
- Direct host connection
- Bushwick · Williamsburg · Bed-Stuy

**Social proof callout**
> Nurses, PAs, and remote workers are joining from hospitals across NYC. Be first in your neighborhood.

**Badge** (top-right of nav)
> Early Access

**Launch badge**
> Brooklyn · Launching 2025

---

## Form step copy

### Step 1 — Role

**Heading**: Are you a Host or a Renter?

**Subheading**: You can change this anytime in your dashboard later.

| Option | Label | Description |
|---|---|---|
| renter | Renter | I need a furnished room or apartment in Brooklyn. |
| host | Host | I have a furnished space I want to list. |

---

### Step 2 — Renter type (renters only)

**Heading**: What best describes you?

**Subheading**: This helps us match you with the right hosts and prioritize your spot.

| Option | Label | Sublabel |
|---|---|---|
| travel_nurse | Travel Nurse | On assignment, typically 13-week contracts |
| healthcare_worker | Healthcare Worker | Doctor, PA, tech, therapist, or allied health |
| student | Student | Grad, med school, or professional program |
| professional | Professional | Relocating, remote worker, or short-term stay |
| other | Other | I'm looking for a furnished place for another reason |

---

### Step 3 — Neighborhood

**Heading (renter)**: Which neighborhoods are you open to?

**Subheading (renter)**: Select all that work for you — we match based on overlap.

**Heading (host)**: Where is your listing located?

**Subheading (host)**: Select all that apply.

| Option | Label | Vibe tag |
|---|---|---|
| bushwick | Bushwick | Artists, murals, late nights |
| williamsburg | Williamsburg | Cafés, rooftops, L train |
| bed_stuy | Bed-Stuy | Tree-lined blocks, local gems |
| other_nyc | Other NYC | Open to other Brooklyn or NYC neighborhoods |

**Selection counter** (when ≥ 1 selected)
> {n} neighborhood{s} selected

---

### Step 4 — Details

**Heading**: A little about you

**Subheading (renter)**: We use this to match you with available listings.

**Subheading (host)**: We use this to match you with qualified renters.

**Field labels and placeholders**

| Field | Label | Placeholder | Note |
|---|---|---|---|
| name | Full name | Ada Lovelace | Required |
| email | Email | ada@example.com | Required |
| phone | Phone number | +1 (555) 000-0000 | Optional |
| moveInDate | Target move-in date | Date picker | Optional — renters only |
| budgetMin | Monthly budget range (min) | 1500 | Optional — renters only |
| budgetMax | Monthly budget range (max) | 2500 | Optional — renters only |
| unitType | Unit type | Button group: Studio / 1 BR / 2 BR / 3 BR+ | Optional — hosts only |
| availableDate | Available from | Date picker | Optional — hosts only |
| notes (renter) | Anything else we should know? | e.g. I have a cat, need a desk, prefer ground floor… | Optional |
| notes (host) | Anything else we should know? | e.g. Pet-friendly, parking available, quiet building… | Optional |
| referralSource | How did you hear about Subletly? | Select an option | Optional |

**Phone field helper text**
> For faster match notifications only — no spam.

**Notes character counter**
> {n}/500

**Referral source options**
- Social media
- Friend or colleague
- Google search
- Nursing / healthcare community
- Reddit
- Other

---

### Step 5 — Review & consent

**Heading**: Almost there!

**Subheading**: Review your details and confirm below.

**Summary card heading**: Your summary

**Trust badge copy**
> Your information is kept private. We never sell your data or share it with third parties without your consent.

**Consent checkbox copy**
> I agree to Subletly's **Terms of Service** and **Privacy Policy**. I consent to receive waitlist updates and match notifications via email.

---

### Button labels

| Context | Label |
|---|---|
| Advance to next step | Continue |
| Submit the form | Join the waitlist |
| Submitting state | Submitting… |
| Back navigation | Back |

---

## Success screen

**Heading**: You're on the list, {firstName}!

**Body (renter)**
> We'll reach out as soon as there's a listing that fits your profile. The best matches get priority access.

**Body (host)**
> We'll notify you as soon as renters matching your listing are ready. Thank you for being an early host!

**Position badge**
> You're **#{position}** on the waitlist

**Position badge sub-copy**
> Move up by sharing with friends

**"What happens next" items**
1. Check your inbox — we sent a confirmation email.
2. We'll match you manually once we have a good fit.
3. Highly-rated profiles get early access — fill yours out fully.

**Share CTA**
> Share with a colleague

**Footer note**
> Questions? Reply to your confirmation email.

---

## Error messages

### Form validation

| Field | Error |
|---|---|
| role | Please select your role. |
| renterType | Please tell us what best describes you. |
| neighborhoods | Please select at least one neighborhood. |
| name | Please enter your full name. |
| email | Please enter a valid email address. |
| phone | Please enter a valid phone number. |
| budgetMin > budgetMax | Minimum budget cannot exceed the maximum. |
| consent | You must agree to the terms to join the waitlist. |

### API errors

| Status | User-facing message |
|---|---|
| 429 | Too many requests. Please wait a moment before trying again. |
| 422 | {first Zod error message} |
| Network error | Network error — please check your connection and try again. |
| Generic | Something went wrong. Please try again. |

---

## Admin panel copy

**Page title**: Waitlist Admin

**Login heading**: Subletly Admin

**Login subheading**: Enter the admin password to continue.

**Login button**: Sign in · Checking…

**Table empty state**
> No submissions found
> Try adjusting your filters or check back later.

**Footer note**
> Showing {n} non-spam submission{s}. IP addresses and spam submissions are excluded from this view and the CSV export.

---

## Global footer copy

> Free to join · No spam · Unsubscribe anytime

**Footer links**: Privacy Policy · Terms of Service

**Contact**
> Questions? Email hello@subletly.com

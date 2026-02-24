# Subletly Growth OS — Content Templates

> Copy-paste templates for every repeatable content type.
> Fill in `[BRACKETS]` with real data before publishing.
> Updated: 2026-02-24

---

## Template Index

1. [Listing Page (auto-generated)](#1-listing-page)
2. [City Hub Page](#2-city-hub-page)
3. [Neighborhood Hub Page](#3-neighborhood-hub-page)
4. [University Sub-page](#4-university-neighborhood-sub-page)
5. [Blog: "Best Neighborhoods for Sublets in [City]"](#5-blog--best-neighborhoods-guide)
6. [Blog: "How to Sublet Your Apartment in [City]"](#6-blog--lister-how-to-guide)
7. [FAQ Page Template](#7-faq-page)
8. [Email: Lead Received (to lister)](#8-email-lead-received)
9. [Email: Lister Onboarding Sequence](#9-email-lister-onboarding-sequence)
10. [Email: Renter Re-engagement](#10-email-renter-re-engagement)

---

## 1. Listing Page

> Auto-generated from Firestore data. These are the dynamic copy formulas.

### `<title>` tag formula
```
{bedrooms}BR {furnished?'Furnished ':''} Sublet in {neighborhood}, {city} — from ${price}/mo | Subletly
```
Examples:
- `2BR Furnished Sublet in Lincoln Park, Chicago — from $1,850/mo | Subletly`
- `Studio Sublet in Williamsburg, New York — from $2,100/mo | Subletly`

### `<meta description>` formula
```
{bedrooms}-bedroom {furnished?'furnished ':''} sublet in {neighborhood}, {city}.
Available {availableFrom} to {availableTo}. ${price}/mo.
{photos_count}+ photos · Verified listing · Message the lister on Subletly.
```
Max 155 chars. Strip if no dates. Example:
```
2-bedroom furnished sublet in Lincoln Park, Chicago. Available Jun 1 – Aug 31.
$1,850/mo. 6+ photos · Verified listing · Message the lister on Subletly.
```

### `<h1>` formula
```
{bedrooms}BR {furnished?'Furnished ':''}Sublet in {neighborhood} — ${price}/mo
```

### Listing description prompt (for AI-assisted descriptions)
```
Write a 150-200 word apartment description for a sublet listing.
Facts: {bedrooms} bedrooms, {bathrooms} bathrooms, ${price}/month,
located in {neighborhood}, {city}. Available {dates}.
Amenities: {amenities_list}.
Tone: friendly, trustworthy, specific. No fluff. Start with the strongest feature.
Do NOT include: contact info, external links, pricing negotiation language.
```

---

## 2. City Hub Page

> Page: `/sublets/[city]`
> Target keyword: `sublets in [city]`

### `<title>`
```
Sublets in [City] ([N] listings available) | Subletly
```

### `<meta description>`
```
Browse [N] verified sublets in [City]. Furnished and unfurnished rooms, studios,
and apartments for $[min]–$[max]/mo. Find your perfect short-term rental on Subletly.
```

### Page Copy Template

```markdown
# Sublets in [City]

Browse [N] verified sublets across [City]'s top neighborhoods.
Whether you're relocating, between leases, or spending a semester in [City],
Subletly connects you directly with verified listers — no middleman fees.

## Popular Neighborhoods in [City]

- **[Neighborhood 1]** — [2-sentence description. Price range. Vibe.]
- **[Neighborhood 2]** — [2-sentence description. Price range. Vibe.]
- **[Neighborhood 3]** — [2-sentence description. Price range. Vibe.]
[link each to /sublets/[city]/[neighborhood]]

## About Subletting in [City]

[2-3 sentences: why [City] is a sublet market — universities, job market,
transient population, typical lease length, seasonal patterns.]

Typical sublet prices in [City] range from **$[low]/mo** (shared housing)
to **$[high]/mo** (furnished 2BR in prime neighborhoods).

## Frequently Asked Questions

**Is subletting legal in [City/State]?**
[1-2 sentences on local sublet laws. Link to state-specific blog post.]

**How long are typical sublets in [City]?**
Most sublets in [City] run 1–6 months, with peak season in [peak months]
driven by [university move-ins / summer / job market].

**How do I find a verified sublet in [City]?**
All listings on Subletly are [verification process description].
Look for the "Verified" badge on each listing.

## List Your Space in [City]

Have a spare room or apartment in [City]? [N renters] searched [City]
this week. [CTA button: "List your space — it's free"]
```

---

## 3. Neighborhood Hub Page

> Page: `/sublets/[city]/[neighborhood]`
> Target keyword: `sublets [neighborhood] [city]`

### `<title>`
```
Sublets in [Neighborhood], [City] ([N] listings) | Subletly
```

### `<meta description>`
```
Find [N] verified sublets in [Neighborhood], [City]. Furnished rooms and
apartments from $[min]–$[max]/mo. Short-term leases available. Browse on Subletly.
```

### Page Copy Template

```markdown
# Sublets in [Neighborhood], [City]

[N] verified short-term sublets available in [Neighborhood].

## About [Neighborhood]

[3-4 sentences: neighborhood character, transit access, major landmarks,
walkability score, typical renter profile — students, young professionals, etc.
Include 2-3 specifics that a renter would care about: nearest L/subway stop,
grocery stores, major employers, universities nearby.]

**Average sublet price:** $[avg]/mo
**Most common: ** [bedrooms type] | [furnished/unfurnished]
**Typical lease length:** [N] months

## Nearby Neighborhoods

- [Adjacent neighborhood 1] → [link to hub page]
- [Adjacent neighborhood 2] → [link to hub page]

## Getting Around [Neighborhood]

[2 sentences on transit. Bus/subway lines. Walkability. Bike infrastructure.]

## [Neighborhood] Sublet FAQs

**What's the average rent for a sublet in [Neighborhood]?**
Sublets in [Neighborhood] typically range from $[min] to $[max]/mo for a
[most common size] apartment. [Context: how it compares to city average.]

**Are there furnished sublets in [Neighborhood]?**
[X]% of sublets in [Neighborhood] on Subletly are listed as furnished.

**How close is [Neighborhood] to [nearest university]?**
[Neighborhood] is [N] minutes from [university] by [transit].
```

---

## 4. University Neighborhood Sub-page

> Add as a section to the neighborhood hub page OR as a standalone landing page
> for high-volume university keywords.

### Section heading + copy

```markdown
## Sublets Near [University Name]

[Neighborhood] is [N]-minute walk / [N]-stop subway ride from [University]'s
main campus, making it one of the most popular neighborhoods for
[University] students, postdocs, and visiting faculty.

**Best times to sublet near [University]:**
- **August–September:** Fall semester move-in. High demand, move fast.
- **January:** Spring semester. Slightly less competitive.
- **May–June:** Summer sublets. Peak for short 2–3 month stays.

**Typical sublet profile near [University]:**
- Price: $[min]–$[max]/mo
- Duration: [N]–[N] months
- Type: Furnished [studio/1BR] is most common

[Show listings filtered to neighborhood + sorted by proximity to university]
```

---

## 5. Blog — "Best Neighborhoods for Sublets in [City]"

> Target keyword: `best neighborhoods for sublet in [city]`
> Format: 1,500–2,000 words | 6–8 neighborhoods | publish 8 weeks before peak season

### Title variations
- `Best Neighborhoods for a Sublet in [City]: [Year] Guide`
- `Where to Find Sublets in [City]: The [Year] Neighborhood Guide`
- `[City] Sublet Guide: The [N] Best Neighborhoods for Short-Term Rentals`

### Template Structure

```markdown
# Best Neighborhoods for Sublets in [City]: [Year] Guide

[Intro paragraph: Why [City] is a great sublet market. Who this guide is for
(students/professionals/travelers). What you'll find below. 80–100 words.]

## Quick Comparison

| Neighborhood | Avg Price | Best For | Vibe |
|---|---|---|---|
| [Neighborhood 1] | $X/mo | Students | Lively |
| [Neighborhood 2] | $X/mo | Professionals | Upscale |
[4-6 more rows]

## [Neighborhood 1]: [Tagline]

[150-200 words: character, transit, price range, pros/cons for subletters,
link to neighborhood hub page, 1-2 example listings if available]

**Typical sublet price:** $X–$X/mo
**Best for:** [profile]
**Transit:** [lines]

[Repeat for each neighborhood]

## How to Find a Sublet in [City]

[100-word section on process: search Subletly, filter by neighborhood, message
directly, verified listings, etc. Include CTA to search page.]

## FAQ

**What's the cheapest neighborhood to sublet in [City]?**
**What neighborhoods are best for [City] students?**
**How far in advance should I look for a [City] sublet?**
```

---

## 6. Blog — "How to Sublet Your Apartment in [City]"

> Target keyword: `how to sublet my apartment [city]` / `sublet my apartment`
> Format: 1,000–1,500 words | evergreen | supply-side content

### Template Structure

```markdown
# How to Sublet Your Apartment in [City]: A Step-by-Step Guide

[Intro: when subletting makes sense — travel, internship, temporary move.
Mention legal requirements briefly. 60-80 words.]

## Step 1: Check Your Lease

[150 words: where to find subletting clauses, common restrictions,
how to ask your landlord for permission. Link to subletting laws blog.]

## Step 2: Know [State] Subletting Laws

[100 words: key legal points for [state/city]. NOT legal advice disclaimer.]

## Step 3: Price Your Sublet Correctly

[100 words: how to price — check comparable listings, consider
furnished premium, utilities, parking. Link to [city] hub page to benchmark.]

## Step 4: Create a Great Listing

[100 words: photos (minimum 3, natural light), description must-haves,
accurate availability dates, pricing. Link to listing creation page.]

## Step 5: Screen Your Subletters

[100 words: what to look for, quick call, references, deposit.]

## Step 6: Use a Sublet Agreement

[100 words: why a written agreement matters, what to include.
Link to free sublet agreement template download or resource.]

## List Your Sublet on Subletly — It's Free

[50-word CTA section. Benefits: verified renters, messaging, no middleman.]
```

---

## 7. FAQ Page

> Page: `/faq`
> Implements FAQ schema for rich results.

### Template Questions

```markdown
## For Renters

**What is a sublet?**
A sublet (or sublease) is when a current tenant rents their apartment to
another person (the subletter) for a portion of their lease term.

**How is a sublet different from Airbnb?**
Sublets are typically longer-term (1–6 months) and priced at or below market
rent. Airbnb is optimized for nightly stays. Sublets are priced per month and
usually include a short written agreement.

**Are Subletly listings verified?**
[Describe verification process]. Listings with a "Verified" badge have had their
lister identity confirmed.

**How do I contact a lister?**
Send a message directly through the listing page. No phone number or email
required until you're both comfortable.

**What happens if the lister doesn't reply?**
[Describe SLA and follow-up process].

## For Listers

**Is it free to list on Subletly?**
[Describe pricing model].

**Can I sublet my apartment if my lease says I can't?**
You should always review your lease and, if necessary, get written permission
from your landlord before subletting. Subletly recommends consulting a local
tenant rights organization if you're unsure.

**How long does it take to get my first lead?**
Most listings receive their first inquiry within [N] hours of publishing.
Listings with 3+ photos and a complete description typically get leads faster.

**Is my personal information visible to renters?**
Your name is visible on your listing. Your email and phone are only shared
after you choose to reply to an inquiry.
```

---

## 8. Email: Lead Received (to Lister)

**Trigger:** `lead_submitted` event fires
**Subject:** `[Renter Name] wants to sublet your place in [Neighborhood]`

```
Hi [Lister Name],

You have a new inquiry from [Renter Name] about your listing at [Listing Title].

They're looking to move in: [requested_move_in]

[Renter Name]'s message:
"[message]"

Reply now → [deep link to conversation in app]

Most renters hear back within 24 hours. The faster you reply, the more likely
you are to secure this subletter.

— The Subletly Team

---
Manage your listing: [link]
Turn off email notifications: [unsubscribe link]
```

---

## 9. Email: Lister Onboarding Sequence

### Email 1 — Immediate (T+0): "Start your listing"
**Subject:** `List your space — takes 5 minutes`

```
Hi [Name],

Welcome to Subletly. [N] renters searched [City] this week — your space
could be exactly what they're looking for.

→ Start your listing [deep link to editor]

It takes about 5 minutes. The only things you need:
✓ 3+ photos (phone photos work great)
✓ Your price and available dates
✓ A short description

Already started? Pick up where you left off → [link]

— Subletly
```

### Email 2 — 24h after signup if not published (T+24h)
**Subject:** `One tip: listings with photos get 60% more leads`

```
Hi [Name],

Quick tip while you're setting up your listing:

Listings with 3 or more photos get 60% more inquiries.

You don't need a photographer. Phone photos in natural light work great.
Just open the curtains, tidy up, and take shots of: living room, bedroom,
bathroom, kitchen, and any notable features.

Add photos to your listing → [deep link to editor/photos step]

— Subletly
```

### Email 3 — 72h if not published (T+72h)
**Subject:** `[N] renters are actively searching in [Neighborhood]`

```
Hi [Name],

[N] renters searched [Neighborhood] in [City] this week on Subletly.

If you publish your listing today, you'll appear in their results.

Your listing is [X]% complete. Here's what's missing:
[dynamic checklist: photos / description / dates / price]

Complete and publish → [deep link]

Questions? Reply to this email — we read everything.

— The Subletly Team
```

---

## 10. Email: Renter Re-engagement

**Trigger:** Renter searched but submitted 0 leads in 7 days
**Subject:** `Still looking in [City]? [N] new listings this week.`

```
Hi [Name],

We noticed you searched for sublets in [City] recently but haven't found
the right match yet.

[N] new listings were added in [City] this week. Here are the best matches
for your search:

[Listing 1 card: photo, title, price, neighborhood, CTA]
[Listing 2 card]
[Listing 3 card]

See all [N] listings in [City] → [search link with saved params]

— Subletly

---
Update your search preferences: [link]
Unsubscribe: [link]
```

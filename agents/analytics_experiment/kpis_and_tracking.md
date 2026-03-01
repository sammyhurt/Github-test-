# Wavyarnold — KPIs, Event Tracking & Experimentation

**Rule:** Every metric ties to a goal. Every test has a hypothesis. Measure conversions, not vibes.

---

## Primary Goals → KPIs

| Goal | KPI | Tracking Source |
|------|-----|----------------|
| Increase streams | Monthly stream count | Spotify for Artists, Apple Music Analytics |
| Increase followers | Followers by platform (Spotify, IG, TikTok) | Platform native dashboards |
| Consistent bookings | # of confirmed bookings per quarter | CRM (manual) |
| Email/SMS subscribers | Total active list size, monthly new sign-ups | Email platform (Mailchimp, Klaviyo, etc.) |

---

## KPI Definitions

### Streams
- **What counts:** A stream = 30+ seconds played (Spotify standard)
- **Target (Month 1–3):** Establish baseline
- **Target (Month 4–6):** 10% month-over-month growth
- **Watch:** Save rate (saves / plays ratio) — indicates real fans vs. passive listeners

### Followers
| Platform | Metric | Notes |
|----------|--------|-------|
| Spotify | Follower count | Monthly listener ≠ follower — track both |
| Instagram | Follower count + Reach | Reach matters more than follower count |
| TikTok | Follower count + Profile visits | Profile visits signal intent |
| YouTube | Subscribers + Watch time | Watch time = content quality signal |

### Bookings
- **What counts:** Confirmed paid or agreed booking (not inquiry)
- **Target:** At least 2 booked shows per month within 90 days
- **Track:** Outreach → inquiry → confirmed → completed (CRM stages)

### Email/SMS List
- **What counts:** Active, non-bounced subscribers who have not unsubscribed
- **Target (Month 1):** 100 subscribers
- **Target (Month 3):** 300 subscribers
- **Target (Month 6):** 750 subscribers
- **Watch:** Open rate (email), click rate, unsubscribe rate

---

## Event Tracking Plan (Website)

### Events to Track (Google Analytics 4 / Plausible)

| Event Name | Trigger | Goal |
|------------|---------|------|
| `stream_click` | Click on any streaming platform link | Stream conversion |
| `join_form_submit` | Email/SMS form submission on /join | List growth |
| `contact_form_submit` | Form submission on /contact | Booking inquiry |
| `show_ticket_click` | Click on ticket/RSVP link from /shows | Booking conversion |
| `music_page_view` | Page view on /music or /music/[slug] | Engagement depth |
| `lyrics_page_view` | Page view on /lyrics/[slug] | SEO content engagement |
| `blog_scroll_50` | User scrolls 50% of blog post | Content engagement |
| `blog_scroll_100` | User scrolls to bottom of blog post | Content quality signal |
| `outbound_link_click` | Click to any external platform | Traffic routing |

### Funnel View

```
Visitor lands on site
    ↓
Views music / blog / lyrics page (engagement)
    ↓
Clicks streaming link (stream_click) — OR
Submits /join form (join_form_submit) — OR
Clicks show ticket link (show_ticket_click)
```

---

## A/B Test Backlog

Each test requires: hypothesis, variant, success metric, minimum sample size.

### Test 1 — Homepage Hero CTA
**Hypothesis:** "Join the list" converts better than "Stream Now" for first-time visitors who don't know the artist yet.
**Control:** Hero CTA = "Stream Now"
**Variant:** Hero CTA = "Get in First — Join the List"
**Metric:** `join_form_submit` conversion rate
**Sample needed:** 500 unique homepage visitors per variant

---

### Test 2 — /join Page Headline
**Hypothesis:** A personal, direct headline outperforms a benefit-list headline.
**Control:** "New music. Show dates. Nothing you didn't sign up for."
**Variant:** "Get in before everyone else."
**Metric:** Form submission rate
**Sample needed:** 400 unique /join visitors per variant

---

### Test 3 — Email Subject Line Format
**Hypothesis:** Direct/plain subject lines outperform curiosity-gap subject lines for artist newsletters.
**Control:** "New one's out. Here's the story."
**Variant:** "You need to hear this."
**Metric:** Open rate
**Sample needed:** 300 subscribers per variant

---

### Test 4 — TikTok Hook Format
**Hypothesis:** Story-opening hooks ("I almost didn't drop this") outperform statement hooks ("Listen to the first 20 seconds") in watch time.
**Control:** Statement hook format
**Variant:** Story hook format
**Metric:** Average watch percentage (>50%), follows per post
**Sample needed:** 5 posts per format (compare averages)

---

## Weekly Reporting Template

```
## Wavyarnold — Weekly Report | Week of [Date]

### Streams
- Total this week: [X]
- vs. last week: [+/- X] ([+/- X%])
- Save rate: [X%]

### Followers
| Platform | Total | Change This Week |
|----------|-------|-----------------|
| Spotify  | X     | +/- X |
| Instagram | X    | +/- X |
| TikTok   | X     | +/- X |

### Email/SMS List
- Total active: [X]
- New this week: [X]
- Unsubscribes this week: [X]
- Open rate (last send): [X%]

### Website
- Sessions: [X]
- Top page: [page name]
- stream_click events: [X]
- join_form_submit events: [X]

### Bookings / Outreach
- Outreach sent this week: [X]
- Responses received: [X]
- Confirmed bookings: [X]

### This Week's Observation
[1–2 sentences. What worked? What didn't? What to test next week?]

### Next Week's Priority
[1 action item — specific, not vague]
```

---

## Dashboard Setup Checklist

- [ ] Google Analytics 4 (or Plausible) installed on website
- [ ] All events from tracking plan implemented and verified
- [ ] Spotify for Artists connected
- [ ] Email platform set up (Mailchimp / Klaviyo / ConvertKit)
- [ ] Weekly report filled every Monday
- [ ] CRM updated after every outreach action
- [ ] A/B tests documented before launching (hypothesis first)

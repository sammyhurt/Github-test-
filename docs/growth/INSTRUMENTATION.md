# Subletly Growth OS — Event Instrumentation Schema

> Updated: 2026-02-24
> Analytics target: PostHog (primary) + GA4 (secondary/backup)

---

## Implementation Pattern

All events flow through a single wrapper to keep analytics providers swappable:

```ts
// src/lib/analytics.ts
type EventProperties = Record<string, string | number | boolean | null>;

export function track(event: string, properties?: EventProperties) {
  // PostHog
  if (typeof window !== 'undefined' && window.posthog) {
    window.posthog.capture(event, properties);
  }
  // GA4
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event, properties);
  }
}

export function identify(userId: string, traits?: EventProperties) {
  if (typeof window !== 'undefined' && window.posthog) {
    window.posthog.identify(userId, traits);
  }
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('set', 'user_properties', { user_id: userId, ...traits });
  }
}
```

---

## Core Funnel Events (P0 — must ship first)

### 1. `user_signed_up`
Fired immediately after successful registration.

| Property | Type | Values | Required |
|---|---|---|---|
| `user_id` | string | UUID | Yes |
| `role` | string | `renter` \| `lister` \| `both` | Yes |
| `signup_method` | string | `email` \| `google` \| `apple` | Yes |
| `referral_code` | string | referral code if present | No |
| `created_at` | string | ISO 8601 | Yes |

---

### 2. `user_identified`
Fired on every page load when user is authenticated. Powers cohort analysis.

| Property | Type | Values | Required |
|---|---|---|---|
| `user_id` | string | UUID | Yes |
| `role` | string | `renter` \| `lister` \| `both` | Yes |
| `profile_complete` | boolean | — | Yes |
| `listing_count` | number | published listings | Yes (listers) |
| `days_since_signup` | number | — | Yes |

---

### 3. `profile_completed`
Fired when user completes their profile (photo + bio + contact).

| Property | Type | Values | Required |
|---|---|---|---|
| `user_id` | string | UUID | Yes |
| `role` | string | — | Yes |
| `days_to_complete` | number | days since signup | Yes |
| `completion_source` | string | `nudge_email` \| `nudge_banner` \| `organic` | Yes |

---

### 4. `listing_started`
Fired when lister begins creating a listing (first field touched or "Create Listing" clicked).

| Property | Type | Values | Required |
|---|---|---|---|
| `listing_id` | string | UUID (draft) | Yes |
| `lister_id` | string | UUID | Yes |
| `city` | string | — | Yes |

---

### 5. `listing_published`
Fired when lister publishes a listing (status changes to `active`).

| Property | Type | Values | Required |
|---|---|---|---|
| `listing_id` | string | UUID | Yes |
| `lister_id` | string | UUID | Yes |
| `city` | string | — | Yes |
| `neighborhood` | string | — | No |
| `price_monthly` | number | USD | Yes |
| `bedrooms` | number | — | Yes |
| `photos_count` | number | — | Yes |
| `quality_score` | number | 0-100 | Yes |
| `hours_since_started` | number | — | Yes |

---

### 6. `listing_viewed`
Fired when a renter views a listing detail page.

| Property | Type | Values | Required |
|---|---|---|---|
| `listing_id` | string | UUID | Yes |
| `lister_id` | string | UUID | Yes |
| `viewer_id` | string | UUID or null (anon) | No |
| `city` | string | — | Yes |
| `neighborhood` | string | — | No |
| `price_monthly` | number | USD | Yes |
| `traffic_source` | string | `organic` \| `direct` \| `referral` \| `email` \| `paid` | Yes |
| `search_query_id` | string | if from search results | No |

---

### 7. `lead_submitted`
Fired when renter submits a lead/inquiry on a listing.

| Property | Type | Values | Required |
|---|---|---|---|
| `lead_id` | string | UUID | Yes |
| `listing_id` | string | UUID | Yes |
| `lister_id` | string | UUID | Yes |
| `renter_id` | string | UUID | Yes |
| `requested_move_in` | string | ISO 8601 date | Yes |
| `form_fields_count` | number | fields visible in form | Yes |
| `time_on_page_seconds` | number | before submit | Yes |

---

### 8. `lead_replied`
Fired when lister replies to a lead (first reply).

| Property | Type | Values | Required |
|---|---|---|---|
| `lead_id` | string | UUID | Yes |
| `listing_id` | string | UUID | Yes |
| `lister_id` | string | UUID | Yes |
| `renter_id` | string | UUID | Yes |
| `hours_to_reply` | number | — | Yes |
| `reply_channel` | string | `in_app` \| `email` \| `sms` | Yes |

---

## Secondary Events (P1)

### `search_performed`
| Property | Type | Required |
|---|---|---|
| `query_id` | string | Yes |
| `city` | string | Yes |
| `neighborhood` | string | No |
| `price_min` | number | No |
| `price_max` | number | No |
| `move_in_date` | string | No |
| `bedrooms` | number | No |
| `results_count` | number | Yes |

### `search_result_clicked`
| Property | Type | Required |
|---|---|---|
| `query_id` | string | Yes |
| `listing_id` | string | Yes |
| `position` | number | rank in results (1-indexed) | Yes |

### `listing_quality_score_viewed`
| Property | Type | Required |
|---|---|---|
| `listing_id` | string | Yes |
| `quality_score` | number | Yes |
| `missing_fields` | string[] | e.g. `["photos", "amenities"]` | Yes |

### `profile_completion_nudge_shown`
| Property | Type | Required |
|---|---|---|
| `user_id` | string | Yes |
| `nudge_type` | string | `email` \| `banner` | Yes |
| `days_since_signup` | number | Yes |

### `profile_completion_nudge_clicked`
| Property | Type | Required |
|---|---|---|
| `user_id` | string | Yes |
| `nudge_type` | string | Yes |

---

## P2 Events (Retention + Referral)

### `referral_link_copied`
### `referral_signup` (properties: `referrer_id`, `referee_id`)
### `referral_conversion` (properties: `referrer_id`, `referee_id`, `listing_id`)
### `saved_search_created` (properties: `user_id`, `city`, `neighborhood`, `price_max`, `bedrooms`)
### `saved_search_alert_sent` (properties: `user_id`, `listing_id`, `search_id`)
### `saved_search_alert_clicked` (properties: `user_id`, `listing_id`, `search_id`)

---

## Key Funnels to Build in PostHog / GA4

### Renter Acquisition Funnel
```
page_view (listing page)
  → listing_viewed
  → lead_submitted
```

### Lister Onboarding Funnel
```
user_signed_up (role=lister)
  → listing_started
  → listing_published
```

### Full Conversion Funnel
```
user_signed_up
  → profile_completed
  → search_performed
  → listing_viewed
  → lead_submitted
  → lead_replied
```

---

## Validation Checklist

Before marking instrumentation complete:
- [ ] Use PostHog Live Events to confirm each event fires once per action (no double-fire)
- [ ] Confirm `user_id` is populated on all events (not null for logged-in users)
- [ ] Confirm no PII in event properties (no email, phone, full address as flat strings)
- [ ] Funnel built in PostHog showing correct step-through rates
- [ ] GA4 conversion goals set for `lead_submitted` and `listing_published`

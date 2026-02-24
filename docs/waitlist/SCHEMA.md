# Waitlist Schema

Field definitions, types, constraints, and the rationale behind each field.

---

## Database table: `waitlist_submissions`

```sql
CREATE TABLE waitlist_submissions (
  id              TEXT    PRIMARY KEY,
  created_at      TEXT    NOT NULL,
  role            TEXT    NOT NULL,
  renter_type     TEXT,
  neighborhoods   TEXT    NOT NULL,
  name            TEXT    NOT NULL,
  email           TEXT    NOT NULL,
  phone           TEXT,
  move_in_date    TEXT,
  budget_min      INTEGER,
  budget_max      INTEGER,
  unit_type       TEXT,
  available_date  TEXT,
  notes           TEXT,
  referral_source TEXT,
  consent         INTEGER NOT NULL DEFAULT 1,
  ip_address      TEXT,
  is_spam         INTEGER NOT NULL DEFAULT 0
);
```

---

## Field definitions

### `id`
- **Type**: `TEXT` (UUID v4)
- **Required**: Yes
- **Rationale**: Stable unique identifier for cross-referencing with external CRMs or Firebase documents when migrating.

---

### `created_at`
- **Type**: `TEXT` (ISO 8601 datetime, e.g. `2025-09-14T18:32:00.000Z`)
- **Required**: Yes
- **Rationale**: Audit trail for consent logging. Enables time-based analysis (signups per day/week, conversion velocity).

---

### `role`
- **Type**: `TEXT`
- **Values**: `host` | `renter`
- **Required**: Yes
- **Rationale**: Primary segmentation dimension. Drives matching logic and determines which subsequent fields are shown (renter type, budget) vs. host-specific fields (unit type, available date). Indexed.

---

### `renter_type`
- **Type**: `TEXT` | `NULL`
- **Values**: `travel_nurse` | `healthcare_worker` | `student` | `professional` | `other`
- **Required**: Only when `role = 'renter'`
- **Rationale**: High-signal field for supply/demand matching. Travel nurses have predictable contract lengths (13 weeks) and arrive in cohorts. Healthcare workers have stable income but unpredictable schedules. Students have semester-aligned needs. Enables targeted outreach per segment.

---

### `neighborhoods`
- **Type**: `TEXT` (JSON array of strings)
- **Values**: Array of `bushwick` | `williamsburg` | `bed_stuy` | `other_nyc`
- **Required**: Yes (minimum 1)
- **Rationale**: Core matching dimension. Multi-select because renters are often flexible across 2–3 adjacent neighborhoods. Stored as JSON for schema simplicity; parse with `JSON.parse()`. Indexed via LIKE for filtering in the admin panel.

---

### `name`
- **Type**: `TEXT`
- **Constraints**: 2–80 characters, trimmed
- **Required**: Yes
- **Rationale**: Necessary for personalized outreach. Full name preferred over first name only to distinguish common names.

---

### `email`
- **Type**: `TEXT`
- **Constraints**: Valid email format, max 254 chars, stored lowercase
- **Required**: Yes
- **Rationale**: Primary contact channel. Normalized to lowercase for deduplication. Indexed for duplicate checks.

---

### `phone`
- **Type**: `TEXT` | `NULL`
- **Constraints**: 7–20 characters, digits/spaces/dashes/parens/plus
- **Required**: No
- **Rationale**: Optional secondary contact for urgent match notifications (SMS). Not required to keep friction low. Travel nurses in particular are often reachable faster via text.

---

### `move_in_date`
- **Type**: `TEXT` | `NULL` (ISO date string, e.g. `2025-10-01`)
- **Required**: No (renters only)
- **Rationale**: Critical for inventory planning. Hosts need to know when renters are available to move. Enables date-range matching and urgency scoring (sooner = higher priority).

---

### `budget_min` / `budget_max`
- **Type**: `INTEGER` | `NULL` (monthly USD)
- **Required**: No (renters only)
- **Constraints**: 0–20,000; min ≤ max enforced by Zod
- **Rationale**: Prevents wasted introductions. A travel nurse at $2,200/mo should not be matched to a $3,500/mo listing. Optional to avoid friction for users unsure of exact budget.

---

### `unit_type`
- **Type**: `TEXT` | `NULL`
- **Values**: `studio` | `1br` | `2br` | `3br_plus`
- **Required**: No (hosts only)
- **Rationale**: Enables size-based matching. Studios suit solo travelers; 2BR+ suit traveling couples or roommate pairs.

---

### `available_date`
- **Type**: `TEXT` | `NULL` (ISO date string)
- **Required**: No (hosts only)
- **Rationale**: Matches host availability with renter move-in dates.

---

### `notes`
- **Type**: `TEXT` | `NULL`
- **Constraints**: Max 500 characters
- **Required**: No
- **Rationale**: Free-form context. Renters: pets, accessibility needs, work-from-home requirements. Hosts: pet policy, parking, quiet hours. High-signal for human-in-the-loop matching.

---

### `referral_source`
- **Type**: `TEXT` | `NULL`
- **Values**: `social_media` | `friend_colleague` | `google_search` | `nursing_community` | `reddit` | `other`
- **Required**: No
- **Rationale**: Attribution data for marketing ROI analysis. Which channels bring the most travel nurses? Which bring hosts?

---

### `consent`
- **Type**: `INTEGER` (SQLite boolean: `1` = true)
- **Required**: Always `1` (enforced by Zod `z.literal(true)`)
- **Rationale**: GDPR / CAN-SPAM consent record. The server schema enforces `true` only; the `created_at` timestamp and `ip_address` together form the consent audit trail required for compliance.

---

### `ip_address`
- **Type**: `TEXT` | `NULL`
- **Required**: No (server-assigned)
- **Rationale**: Rate limiting and spam detection. Not exposed in the admin CSV export or API responses. Stored for dispute resolution and abuse prevention only.

---

### `is_spam`
- **Type**: `INTEGER` (SQLite boolean: `0` = clean, `1` = spam)
- **Default**: `0`
- **Rationale**: Honeypot flag. Submissions where the hidden `website` field was filled are marked `is_spam = 1`. They are stored (for analysis) but excluded from admin views and the matching pipeline.

---

## Indexes

```sql
CREATE INDEX idx_ws_role    ON waitlist_submissions (role);
CREATE INDEX idx_ws_email   ON waitlist_submissions (email);
CREATE INDEX idx_ws_created ON waitlist_submissions (created_at DESC);
CREATE INDEX idx_ws_is_spam ON waitlist_submissions (is_spam);
```

---

## TypeScript type

See `src/types/waitlist.ts` for the full `WaitlistSubmission` interface and related enums.

---

## Field coverage by role

| Field | Renter | Host |
|---|---|---|
| role | ✓ | ✓ |
| renter_type | Required | — |
| neighborhoods | ✓ | ✓ |
| name | ✓ | ✓ |
| email | ✓ | ✓ |
| phone | Optional | Optional |
| move_in_date | Optional | — |
| budget_min/max | Optional | — |
| unit_type | — | Optional |
| available_date | — | Optional |
| notes | Optional | Optional |
| referral_source | Optional | Optional |

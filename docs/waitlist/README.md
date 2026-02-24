# Subletly Waitlist System

Production-quality waitlist for the Subletly platform — a furnished rental network built for Brooklyn, targeting travel nurses, healthcare workers, and professionals.

---

## What was built

| Path | Purpose |
|---|---|
| `/waitlist` | Public-facing multi-step signup form |
| `/api/waitlist` | `POST` endpoint — validates, deduplicates, persists |
| `/admin/waitlist` | Password-gated admin dashboard with filter + CSV export |
| `src/lib/db.ts` | SQLite abstraction (swap to Firebase/Supabase — see TODO) |
| `src/lib/rateLimit.ts` | In-memory IP rate limiter |
| `src/lib/analytics.ts` | Multi-provider analytics hooks |
| `src/lib/validation.ts` | Shared Zod schema (client + server) |
| `docs/waitlist/SCHEMA.md` | Field definitions and rationale |
| `docs/waitlist/COPY.md` | All UI copy, error messages, microcopy |

---

## Tech stack

- **Framework**: Next.js 14 (App Router, React Server Components)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 3
- **Validation**: Zod (shared between client and server)
- **Database**: SQLite via `better-sqlite3` (WAL mode, indexed)
- **Icons**: Lucide React

---

## How to run

### Prerequisites

- Node.js 18+
- npm 9+

### Setup

```bash
# 1. Clone and enter the repo
cd subletly

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local — at minimum set ADMIN_PASSWORD

# 4. Start the dev server
npm run dev

# 5. Open the waitlist
open http://localhost:3000/waitlist

# 6. Open the admin panel
open http://localhost:3000/admin/waitlist
# Password: value of ADMIN_PASSWORD in .env.local
```

### Build for production

```bash
npm run build
npm start
```

The SQLite database is created automatically on first request at `./data/waitlist.db`. The `data/` directory is git-ignored.

---

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `ADMIN_PASSWORD` | Yes | Password for `/admin/waitlist` |
| `NEXT_PUBLIC_BASE_URL` | No | Canonical base URL (default: `http://localhost:3000`) |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | No | Google Analytics 4 measurement ID |
| `NEXT_PUBLIC_SEGMENT_WRITE_KEY` | No | Segment.com write key |

---

## Form flow

```
Step 1 — Role
  └─ Host → Step 3 (skip Step 2)
  └─ Renter → Step 2

Step 2 — Renter type (renters only)
  Travel Nurse / Healthcare Worker / Student / Professional / Other

Step 3 — Neighborhood selection (multi-select)
  Bushwick / Williamsburg / Bed-Stuy / Other NYC

Step 4 — Contact & details
  Shared: Name, Email, Phone (optional)
  Renters: Move-in date, Budget range (optional)
  Hosts:   Unit type, Available from date (optional)
  Both:    Notes (optional), Referral source (optional)

Step 5 — Review & consent
  Summary of entered data + consent checkbox

✓ Success screen — position number + share CTA
```

---

## Anti-spam

| Mechanism | Detail |
|---|---|
| **Honeypot** | Hidden `website` field — bots fill it, humans don't. Submissions with it filled are stored but flagged `is_spam = 1` and excluded from the admin view and CSV export. |
| **Rate limiting** | Max 3 submissions per IP per 60 seconds (in-memory). Returns HTTP 429. |
| **Duplicate email** | Soft block — returns success without re-inserting to avoid email enumeration. |

---

## Analytics

The `trackWaitlistSubmitted` function (see `src/lib/analytics.ts`) fires the `waitlist_submitted` event with:

```json
{
  "role": "renter",
  "neighborhood": "bushwick",
  "renter_type": "travel_nurse"
}
```

Hook it up to any provider:

- **GA4**: Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` — the standard `gtag` snippet auto-picks it up.
- **Segment**: Set `NEXT_PUBLIC_SEGMENT_WRITE_KEY` and load the Segment snippet in `src/app/layout.tsx`.
- **Custom**: Call `trackEvent('waitlist_submitted', {...})` directly from `src/lib/analytics.ts`.

---

## Swap to Firebase or Supabase

`src/lib/db.ts` is the only file that touches the database. Replace its implementation while keeping the exported function signatures:

```ts
insertSubmission(input: InsertSubmissionInput): void
getSubmissions(opts: GetSubmissionsOptions): WaitlistSubmission[]
countSubmissions(includeSpam?: boolean): number
emailExists(email: string): boolean
```

**Firebase Firestore example**: https://firebase.google.com/docs/firestore/quickstart
**Supabase Postgres example**: https://supabase.com/docs/guides/database

---

## Admin panel

Navigate to `/admin/waitlist`. You'll be prompted for the `ADMIN_PASSWORD`.

Features:
- Real-time search by name or email
- Filter by role, neighborhood, renter type
- Export current filtered view as RFC 4180 CSV
- Refresh button
- Spam submissions are excluded

Session is stored in an `httpOnly` cookie that expires after 8 hours.

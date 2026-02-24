# Subletly Growth OS — "Plug Into Subletly" Integration Guide

> Stack: **Next.js 13+ (App Router) + Firebase (Auth + Firestore + Storage)**
> Mode: ONBOARDING — use this as the integration checklist when connecting the Growth OS to the real codebase.
> Updated: 2026-02-24

---

## Overview

This guide tells you exactly:
1. Which files to **inspect** in the real Subletly repo
2. What **code changes** to make (with drop-in snippets)
3. How to **verify** each integration works
4. What **Firebase-specific** considerations apply at each step

Work through sections in order. Each section is self-contained and independently shippable.

---

## Phase 1 — Inspect the Codebase First

Before writing a line of code, read these files to understand the current state:

### 1.1 Project Structure Audit

```bash
# Run these in the real repo root:
ls -la                          # top-level: confirm Next.js, Firebase SDK
cat package.json                # versions: next, firebase, posthog-js, etc.
cat next.config.js              # rewrites, env vars, image domains
cat .env.local                  # (never commit) — what keys exist?
ls src/app/                     # App Router pages tree
ls src/lib/                     # shared utilities — analytics? firebase? db?
ls src/components/              # component library
```

### 1.2 Files to Inspect (checklist)

| File | What to look for |
|---|---|
| `src/lib/firebase.ts` or `src/lib/firebase/index.ts` | Firebase app init, Firestore `db` export, Auth `auth` export |
| `src/app/layout.tsx` | Current providers, `<head>` tags, any existing analytics scripts |
| `src/app/listings/[slug]/page.tsx` | How listing data is fetched (Firestore `getDoc`?), current metadata |
| `src/app/sublets/page.tsx` | Search/browse page — session tracking opportunity |
| `src/components/LeadForm.tsx` or similar | Lead submission handler — where `lead_submitted` event goes |
| `src/hooks/useAuth.ts` or `src/context/AuthContext.tsx` | User object shape — get `uid`, `role`, `createdAt` |
| `firestore.rules` | Security rules — confirms collection names |
| `firestore.indexes.json` | Confirms query patterns on listings collection |

### 1.3 Firestore Collection Map

Identify these collections (names may differ — update the table):

| Expected Collection | Likely Real Name | Key Fields to Confirm |
|---|---|---|
| `listings` | `listings` / `posts` / `sublets` | `status`, `slug`, `city`, `neighborhood`, `price`, `publishedAt`, `updatedAt`, `listerUid` |
| `users` | `users` / `profiles` | `role`, `profileComplete`, `createdAt` |
| `leads` | `leads` / `inquiries` / `messages` | `listingId`, `renterUid`, `listerUid`, `createdAt`, `repliedAt` |
| `searches` | `searches` / `searchEvents` | `city`, `neighborhood`, `priceMax`, `dates`, `uid` |

> **If collection names differ from expected:** update every snippet below before implementing.

---

## Phase 2 — Analytics Foundation (P0-001)

### 2.1 Install Dependencies

```bash
npm install posthog-js
# GA4 loads via next/script — no npm package needed
```

### 2.2 Environment Variables

Add to `.env.local` (real repo):

```bash
NEXT_PUBLIC_POSTHOG_KEY=phc_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SITE_URL=https://subletly.com
```

### 2.3 Copy Analytics Wrapper

Copy `src/lib/analytics.ts` from this Growth OS repo into the real repo at the same path.
No changes needed — it is provider-agnostic.

### 2.4 Copy AnalyticsProvider

Copy `src/components/providers/AnalyticsProvider.tsx` into the real repo.

### 2.5 Mount in Root Layout

**File to edit:** `src/app/layout.tsx`

```tsx
// BEFORE
import type { ReactNode } from 'react';
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

// AFTER — add AnalyticsProvider + Suspense (required for useSearchParams)
import { Suspense, type ReactNode } from 'react';
import { AnalyticsProvider } from '@/components/providers/AnalyticsProvider';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={null}>
          <AnalyticsProvider>
            {children}
          </AnalyticsProvider>
        </Suspense>
      </body>
    </html>
  );
}
```

> **Why Suspense?** `AnalyticsProvider` calls `useSearchParams()` which requires a Suspense boundary in Next.js 13+ App Router.

### 2.6 Wire `identify()` to Firebase Auth

**File to edit:** `src/hooks/useAuth.ts` or wherever `onAuthStateChanged` is called.

```ts
// Find the onAuthStateChanged callback and add identify():
import { identify, reset } from '@/lib/analytics';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

onAuthStateChanged(auth, async (firebaseUser) => {
  if (firebaseUser) {
    // Fetch Firestore profile for role + profile completeness
    const profileSnap = await getDoc(doc(db, 'users', firebaseUser.uid));
    const profile = profileSnap.data();

    identify(firebaseUser.uid, {
      role: profile?.role ?? 'unknown',
      profile_complete: profile?.profileComplete ?? false,
      listing_count: profile?.listingCount ?? 0,
      days_since_signup: profile?.createdAt
        ? Math.floor((Date.now() - profile.createdAt.toMillis()) / 86_400_000)
        : 0,
    });
  } else {
    reset(); // clears PostHog identity on logout
  }
});
```

### 2.7 Wire Core Funnel Events

#### `user_signed_up` — fire in signup handler

**File:** `src/app/(auth)/signup/page.tsx` or `src/components/SignupForm.tsx`

```ts
import { track } from '@/lib/analytics';

// After successful Firebase createUserWithEmailAndPassword() or Google sign-in:
track('user_signed_up', {
  user_id: firebaseUser.uid,
  role: selectedRole,            // 'renter' | 'lister'
  signup_method: 'email',        // or 'google' | 'apple'
  referral_code: referralCode ?? null,
  created_at: new Date().toISOString(),
});
```

#### `listing_started` — fire when lister begins creating

**File:** `src/app/dashboard/listings/new/page.tsx` or `src/components/ListingEditor.tsx`

```ts
// On first meaningful interaction (e.g. "Create Listing" button click or first field change):
track('listing_started', {
  listing_id: draftId,
  lister_id: currentUser.uid,
  city: selectedCity,
});
```

#### `listing_published` — fire on Firestore status update

**File:** wherever `updateDoc(listingRef, { status: 'active' })` is called

```ts
track('listing_published', {
  listing_id: listingId,
  lister_id: currentUser.uid,
  city: listing.city,
  neighborhood: listing.neighborhood ?? null,
  price_monthly: listing.price,
  bedrooms: listing.bedrooms,
  photos_count: listing.photos?.length ?? 0,
  quality_score: computeQualityScore(listing),   // see P1-002
  hours_since_started: hoursSinceStarted,
});
```

#### `listing_viewed` — fire in listing page component

**File:** `src/app/listings/[slug]/page.tsx` (use a Client Component for the event)

```tsx
'use client';
import { useEffect } from 'react';
import { track } from '@/lib/analytics';

export function ListingViewTracker({ listing, trafficSource }: Props) {
  useEffect(() => {
    track('listing_viewed', {
      listing_id: listing.id,
      lister_id: listing.listerUid,
      viewer_id: currentUser?.uid ?? null,
      city: listing.city,
      neighborhood: listing.neighborhood ?? null,
      price_monthly: listing.price,
      traffic_source: trafficSource,
    });
  }, [listing.id]);   // run once per listing mount

  return null;
}
```

#### `lead_submitted` — fire in lead form submit handler

**File:** `src/components/LeadForm.tsx`

```ts
const handleSubmit = async (formData: LeadFormData) => {
  const startTime = useRef(Date.now());   // set at component mount

  // ... Firestore addDoc to 'leads' collection ...
  const leadDoc = await addDoc(collection(db, 'leads'), { ... });

  track('lead_submitted', {
    lead_id: leadDoc.id,
    listing_id: listing.id,
    lister_id: listing.listerUid,
    renter_id: currentUser.uid,
    requested_move_in: formData.moveInDate,
    form_fields_count: visibleFields,
    time_on_page_seconds: Math.floor((Date.now() - startTime.current) / 1000),
  });
};
```

#### `lead_replied` — fire via Firestore trigger or client update

**Option A (client-side):** In the reply submission handler:
```ts
// When lister sends first reply message
track('lead_replied', {
  lead_id: leadId,
  listing_id: lead.listingId,
  lister_id: currentUser.uid,
  renter_id: lead.renterUid,
  hours_to_reply: Math.floor((Date.now() - lead.createdAt.toMillis()) / 3_600_000),
  reply_channel: 'in_app',
});
```

**Option B (preferred — Firebase Cloud Function):** Set `repliedAt` in Firestore and trigger analytics via a server-side PostHog client. This ensures accuracy even if the tab is closed.

```ts
// functions/src/onLeadReplied.ts
import { PostHog } from 'posthog-node';
const phClient = new PostHog(process.env.POSTHOG_KEY!);

export const onLeadReplied = onDocumentUpdated('leads/{leadId}', async (event) => {
  const before = event.data?.before.data();
  const after  = event.data?.after.data();
  if (before?.repliedAt || !after?.repliedAt) return; // only first reply

  phClient.capture({
    distinctId: after.listerUid,
    event: 'lead_replied',
    properties: {
      lead_id: event.params.leadId,
      listing_id: after.listingId,
      lister_id: after.listerUid,
      renter_id: after.renterUid,
      hours_to_reply: (after.repliedAt.toMillis() - after.createdAt.toMillis()) / 3_600_000,
      reply_channel: 'in_app',
    },
  });
  await phClient.shutdown();
});
```

### 2.8 Validation Steps

```bash
# 1. Local dev — enable debug mode
# Open browser console on localhost:3000, run:
window.__ANALYTICS_DEBUG = true

# 2. Sign up as renter → confirm 'user_signed_up' logs
# 3. Start a listing as lister → confirm 'listing_started'
# 4. Publish listing → confirm 'listing_published' with quality_score
# 5. View listing as renter → confirm 'listing_viewed'
# 6. Submit lead → confirm 'lead_submitted'
# 7. Check PostHog: app.posthog.com → Live Events
# 8. Check GA4: Admin → DebugView (use GA4 Chrome extension)
```

---

## Phase 3 — SEO: robots.txt + Sitemap (P0-002)

### 3.1 robots.txt

Copy `public/robots.txt` from this Growth OS repo into the real repo.
**Update the domain** from `subletly.com` to the actual domain if different.

### 3.2 Sitemap — Wire Firestore Queries

**File to edit:** `src/app/sitemap.ts` (copy from this Growth OS repo, then replace stubs)

```ts
// Replace getPublishedListings() stub:
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';   // server-side Firebase (use admin SDK if available)

async function getPublishedListings(): Promise<Listing[]> {
  // Use Firebase Admin SDK in server context (recommended for sitemap):
  const snap = await adminDb
    .collection('listings')             // ← update collection name if different
    .where('status', '==', 'active')
    .orderBy('updatedAt', 'desc')
    .select('slug', 'updatedAt', 'city', 'neighborhood')
    .get();

  return snap.docs.map((doc) => ({
    slug: doc.data().slug as string,
    updatedAt: doc.data().updatedAt.toDate() as Date,
    city: doc.data().city as string,
    neighborhood: doc.data().neighborhood as string | undefined,
  }));
}
```

> **Admin SDK setup:** Create `src/lib/firebase-admin.ts`:
> ```ts
> import { initializeApp, getApps, cert } from 'firebase-admin/app';
> import { getFirestore } from 'firebase-admin/firestore';
>
> const app = getApps().length
>   ? getApps()[0]
>   : initializeApp({ credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!)) });
>
> export const adminDb = getFirestore(app);
> ```
> Add `FIREBASE_SERVICE_ACCOUNT` (JSON string) to `.env.local` and Vercel env vars.

### 3.3 Sitemap Validation

```bash
# Local:
curl http://localhost:3000/sitemap.xml | head -50

# Should output:
# <?xml version="1.0" encoding="UTF-8"?>
# <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
#   <url><loc>https://subletly.com/</loc>...
```

---

## Phase 4 — SEO: Listing Page Meta Tags + Structured Data (P0-003 + P0-005)

### 4.1 Locate Listing Page

**File:** `src/app/listings/[slug]/page.tsx`

Typical current structure:
```ts
// Typical BEFORE state (no metadata):
export default async function ListingPage({ params }: { params: { slug: string } }) {
  const listing = await getListingBySlug(params.slug);  // Firestore query
  return <ListingDetailComponent listing={listing} />;
}
```

### 4.2 Add generateMetadata + Structured Data

```tsx
// AFTER:
import type { Metadata } from 'next';
import { generateListingMetadata } from '@/lib/seo';
import { ListingStructuredData } from '@/components/seo/ListingStructuredData';
import { adminDb } from '@/lib/firebase-admin';

// 1. Fetch helper (adapt to real Firestore schema):
async function getListingBySlug(slug: string) {
  const snap = await adminDb
    .collection('listings')
    .where('slug', '==', slug)
    .where('status', '==', 'active')
    .limit(1)
    .get();
  if (snap.empty) return null;
  const data = snap.docs[0].data();
  return { id: snap.docs[0].id, ...data };
}

// 2. generateMetadata — called by Next.js at build/request time:
export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const listing = await getListingBySlug(params.slug);
  if (!listing) return { title: 'Listing Not Found | Subletly' };

  return generateListingMetadata({
    slug: listing.slug,
    description: listing.description,
    city: listing.city,
    neighborhood: listing.neighborhood,
    bedrooms: listing.bedrooms,
    priceMonthly: listing.price,
    availableFrom: listing.availableFrom?.toDate().toISOString(),
    availableTo: listing.availableTo?.toDate().toISOString(),
    photos: listing.photos,
  });
}

// 3. Page component — add structured data + view tracker:
export default async function ListingPage({ params }: { params: { slug: string } }) {
  const listing = await getListingBySlug(params.slug);
  if (!listing) notFound();

  return (
    <>
      <ListingStructuredData
        listing={{
          slug: listing.slug,
          name: listing.title,
          description: listing.description,
          city: listing.city,
          state: listing.state,
          neighborhood: listing.neighborhood,
          streetAddress: listing.streetAddress,
          postalCode: listing.postalCode,
          priceMonthly: listing.price,
          bedrooms: listing.bedrooms,
          bathrooms: listing.bathrooms,
          availableFrom: listing.availableFrom?.toDate().toISOString(),
          availableTo: listing.availableTo?.toDate().toISOString(),
          photos: listing.photos,
        }}
      />
      <ListingViewTracker listing={listing} />
      {/* ... existing listing UI ... */}
    </>
  );
}
```

---

## Phase 5 — Lead Form Audit (P0-004)

### 5.1 Find the Lead Form

Search for the form component:

```bash
# In the real repo:
grep -r "onSubmit\|handleSubmit\|addDoc.*lead\|addDoc.*inquir" src/ --include="*.tsx" -l
```

### 5.2 Checklist — What to Look For

Open the identified file and verify:

- [ ] **Field count:** Count `<input>`, `<select>`, `<textarea>` elements. Target: ≤ 4.
- [ ] **Mobile visibility:** Does the form appear above the fold on a 375px viewport without scrolling?
- [ ] **Validation:** Are error states shown inline (not alert/toast only)?
- [ ] **Success state:** After submit, does the user see confirmation + a "similar listings" CTA?
- [ ] **Analytics:** Is `track('lead_submitted', ...)` fired in the submit handler?
- [ ] **Loading state:** Is the submit button disabled while the Firestore write is in progress?

### 5.3 Minimal Lead Form (reference implementation)

```tsx
'use client';
import { useState, useRef, useEffect } from 'react';
import { track } from '@/lib/analytics';

const REQUIRED_FIELDS = ['name', 'email', 'moveInDate'] as const;

export function LeadForm({ listing, currentUser }: Props) {
  const mountTime = useRef(Date.now());
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    // ... Firestore write ...

    track('lead_submitted', {
      lead_id: newLeadId,
      listing_id: listing.id,
      lister_id: listing.listerUid,
      renter_id: currentUser.uid,
      requested_move_in: form.get('moveInDate') as string,
      form_fields_count: REQUIRED_FIELDS.length,
      time_on_page_seconds: Math.floor((Date.now() - mountTime.current) / 1000),
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div>
        <p>Message sent! The lister typically replies within 24 hours.</p>
        <a href={`/sublets/${listing.citySlug}`}>View similar listings</a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Your name" required />
      <input name="email" type="email" placeholder="Email" required />
      <input name="moveInDate" type="date" required />
      <textarea name="message" placeholder="Anything to add? (optional)" rows={3} />
      <button type="submit">Send Message</button>
    </form>
  );
}
```

---

## Phase 6 — Firestore Indexes for Growth Queries

Add these indexes to `firestore.indexes.json` to enable the queries needed by analytics dashboards and the sitemap:

```json
{
  "indexes": [
    {
      "collectionGroup": "listings",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "updatedAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "listings",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "city", "order": "ASCENDING" },
        { "fieldPath": "publishedAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "leads",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "listerUid", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "leads",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "renterUid", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    }
  ]
}
```

Deploy with: `firebase deploy --only firestore:indexes`

---

## Phase 7 — Integration Verification Checklist

Run through this checklist before marking any P0 complete in TASKS.md:

### Analytics (P0-001)
- [ ] `window.posthog` exists in browser console on prod
- [ ] `window.gtag` exists in browser console on prod
- [ ] Sign up → `user_signed_up` appears in PostHog Live Events within 5s
- [ ] View listing → `listing_viewed` fires with correct `listing_id`
- [ ] Submit lead → `lead_submitted` fires with correct `lead_id` and `renter_id`
- [ ] PostHog funnel "Renter Acquisition" shows step-through data after 10+ events
- [ ] GA4 conversion goal `lead_submitted` shows count in Reports

### SEO (P0-002)
- [ ] `curl https://subletly.com/robots.txt` returns correct rules
- [ ] `curl https://subletly.com/sitemap.xml` returns valid XML with listing URLs
- [ ] Sitemap submitted in Google Search Console (Sitemaps tab)
- [ ] Google Search Console shows 0 sitemap errors after 48h

### Meta Tags (P0-003)
- [ ] `curl -s https://subletly.com/listings/[any-slug] | grep '<title>'` shows listing-specific title
- [ ] Facebook Sharing Debugger shows correct OG image for a listing URL
- [ ] Twitter Card Validator shows large image card

### Structured Data (P0-005)
- [ ] Google Rich Results Test: no errors on listing page
- [ ] BreadcrumbList detected
- [ ] Accommodation type detected with price

### Lead Form (P0-004)
- [ ] Lighthouse mobile: form visible without scroll on Pixel 5 viewport
- [ ] Form submits with 3 required fields (name, email, move-in date)
- [ ] Success state shown after submit
- [ ] `lead_submitted` event fires on submit

---

## Rollback Map

| Change | How to Rollback |
|---|---|
| AnalyticsProvider in layout | Remove `<AnalyticsProvider>` wrapper from `layout.tsx` |
| `identify()` in auth hook | Delete the PostHog/GA4 calls from `onAuthStateChanged` |
| `sitemap.ts` | Delete file — `/sitemap.xml` returns 404 |
| `generateMetadata` on listing page | Remove export — falls back to root layout meta |
| `ListingStructuredData` | Remove import from listing page — no functional impact |
| Lead form field reduction | `git revert` the form component commit |
| Firestore indexes | Remove from `firestore.indexes.json` + `firebase deploy --only firestore:indexes` |

---

## Dependencies / Risks

| Risk | Mitigation |
|---|---|
| Firebase Admin SDK not set up | Use client SDK with service account OR deploy Firestore queries as Next.js Route Handlers |
| `posthog-js` bundle size (~50KB gzip) | Load via `strategy="afterInteractive"` — no impact on LCP |
| Sitemap size (>50K URLs) | Implement sitemap index: `/sitemap_index.xml` → `/sitemap/listings-1.xml`, `/sitemap/listings-2.xml` etc. |
| Firestore rate limits on sitemap generation | Cache sitemap response at CDN level (Vercel: `revalidate: 3600`) |
| `onAuthStateChanged` fires before Firestore profile exists | Add a `profileSnap.exists()` guard; default `role` to `'unknown'` |

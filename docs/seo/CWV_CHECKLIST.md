# Subletly Growth OS — Core Web Vitals Checklist

> Target: All listing pages score ≥ 80 on Lighthouse Mobile.
> LCP < 2.5s · INP < 200ms · CLS < 0.1
> Updated: 2026-02-24

---

## Why CWV Matters for Subletly

1. **Google ranking signal** — CWV is a confirmed ranking factor. Poor scores suppress listing pages in organic results.
2. **Conversion impact** — 1 second LCP improvement = ~7% conversion lift. Renters on mobile expect instant loads.
3. **Firebase Storage images** — Firestore/Storage assets aren't automatically optimized. This checklist ensures they are.

---

## Measurement Tools

| Tool | What it measures | When to use |
|---|---|---|
| [PageSpeed Insights](https://pagespeed.web.dev/) | Real-user CWV + lab data | After every deploy |
| `next build` output | Bundle sizes, static analysis | Every build |
| Chrome DevTools → Performance | Waterfall, LCP element, CLS shifts | Debugging |
| Chrome DevTools → Coverage | Unused JS/CSS | Optimization sprints |
| [web-vitals npm package](https://github.com/GoogleChrome/web-vitals) | Real-user metrics in production | After analytics wired |
| Google Search Console → CWV report | Field data (real users) | Weekly |

---

## Section 1 — LCP (Largest Contentful Paint) Target: < 2.5s

LCP is almost always the listing hero image on a listing detail page.

### 1.1 Image Optimization

- [ ] Listing hero image uses `<Image>` from `next/image` with `priority` prop set
  ```tsx
  <Image
    src={listing.photos[0]}
    alt={`${listing.title} — sublet in ${listing.neighborhood}`}
    width={1200}
    height={800}
    priority                     // ← sets fetchpriority="high" + preloads
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
  />
  ```

- [ ] `next.config.js` has Firebase Storage in `remotePatterns`:
  ```js
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
    ],
    formats: ['image/avif', 'image/webp'],   // ← serve modern formats
  }
  ```

- [ ] Hero image is served in WebP or AVIF (verify in DevTools Network tab → Type column)
- [ ] Hero image file size < 200KB for mobile viewport (check with PSI)
- [ ] No hero image is a `background-image` in CSS (not LCP-discoverable by preload scanner)

### 1.2 Server Response Time (TTFB)

- [ ] Listing page uses Next.js `generateStaticParams` for popular listings (ISR):
  ```ts
  export async function generateStaticParams() {
    // Pre-render top 100 listings at build time:
    const snap = await adminDb.collection('listings')
      .where('status', '==', 'active')
      .orderBy('viewCount', 'desc')
      .limit(100)
      .get();
    return snap.docs.map((doc) => ({ slug: doc.data().slug }));
  }

  export const revalidate = 3600; // ISR: regenerate every 1 hour
  ```
- [ ] Vercel Edge Network or CDN caching is active (check `x-vercel-cache: HIT` header)
- [ ] Firestore reads use Admin SDK (server-side, no client-side waterfall)

### 1.3 Render-blocking Resources

- [ ] No `<link rel="stylesheet">` without `media` attribute for non-critical CSS
- [ ] All third-party scripts use `strategy="afterInteractive"` or `strategy="lazyOnload"`
- [ ] PostHog + GA4 do NOT block rendering (verify: PSI "Eliminate render-blocking resources" = 0)
- [ ] Google Fonts loaded via `next/font` (inlined, no render block):
  ```ts
  import { Inter } from 'next/font/google';
  const inter = Inter({ subsets: ['latin'], display: 'swap' });
  ```

---

## Section 2 — INP (Interaction to Next Paint) Target: < 200ms

INP measures responsiveness. Critical on listing pages where users click photos, submit lead forms.

### 2.1 Event Handler Performance

- [ ] Lead form submit handler is not synchronous (no blocking Firestore operations before UI update)
  ```tsx
  // GOOD: optimistic UI update before async write
  const handleSubmit = async () => {
    setSubmitted(true);        // ← immediate UI response
    await addDoc(...);         // ← async, doesn't block paint
  };
  ```
- [ ] Photo carousel click/swipe response < 50ms (test with Chrome Performance Profiler)
- [ ] No heavy `useEffect` computations running on every render of listing page

### 2.2 Long Tasks

- [ ] No JavaScript long tasks > 50ms on listing page initial load (check Performance panel → Long Tasks)
- [ ] JSON-LD structured data is server-rendered (not hydrated via client JS)
- [ ] PostHog `autocapture` does not fire on scroll events (only clicks) — verify in PostHog settings

### 2.3 React-Specific

- [ ] Listing page photos rendered in a virtualized carousel (only 1–2 images in DOM at once)
- [ ] No unnecessary re-renders on scroll (use React DevTools Profiler)
- [ ] `use client` boundary is as narrow as possible — analytics tracker and lead form only, not the entire listing page

---

## Section 3 — CLS (Cumulative Layout Shift) Target: < 0.1

CLS is caused by content that shifts after the page loads. Common culprits: images without dimensions, fonts, ads.

### 3.1 Images

- [ ] Every `<Image>` has explicit `width` and `height` props (prevents layout shift while image loads)
- [ ] Listing image gallery uses `aspect-ratio` CSS:
  ```css
  .listing-photo {
    aspect-ratio: 3 / 2;   /* matches actual photo dimensions */
    width: 100%;
    object-fit: cover;
  }
  ```
- [ ] Firebase Storage images always served at consistent dimensions (no variable-size thumbnails without aspect locks)

### 3.2 Fonts

- [ ] `next/font` used for all fonts (eliminates FOUT)
- [ ] OR all custom fonts use `font-display: swap` with fallback font that is size-similar
- [ ] Font loading does not shift the listing title `<h1>` position

### 3.3 Dynamic Content

- [ ] Listing page does not inject banners/ads/notifications above the hero that shift content down after load
- [ ] "Verified" badge, availability dates, and price are server-rendered, not loaded asynchronously after hydration
- [ ] Lead form maintains fixed height whether empty or after validation errors appear (avoid height jumps)
- [ ] If a "sticky" lead form CTA appears on mobile scroll, it uses `position: fixed` not `position: sticky` with height changes

---

## Section 4 — Image Pipeline for Firebase Storage

Firebase Storage does not auto-resize or format-convert images. You need a pipeline.

### Option A: Next.js Image Optimization (simplest)
Use `next/image` pointing at Firebase Storage URLs directly. Next.js will:
- Resize on-demand to the requested dimensions
- Convert to WebP/AVIF
- Cache at the CDN edge

**Required:** Add Firebase Storage to `remotePatterns` in `next.config.js` (see Section 1.1).

### Option B: Firebase Extensions — "Resize Images" (recommended for scale)
Install the [Firebase Resize Images extension](https://extensions.dev/extensions/firebase/storage-resize-images):
- Automatically creates thumbnails (e.g., `photo_400x300`) on upload
- Store resized URLs in Firestore alongside original
- Serve the right size based on viewport

```ts
// In listing document:
{
  photos: [
    {
      original: 'https://firebasestorage.googleapis.com/v0/.../photo.jpg',
      thumb_400: 'https://firebasestorage.googleapis.com/v0/.../photo_400x300.webp',
      thumb_800: 'https://firebasestorage.googleapis.com/v0/.../photo_800x600.webp',
    }
  ]
}
```

### Option C: Cloudinary or Imgix (most flexible)
Store original in Firebase Storage, serve via Cloudinary/Imgix with URL-based transforms.
Higher cost but maximum optimization control.

---

## Section 5 — Bundle Size Budget

| Resource | Budget | How to check |
|---|---|---|
| First load JS (listing page) | < 200KB gzip | `next build` → Page sizes table |
| First load JS (shared) | < 100KB gzip | `next build` → First Load JS column |
| Total HTML | < 50KB | `curl -s URL \| wc -c` |
| Hero image | < 200KB | DevTools Network → Img filter |
| Total page weight (mobile) | < 1MB | PSI → "Page Resources" |

### How to reduce bundle size

```bash
# Analyze bundle:
npm install --save-dev @next/bundle-analyzer
ANALYZE=true next build
# Opens treemap in browser showing what's large
```

Common issues in Next.js + Firebase projects:
- `firebase/app` imported incorrectly (import full SDK instead of modular)
  ```ts
  // BAD — imports entire SDK:
  import firebase from 'firebase/app';

  // GOOD — tree-shakable modular imports:
  import { initializeApp } from 'firebase/app';
  import { getFirestore, doc, getDoc } from 'firebase/firestore';
  ```
- Date libraries (moment.js = 300KB; use `date-fns` or native `Intl.DateTimeFormat`)
- Icons library importing all icons (use named imports from `lucide-react`, never `*`)

---

## Section 6 — Real User Monitoring (RUM)

Wire the `web-vitals` library to report field data to PostHog/GA4:

```ts
// src/lib/web-vitals.ts
import { onCLS, onINP, onLCP, onFCP, onTTFB } from 'web-vitals';
import { track } from './analytics';

export function reportWebVitals() {
  onLCP((metric) => track('web_vital', { name: 'LCP', value: metric.value, rating: metric.rating }));
  onINP((metric) => track('web_vital', { name: 'INP', value: metric.value, rating: metric.rating }));
  onCLS((metric) => track('web_vital', { name: 'CLS', value: metric.value, rating: metric.rating }));
  onFCP((metric) => track('web_vital', { name: 'FCP', value: metric.value, rating: metric.rating }));
  onTTFB((metric) => track('web_vital', { name: 'TTFB', value: metric.value, rating: metric.rating }));
}
```

```tsx
// src/app/layout.tsx — call after mount
'use client';
import { useEffect } from 'react';
import { reportWebVitals } from '@/lib/web-vitals';

export function WebVitalsReporter() {
  useEffect(() => { reportWebVitals(); }, []);
  return null;
}
```

This gives you per-page, per-device CWV in PostHog. Filter for `name: 'LCP', rating: 'poor'` to find the worst offenders.

---

## CWV Audit Log

| Date | Listing Page LCP | INP | CLS | PSI Mobile Score | Action taken |
|---|---|---|---|---|---|
| 2026-02-24 | Not measured | Not measured | Not measured | Not measured | Checklist created |

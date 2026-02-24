/**
 * Analytics helpers — client-side only.
 *
 * Fires events to any combination of:
 *   • Google Analytics 4 (window.gtag)
 *   • Segment Analytics.js (window.analytics)
 *   • Console (always in development)
 *
 * To add GA4:  set NEXT_PUBLIC_GA_MEASUREMENT_ID in .env.local
 * To add Segment: set NEXT_PUBLIC_SEGMENT_WRITE_KEY in .env.local
 *   and load the Segment snippet in src/app/layout.tsx.
 */

interface AnalyticsProperties {
  [key: string]: string | number | boolean | null | undefined;
}

// Extend window with optional analytics globals
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    analytics?: {
      track: (event: string, properties?: AnalyticsProperties) => void;
    };
    dataLayer?: unknown[];
  }
}

/**
 * Track an analytics event across all configured providers.
 */
export function trackEvent(
  event: string,
  properties: AnalyticsProperties = {},
): void {
  if (process.env.NODE_ENV === 'development') {
    console.info('[analytics]', event, properties);
  }

  if (typeof window === 'undefined') return;

  // Google Analytics 4
  if (typeof window.gtag === 'function') {
    window.gtag('event', event, properties);
  }

  // Segment
  if (window.analytics && typeof window.analytics.track === 'function') {
    window.analytics.track(event, properties);
  }
}

// ─── Named events ─────────────────────────────────────────────────────────────

export function trackWaitlistSubmitted(opts: {
  role: string;
  neighborhood: string; // first selected neighborhood
  renterType?: string | null;
}): void {
  trackEvent('waitlist_submitted', {
    role: opts.role,
    neighborhood: opts.neighborhood,
    renter_type: opts.renterType ?? null,
  });
}

export function trackWaitlistStepViewed(step: number, stepName: string): void {
  trackEvent('waitlist_step_viewed', { step, step_name: stepName });
}

export function trackWaitlistAbandoned(step: number, stepName: string): void {
  trackEvent('waitlist_abandoned', { step, step_name: stepName });
}

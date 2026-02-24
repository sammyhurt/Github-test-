/**
 * Subletly Analytics — single wrapper for PostHog + GA4
 *
 * Usage:
 *   import { track, identify } from '@/lib/analytics';
 *   track('lead_submitted', { listing_id: '...', lister_id: '...', renter_id: '...' });
 *
 * Adding a new provider: add a call block inside track() and identify().
 * Removing a provider: delete its block — no call-site changes needed.
 *
 * See docs/growth/INSTRUMENTATION.md for the full event schema.
 */

export type EventProperties = Record<string, string | number | boolean | null | string[]>;

// ─── Core Funnel Events ────────────────────────────────────────────────────────
export type CoreEvent =
  | 'user_signed_up'
  | 'user_identified'
  | 'profile_completed'
  | 'listing_started'
  | 'listing_published'
  | 'listing_viewed'
  | 'lead_submitted'
  | 'lead_replied';

// ─── Secondary Events ──────────────────────────────────────────────────────────
export type SecondaryEvent =
  | 'search_performed'
  | 'search_result_clicked'
  | 'listing_quality_score_viewed'
  | 'profile_completion_nudge_shown'
  | 'profile_completion_nudge_clicked';

// ─── Retention / Referral Events ──────────────────────────────────────────────
export type RetentionEvent =
  | 'referral_link_copied'
  | 'referral_signup'
  | 'referral_conversion'
  | 'saved_search_created'
  | 'saved_search_alert_sent'
  | 'saved_search_alert_clicked';

export type SubletlyEvent = CoreEvent | SecondaryEvent | RetentionEvent;

declare global {
  interface Window {
    // PostHog
    posthog?: {
      capture: (event: string, properties?: EventProperties) => void;
      identify: (distinctId: string, properties?: EventProperties) => void;
      reset: () => void;
    };
    // GA4
    gtag?: (...args: unknown[]) => void;
    // Debug flag — set window.__ANALYTICS_DEBUG = true in browser console
    __ANALYTICS_DEBUG?: boolean;
  }
}

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Fire a tracking event to all configured analytics providers.
 *
 * @param event   Typed event name from SubletlyEvent union
 * @param props   Event-specific properties (see INSTRUMENTATION.md)
 */
export function track(event: SubletlyEvent, props?: EventProperties): void {
  if (!isBrowser()) return;

  const enriched: EventProperties = {
    ...props,
    $sent_at: new Date().toISOString(),
  };

  if (window.__ANALYTICS_DEBUG) {
    // eslint-disable-next-line no-console
    console.debug('[Analytics]', event, enriched);
  }

  // PostHog
  try {
    window.posthog?.capture(event, enriched);
  } catch (err) {
    if (window.__ANALYTICS_DEBUG) console.error('[Analytics] PostHog error', err);
  }

  // GA4
  try {
    window.gtag?.('event', event, enriched);
  } catch (err) {
    if (window.__ANALYTICS_DEBUG) console.error('[Analytics] GA4 error', err);
  }
}

/**
 * Identify an authenticated user across sessions.
 * Call after login/signup with role + profile state.
 */
export function identify(
  userId: string,
  traits?: EventProperties,
): void {
  if (!isBrowser()) return;

  if (window.__ANALYTICS_DEBUG) {
    // eslint-disable-next-line no-console
    console.debug('[Analytics] identify', userId, traits);
  }

  try {
    window.posthog?.identify(userId, traits);
  } catch (err) {
    if (window.__ANALYTICS_DEBUG) console.error('[Analytics] PostHog identify error', err);
  }

  try {
    window.gtag?.('set', 'user_properties', { user_id: userId, ...traits });
    window.gtag?.('config', process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID ?? '', {
      user_id: userId,
    });
  } catch (err) {
    if (window.__ANALYTICS_DEBUG) console.error('[Analytics] GA4 identify error', err);
  }
}

/**
 * Reset identity on logout.
 */
export function reset(): void {
  if (!isBrowser()) return;
  try {
    window.posthog?.reset();
  } catch (_) {
    // non-fatal
  }
}

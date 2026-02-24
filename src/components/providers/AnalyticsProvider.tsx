'use client';

/**
 * AnalyticsProvider
 *
 * Mounts PostHog and GA4 once at app root. Must wrap all client components.
 * Place in src/app/layout.tsx inside <body>.
 *
 * Usage (src/app/layout.tsx):
 *   import { AnalyticsProvider } from '@/components/providers/AnalyticsProvider';
 *   export default function RootLayout({ children }) {
 *     return (
 *       <html>
 *         <body>
 *           <AnalyticsProvider>{children}</AnalyticsProvider>
 *         </body>
 *       </html>
 *     );
 *   }
 *
 * Environment variables required:
 *   NEXT_PUBLIC_POSTHOG_KEY       — PostHog project API key
 *   NEXT_PUBLIC_POSTHOG_HOST      — PostHog host (default: https://app.posthog.com)
 *   NEXT_PUBLIC_GA4_MEASUREMENT_ID — GA4 Measurement ID (G-XXXXXXXXXX)
 */

import { useEffect, type ReactNode } from 'react';
import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { track } from '@/lib/analytics';

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY ?? '';
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://app.posthog.com';
const GA4_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID ?? '';

interface Props {
  children: ReactNode;
}

export function AnalyticsProvider({ children }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Track SPA page views on route change
  useEffect(() => {
    if (!pathname) return;
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');

    // PostHog page view (posthog-js captures automatically, but explicit call is safer for SPAs)
    if (typeof window !== 'undefined' && window.posthog) {
      window.posthog.capture('$pageview', { $current_url: url });
    }

    // GA4 page view
    if (typeof window !== 'undefined' && window.gtag && GA4_ID) {
      window.gtag('event', 'page_view', {
        page_path: url,
        page_location: window.location.href,
      });
    }
  }, [pathname, searchParams]);

  return (
    <>
      {/* ── PostHog ──────────────────────────────────────────────────────────── */}
      {POSTHOG_KEY && (
        <Script
          id="posthog-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+" (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
              posthog.init('${POSTHOG_KEY}', {
                api_host: '${POSTHOG_HOST}',
                capture_pageview: false,
                autocapture: true,
                session_recording: { maskAllInputs: true },
                loaded: function(ph) {
                  if (window.__ANALYTICS_DEBUG) console.debug('[PostHog] loaded', ph.get_distinct_id());
                }
              });
            `,
          }}
        />
      )}

      {/* ── Google Analytics 4 ──────────────────────────────────────────────── */}
      {GA4_ID && (
        <>
          <Script
            id="ga4-script"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
            strategy="afterInteractive"
          />
          <Script
            id="ga4-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA4_ID}', {
                  send_page_view: false,
                  cookie_flags: 'SameSite=None;Secure'
                });
              `,
            }}
          />
        </>
      )}

      {children}
    </>
  );
}

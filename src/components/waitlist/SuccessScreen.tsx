'use client';

import { CheckCircle2, Mail, Share2 } from 'lucide-react';
import type { WaitlistRole } from '@/types/waitlist';

interface SuccessScreenProps {
  role: WaitlistRole;
  name: string;
  position: number;
}

export function SuccessScreen({ role, name, position }: SuccessScreenProps) {
  const firstName = name.split(' ')[0];

  function handleShare() {
    if (navigator.share) {
      navigator.share({
        title: 'Subletly — Brooklyn furnished rentals',
        text: "I just joined the Subletly waitlist — Brooklyn's furnished rental network for healthcare workers and travelers. Join me!",
        url: window.location.origin + '/waitlist',
      });
    } else {
      const text = encodeURIComponent(
        'Just joined @subletly — the waitlist for Brooklyn furnished rentals built for travel nurses & healthcare workers. Check it out:',
      );
      window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
    }
  }

  return (
    <div className="flex flex-col items-center py-4 text-center">
      {/* Icon */}
      <div className="relative">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2 className="h-10 w-10 text-emerald-600" />
        </div>
        <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white shadow">
          #{position}
        </span>
      </div>

      <h2 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl">
        You&apos;re on the list, {firstName}!
      </h2>

      <p className="mt-3 max-w-sm text-base text-gray-600">
        {role === 'renter'
          ? "We'll reach out as soon as there's a listing that fits your profile. The best matches get priority access."
          : "We'll notify you as soon as renters matching your listing are ready. Thank you for being an early host!"}
      </p>

      {/* Position badge */}
      <div className="mt-6 rounded-xl border border-brand-100 bg-brand-50 px-6 py-4">
        <p className="text-sm font-medium text-brand-700">
          You&apos;re{' '}
          <span className="text-xl font-bold text-brand-600">#{position}</span>{' '}
          on the waitlist
        </p>
        <p className="mt-0.5 text-xs text-brand-500">
          Move up by sharing with friends
        </p>
      </div>

      {/* Next steps */}
      <div className="mt-8 w-full max-w-sm">
        <h3 className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
          What happens next
        </h3>
        <ul className="mt-3 flex flex-col gap-3 text-left">
          {[
            {
              icon: <Mail className="h-4 w-4" />,
              text: 'Check your inbox — we sent a confirmation email.',
            },
            {
              icon: (
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              ),
              text: "We'll match you manually once we have a good fit.",
            },
            {
              icon: (
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              ),
              text: 'Highly-rated profiles get early access — fill yours out fully.',
            },
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                {item.icon}
              </span>
              <span className="text-sm text-gray-600">{item.text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Share CTA */}
      <button
        type="button"
        onClick={handleShare}
        className="mt-8 flex items-center gap-2 rounded-xl border-2 border-brand-200 bg-white px-6 py-3 text-sm font-semibold text-brand-600 transition-colors hover:bg-brand-50"
      >
        <Share2 className="h-4 w-4" />
        Share with a colleague
      </button>

      <p className="mt-4 text-xs text-gray-400">
        Questions? Reply to your confirmation email.
      </p>
    </div>
  );
}

import type { Metadata } from 'next';
import { WaitlistForm } from '@/components/waitlist/WaitlistForm';
import { MapPin, Shield, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Join the Waitlist',
  description:
    'Join the Subletly waitlist — Brooklyn furnished rentals matched for travel nurses, healthcare workers, and professionals.',
};

const TRUST_SIGNALS = [
  {
    icon: <Shield className="h-4 w-4" />,
    text: 'No credit check to join',
  },
  {
    icon: <Zap className="h-4 w-4" />,
    text: 'Direct host connection',
  },
  {
    icon: <MapPin className="h-4 w-4" />,
    text: 'Bushwick · Williamsburg · Bed-Stuy',
  },
];

export default function WaitlistPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-brand-50">
      {/* Header / nav */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <a href="/" className="flex items-center gap-2">
            {/* Logo mark */}
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white text-sm font-bold">
              S
            </span>
            <span className="text-base font-bold text-gray-900 tracking-tight">
              Subletly
            </span>
          </a>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            Early Access
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10 sm:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16 lg:items-start">
          {/* Left column — hero copy */}
          <div className="lg:pt-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-3 py-1.5 text-xs font-semibold text-brand-700">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
              Brooklyn · Launching 2025
            </div>

            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl lg:text-5xl">
              Skip the broker.
              <br />
              <span className="text-brand-600">Get matched.</span>
            </h1>

            <p className="mt-4 text-base leading-relaxed text-gray-600 sm:text-lg">
              Subletly connects furnished rental hosts and renters in Brooklyn
              — built specifically for travel nurses, healthcare workers, and
              people on the move.
            </p>

            {/* Trust signals */}
            <ul className="mt-6 flex flex-col gap-2.5">
              {TRUST_SIGNALS.map((s) => (
                <li
                  key={s.text}
                  className="flex items-center gap-2.5 text-sm text-gray-600"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                    {s.icon}
                  </span>
                  {s.text}
                </li>
              ))}
            </ul>

            {/* Social proof */}
            <div className="mt-8 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex -space-x-2">
                {['bg-pink-400', 'bg-purple-500', 'bg-blue-400', 'bg-teal-400', 'bg-amber-400'].map(
                  (color, i) => (
                    <span
                      key={i}
                      className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-white ${color} text-xs font-bold text-white`}
                    >
                      {String.fromCharCode(65 + i)}
                    </span>
                  ),
                )}
              </div>
              <p className="mt-3 text-sm text-gray-700">
                <span className="font-semibold text-gray-900">
                  Nurses, PAs, and remote workers
                </span>{' '}
                are joining from hospitals across NYC. Be first in your
                neighborhood.
              </p>
            </div>

            {/* Neighborhoods map placeholder */}
            <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Active neighborhoods
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {[
                  'Bushwick',
                  'Williamsburg',
                  'Bed-Stuy',
                  'Ridgewood',
                  'Crown Heights',
                ].map((n) => (
                  <span
                    key={n}
                    className="rounded-full bg-white border border-gray-200 px-3 py-1 text-xs font-medium text-gray-700"
                  >
                    {n}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right column — form */}
          <div>
            <div className="rounded-2xl bg-white p-6 shadow-card sm:p-8">
              <WaitlistForm />
            </div>
            <p className="mt-3 text-center text-xs text-gray-400">
              Free to join · No spam · Unsubscribe anytime
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-100 py-8">
        <div className="mx-auto max-w-5xl px-4 text-center text-xs text-gray-400">
          <p>
            © {new Date().getFullYear()} Subletly ·{' '}
            <span className="cursor-pointer hover:text-gray-600">Privacy Policy</span>{' '}
            ·{' '}
            <span className="cursor-pointer hover:text-gray-600">Terms of Service</span>
          </p>
          <p className="mt-1">
            Questions? Email{' '}
            <a
              href="mailto:hello@subletly.com"
              className="underline underline-offset-2 hover:text-gray-600"
            >
              hello@subletly.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

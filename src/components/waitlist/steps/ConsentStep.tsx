'use client';

import { ShieldCheck } from 'lucide-react';
import type { WaitlistFormData } from '@/types/waitlist';

interface ConsentStepProps {
  data: WaitlistFormData;
  onChange: (field: keyof WaitlistFormData, value: boolean | string) => void;
  errors: Partial<Record<keyof WaitlistFormData, string>>;
}

function summaryLabel(key: string): string {
  const map: Record<string, string> = {
    renter: 'Renter',
    host: 'Host',
    travel_nurse: 'Travel Nurse',
    healthcare_worker: 'Healthcare Worker',
    student: 'Student',
    professional: 'Professional',
    other: 'Other',
    bushwick: 'Bushwick',
    williamsburg: 'Williamsburg',
    bed_stuy: 'Bed-Stuy',
    other_nyc: 'Other NYC',
  };
  return map[key] ?? key;
}

export function ConsentStep({ data, onChange, errors }: ConsentStepProps) {
  const neighborhoods = data.neighborhoods
    .map(summaryLabel)
    .join(', ');

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
        Almost there!
      </h2>
      <p className="mt-1.5 text-sm text-gray-500">
        Review your details and confirm below.
      </p>

      {/* Summary card */}
      <div className="mt-6 rounded-xl bg-gray-50 border border-gray-200 p-5">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Your summary
        </h3>
        <dl className="mt-3 space-y-2">
          <SummaryRow label="Role" value={summaryLabel(data.role)} />
          {data.role === 'renter' && data.renterType && (
            <SummaryRow label="I am a" value={summaryLabel(data.renterType)} />
          )}
          <SummaryRow label="Neighborhoods" value={neighborhoods || '—'} />
          <SummaryRow label="Name" value={data.name || '—'} />
          <SummaryRow label="Email" value={data.email || '—'} />
          {data.phone && <SummaryRow label="Phone" value={data.phone} />}
          {data.role === 'renter' && (
            <>
              {data.moveInDate && (
                <SummaryRow
                  label="Move-in"
                  value={new Date(data.moveInDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                />
              )}
              {(data.budgetMin || data.budgetMax) && (
                <SummaryRow
                  label="Budget"
                  value={`$${data.budgetMin || '?'} – $${data.budgetMax || '?'}/mo`}
                />
              )}
            </>
          )}
          {data.role === 'host' && (
            <>
              {data.unitType && (
                <SummaryRow
                  label="Unit type"
                  value={summaryLabel(data.unitType)}
                />
              )}
              {data.availableDate && (
                <SummaryRow
                  label="Available"
                  value={new Date(
                    data.availableDate,
                  ).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                />
              )}
            </>
          )}
        </dl>
      </div>

      {/* Trust badges */}
      <div className="mt-5 flex items-start gap-3 rounded-lg bg-emerald-50 border border-emerald-100 p-4">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
        <p className="text-sm text-emerald-800">
          Your information is kept private. We never sell your data or share it
          with third parties without your consent.
        </p>
      </div>

      {/* Consent checkbox */}
      <div className="mt-5">
        <label
          className={[
            'flex cursor-pointer items-start gap-3 rounded-lg border-2 p-4 transition-colors',
            data.consent
              ? 'border-brand-200 bg-brand-50'
              : 'border-gray-200 bg-white hover:border-gray-300',
            errors.consent ? 'border-red-300 bg-red-50' : '',
          ].join(' ')}
        >
          <input
            type="checkbox"
            checked={data.consent}
            onChange={(e) => onChange('consent', e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
            aria-describedby={errors.consent ? 'consent-error' : undefined}
          />
          <span className="text-sm text-gray-700">
            I agree to Subletly&apos;s{' '}
            <span className="font-medium text-brand-600 underline underline-offset-2 cursor-pointer">
              Terms of Service
            </span>{' '}
            and{' '}
            <span className="font-medium text-brand-600 underline underline-offset-2 cursor-pointer">
              Privacy Policy
            </span>
            . I consent to receive waitlist updates and match notifications via
            email.
          </span>
        </label>
        {errors.consent && (
          <p id="consent-error" className="mt-1.5 text-xs text-red-600" role="alert">
            {errors.consent}
          </p>
        )}
      </div>

      {/* Honeypot — hidden from real users, catches bots */}
      <div aria-hidden="true" className="hidden" tabIndex={-1}>
        <input
          type="text"
          name="website"
          value={data.website}
          onChange={(e) => onChange('website', e.target.value)}
          autoComplete="off"
          tabIndex={-1}
        />
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-sm">
      <dt className="shrink-0 text-gray-500">{label}</dt>
      <dd className="text-right font-medium text-gray-900 truncate">{value}</dd>
    </div>
  );
}

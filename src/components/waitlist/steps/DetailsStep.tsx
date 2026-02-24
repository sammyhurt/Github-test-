'use client';

import type { WaitlistFormData, UnitType } from '@/types/waitlist';

interface DetailsStepProps {
  data: WaitlistFormData;
  onChange: (field: keyof WaitlistFormData, value: string) => void;
  errors: Partial<Record<keyof WaitlistFormData, string>>;
}

const UNIT_TYPES: { id: UnitType; label: string }[] = [
  { id: 'studio', label: 'Studio' },
  { id: '1br', label: '1 BR' },
  { id: '2br', label: '2 BR' },
  { id: '3br_plus', label: '3 BR+' },
];

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1 text-xs text-red-600" role="alert">
      {message}
    </p>
  );
}

function Label({
  htmlFor,
  children,
  optional,
}: {
  htmlFor: string;
  children: React.ReactNode;
  optional?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium text-gray-700"
    >
      {children}
      {optional && (
        <span className="ml-1.5 text-xs font-normal text-gray-400">
          (optional)
        </span>
      )}
    </label>
  );
}

function Input({
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  hasError,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  hasError?: boolean;
}) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={[
        'w-full rounded-lg border px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors',
        'focus:ring-2 focus:ring-brand-500 focus:border-brand-500',
        hasError
          ? 'border-red-400 bg-red-50'
          : 'border-gray-300 bg-white hover:border-gray-400',
      ].join(' ')}
      {...rest}
    />
  );
}

export function DetailsStep({ data, onChange, errors }: DetailsStepProps) {
  const isRenter = data.role === 'renter';
  const isHost = data.role === 'host';

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
        A little about you
      </h2>
      <p className="mt-1.5 text-sm text-gray-500">
        We use this to match you with{' '}
        {isRenter ? 'available listings' : 'qualified renters'}.
      </p>

      <div className="mt-6 flex flex-col gap-4">
        {/* Name */}
        <div>
          <Label htmlFor="name">Full name</Label>
          <div className="mt-1">
            <Input
              id="name"
              type="text"
              value={data.name}
              onChange={(e) => onChange('name', e.target.value)}
              placeholder="Ada Lovelace"
              autoComplete="name"
              hasError={Boolean(errors.name)}
            />
          </div>
          <FieldError message={errors.name} />
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email">Email</Label>
          <div className="mt-1">
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => onChange('email', e.target.value)}
              placeholder="ada@example.com"
              autoComplete="email"
              inputMode="email"
              hasError={Boolean(errors.email)}
            />
          </div>
          <FieldError message={errors.email} />
        </div>

        {/* Phone */}
        <div>
          <Label htmlFor="phone" optional>
            Phone number
          </Label>
          <div className="mt-1">
            <Input
              id="phone"
              type="tel"
              value={data.phone}
              onChange={(e) => onChange('phone', e.target.value)}
              placeholder="+1 (555) 000-0000"
              autoComplete="tel"
              inputMode="tel"
              hasError={Boolean(errors.phone)}
            />
          </div>
          <FieldError message={errors.phone} />
          <p className="mt-1 text-xs text-gray-400">
            For faster match notifications only — no spam.
          </p>
        </div>

        {/* ─── Renter-specific fields ──────────────────────────────────────── */}
        {isRenter && (
          <>
            {/* Move-in date */}
            <div>
              <Label htmlFor="moveInDate" optional>
                Target move-in date
              </Label>
              <div className="mt-1">
                <Input
                  id="moveInDate"
                  type="date"
                  value={data.moveInDate}
                  onChange={(e) => onChange('moveInDate', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  hasError={Boolean(errors.moveInDate)}
                />
              </div>
              <FieldError message={errors.moveInDate} />
            </div>

            {/* Budget */}
            <div>
              <Label htmlFor="budgetMin" optional>
                Monthly budget range
              </Label>
              <div className="mt-1 flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                    $
                  </span>
                  <Input
                    id="budgetMin"
                    type="number"
                    value={data.budgetMin}
                    onChange={(e) => onChange('budgetMin', e.target.value)}
                    placeholder="1500"
                    min="0"
                    max="20000"
                    style={{ paddingLeft: '1.75rem' }}
                    hasError={Boolean(errors.budgetMin)}
                  />
                </div>
                <span className="text-sm text-gray-400">to</span>
                <div className="relative flex-1">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                    $
                  </span>
                  <Input
                    id="budgetMax"
                    type="number"
                    value={data.budgetMax}
                    onChange={(e) => onChange('budgetMax', e.target.value)}
                    placeholder="2500"
                    min="0"
                    max="20000"
                    style={{ paddingLeft: '1.75rem' }}
                    hasError={Boolean(errors.budgetMax)}
                  />
                </div>
              </div>
              <FieldError message={errors.budgetMin || errors.budgetMax} />
            </div>
          </>
        )}

        {/* ─── Host-specific fields ────────────────────────────────────────── */}
        {isHost && (
          <>
            {/* Unit type */}
            <div>
              <Label htmlFor="unitType" optional>
                Unit type
              </Label>
              <div className="mt-1 grid grid-cols-4 gap-2">
                {UNIT_TYPES.map((ut) => {
                  const selected = data.unitType === ut.id;
                  return (
                    <button
                      key={ut.id}
                      type="button"
                      onClick={() => onChange('unitType', ut.id)}
                      className={[
                        'rounded-lg border-2 py-2 text-sm font-medium transition-all',
                        selected
                          ? 'border-brand-600 bg-brand-50 text-brand-700'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-brand-300',
                      ].join(' ')}
                    >
                      {ut.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Available date */}
            <div>
              <Label htmlFor="availableDate" optional>
                Available from
              </Label>
              <div className="mt-1">
                <Input
                  id="availableDate"
                  type="date"
                  value={data.availableDate}
                  onChange={(e) => onChange('availableDate', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  hasError={Boolean(errors.availableDate)}
                />
              </div>
            </div>
          </>
        )}

        {/* Notes */}
        <div>
          <Label htmlFor="notes" optional>
            Anything else we should know?
          </Label>
          <div className="mt-1">
            <textarea
              id="notes"
              value={data.notes}
              onChange={(e) => onChange('notes', e.target.value)}
              placeholder={
                isRenter
                  ? 'e.g. I have a cat, need a desk, prefer ground floor…'
                  : 'e.g. Pet-friendly, parking available, quiet building…'
              }
              rows={3}
              maxLength={500}
              className={[
                'w-full resize-none rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900',
                'placeholder-gray-400 outline-none transition-colors',
                'hover:border-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500',
              ].join(' ')}
            />
          </div>
          <p className="mt-1 text-right text-xs text-gray-400">
            {data.notes.length}/500
          </p>
        </div>

        {/* Referral source */}
        <div>
          <Label htmlFor="referralSource" optional>
            How did you hear about Subletly?
          </Label>
          <div className="mt-1">
            <select
              id="referralSource"
              value={data.referralSource}
              onChange={(e) => onChange('referralSource', e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors hover:border-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500"
            >
              <option value="">Select an option</option>
              <option value="social_media">Social media</option>
              <option value="friend_colleague">Friend or colleague</option>
              <option value="google_search">Google search</option>
              <option value="nursing_community">Nursing / healthcare community</option>
              <option value="reddit">Reddit</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

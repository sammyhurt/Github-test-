'use client';

import { Building2, Search } from 'lucide-react';
import type { WaitlistRole } from '@/types/waitlist';

interface RoleStepProps {
  value: WaitlistRole | '';
  onChange: (role: WaitlistRole) => void;
}

const ROLES: {
  id: WaitlistRole;
  icon: React.ReactNode;
  label: string;
  description: string;
}[] = [
  {
    id: 'renter',
    icon: <Search className="h-7 w-7" />,
    label: 'Renter',
    description: 'I need a furnished room or apartment in Brooklyn.',
  },
  {
    id: 'host',
    icon: <Building2 className="h-7 w-7" />,
    label: 'Host',
    description: 'I have a furnished space I want to list.',
  },
];

export function RoleStep({ value, onChange }: RoleStepProps) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
        Are you a Host or a Renter?
      </h2>
      <p className="mt-1.5 text-sm text-gray-500">
        You can change this anytime in your dashboard later.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {ROLES.map((role) => {
          const selected = value === role.id;
          return (
            <button
              key={role.id}
              type="button"
              onClick={() => onChange(role.id)}
              className={[
                'group relative flex flex-col items-start gap-3 rounded-xl border-2 p-5 text-left transition-all duration-150',
                selected
                  ? 'border-brand-600 bg-brand-50 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-brand-300 hover:bg-gray-50',
              ].join(' ')}
              aria-pressed={selected}
            >
              <span
                className={[
                  'rounded-lg p-2 transition-colors',
                  selected
                    ? 'bg-brand-600 text-white'
                    : 'bg-gray-100 text-gray-500 group-hover:bg-brand-100 group-hover:text-brand-600',
                ].join(' ')}
              >
                {role.icon}
              </span>
              <span>
                <span className="block text-base font-semibold text-gray-900">
                  {role.label}
                </span>
                <span className="mt-0.5 block text-sm text-gray-500">
                  {role.description}
                </span>
              </span>
              {/* Selection indicator */}
              {selected && (
                <span className="absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-full bg-brand-600">
                  <svg
                    className="h-3 w-3 text-white"
                    viewBox="0 0 12 12"
                    fill="none"
                  >
                    <path
                      d="M2 6l3 3 5-5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

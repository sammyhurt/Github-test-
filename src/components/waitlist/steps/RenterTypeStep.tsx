'use client';

import { Stethoscope, GraduationCap, Briefcase, Heart, Users } from 'lucide-react';
import type { RenterType } from '@/types/waitlist';

interface RenterTypeStepProps {
  value: RenterType | '';
  onChange: (type: RenterType) => void;
}

const RENTER_TYPES: {
  id: RenterType;
  icon: React.ReactNode;
  label: string;
  sublabel: string;
}[] = [
  {
    id: 'travel_nurse',
    icon: <Heart className="h-5 w-5" />,
    label: 'Travel Nurse',
    sublabel: 'On assignment, typically 13-week contracts',
  },
  {
    id: 'healthcare_worker',
    icon: <Stethoscope className="h-5 w-5" />,
    label: 'Healthcare Worker',
    sublabel: 'Doctor, PA, tech, therapist, or allied health',
  },
  {
    id: 'student',
    icon: <GraduationCap className="h-5 w-5" />,
    label: 'Student',
    sublabel: 'Grad, med school, or professional program',
  },
  {
    id: 'professional',
    icon: <Briefcase className="h-5 w-5" />,
    label: 'Professional',
    sublabel: 'Relocating, remote worker, or short-term stay',
  },
  {
    id: 'other',
    icon: <Users className="h-5 w-5" />,
    label: 'Other',
    sublabel: "I'm looking for a furnished place for another reason",
  },
];

export function RenterTypeStep({ value, onChange }: RenterTypeStepProps) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
        What best describes you?
      </h2>
      <p className="mt-1.5 text-sm text-gray-500">
        This helps us match you with the right hosts and prioritize your spot.
      </p>

      <div className="mt-6 flex flex-col gap-2.5">
        {RENTER_TYPES.map((type) => {
          const selected = value === type.id;
          return (
            <button
              key={type.id}
              type="button"
              onClick={() => onChange(type.id)}
              className={[
                'flex items-center gap-4 rounded-xl border-2 px-4 py-3.5 text-left transition-all duration-150',
                selected
                  ? 'border-brand-600 bg-brand-50'
                  : 'border-gray-200 bg-white hover:border-brand-300 hover:bg-gray-50',
              ].join(' ')}
              aria-pressed={selected}
            >
              <span
                className={[
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors',
                  selected
                    ? 'bg-brand-600 text-white'
                    : 'bg-gray-100 text-gray-500',
                ].join(' ')}
              >
                {type.icon}
              </span>
              <span className="flex-1">
                <span className="block text-sm font-semibold text-gray-900">
                  {type.label}
                </span>
                <span className="block text-xs text-gray-500">
                  {type.sublabel}
                </span>
              </span>
              <span
                className={[
                  'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                  selected
                    ? 'border-brand-600 bg-brand-600'
                    : 'border-gray-300 bg-white',
                ].join(' ')}
              >
                {selected && (
                  <span className="h-2 w-2 rounded-full bg-white" />
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

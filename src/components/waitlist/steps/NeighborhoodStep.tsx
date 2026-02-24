'use client';

import { MapPin } from 'lucide-react';
import type { Neighborhood } from '@/types/waitlist';

interface NeighborhoodStepProps {
  value: Neighborhood[];
  onChange: (neighborhoods: Neighborhood[]) => void;
  role: string;
}

const NEIGHBORHOODS: {
  id: Neighborhood;
  label: string;
  vibe: string;
}[] = [
  {
    id: 'bushwick',
    label: 'Bushwick',
    vibe: 'Artists, murals, late nights',
  },
  {
    id: 'williamsburg',
    label: 'Williamsburg',
    vibe: 'Cafés, rooftops, L train',
  },
  {
    id: 'bed_stuy',
    label: 'Bed-Stuy',
    vibe: 'Tree-lined blocks, local gems',
  },
  {
    id: 'other_nyc',
    label: 'Other NYC',
    vibe: 'Open to other Brooklyn or NYC neighborhoods',
  },
];

export function NeighborhoodStep({
  value,
  onChange,
  role,
}: NeighborhoodStepProps) {
  function toggle(id: Neighborhood) {
    if (value.includes(id)) {
      onChange(value.filter((n) => n !== id));
    } else {
      onChange([...value, id]);
    }
  }

  const prompt =
    role === 'host'
      ? 'Where is your listing located?'
      : 'Which neighborhoods are you open to?';

  const sub =
    role === 'host'
      ? 'Select all that apply.'
      : 'Select all that work for you — we match based on overlap.';

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">{prompt}</h2>
      <p className="mt-1.5 text-sm text-gray-500">{sub}</p>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {NEIGHBORHOODS.map((n) => {
          const selected = value.includes(n.id);
          return (
            <button
              key={n.id}
              type="button"
              onClick={() => toggle(n.id)}
              className={[
                'flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-all duration-150',
                selected
                  ? 'border-brand-600 bg-brand-50'
                  : 'border-gray-200 bg-white hover:border-brand-300 hover:bg-gray-50',
              ].join(' ')}
              aria-pressed={selected}
            >
              <span
                className={[
                  'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded transition-colors',
                  selected
                    ? 'bg-brand-600 text-white'
                    : 'border-2 border-gray-300 bg-white',
                ].join(' ')}
              >
                {selected && (
                  <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2 6l3 3 5-5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
              <span>
                <span className="flex items-center gap-1.5">
                  <MapPin
                    className={[
                      'h-3.5 w-3.5',
                      selected ? 'text-brand-600' : 'text-gray-400',
                    ].join(' ')}
                  />
                  <span className="text-sm font-semibold text-gray-900">
                    {n.label}
                  </span>
                </span>
                <span className="mt-0.5 block text-xs text-gray-500">
                  {n.vibe}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {value.length > 0 && (
        <p className="mt-3 text-xs text-brand-600 font-medium">
          {value.length} neighborhood{value.length !== 1 ? 's' : ''} selected
        </p>
      )}
    </div>
  );
}

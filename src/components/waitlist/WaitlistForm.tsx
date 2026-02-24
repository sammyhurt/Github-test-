'use client';

import { useState, useCallback, useEffect } from 'react';
import { ChevronLeft, Loader2 } from 'lucide-react';

import { StepIndicator } from './StepIndicator';
import { RoleStep } from './steps/RoleStep';
import { RenterTypeStep } from './steps/RenterTypeStep';
import { NeighborhoodStep } from './steps/NeighborhoodStep';
import { DetailsStep } from './steps/DetailsStep';
import { ConsentStep } from './steps/ConsentStep';
import { SuccessScreen } from './SuccessScreen';

import {
  trackWaitlistStepViewed,
  trackWaitlistSubmitted,
} from '@/lib/analytics';
import type {
  WaitlistFormData,
  WaitlistRole,
  RenterType,
  Neighborhood,
} from '@/types/waitlist';

// ─── Initial state ────────────────────────────────────────────────────────────

const INITIAL: WaitlistFormData = {
  role: '',
  renterType: '',
  neighborhoods: [],
  name: '',
  email: '',
  phone: '',
  moveInDate: '',
  budgetMin: '',
  budgetMax: '',
  unitType: '',
  availableDate: '',
  notes: '',
  referralSource: '',
  consent: false,
  website: '', // honeypot
};

// ─── Step definitions ─────────────────────────────────────────────────────────

type StepId = 'role' | 'renterType' | 'neighborhood' | 'details' | 'consent';

const ALL_STEPS: { id: StepId; label: string }[] = [
  { id: 'role', label: 'Role' },
  { id: 'renterType', label: 'Type' },
  { id: 'neighborhood', label: 'Area' },
  { id: 'details', label: 'Details' },
  { id: 'consent', label: 'Confirm' },
];

function getSteps(role: WaitlistRole | '') {
  if (role === 'host') {
    return ALL_STEPS.filter((s) => s.id !== 'renterType');
  }
  return ALL_STEPS;
}

// ─── Per-step validation ──────────────────────────────────────────────────────

function validateStep(
  stepId: StepId,
  data: WaitlistFormData,
): Partial<Record<keyof WaitlistFormData, string>> {
  const errors: Partial<Record<keyof WaitlistFormData, string>> = {};

  if (stepId === 'role') {
    if (!data.role) errors.role = 'Please select your role.';
  }

  if (stepId === 'renterType') {
    if (data.role === 'renter' && !data.renterType) {
      errors.renterType = 'Please tell us what best describes you.';
    }
  }

  if (stepId === 'neighborhood') {
    if (data.neighborhoods.length === 0) {
      errors.neighborhoods = 'Please select at least one neighborhood.';
    }
  }

  if (stepId === 'details') {
    if (!data.name.trim() || data.name.trim().length < 2)
      errors.name = 'Please enter your full name.';
    if (!data.email.trim() || !/^[^@]+@[^@]+\.[^@]+$/.test(data.email))
      errors.email = 'Please enter a valid email address.';
    if (
      data.phone &&
      !/^[\d\s\-\+\(\)]{7,20}$/.test(data.phone)
    )
      errors.phone = 'Please enter a valid phone number.';
    if (
      data.budgetMin &&
      data.budgetMax &&
      Number(data.budgetMin) > Number(data.budgetMax)
    ) {
      errors.budgetMin = 'Minimum budget cannot exceed the maximum.';
    }
  }

  if (stepId === 'consent') {
    if (!data.consent)
      errors.consent = 'You must agree to the terms to join the waitlist.';
  }

  return errors;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function WaitlistForm() {
  const [data, setData] = useState<WaitlistFormData>(INITIAL);
  const [stepIndex, setStepIndex] = useState(0);
  const [errors, setErrors] = useState<
    Partial<Record<keyof WaitlistFormData, string>>
  >({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [waitlistPosition, setWaitlistPosition] = useState(1);

  const steps = getSteps(data.role);
  const currentStep = steps[stepIndex];
  const isLastStep = stepIndex === steps.length - 1;

  // Track step views
  useEffect(() => {
    if (currentStep) {
      trackWaitlistStepViewed(stepIndex + 1, currentStep.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex]);

  // Recalculate steps when role changes — if we were on renterType and now host, skip back
  useEffect(() => {
    const newSteps = getSteps(data.role);
    if (stepIndex >= newSteps.length) {
      setStepIndex(newSteps.length - 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.role]);

  const updateField = useCallback(
    (field: keyof WaitlistFormData, value: unknown) => {
      setData((prev) => ({ ...prev, [field]: value }));
      // Clear the error for the field being edited
      setErrors((prev) => {
        if (!prev[field]) return prev;
        const next = { ...prev };
        delete next[field];
        return next;
      });
    },
    [],
  );

  function handleNext() {
    const errs = validateStep(currentStep.id, data);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleBack() {
    setErrors({});
    setStepIndex((i) => Math.max(i - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSubmit() {
    const errs = validateStep('consent', data);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        role: data.role,
        renterType: data.renterType || undefined,
        neighborhoods: data.neighborhoods,
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone.trim() || undefined,
        moveInDate: data.moveInDate || undefined,
        budgetMin: data.budgetMin ? Number(data.budgetMin) : undefined,
        budgetMax: data.budgetMax ? Number(data.budgetMax) : undefined,
        unitType: data.unitType || undefined,
        availableDate: data.availableDate || undefined,
        notes: data.notes.trim() || undefined,
        referralSource: data.referralSource || undefined,
        consent: data.consent,
        website: data.website, // honeypot
      };

      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        setSubmitError(
          json.message || 'Something went wrong. Please try again.',
        );
        return;
      }

      // Analytics
      trackWaitlistSubmitted({
        role: data.role,
        neighborhood: data.neighborhoods[0] ?? 'unknown',
        renterType: data.renterType || null,
      });

      setWaitlistPosition(json.position ?? 1);
      setSubmitted(true);
    } catch {
      setSubmitError(
        'Network error — please check your connection and try again.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  // ─── Render ─────────────────────────────────────────────────────────────────

  if (submitted) {
    return (
      <SuccessScreen
        role={data.role as WaitlistRole}
        name={data.name}
        position={waitlistPosition}
      />
    );
  }

  return (
    <div>
      <StepIndicator steps={steps} currentStep={stepIndex} />

      {/* Step content */}
      <div className="min-h-[320px]">
        {currentStep.id === 'role' && (
          <RoleStep
            value={data.role}
            onChange={(v) => {
              updateField('role', v);
              // Reset renter-specific fields when switching roles
              if (v === 'host') updateField('renterType', '');
            }}
          />
        )}

        {currentStep.id === 'renterType' && (
          <RenterTypeStep
            value={data.renterType}
            onChange={(v) => updateField('renterType', v)}
          />
        )}

        {currentStep.id === 'neighborhood' && (
          <NeighborhoodStep
            value={data.neighborhoods as Neighborhood[]}
            onChange={(v) => updateField('neighborhoods', v)}
            role={data.role}
          />
        )}

        {currentStep.id === 'details' && (
          <DetailsStep
            data={data}
            onChange={(field, value) => updateField(field, value)}
            errors={errors}
          />
        )}

        {currentStep.id === 'consent' && (
          <ConsentStep
            data={data}
            onChange={(field, value) => updateField(field, value)}
            errors={errors}
          />
        )}
      </div>

      {/* Inline validation errors for non-field-level errors */}
      {errors.role && currentStep.id === 'role' && (
        <p className="mt-3 text-sm text-red-600" role="alert">
          {errors.role}
        </p>
      )}
      {errors.renterType && currentStep.id === 'renterType' && (
        <p className="mt-3 text-sm text-red-600" role="alert">
          {errors.renterType}
        </p>
      )}
      {errors.neighborhoods && currentStep.id === 'neighborhood' && (
        <p className="mt-3 text-sm text-red-600" role="alert">
          {errors.neighborhoods}
        </p>
      )}

      {/* Submit error */}
      {submitError && (
        <div
          className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          role="alert"
        >
          {submitError}
        </div>
      )}

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between gap-3">
        {stepIndex > 0 ? (
          <button
            type="button"
            onClick={handleBack}
            disabled={submitting}
            className="flex items-center gap-1.5 rounded-xl border-2 border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-50 disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>
        ) : (
          <div />
        )}

        {isLastStep ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="flex min-w-[160px] items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting…
              </>
            ) : (
              'Join the waitlist'
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            className="flex min-w-[120px] items-center justify-center rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
          >
            Continue
          </button>
        )}
      </div>

      {/* Step counter */}
      <p className="mt-4 text-center text-xs text-gray-400">
        Step {stepIndex + 1} of {steps.length}
      </p>
    </div>
  );
}

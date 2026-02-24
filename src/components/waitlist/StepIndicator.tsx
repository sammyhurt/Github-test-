'use client';

import { Check } from 'lucide-react';

interface Step {
  label: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number; // 0-indexed
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <nav aria-label="Form progress" className="mb-8">
      <ol className="flex items-center justify-center gap-0">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isUpcoming = index > currentStep;

          return (
            <li key={step.label} className="flex items-center">
              {/* Step circle */}
              <div className="flex flex-col items-center">
                <div
                  className={[
                    'flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors duration-200',
                    isCompleted
                      ? 'bg-brand-600 text-white'
                      : isCurrent
                        ? 'border-2 border-brand-600 bg-white text-brand-600'
                        : 'border-2 border-gray-200 bg-white text-gray-400',
                  ].join(' ')}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" strokeWidth={2.5} />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <span
                  className={[
                    'mt-1.5 hidden text-xs font-medium sm:block',
                    isCurrent
                      ? 'text-brand-600'
                      : isCompleted
                        ? 'text-gray-600'
                        : 'text-gray-400',
                  ].join(' ')}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={[
                    'mx-1 mt-[-1rem] h-0.5 w-10 sm:w-16 transition-colors duration-200',
                    isCompleted ? 'bg-brand-600' : 'bg-gray-200',
                  ].join(' ')}
                  aria-hidden
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

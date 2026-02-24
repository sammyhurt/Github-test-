import { z } from 'zod';

export const NEIGHBORHOODS = [
  'bushwick',
  'williamsburg',
  'bed_stuy',
  'other_nyc',
] as const;

export const RENTER_TYPES = [
  'travel_nurse',
  'healthcare_worker',
  'student',
  'professional',
  'other',
] as const;

export const UNIT_TYPES = ['studio', '1br', '2br', '3br_plus'] as const;

export const waitlistSchema = z
  .object({
    role: z.enum(['host', 'renter'], {
      required_error: 'Please select your role.',
    }),
    renterType: z.enum(RENTER_TYPES).optional(),
    neighborhoods: z
      .array(z.enum(NEIGHBORHOODS))
      .min(1, 'Please select at least one neighborhood.'),
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters.')
      .max(80, 'Name is too long.')
      .trim(),
    email: z
      .string()
      .email('Please enter a valid email address.')
      .max(254, 'Email is too long.')
      .toLowerCase()
      .trim(),
    phone: z
      .string()
      .regex(/^[\d\s\-\+\(\)]{7,20}$/, 'Please enter a valid phone number.')
      .optional()
      .or(z.literal('')),
    // Renter-specific
    moveInDate: z.string().optional().or(z.literal('')),
    budgetMin: z.number().int().min(0).max(20000).optional(),
    budgetMax: z.number().int().min(0).max(20000).optional(),
    // Host-specific
    unitType: z.enum(UNIT_TYPES).optional(),
    availableDate: z.string().optional().or(z.literal('')),
    // Optional
    notes: z.string().max(500, 'Notes must be under 500 characters.').optional().or(z.literal('')),
    referralSource: z.string().max(100).optional().or(z.literal('')),
    consent: z.literal(true, {
      errorMap: () => ({
        message: 'You must agree to the terms to join the waitlist.',
      }),
    }),
    // Honeypot — must be absent or empty
    website: z.string().max(0).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === 'renter' && !data.renterType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please tell us what best describes you.',
        path: ['renterType'],
      });
    }
    if (
      data.budgetMin !== undefined &&
      data.budgetMax !== undefined &&
      data.budgetMin > data.budgetMax
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Budget minimum cannot exceed the maximum.',
        path: ['budgetMin'],
      });
    }
  });

export type WaitlistSchemaInput = z.input<typeof waitlistSchema>;
export type WaitlistSchemaOutput = z.output<typeof waitlistSchema>;

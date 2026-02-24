export type WaitlistRole = 'host' | 'renter';

export type RenterType =
  | 'travel_nurse'
  | 'healthcare_worker'
  | 'student'
  | 'professional'
  | 'other';

export type Neighborhood =
  | 'bushwick'
  | 'williamsburg'
  | 'bed_stuy'
  | 'other_nyc';

export type UnitType = 'studio' | '1br' | '2br' | '3br_plus';

// The shape of the multi-step form (client-side)
export interface WaitlistFormData {
  // Step 1
  role: WaitlistRole | '';
  // Step 2 — renters only
  renterType: RenterType | '';
  // Step 3
  neighborhoods: Neighborhood[];
  // Step 4 — shared contact
  name: string;
  email: string;
  phone: string;
  // Step 4 — renter-specific
  moveInDate: string; // ISO date string
  budgetMin: string;
  budgetMax: string;
  // Step 4 — host-specific
  unitType: UnitType | '';
  availableDate: string; // ISO date string
  // Step 4 — optional
  notes: string;
  referralSource: string;
  // Step 5 — consent
  consent: boolean;
  // Anti-spam honeypot (hidden field — must stay empty)
  website: string;
}

// The shape stored in the database / returned from the API
export interface WaitlistSubmission {
  id: string;
  createdAt: string; // ISO datetime
  role: WaitlistRole;
  renterType: RenterType | null;
  neighborhoods: Neighborhood[];
  name: string;
  email: string;
  phone: string | null;
  moveInDate: string | null;
  budgetMin: number | null;
  budgetMax: number | null;
  unitType: UnitType | null;
  availableDate: string | null;
  notes: string | null;
  referralSource: string | null;
  consent: boolean;
  ipAddress: string | null;
  isSpam: boolean;
}

// Payload sent to the API
export interface WaitlistApiPayload {
  role: WaitlistRole;
  renterType?: RenterType;
  neighborhoods: Neighborhood[];
  name: string;
  email: string;
  phone?: string;
  moveInDate?: string;
  budgetMin?: number;
  budgetMax?: number;
  unitType?: UnitType;
  availableDate?: string;
  notes?: string;
  referralSource?: string;
  consent: boolean;
  website?: string; // honeypot
}

export interface WaitlistApiResponse {
  success: boolean;
  message: string;
  position?: number; // waitlist position
}

export interface AdminFilters {
  role?: WaitlistRole | 'all';
  neighborhood?: Neighborhood | 'all';
  renterType?: RenterType | 'all';
  search?: string;
}

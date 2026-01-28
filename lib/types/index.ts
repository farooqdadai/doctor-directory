// Core doctor type
export interface Doctor {
  id: number;
  npi: string;
  fullName: string;
  slug: string;
  specialty: string;
  specialtySlug: string;
  subSpecialty: string | null;
  practiceName: string | null;
  website: string | null;
  city: string;
  citySlug: string;
  state: string;
  stateSlug: string;
  email: string | null;
  phone: string | null;
  linkedin: string | null;
  profileStatus: 'Active' | 'Inactive';
  isVerified: boolean;
  isFeatured: boolean;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

// Database row type (snake_case)
export interface DoctorRow {
  id: number;
  npi: string;
  full_name: string;
  slug: string;
  specialty: string;
  specialty_slug: string;
  sub_specialty: string | null;
  practice_name: string | null;
  website: string | null;
  city: string;
  city_slug: string;
  state: string;
  state_slug: string;
  email: string | null;
  phone: string | null;
  linkedin: string | null;
  profile_status: string;
  is_verified: number;
  is_featured: number;
  priority: number;
  created_at: string;
  updated_at: string;
}

// Search parameters
export interface SearchParams {
  query?: string;
  specialty?: string;
  state?: string;
  city?: string;
  verifiedOnly?: boolean;
  featuredOnly?: boolean;
  sort?: SortOption;
  page?: number;
  limit?: number;
}

export type SortOption = 'best_match' | 'a_z' | 'featured' | 'verified';

// Search results
export interface SearchResults {
  doctors: Doctor[];
  total: number;
  page: number;
  totalPages: number;
}

// Specialty type
export interface Specialty {
  id?: number;
  name: string;
  slug: string;
  count: number;
  doctorCount?: number; // alias for count (for backwards compatibility)
}

// Location type
export interface Location {
  id?: number;
  city: string;
  citySlug: string;
  state: string;
  stateSlug: string;
  count: number;
  doctorCount?: number; // alias for count (for backwards compatibility)
}

// Sync stats
export interface SyncStats {
  processed: number;
  added: number;
  updated: number;
  unchanged: number;
  errors: string[];
}

// Google Sheets row
export interface SheetRow {
  npi: string;
  fullName: string;
  specialty: string;
  subSpecialty: string | null;
  practiceName: string | null;
  website: string | null;
  city: string;
  state: string;
  email: string | null;
  phone: string | null;
  linkedin: string | null;
  profileStatus: string;
  isVerified: boolean;
  isFeatured: boolean;
  priority: number;
}

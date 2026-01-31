// Core doctor type - Extended with all Google Sheet fields
export interface Doctor {
  id: number;
  npi: string;

  // Name fields
  firstName: string;
  middleName: string | null;
  lastName: string;
  fullName: string; // Computed: firstName + middleName + lastName
  slug: string;

  // Professional info
  specialty: string;
  specialtySlug: string;
  licenseState: string | null;
  hospitalAffiliation: string | null;

  // Contact info
  email: string | null; // Definitive Email
  workEmail: string | null;
  personalEmail: string | null;
  phone: string | null; // Definitive Number
  directPhone: string | null;
  mobilePhone: string | null;
  fax: string | null;
  linkedin: string | null;

  // Person Address
  personStreet: string | null;
  personCity: string | null;
  personState: string | null;
  personZip: string | null;

  // Location (for search/display)
  city: string;
  citySlug: string;
  state: string;
  stateSlug: string;

  // Practice/Company info
  practiceName: string | null; // Practice Location Name
  company: string | null;
  companyName: string | null;
  website: string | null;
  companyPhone: string | null;
  companyLinkedin: string | null;
  companyFacebook: string | null;
  companyTwitter: string | null;

  // Company Address
  companyStreet: string | null;
  companyCity: string | null;
  companyState: string | null;
  companyZip: string | null;

  // Status flags
  profileStatus: 'Active' | 'Inactive';
  isVerified: boolean;
  isFeatured: boolean;
  priority: number;

  // Timestamps
  createdAt: string;
  updatedAt: string;
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
  doctorCount?: number;
}

// Location type
export interface Location {
  id?: number;
  city: string;
  citySlug: string;
  state: string;
  stateSlug: string;
  count: number;
  doctorCount?: number;
}

// Sync stats
export interface SyncStats {
  processed: number;
  added: number;
  updated: number;
  unchanged: number;
  errors: string[];
}

// Sheet row for legacy sync (Phase 2 - database sync)
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

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

// Hospital type - From USAHospitals-1 sheet
export interface Hospital {
  id: string; // HOSPITAL_ID
  name: string;
  slug: string;

  // Address
  address: string;
  city: string;
  citySlug: string;
  state: string;
  stateSlug: string;
  zip: string;
  county: string | null;

  // Contact
  telephone: string | null;
  website: string | null;

  // Hospital Info
  type: string | null; // Hospital type (General, Specialty, etc.)
  typeSlug: string | null;
  beds: number | null;
  trauma: string | null; // Trauma level
  services: string | null;

  // Google Info
  googleMapLink: string | null;
  googleRating: number | null;

  // Accessibility & Amenities
  accessibilityCheck: string | null;
  accessibilityUncheck: string | null;
  payments: string | null;
  amenitiesCheck: string | null;
  parkingCheck: string | null;

  // Branding
  logo: string | null;

  // Social Media
  facebook: string | null;
  instagram: string | null;
  linkedin: string | null;
  twitter: string | null; // X
  youtube: string | null;
}

// Hospital search parameters
export interface HospitalSearchParams {
  query?: string;
  state?: string;
  city?: string;
  type?: string;
  county?: string;
  hasTrauma?: boolean;
  minBeds?: number;
  maxBeds?: number;
  sort?: HospitalSortOption;
  page?: number;
  limit?: number;
}

export type HospitalSortOption = 'name_asc' | 'name_desc' | 'rating' | 'beds';

// Hospital search results
export interface HospitalSearchResults {
  hospitals: Hospital[];
  total: number;
  page: number;
  totalPages: number;
}

// Hospital type (category)
export interface HospitalType {
  name: string;
  slug: string;
  count: number;
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

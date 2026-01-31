import { google } from 'googleapis';
import { slugify, generateDoctorSlug } from '../utils/slugify';
import type { Doctor, Specialty, Location, Hospital, HospitalSearchParams, HospitalSearchResults, HospitalType } from '../types';

// Re-export types
export type { Doctor, Specialty, Location, Hospital, HospitalType };

// Cache for Google Sheets data (refreshes every 5 minutes)
let cachedDoctors: Doctor[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Get Google Sheets client
function getGoogleSheetsClient() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!email || !privateKey) {
    throw new Error('Google Sheets credentials not configured');
  }

  privateKey = privateKey
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '')
    .replace(/"/g, '');

  console.log('[Sheets] Private key length:', privateKey.length);

  const auth = new google.auth.JWT({
    email,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  return google.sheets({ version: 'v4', auth });
}

// Helper to get cell value safely
function getCell(row: string[], index: number): string | null {
  const value = row[index]?.toString().trim();
  return value && value.length > 0 ? value : null;
}

// Fetch all doctors from Google Sheets
export async function fetchDoctorsFromSheets(): Promise<Doctor[]> {
  if (cachedDoctors && Date.now() - cacheTimestamp < CACHE_DURATION) {
    console.log('[Sheets] Returning cached data');
    return cachedDoctors;
  }

  console.log('[Sheets] Fetching fresh data from Google Sheets...');

  const sheets = getGoogleSheetsClient();
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  if (!spreadsheetId) {
    throw new Error('GOOGLE_SHEET_ID not configured');
  }

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'USA-doctors-data-1!A:AG', // Columns A through AG (33 columns)
    });

    const rows = response.data.values;
    if (!rows || rows.length < 2) {
      console.log('[Sheets] No data found');
      return [];
    }

    // Column mapping based on new structure:
    // A(0): First Name_1
    // B(1): Middle Name
    // C(2): Last Name_1
    // D(3): Primary Specialty
    // E(4): Definitive Email
    // F(5): Work Email
    // G(6): Personal Email
    // H(7): Definitive Number
    // I(8): Direct Phone Number
    // J(9): Mobile phone
    // K(10): LinkedIn Contact Profile URL
    // L(11): Provider License State
    // M(12): City
    // N(13): State
    // O(14): Practice Location Name
    // P(15): Primary Hospital Affiliation
    // Q(16): NPI
    // R(17): Company
    // S(18): Person Street
    // T(19): Person City
    // U(20): Person State
    // V(21): Person Zip Code
    // W(22): Company Name
    // X(23): Website
    // Y(24): Company HQ Phone
    // Z(25): Fax
    // AA(26): LinkedIn Company Profile URL
    // AB(27): Facebook Company Profile URL
    // AC(28): Twitter Company Profile URL
    // AD(29): Company Street Address
    // AE(30): Company City
    // AF(31): Company State
    // AG(32): Company Zip Code

    const doctors: Doctor[] = [];
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];

      const firstName = getCell(row, 0) || '';
      const middleName = getCell(row, 1);
      const lastName = getCell(row, 2) || '';
      const specialty = getCell(row, 3) || 'General Practice';
      const city = getCell(row, 12) || '';
      const state = getCell(row, 13) || '';
      const npi = getCell(row, 16) || '';

      // Skip rows without essential data
      if (!firstName || !lastName || !city || !state) continue;

      // Build full name
      const fullName = middleName
        ? `${firstName} ${middleName} ${lastName}`
        : `${firstName} ${lastName}`;

      const now = new Date().toISOString();

      const doctor: Doctor = {
        id: i,
        npi: npi || `TEMP-${i}`,

        // Name fields
        firstName,
        middleName,
        lastName,
        fullName,
        slug: generateDoctorSlug(fullName, npi || `temp-${i}`),

        // Professional info
        specialty,
        specialtySlug: slugify(specialty),
        licenseState: getCell(row, 11),
        hospitalAffiliation: getCell(row, 15),

        // Contact info
        email: getCell(row, 4),
        workEmail: getCell(row, 5),
        personalEmail: getCell(row, 6),
        phone: getCell(row, 7),
        directPhone: getCell(row, 8),
        mobilePhone: getCell(row, 9),
        fax: getCell(row, 25),
        linkedin: getCell(row, 10),

        // Person Address
        personStreet: getCell(row, 18),
        personCity: getCell(row, 19),
        personState: getCell(row, 20),
        personZip: getCell(row, 21),

        // Location (for search/display)
        city,
        citySlug: slugify(city),
        state,
        stateSlug: state.toLowerCase(),

        // Practice/Company info
        practiceName: getCell(row, 14),
        company: getCell(row, 17),
        companyName: getCell(row, 22),
        website: getCell(row, 23),
        companyPhone: getCell(row, 24),
        companyLinkedin: getCell(row, 26),
        companyFacebook: getCell(row, 27),
        companyTwitter: getCell(row, 28),

        // Company Address
        companyStreet: getCell(row, 29),
        companyCity: getCell(row, 30),
        companyState: getCell(row, 31),
        companyZip: getCell(row, 32),

        // Status flags (default values since not in sheet)
        profileStatus: 'Active',
        isVerified: !!npi, // Verified if has NPI
        isFeatured: false,
        priority: 50,

        // Timestamps
        createdAt: now,
        updatedAt: now,
      };

      doctors.push(doctor);
    }

    console.log(`[Sheets] Fetched ${doctors.length} doctors`);

    cachedDoctors = doctors;
    cacheTimestamp = Date.now();

    return doctors;
  } catch (error) {
    console.error('[Sheets] Error fetching data:', error);
    throw error;
  }
}

// Calculate ranking score
function calculateScore(doctor: Doctor): number {
  let score = 0;
  if (doctor.isFeatured) score += 200;
  if (doctor.isVerified) score += 100;
  score += doctor.priority;
  return score;
}

// Sort doctors by ranking
function sortDoctors(doctors: Doctor[], sortBy: string = 'rank'): Doctor[] {
  return [...doctors].sort((a, b) => {
    switch (sortBy) {
      case 'name':
      case 'a_z':
        return a.fullName.localeCompare(b.fullName);
      case 'rank':
      case 'best_match':
      default:
        const scoreA = calculateScore(a);
        const scoreB = calculateScore(b);
        if (scoreB !== scoreA) return scoreB - scoreA;
        return a.fullName.localeCompare(b.fullName);
    }
  });
}

// Get all specialties with counts
export async function getSpecialties(): Promise<Specialty[]> {
  const doctors = await fetchDoctorsFromSheets();
  const specialtyMap = new Map<string, { name: string; slug: string; count: number }>();

  for (const doctor of doctors) {
    if (doctor.profileStatus !== 'Active') continue;

    const existing = specialtyMap.get(doctor.specialtySlug);
    if (existing) {
      existing.count++;
    } else {
      specialtyMap.set(doctor.specialtySlug, {
        name: doctor.specialty,
        slug: doctor.specialtySlug,
        count: 1,
      });
    }
  }

  return Array.from(specialtyMap.values()).sort((a, b) => b.count - a.count);
}

// Get all locations with counts
export async function getLocations(): Promise<Location[]> {
  const doctors = await fetchDoctorsFromSheets();
  const locationMap = new Map<string, Location>();

  for (const doctor of doctors) {
    if (doctor.profileStatus !== 'Active') continue;

    const key = `${doctor.stateSlug}-${doctor.citySlug}`;
    const existing = locationMap.get(key);
    if (existing) {
      existing.count++;
    } else {
      locationMap.set(key, {
        city: doctor.city,
        citySlug: doctor.citySlug,
        state: doctor.state,
        stateSlug: doctor.stateSlug,
        count: 1,
      });
    }
  }

  return Array.from(locationMap.values()).sort((a, b) => b.count - a.count);
}

// Get featured doctors
export async function getFeaturedDoctors(limit: number = 6): Promise<Doctor[]> {
  const doctors = await fetchDoctorsFromSheets();
  // Since we don't have featured flag, return top verified doctors
  return sortDoctors(
    doctors.filter(d => d.profileStatus === 'Active' && d.isVerified)
  ).slice(0, limit);
}

// Get total doctor count
export async function getTotalDoctorCount(): Promise<number> {
  const doctors = await fetchDoctorsFromSheets();
  return doctors.filter(d => d.profileStatus === 'Active').length;
}

// Get doctor by slug
export async function getDoctorBySlug(slug: string): Promise<Doctor | null> {
  const doctors = await fetchDoctorsFromSheets();
  return doctors.find(d => d.slug === slug && d.profileStatus === 'Active') || null;
}

// Search parameters
export interface SearchParams {
  query?: string;
  specialty?: string;
  state?: string;
  city?: string;
  verifiedOnly?: boolean;
  featuredOnly?: boolean;
  sort?: string;
  page?: number;
  limit?: number;
}

// Search results
export interface SearchResults {
  doctors: Doctor[];
  total: number;
  page: number;
  totalPages: number;
}

export async function searchDoctors(params: SearchParams): Promise<SearchResults> {
  const {
    query,
    specialty,
    state,
    city,
    verifiedOnly = false,
    featuredOnly = false,
    sort = 'rank',
    page = 1,
    limit = 12,
  } = params;

  let doctors = await fetchDoctorsFromSheets();

  // Filter active doctors
  doctors = doctors.filter(d => d.profileStatus === 'Active');

  // Apply filters
  if (query) {
    const q = query.toLowerCase();
    doctors = doctors.filter(d =>
      d.fullName.toLowerCase().includes(q) ||
      d.firstName.toLowerCase().includes(q) ||
      d.lastName.toLowerCase().includes(q) ||
      d.specialty.toLowerCase().includes(q) ||
      d.city.toLowerCase().includes(q) ||
      (d.practiceName && d.practiceName.toLowerCase().includes(q)) ||
      (d.companyName && d.companyName.toLowerCase().includes(q)) ||
      (d.hospitalAffiliation && d.hospitalAffiliation.toLowerCase().includes(q))
    );
  }

  if (specialty) {
    doctors = doctors.filter(d => d.specialtySlug === specialty);
  }

  if (state) {
    doctors = doctors.filter(d => d.stateSlug === state.toLowerCase());
  }

  if (city) {
    doctors = doctors.filter(d => d.citySlug === city.toLowerCase());
  }

  if (verifiedOnly) {
    doctors = doctors.filter(d => d.isVerified);
  }

  if (featuredOnly) {
    doctors = doctors.filter(d => d.isFeatured);
  }

  // Sort
  doctors = sortDoctors(doctors, sort);

  // Paginate
  const total = doctors.length;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  doctors = doctors.slice(offset, offset + limit);

  return { doctors, total, page, totalPages };
}

// Get doctors by specialty
export async function getDoctorsBySpecialty(specialtySlug: string, limit?: number): Promise<Doctor[]> {
  const result = await searchDoctors({ specialty: specialtySlug, limit: limit || 100 });
  return result.doctors;
}

// Get doctors by location
export async function getDoctorsByLocation(state: string, city: string, limit?: number): Promise<Doctor[]> {
  const result = await searchDoctors({ state, city, limit: limit || 100 });
  return result.doctors;
}

// Get related doctors (same specialty or location, excluding current doctor)
export async function getRelatedDoctors(doctor: Doctor, limit: number = 3): Promise<Doctor[]> {
  const doctors = await fetchDoctorsFromSheets();

  const related = doctors
    .filter(d =>
      d.npi !== doctor.npi &&
      d.profileStatus === 'Active' &&
      (d.specialtySlug === doctor.specialtySlug || (d.stateSlug === doctor.stateSlug && d.citySlug === doctor.citySlug))
    );

  return sortDoctors(related).slice(0, limit);
}

// ============================================
// HOSPITAL DATA FUNCTIONS
// ============================================

// Cache for Hospitals data
let cachedHospitals: Hospital[] | null = null;
let hospitalCacheTimestamp: number = 0;

// Fetch all hospitals from Google Sheets
export async function fetchHospitalsFromSheets(): Promise<Hospital[]> {
  if (cachedHospitals && Date.now() - hospitalCacheTimestamp < CACHE_DURATION) {
    console.log('[Sheets] Returning cached hospital data');
    return cachedHospitals;
  }

  console.log('[Sheets] Fetching fresh hospital data from Google Sheets...');

  const sheets = getGoogleSheetsClient();
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  if (!spreadsheetId) {
    throw new Error('GOOGLE_SHEET_ID not configured');
  }

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'USAHospitals-1!A:Z', // Columns A through Z (26 columns)
    });

    const rows = response.data.values;
    if (!rows || rows.length < 2) {
      console.log('[Sheets] No hospital data found');
      return [];
    }

    // Column mapping based on provided structure:
    // A(0): HOSPITAL_ID
    // B(1): NAME
    // C(2): ADDRESS
    // D(3): CITY
    // E(4): STATE
    // F(5): ZIP
    // G(6): COUNTY
    // H(7): TELEPHONE
    // I(8): TYPE
    // J(9): WEBSITE
    // K(10): BEDS
    // L(11): TRAUMA
    // M(12): Services
    // N(13): Google Map Link
    // O(14): Google Rating
    // P(15): Accessibility Check
    // Q(16): Accessibility UnCheck
    // R(17): Payments
    // S(18): Amenities Check
    // T(19): Parking Check
    // U(20): Logo
    // V(21): Facebook
    // W(22): Instagram
    // X(23): LinkedIn
    // Y(24): X (Twitter)
    // Z(25): YouTube

    const hospitals: Hospital[] = [];
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];

      const hospitalId = getCell(row, 0);
      const name = getCell(row, 1);
      const city = getCell(row, 3);
      const state = getCell(row, 4);

      // Skip rows without essential data
      if (!name || !city || !state) continue;

      const hospitalType = getCell(row, 8);
      const bedsStr = getCell(row, 10);
      const ratingStr = getCell(row, 14);

      const hospital: Hospital = {
        id: hospitalId || `H-${i}`,
        name,
        slug: slugify(name) + '-' + slugify(city) + '-' + state.toLowerCase(),

        // Address
        address: getCell(row, 2) || '',
        city,
        citySlug: slugify(city),
        state,
        stateSlug: state.toLowerCase(),
        zip: getCell(row, 5) || '',
        county: getCell(row, 6),

        // Contact
        telephone: getCell(row, 7),
        website: getCell(row, 9),

        // Hospital Info
        type: hospitalType,
        typeSlug: hospitalType ? slugify(hospitalType) : null,
        beds: bedsStr ? parseInt(bedsStr, 10) || null : null,
        trauma: getCell(row, 11),
        services: getCell(row, 12),

        // Google Info
        googleMapLink: getCell(row, 13),
        googleRating: ratingStr ? parseFloat(ratingStr) || null : null,

        // Accessibility & Amenities
        accessibilityCheck: getCell(row, 15),
        accessibilityUncheck: getCell(row, 16),
        payments: getCell(row, 17),
        amenitiesCheck: getCell(row, 18),
        parkingCheck: getCell(row, 19),

        // Branding
        logo: getCell(row, 20),

        // Social Media
        facebook: getCell(row, 21),
        instagram: getCell(row, 22),
        linkedin: getCell(row, 23),
        twitter: getCell(row, 24),
        youtube: getCell(row, 25),
      };

      hospitals.push(hospital);
    }

    console.log(`[Sheets] Fetched ${hospitals.length} hospitals`);

    cachedHospitals = hospitals;
    hospitalCacheTimestamp = Date.now();

    return hospitals;
  } catch (error: unknown) {
    console.error('[Sheets] Error fetching hospital data:', error);
    // Provide more specific error message
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    if (errorMessage.includes('Unable to parse range')) {
      throw new Error('Hospital sheet "USAHospitals-1" not found. Please check the sheet name in Google Sheets.');
    }
    throw new Error(`Failed to fetch hospital data: ${errorMessage}`);
  }
}

// Sort hospitals
function sortHospitals(hospitals: Hospital[], sortBy: string = 'name_asc'): Hospital[] {
  return [...hospitals].sort((a, b) => {
    switch (sortBy) {
      case 'name_desc':
        return b.name.localeCompare(a.name);
      case 'rating':
        const ratingA = a.googleRating || 0;
        const ratingB = b.googleRating || 0;
        return ratingB - ratingA;
      case 'beds':
        const bedsA = a.beds || 0;
        const bedsB = b.beds || 0;
        return bedsB - bedsA;
      case 'name_asc':
      default:
        return a.name.localeCompare(b.name);
    }
  });
}

// Search hospitals
export async function searchHospitals(params: HospitalSearchParams): Promise<HospitalSearchResults> {
  const {
    query,
    state,
    city,
    type,
    county,
    hasTrauma = false,
    minBeds,
    maxBeds,
    sort = 'name_asc',
    page = 1,
    limit = 12,
  } = params;

  let hospitals = await fetchHospitalsFromSheets();

  // Apply filters
  if (query) {
    const q = query.toLowerCase();
    hospitals = hospitals.filter(h =>
      h.name.toLowerCase().includes(q) ||
      h.city.toLowerCase().includes(q) ||
      (h.county && h.county.toLowerCase().includes(q)) ||
      (h.type && h.type.toLowerCase().includes(q)) ||
      (h.services && h.services.toLowerCase().includes(q))
    );
  }

  if (state) {
    hospitals = hospitals.filter(h => h.stateSlug === state.toLowerCase());
  }

  if (city) {
    hospitals = hospitals.filter(h => h.citySlug === city.toLowerCase());
  }

  if (type) {
    hospitals = hospitals.filter(h => h.typeSlug === type.toLowerCase());
  }

  if (county) {
    hospitals = hospitals.filter(h => h.county && slugify(h.county) === county.toLowerCase());
  }

  if (hasTrauma) {
    hospitals = hospitals.filter(h => h.trauma && h.trauma.length > 0);
  }

  if (minBeds !== undefined) {
    hospitals = hospitals.filter(h => h.beds && h.beds >= minBeds);
  }

  if (maxBeds !== undefined) {
    hospitals = hospitals.filter(h => h.beds && h.beds <= maxBeds);
  }

  // Sort
  hospitals = sortHospitals(hospitals, sort);

  // Paginate
  const total = hospitals.length;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  hospitals = hospitals.slice(offset, offset + limit);

  return { hospitals, total, page, totalPages };
}

// Get hospital by slug
export async function getHospitalBySlug(slug: string): Promise<Hospital | null> {
  const hospitals = await fetchHospitalsFromSheets();
  return hospitals.find(h => h.slug === slug) || null;
}

// Get all hospital types with counts
export async function getHospitalTypes(): Promise<HospitalType[]> {
  const hospitals = await fetchHospitalsFromSheets();
  const typeMap = new Map<string, { name: string; slug: string; count: number }>();

  for (const hospital of hospitals) {
    if (!hospital.type) continue;

    const slug = hospital.typeSlug || slugify(hospital.type);
    const existing = typeMap.get(slug);
    if (existing) {
      existing.count++;
    } else {
      typeMap.set(slug, {
        name: hospital.type,
        slug,
        count: 1,
      });
    }
  }

  return Array.from(typeMap.values()).sort((a, b) => b.count - a.count);
}

// Get hospital locations (states with counts)
export async function getHospitalLocations(): Promise<Location[]> {
  const hospitals = await fetchHospitalsFromSheets();
  const locationMap = new Map<string, Location>();

  for (const hospital of hospitals) {
    const key = `${hospital.stateSlug}-${hospital.citySlug}`;
    const existing = locationMap.get(key);
    if (existing) {
      existing.count++;
    } else {
      locationMap.set(key, {
        city: hospital.city,
        citySlug: hospital.citySlug,
        state: hospital.state,
        stateSlug: hospital.stateSlug,
        count: 1,
      });
    }
  }

  return Array.from(locationMap.values()).sort((a, b) => b.count - a.count);
}

// Get hospital states (unique states with counts)
export async function getHospitalStates(): Promise<{ state: string; stateSlug: string; count: number }[]> {
  const hospitals = await fetchHospitalsFromSheets();
  const stateMap = new Map<string, { state: string; stateSlug: string; count: number }>();

  for (const hospital of hospitals) {
    const existing = stateMap.get(hospital.stateSlug);
    if (existing) {
      existing.count++;
    } else {
      stateMap.set(hospital.stateSlug, {
        state: hospital.state,
        stateSlug: hospital.stateSlug,
        count: 1,
      });
    }
  }

  return Array.from(stateMap.values()).sort((a, b) => b.count - a.count);
}

// Get featured hospitals (top rated)
export async function getFeaturedHospitals(limit: number = 6): Promise<Hospital[]> {
  const hospitals = await fetchHospitalsFromSheets();
  return sortHospitals(hospitals, 'rating').slice(0, limit);
}

// Get total hospital count
export async function getTotalHospitalCount(): Promise<number> {
  const hospitals = await fetchHospitalsFromSheets();
  return hospitals.length;
}

// Get related hospitals (same state/city or type)
export async function getRelatedHospitals(hospital: Hospital, limit: number = 3): Promise<Hospital[]> {
  const hospitals = await fetchHospitalsFromSheets();

  const related = hospitals
    .filter(h =>
      h.id !== hospital.id &&
      (h.stateSlug === hospital.stateSlug || h.typeSlug === hospital.typeSlug)
    );

  return sortHospitals(related, 'rating').slice(0, limit);
}

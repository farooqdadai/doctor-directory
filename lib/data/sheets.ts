import { google } from 'googleapis';
import { slugify, generateDoctorSlug } from '../utils/slugify';
import type { Doctor, Specialty, Location } from '../types';

// Re-export types
export type { Doctor, Specialty, Location };

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
      range: 'Sheet1!A:AG', // Columns A through AG (33 columns)
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

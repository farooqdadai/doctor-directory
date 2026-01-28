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

  // Handle different formats of the private key from environment variables
  // Vercel may store \n as literal backslash-n, we need to convert to actual newlines
  privateKey = privateKey
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '')
    .replace(/"/g, ''); // Remove any surrounding quotes

  // Log key info for debugging (not the actual key)
  console.log('[Sheets] Private key length:', privateKey.length);
  console.log('[Sheets] Key starts with:', privateKey.substring(0, 30));
  console.log('[Sheets] Key ends with:', privateKey.substring(privateKey.length - 30));

  const auth = new google.auth.JWT({
    email,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  return google.sheets({ version: 'v4', auth });
}

// Fetch all doctors from Google Sheets
export async function fetchDoctorsFromSheets(): Promise<Doctor[]> {
  // Return cached data if still valid
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
      range: 'Sheet1!A:O', // Columns A through O
    });

    const rows = response.data.values;
    if (!rows || rows.length < 2) {
      console.log('[Sheets] No data found');
      return [];
    }

    // Skip header row, parse data
    const doctors: Doctor[] = [];
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row[0] || !row[1]) continue; // Skip if no NPI or name

      const npi = row[0]?.toString().trim() || '';
      const fullName = row[1]?.toString().trim() || '';
      const specialty = row[2]?.toString().trim() || 'General Practice';
      const city = row[6]?.toString().trim() || '';
      const state = row[7]?.toString().trim() || '';

      if (!npi || !fullName || !city || !state) continue;

      const now = new Date().toISOString();
      const rawStatus = row[11]?.toString().trim() || 'Active';
      const profileStatus: 'Active' | 'Inactive' = rawStatus === 'Inactive' ? 'Inactive' : 'Active';

      const doctor: Doctor = {
        id: i,
        npi,
        fullName,
        slug: generateDoctorSlug(fullName, npi),
        specialty,
        specialtySlug: slugify(specialty),
        subSpecialty: row[3]?.toString().trim() || null,
        practiceName: row[4]?.toString().trim() || null,
        website: row[5]?.toString().trim() || null,
        city,
        citySlug: slugify(city),
        state,
        stateSlug: state.toLowerCase(),
        email: row[8]?.toString().trim() || null,
        phone: row[9]?.toString().trim() || null,
        linkedin: row[10]?.toString().trim() || null,
        profileStatus,
        isVerified: row[12]?.toString().toLowerCase() === 'true' || row[12]?.toString() === '1',
        isFeatured: row[13]?.toString().toLowerCase() === 'true' || row[13]?.toString() === '1',
        priority: parseInt(row[14]?.toString() || '50', 10),
        createdAt: now,
        updatedAt: now,
      };

      doctors.push(doctor);
    }

    console.log(`[Sheets] Fetched ${doctors.length} doctors`);

    // Update cache
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
        return a.fullName.localeCompare(b.fullName);
      case 'rank':
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
  return sortDoctors(
    doctors.filter(d => d.profileStatus === 'Active' && d.isFeatured)
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

// Search doctors
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
      d.specialty.toLowerCase().includes(q) ||
      d.city.toLowerCase().includes(q) ||
      (d.practiceName && d.practiceName.toLowerCase().includes(q))
    );
  }

  if (specialty) {
    doctors = doctors.filter(d => d.specialtySlug === specialty);
  }

  if (state) {
    doctors = doctors.filter(d => d.stateSlug === state);
  }

  if (city) {
    doctors = doctors.filter(d => d.citySlug === city);
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

  // Find doctors in same specialty or location, excluding current
  const related = doctors
    .filter(d =>
      d.npi !== doctor.npi &&
      d.profileStatus === 'Active' &&
      (d.specialtySlug === doctor.specialtySlug || (d.stateSlug === doctor.stateSlug && d.citySlug === doctor.citySlug))
    );

  return sortDoctors(related).slice(0, limit);
}

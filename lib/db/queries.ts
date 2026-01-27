import { getDb } from './index';
import { Doctor, DoctorRow, SearchParams, SearchResults, Specialty, Location } from '../types';
import { slugify, generateDoctorSlug } from '../utils/slugify';

// Convert database row to Doctor object
function rowToDoctor(row: DoctorRow): Doctor {
  return {
    id: row.id,
    npi: row.npi,
    fullName: row.full_name,
    slug: row.slug,
    specialty: row.specialty,
    specialtySlug: row.specialty_slug,
    subSpecialty: row.sub_specialty,
    practiceName: row.practice_name,
    website: row.website,
    city: row.city,
    citySlug: row.city_slug,
    state: row.state,
    stateSlug: row.state_slug,
    email: row.email,
    phone: row.phone,
    linkedin: row.linkedin,
    profileStatus: row.profile_status as 'Active' | 'Inactive',
    isVerified: row.is_verified === 1,
    isFeatured: row.is_featured === 1,
    priority: row.priority,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// Search doctors with filters and sorting
export function searchDoctors(params: SearchParams): SearchResults {
  const db = getDb();
  const {
    query = '',
    specialty,
    state,
    city,
    verifiedOnly = false,
    featuredOnly = false,
    sort = 'best_match',
    page = 1,
    limit = 20,
  } = params;

  const offset = (page - 1) * limit;
  const conditions: string[] = ["profile_status = 'Active'"];
  const queryParams: Record<string, string | number> = {};

  // Add filters
  if (specialty) {
    conditions.push('specialty_slug = @specialty');
    queryParams.specialty = specialty;
  }

  if (state) {
    conditions.push('state_slug = @state');
    queryParams.state = state.toLowerCase();
  }

  if (city) {
    conditions.push('city_slug = @city');
    queryParams.city = city.toLowerCase();
  }

  if (verifiedOnly) {
    conditions.push('is_verified = 1');
  }

  if (featuredOnly) {
    conditions.push('is_featured = 1');
  }

  // Text search
  if (query) {
    conditions.push(
      "(full_name LIKE @query OR specialty LIKE @query OR practice_name LIKE @query OR sub_specialty LIKE @query)"
    );
    queryParams.query = `%${query}%`;
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // Build ORDER BY based on sort option
  let orderBy: string;
  switch (sort) {
    case 'a_z':
      orderBy = 'full_name ASC';
      break;
    case 'featured':
      orderBy = 'is_featured DESC, priority DESC, full_name ASC';
      break;
    case 'verified':
      orderBy = 'is_verified DESC, priority DESC, full_name ASC';
      break;
    case 'best_match':
    default:
      orderBy = 'is_featured DESC, is_verified DESC, priority DESC, full_name ASC';
      break;
  }

  // Get total count
  const countSql = `SELECT COUNT(*) as total FROM doctors ${whereClause}`;
  const countResult = db.prepare(countSql).get(queryParams) as { total: number };
  const total = countResult.total;

  // Get doctors
  const sql = `
    SELECT * FROM doctors
    ${whereClause}
    ORDER BY ${orderBy}
    LIMIT @limit OFFSET @offset
  `;

  const rows = db.prepare(sql).all({
    ...queryParams,
    limit,
    offset,
  }) as DoctorRow[];

  return {
    doctors: rows.map(rowToDoctor),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

// Get doctor by slug
export function getDoctorBySlug(slug: string): Doctor | null {
  const db = getDb();
  const row = db
    .prepare('SELECT * FROM doctors WHERE slug = ?')
    .get(slug) as DoctorRow | undefined;

  return row ? rowToDoctor(row) : null;
}

// Get doctor by NPI
export function getDoctorByNPI(npi: string): Doctor | null {
  const db = getDb();
  const row = db
    .prepare('SELECT * FROM doctors WHERE npi = ?')
    .get(npi) as DoctorRow | undefined;

  return row ? rowToDoctor(row) : null;
}

// Get all specialties with counts
export function getSpecialties(): Specialty[] {
  const db = getDb();
  const rows = db
    .prepare(`
      SELECT specialty as name, specialty_slug as slug, COUNT(*) as doctor_count
      FROM doctors
      WHERE profile_status = 'Active'
      GROUP BY specialty_slug
      ORDER BY doctor_count DESC
    `)
    .all() as { name: string; slug: string; doctor_count: number }[];

  return rows.map((row, index) => ({
    id: index + 1,
    name: row.name,
    slug: row.slug,
    doctorCount: row.doctor_count,
  }));
}

// Get all locations with counts
export function getLocations(): Location[] {
  const db = getDb();
  const rows = db
    .prepare(`
      SELECT city, city_slug, state, state_slug, COUNT(*) as doctor_count
      FROM doctors
      WHERE profile_status = 'Active'
      GROUP BY city_slug, state_slug
      ORDER BY doctor_count DESC
    `)
    .all() as { city: string; city_slug: string; state: string; state_slug: string; doctor_count: number }[];

  return rows.map((row, index) => ({
    id: index + 1,
    city: row.city,
    citySlug: row.city_slug,
    state: row.state,
    stateSlug: row.state_slug,
    doctorCount: row.doctor_count,
  }));
}

// Get featured doctors
export function getFeaturedDoctors(limit: number = 6): Doctor[] {
  const db = getDb();
  const rows = db
    .prepare(`
      SELECT * FROM doctors
      WHERE profile_status = 'Active' AND is_featured = 1
      ORDER BY priority DESC, RANDOM()
      LIMIT ?
    `)
    .all(limit) as DoctorRow[];

  return rows.map(rowToDoctor);
}

// Get related doctors (same specialty, same city)
export function getRelatedDoctors(doctor: Doctor, limit: number = 3): Doctor[] {
  const db = getDb();
  const rows = db
    .prepare(`
      SELECT * FROM doctors
      WHERE profile_status = 'Active'
        AND npi != ?
        AND (specialty_slug = ? OR city_slug = ?)
      ORDER BY
        CASE WHEN specialty_slug = ? AND city_slug = ? THEN 0
             WHEN specialty_slug = ? THEN 1
             WHEN city_slug = ? THEN 2
             ELSE 3 END,
        is_featured DESC, is_verified DESC, priority DESC
      LIMIT ?
    `)
    .all(
      doctor.npi,
      doctor.specialtySlug,
      doctor.citySlug,
      doctor.specialtySlug,
      doctor.citySlug,
      doctor.specialtySlug,
      doctor.citySlug,
      limit
    ) as DoctorRow[];

  return rows.map(rowToDoctor);
}

// Upsert doctor (insert or update)
export function upsertDoctor(data: {
  npi: string;
  fullName: string;
  specialty: string;
  subSpecialty?: string | null;
  practiceName?: string | null;
  website?: string | null;
  city: string;
  state: string;
  email?: string | null;
  phone?: string | null;
  linkedin?: string | null;
  profileStatus?: string;
  isVerified?: boolean;
  isFeatured?: boolean;
  priority?: number;
}): { action: 'added' | 'updated' | 'unchanged' } {
  const db = getDb();

  const slug = generateDoctorSlug(data.fullName, data.npi);
  const specialtySlug = slugify(data.specialty);
  const citySlug = slugify(data.city);
  const stateSlug = data.state.toLowerCase();

  // Check if exists
  const existing = db
    .prepare('SELECT * FROM doctors WHERE npi = ?')
    .get(data.npi) as DoctorRow | undefined;

  if (!existing) {
    // Insert new
    db.prepare(`
      INSERT INTO doctors (
        npi, full_name, slug, specialty, specialty_slug, sub_specialty,
        practice_name, website, city, city_slug, state, state_slug,
        email, phone, linkedin, profile_status, is_verified, is_featured, priority
      ) VALUES (
        @npi, @fullName, @slug, @specialty, @specialtySlug, @subSpecialty,
        @practiceName, @website, @city, @citySlug, @state, @stateSlug,
        @email, @phone, @linkedin, @profileStatus, @isVerified, @isFeatured, @priority
      )
    `).run({
      npi: data.npi,
      fullName: data.fullName,
      slug,
      specialty: data.specialty,
      specialtySlug,
      subSpecialty: data.subSpecialty || null,
      practiceName: data.practiceName || null,
      website: data.website || null,
      city: data.city,
      citySlug,
      state: data.state,
      stateSlug,
      email: data.email || null,
      phone: data.phone || null,
      linkedin: data.linkedin || null,
      profileStatus: data.profileStatus || 'Active',
      isVerified: data.isVerified ? 1 : 0,
      isFeatured: data.isFeatured ? 1 : 0,
      priority: data.priority || 50,
    });

    return { action: 'added' };
  }

  // Check if anything changed
  const hasChanges =
    existing.full_name !== data.fullName ||
    existing.specialty !== data.specialty ||
    existing.sub_specialty !== (data.subSpecialty || null) ||
    existing.practice_name !== (data.practiceName || null) ||
    existing.website !== (data.website || null) ||
    existing.city !== data.city ||
    existing.state !== data.state ||
    existing.email !== (data.email || null) ||
    existing.phone !== (data.phone || null) ||
    existing.linkedin !== (data.linkedin || null) ||
    existing.profile_status !== (data.profileStatus || 'Active') ||
    existing.is_verified !== (data.isVerified ? 1 : 0) ||
    existing.is_featured !== (data.isFeatured ? 1 : 0) ||
    existing.priority !== (data.priority || 50);

  if (!hasChanges) {
    return { action: 'unchanged' };
  }

  // Update existing
  db.prepare(`
    UPDATE doctors SET
      full_name = @fullName,
      slug = @slug,
      specialty = @specialty,
      specialty_slug = @specialtySlug,
      sub_specialty = @subSpecialty,
      practice_name = @practiceName,
      website = @website,
      city = @city,
      city_slug = @citySlug,
      state = @state,
      state_slug = @stateSlug,
      email = @email,
      phone = @phone,
      linkedin = @linkedin,
      profile_status = @profileStatus,
      is_verified = @isVerified,
      is_featured = @isFeatured,
      priority = @priority,
      updated_at = CURRENT_TIMESTAMP
    WHERE npi = @npi
  `).run({
    npi: data.npi,
    fullName: data.fullName,
    slug,
    specialty: data.specialty,
    specialtySlug,
    subSpecialty: data.subSpecialty || null,
    practiceName: data.practiceName || null,
    website: data.website || null,
    city: data.city,
    citySlug,
    state: data.state,
    stateSlug,
    email: data.email || null,
    phone: data.phone || null,
    linkedin: data.linkedin || null,
    profileStatus: data.profileStatus || 'Active',
    isVerified: data.isVerified ? 1 : 0,
    isFeatured: data.isFeatured ? 1 : 0,
    priority: data.priority || 50,
  });

  return { action: 'updated' };
}

// Log sync operation
export function logSync(stats: {
  processed: number;
  added: number;
  updated: number;
  unchanged: number;
  errors: string[];
}) {
  const db = getDb();
  db.prepare(`
    INSERT INTO sync_log (records_processed, records_added, records_updated, records_unchanged, errors)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    stats.processed,
    stats.added,
    stats.updated,
    stats.unchanged,
    JSON.stringify(stats.errors)
  );
}

// Get total doctor count
export function getTotalDoctorCount(): number {
  const db = getDb();
  const result = db
    .prepare("SELECT COUNT(*) as count FROM doctors WHERE profile_status = 'Active'")
    .get() as { count: number };
  return result.count;
}

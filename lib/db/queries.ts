import { getDb } from './index';
import { Doctor, DoctorRow, SearchParams, SearchResults, Specialty, Location } from '../types';
import { slugify, generateDoctorSlug } from '../utils/slugify';
import { Row } from '@libsql/client';

// Convert database row to Doctor object
function rowToDoctor(row: Row): Doctor {
  return {
    id: row.id as number,
    npi: row.npi as string,
    fullName: row.full_name as string,
    slug: row.slug as string,
    specialty: row.specialty as string,
    specialtySlug: row.specialty_slug as string,
    subSpecialty: row.sub_specialty as string | null,
    practiceName: row.practice_name as string | null,
    website: row.website as string | null,
    city: row.city as string,
    citySlug: row.city_slug as string,
    state: row.state as string,
    stateSlug: row.state_slug as string,
    email: row.email as string | null,
    phone: row.phone as string | null,
    linkedin: row.linkedin as string | null,
    profileStatus: row.profile_status as 'Active' | 'Inactive',
    isVerified: row.is_verified === 1,
    isFeatured: row.is_featured === 1,
    priority: row.priority as number,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

// Search doctors with filters and sorting
export async function searchDoctors(params: SearchParams): Promise<SearchResults> {
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
  const queryParams: (string | number)[] = [];

  // Add filters
  if (specialty) {
    conditions.push('specialty_slug = ?');
    queryParams.push(specialty);
  }

  if (state) {
    conditions.push('state_slug = ?');
    queryParams.push(state.toLowerCase());
  }

  if (city) {
    conditions.push('city_slug = ?');
    queryParams.push(city.toLowerCase());
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
      "(full_name LIKE ? OR specialty LIKE ? OR practice_name LIKE ? OR sub_specialty LIKE ?)"
    );
    const likeQuery = `%${query}%`;
    queryParams.push(likeQuery, likeQuery, likeQuery, likeQuery);
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
  const countResult = await db.execute({ sql: countSql, args: queryParams });
  const total = (countResult.rows[0]?.total as number) || 0;

  // Get doctors
  const sql = `
    SELECT * FROM doctors
    ${whereClause}
    ORDER BY ${orderBy}
    LIMIT ? OFFSET ?
  `;

  const result = await db.execute({ sql, args: [...queryParams, limit, offset] });

  return {
    doctors: result.rows.map(rowToDoctor),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

// Get doctor by slug
export async function getDoctorBySlug(slug: string): Promise<Doctor | null> {
  const db = getDb();
  const result = await db.execute({
    sql: 'SELECT * FROM doctors WHERE slug = ?',
    args: [slug],
  });

  return result.rows.length > 0 ? rowToDoctor(result.rows[0]) : null;
}

// Get doctor by NPI
export async function getDoctorByNPI(npi: string): Promise<Doctor | null> {
  const db = getDb();
  const result = await db.execute({
    sql: 'SELECT * FROM doctors WHERE npi = ?',
    args: [npi],
  });

  return result.rows.length > 0 ? rowToDoctor(result.rows[0]) : null;
}

// Get all specialties with counts
export async function getSpecialties(): Promise<Specialty[]> {
  const db = getDb();
  const result = await db.execute(`
    SELECT specialty as name, specialty_slug as slug, COUNT(*) as doctor_count
    FROM doctors
    WHERE profile_status = 'Active'
    GROUP BY specialty_slug
    ORDER BY doctor_count DESC
  `);

  return result.rows.map((row, index) => ({
    id: index + 1,
    name: row.name as string,
    slug: row.slug as string,
    count: row.doctor_count as number,
    doctorCount: row.doctor_count as number,
  }));
}

// Get all locations with counts
export async function getLocations(): Promise<Location[]> {
  const db = getDb();
  const result = await db.execute(`
    SELECT city, city_slug, state, state_slug, COUNT(*) as doctor_count
    FROM doctors
    WHERE profile_status = 'Active'
    GROUP BY city_slug, state_slug
    ORDER BY doctor_count DESC
  `);

  return result.rows.map((row, index) => ({
    id: index + 1,
    city: row.city as string,
    citySlug: row.city_slug as string,
    state: row.state as string,
    stateSlug: row.state_slug as string,
    count: row.doctor_count as number,
    doctorCount: row.doctor_count as number,
  }));
}

// Get featured doctors
export async function getFeaturedDoctors(limit: number = 6): Promise<Doctor[]> {
  const db = getDb();
  const result = await db.execute({
    sql: `
      SELECT * FROM doctors
      WHERE profile_status = 'Active' AND is_featured = 1
      ORDER BY priority DESC, RANDOM()
      LIMIT ?
    `,
    args: [limit],
  });

  return result.rows.map(rowToDoctor);
}

// Get related doctors (same specialty, same city)
export async function getRelatedDoctors(doctor: Doctor, limit: number = 3): Promise<Doctor[]> {
  const db = getDb();
  const result = await db.execute({
    sql: `
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
    `,
    args: [
      doctor.npi,
      doctor.specialtySlug,
      doctor.citySlug,
      doctor.specialtySlug,
      doctor.citySlug,
      doctor.specialtySlug,
      doctor.citySlug,
      limit,
    ],
  });

  return result.rows.map(rowToDoctor);
}

// Upsert doctor (insert or update)
export async function upsertDoctor(data: {
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
}): Promise<{ action: 'added' | 'updated' | 'unchanged' }> {
  const db = getDb();

  const slug = generateDoctorSlug(data.fullName, data.npi);
  const specialtySlug = slugify(data.specialty);
  const citySlug = slugify(data.city);
  const stateSlug = data.state.toLowerCase();

  // Check if exists
  const existingResult = await db.execute({
    sql: 'SELECT * FROM doctors WHERE npi = ?',
    args: [data.npi],
  });

  const existing = existingResult.rows[0];

  if (!existing) {
    // Insert new
    await db.execute({
      sql: `
        INSERT INTO doctors (
          npi, full_name, slug, specialty, specialty_slug, sub_specialty,
          practice_name, website, city, city_slug, state, state_slug,
          email, phone, linkedin, profile_status, is_verified, is_featured, priority
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        data.npi,
        data.fullName,
        slug,
        data.specialty,
        specialtySlug,
        data.subSpecialty || null,
        data.practiceName || null,
        data.website || null,
        data.city,
        citySlug,
        data.state,
        stateSlug,
        data.email || null,
        data.phone || null,
        data.linkedin || null,
        data.profileStatus || 'Active',
        data.isVerified ? 1 : 0,
        data.isFeatured ? 1 : 0,
        data.priority || 50,
      ],
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
  await db.execute({
    sql: `
      UPDATE doctors SET
        full_name = ?,
        slug = ?,
        specialty = ?,
        specialty_slug = ?,
        sub_specialty = ?,
        practice_name = ?,
        website = ?,
        city = ?,
        city_slug = ?,
        state = ?,
        state_slug = ?,
        email = ?,
        phone = ?,
        linkedin = ?,
        profile_status = ?,
        is_verified = ?,
        is_featured = ?,
        priority = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE npi = ?
    `,
    args: [
      data.fullName,
      slug,
      data.specialty,
      specialtySlug,
      data.subSpecialty || null,
      data.practiceName || null,
      data.website || null,
      data.city,
      citySlug,
      data.state,
      stateSlug,
      data.email || null,
      data.phone || null,
      data.linkedin || null,
      data.profileStatus || 'Active',
      data.isVerified ? 1 : 0,
      data.isFeatured ? 1 : 0,
      data.priority || 50,
      data.npi,
    ],
  });

  return { action: 'updated' };
}

// Log sync operation
export async function logSync(stats: {
  processed: number;
  added: number;
  updated: number;
  unchanged: number;
  errors: string[];
}): Promise<void> {
  const db = getDb();
  await db.execute({
    sql: `
      INSERT INTO sync_log (records_processed, records_added, records_updated, records_unchanged, errors)
      VALUES (?, ?, ?, ?, ?)
    `,
    args: [
      stats.processed,
      stats.added,
      stats.updated,
      stats.unchanged,
      JSON.stringify(stats.errors),
    ],
  });
}

// Get total doctor count
export async function getTotalDoctorCount(): Promise<number> {
  const db = getDb();
  const result = await db.execute(
    "SELECT COUNT(*) as count FROM doctors WHERE profile_status = 'Active'"
  );
  return (result.rows[0]?.count as number) || 0;
}

import { createClient, type Client } from '@libsql/client/http';

// Database client singleton
let db: Client | null = null;

export function getDb(): Client {
  console.log('='.repeat(50));
  console.log('[DB] getDb() called');
  console.log('='.repeat(50));

  if (!db) {
    const url = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    console.log('[DB] Creating new database connection...');
    console.log('[DB] ENV CHECK:');
    console.log('[DB]   - TURSO_DATABASE_URL:', url ? url : 'NOT SET');
    console.log('[DB]   - TURSO_AUTH_TOKEN:', authToken ? `${authToken.substring(0, 20)}...` : 'NOT SET');
    console.log('[DB]   - NODE_ENV:', process.env.NODE_ENV);

    if (!url) {
      console.error('[DB] ERROR: TURSO_DATABASE_URL is missing!');
      throw new Error('TURSO_DATABASE_URL environment variable is not set. Please set up your Turso database.');
    }

    if (!authToken) {
      console.warn('[DB] WARNING: TURSO_AUTH_TOKEN is missing - this may cause auth errors');
    }

    try {
      console.log('[DB] Calling createClient()...');
      db = createClient({
        url,
        authToken,
      });
      console.log('[DB] SUCCESS: Database client created!');
    } catch (error) {
      console.error('[DB] FAILED to create client:', error);
      throw error;
    }
  } else {
    console.log('[DB] Reusing existing database connection');
  }
  return db;
}

// Initialize database schema
export async function initializeSchema() {
  console.log('[Schema] Starting schema initialization...');

  let database;
  try {
    database = getDb();
    console.log('[Schema] Got database client');
  } catch (error) {
    console.error('[Schema] Failed to get database client:', error);
    throw error;
  }

  const statements = [
    { name: 'doctors table', sql: `CREATE TABLE IF NOT EXISTS doctors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      npi TEXT UNIQUE NOT NULL,
      full_name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      specialty TEXT NOT NULL,
      specialty_slug TEXT NOT NULL,
      sub_specialty TEXT,
      practice_name TEXT,
      website TEXT,
      city TEXT NOT NULL,
      city_slug TEXT NOT NULL,
      state TEXT NOT NULL,
      state_slug TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      linkedin TEXT,
      profile_status TEXT DEFAULT 'Active',
      is_verified INTEGER DEFAULT 0,
      is_featured INTEGER DEFAULT 0,
      priority INTEGER DEFAULT 50,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )` },
    { name: 'idx_doctors_specialty', sql: `CREATE INDEX IF NOT EXISTS idx_doctors_specialty ON doctors(specialty_slug)` },
    { name: 'idx_doctors_location', sql: `CREATE INDEX IF NOT EXISTS idx_doctors_location ON doctors(state_slug, city_slug)` },
    { name: 'idx_doctors_status', sql: `CREATE INDEX IF NOT EXISTS idx_doctors_status ON doctors(profile_status)` },
    { name: 'idx_doctors_featured', sql: `CREATE INDEX IF NOT EXISTS idx_doctors_featured ON doctors(is_featured)` },
    { name: 'idx_doctors_verified', sql: `CREATE INDEX IF NOT EXISTS idx_doctors_verified ON doctors(is_verified)` },
    { name: 'idx_doctors_npi', sql: `CREATE INDEX IF NOT EXISTS idx_doctors_npi ON doctors(npi)` },
    { name: 'idx_doctors_slug', sql: `CREATE INDEX IF NOT EXISTS idx_doctors_slug ON doctors(slug)` },
    { name: 'sync_log table', sql: `CREATE TABLE IF NOT EXISTS sync_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      synced_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      records_processed INTEGER,
      records_added INTEGER,
      records_updated INTEGER,
      records_unchanged INTEGER,
      errors TEXT
    )` },
  ];

  for (const statement of statements) {
    try {
      console.log('[Schema] Executing:', statement.name);
      await database.execute(statement.sql);
      console.log('[Schema] SUCCESS:', statement.name);
    } catch (error) {
      console.error('[Schema] FAILED:', statement.name, error);
      throw error;
    }
  }

  console.log('[Schema] All schema statements executed successfully!');
}

// Close database connection
export function closeDb() {
  if (db) {
    db.close();
    db = null;
  }
}

export default getDb;

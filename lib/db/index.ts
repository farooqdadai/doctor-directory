import { createClient, Client } from '@libsql/client';

// Database client singleton
let db: Client | null = null;

export function getDb(): Client {
  if (!db) {
    const url = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    console.log('[DB] Initializing database connection...');
    console.log('[DB] TURSO_DATABASE_URL:', url ? `${url.substring(0, 30)}...` : 'NOT SET');
    console.log('[DB] TURSO_AUTH_TOKEN:', authToken ? 'SET (hidden)' : 'NOT SET');

    if (!url) {
      console.error('[DB] ERROR: TURSO_DATABASE_URL environment variable is not set');
      throw new Error('TURSO_DATABASE_URL environment variable is not set. Please set up your Turso database.');
    }

    db = createClient({
      url,
      authToken,
    });
    console.log('[DB] Database client created successfully');
  }
  return db;
}

// Initialize database schema
export async function initializeSchema() {
  const database = getDb();

  const statements = [
    `CREATE TABLE IF NOT EXISTS doctors (
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
    )`,
    `CREATE INDEX IF NOT EXISTS idx_doctors_specialty ON doctors(specialty_slug)`,
    `CREATE INDEX IF NOT EXISTS idx_doctors_location ON doctors(state_slug, city_slug)`,
    `CREATE INDEX IF NOT EXISTS idx_doctors_status ON doctors(profile_status)`,
    `CREATE INDEX IF NOT EXISTS idx_doctors_featured ON doctors(is_featured)`,
    `CREATE INDEX IF NOT EXISTS idx_doctors_verified ON doctors(is_verified)`,
    `CREATE INDEX IF NOT EXISTS idx_doctors_npi ON doctors(npi)`,
    `CREATE INDEX IF NOT EXISTS idx_doctors_slug ON doctors(slug)`,
    `CREATE TABLE IF NOT EXISTS sync_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      synced_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      records_processed INTEGER,
      records_added INTEGER,
      records_updated INTEGER,
      records_unchanged INTEGER,
      errors TEXT
    )`,
  ];

  for (const statement of statements) {
    await database.execute(statement);
  }
}

// Close database connection
export function closeDb() {
  if (db) {
    db.close();
    db = null;
  }
}

export default getDb;

-- Main doctors table
CREATE TABLE IF NOT EXISTS doctors (
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
);

-- Indexes for search performance
CREATE INDEX IF NOT EXISTS idx_doctors_specialty ON doctors(specialty_slug);
CREATE INDEX IF NOT EXISTS idx_doctors_location ON doctors(state_slug, city_slug);
CREATE INDEX IF NOT EXISTS idx_doctors_status ON doctors(profile_status);
CREATE INDEX IF NOT EXISTS idx_doctors_featured ON doctors(is_featured);
CREATE INDEX IF NOT EXISTS idx_doctors_verified ON doctors(is_verified);
CREATE INDEX IF NOT EXISTS idx_doctors_ranking ON doctors(is_featured DESC, is_verified DESC, priority DESC);
CREATE INDEX IF NOT EXISTS idx_doctors_npi ON doctors(npi);
CREATE INDEX IF NOT EXISTS idx_doctors_slug ON doctors(slug);

-- Specialties lookup (auto-populated from doctors)
CREATE TABLE IF NOT EXISTS specialties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    doctor_count INTEGER DEFAULT 0
);

-- Locations lookup (auto-populated from doctors)
CREATE TABLE IF NOT EXISTS locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    city TEXT NOT NULL,
    city_slug TEXT NOT NULL,
    state TEXT NOT NULL,
    state_slug TEXT NOT NULL,
    doctor_count INTEGER DEFAULT 0,
    UNIQUE(city_slug, state_slug)
);

-- Sync log for auditing
CREATE TABLE IF NOT EXISTS sync_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    synced_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    records_processed INTEGER,
    records_added INTEGER,
    records_updated INTEGER,
    records_unchanged INTEGER,
    errors TEXT
);

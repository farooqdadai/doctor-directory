import { NextResponse } from 'next/server';
import { getDb, initializeSchema } from '@/lib/db/index';
import { getTotalDoctorCount, getSpecialties } from '@/lib/db/queries';

export const dynamic = 'force-dynamic';

export async function GET() {
  const logs: string[] = [];
  const log = (msg: string) => {
    console.log(msg);
    logs.push(msg);
  };

  log('='.repeat(60));
  log('DEBUG API CALLED - ' + new Date().toISOString());
  log('='.repeat(60));

  // Step 1: Check environment variables
  log('');
  log('STEP 1: Environment Variables');
  log('-'.repeat(40));

  const envVars = {
    TURSO_DATABASE_URL: process.env.TURSO_DATABASE_URL || 'NOT SET',
    TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN ? `SET (${process.env.TURSO_AUTH_TOKEN.length} chars)` : 'NOT SET',
    GOOGLE_SHEET_ID: process.env.GOOGLE_SHEET_ID || 'NOT SET',
    GOOGLE_SERVICE_ACCOUNT_EMAIL: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || 'NOT SET',
    GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY ? `SET (${process.env.GOOGLE_PRIVATE_KEY.length} chars)` : 'NOT SET',
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ? 'SET' : 'NOT SET',
    NODE_ENV: process.env.NODE_ENV || 'NOT SET',
  };

  for (const [key, value] of Object.entries(envVars)) {
    log(`  ${key}: ${value}`);
  }

  // Step 2: Test database connection
  log('');
  log('STEP 2: Database Connection');
  log('-'.repeat(40));

  let dbClient;
  try {
    log('  Calling getDb()...');
    dbClient = getDb();
    log('  SUCCESS: Got database client');
  } catch (error) {
    log(`  FAILED: ${error instanceof Error ? error.message : String(error)}`);
    return NextResponse.json({
      success: false,
      step: 'database_connection',
      error: error instanceof Error ? error.message : String(error),
      logs,
      envVars,
    }, { status: 500 });
  }

  // Step 3: Initialize schema
  log('');
  log('STEP 3: Schema Initialization');
  log('-'.repeat(40));

  try {
    log('  Calling initializeSchema()...');
    await initializeSchema();
    log('  SUCCESS: Schema initialized');
  } catch (error) {
    log(`  FAILED: ${error instanceof Error ? error.message : String(error)}`);
    return NextResponse.json({
      success: false,
      step: 'schema_initialization',
      error: error instanceof Error ? error.message : String(error),
      logs,
      envVars,
    }, { status: 500 });
  }

  // Step 4: Test a simple query
  log('');
  log('STEP 4: Test Query');
  log('-'.repeat(40));

  let doctorCount = 0;
  let specialties: Awaited<ReturnType<typeof getSpecialties>> = [];

  try {
    log('  Fetching doctor count...');
    doctorCount = await getTotalDoctorCount();
    log(`  SUCCESS: Found ${doctorCount} doctors`);

    log('  Fetching specialties...');
    specialties = await getSpecialties();
    log(`  SUCCESS: Found ${specialties.length} specialties`);
  } catch (error) {
    log(`  FAILED: ${error instanceof Error ? error.message : String(error)}`);
    return NextResponse.json({
      success: false,
      step: 'test_query',
      error: error instanceof Error ? error.message : String(error),
      logs,
      envVars,
    }, { status: 500 });
  }

  // All tests passed
  log('');
  log('='.repeat(60));
  log('ALL TESTS PASSED!');
  log('='.repeat(60));

  return NextResponse.json({
    success: true,
    message: 'All database tests passed!',
    data: {
      doctorCount,
      specialtiesCount: specialties.length,
      specialties: specialties.slice(0, 5),
    },
    logs,
    envVars,
  });
}

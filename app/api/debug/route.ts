import { NextResponse } from 'next/server';
import { getTotalDoctorCount, getSpecialties, fetchDoctorsFromSheets } from '@/lib/data/sheets';

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
    GOOGLE_SHEET_ID: process.env.GOOGLE_SHEET_ID || 'NOT SET',
    GOOGLE_SERVICE_ACCOUNT_EMAIL: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || 'NOT SET',
    GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY ? `SET (${process.env.GOOGLE_PRIVATE_KEY.length} chars)` : 'NOT SET',
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ? 'SET' : 'NOT SET',
    NODE_ENV: process.env.NODE_ENV || 'NOT SET',
  };

  for (const [key, value] of Object.entries(envVars)) {
    log(`  ${key}: ${value}`);
  }

  // Check if required env vars are set
  if (!process.env.GOOGLE_SHEET_ID) {
    log('');
    log('ERROR: GOOGLE_SHEET_ID is not set!');
    return NextResponse.json({
      success: false,
      step: 'env_check',
      error: 'GOOGLE_SHEET_ID is not set',
      logs,
      envVars,
    }, { status: 500 });
  }

  if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
    log('');
    log('ERROR: GOOGLE_SERVICE_ACCOUNT_EMAIL is not set!');
    return NextResponse.json({
      success: false,
      step: 'env_check',
      error: 'GOOGLE_SERVICE_ACCOUNT_EMAIL is not set',
      logs,
      envVars,
    }, { status: 500 });
  }

  if (!process.env.GOOGLE_PRIVATE_KEY) {
    log('');
    log('ERROR: GOOGLE_PRIVATE_KEY is not set!');
    return NextResponse.json({
      success: false,
      step: 'env_check',
      error: 'GOOGLE_PRIVATE_KEY is not set',
      logs,
      envVars,
    }, { status: 500 });
  }

  // Step 2: Test Google Sheets connection
  log('');
  log('STEP 2: Google Sheets Connection');
  log('-'.repeat(40));

  let doctors: Awaited<ReturnType<typeof fetchDoctorsFromSheets>> = [];

  try {
    log('  Fetching data from Google Sheets...');
    doctors = await fetchDoctorsFromSheets();
    log(`  SUCCESS: Fetched ${doctors.length} doctors from sheet`);

    if (doctors.length > 0) {
      log('  Sample doctor:');
      log(`    - Name: ${doctors[0].fullName}`);
      log(`    - NPI: ${doctors[0].npi}`);
      log(`    - Specialty: ${doctors[0].specialty}`);
      log(`    - Location: ${doctors[0].city}, ${doctors[0].state}`);
    }
  } catch (error) {
    log(`  FAILED: ${error instanceof Error ? error.message : String(error)}`);
    return NextResponse.json({
      success: false,
      step: 'sheets_connection',
      error: error instanceof Error ? error.message : String(error),
      logs,
      envVars,
    }, { status: 500 });
  }

  // Step 3: Test data processing
  log('');
  log('STEP 3: Data Processing');
  log('-'.repeat(40));

  let doctorCount = 0;
  let specialties: Awaited<ReturnType<typeof getSpecialties>> = [];

  try {
    log('  Getting doctor count...');
    doctorCount = await getTotalDoctorCount();
    log(`  SUCCESS: ${doctorCount} active doctors`);

    log('  Getting specialties...');
    specialties = await getSpecialties();
    log(`  SUCCESS: ${specialties.length} specialties found`);

    if (specialties.length > 0) {
      log('  Top specialties:');
      specialties.slice(0, 5).forEach(s => {
        log(`    - ${s.name}: ${s.count} doctors`);
      });
    }
  } catch (error) {
    log(`  FAILED: ${error instanceof Error ? error.message : String(error)}`);
    return NextResponse.json({
      success: false,
      step: 'data_processing',
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
    message: 'Google Sheets connection working!',
    data: {
      doctorCount,
      specialtiesCount: specialties.length,
      specialties: specialties.slice(0, 5),
      sampleDoctors: doctors.slice(0, 3).map(d => ({
        name: d.fullName,
        specialty: d.specialty,
        location: `${d.city}, ${d.state}`,
      })),
    },
    logs,
    envVars,
  });
}

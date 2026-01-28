import HeroSection from "@/components/home/HeroSection";
import SpecialtyGrid from "@/components/home/SpecialtyGrid";
import FeaturedDoctors from "@/components/home/FeaturedDoctors";
import LocationBrowse from "@/components/home/LocationBrowse";
import {
  getSpecialties,
  getFeaturedDoctors,
  getLocations,
  getTotalDoctorCount,
} from "@/lib/db/queries";
import { initializeSchema } from "@/lib/db/index";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  console.log('');
  console.log('*'.repeat(60));
  console.log('*  HOMEPAGE LOADING - ' + new Date().toISOString());
  console.log('*'.repeat(60));
  console.log('');

  // Log all environment variables (hide sensitive parts)
  console.log('[ENV] Environment Variables Check:');
  console.log('[ENV]   TURSO_DATABASE_URL:', process.env.TURSO_DATABASE_URL || 'NOT SET');
  console.log('[ENV]   TURSO_AUTH_TOKEN:', process.env.TURSO_AUTH_TOKEN ? 'SET (' + process.env.TURSO_AUTH_TOKEN.length + ' chars)' : 'NOT SET');
  console.log('[ENV]   GOOGLE_SHEET_ID:', process.env.GOOGLE_SHEET_ID || 'NOT SET');
  console.log('[ENV]   GOOGLE_SERVICE_ACCOUNT_EMAIL:', process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || 'NOT SET');
  console.log('[ENV]   GOOGLE_PRIVATE_KEY:', process.env.GOOGLE_PRIVATE_KEY ? 'SET (' + process.env.GOOGLE_PRIVATE_KEY.length + ' chars)' : 'NOT SET');
  console.log('[ENV]   ADMIN_PASSWORD:', process.env.ADMIN_PASSWORD ? 'SET' : 'NOT SET');
  console.log('[ENV]   NODE_ENV:', process.env.NODE_ENV);
  console.log('');

  try {
    console.log('[HomePage] Step 1: Initializing database schema...');
    await initializeSchema();
    console.log('[HomePage] Step 1: DONE - Schema initialized');

    console.log('[HomePage] Step 2: Fetching data from database...');

    console.log('[HomePage]   - Fetching specialties...');
    const specialties = await getSpecialties();
    console.log('[HomePage]   - Got', specialties.length, 'specialties');

    console.log('[HomePage]   - Fetching featured doctors...');
    const featuredDoctors = await getFeaturedDoctors(6);
    console.log('[HomePage]   - Got', featuredDoctors.length, 'featured doctors');

    console.log('[HomePage]   - Fetching locations...');
    const locations = await getLocations();
    console.log('[HomePage]   - Got', locations.length, 'locations');

    console.log('[HomePage]   - Fetching total doctor count...');
    const totalDoctors = await getTotalDoctorCount();
    console.log('[HomePage]   - Total doctors:', totalDoctors);

    console.log('');
    console.log('[HomePage] Step 2: DONE - All data fetched successfully!');
    console.log('[HomePage] Summary:', {
      specialties: specialties.length,
      featuredDoctors: featuredDoctors.length,
      locations: locations.length,
      totalDoctors,
    });
    console.log('');

    return (
      <>
        <HeroSection totalDoctors={totalDoctors} />
        <SpecialtyGrid specialties={specialties} />
        <FeaturedDoctors doctors={featuredDoctors} />
        <LocationBrowse locations={locations} />
      </>
    );
  } catch (error) {
    console.error('[HomePage] Error fetching data:', error);

    // Return a fallback UI with the error message
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Database Connection Error</h1>
          <p className="text-gray-600 mb-4">
            Unable to connect to the database. Please make sure your Turso database is configured correctly.
          </p>
          <div className="text-left bg-gray-100 p-4 rounded text-sm font-mono overflow-x-auto">
            <p className="text-red-500">{error instanceof Error ? error.message : 'Unknown error'}</p>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            <p>Required environment variables:</p>
            <ul className="list-disc list-inside mt-2">
              <li>TURSO_DATABASE_URL</li>
              <li>TURSO_AUTH_TOKEN</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

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
  try {
    console.log('[HomePage] Starting to fetch data...');

    // Initialize schema if needed (creates tables if they don't exist)
    await initializeSchema();
    console.log('[HomePage] Schema initialized');

    // Fetch data for homepage
    const [specialties, featuredDoctors, locations, totalDoctors] = await Promise.all([
      getSpecialties(),
      getFeaturedDoctors(6),
      getLocations(),
      getTotalDoctorCount(),
    ]);

    console.log('[HomePage] Data fetched successfully:', {
      specialties: specialties.length,
      featuredDoctors: featuredDoctors.length,
      locations: locations.length,
      totalDoctors,
    });

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

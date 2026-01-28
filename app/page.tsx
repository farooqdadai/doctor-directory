import HeroSection from "@/components/home/HeroSection";
import SpecialtyGrid from "@/components/home/SpecialtyGrid";
import FeaturedDoctors from "@/components/home/FeaturedDoctors";
import LocationBrowse from "@/components/home/LocationBrowse";
import {
  getSpecialties,
  getFeaturedDoctors,
  getLocations,
  getTotalDoctorCount,
} from "@/lib/data/sheets";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  console.log('[HomePage] Loading...');

  try {
    // Fetch data from Google Sheets
    const [specialties, featuredDoctors, locations, totalDoctors] = await Promise.all([
      getSpecialties(),
      getFeaturedDoctors(6),
      getLocations(),
      getTotalDoctorCount(),
    ]);

    console.log('[HomePage] Data fetched:', {
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
    console.error('[HomePage] Error:', error);

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Data Loading Error</h1>
          <p className="text-gray-600 mb-4">
            Unable to load data from Google Sheets. Please check your configuration.
          </p>
          <div className="text-left bg-gray-100 p-4 rounded text-sm font-mono overflow-x-auto">
            <p className="text-red-500">{error instanceof Error ? error.message : 'Unknown error'}</p>
          </div>
        </div>
      </div>
    );
  }
}

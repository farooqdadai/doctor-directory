import { Metadata } from "next";
import { notFound } from "next/navigation";
import SearchBar from "@/components/search/SearchBar";
import DoctorCard from "@/components/doctors/DoctorCard";
import { searchDoctors, getLocations, getSpecialties } from "@/lib/db/queries";
import { getStateName } from "@/lib/utils/slugify";
import Link from "next/link";

interface PageProps {
  params: Promise<{ state: string; city: string }>;
  searchParams: Promise<{ page?: string; specialty?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { state, city } = await params;
  const locations = await getLocations();
  const location = locations.find(
    (l) => l.stateSlug === state && l.citySlug === city
  );

  if (!location) {
    return {
      title: "Location Not Found",
    };
  }

  const stateName = getStateName(location.state);

  return {
    title: `Doctors in ${location.city}, ${stateName}`,
    description: `Find ${location.doctorCount} healthcare professionals in ${location.city}, ${stateName}. Browse verified doctors by specialty and connect with the right provider.`,
  };
}

export default async function LocationPage({ params, searchParams }: PageProps) {
  const { state, city } = await params;
  const { page: pageParam, specialty } = await searchParams;

  const locations = await getLocations();
  const location = locations.find(
    (l) => l.stateSlug === state && l.citySlug === city
  );

  if (!location) {
    notFound();
  }

  const page = parseInt(pageParam || "1", 10);
  const stateName = getStateName(location.state);
  const specialties = await getSpecialties();

  const results = await searchDoctors({
    state,
    city,
    specialty,
    page,
    limit: 12,
  });

  // Get specialties available in this location
  const locationSpecialtiesPromises = specialties.map(async (s) => {
    const localResults = await searchDoctors({ state, city, specialty: s.slug, limit: 1 });
    return localResults.total > 0 ? s : null;
  });
  const locationSpecialties = (await Promise.all(locationSpecialtiesPromises)).filter(Boolean) as typeof specialties;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm mb-4">
            <Link href="/" className="text-blue-200 hover:text-white">
              Home
            </Link>
            <span className="mx-2 text-blue-300">/</span>
            <Link href="/doctors" className="text-blue-200 hover:text-white">
              Doctors
            </Link>
            <span className="mx-2 text-blue-300">/</span>
            <span>{stateName}</span>
            <span className="mx-2 text-blue-300">/</span>
            <span>{location.city}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Doctors in {location.city}, {stateName}
          </h1>
          <p className="text-blue-100 text-lg">
            {results.total} {results.total === 1 ? "doctor" : "doctors"} available
            {specialty && ` in ${specialties.find((s) => s.slug === specialty)?.name}`}
          </p>

          {/* Search */}
          <div className="mt-8 max-w-2xl">
            <SearchBar defaultLocation={`${location.city}, ${location.state}`} />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Specialty Filter */}
        {locationSpecialties.length > 1 && (
          <div className="mb-8">
            <h2 className="text-sm font-medium text-gray-700 mb-3">
              Filter by Specialty:
            </h2>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/location/${state}/${city}`}
                className={`px-3 py-1 rounded-full text-sm ${
                  !specialty
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600"
                }`}
              >
                All
              </Link>
              {locationSpecialties.slice(0, 10).map((s) => (
                <Link
                  key={s.slug}
                  href={`/location/${state}/${city}?specialty=${s.slug}`}
                  className={`px-3 py-1 rounded-full text-sm ${
                    specialty === s.slug
                      ? "bg-blue-600 text-white"
                      : "bg-white border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600"
                  }`}
                >
                  {s.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Results Grid */}
        {results.doctors.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.doctors.map((doctor) => (
                <DoctorCard key={doctor.npi} doctor={doctor} />
              ))}
            </div>

            {/* Pagination */}
            {results.totalPages > 1 && (
              <nav className="flex items-center justify-center gap-1 mt-8">
                {page > 1 && (
                  <Link
                    href={`/location/${state}/${city}?page=${page - 1}${specialty ? `&specialty=${specialty}` : ""}`}
                    className="px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Previous
                  </Link>
                )}
                {Array.from({ length: Math.min(5, results.totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <Link
                      key={pageNum}
                      href={`/location/${state}/${city}?page=${pageNum}${specialty ? `&specialty=${specialty}` : ""}`}
                      className={`px-3 py-2 rounded-lg text-sm ${
                        pageNum === page
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {pageNum}
                    </Link>
                  );
                })}
                {page < results.totalPages && (
                  <Link
                    href={`/location/${state}/${city}?page=${page + 1}${specialty ? `&specialty=${specialty}` : ""}`}
                    className="px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Next
                  </Link>
                )}
              </nav>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No doctors found
            </h3>
            <p className="text-gray-600 mb-4">
              We don't have any doctors listed in {location.city} yet.
            </p>
            <Link
              href="/doctors"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Browse all doctors
            </Link>
          </div>
        )}

        {/* Other Cities in State */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Other Cities in {stateName}
          </h2>
          <div className="flex flex-wrap gap-3">
            {locations
              .filter((l) => l.stateSlug === state && l.citySlug !== city)
              .slice(0, 10)
              .map((l) => (
                <Link
                  key={`${l.citySlug}-${l.stateSlug}`}
                  href={`/location/${l.stateSlug}/${l.citySlug}`}
                  className="text-blue-600 hover:text-blue-700 hover:underline"
                >
                  {l.city} ({l.doctorCount})
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

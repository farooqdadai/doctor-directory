import { Metadata } from "next";
import { notFound } from "next/navigation";
import SearchBar from "@/components/search/SearchBar";
import DoctorCard from "@/components/doctors/DoctorCard";
import { searchDoctors, getSpecialties } from "@/lib/db/queries";
import Link from "next/link";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const specialties = getSpecialties();
  const specialty = specialties.find((s) => s.slug === slug);

  if (!specialty) {
    return {
      title: "Specialty Not Found",
    };
  }

  return {
    title: `Find ${specialty.name} Doctors`,
    description: `Browse ${specialty.doctorCount} ${specialty.name} doctors in our directory. Find verified specialists, view profiles, and connect with the right healthcare provider.`,
  };
}

export default async function SpecialtyPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;

  const specialties = getSpecialties();
  const specialty = specialties.find((s) => s.slug === slug);

  if (!specialty) {
    notFound();
  }

  const page = parseInt(pageParam || "1", 10);

  const results = searchDoctors({
    specialty: slug,
    page,
    limit: 12,
  });

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
            <span>{specialty.name}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Find {specialty.name} Doctors
          </h1>
          <p className="text-blue-100 text-lg">
            {specialty.doctorCount} {specialty.doctorCount === 1 ? "doctor" : "doctors"}{" "}
            available
          </p>

          {/* Search */}
          <div className="mt-8 max-w-2xl">
            <SearchBar defaultQuery={specialty.name} />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Other Specialties */}
        <div className="mb-8">
          <h2 className="text-sm font-medium text-gray-700 mb-3">
            Browse Other Specialties:
          </h2>
          <div className="flex flex-wrap gap-2">
            {specialties
              .filter((s) => s.slug !== slug)
              .slice(0, 8)
              .map((s) => (
                <Link
                  key={s.slug}
                  href={`/specialty/${s.slug}`}
                  className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:border-blue-300 hover:text-blue-600"
                >
                  {s.name}
                </Link>
              ))}
          </div>
        </div>

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
                    href={`/specialty/${slug}?page=${page - 1}`}
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
                      href={`/specialty/${slug}?page=${pageNum}`}
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
                    href={`/specialty/${slug}?page=${page + 1}`}
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
              We don't have any {specialty.name} doctors listed yet.
            </p>
            <Link
              href="/doctors"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Browse all doctors
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

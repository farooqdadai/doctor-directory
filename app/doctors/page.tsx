import { Metadata } from "next";
import { Suspense } from "react";
import SearchBar from "@/components/search/SearchBar";
import SearchFilters from "@/components/search/SearchFilters";
import DoctorCard from "@/components/doctors/DoctorCard";
import SortSelector from "@/components/doctors/SortSelector";
import { searchDoctors, getSpecialties } from "@/lib/data/sheets";
import { SortOption } from "@/lib/types";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Find Doctors",
  description:
    "Browse our directory of healthcare professionals. Filter by specialty, location, and more to find the right doctor for your needs.",
};

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    q?: string;
    specialty?: string;
    state?: string;
    city?: string;
    verified?: string;
    featured?: string;
    sort?: string;
    page?: string;
  }>;
}

function Pagination({
  currentPage,
  totalPages,
  searchParams,
}: {
  currentPage: number;
  totalPages: number;
  searchParams: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) return null;

  const getPageUrl = (page: number) => {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && key !== "page") {
        params.set(key, value);
      }
    });
    if (page > 1) {
      params.set("page", String(page));
    }
    return `/doctors?${params.toString()}`;
  };

  const pages: (number | string)[] = [];
  const showEllipsisStart = currentPage > 3;
  const showEllipsisEnd = currentPage < totalPages - 2;

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);
    if (showEllipsisStart) {
      pages.push("...");
    }
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }
    if (showEllipsisEnd) {
      pages.push("...");
    }
    if (!pages.includes(totalPages)) {
      pages.push(totalPages);
    }
  }

  return (
    <nav className="flex items-center justify-center gap-1 mt-8">
      <Link
        href={getPageUrl(currentPage - 1)}
        className={`px-3 py-2 rounded-lg text-sm ${
          currentPage === 1
            ? "text-gray-400 pointer-events-none"
            : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        Previous
      </Link>
      {pages.map((page, index) =>
        typeof page === "string" ? (
          <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-400">
            ...
          </span>
        ) : (
          <Link
            key={page}
            href={getPageUrl(page)}
            className={`px-3 py-2 rounded-lg text-sm ${
              page === currentPage
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {page}
          </Link>
        )
      )}
      <Link
        href={getPageUrl(currentPage + 1)}
        className={`px-3 py-2 rounded-lg text-sm ${
          currentPage === totalPages
            ? "text-gray-400 pointer-events-none"
            : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        Next
      </Link>
    </nav>
  );
}

export default async function DoctorsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const query = params.q || "";
  const specialty = params.specialty;
  const state = params.state;
  const city = params.city;
  const verifiedOnly = params.verified === "true";
  const featuredOnly = params.featured === "true";
  const sort = (params.sort as SortOption) || "best_match";
  const page = parseInt(params.page || "1", 10);

  // Fetch data
  const [results, specialties] = await Promise.all([
    searchDoctors({
      query,
      specialty,
      state,
      city,
      verifiedOnly,
      featuredOnly,
      sort,
      page,
      limit: 12,
    }),
    getSpecialties(),
  ]);

  // Build title
  let title = "All Doctors";
  if (specialty) {
    const specialtyName = specialties.find((s) => s.slug === specialty)?.name;
    title = specialtyName || specialty;
  }
  if (state || city) {
    title += ` in ${city ? `${city}, ` : ""}${state?.toUpperCase() || ""}`;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SearchBar defaultQuery={query} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <Suspense fallback={<div>Loading filters...</div>}>
              <SearchFilters
                specialties={specialties}
                currentSpecialty={specialty}
                currentState={state}
                currentCity={city}
                verifiedOnly={verifiedOnly}
                featuredOnly={featuredOnly}
              />
            </Suspense>
          </aside>

          {/* Results */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                <p className="text-gray-600 mt-1">
                  {results.total} {results.total === 1 ? "doctor" : "doctors"}{" "}
                  found
                </p>
              </div>
              <Suspense fallback={<div>Loading...</div>}>
                <SortSelector currentSort={sort} />
              </Suspense>
            </div>

            {/* Results Grid */}
            {results.doctors.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {results.doctors.map((doctor) => (
                    <DoctorCard key={doctor.npi} doctor={doctor} />
                  ))}
                </div>

                <Pagination
                  currentPage={page}
                  totalPages={results.totalPages}
                  searchParams={{
                    q: query,
                    specialty,
                    state,
                    city,
                    verified: verifiedOnly ? "true" : undefined,
                    featured: featuredOnly ? "true" : undefined,
                    sort: sort !== "best_match" ? sort : undefined,
                  }}
                />
              </>
            ) : (
              <div className="text-center py-12">
                <svg
                  className="w-16 h-16 text-gray-300 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No doctors found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search or filter criteria
                </p>
                <Link
                  href="/doctors"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear all filters
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

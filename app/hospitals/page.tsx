import { Metadata } from 'next';
import Link from 'next/link';
import { searchHospitals, getHospitalTypes, getHospitalStates, getTotalHospitalCount } from '@/lib/data/sheets';
import HospitalCard from '@/components/hospitals/HospitalCard';
import HospitalFilters from '@/components/hospitals/HospitalFilters';
import HospitalSearchBar from '@/components/hospitals/HospitalSearchBar';

export const metadata: Metadata = {
  title: 'Find Hospitals | US Hospital Directory',
  description: 'Search and browse hospitals across the United States. Filter by location, type, trauma center, and more.',
};

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{
    q?: string;
    state?: string;
    type?: string;
    hasTrauma?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function HospitalsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const currentPage = parseInt(params.page || '1', 10);
  const query = params.q;
  const state = params.state;
  const type = params.type;
  const hasTrauma = params.hasTrauma === 'true';
  const sort = params.sort || 'name_asc';

  // Fetch data in parallel with error handling
  let searchResults = { hospitals: [] as Awaited<ReturnType<typeof searchHospitals>>['hospitals'], total: 0, page: 1, totalPages: 0 };
  let types: Awaited<ReturnType<typeof getHospitalTypes>> = [];
  let states: Awaited<ReturnType<typeof getHospitalStates>> = [];
  let totalCount = 0;
  let fetchError: string | null = null;

  try {
    const results = await Promise.all([
      searchHospitals({
        query,
        state,
        type,
        hasTrauma,
        sort: sort as 'name_asc' | 'name_desc' | 'rating' | 'beds',
        page: currentPage,
        limit: 12,
      }),
      getHospitalTypes(),
      getHospitalStates(),
      getTotalHospitalCount(),
    ]);
    searchResults = results[0];
    types = results[1];
    states = results[2];
    totalCount = results[3];
  } catch (error) {
    console.error('[Hospitals Page] Error fetching data:', error);
    fetchError = error instanceof Error ? error.message : 'Failed to load hospital data';
  }

  const { hospitals, total, page, totalPages } = searchResults;

  // Build active filters for display
  const activeFilters: string[] = [];
  if (query) activeFilters.push(`"${query}"`);
  if (state) {
    const stateObj = states.find(s => s.stateSlug === state);
    if (stateObj) activeFilters.push(stateObj.state);
  }
  if (type) {
    const typeObj = types.find(t => t.slug === type);
    if (typeObj) activeFilters.push(typeObj.name);
  }
  if (hasTrauma) activeFilters.push('Trauma Center');

  return (
    <div className="bg-brand-50/30 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-brand-900 via-brand-700 to-brand-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Find Hospitals
            </h1>
            <p className="text-lg text-brand-100 mb-8">
              Browse {totalCount.toLocaleString()} hospitals across the United States
            </p>

            <HospitalSearchBar />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <p className="text-gray-600">
              Showing <span className="font-semibold text-gray-900">{hospitals.length}</span> of{' '}
              <span className="font-semibold text-gray-900">{total.toLocaleString()}</span> hospitals
              {activeFilters.length > 0 && (
                <span className="text-gray-500"> for {activeFilters.join(', ')}</span>
              )}
            </p>
          </div>

          {/* Mobile Filter Toggle would go here */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <HospitalFilters
              types={types}
              states={states}
              currentFilters={{
                type,
                state,
                hasTrauma,
                sort,
              }}
            />
          </aside>

          {/* Results Grid */}
          <main className="lg:col-span-3">
            {fetchError ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-red-100">
                <svg
                  className="w-16 h-16 text-red-300 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to load hospitals</h3>
                <p className="text-gray-500 mb-4">
                  {fetchError}
                </p>
                <Link
                  href="/hospitals"
                  className="inline-flex items-center px-4 py-2 bg-brand-700 text-white rounded-xl hover:bg-brand-900 transition-colors"
                >
                  Try Again
                </Link>
              </div>
            ) : hospitals.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {hospitals.map((hospital) => (
                    <HospitalCard key={hospital.id} hospital={hospital} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-2">
                    {page > 1 && (
                      <Link
                        href={`/hospitals?${new URLSearchParams({
                          ...(query && { q: query }),
                          ...(state && { state }),
                          ...(type && { type }),
                          ...(hasTrauma && { hasTrauma: 'true' }),
                          ...(sort && { sort }),
                          page: String(page - 1),
                        }).toString()}`}
                        className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        Previous
                      </Link>
                    )}

                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum: number;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (page <= 3) {
                          pageNum = i + 1;
                        } else if (page >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = page - 2 + i;
                        }

                        return (
                          <Link
                            key={pageNum}
                            href={`/hospitals?${new URLSearchParams({
                              ...(query && { q: query }),
                              ...(state && { state }),
                              ...(type && { type }),
                              ...(hasTrauma && { hasTrauma: 'true' }),
                              ...(sort && { sort }),
                              page: String(pageNum),
                            }).toString()}`}
                            className={`w-10 h-10 flex items-center justify-center rounded-xl font-medium transition-colors ${
                              pageNum === page
                                ? 'bg-brand-700 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            {pageNum}
                          </Link>
                        );
                      })}
                    </div>

                    {page < totalPages && (
                      <Link
                        href={`/hospitals?${new URLSearchParams({
                          ...(query && { q: query }),
                          ...(state && { state }),
                          ...(type && { type }),
                          ...(hasTrauma && { hasTrauma: 'true' }),
                          ...(sort && { sort }),
                          page: String(page + 1),
                        }).toString()}`}
                        className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        Next
                      </Link>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
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
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No hospitals found</h3>
                <p className="text-gray-500 mb-4">
                  Try adjusting your filters or search terms
                </p>
                <Link
                  href="/hospitals"
                  className="inline-flex items-center px-4 py-2 bg-brand-700 text-white rounded-xl hover:bg-brand-900 transition-colors"
                >
                  Clear Filters
                </Link>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

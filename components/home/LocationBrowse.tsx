import Link from 'next/link';
import { Location } from '@/lib/types';
import { getStateName } from '@/lib/utils/slugify';

interface LocationBrowseProps {
  locations: Location[];
}

export default function LocationBrowse({ locations }: LocationBrowseProps) {
  if (locations.length === 0) {
    return null;
  }

  // Group locations by state
  const locationsByState = locations.reduce((acc, loc) => {
    const state = loc.state;
    if (!acc[state]) {
      acc[state] = [];
    }
    acc[state].push(loc);
    return acc;
  }, {} as Record<string, Location[]>);

  // Get top states by total doctor count
  const topStates = Object.entries(locationsByState)
    .map(([state, locs]) => ({
      state,
      stateName: getStateName(state),
      stateSlug: state.toLowerCase(),
      locations: locs.sort((a, b) => b.count - a.count).slice(0, 5),
      totalDoctors: locs.reduce((sum, loc) => sum + loc.count, 0),
    }))
    .sort((a, b) => b.totalDoctors - a.totalDoctors)
    .slice(0, 4);

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Locations</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Find Providers Near You</h2>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            Browse healthcare professionals by location to find providers in your area
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {topStates.map(({ state, stateName, stateSlug, locations: stateLocs, totalDoctors }) => (
            <div
              key={state}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* State Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-lg">{stateName}</h3>
                  <span className="bg-white/20 px-2.5 py-1 rounded-full text-white text-xs font-medium">
                    {totalDoctors} providers
                  </span>
                </div>
              </div>

              {/* Cities List */}
              <div className="p-4">
                <ul className="space-y-1">
                  {stateLocs.map((loc) => (
                    <li key={`${loc.citySlug}-${loc.stateSlug}`}>
                      <Link
                        href={`/location/${stateSlug}/${loc.citySlug}`}
                        className="flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-50 transition-colors group"
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center mr-3">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          <span className="text-gray-700 font-medium group-hover:text-blue-600 transition-colors">
                            {loc.city}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-400 text-sm mr-2">{loc.count}</span>
                          <svg className="w-4 h-4 text-gray-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center justify-center p-1 bg-gray-100 rounded-2xl">
            <Link
              href="/doctors"
              className="inline-flex items-center px-6 py-3 bg-white text-gray-700 rounded-xl font-medium shadow-sm hover:shadow transition-shadow"
            >
              <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search All Locations
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

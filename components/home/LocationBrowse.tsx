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
    <section className="py-20 lg:py-28 bg-gradient-to-b from-gray-50 via-white to-gray-50/50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-50/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-50 text-brand-700 rounded-full text-sm font-semibold mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Browse by Location
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mt-2">Find Providers Near You</h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg">
            Browse healthcare professionals by location to find providers in your area
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {topStates.map(({ state, stateName, stateSlug, locations: stateLocs, totalDoctors }) => (
            <div
              key={state}
              className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 overflow-hidden"
            >
              {/* State Header */}
              <div className="bg-gradient-to-r from-brand-900 via-brand-700 to-brand-600 px-5 py-5 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2220%22 height=%2220%22 viewBox=%220 0 20 20%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Ccircle cx=%221%22 cy=%221%22 r=%221%22/%3E%3C/g%3E%3C/svg%3E')]" />
                <div className="relative flex items-center justify-between">
                  <h3 className="font-bold text-white text-lg">{stateName}</h3>
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs font-medium">
                    {totalDoctors.toLocaleString()}
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
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-brand-50/50 transition-colors group/item"
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center mr-3 group-hover/item:bg-brand-100 transition-colors">
                            <svg className="w-4 h-4 text-brand-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          <span className="text-gray-700 font-medium group-hover/item:text-brand-700 transition-colors">
                            {loc.city}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 text-sm font-medium">{loc.count.toLocaleString()}</span>
                          <svg className="w-4 h-4 text-gray-300 group-hover/item:text-brand-700 group-hover/item:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div className="mt-14 text-center">
          <Link
            href="/doctors"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-2xl font-semibold hover:bg-gray-800 transition-all duration-300 shadow-lg shadow-gray-900/20"
          >
            <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search All Locations
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

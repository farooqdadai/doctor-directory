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
      locations: locs.sort((a, b) => b.count - a.count).slice(0, 4),
      totalDoctors: locs.reduce((sum, loc) => sum + loc.count, 0),
    }))
    .sort((a, b) => b.totalDoctors - a.totalDoctors)
    .slice(0, 4);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Browse by Location</h2>
          <p className="text-gray-600 mt-2">Find doctors in your area</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {topStates.map(({ state, stateName, stateSlug, locations: stateLocs }) => (
            <div key={state} className="bg-gray-50 rounded-lg p-5">
              <h3 className="font-semibold text-gray-900 mb-3">{stateName}</h3>
              <ul className="space-y-2">
                {stateLocs.map((loc) => (
                  <li key={`${loc.citySlug}-${loc.stateSlug}`}>
                    <Link
                      href={`/location/${stateSlug}/${loc.citySlug}`}
                      className="text-sm text-gray-600 hover:text-blue-600 flex items-center justify-between group"
                    >
                      <span className="group-hover:underline">{loc.city}</span>
                      <span className="text-gray-400 text-xs">{loc.count}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

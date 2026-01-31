'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { HospitalType, Location } from '@/lib/types';

interface HospitalFiltersProps {
  types: HospitalType[];
  states: { state: string; stateSlug: string; count: number }[];
  currentFilters: {
    type?: string;
    state?: string;
    hasTrauma?: boolean;
    sort?: string;
  };
}

export default function HospitalFilters({ types, states, currentFilters }: HospitalFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    // Reset to page 1 when filters change
    params.delete('page');

    router.push(`/hospitals?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push('/hospitals');
  };

  const hasActiveFilters = currentFilters.type || currentFilters.state || currentFilters.hasTrauma;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      {/* State Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
        <select
          value={currentFilters.state || ''}
          onChange={(e) => updateFilter('state', e.target.value || null)}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
        >
          <option value="">All States</option>
          {states.map((s) => (
            <option key={s.stateSlug} value={s.stateSlug}>
              {s.state} ({s.count})
            </option>
          ))}
        </select>
      </div>

      {/* Hospital Type Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Hospital Type</label>
        <select
          value={currentFilters.type || ''}
          onChange={(e) => updateFilter('type', e.target.value || null)}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
        >
          <option value="">All Types</option>
          {types.map((t) => (
            <option key={t.slug} value={t.slug}>
              {t.name} ({t.count})
            </option>
          ))}
        </select>
      </div>

      {/* Trauma Center Filter */}
      <div className="mb-6">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={currentFilters.hasTrauma || false}
            onChange={(e) => updateFilter('hasTrauma', e.target.checked ? 'true' : null)}
            className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
          />
          <span className="ml-2 text-sm text-gray-700">Trauma Center Only</span>
        </label>
      </div>

      {/* Sort */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
        <select
          value={currentFilters.sort || 'name_asc'}
          onChange={(e) => updateFilter('sort', e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
        >
          <option value="name_asc">Name (A-Z)</option>
          <option value="name_desc">Name (Z-A)</option>
          <option value="rating">Highest Rated</option>
          <option value="beds">Most Beds</option>
        </select>
      </div>
    </div>
  );
}

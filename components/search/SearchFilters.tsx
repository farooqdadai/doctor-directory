'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Specialty } from '@/lib/types';

interface SearchFiltersProps {
  specialties: Specialty[];
  currentSpecialty?: string;
  currentState?: string;
  currentCity?: string;
  verifiedOnly?: boolean;
  featuredOnly?: boolean;
}

export default function SearchFilters({
  specialties,
  currentSpecialty,
  currentState,
  currentCity,
  verifiedOnly = false,
  featuredOnly = false,
}: SearchFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string | boolean | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === null || value === '' || value === false) {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }

    // Reset to page 1 when filters change
    params.delete('page');

    router.push(`/doctors?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push('/doctors');
  };

  const hasActiveFilters = currentSpecialty || currentState || currentCity || verifiedOnly || featuredOnly;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Specialty Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Specialty
        </label>
        <select
          value={currentSpecialty || ''}
          onChange={(e) => updateFilter('specialty', e.target.value || null)}
          className="block w-full rounded-lg border border-gray-300 py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Specialties</option>
          {specialties.map((specialty) => (
            <option key={specialty.slug} value={specialty.slug}>
              {specialty.name} ({specialty.doctorCount})
            </option>
          ))}
        </select>
      </div>

      {/* Status Filters */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Status
        </label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => updateFilter('verified', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Verified only</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={featuredOnly}
              onChange={(e) => updateFilter('featured', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Featured only</span>
          </label>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-2">Active filters:</p>
          <div className="flex flex-wrap gap-2">
            {currentSpecialty && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                {specialties.find((s) => s.slug === currentSpecialty)?.name || currentSpecialty}
                <button
                  onClick={() => updateFilter('specialty', null)}
                  className="ml-1 hover:text-blue-600"
                >
                  &times;
                </button>
              </span>
            )}
            {currentState && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                {currentState.toUpperCase()}
                <button
                  onClick={() => updateFilter('state', null)}
                  className="ml-1 hover:text-blue-600"
                >
                  &times;
                </button>
              </span>
            )}
            {verifiedOnly && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                Verified
                <button
                  onClick={() => updateFilter('verified', false)}
                  className="ml-1 hover:text-green-600"
                >
                  &times;
                </button>
              </span>
            )}
            {featuredOnly && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                Featured
                <button
                  onClick={() => updateFilter('featured', false)}
                  className="ml-1 hover:text-yellow-600"
                >
                  &times;
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

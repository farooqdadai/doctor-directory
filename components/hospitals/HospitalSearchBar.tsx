'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function HospitalSearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams(searchParams.toString());

    if (query.trim()) {
      params.set('q', query.trim());
    } else {
      params.delete('q');
    }

    params.delete('page');

    router.push(`/hospitals?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search hospitals by name, city, or services..."
          className="w-full px-5 py-4 pl-12 pr-32 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 placeholder-gray-400 shadow-sm"
        />
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium"
        >
          Search
        </button>
      </div>
    </form>
  );
}

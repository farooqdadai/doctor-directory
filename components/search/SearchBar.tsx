'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../ui/Button';

interface SearchBarProps {
  defaultQuery?: string;
  defaultLocation?: string;
  size?: 'default' | 'large';
}

export default function SearchBar({
  defaultQuery = '',
  defaultLocation = '',
  size = 'default',
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultQuery);
  const [location, setLocation] = useState(defaultLocation);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (location) params.set('location', location);

    router.push(`/doctors?${params.toString()}`);
  };

  const isLarge = size === 'large';

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div
        className={`flex flex-col sm:flex-row gap-3 ${
          isLarge ? 'bg-white rounded-xl shadow-lg p-3' : ''
        }`}
      >
        {/* Specialty/Name Search */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className={`${isLarge ? 'w-5 h-5' : 'w-4 h-4'} text-gray-400`}
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
          </div>
          <input
            type="text"
            placeholder="Search by specialty, condition, or doctor name"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`
              block w-full pl-10 pr-4 rounded-lg border border-gray-300
              text-gray-900 placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              ${isLarge ? 'py-4 text-lg' : 'py-2.5'}
            `}
          />
        </div>

        {/* Location Search */}
        <div className="relative sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className={`${isLarge ? 'w-5 h-5' : 'w-4 h-4'} text-gray-400`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="City, State"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className={`
              block w-full pl-10 pr-4 rounded-lg border border-gray-300
              text-gray-900 placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              ${isLarge ? 'py-4 text-lg' : 'py-2.5'}
            `}
          />
        </div>

        {/* Submit Button */}
        <Button type="submit" size={isLarge ? 'lg' : 'md'} className={isLarge ? 'px-8' : ''}>
          Search
        </Button>
      </div>
    </form>
  );
}

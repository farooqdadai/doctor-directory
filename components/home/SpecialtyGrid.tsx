import Link from 'next/link';
import { Specialty } from '@/lib/types';

interface SpecialtyGridProps {
  specialties: Specialty[];
}

// Modern color schemes for specialties
const specialtyColors: Record<string, { bg: string; icon: string; border: string }> = {
  'cardiology': { bg: 'bg-red-50', icon: 'text-red-600', border: 'border-red-100' },
  'neurology': { bg: 'bg-purple-50', icon: 'text-purple-600', border: 'border-purple-100' },
  'orthopedics': { bg: 'bg-amber-50', icon: 'text-amber-600', border: 'border-amber-100' },
  'orthopedic-surgery': { bg: 'bg-amber-50', icon: 'text-amber-600', border: 'border-amber-100' },
  'pediatrics': { bg: 'bg-pink-50', icon: 'text-pink-600', border: 'border-pink-100' },
  'dermatology': { bg: 'bg-cyan-50', icon: 'text-cyan-600', border: 'border-cyan-100' },
  'ophthalmology': { bg: 'bg-blue-50', icon: 'text-blue-600', border: 'border-blue-100' },
  'psychiatry': { bg: 'bg-violet-50', icon: 'text-violet-600', border: 'border-violet-100' },
  'oncology': { bg: 'bg-rose-50', icon: 'text-rose-600', border: 'border-rose-100' },
  'gastroenterology': { bg: 'bg-orange-50', icon: 'text-orange-600', border: 'border-orange-100' },
  'pulmonology': { bg: 'bg-sky-50', icon: 'text-sky-600', border: 'border-sky-100' },
  'endocrinology': { bg: 'bg-teal-50', icon: 'text-teal-600', border: 'border-teal-100' },
  'rheumatology': { bg: 'bg-indigo-50', icon: 'text-indigo-600', border: 'border-indigo-100' },
  'urology': { bg: 'bg-emerald-50', icon: 'text-emerald-600', border: 'border-emerald-100' },
  'nephrology': { bg: 'bg-lime-50', icon: 'text-lime-600', border: 'border-lime-100' },
  'internal-medicine': { bg: 'bg-blue-50', icon: 'text-blue-600', border: 'border-blue-100' },
  'family-medicine': { bg: 'bg-green-50', icon: 'text-green-600', border: 'border-green-100' },
  'emergency-medicine': { bg: 'bg-red-50', icon: 'text-red-600', border: 'border-red-100' },
  'surgery': { bg: 'bg-slate-50', icon: 'text-slate-600', border: 'border-slate-100' },
  'general-surgery': { bg: 'bg-slate-50', icon: 'text-slate-600', border: 'border-slate-100' },
};

function getSpecialtyColors(slug: string) {
  return specialtyColors[slug] || { bg: 'bg-gray-50', icon: 'text-gray-600', border: 'border-gray-100' };
}

// SVG icons for common specialties
function SpecialtyIcon({ slug, className }: { slug: string; className?: string }) {
  const icons: Record<string, React.ReactNode> = {
    'cardiology': (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    'neurology': (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    'orthopedics': (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
      </svg>
    ),
    'pediatrics': (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    'dermatology': (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
    'ophthalmology': (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
    'psychiatry': (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    'surgery': (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
  };

  return icons[slug] || (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );
}

export default function SpecialtyGrid({ specialties }: SpecialtyGridProps) {
  // Take top 9 specialties
  const topSpecialties = specialties.slice(0, 9);

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-white via-gray-50/50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-50 text-brand-700 rounded-full text-sm font-semibold mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
            Specializations
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mt-2">Browse by Specialty</h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg">
            Find the right healthcare professional based on their area of expertise
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topSpecialties.map((specialty) => {
            const colors = getSpecialtyColors(specialty.slug);
            return (
              <Link
                key={specialty.slug}
                href={`/specialty/${specialty.slug}`}
                className={`group relative bg-white rounded-2xl p-6 border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 overflow-hidden`}
              >
                {/* Gradient accent on hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-700 to-brand-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-2xl ${colors.bg} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300 shadow-sm`}>
                    <SpecialtyIcon slug={specialty.slug} className={`w-7 h-7 ${colors.icon}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 group-hover:text-brand-700 transition-colors text-lg">
                      {specialty.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 font-medium">
                      {specialty.count.toLocaleString()} {specialty.count === 1 ? 'provider' : 'providers'}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="w-8 h-8 rounded-lg bg-gray-50 group-hover:bg-brand-50 flex items-center justify-center transition-colors duration-300">
                    <svg
                      className="w-4 h-4 text-gray-400 group-hover:text-brand-700 group-hover:translate-x-0.5 transition-all duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {specialties.length > 9 && (
          <div className="text-center mt-12">
            <Link
              href="/doctors"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-2xl font-semibold hover:bg-gray-800 transition-all duration-300 shadow-lg shadow-gray-900/20"
            >
              View all {specialties.length} specialties
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

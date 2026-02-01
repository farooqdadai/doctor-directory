import Link from 'next/link';
import { Doctor } from '@/lib/types';
import DoctorCard from '../doctors/DoctorCard';

interface FeaturedDoctorsProps {
  doctors: Doctor[];
}

export default function FeaturedDoctors({ doctors }: FeaturedDoctorsProps) {
  if (doctors.length === 0) {
    return null;
  }

  return (
    <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-50 text-brand-700 rounded-full text-sm font-semibold mb-4">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Verified Providers
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mt-2">Featured Healthcare Professionals</h2>
            <p className="text-gray-600 mt-4 max-w-2xl text-lg">
              Browse our directory of verified providers with confirmed credentials
            </p>
          </div>
          <Link
            href="/doctors?verified=true"
            className="hidden md:inline-flex items-center gap-2 mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-brand-900 to-brand-700 text-white rounded-xl hover:shadow-lg hover:shadow-brand-700/25 transition-all duration-300 font-semibold"
          >
            View All Providers
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.slice(0, 6).map((doctor) => (
            <DoctorCard key={doctor.npi} doctor={doctor} />
          ))}
        </div>

        <div className="text-center mt-10 md:hidden">
          <Link
            href="/doctors?verified=true"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-900 to-brand-700 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold"
          >
            View All Providers
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

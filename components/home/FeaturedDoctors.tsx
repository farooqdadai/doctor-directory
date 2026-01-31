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
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Top Providers</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Verified Healthcare Professionals</h2>
            <p className="text-gray-600 mt-3 max-w-2xl">
              Browse our directory of verified providers with confirmed credentials
            </p>
          </div>
          <Link
            href="/doctors?verified=true"
            className="hidden md:inline-flex items-center mt-4 md:mt-0 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-sm"
          >
            View All Providers
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-sm"
          >
            View All Providers
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

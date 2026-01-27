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
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Featured Doctors</h2>
            <p className="text-gray-600 mt-2">Top-rated healthcare professionals</p>
          </div>
          <Link
            href="/doctors?featured=true"
            className="hidden sm:inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            View all
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.slice(0, 6).map((doctor) => (
            <DoctorCard key={doctor.npi} doctor={doctor} />
          ))}
        </div>

        <div className="text-center mt-8 sm:hidden">
          <Link
            href="/doctors?featured=true"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            View all featured doctors
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

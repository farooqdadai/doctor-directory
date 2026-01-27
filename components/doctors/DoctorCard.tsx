import Link from 'next/link';
import { Doctor } from '@/lib/types';
import Badge from '../ui/Badge';
import Card from '../ui/Card';

interface DoctorCardProps {
  doctor: Doctor;
}

export default function DoctorCard({ doctor }: DoctorCardProps) {
  return (
    <Link href={`/doctor/${doctor.slug}`}>
      <Card hover className="h-full">
        <div className="p-6">
          <div className="flex items-start gap-4">
            {/* Avatar placeholder */}
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-blue-600">
                {doctor.fullName.charAt(0)}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              {/* Name and badges */}
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {doctor.fullName}
                </h3>
                <div className="flex gap-1 flex-shrink-0">
                  {doctor.isFeatured && (
                    <Badge variant="featured">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      Featured
                    </Badge>
                  )}
                  {doctor.isVerified && (
                    <Badge variant="verified">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Verified
                    </Badge>
                  )}
                </div>
              </div>

              {/* Specialty */}
              <p className="text-blue-600 font-medium mt-1">
                {doctor.specialty}
                {doctor.subSpecialty && (
                  <span className="text-gray-500 font-normal"> - {doctor.subSpecialty}</span>
                )}
              </p>

              {/* Practice Name */}
              {doctor.practiceName && (
                <p className="text-gray-600 text-sm mt-1 truncate">{doctor.practiceName}</p>
              )}

              {/* Location */}
              <p className="text-gray-500 text-sm mt-2 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {doctor.city}, {doctor.state}
              </p>
            </div>
          </div>

          {/* Contact info */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
            {doctor.phone && (
              <span className="text-sm text-gray-600 flex items-center">
                <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {doctor.phone}
              </span>
            )}
            {doctor.website && (
              <span className="text-sm text-blue-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                Website
              </span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}

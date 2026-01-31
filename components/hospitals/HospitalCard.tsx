'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Hospital } from '@/lib/types';

interface HospitalCardProps {
  hospital: Hospital;
}

export default function HospitalCard({ hospital }: HospitalCardProps) {
  return (
    <Link href={`/hospital/${hospital.slug}`} className="block h-full">
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="group bg-white rounded-2xl border border-gray-100 hover:border-brand-300 hover:shadow-xl hover:shadow-brand-700/10 transition-all duration-300 overflow-hidden h-full"
      >
        {/* Header with gradient */}
        <div className="h-24 bg-gradient-to-br from-brand-900 via-brand-700 to-brand-600 relative">
          {/* Hospital Icon */}
          <div className="absolute -bottom-8 left-6">
            <div className="w-16 h-16 rounded-xl bg-white shadow-lg shadow-brand-700/20 flex items-center justify-center border border-gray-100 group-hover:shadow-brand-700/30 transition-shadow duration-300">
              {hospital.logo ? (
                <img src={hospital.logo} alt={hospital.name} className="w-12 h-12 object-contain" />
              ) : (
                <svg className="w-8 h-8 text-brand-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              )}
            </div>
          </div>

          {/* Rating Badge */}
          {hospital.googleRating && (
            <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 bg-white/95 backdrop-blur-sm rounded-lg text-sm font-semibold shadow-sm">
              <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-gray-900">{hospital.googleRating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="pt-10 px-6 pb-6">
          {/* Name */}
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-brand-700 transition-colors duration-200 line-clamp-2 mb-2">
            {hospital.name}
          </h3>

          {/* Type Badge */}
          {hospital.type && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-brand-50 text-brand-900 text-xs font-medium mb-3">
              {hospital.type}
            </span>
          )}

          {/* Location */}
          <div className="flex items-start gap-2 text-sm text-gray-500 mb-3">
            <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="line-clamp-2">
              {hospital.city}, {hospital.state} {hospital.zip}
            </span>
          </div>

          {/* Info Pills */}
          <div className="flex flex-wrap gap-2 mb-4">
            {hospital.beds && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-gray-50 text-gray-600 text-xs font-medium">
                <svg className="w-3.5 h-3.5 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                {hospital.beds} Beds
              </span>
            )}
            {hospital.trauma && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-red-50 text-red-600 text-xs font-medium">
                <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Trauma: {hospital.trauma}
              </span>
            )}
            {hospital.county && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-brand-50 text-brand-900 text-xs font-medium">
                {hospital.county} County
              </span>
            )}
          </div>

          {/* Contact */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              {hospital.telephone && (
                <a
                  href={`tel:${hospital.telephone.replace(/\D/g, '')}`}
                  onClick={(e) => e.stopPropagation()}
                  className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-brand-50 flex items-center justify-center transition-colors duration-200"
                >
                  <svg className="w-4 h-4 text-gray-400 hover:text-brand-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </a>
              )}
              {hospital.website && (
                <a
                  href={hospital.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-brand-50 flex items-center justify-center transition-colors duration-200"
                >
                  <svg className="w-4 h-4 text-gray-400 hover:text-brand-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </a>
              )}
              {hospital.googleMapLink && (
                <a
                  href={hospital.googleMapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-brand-50 flex items-center justify-center transition-colors duration-200"
                >
                  <svg className="w-4 h-4 text-gray-400 hover:text-brand-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </a>
              )}
            </div>

            {/* View Details Arrow */}
            <div className="flex items-center text-brand-700 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-2 group-hover:translate-x-0">
              <span className="mr-1">View</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

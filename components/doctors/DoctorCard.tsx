'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Doctor } from '@/lib/types';

interface DoctorCardProps {
  doctor: Doctor;
}

export default function DoctorCard({ doctor }: DoctorCardProps) {
  // Get initials for avatar
  const initials = `${doctor.firstName.charAt(0)}${doctor.lastName.charAt(0)}`;

  // Get best available phone
  const displayPhone = doctor.phone || doctor.directPhone || doctor.mobilePhone;

  // Get best available email
  const displayEmail = doctor.email || doctor.workEmail;

  return (
    <Link href={`/doctor/${doctor.slug}`} className="block h-full">
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative bg-white rounded-2xl border border-gray-100 hover:border-brand-200 shadow-sm hover:shadow-xl hover:shadow-brand-700/10 transition-all duration-300 overflow-hidden h-full group"
      >
        {/* Gradient accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-900 via-brand-700 to-brand-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />

        <div className="p-6">
          {/* Header with avatar and badges */}
          <div className="flex items-start gap-4">
            {/* Modern Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-900 via-brand-700 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-700/25 group-hover:shadow-brand-700/40 transition-all duration-300 group-hover:scale-105">
                <span className="text-xl font-bold text-white tracking-wide">{initials}</span>
              </div>
              {doctor.isVerified && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              {/* Name */}
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-brand-700 transition-colors duration-300 truncate">
                {doctor.fullName}
              </h3>

              {/* Specialty */}
              <p className="text-brand-600 font-semibold text-sm mt-0.5">
                {doctor.specialty}
              </p>

              {/* Location */}
              <div className="flex items-center gap-1.5 mt-2 text-gray-500 text-sm">
                <svg className="w-4 h-4 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="truncate font-medium">{doctor.city}, {doctor.state}</span>
              </div>
            </div>
          </div>

          {/* Info Pills */}
          <div className="flex flex-wrap gap-2 mt-4">
            {doctor.hospitalAffiliation && (
              <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-brand-50/80 text-brand-800 text-xs font-semibold">
                <svg className="w-3.5 h-3.5 mr-1.5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="truncate max-w-[130px]">{doctor.hospitalAffiliation}</span>
              </span>
            )}
            {doctor.practiceName && !doctor.hospitalAffiliation && (
              <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-brand-50/80 text-brand-800 text-xs font-semibold">
                <svg className="w-3.5 h-3.5 mr-1.5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="truncate max-w-[130px]">{doctor.practiceName}</span>
              </span>
            )}
            {doctor.licenseState && (
              <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-gray-100 text-gray-700 text-xs font-semibold">
                <svg className="w-3.5 h-3.5 mr-1.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                {doctor.licenseState}
              </span>
            )}
          </div>

          {/* Contact Info */}
          <div className="mt-5 pt-5 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {displayPhone && (
                  <div className="w-9 h-9 rounded-xl bg-gray-50 group-hover:bg-brand-50 flex items-center justify-center transition-colors duration-300">
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-brand-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                )}
                {displayEmail && (
                  <div className="w-9 h-9 rounded-xl bg-gray-50 group-hover:bg-brand-50 flex items-center justify-center transition-colors duration-300">
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-brand-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                {doctor.linkedin && (
                  <div className="w-9 h-9 rounded-xl bg-[#0077b5]/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-[#0077b5]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </div>
                )}
              </div>

              {/* View Profile Arrow */}
              <div className="flex items-center text-brand-700 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-3 group-hover:translate-x-0">
                <span className="mr-1.5">View Profile</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

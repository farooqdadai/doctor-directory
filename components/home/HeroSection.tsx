'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import SearchBar from '../search/SearchBar';

interface HeroSectionProps {
  totalDoctors?: number;
}

export default function HeroSection({ totalDoctors = 0 }: HeroSectionProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-brand-50/30" />

      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-brand-200/40 to-brand-300/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -20, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-gradient-to-tr from-brand-100/50 to-brand-200/40 rounded-full blur-3xl"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-brand-50/30 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 pattern-grid opacity-30" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-brand-100 shadow-sm mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium text-gray-700">
                Trusted by <span className="text-brand-700 font-bold">500,000+</span> patients
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-[1.1] mb-6"
            >
              Find Your{' '}
              <span className="relative inline-block">
                <span className="relative z-10 gradient-text">Perfect</span>
                <motion.span
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 0.8, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                  className="absolute bottom-2 left-0 h-3 bg-brand-200/60 -z-10 rounded"
                />
              </span>
              <br />
              Healthcare Provider
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-lg sm:text-xl text-gray-600 mb-10 max-w-xl leading-relaxed"
            >
              Connect with verified doctors, specialists, and hospitals.
              Book appointments and access quality healthcare in your area.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex flex-wrap items-center gap-x-10 gap-y-4 mb-10"
            >
              {[
                { value: totalDoctors > 0 ? totalDoctors.toLocaleString() : '500K+', label: 'Doctors' },
                { value: '150K+', label: 'Verified' },
                { value: '2,000+', label: 'Hospitals' }
              ].map((stat, index) => (
                <div key={index} className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-bold text-brand-900">
                    {stat.value}
                  </span>
                  <span className="text-sm font-medium text-gray-500">{stat.label}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-wrap gap-4"
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/doctors"
                  className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-brand-900 to-brand-700 text-white rounded-2xl font-semibold shadow-xl shadow-brand-700/25 hover:shadow-brand-700/40 transition-all duration-300 overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-brand-800 to-brand-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <svg className="relative w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="relative">Find a Doctor</span>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/hospitals"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200 text-gray-900 rounded-2xl font-semibold hover:border-brand-300 hover:bg-brand-50/50 transition-all duration-300"
                >
                  <svg className="w-5 h-5 text-brand-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span>Find Hospitals</span>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Content - Search Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative"
          >
            {/* Floating elements */}
            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -left-6 z-20 bg-white rounded-2xl shadow-xl shadow-brand-200/40 p-4 border border-gray-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center shadow-lg shadow-green-500/30">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Verified Doctors</p>
                  <p className="text-xs text-gray-500">All credentials checked</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [5, -5, 5] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-4 -right-4 z-20 bg-white rounded-2xl shadow-xl shadow-brand-200/40 p-4 border border-gray-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-600 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-700/30">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Quick Booking</p>
                  <p className="text-xs text-gray-500">Connect instantly</p>
                </div>
              </div>
            </motion.div>

            {/* Main Search Card */}
            <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-brand-200/30 border border-gray-100/80 p-8 lg:p-10">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-brand-50/50 to-transparent pointer-events-none" />

              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Quick Search</h2>
                    <p className="text-sm text-gray-500 mt-1">Find healthcare providers near you</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center">
                    <svg className="w-6 h-6 text-brand-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                <SearchBar size="large" />

                {/* Popular Tags */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Popular Specialties</p>
                  <div className="flex flex-wrap gap-2">
                    {['Cardiology', 'Dermatology', 'Orthopedics', 'Pediatrics', 'Neurology'].map((specialty, index) => (
                      <Link
                        key={specialty}
                        href={`/specialty/${specialty.toLowerCase()}`}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                          index === 0
                            ? 'bg-brand-700 text-white shadow-md shadow-brand-700/25 hover:bg-brand-800'
                            : 'bg-gray-50 text-gray-700 hover:bg-brand-50 hover:text-brand-700'
                        }`}
                      >
                        {specialty}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

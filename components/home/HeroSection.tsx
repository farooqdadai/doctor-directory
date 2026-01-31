'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import SearchBar from '../search/SearchBar';
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer, staggerItem, float } from '@/lib/motion';

interface HeroSectionProps {
  totalDoctors?: number;
}

export default function HeroSection({ totalDoctors = 0 }: HeroSectionProps) {
  return (
    <section className="bg-gradient-to-b from-slate-50 via-white to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.h1
              variants={staggerItem}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6"
            >
              Find Trusted{' '}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Medical Experts
              </span>{' '}
              Instantly
            </motion.h1>

            <motion.p
              variants={staggerItem}
              className="text-lg text-gray-600 mb-8 max-w-lg leading-relaxed"
            >
              Your one-stop directory for doctors, clinics, hospitals and healthcare providers. Search by specialty, location, and more.
            </motion.p>

            {/* Stats */}
            <motion.div
              variants={staggerItem}
              className="flex flex-wrap gap-8 mb-10"
            >
              {[
                { value: totalDoctors > 0 ? totalDoctors.toLocaleString() : '500K', label: 'Trusted Doctors' },
                { value: '150K', label: 'Verified Doctors' },
                { value: '2000+', label: 'Cities & Hospitals' }
              ].map((stat, index) => (
                <div key={index} className="text-center sm:text-left">
                  <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={staggerItem}
              className="flex flex-wrap gap-4 mb-10"
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/doctors"
                  className="inline-flex items-center px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search a Doctor
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/hospitals"
                  className="inline-flex items-center px-6 py-3.5 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-gray-300 hover:bg-gray-50 transition-all duration-300"
                >
                  <svg className="w-5 h-5 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Find Hospitals
                </Link>
              </motion.div>
            </motion.div>

            {/* Search Section */}
            <motion.div
              variants={staggerItem}
              className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Quick Search</h2>
              <p className="text-sm text-gray-500 mb-4">
                Find a doctor by specialty, name, or location
              </p>

              <SearchBar size="large" />

              {/* Popular Tags */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-sm text-gray-500">Popular:</span>
                {['Cardiology', 'Dermatology', 'Orthopedics', 'Pediatrics'].map((specialty, index) => (
                  <Link
                    key={specialty}
                    href={`/specialty/${specialty.toLowerCase()}`}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      index === 0
                        ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {specialty}
                  </Link>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Doctor Illustration */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInRight}
            className="relative hidden lg:block"
          >
            {/* Main Image Container */}
            <div className="relative">
              {/* Background shapes */}
              <div className="absolute -top-8 -right-8 w-72 h-72 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full opacity-60 blur-3xl" />
              <div className="absolute -bottom-4 -left-4 w-48 h-48 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full opacity-60 blur-2xl" />

              {/* Doctor Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="relative bg-white rounded-3xl shadow-2xl shadow-gray-200/50 overflow-hidden border border-gray-100"
              >
                {/* Header gradient */}
                <div className="h-32 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600" />

                {/* Doctor Avatar */}
                <div className="relative px-8 pb-8">
                  <div className="-mt-16 mb-4">
                    <div className="w-32 h-32 mx-auto rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-xl shadow-blue-500/30 border-4 border-white">
                      <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="inline-flex items-center px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium mb-3">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Verified Doctor
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Dr. Sarah Johnson</h3>
                    <p className="text-blue-600 font-medium">Cardiologist</p>
                    <p className="text-sm text-gray-500 mt-1">New York, NY</p>

                    {/* Rating */}
                    <div className="flex items-center justify-center gap-1 mt-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="text-sm text-gray-600 ml-1 font-medium">4.9</span>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
                      <div>
                        <p className="text-lg font-bold text-gray-900">15+</p>
                        <p className="text-xs text-gray-500">Years Exp.</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-900">2000+</p>
                        <p className="text-xs text-gray-500">Patients</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-900">98%</p>
                        <p className="text-xs text-gray-500">Satisfaction</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Elements */}
              <motion.div
                initial="initial"
                animate="animate"
                variants={float}
                className="absolute top-12 -left-8 bg-white rounded-xl shadow-lg shadow-gray-200/50 p-4 border border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">100% Verified</p>
                    <p className="text-xs text-gray-500">All credentials checked</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial="initial"
                animate="animate"
                variants={{
                  initial: { y: 0 },
                  animate: {
                    y: [4, -4, 4],
                    transition: {
                      duration: 3.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }
                }}
                className="absolute bottom-24 -right-4 bg-white rounded-xl shadow-lg shadow-gray-200/50 p-4 border border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Quick Access</p>
                    <p className="text-xs text-gray-500">Book appointments</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

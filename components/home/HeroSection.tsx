import Link from 'next/link';
import SearchBar from '../search/SearchBar';

interface HeroSectionProps {
  totalDoctors?: number;
}

export default function HeroSection({ totalDoctors = 0 }: HeroSectionProps) {
  return (
    <section className="bg-gradient-to-b from-blue-50 via-white to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Find Trusted{' '}
              <span className="text-blue-600">Medical Experts</span>{' '}
              Instantly
            </h1>

            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              Your one-stop directory for doctors, clinics, hospitals and healthcare providers. Search by specialty, location, and more.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 mb-10">
              <div>
                <p className="text-3xl md:text-4xl font-bold text-gray-900">
                  {totalDoctors > 0 ? totalDoctors.toLocaleString() : '500K'}
                </p>
                <p className="text-sm text-gray-500">Trusted Doctors</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold text-gray-900">150K</p>
                <p className="text-sm text-gray-500">Verified Doctors</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold text-gray-900">2000+</p>
                <p className="text-sm text-gray-500">Cities & Hospitals</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mb-10">
              <Link
                href="/doctors"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/25"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search a Doctor
              </Link>
              <Link
                href="/doctors?verified=true"
                className="inline-flex items-center px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-full font-medium hover:border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Verified Doctors
              </Link>
            </div>

            {/* Search Section */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Search Doctor</h2>
              <p className="text-sm text-gray-500 mb-4">
                Find a doctor based on specialty, name, location and preferred availability
              </p>

              <SearchBar size="large" />

              {/* Popular Tags */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-sm text-gray-500">Popular:</span>
                <Link href="/specialty/cardiology" className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors">
                  Cardiology
                </Link>
                <Link href="/specialty/dermatology" className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">
                  Dermatology
                </Link>
                <Link href="/specialty/orthopedics" className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">
                  Orthopedics
                </Link>
                <Link href="/specialty/pediatrics" className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">
                  Pediatrics
                </Link>
                <Link href="/specialty/neurology" className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">
                  Neurology
                </Link>
              </div>
            </div>
          </div>

          {/* Right Content - Doctor Illustration */}
          <div className="relative hidden lg:block">
            {/* Main Image Container */}
            <div className="relative">
              {/* Background shapes */}
              <div className="absolute -top-8 -right-8 w-72 h-72 bg-blue-100 rounded-full opacity-60" />
              <div className="absolute -bottom-4 -left-4 w-48 h-48 bg-indigo-100 rounded-full opacity-60" />

              {/* Doctor Card */}
              <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                {/* Header gradient */}
                <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600" />

                {/* Doctor Avatar */}
                <div className="relative px-8 pb-8">
                  <div className="-mt-16 mb-4">
                    <div className="w-32 h-32 mx-auto rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-xl border-4 border-white">
                      <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-3">
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
                        <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="text-sm text-gray-600 ml-1">4.9</span>
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
              </div>

              {/* Floating Elements */}
              <div className="absolute top-12 -left-8 bg-white rounded-xl shadow-lg p-4 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">100% Verified</p>
                    <p className="text-xs text-gray-500">All credentials checked</p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-24 -right-4 bg-white rounded-xl shadow-lg p-4 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Quick Access</p>
                    <p className="text-xs text-gray-500">Book appointments</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getHospitalBySlug, getRelatedHospitals } from '@/lib/data/sheets';
import HospitalCard from '@/components/hospitals/HospitalCard';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const hospital = await getHospitalBySlug(slug);

  if (!hospital) {
    return { title: 'Hospital Not Found' };
  }

  return {
    title: `${hospital.name} | ${hospital.city}, ${hospital.state}`,
    description: `${hospital.name} is a ${hospital.type || 'healthcare facility'} located in ${hospital.city}, ${hospital.state}. ${hospital.beds ? `${hospital.beds} beds.` : ''} ${hospital.telephone ? `Contact: ${hospital.telephone}` : ''}`,
  };
}

export default async function HospitalDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const hospital = await getHospitalBySlug(slug);

  if (!hospital) {
    notFound();
  }

  const relatedHospitals = await getRelatedHospitals(hospital, 3);

  // Parse services into array if exists
  const services = hospital.services
    ? hospital.services.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  // Parse amenities and accessibility
  const amenities = hospital.amenitiesCheck
    ? hospital.amenitiesCheck.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  const accessibility = hospital.accessibilityCheck
    ? hospital.accessibilityCheck.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  const payments = hospital.payments
    ? hospital.payments.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Navigation */}
          <Link
            href="/hospitals"
            className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Hospitals
          </Link>

          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Hospital Icon */}
            <div className="relative mx-auto md:mx-0">
              <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-2xl border border-white/30">
                {hospital.logo ? (
                  <img src={hospital.logo} alt={hospital.name} className="w-16 h-16 object-contain" />
                ) : (
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl sm:text-4xl font-bold mb-3">{hospital.name}</h1>

              {/* Badges */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-4">
                {hospital.type && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white text-sm font-medium border border-white/30">
                    {hospital.type}
                  </span>
                )}
                {hospital.trauma && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-500/30 text-white text-sm font-medium border border-red-400/30">
                    <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Trauma Level: {hospital.trauma}
                  </span>
                )}
                {hospital.googleRating && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-500/30 text-white text-sm font-medium border border-yellow-400/30">
                    <svg className="w-3.5 h-3.5 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {hospital.googleRating.toFixed(1)} Rating
                  </span>
                )}
              </div>

              {/* Location */}
              <div className="flex items-center justify-center md:justify-start text-emerald-100">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {hospital.address && `${hospital.address}, `}
                {hospital.city}, {hospital.state} {hospital.zip}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            {hospital.telephone && (
              <a
                href={`tel:${hospital.telephone.replace(/\D/g, '')}`}
                className="inline-flex items-center px-5 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-sm font-medium"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call Now
              </a>
            )}
            {hospital.website && (
              <a
                href={hospital.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                Visit Website
              </a>
            )}
            {hospital.googleMapLink && (
              <a
                href={hospital.googleMapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Get Directions
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hospital Info */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Hospital Information
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {hospital.beds && (
                    <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                      <div className="flex items-start">
                        <div className="w-10 h-10 rounded-lg bg-blue-200 flex items-center justify-center mr-3 flex-shrink-0">
                          <svg className="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-blue-700">Number of Beds</p>
                          <p className="text-2xl font-bold text-blue-900">{hospital.beds}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {hospital.county && (
                    <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
                      <div className="flex items-start">
                        <div className="w-10 h-10 rounded-lg bg-purple-200 flex items-center justify-center mr-3 flex-shrink-0">
                          <svg className="w-5 h-5 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-purple-700">County</p>
                          <p className="text-xl font-bold text-purple-900">{hospital.county}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {hospital.type && (
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                      <div className="flex items-start">
                        <div className="w-10 h-10 rounded-lg bg-emerald-200 flex items-center justify-center mr-3 flex-shrink-0">
                          <svg className="w-5 h-5 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-emerald-700">Hospital Type</p>
                          <p className="text-xl font-bold text-emerald-900">{hospital.type}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {hospital.telephone && (
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                      <div className="flex items-start">
                        <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center mr-3 flex-shrink-0">
                          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Phone</p>
                          <p className="text-xl font-bold text-gray-900">{hospital.telephone}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Services */}
            {services.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Services
                  </h2>
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-2">
                    {services.map((service, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Amenities & Accessibility */}
            {(amenities.length > 0 || accessibility.length > 0 || payments.length > 0) && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Amenities & Accessibility
                  </h2>
                </div>
                <div className="p-6 space-y-6">
                  {accessibility.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Accessibility</h3>
                      <div className="flex flex-wrap gap-2">
                        {accessibility.map((item, idx) => (
                          <span key={idx} className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {amenities.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Amenities</h3>
                      <div className="flex flex-wrap gap-2">
                        {amenities.map((item, idx) => (
                          <span key={idx} className="inline-flex items-center px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {payments.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Payment Options</h3>
                      <div className="flex flex-wrap gap-2">
                        {payments.map((item, idx) => (
                          <span key={idx} className="inline-flex items-center px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-900">Quick Info</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="text-gray-900 font-medium">{hospital.city}, {hospital.state}</p>
                  </div>
                </div>

                {hospital.id && (
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Hospital ID</p>
                      <p className="text-gray-900 font-mono font-medium">{hospital.id}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Social Links */}
            {(hospital.facebook || hospital.instagram || hospital.linkedin || hospital.twitter || hospital.youtube) && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                  <h2 className="text-lg font-semibold text-gray-900">Follow Us</h2>
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-3">
                    {hospital.facebook && (
                      <a
                        href={hospital.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-lg bg-[#1877f2] flex items-center justify-center hover:opacity-90 transition-opacity"
                      >
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </a>
                    )}
                    {hospital.instagram && (
                      <a
                        href={hospital.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] flex items-center justify-center hover:opacity-90 transition-opacity"
                      >
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </a>
                    )}
                    {hospital.linkedin && (
                      <a
                        href={hospital.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-lg bg-[#0077b5] flex items-center justify-center hover:opacity-90 transition-opacity"
                      >
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </a>
                    )}
                    {hospital.twitter && (
                      <a
                        href={hospital.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-lg bg-black flex items-center justify-center hover:opacity-90 transition-opacity"
                      >
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                      </a>
                    )}
                    {hospital.youtube && (
                      <a
                        href={hospital.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-lg bg-[#ff0000] flex items-center justify-center hover:opacity-90 transition-opacity"
                      >
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Map Card */}
            {hospital.googleMapLink && (
              <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl shadow-sm overflow-hidden text-white p-6">
                <h3 className="font-semibold mb-2">Get Directions</h3>
                <p className="text-emerald-100 text-sm mb-4">View this hospital on Google Maps for directions and more information.</p>
                <a
                  href={hospital.googleMapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-white text-emerald-600 rounded-lg font-medium hover:bg-emerald-50 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Open in Maps
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Related Hospitals */}
        {relatedHospitals.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Nearby Hospitals</h2>
              <Link
                href={`/hospitals?state=${hospital.stateSlug}`}
                className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center"
              >
                View All
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedHospitals.map((relatedHospital) => (
                <HospitalCard key={relatedHospital.id} hospital={relatedHospital} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

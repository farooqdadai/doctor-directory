import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getDoctorBySlug, getRelatedDoctors } from "@/lib/data/sheets";
import { getStateName } from "@/lib/utils/slugify";
import DoctorCard from "@/components/doctors/DoctorCard";
import { DoctorJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const doctor = await getDoctorBySlug(slug);

  if (!doctor) {
    return {
      title: "Doctor Not Found",
    };
  }

  return {
    title: `${doctor.fullName} - ${doctor.specialty}`,
    description: `${doctor.fullName} is a ${doctor.isVerified ? "verified " : ""}${doctor.specialty} at ${doctor.practiceName || doctor.hospitalAffiliation || "a practice"} in ${doctor.city}, ${doctor.state}. ${doctor.phone ? `Contact: ${doctor.phone}` : ""}`,
  };
}

export default async function DoctorProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const doctor = await getDoctorBySlug(slug);

  if (!doctor) {
    notFound();
  }

  const relatedDoctors = await getRelatedDoctors(doctor, 3);

  // Get initials for avatar
  const initials = `${doctor.firstName.charAt(0)}${doctor.lastName.charAt(0)}`;

  // Collect all available contact info
  const emails = [
    { type: "Primary", value: doctor.email },
    { type: "Work", value: doctor.workEmail },
    { type: "Personal", value: doctor.personalEmail },
  ].filter(e => e.value);

  const phones = [
    { type: "Primary", value: doctor.phone },
    { type: "Direct", value: doctor.directPhone },
    { type: "Mobile", value: doctor.mobilePhone },
  ].filter(p => p.value);

  // Social links
  const socialLinks = [
    { type: "LinkedIn", url: doctor.linkedin, icon: "linkedin" },
    { type: "Company LinkedIn", url: doctor.companyLinkedin, icon: "linkedin" },
    { type: "Facebook", url: doctor.companyFacebook, icon: "facebook" },
    { type: "Twitter", url: doctor.companyTwitter, icon: "twitter" },
  ].filter(s => s.url);

  return (
    <>
      <DoctorJsonLd doctor={doctor} />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Doctors', url: '/doctors' },
          { name: doctor.specialty, url: `/specialty/${doctor.specialtySlug}` },
          { name: doctor.fullName, url: `/doctor/${doctor.slug}` },
        ]}
      />
      <div className="bg-gray-50 min-h-screen">
        {/* Hero Section with Gradient */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Navigation */}
          <Link
            href="/doctors"
            className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Results
          </Link>

          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Avatar */}
            <div className="relative mx-auto md:mx-0">
              <div className="w-28 h-28 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-2xl border border-white/30">
                <span className="text-4xl font-bold text-white">{initials}</span>
              </div>
              {doctor.isVerified && (
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-indigo-600 shadow-lg">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                <h1 className="text-3xl sm:text-4xl font-bold">{doctor.fullName}</h1>
              </div>

              <p className="text-xl text-blue-100 font-medium mb-3">
                {doctor.specialty}
              </p>

              {/* Badges */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-4">
                {doctor.isVerified && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/20 text-green-100 text-sm font-medium border border-green-400/30">
                    <svg className="w-3.5 h-3.5 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Verified Provider
                  </span>
                )}
                {doctor.licenseState && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white/90 text-sm font-medium border border-white/20">
                    <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Licensed in {doctor.licenseState}
                  </span>
                )}
                {doctor.npi && !doctor.npi.startsWith('TEMP') && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white/90 text-sm font-medium border border-white/20">
                    NPI: {doctor.npi}
                  </span>
                )}
              </div>

              {/* Location */}
              <div className="flex items-center justify-center md:justify-start text-blue-100">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <Link href={`/location/${doctor.stateSlug}/${doctor.citySlug}`} className="hover:text-white transition-colors">
                  {doctor.city}, {getStateName(doctor.state)}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            {phones[0] && (
              <a
                href={`tel:${phones[0].value!.replace(/\D/g, "")}`}
                className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm font-medium"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call Now
              </a>
            )}
            {emails[0] && (
              <a
                href={`mailto:${emails[0].value}`}
                className="inline-flex items-center px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Send Email
              </a>
            )}
            {doctor.website && (
              <a
                href={doctor.website}
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
            {doctor.linkedin && (
              <a
                href={doctor.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-5 py-2.5 bg-[#0077b5] text-white rounded-xl hover:bg-[#006699] transition-colors font-medium"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contact Information
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Phone Numbers */}
                  {phones.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Phone Numbers</h3>
                      <div className="space-y-3">
                        {phones.map((phone, idx) => (
                          <a
                            key={idx}
                            href={`tel:${phone.value!.replace(/\D/g, "")}`}
                            className="flex items-center p-3 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors group"
                          >
                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors">
                              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">{phone.type}</p>
                              <p className="text-gray-900 font-medium group-hover:text-blue-600 transition-colors">{phone.value}</p>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Email Addresses */}
                  {emails.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Email Addresses</h3>
                      <div className="space-y-3">
                        {emails.map((email, idx) => (
                          <a
                            key={idx}
                            href={`mailto:${email.value}`}
                            className="flex items-center p-3 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors group"
                          >
                            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mr-3 group-hover:bg-purple-200 transition-colors">
                              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm text-gray-500">{email.type}</p>
                              <p className="text-gray-900 font-medium truncate group-hover:text-blue-600 transition-colors">{email.value}</p>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Fax */}
                {doctor.fax && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="flex items-center p-3 rounded-xl bg-gray-50">
                      <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Fax</p>
                        <p className="text-gray-900 font-medium">{doctor.fax}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Practice & Hospital Information */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Practice & Hospital
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {doctor.hospitalAffiliation && (
                    <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
                      <div className="flex items-start">
                        <div className="w-10 h-10 rounded-lg bg-purple-200 flex items-center justify-center mr-3 flex-shrink-0">
                          <svg className="w-5 h-5 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-purple-700">Hospital Affiliation</p>
                          <p className="text-purple-900 font-semibold mt-1">{doctor.hospitalAffiliation}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {doctor.practiceName && (
                    <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                      <div className="flex items-start">
                        <div className="w-10 h-10 rounded-lg bg-blue-200 flex items-center justify-center mr-3 flex-shrink-0">
                          <svg className="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-blue-700">Practice Location</p>
                          <p className="text-blue-900 font-semibold mt-1">{doctor.practiceName}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {(doctor.company || doctor.companyName) && (
                    <div className="p-4 rounded-xl bg-green-50 border border-green-100">
                      <div className="flex items-start">
                        <div className="w-10 h-10 rounded-lg bg-green-200 flex items-center justify-center mr-3 flex-shrink-0">
                          <svg className="w-5 h-5 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-green-700">Company</p>
                          <p className="text-green-900 font-semibold mt-1">{doctor.companyName || doctor.company}</p>
                          {doctor.companyPhone && (
                            <p className="text-green-700 text-sm mt-1">{doctor.companyPhone}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100">
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-lg bg-indigo-200 flex items-center justify-center mr-3 flex-shrink-0">
                        <svg className="w-5 h-5 text-indigo-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-indigo-700">Specialty</p>
                        <Link
                          href={`/specialty/${doctor.specialtySlug}`}
                          className="text-indigo-900 font-semibold mt-1 hover:underline"
                        >
                          {doctor.specialty}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Addresses */}
            {(doctor.personStreet || doctor.companyStreet) && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Addresses
                  </h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {doctor.personStreet && (
                      <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Personal Address</h3>
                        <p className="text-gray-900">{doctor.personStreet}</p>
                        <p className="text-gray-900">{doctor.personCity}, {doctor.personState} {doctor.personZip}</p>
                      </div>
                    )}
                    {doctor.companyStreet && (
                      <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Company Address</h3>
                        <p className="text-gray-900">{doctor.companyStreet}</p>
                        <p className="text-gray-900">{doctor.companyCity}, {doctor.companyState} {doctor.companyZip}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-900">Quick Info</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="text-gray-900 font-medium">{doctor.city}, {doctor.state}</p>
                  </div>
                </div>

                {doctor.licenseState && (
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">License State</p>
                      <p className="text-gray-900 font-medium">{doctor.licenseState}</p>
                    </div>
                  </div>
                )}

                {doctor.npi && !doctor.npi.startsWith('TEMP') && (
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">NPI Number</p>
                      <p className="text-gray-900 font-mono font-medium">{doctor.npi}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Specialty</p>
                    <Link href={`/specialty/${doctor.specialtySlug}`} className="text-gray-900 font-medium hover:text-blue-600 transition-colors">
                      {doctor.specialty}
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                  <h2 className="text-lg font-semibold text-gray-900">Social Profiles</h2>
                </div>
                <div className="p-6 space-y-3">
                  {socialLinks.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors group"
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                        link.icon === 'linkedin' ? 'bg-[#0077b5]' :
                        link.icon === 'facebook' ? 'bg-[#1877f2]' :
                        'bg-[#1da1f2]'
                      }`}>
                        {link.icon === 'linkedin' && (
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                        )}
                        {link.icon === 'facebook' && (
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                          </svg>
                        )}
                        {link.icon === 'twitter' && (
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className="text-gray-900 font-medium group-hover:text-blue-600 transition-colors">{link.type}</p>
                        <p className="text-sm text-gray-500">View Profile</p>
                      </div>
                      <svg className="w-4 h-4 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Website Card */}
            {doctor.website && (
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-sm overflow-hidden text-white p-6">
                <h3 className="font-semibold mb-2">Visit Website</h3>
                <p className="text-blue-100 text-sm mb-4">Get more information about this provider&apos;s services.</p>
                <a
                  href={doctor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Open Website
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Related Doctors */}
        {relatedDoctors.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Similar Doctors
              </h2>
              <Link
                href={`/doctors?specialty=${doctor.specialtySlug}&city=${doctor.citySlug}&state=${doctor.stateSlug}`}
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
              >
                View All
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedDoctors.map((relatedDoctor) => (
                <DoctorCard key={relatedDoctor.npi} doctor={relatedDoctor} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}

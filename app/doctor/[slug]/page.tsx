import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getDoctorBySlug, getRelatedDoctors } from "@/lib/db/queries";
import { getStateName } from "@/lib/utils/slugify";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import DoctorCard from "@/components/doctors/DoctorCard";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const doctor = getDoctorBySlug(slug);

  if (!doctor) {
    return {
      title: "Doctor Not Found",
    };
  }

  return {
    title: `${doctor.fullName} - ${doctor.specialty}`,
    description: `${doctor.fullName} is a ${doctor.isVerified ? "verified " : ""}${doctor.specialty} at ${doctor.practiceName || "a practice"} in ${doctor.city}, ${doctor.state}. ${doctor.phone ? `Contact: ${doctor.phone}` : ""}`,
  };
}

export default async function DoctorProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const doctor = getDoctorBySlug(slug);

  if (!doctor) {
    notFound();
  }

  const relatedDoctors = getRelatedDoctors(doctor, 3);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Back Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/doctors"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Results
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className="mb-6">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
                <span className="text-4xl font-bold text-blue-600">
                  {doctor.fullName.charAt(0)}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {doctor.fullName}
                  </h1>
                </div>

                <p className="text-xl text-blue-600 font-medium">
                  {doctor.specialty}
                  {doctor.subSpecialty && (
                    <span className="text-gray-500 font-normal">
                      {" "}
                      - {doctor.subSpecialty}
                    </span>
                  )}
                </p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
                  {doctor.isFeatured && (
                    <Badge variant="featured">
                      <svg
                        className="w-3 h-3 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      Featured Doctor
                    </Badge>
                  )}
                  {doctor.isVerified && (
                    <Badge variant="verified">
                      <svg
                        className="w-3 h-3 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Verified
                    </Badge>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-6">
                  {doctor.website && (
                    <a
                      href={doctor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                        />
                      </svg>
                      Visit Website
                    </a>
                  )}
                  {doctor.phone && (
                    <a
                      href={`tel:${doctor.phone.replace(/\D/g, "")}`}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      Call
                    </a>
                  )}
                  {doctor.email && (
                    <a
                      href={`mailto:${doctor.email}`}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      Email
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Practice Information */}
        <Card className="mb-6">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Practice Information
            </h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {doctor.practiceName && (
                <div>
                  <dt className="text-sm text-gray-500">Practice Name</dt>
                  <dd className="text-gray-900 font-medium">
                    {doctor.practiceName}
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-sm text-gray-500">Location</dt>
                <dd className="text-gray-900 font-medium">
                  <Link
                    href={`/location/${doctor.stateSlug}/${doctor.citySlug}`}
                    className="hover:text-blue-600"
                  >
                    {doctor.city}, {getStateName(doctor.state)}
                  </Link>
                </dd>
              </div>
              {doctor.phone && (
                <div>
                  <dt className="text-sm text-gray-500">Phone</dt>
                  <dd className="text-gray-900 font-medium">{doctor.phone}</dd>
                </div>
              )}
              {doctor.website && (
                <div>
                  <dt className="text-sm text-gray-500">Website</dt>
                  <dd>
                    <a
                      href={doctor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {doctor.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </Card>

        {/* Specialties */}
        <Card className="mb-6">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Specialties
            </h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm text-gray-500">Primary Specialty</dt>
                <dd>
                  <Link
                    href={`/specialty/${doctor.specialtySlug}`}
                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-200"
                  >
                    {doctor.specialty}
                  </Link>
                </dd>
              </div>
              {doctor.subSpecialty && (
                <div>
                  <dt className="text-sm text-gray-500">Focus Area</dt>
                  <dd className="text-gray-900 font-medium">
                    {doctor.subSpecialty}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </Card>

        {/* Professional Details */}
        <Card className="mb-6">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Professional Details
            </h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm text-gray-500">NPI Number</dt>
                <dd className="text-gray-900 font-mono">{doctor.npi}</dd>
              </div>
              {doctor.linkedin && (
                <div>
                  <dt className="text-sm text-gray-500">LinkedIn</dt>
                  <dd>
                    <a
                      href={doctor.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View Profile
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </Card>

        {/* Related Doctors */}
        {relatedDoctors.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Similar Doctors in {doctor.city}
              </h2>
              <Link
                href={`/doctors?specialty=${doctor.specialtySlug}&city=${doctor.citySlug}&state=${doctor.stateSlug}`}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View All
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
  );
}

import Link from 'next/link';
import { Specialty } from '@/lib/types';

interface SpecialtyGridProps {
  specialties: Specialty[];
}

// Icons for common specialties
const specialtyIcons: Record<string, string> = {
  'cardiology': '❤️',
  'neurology': '🧠',
  'orthopedics': '🦴',
  'orthopedic-surgery': '🦴',
  'pediatrics': '👶',
  'dermatology': '🩹',
  'ophthalmology': '👁️',
  'psychiatry': '🧘',
  'oncology': '🎗️',
  'gastroenterology': '🫃',
  'pulmonology': '🫁',
  'endocrinology': '💉',
  'rheumatology': '🤲',
  'urology': '🩺',
  'nephrology': '🫘',
  'internal-medicine': '🩺',
  'family-medicine': '👨‍👩‍👧',
  'emergency-medicine': '🚑',
  'anesthesiology': '😴',
  'radiology': '📷',
  'pathology': '🔬',
  'surgery': '🔪',
  'general-surgery': '🔪',
  'plastic-surgery': '✨',
  'obstetrics': '🤰',
  'gynecology': '🌸',
  'ob-gyn': '🤰',
};

function getSpecialtyIcon(slug: string): string {
  return specialtyIcons[slug] || '🏥';
}

export default function SpecialtyGrid({ specialties }: SpecialtyGridProps) {
  // Take top 9 specialties
  const topSpecialties = specialties.slice(0, 9);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Popular Specialties</h2>
          <p className="text-gray-600 mt-2">Find doctors by their area of expertise</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {topSpecialties.map((specialty) => (
            <Link
              key={specialty.slug}
              href={`/specialty/${specialty.slug}`}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 group"
            >
              <div className="text-4xl mb-3">{getSpecialtyIcon(specialty.slug)}</div>
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {specialty.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {specialty.doctorCount} {specialty.doctorCount === 1 ? 'doctor' : 'doctors'}
              </p>
            </Link>
          ))}
        </div>

        {specialties.length > 9 && (
          <div className="text-center mt-8">
            <Link
              href="/doctors"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              View all specialties
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

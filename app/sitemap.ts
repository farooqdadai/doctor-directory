import { MetadataRoute } from 'next';
import {
  fetchDoctorsFromSheets,
  fetchHospitalsFromSheets,
  getSpecialties,
  getLocations,
} from '@/lib/data/sheets';

// Base URL for the site - update this in production
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://doctordirectory.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/doctors`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/hospitals`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  try {
    // Fetch all data for dynamic pages
    const [doctors, hospitals, specialties, locations] = await Promise.all([
      fetchDoctorsFromSheets(),
      fetchHospitalsFromSheets(),
      getSpecialties(),
      getLocations(),
    ]);

    // Doctor pages
    const doctorPages: MetadataRoute.Sitemap = doctors
      .filter(doctor => doctor.profileStatus === 'Active')
      .map(doctor => ({
        url: `${BASE_URL}/doctor/${doctor.slug}`,
        lastModified: new Date(doctor.updatedAt),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));

    // Hospital pages
    const hospitalPages: MetadataRoute.Sitemap = hospitals.map(hospital => ({
      url: `${BASE_URL}/hospital/${hospital.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    // Specialty pages
    const specialtyPages: MetadataRoute.Sitemap = specialties.map(specialty => ({
      url: `${BASE_URL}/specialty/${specialty.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    // Location pages (state/city)
    const locationPages: MetadataRoute.Sitemap = locations.map(location => ({
      url: `${BASE_URL}/location/${location.stateSlug}/${location.citySlug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    // Get unique states for state-level pages
    const stateSet = new Set<string>();
    locations.forEach(loc => stateSet.add(loc.stateSlug));
    const statePages: MetadataRoute.Sitemap = Array.from(stateSet).map(state => ({
      url: `${BASE_URL}/location/${state}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    return [
      ...staticPages,
      ...doctorPages,
      ...hospitalPages,
      ...specialtyPages,
      ...statePages,
      ...locationPages,
    ];
  } catch (error) {
    console.error('[Sitemap] Error generating sitemap:', error);
    // Return at least static pages if data fetch fails
    return staticPages;
  }
}

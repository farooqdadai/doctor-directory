import type { Doctor, Hospital } from '@/lib/types';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://doctordirectory.com';

interface JsonLdProps {
  data: object;
}

// Generic JSON-LD component
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Organization schema for the website
export function OrganizationJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Doctor Directory',
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    description: 'Find verified doctors and hospitals across the United States',
    sameAs: [],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: 'English',
    },
  };

  return <JsonLd data={data} />;
}

// Website schema with search action
export function WebsiteJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Doctor Directory',
    url: BASE_URL,
    description: 'Search our directory of healthcare professionals by specialty and location',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/doctors?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return <JsonLd data={data} />;
}

// Doctor schema (Physician)
export function DoctorJsonLd({ doctor }: { doctor: Doctor }) {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Physician',
    name: doctor.fullName,
    url: `${BASE_URL}/doctor/${doctor.slug}`,
    description: `${doctor.fullName} is a ${doctor.specialty} specialist in ${doctor.city}, ${doctor.state}`,
    medicalSpecialty: doctor.specialty,
    address: {
      '@type': 'PostalAddress',
      addressLocality: doctor.city,
      addressRegion: doctor.state,
      addressCountry: 'US',
      ...(doctor.personStreet && { streetAddress: doctor.personStreet }),
      ...(doctor.personZip && { postalCode: doctor.personZip }),
    },
  };

  // Add contact info if available
  if (doctor.phone) {
    data.telephone = doctor.phone;
  }

  if (doctor.email) {
    data.email = doctor.email;
  }

  // Add practice/organization info
  if (doctor.practiceName || doctor.hospitalAffiliation) {
    data.worksFor = {
      '@type': 'MedicalOrganization',
      name: doctor.hospitalAffiliation || doctor.practiceName,
    };
  }

  // Add LinkedIn profile
  if (doctor.linkedin) {
    data.sameAs = [doctor.linkedin];
  }

  // Add identifier (NPI)
  if (doctor.npi && !doctor.npi.startsWith('TEMP')) {
    data.identifier = {
      '@type': 'PropertyValue',
      propertyID: 'NPI',
      value: doctor.npi,
    };
  }

  return <JsonLd data={data} />;
}

// Hospital schema
export function HospitalJsonLd({ hospital }: { hospital: Hospital }) {
  const socialProfiles: string[] = [];
  if (hospital.facebook) socialProfiles.push(hospital.facebook);
  if (hospital.linkedin) socialProfiles.push(hospital.linkedin);
  if (hospital.twitter) socialProfiles.push(hospital.twitter);
  if (hospital.instagram) socialProfiles.push(hospital.instagram);
  if (hospital.youtube) socialProfiles.push(hospital.youtube);

  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Hospital',
    name: hospital.name,
    url: `${BASE_URL}/hospital/${hospital.slug}`,
    description: `${hospital.name} is a ${hospital.type || 'healthcare facility'} located in ${hospital.city}, ${hospital.state}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: hospital.address,
      addressLocality: hospital.city,
      addressRegion: hospital.state,
      postalCode: hospital.zip,
      addressCountry: 'US',
    },
  };

  // Add contact info
  if (hospital.telephone) {
    data.telephone = hospital.telephone;
  }

  if (hospital.website) {
    data.sameAs = [hospital.website, ...socialProfiles];
  } else if (socialProfiles.length > 0) {
    data.sameAs = socialProfiles;
  }

  // Add rating if available
  if (hospital.googleRating) {
    data.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: hospital.googleRating,
      bestRating: 5,
      worstRating: 1,
    };
  }

  // Add available services
  if (hospital.services) {
    data.availableService = {
      '@type': 'MedicalProcedure',
      name: hospital.services,
    };
  }

  // Add geo coordinates if we have map link
  if (hospital.googleMapLink) {
    data.hasMap = hospital.googleMapLink;
  }

  // Add logo if available
  if (hospital.logo) {
    data.logo = hospital.logo;
  }

  return <JsonLd data={data} />;
}

// Breadcrumb schema
export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`,
    })),
  };

  return <JsonLd data={data} />;
}

// Medical specialty page schema
export function SpecialtyPageJsonLd({ specialty, doctorCount }: { specialty: string; doctorCount: number }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${specialty} Doctors`,
    description: `Find ${doctorCount} ${specialty} doctors and specialists in our directory`,
    url: `${BASE_URL}/specialty/${specialty.toLowerCase().replace(/\s+/g, '-')}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: doctorCount,
      itemListElement: {
        '@type': 'Physician',
        medicalSpecialty: specialty,
      },
    },
  };

  return <JsonLd data={data} />;
}

// Location page schema
export function LocationPageJsonLd({
  city,
  state,
  doctorCount
}: {
  city: string;
  state: string;
  doctorCount: number;
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Doctors in ${city}, ${state}`,
    description: `Find ${doctorCount} healthcare providers in ${city}, ${state}`,
    url: `${BASE_URL}/location/${state.toLowerCase()}/${city.toLowerCase().replace(/\s+/g, '-')}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: doctorCount,
    },
    about: {
      '@type': 'Place',
      name: `${city}, ${state}`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: city,
        addressRegion: state,
        addressCountry: 'US',
      },
    },
  };

  return <JsonLd data={data} />;
}

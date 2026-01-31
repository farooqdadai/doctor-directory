'use client';

import AnimatedResults from '@/components/ui/AnimatedResults';
import AnimatedList, { AnimatedListItem } from '@/components/ui/AnimatedList';
import HospitalCard from '@/components/hospitals/HospitalCard';

interface Hospital {
  id: string;
  name: string;
  slug: string;
  type: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone?: string;
  website?: string;
  emergencyServices: boolean;
  traumaCenter?: string;
  beds?: number;
  ownership?: string;
  overallRating?: number;
}

interface HospitalResultsProps {
  hospitals: Hospital[];
  searchKey: string;
}

export default function HospitalResults({ hospitals, searchKey }: HospitalResultsProps) {
  return (
    <AnimatedResults searchKey={searchKey}>
      <AnimatedList className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {hospitals.map((hospital) => (
          <AnimatedListItem key={hospital.id}>
            <HospitalCard hospital={hospital} />
          </AnimatedListItem>
        ))}
      </AnimatedList>
    </AnimatedResults>
  );
}

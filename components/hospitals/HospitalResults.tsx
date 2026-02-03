'use client';

import AnimatedResults from '@/components/ui/AnimatedResults';
import AnimatedList, { AnimatedListItem } from '@/components/ui/AnimatedList';
import HospitalCard from '@/components/hospitals/HospitalCard';
import type { Hospital } from '@/lib/types';

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

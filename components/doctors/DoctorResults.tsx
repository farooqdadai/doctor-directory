'use client';

import AnimatedResults from '@/components/ui/AnimatedResults';
import AnimatedList, { AnimatedListItem } from '@/components/ui/AnimatedList';
import DoctorCard from '@/components/doctors/DoctorCard';
import { Doctor } from '@/lib/types';

interface DoctorResultsProps {
  doctors: Doctor[];
  searchKey: string;
}

export default function DoctorResults({ doctors, searchKey }: DoctorResultsProps) {
  return (
    <AnimatedResults searchKey={searchKey}>
      <AnimatedList className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {doctors.map((doctor) => (
          <AnimatedListItem key={doctor.npi}>
            <DoctorCard doctor={doctor} />
          </AnimatedListItem>
        ))}
      </AnimatedList>
    </AnimatedResults>
  );
}

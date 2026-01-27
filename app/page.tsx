import HeroSection from "@/components/home/HeroSection";
import SpecialtyGrid from "@/components/home/SpecialtyGrid";
import FeaturedDoctors from "@/components/home/FeaturedDoctors";
import LocationBrowse from "@/components/home/LocationBrowse";
import {
  getSpecialties,
  getFeaturedDoctors,
  getLocations,
  getTotalDoctorCount,
} from "@/lib/db/queries";

export const dynamic = "force-dynamic";

export default function HomePage() {
  // Fetch data for homepage
  const specialties = getSpecialties();
  const featuredDoctors = getFeaturedDoctors(6);
  const locations = getLocations();
  const totalDoctors = getTotalDoctorCount();

  return (
    <>
      <HeroSection totalDoctors={totalDoctors} />
      <SpecialtyGrid specialties={specialties} />
      <FeaturedDoctors doctors={featuredDoctors} />
      <LocationBrowse locations={locations} />
    </>
  );
}

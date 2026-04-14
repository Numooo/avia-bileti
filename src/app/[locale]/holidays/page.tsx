"use client";

import { HolidaysPage } from "@/features/holidays/HolidaysPage";
import { useBookingStore } from "@/shared/store/booking";
import { useRouter } from "@/i18n/routing";

export default function HolidaysRoute() {
  const setBooking = useBookingStore((state) => state.setBooking);
  const router = useRouter();

  const handlePackageSelect = (pkg: any, metadata: any) => {
    setBooking("package", pkg, metadata);
    router.push("/booking");
  };

  return (
    <HolidaysPage onPackageSelect={handlePackageSelect} />
  );
}

"use client";

import { VisaPage } from "@/features/visa/VisaPage";
import { useBookingStore } from "@/shared/store/booking";
import { useRouter } from "@/i18n/routing";

export default function VisaRoute() {
  const setBooking = useBookingStore((state) => state.setBooking);
  const router = useRouter();

  const handleVisaSelect = (visa: any) => {
    // Visa booking logic might be different, but for now we'll use the store
    setBooking("package" as any, visa as any, {}); 
    router.push("/booking");
  };

  return (
    <VisaPage onVisaSelect={handleVisaSelect} />
  );
}

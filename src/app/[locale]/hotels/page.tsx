"use client";

import { HotelsPage } from "@/features/hotels/HotelsPage";
import { useBookingStore } from "@/shared/store/booking";
import { useRouter } from "@/i18n/routing";

export default function HotelsRoute() {
  const setBooking = useBookingStore((state) => state.setBooking);
  const router = useRouter();

  const handleHotelSelect = (hotel: any, metadata: any) => {
    setBooking("hotel", hotel, metadata);
    router.push("/booking");
  };

  return (
    <HotelsPage onHotelSelect={handleHotelSelect} />
  );
}

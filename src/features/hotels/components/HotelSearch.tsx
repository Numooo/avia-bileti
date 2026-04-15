"use client";

import React, { useState } from "react";
import { Hotel, MapPin, Calendar, ChevronDown, Users } from "lucide-react";
import { format } from "date-fns";
import { useTranslations } from "next-intl";

interface HotelSearchProps {
  onSearch?: (destination: string) => void;
}

import { DatePicker } from "@/shared/ui/DatePicker";
import { CustomSelect } from "@/shared/ui/CustomSelect";
import { HotelAutocomplete } from "@/shared/ui/HotelAutocomplete";

export function HotelSearch({ onSearch }: HotelSearchProps) {
  const t = useTranslations();
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState(format(new Date(), "yyyy-MM-dd"));
  const [checkOut, setCheckOut] = useState(format(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"));
  const [rooms, setRooms] = useState(1);
  const [guests, setGuests] = useState(2);

  const handleSearch = () => {
    if (onSearch) {
      onSearch(destination);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Inputs */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Destination */}
        <div className="relative lg:col-span-2">
          <HotelAutocomplete
            label={t("Search.hotels.destination")}
            value={destination}
            onChange={setDestination}
            placeholder={t("Search.hotels.destinationPlaceholder")}
          />
        </div>

        {/* Dates */}
        <DatePicker
          label={t("Search.hotels.checkIn")}
          value={checkIn}
          onChange={setCheckIn}
          minDate={new Date()}
        />
        <DatePicker
          label={t("Search.hotels.checkOut")}
          value={checkOut}
          onChange={setCheckOut}
          minDate={checkIn ? new Date(checkIn) : new Date()}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <CustomSelect
          label={t("Search.hotels.guests")}
          value={guests}
          onChange={setGuests}
          icon={<Users className="h-5 w-5" />}
          options={[1, 2, 3, 4, 5, 6].map((n) => ({
            value: n,
            label: `${n} ${n === 1 ? t("Search.hotels.guest") : t("Search.hotels.guests")}`,
          }))}
        />
        
        <CustomSelect
          label={t("Search.hotels.rooms")}
          value={rooms}
          onChange={setRooms}
          icon={<Hotel className="h-5 w-5" />}
          options={[1, 2, 3, 4].map((n) => ({
            value: n,
            label: `${n} ${n === 1 ? t("Search.hotels.room") : t("Search.hotels.rooms")}`,
          }))}
        />
      </div>

      <button
        onClick={handleSearch}
        className="w-full rounded-2xl bg-brand-primary py-4 text-lg font-semibold text-white shadow-lg transition-all hover:bg-brand-secondary hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
      >
        <Hotel className="h-5 w-5" />
        {t("Search.hotels.search")}
      </button>
    </div>
  );
}

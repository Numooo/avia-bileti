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
          <label className="mb-1 block text-sm font-medium text-gray-700">
            {t("Search.hotels.destination")}
          </label>
          <div className="relative group">
            <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-primary transition-colors" />
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder={t("Search.hotels.destinationPlaceholder")}
              className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm font-medium text-gray-900 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
            />
          </div>
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
        className="w-full rounded-2xl bg-brand-primary py-4 text-white font-bold shadow-lg shadow-brand-primary/20 hover:bg-brand-secondary transition-all flex items-center justify-center gap-3 hover:scale-[1.01] active:scale-[0.99]"
      >
        <Hotel className="h-5 w-5" />
        {t("Search.hotels.search")}
      </button>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Palmtree, MapPin, Calendar, Users, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { useTranslations } from "next-intl";

interface HolidaySearchProps {
  onSearch?: (destination: string) => void;
}

import { DatePicker } from "@/shared/ui/DatePicker";
import { CustomSelect } from "@/shared/ui/CustomSelect";

export function HolidaySearch({ onSearch }: HolidaySearchProps) {
  const t = useTranslations();
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [travelers, setTravelers] = useState(2);
  const [budget, setBudget] = useState("medium");

  const handleSearch = () => {
    if (onSearch) {
      onSearch(destination);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Destination */}
        <div className="relative lg:col-span-2">
          <label className="mb-1.5 block text-xs font-semibold text-gray-500 capitalize px-1">
            {t("Search.holidays.destination")}
          </label>
          <div className="relative group">
            <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-primary transition-colors z-10" />
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder={t("Search.holidays.destinationPlaceholder")}
              className="w-full appearance-none rounded-2xl border-none bg-gray-50 py-3.5 pl-11 pr-4 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-brand-primary/20 transition-all placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Dates */}
        <DatePicker
          label={t("Search.holidays.departure")}
          value={startDate}
          onChange={setStartDate}
          minDate={new Date()}
        />

        {/* Passengers */}
        <CustomSelect
          label={t("Search.holidays.travelers")}
          value={travelers}
          onChange={setTravelers}
          icon={<Users className="h-5 w-5" />}
          options={[1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({
            value: n,
            label: `${n} ${n === 1 ? t("Search.flights.passenger") : t("Search.flights.passengers")}`,
          }))}
        />
      </div>

      {/* Budget Selector */}
      <div className="w-full max-w-md">
        <label className="mb-1.5 block text-xs font-semibold text-gray-500 capitalize px-1">
          {t("Search.holidays.budget")}
        </label>
        <div className="flex p-1 bg-gray-100 rounded-2xl">
          {["economy", "medium", "luxury"].map((b) => (
            <button
              key={b}
              onClick={() => setBudget(b)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold capitalize transition-all ${
                budget === b
                  ? "bg-white text-brand-primary shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {t(`Search.holidays.budgets.${b}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Search Button */}
      <button
        onClick={handleSearch}
        className="w-full rounded-2xl bg-brand-primary py-4 text-lg font-semibold text-white shadow-lg transition-all hover:bg-brand-secondary hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
      >
        <Palmtree className="h-5 w-5" />
        {t("Search.holidays.search")}
      </button>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Plane, MapPin, Calendar, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { PassengerSelector } from "@/shared/ui/passenger-selector";

import { AirportAutocomplete } from "@/shared/ui/AirportAutocomplete";

interface FlightSearchProps {
  onSearch?: (from: string, to: string) => void;
}

import { DatePicker } from "@/shared/ui/DatePicker";

export function FlightSearch({ onSearch }: FlightSearchProps) {
  const t = useTranslations();
  const [tripType, setTripType] = useState<"oneway" | "roundtrip">("roundtrip");
  const [cabinClass, setCabinClass] = useState("economy");
  const [flightOrigin, setFlightOrigin] = useState("FRU");
  const [flightDestination, setFlightDestination] = useState("DXB");
  const [departureDate, setDepartureDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [returnDate, setReturnDate] = useState(format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"));
  
  // Passenger state
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [animals, setAnimals] = useState(0);
  const [animalsComment, setAnimalsComment] = useState("");

  const handleSearch = () => {
    if (onSearch) {
      onSearch(flightOrigin, flightDestination);
    }
  };

  return (
    <div className="space-y-6">
      {/* Trip Type */}
      <div className="flex p-1 bg-gray-100 rounded-2xl w-fit">
        <button
          onClick={() => setTripType("oneway")}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
            tripType === "oneway"
              ? "bg-white text-brand-primary shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {t("Search.flights.oneWay")}
        </button>
        <button
          onClick={() => setTripType("roundtrip")}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
            tripType === "roundtrip"
              ? "bg-white text-brand-primary shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {t("Search.flights.roundTrip")}
        </button>
      </div>

      {/* Search Inputs */}
      <div className="relative grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Origin */}
        <AirportAutocomplete
          label={t("Search.flights.from")}
          value={flightOrigin}
          onChange={setFlightOrigin}
          placeholder={t("Search.flights.from")}
        />

        {/* Destination */}
        <AirportAutocomplete
          label={t("Search.flights.to")}
          value={flightDestination}
          onChange={setFlightDestination}
          placeholder={t("Search.flights.to")}
        />

        {/* Departure Date */}
        <DatePicker
          label={tripType === "roundtrip" ? t("Search.flights.departure") : t("Search.flights.date")}
          value={departureDate}
          onChange={setDepartureDate}
          minDate={new Date()}
          placeholder="Select date"
        />

        {/* Return Date */}
        {tripType === "roundtrip" && (
          <DatePicker
            label={t("Search.flights.return")}
            value={returnDate}
            onChange={setReturnDate}
            minDate={departureDate ? new Date(departureDate) : new Date()}
            placeholder="Select date"
          />
        )}
      </div>

      {/* Passengers & Class */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <PassengerSelector
          adults={adults}
          children={children}
          animals={animals}
          animalsComment={animalsComment}
          onAdultsChange={setAdults}
          onChildrenChange={setChildren}
          onAnimalsChange={setAnimals}
          onAnimalsCommentChange={setAnimalsComment}
        />

        <div className="relative">
          <label className="mb-1.5 block text-xs font-semibold text-gray-500 capitalize px-1">
            {t("Search.flights.cabinClass")}
          </label>
          <div className="flex p-1 bg-gray-100 rounded-2xl">
            {[
              { id: "economy", label: t("Search.flights.economy") },
              { id: "business", label: t("Search.flights.business") },
            ].map((cabin) => (
              <button
                key={cabin.id}
                onClick={() => setCabinClass(cabin.id)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold capitalize transition-all ${
                  cabinClass === cabin.id
                    ? "bg-white text-brand-primary shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {cabin.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={handleSearch}
        className="w-full rounded-2xl bg-brand-primary py-4 text-lg font-semibold text-white shadow-lg transition-all hover:bg-brand-secondary hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
      >
        <Plane className="h-5 w-5" />
        {t("Search.flights.search")}
      </button>
    </div>
  );
}

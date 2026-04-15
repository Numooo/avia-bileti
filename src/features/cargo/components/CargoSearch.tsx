"use client";

import React, { useState } from "react";
import { Truck, MapPin, Calendar, Scale, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { AIRPORTS } from "@/shared/mocks/data";
import { useTranslations } from "next-intl";

interface CargoSearchProps {
  onSearch?: (data: {
    origin: string;
    destination: string;
    weight: string;
    type: string;
  }) => void;
}

import { DatePicker } from "@/shared/ui/DatePicker";
import { CustomSelect } from "@/shared/ui/CustomSelect";
import { AirportAutocomplete } from "@/shared/ui/AirportAutocomplete";

export function CargoSearch({ onSearch }: CargoSearchProps) {
  const t = useTranslations();
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState(format(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"));
  const [weight, setWeight] = useState("");
  const [type, setType] = useState("standard");

  const handleSearch = () => {
    if (onSearch) {
      onSearch({ origin, destination, weight, type });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <AirportAutocomplete
          label={t("Search.cargo.from")}
          value={origin}
          onChange={setOrigin}
          placeholder={t("Search.cargo.from")}
        />
        <AirportAutocomplete
          label={t("Search.cargo.to")}
          value={destination}
          onChange={setDestination}
          placeholder={t("Search.cargo.to")}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <DatePicker
          label={t("Search.cargo.date")}
          value={date}
          onChange={setDate}
          minDate={new Date()}
        />
        <div className="relative">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            {t("Search.cargo.weight")}
          </label>
          <div className="relative group">
            <Scale className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-primary transition-colors" />
            <input
              type="number"
              min="1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm font-medium text-gray-900 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
            />
          </div>
        </div>
        <CustomSelect
          label={t("Search.cargo.type")}
          value={type}
          onChange={setType}
          icon={<Truck className="h-5 w-5" />}
          options={[
            { value: "standard", label: t("Search.cargo.types.standard") },
            { value: "express", label: t("Search.cargo.types.express") },
            { value: "perishable", label: t("Search.cargo.types.perishable") },
            { value: "fragile", label: t("Search.cargo.types.fragile") },
          ]}
        />
      </div>
      <button
        onClick={handleSearch}
        className="w-full rounded-2xl bg-brand-primary py-4 text-lg font-semibold text-white shadow-lg shadow-brand-primary/20 transition-all hover:bg-brand-secondary flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
      >
        <Truck className="h-5 w-5" />
        {t("Search.cargo.calculate")}
      </button>
    </div>
  );
}

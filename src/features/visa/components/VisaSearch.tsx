"use client";

import React, { useState } from "react";
import { FileText, MapPin, Calendar, Users, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { useTranslations } from "next-intl";

interface VisaSearchProps {
  onSearch?: (country: string) => void;
}

import { DatePicker } from "@/shared/ui/DatePicker";
import { CustomSelect } from "@/shared/ui/CustomSelect";

export function VisaSearch({ onSearch }: VisaSearchProps) {
  const t = useTranslations();
  const [country, setCountry] = useState("");
  const [visaType, setVisaType] = useState("tourist");
  const [travelDate, setTravelDate] = useState(format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"));
  const [applicants, setApplicants] = useState(1);

  const handleSearch = () => {
    if (onSearch) {
      onSearch(country);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Inputs */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Destination */}
        <div className="relative">
          <label className="mb-1.5 block text-xs font-semibold text-gray-500 capitalize px-1">
            {t("Search.visa.country")}
          </label>
          <div className="relative group">
            <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-primary transition-colors z-10" />
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder={t("Search.visa.countryPlaceholder")}
              className="w-full appearance-none rounded-2xl border-none bg-gray-50 py-3.5 pl-11 pr-4 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-brand-primary/20 transition-all placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Visa Type */}
        <CustomSelect
          label={t("Search.visa.visaType")}
          value={visaType}
          onChange={setVisaType}
          icon={<FileText className="h-5 w-5" />}
          options={[
            { value: "tourist", label: t("Search.visa.types.tourist") },
            { value: "business", label: t("Search.visa.types.business") },
            { value: "transit", label: t("Search.visa.types.transit") },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Date */}
        <DatePicker
          label={t("Search.visa.travelDate")}
          value={travelDate}
          onChange={setTravelDate}
          minDate={new Date()}
        />

        {/* Applicants */}
        <CustomSelect
          label={t("Search.visa.applicants")}
          value={applicants}
          onChange={setApplicants}
          icon={<Users className="h-5 w-5" />}
          options={[1, 2, 3, 4, 5, 6].map((num) => ({
            value: num,
            label: `${num} ${num === 1 ? t("Search.visa.applicant") : t("Search.visa.applicants")}`,
          }))}
        />
      </div>

      {/* Check Button */}
      <button
        onClick={handleSearch}
        className="w-full rounded-2xl bg-brand-primary py-4 text-lg font-semibold text-white shadow-lg transition-all hover:bg-brand-secondary hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
      >
        <FileText className="h-5 w-5" />
        {t("Search.visa.check")}
      </button>
    </div>
  );
}

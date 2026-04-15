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
          <label className="mb-1 block text-sm font-medium text-gray-700">
            {t("Search.visa.country")}
          </label>
          <div className="relative group">
            <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-primary transition-colors" />
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder={t("Search.visa.countryPlaceholder")}
              className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm font-medium text-gray-900 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
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
        className="w-full rounded-2xl bg-brand-primary py-4 text-white font-bold shadow-lg shadow-brand-primary/20 hover:bg-brand-secondary transition-all flex items-center justify-center gap-3 hover:scale-[1.01] active:scale-[0.99]"
      >
        <FileText className="h-5 w-5" />
        {t("Search.visa.check")}
      </button>
    </div>
  );
}

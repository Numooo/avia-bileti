"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Plane, 
  Hotel, 
  Palmtree, 
  FileText, 
  Truck, 
  Train, 
  Activity 
} from "lucide-react";
import { useTranslations } from "next-intl";
import { FlightSearch } from "@/features/flights/components/FlightSearch";
import { HotelSearch } from "@/features/hotels/components/HotelSearch";
import { HolidaySearch } from "@/features/holidays/components/HolidaySearch";
import { VisaSearch } from "@/features/visa/components/VisaSearch";
import { CargoSearch } from "@/features/cargo/components/CargoSearch";
import { TrainSearch } from "@/features/trains/components/TrainSearch";
import { FlightStatusSearch } from "@/features/flight-status/components/FlightStatusSearch";

interface HeroSectionProps {
  onSearchFlights?: (from?: string, to?: string) => void;
  onSearchCargo?: (data: any) => void;
  onSearchTrains?: (from: string, to: string, date: string) => void;
  onNavigate?: (page: string) => void;
}

type TabType = "flights" | "hotels" | "holidays" | "visa" | "cargo" | "status" | "trains";

export function HeroSection({
  onSearchFlights,
  onSearchCargo,
  onSearchTrains,
  onNavigate,
}: HeroSectionProps) {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState<TabType>("flights");

  const tabs = [
    { id: "flights" as const, label: t("Search.tabs.flights"), icon: Plane },
    { id: "hotels" as const, label: t("Search.tabs.hotels"), icon: Hotel },
    { id: "holidays" as const, label: t("Search.tabs.holidays"), icon: Palmtree },
    { id: "visa" as const, label: t("Search.tabs.visa"), icon: FileText },
    { id: "cargo" as const, label: t("Search.tabs.cargo"), icon: Truck },
    { id: "trains" as const, label: t("Search.tabs.trains"), icon: Train },
    { id: "status" as const, label: t("Search.tabs.status"), icon: Activity },
  ];

  return (
    <section className="relative py-20">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&q=80)",
        }}
      >
        <div className="absolute inset-0 bg-brand-primary/80" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero Text */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl mb-4"
          >
            {t("Hero.title")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-white/90 sm:text-xl"
          >
            {t("Hero.subtitle")}
          </motion.p>
        </div>

        {/* Search Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative z-20 rounded-3xl bg-white/95 backdrop-blur-lg p-8 shadow-2xl border border-white/20"
        >
          {/* Tabs Navigation */}
          <div className="mb-8 flex w-full border-b border-gray-200 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex-1 min-w-fit flex items-center justify-center gap-3 px-8 py-5 text-sm font-bold transition-all ${
                    activeTab === tab.id
                      ? "text-brand-primary bg-brand-primary/5"
                      : "text-gray-500 hover:text-brand-primary hover:bg-brand-primary/5"
                  }`}
                >
                  <Icon className={`h-5 w-5 transition-transform duration-300 ${activeTab === tab.id ? "scale-110" : "group-hover:scale-110"}`} />
                  <span className="whitespace-nowrap">{tab.label}</span>
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-brand-primary"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Search Content */}
          <div className="mt-6">
            {activeTab === "flights" && (
              <FlightSearch onSearch={onSearchFlights} />
            )}
            {activeTab === "hotels" && <HotelSearch onSearch={() => onNavigate?.("hotels")} />}
            {activeTab === "holidays" && <HolidaySearch onSearch={() => onNavigate?.("holidays")} />}
            {activeTab === "visa" && <VisaSearch onSearch={() => onNavigate?.("visa")} />}
            {activeTab === "cargo" && <CargoSearch onSearch={onSearchCargo} />}
            {activeTab === "trains" && <TrainSearch onSearch={onSearchTrains} />}
            {activeTab === "status" && <FlightStatusSearch />}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

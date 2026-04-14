"use client";

import React from "react";
import { HeroSection } from "@/features/home/components/HeroSection";
import { HotDealsSection } from "@/features/home/components/HotDealsSection";
import { EventsBannerSlider } from "@/features/home/components/EventsBannerSlider";
import { FeaturedPackagesSection } from "@/features/home/components/FeaturedPackagesSection";
import { TestimonialsSection } from "@/features/home/components/TestimonialsSection";
import { WhyChooseUsSection } from "@/features/home/components/WhyChooseUsSection";

interface HomePageProps {
  onSearchFlights?: (from?: string, to?: string) => void;
  onSearchCargo?: (data: any) => void;
  onSearchTrains?: (from: string, to: string, date: string) => void;
  onNavigate?: (page: string) => void;
}

export function HomePage({
  onSearchFlights,
  onSearchCargo,
  onSearchTrains,
  onNavigate,
}: HomePageProps) {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section with Search Form */}
      <HeroSection 
        onSearchFlights={onSearchFlights}
        onSearchCargo={onSearchCargo}
        onSearchTrains={onSearchTrains}
        onNavigate={onNavigate}
      />

      {/* Hot Deals Section */}
      <HotDealsSection 
        onNavigate={onNavigate}
        onSearchFlights={onSearchFlights}
      />

      {/* Events Banner Slider */}
      <EventsBannerSlider 
        onNavigate={onNavigate}
        onSearchFlights={onSearchFlights}
      />

      {/* Featured Holiday Packages */}
      <FeaturedPackagesSection 
        onNavigate={onNavigate}
      />

      {/* Testimonials & Stats Section */}
      <TestimonialsSection />

      {/* Why Choose Us Section */}
      <WhyChooseUsSection />
    </main>
  );
}

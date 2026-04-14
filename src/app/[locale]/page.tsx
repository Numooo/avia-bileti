"use client";

import { useState } from "react";
import { HomePage } from "../../HomePage";
import { useRouter } from "@/i18n/routing";

export default function Home() {
  const router = useRouter();

  const handleSearchFlights = (from?: string, to?: string) => {
    // Instead of setting state, navigate to the new page with search params
    const searchParams = new URLSearchParams();
    if (from) searchParams.set("origin", from);
    if (to) searchParams.set("destination", to);
    
    router.push(`/flights?${searchParams.toString()}`);
  };

  const handleSearchCargo = (data: any) => {
    // Similarly for cargo
    router.push(`/cargo`);
  };

  const handleSearchTrains = (from: string, to: string, date: string) => {
    const searchParams = new URLSearchParams();
    searchParams.set("from", from);
    searchParams.set("to", to);
    searchParams.set("date", date);
    router.push(`/trains?${searchParams.toString()}`);
  };

  const handleNavigate = (page: string) => {
    router.push(page === "home" ? "/" : `/${page}`);
  };

  return (
    <HomePage
      onSearchFlights={handleSearchFlights}
      onSearchCargo={handleSearchCargo}
      onSearchTrains={handleSearchTrains}
      onNavigate={handleNavigate}
    />
  );
}

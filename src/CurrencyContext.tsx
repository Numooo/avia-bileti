"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  DollarSign, 
  Euro, 
  RussianRuble,
} from "lucide-react";
import { SomIcon } from "./icons/SomIcon";

export type CurrencyCode = "KGS" | "RUB" | "USD" | "EUR";

interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string | React.ComponentType<{ className?: string }>;
  icon: React.ComponentType<{ className?: string }>;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  KGS: { code: "KGS", symbol: SomIcon, icon: SomIcon },
  RUB: { code: "RUB", symbol: RussianRuble, icon: RussianRuble },
  USD: { code: "USD", symbol: DollarSign, icon: DollarSign },
  EUR: { code: "EUR", symbol: Euro, icon: Euro },
};

interface CurrencyContextType {
  currency: CurrencyCode;
  symbol: string | React.ComponentType<{ className?: string }>;
  symbolText: string;
  CurrencyIcon: React.ComponentType<{ className?: string }>;
  CurrencySymbol: React.ComponentType<{ className?: string }>;
  setCurrency: (code: CurrencyCode) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("KGS");

  // Persist currency preference
  useEffect(() => {
    const saved = localStorage.getItem("preferred_currency") as CurrencyCode;
    if (saved && CURRENCIES[saved]) {
      setCurrencyState(saved);
    }
  }, []);

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(code);
    localStorage.setItem("preferred_currency", code);
  };

  const CurrencySymbol = ({ className }: { className?: string }) => {
    const info = CURRENCIES[currency];
    const Symbol = info.symbol;
    if (typeof Symbol === "string") return <span className={className}>{Symbol}</span>;
    return <Symbol className={className || "h-3 w-3 inline-block -mt-0.5"} />;
  };

  const info = CURRENCIES[currency];

  const value = {
    currency,
    symbol: info.symbol,
    symbolText: currency === "RUB" ? "₽" : currency === "USD" ? "$" : currency === "EUR" ? "€" : "⃀",
    CurrencyIcon: info.icon,
    CurrencySymbol,
    setCurrency,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}

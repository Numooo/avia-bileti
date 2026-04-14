"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export function StatsSection() {
  const t = useTranslations();
  
  const stats = [
    { label: t("Stats.happyTravelers"), value: t("Stats.data.travelers") },
    { label: t("Stats.averageRating"), value: t("Stats.data.rating") },
    { label: t("Stats.destinations"), value: t("Stats.data.destinations") },
    { label: t("Stats.support"), value: t("Stats.data.support") },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
    >
      {stats.map((stat, idx) => (
        <div key={idx} className="text-center">
          <div className="text-4xl md:text-5xl font-black text-brand-primary mb-2">
            {stat.value}
          </div>
          <p className="text-gray-600 font-bold uppercase tracking-wide text-xs">
            {stat.label}
          </p>
        </div>
      ))}
    </motion.div>
  );
}

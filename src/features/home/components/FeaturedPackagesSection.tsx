"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Heart, Star, Calendar } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCurrency } from "@/CurrencyContext";
import { Badge } from "@/shared/ui/badge";
import type { Package } from "@/types";

interface FeaturedPackagesSectionProps {
  onNavigate?: (path: string) => void;
}

export function FeaturedPackagesSection({ onNavigate }: FeaturedPackagesSectionProps) {
  const t = useTranslations();
  const { CurrencySymbol } = useCurrency();

  // Featured packages data
  let featuredPackages: Package[] = [];
  try {
    featuredPackages = t.raw("Featured.packages") as Package[];
  } catch (e) {
    featuredPackages = [];
  }

  if (!featuredPackages || featuredPackages.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Badge variant="default" className="mb-3">
                {t("Featured.badge")}
              </Badge>
              <h2 className="text-4xl font-bold text-gray-900 mb-3">
                {t("Featured.title")}
              </h2>
              <p className="text-lg text-gray-600">{t("Featured.subtitle")}</p>
            </motion.div>
          </div>
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            onClick={() => onNavigate?.("holidays")}
            className="hidden md:flex items-center gap-2 text-brand-primary font-semibold hover:text-brand-secondary transition-colors group"
          >
            {t("Featured.viewAll")}
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>

        {/* Grid Layout for Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredPackages.slice(0, 6).map((pkg, index) => (
            <motion.div
              key={`${pkg.id}-${index}`}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer h-full"
              onClick={() => onNavigate?.(`/holidays/${pkg.id}`)}
            >
              <div className="relative h-full flex flex-col rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={pkg.image || (pkg.images && pkg.images[0]) || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop"}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                  {/* Favorite Button */}
                  <button className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white rounded-full transition-colors">
                    <Heart className="h-5 w-5 text-gray-700" />
                  </button>

                  {/* Location */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-1.5 text-white/90 text-sm mb-2">
                      <MapPin className="h-4 w-4" />
                      <span className="line-clamp-1">{pkg.destination}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-brand-secondary transition-colors line-clamp-1">
                      {pkg.title}
                    </h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  {/* Rating & Duration */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold text-gray-900">
                          {pkg.rating}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600">
                        ({pkg.reviewCount})
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span className="font-medium">
                        {typeof pkg.duration === "string"
                          ? pkg.duration
                          : `${pkg.duration.days} дн. / ${pkg.duration.nights} ноч.`}
                      </span>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1.5">
                      {pkg.highlights?.slice(0, 3).map((highlight: string, idx: number) => (
                        <span key={idx} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-md">
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-end justify-between pt-4 border-t border-gray-200 mt-auto">
                    <div>
                      <p className="text-xs text-gray-600 mb-0.5">
                        {t("Featured.startingFrom")}
                      </p>
                      <p className="text-2xl font-bold text-brand-primary flex items-center">
                        <CurrencySymbol className="h-4 w-4 mr-1" />
                        {(pkg.price || 0).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {t("Featured.perPerson")}
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-brand-primary text-white rounded-lg font-medium hover:bg-brand-secondary transition-colors flex items-center gap-2">
                      {t("Featured.viewDetails")}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button (Mobile) */}
        <div className="mt-8 text-center md:hidden">
          <button
            onClick={() => onNavigate?.("holidays")}
            className="w-full px-6 py-3 bg-brand-primary text-white rounded-lg font-semibold hover:bg-brand-secondary transition-colors flex items-center justify-center gap-2"
          >
            {t("Featured.viewAll")}
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}

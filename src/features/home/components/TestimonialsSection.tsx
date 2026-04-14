"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useTranslations } from "next-intl";

export function TestimonialsSection() {
  const t = useTranslations();
  
  let testimonials: any[] = [];
  try {
    testimonials = t.raw("Testimonials.list");
  } catch (e) {
    testimonials = [];
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-brand-accent/10 text-brand-accent rounded-full text-sm font-semibold mb-4">
            тнР {t("Testimonials.badge")}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t("Testimonials.title")}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t("Testimonials.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed italic">
                &ldquo;{testimonial.content}&rdquo;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold">
                  {testimonial.author[0]}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {testimonial.author}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {testimonial.trip}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section Integrated inside Testimonials as per original code flow */}
        <StatsSection />
      </div>
    </section>
  );
}

function StatsSection() {
  const t = useTranslations();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
    >
      <div className="text-center">
        <div className="text-4xl md:text-5xl font-bold text-brand-primary mb-2">
          {t("Stats.data.travelers")}
        </div>
        <p className="text-gray-600 font-medium">{t("Stats.happyTravelers")}</p>
      </div>
      <div className="text-center">
        <div className="text-4xl md:text-5xl font-bold text-brand-primary mb-2">
          {t("Stats.data.rating")}
        </div>
        <p className="text-gray-600 font-medium">{t("Stats.averageRating")}</p>
      </div>
      <div className="text-center">
        <div className="text-4xl md:text-5xl font-bold text-brand-primary mb-2">
          {t("Stats.data.destinations")}
        </div>
        <p className="text-gray-600 font-medium">{t("Stats.destinations")}</p>
      </div>
      <div className="text-center">
        <div className="text-4xl md:text-5xl font-bold text-brand-primary mb-2">
          {t("Stats.data.support")}
        </div>
        <p className="text-gray-600 font-medium">{t("Stats.support")}</p>
      </div>
    </motion.div>
  );
}

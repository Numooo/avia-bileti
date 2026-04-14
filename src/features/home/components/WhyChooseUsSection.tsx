"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, Headphones, Shield } from "lucide-react";
import { useTranslations } from "next-intl";

export function WhyChooseUsSection() {
  const t = useTranslations();

  const features = [
    {
      title: t("WhyChooseUs.features.prices.title"),
      description: t("WhyChooseUs.features.prices.description"),
      icon: TrendingUp,
      color: "bg-brand-accent",
    },
    {
      title: t("WhyChooseUs.features.support.title"),
      description: t("WhyChooseUs.features.support.description"),
      icon: Headphones,
      color: "bg-brand-secondary",
    },
    {
      title: t("WhyChooseUs.features.secure.title"),
      description: t("WhyChooseUs.features.secure.description"),
      icon: Shield,
      color: "bg-brand-primary",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4"
          >
            {t("WhyChooseUs.title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600"
          >
            {t("WhyChooseUs.subtitle")}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative rounded-2xl bg-white p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
            >
              <div
                className={`absolute top-0 left-0 w-1 h-full ${feature.color} rounded-l-2xl`}
              />
              <div
                className={`inline-flex p-4 rounded-xl ${feature.color} mb-4`}
              >
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-brand-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

import React, { useState } from "react";
import {
  Plane,
  Hotel,
  Palmtree,
  FileText,
  Truck,
  Activity,
  Train,
  Navigation,
  ChevronLeft,
  ChevronRight,
  Settings,
  HelpCircle,
  Building2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { usePathname, Link } from "@/i18n/routing";

interface SidebarProps {
  isPinned?: boolean;
}

export function Sidebar({ isPinned = true }: SidebarProps) {
  const t = useTranslations();
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);

  const isExpanded = isPinned || isHovered;

  const menuItems = [
    { id: "flights", icon: Plane, label: t("Search.tabs.flights") },
    { id: "hotels", icon: Hotel, label: t("Search.tabs.hotels") },
    { id: "holidays", icon: Palmtree, label: t("Search.tabs.holidays") },
    { id: "visa", icon: FileText, label: t("Search.tabs.visa") },
    { id: "trains", icon: Train, label: t("Search.tabs.trains") },
    { id: "cargo", icon: Truck, label: t("Search.tabs.cargo") },
    { id: "status", icon: Activity, label: t("Search.tabs.status") },
    { id: "radar", icon: Navigation, label: t("Search.tabs.radar") },
    { id: "faq", icon: HelpCircle, label: t("Footer.links.faqs") },
  ];

  const bottomItems = [
    { id: "support", icon: HelpCircle, label: t("Footer.links.helpCenter") },
    { id: "settings", icon: Settings, label: t("Footer.sections.support") }, // Using a placeholder key
  ];

  return (
    <motion.div
      initial={false}
      animate={{
        width: isExpanded ? 260 : 80,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 1
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="sticky top-16 left-0 h-[calc(100vh-64px)] bg-white/95 backdrop-blur-xl border-r border-gray-100 z-40 hidden lg:flex flex-col flex-shrink-0 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.05)]"
    >
      <div className="flex-1 py-8 overflow-y-auto no-scrollbar overflow-x-hidden">
        <div className="px-4 space-y-2">
          {menuItems.map((item) => {
            const path = item.id === "home" ? "/" : `/${item.id}`;
            const isActive = pathname === path || (path !== "/" && pathname.startsWith(path));
            return (
              <Link
                href={path}
                key={item.id}
                className={`w-full flex items-center transition-all group relative rounded-2xl ${
                  isExpanded ? "px-4 justify-start" : "px-0 justify-center"
                } py-3.5 ${isActive
                    ? "bg-brand-primary text-white shadow-[0_8px_16px_-4px_rgba(10,87,161,0.25)]"
                    : "text-gray-500 hover:bg-brand-primary/5 hover:text-brand-primary"
                  }`}
              >
                <div className="relative flex items-center justify-center w-6 min-w-[24px]">
                  <item.icon className={`h-5 w-5 flex-shrink-0 transition-all duration-300 ${isActive ? "text-white scale-110" : "text-gray-400 group-hover:text-brand-primary group-hover:scale-110"
                    }`} />

                  {isActive && (
                    <motion.div
                      layoutId="glow"
                      className="absolute inset-0 bg-white/20 blur-md rounded-full scale-150"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    />
                  )}
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, width: 0, x: -10 }}
                      animate={{ opacity: 1, width: "auto", x: 0 }}
                      exit={{ opacity: 0, width: 0, x: -10 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <span className="font-semibold whitespace-nowrap text-sm tracking-tight block ml-4">
                        {item.label}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {!isExpanded && (
                  <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-[11px] font-bold rounded-xl opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all pointer-events-none whitespace-nowrap z-50 shadow-xl border border-white/10 uppercase tracking-widest">
                    {item.label}
                  </div>
                )}


              </Link>
            );
          })}
        </div>
      </div>

    </motion.div>
  );
}

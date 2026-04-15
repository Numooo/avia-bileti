"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plane, 
  Search,
  Navigation, 
  Wind, 
  ArrowUp, 
  Globe, 
  Activity,
  MousePointer2,
  X,
  Crosshair,
  AlertTriangle
} from "lucide-react";
import "leaflet/dist/leaflet.css";
import { useTranslations } from "next-intl";

// ─── Constants ───────────────────────────────────────────────
const REFRESH_INTERVAL = 60000; // Increased to 60 seconds to save API limits
const DEFAULT_CENTER: [number, number] = [42.8746, 74.5698]; // Bishkek
const DEFAULT_ZOOM = 6;
const MIN_ZOOM_FOR_FETCH = 4; // Don't fetch if zoomed out too far

// ─── Types ───────────────────────────────────────────────────
interface Flight {
  icao24: string;
  callsign: string;
  originCountry: string;
  lastContact: number;
  longitude: number;
  latitude: number;
  baroAltitude: number | null;
  onGround: boolean;
  velocity: number | null;
  trueTrack: number | null;
  verticalRate: number | null;
  category: number;
}

// ─── Helpers ─────────────────────────────────────────────────
const mapOpenSkyToPlane = (data: any[]): Flight => ({
  icao24: data[0],
  callsign: data[1]?.trim() || "N/A",
  originCountry: data[2],
  lastContact: data[4],
  longitude: data[5],
  latitude: data[6],
  baroAltitude: data[7],
  onGround: data[8],
  velocity: data[9],
  trueTrack: data[10],
  verticalRate: data[11],
  category: data[17],
});

// ─── Internal Map Component ──────────────────────────────────
const RadarMapInner = ({ 
  onBoundsChange, 
  flights, 
  selectedFlight, 
  onFlightSelect 
}: { 
  onBoundsChange: (bounds: string, zoom: number) => void,
  flights: Flight[],
  selectedFlight: Flight | null,
  onFlightSelect: (flight: Flight) => void
}) => {
  const { MapContainer, TileLayer, Marker, useMapEvents } = require("react-leaflet");
  const L = require("leaflet");

  const planeIcon = (rotation: number, isSelected: boolean) => L.divIcon({
    className: "custom-plane-icon",
    html: `
      <div style="transform: rotate(${rotation}deg); transition: transform 0.5s ease;">
        <svg viewBox="0 0 24 24" width="${isSelected ? 36 : 28}" height="${isSelected ? 36 : 28}" fill="${isSelected ? "#f58224" : "#0a57a1"}" stroke="white" stroke-width="1.5">
          <path d="M21,16L21,14L13,9L13,3.5C13,2.67 12.33,2 11.5,2C10.67,2 10,2.67 10,3.5L10,9L2,14L2,16L10,13.5L10,19L8,20.5L8,22L11.5,21L15,22L15,20.5L13,19L13,13.5L21,16Z"/>
        </svg>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });

  function MapEvents() {
    const map = useMapEvents({
      moveend: () => {
        const b = map.getBounds();
        onBoundsChange(`${b.getSouth()},${b.getWest()},${b.getNorth()},${b.getEast()}`, map.getZoom());
      },
      zoomend: () => {
        const b = map.getBounds();
        onBoundsChange(`${b.getSouth()},${b.getWest()},${b.getNorth()},${b.getEast()}`, map.getZoom());
      },
    });

    useEffect(() => {
      const b = map.getBounds();
      onBoundsChange(`${b.getSouth()},${b.getWest()},${b.getNorth()},${b.getEast()}`, map.getZoom());
    }, []);

    return null;
  }

  return (
    <MapContainer
      center={DEFAULT_CENTER}
      zoom={DEFAULT_ZOOM}
      className="w-full h-full z-10"
      zoomControl={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; OpenStreetMap &copy; CARTO &copy; OpenSky Network'
      />
      <MapEvents />
      
      {flights.map((flight) => (
        <Marker
          key={flight.icao24}
          position={[flight.latitude, flight.longitude]}
          icon={planeIcon(flight.trueTrack || 0, selectedFlight?.icao24 === flight.icao24)}
          eventHandlers={{
            click: () => onFlightSelect(flight),
          }}
        />
      ))}
    </MapContainer>
  );
};

const RadarMapWrapper = (props: any) => {
  return <RadarMapInner {...props} />;
};

const DynamicRadarMap = dynamic(() => Promise.resolve(RadarMapWrapper), { ssr: false });

// ─── Main Component ─────────────────────────────────────────
export function FlightRadarPage() {
  const t = useTranslations("Radar");
  const [flights, setFlights] = useState<Flight[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [currentBoundsStr, setCurrentBoundsStr] = useState<string>("");
  const [currentZoom, setCurrentZoom] = useState<number>(DEFAULT_ZOOM);
  
  const lastFetchTimeRef = useRef<number>(0);

  const fetchFlights = useCallback(async (boundsStr: string, zoom: number) => {
    if (!boundsStr || zoom < MIN_ZOOM_FOR_FETCH) {
      if (zoom < MIN_ZOOM_FOR_FETCH) setFlights([]);
      return;
    }

    // Rate limiting: throttle manual moves if they happen too fast (min 5 sec between fetches)
    const now = Date.now();
    if (now - lastFetchTimeRef.current < 5000) return;
    lastFetchTimeRef.current = now;

    const [lamin, lomin, lamax, lomax] = boundsStr.split(",");
    
    setIsLoading(true);
    setErrorStatus(null);
    try {
      const params = new URLSearchParams({ lamin, lomin, lamax, lomax });
      const response = await fetch(`/api/flights?${params.toString()}`);
      
      if (!response.ok) {
        setErrorStatus(response.status);
        console.error("Flight Radar API Error:", response.status);
        return;
      }
      
      const data = await response.json();
      if (data.states) {
        const mappedFlights = data.states.map(mapOpenSkyToPlane);
        setFlights(mappedFlights);
      } else {
        setFlights([]);
      }
      setLastUpdate(new Date());
    } catch (error) {
      console.error("Error fetching flights:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleBoundsChange = useCallback((boundsStr: string, zoom: number) => {
    setCurrentBoundsStr(boundsStr);
    setCurrentZoom(zoom);
  }, []);

  useEffect(() => {
    if (currentBoundsStr) {
      fetchFlights(currentBoundsStr, currentZoom);
      const interval = setInterval(() => fetchFlights(currentBoundsStr, currentZoom), REFRESH_INTERVAL);
      return () => clearInterval(interval);
    }
  }, [currentBoundsStr, currentZoom, fetchFlights]);

  const filteredFlights = useMemo(() => {
    return flights.filter(f => f.callsign.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [flights, searchQuery]);

  return (
    <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden bg-slate-50">
      {/* Sidebar Overlay */}
      <AnimatePresence>
        {selectedFlight && (
          <motion.div
            initial={{ x: -400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -400, opacity: 0 }}
            className="absolute left-6 top-6 bottom-6 w-80 sm:w-96 bg-white/95 backdrop-blur-md z-[1000] rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
          >
            <div className="bg-brand-primary p-6 text-white relative">
              <button 
                onClick={() => setSelectedFlight(null)}
                className="absolute right-4 top-4 p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              <div className="flex items-center gap-3 mb-2">
                <Plane className="rotate-90" />
                <span className="text-sm font-medium opacity-80">{t("details")}</span>
              </div>
              <h2 className="text-3xl font-black">{selectedFlight.callsign}</h2>
              <p className="text-white/70 text-sm mt-1">ICAO: {selectedFlight.icao24.toUpperCase()}</p>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                    <ArrowUp size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">{t("altitude")}</span>
                  </div>
                  <p className="text-xl font-bold text-slate-900">
                    {selectedFlight.baroAltitude ? `${Math.round(selectedFlight.baroAltitude)} ${t("meters")}` : "N/A"}
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                    <Wind size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">{t("speed")}</span>
                  </div>
                  <p className="text-xl font-bold text-slate-900">
                    {selectedFlight.velocity ? `${Math.round(selectedFlight.velocity * 3.6)} ${t("kmh")}` : "N/A"}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                  <div className="flex items-center gap-3 text-slate-600">
                    <Globe size={18} />
                    <span className="text-sm font-medium">{t("origin")}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900 text-right">{selectedFlight.originCountry}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                  <div className="flex items-center gap-3 text-slate-600">
                    <Navigation size={18} className="rotate-45" />
                    <span className="text-sm font-medium">{t("track")}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">{selectedFlight.trueTrack || 0}°</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                  <div className="flex items-center gap-3 text-slate-600">
                    <Activity size={18} />
                    <span className="text-sm font-medium">{t("status")}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-bold uppercase ${selectedFlight.onGround ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
                    {selectedFlight.onGround ? t("onGround") : t("inFlight")}
                  </span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-slate-900 rounded-2xl text-white">
                <div className="flex items-center gap-2 mb-3">
                  <Crosshair size={16} className="text-brand-accent" />
                  <span className="text-xs font-bold uppercase tracking-wider opacity-60">{t("coordinates")}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="block opacity-50 mb-0.5">{t("latitude")}</span>
                    <span className="font-mono">{selectedFlight.latitude.toFixed(4)}</span>
                  </div>
                  <div>
                    <span className="block opacity-50 mb-0.5">{t("longitude")}</span>
                    <span className="font-mono">{selectedFlight.longitude.toFixed(4)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100">
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent("open-chat"))}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group"
              >
                {t("trackFlight")}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map Header Overlay */}
      <div className="absolute top-6 right-6 z-[1000] flex flex-col items-end gap-3 pointer-events-none">
        <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl border border-slate-200 pointer-events-auto flex items-center gap-3">
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-bold text-slate-600">{t("updating")}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">{t("live")}</span>
            </div>
          )}
          <div className="w-px h-4 bg-slate-200" />
          <span className="text-xs font-bold text-slate-400">
            {t("visibleAircrafts", { count: flights.length })}
          </span>
        </div>
        
        {errorStatus === 429 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-amber-50 border border-amber-200 p-3 rounded-2xl shadow-lg pointer-events-auto flex items-start gap-3 max-w-[240px]"
          >
            <AlertTriangle className="text-amber-600 shrink-0" size={18} />
            <div>
              <p className="text-[11px] font-bold text-amber-900 leading-tight">Лимит API исчерпан</p>
              <p className="text-[10px] text-amber-700 mt-1 leading-tight">Слишком много запросов. Подождите пару минут.</p>
            </div>
          </motion.div>
        )}

        {currentZoom < MIN_ZOOM_FOR_FETCH && (
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-2xl shadow-lg pointer-events-auto flex items-start gap-3 max-w-[240px]">
            <Globe className="text-blue-600 shrink-0" size={18} />
            <div>
              <p className="text-[11px] font-bold text-blue-900 leading-tight">Увеличьте масштаб</p>
              <p className="text-[10px] text-blue-700 mt-1 leading-tight">Приблизьте карту, чтобы увидеть самолеты в этой области.</p>
            </div>
          </div>
        )}
        
        <div className="bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-lg border border-slate-200 text-[10px] text-slate-500 uppercase tracking-widest pointer-events-auto">
          {t("lastSync")}: {lastUpdate.toLocaleTimeString()}
        </div>
      </div>

      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-md px-4 pointer-events-none">
        <div className="relative pointer-events-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/90 backdrop-blur-md shadow-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-brand-primary/20 transition-all text-slate-900 font-medium"
          />
        </div>
      </div>

      {!selectedFlight && !errorStatus && currentZoom >= MIN_ZOOM_FOR_FETCH && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[1000] pointer-events-none">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-2xl border border-slate-200 flex items-center gap-3"
          >
            <MousePointer2 className="text-brand-accent animate-bounce" size={18} />
            <span className="text-slate-700 text-sm font-medium">{t("clickInstruction")}</span>
          </motion.div>
        </div>
      )}

      <DynamicRadarMap 
        onBoundsChange={handleBoundsChange}
        flights={filteredFlights}
        selectedFlight={selectedFlight}
        onFlightSelect={setSelectedFlight}
      />

      <style jsx global>{`
        .leaflet-container {
          background: #f8fafc !important;
        }
        .custom-plane-icon {
          background: transparent !important;
          border: none !important;
        }
        .leaflet-div-icon {
          background: transparent !important;
          border: none !important;
        }
        .leaflet-marker-icon {
          cursor: pointer !important;
        }
      `}</style>
    </div>
  );
}

const ArrowRight = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

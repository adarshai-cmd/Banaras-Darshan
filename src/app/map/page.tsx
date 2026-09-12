"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { MapPin, Navigation, Layers, Compass, ArrowRight } from "lucide-react";
import { RoutePlannerWidget } from "@/components/map/RoutePlannerWidget";
import { BanarasWeatherWidget } from "@/components/weather/BanarasWeatherWidget";
import { GlassCard, Button } from "@/components/ui/GlassCard";
import { MapMarkerData } from "@/components/map/LeafletMap";

// Dynamically import Leaflet map with no SSR to prevent leaflet window reference errors
const LeafletMap = dynamic(
  () => import("@/components/map/LeafletMap").then((mod) => mod.LeafletMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[550px] rounded-2xl bg-[#080d1e] flex flex-col items-center justify-center text-slate-400 border border-white/10">
        <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mb-2" />
        <p className="text-xs">Loading OpenStreetMap Kashi Tiles...</p>
      </div>
    ),
  }
);

export default function MapPage() {
  const [places, setPlaces] = useState<MapMarkerData[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAllPlaces = async () => {
      try {
        const res = await fetch("/api/places");
        const data = await res.json();
        if (data.success) {
          setPlaces(data.places);
        }
      } catch (err) {
        console.error("Error fetching map markers", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllPlaces();
  }, []);

  const filterCategories = [
    { id: "ALL", label: "All Pins" },
    { id: "TEMPLE", label: "Temples" },
    { id: "GHAT", label: "Ghats" },
    { id: "FOOD", label: "Food & Sweets" },
    { id: "HOTEL", label: "Hotels & Stays" },
    { id: "HIDDEN", label: "Hidden Gems" },
  ];

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-sky-700 mb-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>Cartographic Explorer</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 font-serif">
            Interactive Banaras Map
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-normal">
            Locate 84 ghats, ancient temples, legendary food stalls, and heritage stays on live OpenStreetMap tiles
          </p>
        </div>

        {/* Category Layers */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {filterCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white border-amber-600 shadow-md"
                  : "bg-white text-slate-700 border-amber-500/20 hover:bg-amber-50 hover:text-amber-800 shadow-sm"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Full-size Map Container */}
      <div className="w-full h-[580px] shadow-2xl rounded-2xl overflow-hidden border border-amber-500/20">
        <LeafletMap places={places} selectedCategory={selectedCategory} />
      </div>

      {/* Station / Airport Route Planner */}
      <div className="space-y-4">
        <div className="border-b border-black/10 pb-2">
          <h2 className="text-xl font-bold text-slate-900 font-serif">
            Station & Airport Direct Route Calculator
          </h2>
          <p className="text-xs text-slate-600">
            Select your arrival terminal to check distance, travel duration, and realistic fare benchmarks
          </p>
        </div>
        <RoutePlannerWidget />
      </div>

      {/* Banaras Live Weather & 5-Day Forecast Panel */}
      <div className="pt-4 border-t border-slate-200">
        <BanarasWeatherWidget />
      </div>
    </div>
  );
}

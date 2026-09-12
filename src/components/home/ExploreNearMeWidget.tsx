"use client";

import React, { useState } from "react";
import { Navigation, Compass } from "lucide-react";
import { Button } from "@/components/ui/GlassCard";
import { PlaceCard, PlaceCardData } from "@/components/cards/PlaceCard";
import { calculateHaversineDistance } from "@/lib/distance";

export function ExploreNearMeWidget({ initialPlaces }: { initialPlaces: PlaceCardData[] }) {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationName, setLocationName] = useState<string>("Varanasi Center (Godowlia)");
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [sortedPlaces, setSortedPlaces] = useState<PlaceCardData[]>(initialPlaces);

  const landmarks = [
    { name: "Godowlia Crossing", lat: 25.3090, lng: 83.0070 },
    { name: "Assi Ghat", lat: 25.2894, lng: 83.0068 },
    { name: "Varanasi Cantt Station", lat: 25.3284, lng: 82.9868 },
    { name: "Kashi Vishwanath Gate 4", lat: 25.3109, lng: 83.0107 },
  ];

  const updateDistances = (lat: number, lng: number, name: string) => {
    setUserLocation({ lat, lng });
    setLocationName(name);

    const withDist = initialPlaces.map((p) => {
      const distanceKm = calculateHaversineDistance({ lat, lng }, { lat: p.latitude, lng: p.longitude });
      return {
        ...p,
        distanceKm,
      };
    });

    withDist.sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
    setSortedPlaces(withDist);
  };

  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const { latitude, longitude } = position.coords;
        updateDistances(latitude, longitude, "Your Current Location (GPS)");
      },
      () => {
        setIsLocating(false);
        alert(
          "Location permission denied or unavailable. You can manually pick a starting landmark below!"
        );
      },
      { timeout: 8000 }
    );
  };

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-amber-700 mb-1">
            <Compass className="w-3.5 h-3.5" />
            <span>Proximity Radar</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 font-serif">Explore Near Me</h2>
          <p className="text-sm text-slate-600 mt-1">
            Sorted by real-time walking & transit proximity from your position
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="gold"
            size="sm"
            onClick={handleDetectGPS}
            disabled={isLocating}
            className="text-xs"
          >
            <Navigation className={`w-3.5 h-3.5 ${isLocating ? "animate-spin" : ""}`} />
            <span>{isLocating ? "Detecting GPS..." : "Detect My Live GPS"}</span>
          </Button>

          <span className="text-xs text-slate-600 font-medium">or jump to:</span>
          {landmarks.map((lm) => (
            <button
              key={lm.name}
              onClick={() => updateDistances(lm.lat, lm.lng, lm.name)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                locationName === lm.name
                  ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold border-amber-600 shadow-sm"
                  : "bg-white border-amber-500/20 text-slate-700 hover:text-amber-800 hover:border-amber-500/40 shadow-sm"
              }`}
            >
              {lm.name}
            </button>
          ))}
        </div>
      </div>

      <div className="p-3.5 rounded-xl bg-white border border-amber-500/20 mb-6 text-xs text-slate-700 flex items-center justify-between shadow-sm">
        <span>
          Showing destinations calculated from:{" "}
          <strong className="text-amber-800 font-bold">{locationName}</strong>
        </span>
        <span className="text-sky-700 font-mono text-[11px] font-semibold">
          Haversine Geolocation Engine Active
        </span>
      </div>

      {/* Grid of nearest places */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {sortedPlaces.slice(0, 4).map((place) => (
          <PlaceCard key={place.id} place={place} />
        ))}
      </div>
    </section>
  );
}

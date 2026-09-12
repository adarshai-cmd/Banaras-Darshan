"use client";

import React, { useState } from "react";
import {
  Navigation,
  Train,
  Plane,
  Car,
  Footprints,
  Clock,
  CircleDollarSign,
  AlertCircle,
  ArrowRight,
  MapPin,
} from "lucide-react";
import {
  calculateHaversineDistance,
  estimateTravelTime,
  formatDistance,
  VARANASI_HUBS,
} from "@/lib/distance";
import { GlassCard, Button } from "@/components/ui/GlassCard";

const DESTINATIONS = [
  {
    id: "dashashwamedh",
    name: "Dashashwamedh Ghat (Ganga Aarti Hub)",
    lat: 25.3075,
    lng: 83.0105,
    tips: "Vehicles stop at Godowlia crossing. Walk 350m down the pedestrian stone lane.",
  },
  {
    id: "vishwanath",
    name: "Shri Kashi Vishwanath Temple (Gate 4)",
    lat: 25.3109,
    lng: 83.0107,
    tips: "Free lockers for phones and electronics at Corridor Gate 4.",
  },
  {
    id: "assi",
    name: "Assi Ghat (Subah-e-Banaras)",
    lat: 25.2894,
    lng: 83.0068,
    tips: "Accessible by auto/cab directly up to Assi road crossing.",
  },
  {
    id: "sankat_mochan",
    name: "Sankat Mochan Hanuman Mandir",
    lat: 25.2816,
    lng: 82.9984,
    tips: "Near BHU campus. Ample parking outside the gate.",
  },
];

export function RoutePlannerWidget() {
  const [fromKey, setFromKey] = useState<string>("cantt_station");
  const [destId, setDestId] = useState<string>("dashashwamedh");
  const [travelMode, setTravelMode] = useState<"AUTO" | "CAR" | "WALKING" | "BOAT">("AUTO");

  const startHub = VARANASI_HUBS[fromKey];
  const endDest = DESTINATIONS.find((d) => d.id === destId) || DESTINATIONS[0];

  const distanceKm = calculateHaversineDistance(
    { lat: startHub.lat, lng: startHub.lng },
    { lat: endDest.lat, lng: endDest.lng }
  );

  const estimate = estimateTravelTime(distanceKm, travelMode);

  return (
    <GlassCard className="p-6 md:p-8 relative overflow-hidden bg-white/95 border border-amber-500/20 shadow-xl" hoverEffect={false}>
      <div className="flex items-center gap-2 mb-6">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md">
          <Navigation className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900 font-serif">
            Station & Airport Route Navigator
          </h3>
          <p className="text-xs text-slate-600">
            Real-world Varanasi transit times, verified fares & pedestrian tips
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls Column */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider mb-2">
              Starting Point (Station / Airport):
            </label>
            <select
              value={fromKey}
              onChange={(e) => setFromKey(e.target.value)}
              className="w-full rounded-xl px-4 py-2.5 text-sm font-medium bg-white border border-amber-500/30 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            >
              <option value="cantt_station" className="bg-white text-slate-900">
                Varanasi Cantt Railway Station (BSB)
              </option>
              <option value="banaras_station" className="bg-white text-slate-900">
                Banaras Railway Station (BSBS - Manduadih)
              </option>
              <option value="kashi_station" className="bg-white text-slate-900">
                Kashi Railway Station (KEI)
              </option>
              <option value="airport" className="bg-white text-slate-900">
                Lal Bahadur Shastri Airport (VNS - Babatpur)
              </option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider mb-2">
              Destination in Banaras:
            </label>
            <select
              value={destId}
              onChange={(e) => setDestId(e.target.value)}
              className="w-full rounded-xl px-4 py-2.5 text-sm font-medium bg-white border border-amber-500/30 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            >
              {DESTINATIONS.map((d) => (
                <option key={d.id} value={d.id} className="bg-white text-slate-900">
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Mode Tabs */}
          <div>
            <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider mb-2">
              Select Transport Mode:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTravelMode("AUTO")}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  travelMode === "AUTO"
                    ? "bg-gradient-to-r from-amber-500 to-orange-600 border-amber-600 text-white font-bold shadow-md"
                    : "bg-white border-amber-500/20 text-slate-700 hover:text-amber-800 hover:border-amber-500/40 shadow-sm"
                }`}
              >
                <span>🛺</span>
                <span>Auto / Rickshaw</span>
              </button>
              <button
                type="button"
                onClick={() => setTravelMode("CAR")}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  travelMode === "CAR"
                    ? "bg-gradient-to-r from-amber-500 to-orange-600 border-amber-600 text-white font-bold shadow-md"
                    : "bg-white border-amber-500/20 text-slate-700 hover:text-amber-800 hover:border-amber-500/40 shadow-sm"
                }`}
              >
                <Car className="w-3.5 h-3.5" />
                <span>Cab / Taxi</span>
              </button>
              <button
                type="button"
                onClick={() => setTravelMode("WALKING")}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  travelMode === "WALKING"
                    ? "bg-gradient-to-r from-amber-500 to-orange-600 border-amber-600 text-white font-bold shadow-md"
                    : "bg-white border-amber-500/20 text-slate-700 hover:text-amber-800 hover:border-amber-500/40 shadow-sm"
                }`}
              >
                <Footprints className="w-3.5 h-3.5" />
                <span>Walking</span>
              </button>
            </div>
          </div>
        </div>

        {/* Route Output Card */}
        <div className="rounded-2xl bg-amber-50/60 border border-amber-500/20 p-5 flex flex-col justify-between space-y-4 shadow-inner">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 uppercase tracking-wider font-semibold">
                Estimated Route
              </span>
              <span className="px-2.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-mono font-bold">
                {formatDistance(distanceKm)}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-white border border-amber-500/15 shadow-sm">
                <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-1">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Travel Duration</span>
                </div>
                <p className="text-lg font-bold text-slate-900">{estimate.minutes} mins</p>
              </div>

              <div className="p-3 rounded-xl bg-white border border-amber-500/15 shadow-sm">
                <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-1">
                  <CircleDollarSign className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verified Fare Range</span>
                </div>
                <p className="text-lg font-bold text-emerald-700">{estimate.approxFare}</p>
              </div>
            </div>

            {/* Local Transit Advice */}
            <div className="mt-4 p-3.5 rounded-xl bg-amber-100/70 border border-amber-300 text-xs text-amber-950 leading-relaxed flex items-start gap-2.5 shadow-sm">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-900">Local Banaras Navigation Note:</p>
                <p className="mt-0.5 font-medium">{endDest.tips}</p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <a
              href={`https://www.google.com/maps/dir/?api=1&origin=${startHub.lat},${startHub.lng}&destination=${endDest.lat},${endDest.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white text-xs font-semibold shadow-lg transition-all"
            >
              <span>Open Live Route on Navigation App</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

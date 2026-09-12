"use client";

import React, { useState, useEffect } from "react";
import {
  Navigation,
  Car,
  Footprints,
  Clock,
  CircleDollarSign,
  AlertCircle,
  CheckCircle2,
  Loader2,
  CloudSun,
  Umbrella,
  Sparkles,
} from "lucide-react";
import {
  fetchOSRMRoute,
  RouteResult,
  VARANASI_HUBS,
} from "@/lib/distance";
import { GlassCard } from "@/components/ui/GlassCard";

const DESTINATIONS = [
  {
    id: "dashashwamedh",
    name: "Dashashwamedh Ghat (Ganga Aarti Hub)",
    lat: 25.3076,
    lng: 83.0105,
    laneRestricted: true,
    tips: "Vehicles stop at Godowlia crossing. Walk 350m down the pedestrian stone lane to the river steps.",
  },
  {
    id: "vishwanath_temple",
    name: "Kashi Vishwanath Temple (Gate No. 4 / Godowlia)",
    lat: 25.3109,
    lng: 83.0107,
    laneRestricted: true,
    tips: "Free digital lockers for phones and electronics at Corridor Gate 4. No leather items inside.",
  },
  {
    id: "assi_ghat",
    name: "Assi Ghat (Subah-e-Banaras)",
    lat: 25.2885,
    lng: 83.0064,
    laneRestricted: false,
    tips: "Accessible by auto/cab directly up to Assi road crossing. Ample cafes and morning yoga.",
  },
  {
    id: "namo_ghat",
    name: "Namo Ghat (Northern Promenade)",
    lat: 25.3347,
    lng: 83.0375,
    laneRestricted: false,
    tips: "Direct wide road access with dedicated vehicle parking and northern river promenade.",
  },
  {
    id: "sarnath",
    name: "Sarnath Dhamek Stupa",
    lat: 25.3811,
    lng: 83.0214,
    laneRestricted: false,
    tips: "Smooth highway transit 10km north of Cantt. Archeological Museum closed on Fridays.",
  },
  {
    id: "bhu_campus",
    name: "Banaras Hindu University (BHU / Vishwanath Temple)",
    lat: 25.2677,
    lng: 82.9913,
    laneRestricted: false,
    tips: "Open green campus entry via Lanka gate. New Vishwanath Temple (VT) in campus center.",
  },
];

export function RoutePlannerWidget({
  onRouteCalculated,
}: {
  onRouteCalculated?: (route: RouteResult) => void;
}) {
  const [fromKey, setFromKey] = useState<string>("cantt_station");
  const [destId, setDestId] = useState<string>("dashashwamedh");
  const [travelMode, setTravelMode] = useState<"AUTO" | "CAR" | "WALKING" | "BOAT">("AUTO");
  const [routeData, setRouteData] = useState<RouteResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [liveWeather, setLiveWeather] = useState<any | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/weather")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data?.weather) setLiveWeather(data.weather);
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  const startHub = VARANASI_HUBS[fromKey] || VARANASI_HUBS["cantt_station"];
  const endDest = DESTINATIONS.find((d) => d.id === destId) || DESTINATIONS[0];

  useEffect(() => {
    let isCurrent = true;

    fetchOSRMRoute(
      { lat: startHub.lat, lng: startHub.lng },
      { lat: endDest.lat, lng: endDest.lng },
      travelMode
    ).then((result) => {
      if (isCurrent) {
        setRouteData(result);
        setLoading(false);
        if (onRouteCalculated) {
          onRouteCalculated(result);
        }
      }
    }).catch(() => {
      if (isCurrent) {
        setLoading(false);
      }
    });

    return () => {
      isCurrent = false;
    };
  }, [fromKey, destId, travelMode, startHub.lat, startHub.lng, endDest.lat, endDest.lng, onRouteCalculated]);

  return (
    <GlassCard className="p-6 md:p-8 relative overflow-hidden bg-white border border-slate-200 shadow-md" hoverEffect={false}>
      <div className="flex items-center gap-2 mb-6">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md">
          <Navigation className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-950 font-serif">
            Station & Airport Route Navigator
          </h3>
          <p className="text-xs text-slate-600">
            Real-world road distance, estimated transit times & verified local fare benchmarks
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls Column */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Starting Point (Station / Airport):
            </label>
            <select
              value={fromKey}
              onChange={(e) => {
                setFromKey(e.target.value);
                setLoading(true);
              }}
              className="w-full rounded-xl px-4 py-2.5 text-sm font-semibold bg-white border border-slate-300 text-slate-950 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            >
              <option value="cantt_station" className="text-slate-950">
                Varanasi Cantt Railway Station (BSB)
              </option>
              <option value="banaras_station" className="text-slate-950">
                Banaras Railway Station (BSBS - Manduadih)
              </option>
              <option value="kashi_station" className="text-slate-950">
                Kashi Railway Station (KEI)
              </option>
              <option value="airport" className="text-slate-950">
                Lal Bahadur Shastri Airport (VNS - Babatpur)
              </option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Destination in Banaras:
            </label>
            <select
              value={destId}
              onChange={(e) => {
                setDestId(e.target.value);
                setLoading(true);
              }}
              className="w-full rounded-xl px-4 py-2.5 text-sm font-semibold bg-white border border-slate-300 text-slate-950 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            >
              {DESTINATIONS.map((d) => (
                <option key={d.id} value={d.id} className="text-slate-950">
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Mode Tabs */}
          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Select Transport Mode:
            </label>
            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => {
                  setTravelMode("AUTO");
                  setLoading(true);
                }}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  travelMode === "AUTO"
                    ? "bg-amber-500 text-slate-950 border-amber-600 shadow-sm"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <span>🛺</span>
                <span>Auto</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setTravelMode("CAR");
                  setLoading(true);
                }}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  travelMode === "CAR"
                    ? "bg-amber-500 text-slate-950 border-amber-600 shadow-sm"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <Car className="w-3.5 h-3.5" />
                <span>Cab</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setTravelMode("WALKING");
                  setLoading(true);
                }}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  travelMode === "WALKING"
                    ? "bg-amber-500 text-slate-950 border-amber-600 shadow-sm"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <Footprints className="w-3.5 h-3.5" />
                <span>Walk</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setTravelMode("BOAT");
                  setLoading(true);
                }}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  travelMode === "BOAT"
                    ? "bg-amber-500 text-slate-950 border-amber-600 shadow-sm"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <span>⛵</span>
                <span>Boat</span>
              </button>
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Transit Breakdown
              </span>
              <span className="text-xs font-mono font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                {loading ? "Calculating..." : `${routeData?.distanceKm ?? 0} km`}
              </span>
            </div>

            {loading ? (
              <div className="py-8 flex items-center justify-center gap-2 text-slate-600 text-sm">
                <Loader2 className="w-5 h-5 animate-spin text-amber-600" />
                <span>Finding optimal route...</span>
              </div>
            ) : (
              <div className="space-y-3.5 mt-3">
                {/* Live Weather Status in Map Route Planner */}
                {liveWeather && (
                  <div className="p-2.5 rounded-xl bg-sky-50/90 border border-sky-200/80 text-sky-950 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded-lg bg-white shadow-xs shrink-0">
                        <CloudSun className="w-4 h-4 text-sky-600" />
                      </div>
                      <div className="text-[11px] leading-tight">
                        <span className="text-slate-500">Live Weather:</span>{" "}
                        <strong className="text-slate-900">{liveWeather.temperature}°C • {liveWeather.condition}</strong>
                      </div>
                    </div>
                    {liveWeather.rainChance > 20 && (
                      <span className="text-[10px] font-semibold text-sky-700 bg-sky-100/80 px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0">
                        <Umbrella className="w-3 h-3" /> {liveWeather.rainChance}% Rain
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 border border-orange-200 text-orange-700 flex items-center justify-center shrink-0 shadow-sm">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold">Estimated Travel Duration</p>
                    <p className="text-base font-bold text-slate-950 font-serif">
                      {routeData?.text ?? "Calculating..."}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 text-amber-800 flex items-center justify-center shrink-0 shadow-sm">
                    <CircleDollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold">Transport Fare Status</p>
                    <p className="text-sm font-bold text-slate-900 font-mono">
                      {routeData?.approxFare ?? "Fare unavailable"}
                    </p>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 leading-relaxed font-medium">
                  ⚠️ <strong>Local Travel Note:</strong> Local travel fares may vary. Please verify the current fare locally before travelling.
                </div>

                {routeData?.isRealRoadNetwork && (
                  <div className="inline-flex items-center gap-1.5 text-xs text-emerald-800 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Calculated via OpenStreetMap road network</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Tips Notice Box */}
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 space-y-1 shadow-sm">
            <div className="flex items-center gap-1.5 font-bold text-amber-800">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Lane & Last-Mile Advice:</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-600 font-normal">
              {endDest.tips}
            </p>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import {
  Sun,
  Flame,
  Waves,
  CloudSun,
  Clock,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

interface LiveWeatherData {
  temp: number | null;
  humidity: number | null;
  sunrise: string;
  sunset: string;
  isLive: boolean;
}

export function TodayInBanaras() {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [weather, setWeather] = useState<LiveWeatherData>({
    temp: 28,
    humidity: 62,
    sunrise: "05:42 AM",
    sunset: "06:18 PM",
    isLive: false,
  });

  useEffect(() => {
    let isMounted = true;
    const updateTime = () => {
      const now = new Date();
      if (isMounted) {
        setCurrentTime(
          now.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
        );
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);

    // Fetch from cached local weather API
    fetch("/api/weather")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!isMounted || !data?.weather) return;
        setWeather({
          temp: data.weather.temperature ?? 28,
          humidity: data.weather.humidity ?? 62,
          sunrise: data.weather.sunrise ?? "05:42 AM",
          sunset: data.weather.sunset ?? "06:18 PM",
          isLive: true,
        });
      })
      .catch(() => {});

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <section className="py-12 border-y border-slate-200 bg-[#F5F2EA] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-800 mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Live Kashi Dispatch</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif">
              Today in Banaras
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-600 font-medium">Local Varanasi Time:</span>
            <span
              suppressHydrationWarning
              className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono text-sm font-bold shadow-sm"
            >
              {currentTime || "06:30 PM"} IST
            </span>
          </div>
        </div>

        {/* 4 Status Widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Ganga Aarti Timings */}
          <GlassCard className="p-5 relative overflow-hidden group hover:scale-[1.01] transition-all bg-white border border-slate-200 shadow-sm" hoverEffect={false}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-amber-900 font-bold uppercase tracking-wider">
                  Ganga Aarti Schedule
                </p>
                <h3 className="text-lg font-bold text-slate-950 font-serif mt-1">6:30 PM Tonight</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Dashashwamedh Ghat (arrive by 5:45 PM for steps seating)
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-700 shrink-0 shadow-sm">
                <Flame className="w-5 h-5 animate-pulse" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-700">
              <span>Morning Aarti (Assi):</span>
              <span className="text-amber-800 font-bold">5:00 AM (Subah-e-Banaras)</span>
            </div>
          </GlassCard>

          {/* 2. Sunrise & Sunset */}
          <GlassCard className="p-5 relative overflow-hidden group hover:scale-[1.01] transition-all bg-white border border-slate-200 shadow-sm" hoverEffect={false}>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="text-xs text-sky-900 font-bold uppercase tracking-wider">
                    Dawn & Dusk Times
                  </p>
                  {weather.isLive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" title="Live astronomical calculation" />
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-950 font-serif mt-1">
                  {weather.sunrise} / {weather.sunset}
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Golden hour ideal for wooden boat photography
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-800 shrink-0 shadow-sm">
                <Sun className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-700">
              <span>Best River Dawn:</span>
              <span className="text-sky-800 font-bold">5:15 AM – 6:15 AM</span>
            </div>
          </GlassCard>

          {/* 3. Weather Conditions */}
          <GlassCard className="p-5 relative overflow-hidden group hover:scale-[1.01] transition-all bg-white border border-slate-200 shadow-sm" hoverEffect={false}>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="text-xs text-emerald-900 font-bold uppercase tracking-wider">
                    Varanasi Weather
                  </p>
                  {weather.isLive && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                      ● Live
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-950 font-serif mt-1">
                  {weather.temp !== null ? `${weather.temp}°C` : "28°C"}
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Humidity {weather.humidity}% • Good river visibility
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-800 shrink-0 shadow-sm">
                <CloudSun className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-700">
              <span>Attire recommendation:</span>
              <span className="text-emerald-800 font-bold">Light cotton & walking shoes</span>
            </div>
          </GlassCard>

          {/* 4. River Navigation & Boat Status */}
          <GlassCard className="p-5 relative overflow-hidden group hover:scale-[1.01] transition-all bg-white border border-slate-200 shadow-sm" hoverEffect={false}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-blue-900 font-bold uppercase tracking-wider">
                  River Navigation
                </p>
                <h3 className="text-lg font-bold text-slate-950 font-serif mt-1">Normal Current</h3>
                <p className="text-xs text-slate-600 mt-1">
                  All 84 ghats open for licensed passenger boats
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-800 shrink-0 shadow-sm">
                <Waves className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-700">
              <span>Police Rate Card:</span>
              <span className="text-blue-800 font-bold">₹150-200 (Shared bajra)</span>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}

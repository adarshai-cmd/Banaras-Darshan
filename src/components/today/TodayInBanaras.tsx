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

export function TodayInBanaras() {
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-12 border-y border-amber-500/15 bg-[#F5F2EA] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-amber-700 mb-1">
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
              className="px-3.5 py-1.5 rounded-xl bg-white border border-amber-500/30 text-amber-800 font-mono text-sm font-bold shadow-sm"
            >
              {currentTime || "06:30 PM"} IST
            </span>
          </div>
        </div>

        {/* 4 Live Status Widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Ganga Aarti Timings */}
          <GlassCard className="p-5 relative overflow-hidden group hover:scale-[1.02] transition-all">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-amber-800 font-semibold uppercase tracking-wider">
                  Ganga Aarti Schedule
                </p>
                <h3 className="text-lg font-bold text-slate-900 font-serif mt-1">6:30 PM Tonight</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Dashashwamedh Ghat (arrive by 5:45 PM for steps/boats)
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-orange-100 border border-orange-300 flex items-center justify-center text-orange-600 shrink-0 shadow-sm">
                <Flame className="w-5 h-5 animate-bounce [animation-duration:2s]" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-black/10 flex items-center justify-between text-xs text-slate-600">
              <span>Morning Aarti (Assi):</span>
              <span className="text-amber-700 font-bold">5:00 AM (Subah-e-Banaras)</span>
            </div>
          </GlassCard>

          {/* 2. Sunrise & Sunset */}
          <GlassCard className="p-5 relative overflow-hidden group hover:scale-[1.02] transition-all">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-sky-800 font-semibold uppercase tracking-wider">
                  Dawn & Dusk Times
                </p>
                <h3 className="text-lg font-bold text-slate-900 font-serif mt-1">05:42 AM / 06:18 PM</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Golden hour ideal for boat photography
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shrink-0 shadow-sm">
                <Sun className="w-5 h-5 animate-spin [animation-duration:15s]" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-black/10 flex items-center justify-between text-xs text-slate-600">
              <span>Best River Dawn:</span>
              <span className="text-sky-700 font-bold">5:20 AM – 6:15 AM</span>
            </div>
          </GlassCard>

          {/* 3. River & Boating Conditions */}
          <GlassCard className="p-5 relative overflow-hidden group hover:scale-[1.02] transition-all">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-emerald-800 font-semibold uppercase tracking-wider">
                  River Navigation Status
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <h3 className="text-lg font-bold text-emerald-700 font-serif">Safe / Open</h3>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Calm current. Hand-oar and motor bajras operating.
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shrink-0 shadow-sm">
                <Waves className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-black/10 flex items-center justify-between text-xs text-slate-600">
              <span>Official Shared Fare:</span>
              <span className="text-slate-900 font-bold">₹150 – ₹200 / seat</span>
            </div>
          </GlassCard>

          {/* 4. Weather in Varanasi */}
          <GlassCard className="p-5 relative overflow-hidden group hover:scale-[1.02] transition-all">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-blue-800 font-semibold uppercase tracking-wider">
                  Varanasi Weather
                </p>
                <h3 className="text-lg font-bold text-slate-900 font-serif mt-1">26°C Clear Sky</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Gentle river breeze • Humidity 58%
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-100 border border-blue-300 flex items-center justify-center text-blue-700 shrink-0 shadow-sm">
                <CloudSun className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-black/10 flex items-center justify-between text-xs text-slate-600">
              <span>Evening Recommendation:</span>
              <span className="text-amber-700 font-bold">Light cotton clothing</span>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}

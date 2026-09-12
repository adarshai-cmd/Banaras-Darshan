import React from "react";
import { CalendarCheck, Compass, Sparkles, MapPin, DollarSign, Clock } from "lucide-react";
import { TripPlannerWidget } from "@/components/trip/TripPlannerWidget";
import { GlassCard } from "@/components/ui/GlassCard";

export default function PlanTripPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-amber-700 mb-1">
          <CalendarCheck className="w-3.5 h-3.5" />
          <span>Intelligent Itinerary Architecture</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 font-serif">
          Plan My Banaras Trip
        </h1>
        <p className="text-slate-600 text-sm sm:text-base font-normal leading-relaxed">
          Craft an authentic, non-rushed itinerary structured by walking proximity. Avoid chaotic
          backtracking, synchronize with dawn Aarti times, and budget realistically.
        </p>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <GlassCard className="p-4 flex items-start gap-3 bg-white/90 border border-amber-500/20 shadow-sm" hoverEffect={false}>
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-800 border border-amber-500/20 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900">Zero-Backtracking Logic</h4>
            <p className="mt-0.5 text-slate-600">
              Morning dawn activities group in Assi & Chowk to save time.
            </p>
          </div>
        </GlassCard>

        <GlassCard className="p-4 flex items-start gap-3 bg-white/90 border border-amber-500/20 shadow-sm" hoverEffect={false}>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-800 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900">Realistic Cost Benchmarks</h4>
            <p className="mt-0.5 text-slate-600">
              Accounts for actual street food, verified boat fares, and temple access.
            </p>
          </div>
        </GlassCard>

        <GlassCard className="p-4 flex items-start gap-3 bg-white/90 border border-amber-500/20 shadow-sm" hoverEffect={false}>
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-800 border border-sky-500/20 flex items-center justify-center shrink-0">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900">Export & Offline Ready</h4>
            <p className="mt-0.5 text-slate-600">
              Print to PDF or save to your personal "My Trip" dashboard.
            </p>
          </div>
        </GlassCard>
      </div>

      {/* Main Interactive Planner */}
      <TripPlannerWidget />
    </div>
  );
}

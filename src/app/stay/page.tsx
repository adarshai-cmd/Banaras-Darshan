import React from "react";
import { prisma } from "@/lib/db";
import { BedDouble, CheckCircle2, ShieldCheck, MapPin, Sparkles } from "lucide-react";
import { PlaceCard, PlaceCardData } from "@/components/cards/PlaceCard";
import { GlassCard, Badge } from "@/components/ui/GlassCard";

export const revalidate = 60;

export default async function StayPage() {
  const stays = await prisma.place.findMany({
    where: { category: "HOTEL" },
    orderBy: { rating: "desc" },
  });

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-amber-700 mb-1">
          <BedDouble className="w-3.5 h-3.5" />
          <span>Varanasi Hospitality</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 font-serif">
          Hotels, Ghat Stays & Hostels
        </h1>
        <p className="text-slate-600 text-sm sm:text-base font-normal leading-relaxed">
          From historic 18th-century sandstone palaces with private boat check-in to vibrant backpacker
          hostels and peaceful river-view guesthouses overlooking the morning boat bells.
        </p>
      </div>

      {/* Practical Location Tip Banner */}
      <GlassCard className="p-6 text-xs text-slate-700 space-y-2 bg-white/90 border border-amber-500/20 shadow-sm" hoverEffect={false}>
        <div className="flex items-center gap-2 text-amber-800 font-bold uppercase tracking-wider">
          <MapPin className="w-4 h-4 text-amber-600" />
          <span>Varanasi Accommodation Logistics Guide</span>
        </div>
        <p className="leading-relaxed">
          <strong className="text-slate-900">Staying directly on the Ghats (e.g. Meer Ghat, Darbhanga Ghat):</strong> Unbeatable sunrise views and immediate boat access. However, motorized vehicles (cabs, autos) cannot enter the old stone lanes beyond Godowlia crossing or Maidagin. Expect a 5–10 minute walk through pedestrian alleys.
        </p>
        <p className="leading-relaxed text-slate-600">
          <strong className="text-slate-900">Staying in Cantonment (Cantt Station area):</strong> Direct cab access right up to the porch, spacious hotel grounds, but requires a 15–20 minute auto-rickshaw ride to reach the ghats for sunrise.
        </p>
      </GlassCard>

      {/* Stays Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-black/10">
          <h2 className="text-2xl font-bold text-slate-900 font-serif">
            Verified Stays by Atmosphere & Budget
          </h2>
          <span className="text-xs text-slate-600 font-semibold">{stays.length} Fact-Checked Stays</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stays.map((place) => (
            <PlaceCard key={place.id} place={place as unknown as PlaceCardData} />
          ))}
        </div>
      </div>
    </div>
  );
}

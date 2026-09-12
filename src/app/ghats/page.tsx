import React from "react";
import { prisma } from "@/lib/db";
import { Waves, Flame, Sun, AlertTriangle, ShieldCheck } from "lucide-react";
import { PlaceCard, PlaceCardData } from "@/components/cards/PlaceCard";
import { GlassCard, Badge } from "@/components/ui/GlassCard";

export const revalidate = 60;

export default async function GhatsPage() {
  const ghats = await prisma.place.findMany({
    where: { category: "GHAT" },
    orderBy: { reviewCount: "desc" },
  });

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-sky-700 mb-1">
          <Waves className="w-3.5 h-3.5" />
          <span>The 84 Sacred Steps</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 font-serif">
          Cinematic Ghats of the Ganga
        </h1>
        <p className="text-slate-600 text-sm sm:text-base font-normal leading-relaxed">
          The crescent riverfront of Varanasi stretches across 84 historic stone ghats. From the grand
          fire ceremony of Dashashwamedh and the dawn raga of Assi to the eternal flame of Manikarnika.
        </p>
      </div>

      {/* Ghats Protocol & Safety Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <GlassCard className="p-5 space-y-2 bg-white/90 border border-amber-500/20 shadow-sm">
          <div className="flex items-center gap-2 text-sky-700 font-bold uppercase tracking-wider">
            <Sun className="w-4 h-4" />
            <span>Dawn: Subah-e-Banaras</span>
          </div>
          <p className="text-slate-700 leading-relaxed">
            Head to <strong className="text-slate-900">Assi Ghat</strong> by 5:00 AM for sunrise Vedic chanting, classical Indian
            ragas on sitar/shehnai, and community yoga overlooking the golden morning mist.
          </p>
        </GlassCard>

        <GlassCard className="p-5 space-y-2 bg-white/90 border border-amber-500/20 shadow-sm">
          <div className="flex items-center gap-2 text-orange-700 font-bold uppercase tracking-wider">
            <Flame className="w-4 h-4" />
            <span>Dusk: Maha Ganga Aarti</span>
          </div>
          <p className="text-slate-700 leading-relaxed">
            Every day at <strong className="text-slate-900">6:30 PM</strong> at Dashashwamedh Ghat. To secure step seating, arrive
            by 5:45 PM. Shared wooden bajra boat seats are standardly ₹150–200.
          </p>
        </GlassCard>

        <GlassCard className="p-5 space-y-2 bg-white/90 border border-rose-400/40 shadow-sm">
          <div className="flex items-center gap-2 text-rose-700 font-bold uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            <span>Manikarnika Etiquette</span>
          </div>
          <p className="text-slate-700 leading-relaxed">
            Strictly maintain silence and solemnity. <strong className="text-rose-900">Photography and filming of cremation pyres
            are strictly prohibited</strong>. Ignore touts claiming to collect cremation wood charity.
          </p>
        </GlassCard>
      </div>

      {/* Ghats Directory */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-black/10">
          <h2 className="text-2xl font-bold text-slate-900 font-serif">
            Iconic Ghats & Riverfront Architecture
          </h2>
          <span className="text-xs text-slate-600 font-semibold">{ghats.length} Detailed Ghats</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ghats.map((place) => (
            <PlaceCard key={place.id} place={place as unknown as PlaceCardData} />
          ))}
        </div>
      </div>
    </div>
  );
}

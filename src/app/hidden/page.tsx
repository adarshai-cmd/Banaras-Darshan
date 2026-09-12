import React from "react";
import { prisma } from "@/lib/db";
import { Sparkles, Footprints, ShieldCheck, MapPin } from "lucide-react";
import { PlaceCard, PlaceCardData } from "@/components/cards/PlaceCard";
import { GlassCard, Badge } from "@/components/ui/GlassCard";

export const revalidate = 60;

export default async function HiddenPlacesPage() {
  const hiddenPlaces = await prisma.place.findMany({
    where: {
      OR: [
        { isHiddenGem: true },
        { category: "HIDDEN" },
        { category: "STREET" },
      ],
    },
    orderBy: { rating: "desc" },
  });

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-amber-700 mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Off the Beaten Trail</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 font-serif">
          Hidden Banaras & Galliyan
        </h1>
        <p className="text-slate-600 text-sm sm:text-base font-normal leading-relaxed">
          Behind the bustling ghats lies a labyrinth of ancient stone alleys, generation-old brass
          workshops, GI-tagged silk weaver colonies, subterranean stepwells, and traditional kushti akhadas.
        </p>
      </div>

      {/* Artisan Highlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6 space-y-3 bg-white/90 border border-amber-500/20 shadow-sm">
          <div className="text-3xl">🧵</div>
          <h3 className="text-lg font-bold text-slate-900 font-serif">GI-Tagged Silk Looms</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            In <strong className="text-slate-900">Sarai Mohana</strong> and <strong className="text-slate-900">Pilikothi</strong>, master Muslim and Hindu
            families have operated wooden Jacquard pit-looms for 8 generations, weaving real gold zari
            threads into royal Kadwa brocades.
          </p>
          <Badge variant="gold">Geographical Indication</Badge>
        </GlassCard>

        <GlassCard className="p-6 space-y-3 bg-white/90 border border-amber-500/20 shadow-sm">
          <div className="text-3xl">🔔</div>
          <h3 className="text-lg font-bold text-slate-900 font-serif">Thatheri Bazaar Metal Crafts</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Follow the rhythmic rhythmic clinking of hammers through Chowk to watch hereditary metalsmiths
            shape gleaming brass puja bells, copper lotas, and temple lamps by hand.
          </p>
          <Badge variant="saffron">Centuries-Old Guild</Badge>
        </GlassCard>

        <GlassCard className="p-6 space-y-3 bg-white/90 border border-amber-500/20 shadow-sm">
          <div className="text-3xl">☀️</div>
          <h3 className="text-lg font-bold text-slate-900 font-serif">Lolark Kund Sun Stepwell</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Descend 50 steep stone steps into one of India’s most enigmatic subterranean stepwells
            predating the Mahabharata, dedicated to the Surya Aditya solar deities.
          </p>
          <Badge variant="river">Ancient Stepwell</Badge>
        </GlassCard>
      </div>

      {/* Places List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-black/10">
          <h2 className="text-2xl font-bold text-slate-900 font-serif">
            Verified Offbeat Locations & Heritage Galliyan
          </h2>
          <span className="text-xs text-slate-600 font-semibold">{hiddenPlaces.length} Secret Gems</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {hiddenPlaces.map((place) => (
            <PlaceCard key={place.id} place={place as unknown as PlaceCardData} />
          ))}
        </div>
      </div>
    </div>
  );
}

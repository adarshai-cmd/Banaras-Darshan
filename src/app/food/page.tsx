import React from "react";
import { prisma } from "@/lib/db";
import { Utensils, Sparkles, CheckCircle2, Coffee, Clock } from "lucide-react";
import { PlaceCard, PlaceCardData } from "@/components/cards/PlaceCard";
import { GlassCard, Badge } from "@/components/ui/GlassCard";

export const revalidate = 60;

export default async function FoodPage() {
  const foodPlaces = await prisma.place.findMany({
    where: { category: "FOOD" },
    orderBy: { rating: "desc" },
  });

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Food Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-amber-700 mb-1">
          <Utensils className="w-3.5 h-3.5" />
          <span>Banaras Culinary Heritage</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 font-serif">
          Food Discovery: The Taste of Kashi
        </h1>
        <p className="text-slate-600 text-sm sm:text-base font-normal leading-relaxed">
          From legendary bubbling Tamatar Chaat and morning Desi Ghee Kachori-Sabzi to hand-churned
          clay-pot fruit lassi, winter Malaiyo dew-foam, and GI-tagged Banarasi Paan.
        </p>
      </div>

      {/* Culinary Highlights Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-5 space-y-1 bg-white/90 border border-amber-500/20 shadow-sm">
          <span className="text-2xl">🍲</span>
          <h4 className="text-sm font-bold text-slate-900 font-serif">Tamatar Chaat</h4>
          <p className="text-xs text-slate-600">
            Slow-cooked mashed tomatoes with hing, cashews & sweet sugar syrup in a kullad.
          </p>
          <p className="text-[11px] text-amber-800 font-bold pt-1">
            Famous at: Kashi Chaat Bhandar
          </p>
        </GlassCard>

        <GlassCard className="p-5 space-y-1 bg-white/90 border border-amber-500/20 shadow-sm">
          <span className="text-2xl">🥟</span>
          <h4 className="text-sm font-bold text-slate-900 font-serif">Desi Ghee Kachori Sabzi</h4>
          <p className="text-xs text-slate-600">
            Crispy urad dal kachoris with spicy chane ki sabzi and hot saffron jalebi.
          </p>
          <p className="text-[11px] text-amber-800 font-bold pt-1">
            Famous at: Ram Bhandar (7:00 AM)
          </p>
        </GlassCard>

        <GlassCard className="p-5 space-y-1 bg-white/90 border border-amber-500/20 shadow-sm">
          <span className="text-2xl">🥛</span>
          <h4 className="text-sm font-bold text-slate-900 font-serif">Artisan Clay-Pot Lassi</h4>
          <p className="text-xs text-slate-600">
            Thick hand-whipped curd topped with thick rabdi, pomegranate, and dry fruits.
          </p>
          <p className="text-[11px] text-amber-800 font-bold pt-1">
            Famous at: Blue Lassi & Pahalwan
          </p>
        </GlassCard>

        <GlassCard className="p-5 space-y-1 bg-white/90 border border-amber-500/20 shadow-sm">
          <span className="text-2xl">🍃</span>
          <h4 className="text-sm font-bold text-slate-900 font-serif">GI-Tagged Banarasi Paan</h4>
          <p className="text-xs text-slate-600">
            Melting Magahi leaf with gulkand, rose water, and silver foil. Tobacco-free options.
          </p>
          <p className="text-[11px] text-amber-800 font-bold pt-1">
            Famous at: Keshav Tambool Bhandar
          </p>
        </GlassCard>
      </div>

      {/* Verified Food Listings */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-black/10">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 font-serif">
              Verified Famous Food Spots
            </h2>
            <p className="text-xs text-slate-600">
              Addresses, approximate budget, opening hours & signature dishes fact-checked
            </p>
          </div>
          <Badge variant="gold">100% Pure Veg Curations</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {foodPlaces.map((place) => (
            <PlaceCard key={place.id} place={place as unknown as PlaceCardData} />
          ))}
        </div>
      </div>
    </div>
  );
}

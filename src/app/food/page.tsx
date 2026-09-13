"use client";

import React, { useState, useEffect } from "react";
import { Utensils, Search, CheckCircle2, Coffee, Sparkles } from "lucide-react";
import { PlaceCard, PlaceCardData } from "@/components/cards/PlaceCard";
import { GlassCard, Badge } from "@/components/ui/GlassCard";
import { AuthGuard } from "@/components/auth/AuthGuard";

const FOOD_FILTERS = [
  { id: "ALL", label: "All Culinary Spots" },
  { id: "BREAKFAST", label: "Breakfast (Kachori-Jalebi)" },
  { id: "CHAAT", label: "Tamatar & Street Chaat" },
  { id: "LASSI", label: "Lassi & Thandai" },
  { id: "SWEETS", label: "Sweets & Malaiyo" },
  { id: "PAAN", label: "Banarasi Paan" },
];

export default function FoodPage() {
  const [places, setPlaces] = useState<PlaceCardData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    fetch("/api/places?category=FOOD")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPlaces(data.places);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredPlaces = places.filter((p) => {
    const text = `${p.name} ${p.tagline} ${p.popularDishes || ""} ${p.tags}`.toLowerCase();
    const matchesSearch = !searchQuery.trim() || text.includes(searchQuery.toLowerCase().trim());
    
    if (!matchesSearch) return false;
    if (activeFilter === "ALL") return true;
    if (activeFilter === "BREAKFAST") return text.includes("kachori") || text.includes("breakfast");
    if (activeFilter === "CHAAT") return text.includes("chaat") || text.includes("tamatar");
    if (activeFilter === "LASSI") return text.includes("lassi") || text.includes("thandai");
    if (activeFilter === "SWEETS") return text.includes("malaiyo") || text.includes("sweet");
    if (activeFilter === "PAAN") return text.includes("paan") || text.includes("tambool");
    return true;
  });

  return (
    <AuthGuard
      title="Banaras Culinary Heritage & Food Guide"
      description="Sign in or create an account to explore authentic street food shops, Tamatar Chaat stalls, Malaiyo makers, and famous Banarasi Paan spots."
    >
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Food Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-800 mb-1">
          <Utensils className="w-3.5 h-3.5" />
          <span>Banaras Culinary Heritage</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-950 font-serif">
          Food Discovery: The Taste of Kashi
        </h1>
        <p className="text-slate-700 text-sm sm:text-base font-normal leading-relaxed">
          From legendary bubbling Tamatar Chaat and morning Desi Ghee Kachori-Sabzi to hand-churned
          clay-pot fruit lassi, winter Malaiyo dew-foam, and GI-tagged Banarasi Paan.
        </p>
      </div>

      {/* Culinary Highlights Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-5 space-y-1 bg-white border border-slate-200 shadow-sm" hoverEffect={false}>
          <span className="text-2xl">🍲</span>
          <h4 className="text-sm font-bold text-slate-950 font-serif">Tamatar Chaat</h4>
          <p className="text-xs text-slate-600">
            Slow-cooked mashed tomatoes with hing, cashews & sweet sugar syrup in a kullad.
          </p>
          <p className="text-[11px] text-amber-800 font-bold pt-1">
            Famous at: Kashi Chaat Bhandar
          </p>
        </GlassCard>

        <GlassCard className="p-5 space-y-1 bg-white border border-slate-200 shadow-sm" hoverEffect={false}>
          <span className="text-2xl">🥟</span>
          <h4 className="text-sm font-bold text-slate-950 font-serif">Desi Ghee Kachori Sabzi</h4>
          <p className="text-xs text-slate-600">
            Crispy urad dal kachoris with spicy chane ki sabzi and hot saffron jalebi.
          </p>
          <p className="text-[11px] text-amber-800 font-bold pt-1">
            Famous at: Ram Bhandar (7:00 AM)
          </p>
        </GlassCard>

        <GlassCard className="p-5 space-y-1 bg-white border border-slate-200 shadow-sm" hoverEffect={false}>
          <span className="text-2xl">🥛</span>
          <h4 className="text-sm font-bold text-slate-950 font-serif">Artisan Clay-Pot Lassi</h4>
          <p className="text-xs text-slate-600">
            Thick hand-whipped curd topped with thick rabdi, pomegranate, and dry fruits.
          </p>
          <p className="text-[11px] text-amber-800 font-bold pt-1">
            Famous at: Blue Lassi & Pahalwan
          </p>
        </GlassCard>

        <GlassCard className="p-5 space-y-1 bg-white border border-slate-200 shadow-sm" hoverEffect={false}>
          <span className="text-2xl">🍃</span>
          <h4 className="text-sm font-bold text-slate-950 font-serif">GI-Tagged Banarasi Paan</h4>
          <p className="text-xs text-slate-600">
            Melting Magahi leaf with gulkand, rose water, and silver foil. Tobacco-free options.
          </p>
          <p className="text-[11px] text-amber-800 font-bold pt-1">
            Famous at: Keshav Tambool Bhandar
          </p>
        </GlassCard>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chaat, kachori, sweets..."
              className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-xs font-semibold text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>100% Pure Vegetarian Heritage Curation</span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {FOOD_FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                activeFilter === f.id
                  ? "bg-amber-500 text-slate-950 border-amber-600 shadow-sm"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Verified Food Listings */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-bold text-slate-950 font-serif">
              Verified Famous Food Spots
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Addresses, approximate budget, opening hours & signature dishes fact-checked
            </p>
          </div>
          <span className="text-xs font-bold text-slate-700 font-mono">
            {filteredPlaces.length} Verified Spots
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-72 rounded-2xl bg-slate-100 animate-pulse border border-slate-200" />
            ))}
          </div>
        ) : filteredPlaces.length === 0 ? (
          <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl p-8">
            <Utensils className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-slate-700 font-semibold text-sm">No food places match your search criteria.</p>
            <button
              onClick={() => {
                setActiveFilter("ALL");
                setSearchQuery("");
              }}
              className="mt-3 text-xs text-amber-800 font-bold hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPlaces.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        )}
      </div>
    </div>
    </AuthGuard>
  );
}

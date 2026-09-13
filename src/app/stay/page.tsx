"use client";

import React, { useState, useEffect } from "react";
import { BedDouble, MapPin, Search } from "lucide-react";
import { PlaceCard, PlaceCardData } from "@/components/cards/PlaceCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { AuthGuard } from "@/components/auth/AuthGuard";

const STAY_FILTERS = [
  { id: "ALL", label: "All Accommodations" },
  { id: "PALACE", label: "Heritage Palaces" },
  { id: "HOSTEL", label: "Backpacker Hostels" },
  { id: "GUESTHOUSE", label: "Ghat Guesthouses" },
];

export default function StayPage() {
  const [stays, setStays] = useState<PlaceCardData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    fetch("/api/places?category=HOTEL")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStays(data.places);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredStays = stays.filter((p) => {
    const text = `${p.name} ${p.tagline} ${p.subCategory || ""} ${p.tags}`.toLowerCase();
    const matchesSearch = !searchQuery.trim() || text.includes(searchQuery.toLowerCase().trim());
    if (!matchesSearch) return false;

    if (activeFilter === "ALL") return true;
    if (activeFilter === "PALACE") return text.includes("palace") || text.includes("heritage");
    if (activeFilter === "HOSTEL") return text.includes("hostel") || text.includes("zostel");
    if (activeFilter === "GUESTHOUSE") return text.includes("guest") || text.includes("ghat view");
    return true;
  });

  return (
    <AuthGuard
      title="Verified Heritage Stays & Hostels"
      description="Sign in or create an account to discover verified riverside palaces, authentic ghat guesthouses, and backpacker hostels in Varanasi."
    >
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-800 mb-1">
          <BedDouble className="w-3.5 h-3.5" />
          <span>Varanasi Hospitality</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-950 font-serif">
          Hotels, Ghat Stays & Hostels
        </h1>
        <p className="text-slate-700 text-sm sm:text-base font-normal leading-relaxed">
          From historic 18th-century sandstone palaces with private boat check-in to vibrant backpacker
          hostels and peaceful river-view guesthouses overlooking the morning boat bells.
        </p>
      </div>

      {/* Practical Location Tip Banner */}
      <GlassCard className="p-6 text-xs text-slate-800 space-y-2 bg-white border border-slate-200 shadow-sm" hoverEffect={false}>
        <div className="flex items-center gap-2 text-amber-900 font-bold uppercase tracking-wider">
          <MapPin className="w-4 h-4 text-amber-700" />
          <span>Varanasi Accommodation Logistics Guide</span>
        </div>
        <p className="leading-relaxed">
          <strong className="text-slate-950">Staying directly on the Ghats (e.g. Meer Ghat, Darbhanga Ghat):</strong> Unbeatable sunrise views and immediate boat access. However, motorized vehicles (cabs, autos) cannot enter the old stone lanes beyond Godowlia crossing or Maidagin. Expect a 5–10 minute walk through pedestrian stone alleys.
        </p>
        <p className="leading-relaxed text-slate-600">
          <strong className="text-slate-950">Staying in Cantonment (Cantt Station area):</strong> Direct cab access right up to the porch, spacious hotel grounds, but requires a 15–20 minute auto-rickshaw ride to reach the ghats for sunrise.
        </p>
      </GlassCard>

      {/* Controls Bar */}
      <div className="space-y-4 pt-2 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by hotel name, area..."
              className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-xs font-semibold text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span>* Prices vary seasonally (Dev Deepawali & Shivratri peak). Confirm live rates.</span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {STAY_FILTERS.map((f) => (
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

      {/* Stays Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-950 font-serif">
            Verified Stays by Atmosphere & Category
          </h2>
          <span className="text-xs text-slate-700 font-bold font-mono">
            {filteredStays.length} Fact-Checked Stays
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-72 rounded-2xl bg-slate-100 animate-pulse border border-slate-200" />
            ))}
          </div>
        ) : filteredStays.length === 0 ? (
          <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl p-8">
            <p className="text-slate-700 font-semibold text-sm">No accommodations match your selection.</p>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStays.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        )}
      </div>
    </div>
    </AuthGuard>
  );
}

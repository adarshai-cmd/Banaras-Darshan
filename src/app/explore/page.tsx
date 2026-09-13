"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Compass,
  Search,
  CheckCircle2,
  Sparkles,
  SquareParking,
} from "lucide-react";
import { PlaceCard, PlaceCardData } from "@/components/cards/PlaceCard";
import { GlassCard, Button } from "@/components/ui/GlassCard";
import { AuthGuard } from "@/components/auth/AuthGuard";

function ExploreContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "ALL";
  const initialQuery = searchParams.get("q") || "";

  const [places, setPlaces] = useState<PlaceCardData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [category, setCategory] = useState<string>(initialCategory);
  const [budgetTier, setBudgetTier] = useState<string>("ALL");
  const [onlyVeg, setOnlyVeg] = useState<boolean>(false);
  const [onlyHidden, setOnlyHidden] = useState<boolean>(false);

  const categories = [
    { id: "ALL", label: "All Destinations" },
    { id: "TEMPLE", label: "Temples" },
    { id: "GHAT", label: "Ghats" },
    { id: "FOOD", label: "Food & Sweets" },
    { id: "HOTEL", label: "Hotels & Stays" },
    { id: "STREET", label: "Ancient Lanes" },
    { id: "HIDDEN", label: "Hidden Gems" },
  ];

  const fetchFilteredPlaces = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category !== "ALL") params.append("category", category);
      if (budgetTier !== "ALL") params.append("budget", budgetTier);
      if (searchQuery.trim()) params.append("q", searchQuery.trim());
      if (onlyVeg) params.append("isVeg", "true");
      if (onlyHidden) params.append("isHidden", "true");

      const res = await fetch(`/api/places?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setPlaces(data.places);
      }
    } catch (err) {
      console.error("Error fetching places:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    const params = new URLSearchParams();
    if (category !== "ALL") params.append("category", category);
    if (budgetTier !== "ALL") params.append("budget", budgetTier);
    if (searchQuery.trim()) params.append("q", searchQuery.trim());
    if (onlyVeg) params.append("isVeg", "true");
    if (onlyHidden) params.append("isHidden", "true");

    fetch(`/api/places?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (!ignore && data.success) {
          setPlaces(data.places);
        }
      })
      .catch((err) => {
        console.error("Error fetching places:", err);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, budgetTier, onlyVeg, onlyHidden]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFilteredPlaces();
  };

  return (
    <div className="space-y-8">
      {/* Global Search & Filter Controls */}
      <GlassCard className="p-6 space-y-4" hoverEffect={false}>
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, area (e.g. Assi, Godowlia, Chowk), dish, or keyword..."
              className="w-full rounded-xl pl-10 pr-4 py-2.5 text-sm bg-[#FAF8F5] border border-amber-500/30 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
          </div>
          <Button type="submit" variant="gold" size="md" className="px-5 shadow-sm">
            Search
          </Button>
        </form>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                category === cat.id
                  ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white border-amber-600 shadow-md"
                  : "bg-white text-slate-700 border-amber-500/20 hover:bg-amber-50 hover:text-amber-800 shadow-sm"
              }`}
            >
              {cat.label}
            </button>
          ))}
          <Link
            href="/parking"
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border border-sky-500/40 bg-sky-50 text-sky-900 hover:bg-sky-100 shadow-sm flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <SquareParking className="w-3.5 h-3.5 text-sky-600" />
            <span>Parking Stands (4) 🅿️</span>
          </Link>
        </div>

        {/* Secondary Filters Bar */}
        <div className="pt-3 border-t border-black/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-slate-600 font-semibold">Budget:</span>
            {["ALL", "FREE", "BUDGET", "MID_RANGE", "LUXURY"].map((b) => (
              <button
                key={b}
                onClick={() => setBudgetTier(b)}
                className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                  budgetTier === b
                    ? "bg-sky-100 text-sky-900 border-sky-400 font-bold shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:text-slate-900 shadow-sm"
                }`}
              >
                {b === "ALL" ? "Any Budget" : b.replace("_", " ")}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
              <input
                type="checkbox"
                checked={onlyVeg}
                onChange={(e) => setOnlyVeg(e.target.checked)}
                className="rounded border-amber-400 text-amber-600 focus:ring-0"
              />
              <span>Pure Veg Only</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
              <input
                type="checkbox"
                checked={onlyHidden}
                onChange={(e) => setOnlyHidden(e.target.checked)}
                className="rounded border-amber-400 text-amber-600 focus:ring-0"
              />
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-600" />
                Hidden Gems
              </span>
            </label>
          </div>
        </div>
      </GlassCard>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-600 px-1 font-medium">
        <span>
          Showing <strong className="text-slate-900 font-bold">{places.length}</strong> verified locations in Varanasi
        </span>
        <span className="text-emerald-700 font-semibold flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Live Verified Records
        </span>
      </div>

      {/* Places Grid */}
      {loading ? (
        <div className="p-16 text-center text-slate-500">
          <div className="w-8 h-8 mx-auto mb-3 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p>Filtering Banaras database...</p>
        </div>
      ) : places.length === 0 ? (
        <GlassCard className="p-12 text-center space-y-3 bg-white border border-amber-500/20 shadow-sm" hoverEffect={false}>
          <Compass className="w-12 h-12 mx-auto text-slate-400" />
          <h3 className="text-lg font-bold text-slate-900">No locations matched your criteria</h3>
          <p className="text-xs text-slate-600 max-w-sm mx-auto">
            Try resetting the budget or search keywords to view more verified destinations in Kashi.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setCategory("ALL");
              setBudgetTier("ALL");
              setSearchQuery("");
              setOnlyVeg(false);
              setOnlyHidden(false);
            }}
          >
            Reset Filters
          </Button>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {places.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ExplorePage() {
  return (
    <AuthGuard
      title="Explore Banaras Directory"
      description="Sign in or create an account to browse our complete curated directory of temples, 84 ghats, iconic street food, and hidden galliyan."
    >
      <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-amber-700 mb-1">
            <Compass className="w-3.5 h-3.5" />
            <span>Factual Exploration</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 font-serif">
            Explore Banaras
          </h1>
          <p className="text-slate-600 text-sm font-normal leading-relaxed">
            Filter through sacred shrines, ghats, centuries-old food shops, riverside stays,
            and hidden lanes across Varanasi.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="p-16 text-center text-slate-400">
              <div className="w-8 h-8 mx-auto mb-3 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
              Loading explorer...
            </div>
          }
        >
          <ExploreContent />
        </Suspense>
      </div>
    </AuthGuard>
  );
}

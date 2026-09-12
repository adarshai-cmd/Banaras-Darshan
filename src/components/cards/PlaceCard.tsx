"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Star,
  MapPin,
  Clock,
  CheckCircle,
  Bookmark,
  Share2,
  Navigation,
  Sparkles,
  Eye,
} from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import { Badge } from "@/components/ui/GlassCard";
import { PlaceDetailsModal } from "@/components/modals/PlaceDetailsModal";

export interface PlaceCardData {
  id: string;
  slug: string;
  name: string;
  hindiName?: string | null;
  category: string;
  subCategory?: string | null;
  tagline: string;
  description?: string;
  history?: string | null;
  area: string;
  address?: string;
  latitude: number;
  longitude: number;
  image: string;
  rating: number;
  reviewCount: number;
  approxBudget: string;
  budgetTier: string;
  bestTimeToVisit?: string | null;
  openingHours?: string | null;
  visitingTips?: string | null;
  safetyNotes?: string | null;
  isVerified: boolean;
  isHiddenGem?: boolean;
  distanceKm?: number;
  popularDishes?: string | null;
  isPureVeg?: boolean | null;
  amenities?: string | null;
  nearestHub?: string | null;
}

export function PlaceCard({
  place,
  onSaveToggle,
  isSaved = false,
}: {
  place: PlaceCardData;
  onSaveToggle?: (id: string) => void;
  isSaved?: boolean;
}) {
  const [saved, setSaved] = useState(isSaved);
  const [copied, setCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSaved(!saved);
    if (onSaveToggle) {
      onSaveToggle(place.id);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `${window.location.origin}/places/${place.slug}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "TEMPLE":
        return "saffron";
      case "GHAT":
        return "river";
      case "FOOD":
        return "gold";
      case "HOTEL":
        return "default";
      case "HIDDEN":
        return "saffron";
      default:
        return "default";
    }
  };

  return (
    <>
      <div className="group rounded-2xl overflow-hidden border border-amber-500/15 bg-white/80 dark:bg-[#0c1630]/85 backdrop-blur-xl shadow-lg transition-all duration-300 hover:border-amber-500/40 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col h-full text-slate-800 dark:text-slate-100">
        {/* Visual Header */}
        <div
          onClick={() => setIsModalOpen(true)}
          className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-900 cursor-pointer"
        >
          <SafeImage
            src={place.image}
            alt={place.name}
            category={place.category}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            <Badge variant={getCategoryColor(place.category)}>
              {place.subCategory || place.category}
            </Badge>
            {place.isHiddenGem && (
              <Badge variant="gold">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>Hidden Gem</span>
              </Badge>
            )}
            {place.isPureVeg && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                🌱 Pure Veg
              </span>
            )}
          </div>

          {/* Top Right Action buttons */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
            <button
              onClick={handleShare}
              className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md border border-white/15 flex items-center justify-center text-slate-200 hover:text-white hover:bg-black/70 transition-all"
              title="Share place"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleSave}
              className={`w-8 h-8 rounded-full backdrop-blur-md border flex items-center justify-center transition-all ${
                saved
                  ? "bg-amber-500 border-amber-400 text-slate-950 shadow-md"
                  : "bg-black/50 border-white/15 text-slate-200 hover:text-white"
              }`}
              title="Save to My Trip"
            >
              <Bookmark className={`w-3.5 h-3.5 ${saved ? "fill-slate-950" : ""}`} />
            </button>
          </div>

          {/* Rating and Reviews overlay */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs z-10">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-white">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-semibold">{place.rating.toFixed(1)}</span>
              <span className="text-slate-300 text-[10px]">({place.reviewCount})</span>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-amber-300 font-medium text-[11px]">
              {place.approxBudget}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div>
            <div
              onClick={() => setIsModalOpen(true)}
              className="flex items-start justify-between gap-2 cursor-pointer group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors"
            >
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-serif leading-snug">
                  {place.name}
                </h3>
                {place.hindiName && (
                  <p className="text-xs text-amber-700 dark:text-amber-400 font-serif font-medium mt-0.5">
                    {place.hindiName}
                  </p>
                )}
              </div>
              {place.isVerified && (
                <span
                  className="shrink-0 flex items-center text-emerald-600 dark:text-emerald-400 mt-1"
                  title="Verified by Banaras Darshan team"
                >
                  <CheckCircle className="w-4 h-4" />
                </span>
              )}
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed font-light">
              {place.tagline}
            </p>

            {/* Area & Distance */}
            <div className="mt-3 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                <span className="truncate">{place.area}</span>
              </span>
              {place.distanceKm !== undefined && (
                <span className="px-2 py-0.5 rounded bg-amber-500/10 text-[11px] font-mono text-amber-700 dark:text-amber-300 border border-amber-500/20">
                  {place.distanceKm < 1
                    ? `${Math.round(place.distanceKm * 1000)} m`
                    : `${place.distanceKm.toFixed(1)} km`}
                </span>
              )}
            </div>

            {/* Best Time or Timing */}
            {place.bestTimeToVisit && (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-600 dark:text-amber-300/90">
                <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                <span className="truncate">{place.bestTimeToVisit}</span>
              </div>
            )}

            {/* Popular dishes for food */}
            {place.popularDishes && (
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 truncate">
                <span className="text-amber-700 dark:text-amber-400 font-semibold">Must-try:</span>{" "}
                {place.popularDishes}
              </p>
            )}
          </div>

          {/* Card Footer Actions */}
          <div className="pt-3 border-t border-black/10 dark:border-white/10 flex items-center justify-between gap-2">
            <Link
              href={`/map?lat=${place.latitude}&lng=${place.longitude}&place=${encodeURIComponent(
                place.name
              )}`}
              className="flex items-center gap-1 text-xs text-sky-600 dark:text-sky-400 hover:underline font-medium"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Map</span>
            </Link>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1 text-xs text-amber-700 dark:text-amber-400 hover:text-amber-600 dark:hover:text-amber-300 font-bold px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all cursor-pointer shadow-sm"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Details</span>
            </button>
          </div>
        </div>

        {copied && (
          <div className="absolute inset-x-0 bottom-2 text-center text-xs text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/90 py-1 border border-emerald-500/40 rounded-lg mx-4 z-20 shadow-md">
            Link copied to clipboard!
          </div>
        )}
      </div>

      {/* Place Details Modal Popup */}
      <PlaceDetailsModal
        place={place}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaveToggle={onSaveToggle}
        isSaved={saved}
      />
    </>
  );
}

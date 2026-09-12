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
  rating?: number | null;
  reviewCount?: number | null;
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
  sourceName?: string | null;
  tags?: string | null;
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
    if (typeof window !== "undefined" && navigator.clipboard) {
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
      <div className="group rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-amber-500/50 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5 flex flex-col h-full text-slate-900">
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/25" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            <Badge variant={getCategoryColor(place.category)}>
              {place.subCategory || place.category}
            </Badge>
            {place.isHiddenGem && (
              <Badge variant="gold">
                <Sparkles className="w-3 h-3 text-amber-700" />
                <span>Hidden Gem</span>
              </Badge>
            )}
            {place.isPureVeg && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-700 text-white border border-emerald-500 shadow-sm">
                🌱 Pure Veg
              </span>
            )}
          </div>

          {/* Top Right Action buttons */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
            <button
              onClick={handleShare}
              className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/80 transition-all cursor-pointer shadow-sm"
              title="Share place"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleSave}
              className={`w-8 h-8 rounded-full backdrop-blur-md border flex items-center justify-center transition-all cursor-pointer shadow-sm ${
                saved
                  ? "bg-amber-500 border-amber-400 text-slate-950 shadow-md"
                  : "bg-black/60 border-white/20 text-white hover:bg-black/80"
              }`}
              title="Save to My Trip"
            >
              <Bookmark className={`w-3.5 h-3.5 ${saved ? "fill-slate-950" : ""}`} />
            </button>
          </div>

          {/* Rating and Reviews overlay */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs z-10">
            {place.rating !== null && place.rating !== undefined ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-white/20 text-white font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                <span>{place.rating.toFixed(1)}</span>
                {place.reviewCount ? (
                  <span className="text-slate-300 text-[10px] font-normal">
                    ({place.reviewCount.toLocaleString()})
                  </span>
                ) : null}
              </div>
            ) : (
              <div className="px-2 py-1 rounded-lg bg-black/75 backdrop-blur-md text-slate-200 text-[11px] font-medium border border-white/10">
                Rating unavailable
              </div>
            )}
            <span className="px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-white/20 text-amber-300 font-bold text-[11px]">
              {place.approxBudget}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4 bg-white">
          <div>
            <div
              onClick={() => setIsModalOpen(true)}
              className="flex items-start justify-between gap-2 cursor-pointer group-hover:text-amber-700 transition-colors"
            >
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-serif leading-snug">
                  {place.name}
                </h3>
                {place.hindiName && (
                  <p className="text-xs text-amber-800 font-serif font-semibold mt-0.5">
                    {place.hindiName}
                  </p>
                )}
              </div>
              {place.isVerified && (
                <span
                  className="shrink-0 flex items-center text-emerald-700 mt-1"
                  title={place.sourceName ? `Verified by ${place.sourceName}` : "Verified by Banaras Darshan"}
                >
                  <CheckCircle className="w-4 h-4" />
                </span>
              )}
            </div>

            <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed font-normal">
              {place.tagline}
            </p>

            {/* Area & Distance */}
            <div className="mt-3 flex items-center gap-3 text-xs text-slate-600">
              <span className="flex items-center gap-1 text-slate-800 font-medium">
                <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="truncate">{place.area}</span>
              </span>
              {place.distanceKm !== undefined && (
                <span className="px-2 py-0.5 rounded bg-amber-50 text-[11px] font-mono text-amber-900 border border-amber-200 font-bold">
                  {place.distanceKm < 1
                    ? `${Math.round(place.distanceKm * 1000)} m`
                    : `${place.distanceKm.toFixed(1)} km`}
                </span>
              )}
            </div>

            {/* Best Time or Timing */}
            {place.bestTimeToVisit && (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-600">
                <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="truncate font-medium">{place.bestTimeToVisit}</span>
              </div>
            )}

            {/* Popular dishes for food */}
            {place.popularDishes && (
              <p className="mt-2 text-xs text-slate-700 truncate">
                <span className="text-amber-800 font-bold">Must-try:</span>{" "}
                {place.popularDishes}
              </p>
            )}
          </div>

          {/* Card Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            <Link
              href={`/map?lat=${place.latitude}&lng=${place.longitude}&place=${encodeURIComponent(
                place.name
              )}`}
              className="flex items-center gap-1 text-xs text-blue-700 hover:text-blue-900 font-bold hover:underline"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>View on Map</span>
            </Link>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1 text-xs text-slate-900 font-bold px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-300 transition-all cursor-pointer shadow-sm"
            >
              <Eye className="w-3.5 h-3.5 text-amber-700" />
              <span>Details</span>
            </button>
          </div>
        </div>

        {copied && (
          <div className="absolute inset-x-0 bottom-2 text-center text-xs font-bold text-emerald-900 bg-emerald-50 py-1.5 border border-emerald-300 rounded-lg mx-4 z-20 shadow-md">
            ✓ Link copied to clipboard!
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

"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  X,
  MapPin,
  Clock,
  Star,
  CheckCircle2,
  Bookmark,
  Share2,
  Navigation,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Compass,
  Utensils,
  BedDouble,
  Info,
  CalendarCheck,
} from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import { Badge, Button } from "@/components/ui/GlassCard";
import { PlaceCardData } from "@/components/cards/PlaceCard";

export function PlaceDetailsModal({
  place,
  isOpen,
  onClose,
  onSaveToggle,
  isSaved = false,
}: {
  place: PlaceCardData | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveToggle?: (id: string) => void;
  isSaved?: boolean;
}) {
  const [saved, setSaved] = useState(isSaved);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !place) return null;

  const handleSave = () => {
    setSaved(!saved);
    if (onSaveToggle && place) {
      onSaveToggle(place.id);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `${window.location.origin}/places/${place.slug}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/75 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-3xl bg-[#FAF8F5] dark:bg-[#0B132B] border border-amber-500/20 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col my-auto transition-all text-slate-800 dark:text-slate-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/80 dark:bg-black/60 backdrop-blur-md border border-black/10 dark:border-white/20 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:scale-105 transition-all shadow-md"
          aria-label="Close details modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Visual Header */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden shrink-0 bg-slate-900">
          <SafeImage
            src={place.image}
            alt={place.name}
            category={place.category}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5] dark:from-[#0B132B] via-black/30 to-transparent" />

          {/* Badges Overlay */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
            <Badge variant={getCategoryColor(place.category)}>
              {place.subCategory || place.category}
            </Badge>
            {place.isHiddenGem && (
              <Badge variant="gold">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>Hidden Gem of Kashi</span>
              </Badge>
            )}
            {place.isPureVeg && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-800/80 text-emerald-100 border border-emerald-400/40">
                🌱 100% Pure Veg
              </span>
            )}
          </div>

          {/* Bottom Title on Hero */}
          <div className="absolute bottom-4 left-4 right-4 z-10">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-white/90 dark:bg-black/70 backdrop-blur-md text-xs font-semibold text-amber-700 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                {place.rating.toFixed(1)} ({place.reviewCount} reviews)
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/90 dark:bg-black/70 backdrop-blur-md text-xs font-semibold text-slate-800 dark:text-slate-200 border border-black/10 dark:border-white/10">
                {place.approxBudget}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white font-serif mt-2 drop-shadow-sm">
              {place.name}
            </h2>
            {place.hindiName && (
              <p className="text-sm font-medium text-amber-700 dark:text-amber-400 font-serif">
                {place.hindiName}
              </p>
            )}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-sm leading-relaxed">
          {/* Tagline & Description */}
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white font-serif mb-1">
              About this Sacred Destination
            </h4>
            <p className="text-slate-700 dark:text-slate-200 text-sm font-medium mb-3">
              {place.tagline}
            </p>
            {place.description && (
              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                {place.description}
              </p>
            )}
          </div>

          {/* Location & Visiting Timings Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-amber-500/5 dark:bg-white/5 border border-amber-500/20 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                <MapPin className="w-4 h-4 text-amber-600" />
                <span>Location & Area</span>
              </div>
              <p className="text-xs text-slate-800 dark:text-slate-200 font-medium">
                {place.address || place.area}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Area: <strong className="text-slate-700 dark:text-slate-300">{place.area}</strong>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/5 dark:bg-white/5 border border-amber-500/20 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Best Time to Visit</span>
              </div>
              <p className="text-xs text-slate-800 dark:text-slate-200 font-medium">
                {place.bestTimeToVisit || "Early morning sunrise or evening dusk"}
              </p>
              {place.openingHours && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Hours: {place.openingHours}
                </p>
              )}
            </div>
          </div>

          {/* Food Specialty if available */}
          {place.popularDishes && (
            <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-orange-700 dark:text-orange-400 uppercase tracking-wider">
                <Utensils className="w-4 h-4 text-orange-600" />
                <span>Must-Try Signature Dishes</span>
              </div>
              <p className="text-xs text-slate-800 dark:text-slate-200 font-medium">
                {place.popularDishes}
              </p>
            </div>
          )}

          {/* Hotel Amenities if available */}
          {place.amenities && (
            <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider">
                <BedDouble className="w-4 h-4 text-purple-600" />
                <span>Property Amenities</span>
              </div>
              <p className="text-xs text-slate-800 dark:text-slate-200 font-medium">
                {place.amenities}
              </p>
            </div>
          )}

          {/* Important Visiting Tips & Etiquette */}
          {place.visitingTips && (
            <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-700 dark:text-sky-400 uppercase tracking-wider">
                <Info className="w-4 h-4 text-blue-600" />
                <span>Local Traveler Tip</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {place.visitingTips}
              </p>
            </div>
          )}

          {/* Safety & Protocol notes */}
          {place.safetyNotes && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Safety & Protocol Guidelines</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {place.safetyNotes}
              </p>
            </div>
          )}

          {/* Verification Badge */}
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
            <span className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              Factually verified by Banaras Darshan heritage research team.
            </span>
            <Link
              href={`/places/${place.slug}`}
              className="text-amber-700 dark:text-amber-400 font-semibold hover:underline"
            >
              Permanent Link ↗
            </Link>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 sm:p-5 border-t border-black/10 dark:border-white/10 bg-slate-100/80 dark:bg-black/40 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                saved
                  ? "bg-amber-500 border-amber-600 text-slate-950 shadow-md"
                  : "bg-white dark:bg-white/10 border-slate-300 dark:border-white/20 text-slate-700 dark:text-slate-200 hover:text-amber-600"
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${saved ? "fill-slate-950" : ""}`} />
              <span>{saved ? "Saved to My Trip" : "Save Place"}</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-white/10 border border-slate-300 dark:border-white/20 text-slate-700 dark:text-slate-200 hover:text-amber-600 transition-all"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? "Copied Link!" : "Share"}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/map?lat=${place.latitude}&lng=${place.longitude}&place=${encodeURIComponent(
                place.name
              )}`}
              onClick={onClose}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white shadow-md transition-all"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Directions on Map</span>
            </Link>

            <Link
              href="/plan"
              onClick={onClose}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold shadow-md transition-all"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Add to Itinerary</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

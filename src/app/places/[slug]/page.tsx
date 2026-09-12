import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import {
  MapPin,
  Clock,
  Star,
  CheckCircle2,
  Navigation,
  Sparkles,
  Share2,
  Bookmark,
  CalendarCheck,
  Utensils,
  BedDouble,
  Info,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import { Badge, Button, GlassCard } from "@/components/ui/GlassCard";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PlaceDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const place = await prisma.place.findUnique({
    where: { slug },
  });

  if (!place) {
    notFound();
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* Back button */}
      <Link
        href="/explore"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Explore Directory</span>
      </Link>

      {/* Hero Visual Card */}
      <div className="relative rounded-3xl overflow-hidden border border-amber-500/20 shadow-2xl h-80 sm:h-96 w-full bg-slate-900">
        <SafeImage
          src={place.image}
          alt={place.name}
          category={place.category}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
          <Badge variant="gold">{place.subCategory || place.category}</Badge>
          {place.isHiddenGem && (
            <Badge variant="saffron">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Hidden Gem</span>
            </Badge>
          )}
          {place.isPureVeg && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-800/80 text-emerald-100 border border-emerald-400/40">
              🌱 100% Pure Veg
            </span>
          )}
        </div>

        {/* Bottom Hero Info */}
        <div className="absolute bottom-6 left-6 right-6 z-10 space-y-2">
          <div className="flex items-center gap-2">
            {place.rating ? (
              <span className="px-3 py-1 rounded-lg bg-black/70 backdrop-blur-md text-xs font-semibold text-amber-400 border border-amber-500/30 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {place.rating.toFixed(1)} {place.reviewCount ? `(${place.reviewCount} reviews)` : ""}
              </span>
            ) : (
              <span className="px-3 py-1 rounded-lg bg-black/70 backdrop-blur-md text-xs font-semibold text-amber-300 border border-amber-500/30 flex items-center gap-1">
                ⭐ Rating unavailable
              </span>
            )}
            <span className="px-3 py-1 rounded-lg bg-black/70 backdrop-blur-md text-xs font-semibold text-white border border-white/10">
              {place.approxBudget}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white font-serif">
            {place.name}
          </h1>
          {place.hindiName && (
            <p className="text-base text-amber-300 font-serif font-medium">
              {place.hindiName}
            </p>
          )}
        </div>
      </div>

      {/* Main Details Body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Details & Description */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="p-6 sm:p-8 space-y-4" hoverEffect={false}>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-serif">
              Overview & Cultural Significance
            </h2>
            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
              {place.tagline}
            </p>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {place.description}
            </p>

            {place.history && (
              <div className="pt-4 border-t border-black/10 dark:border-white/10 space-y-1.5">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white font-serif">
                  Historical & Skanda Purana Context
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {place.history}
                </p>
              </div>
            )}
          </GlassCard>

          {/* Specialty or Amenities */}
          {place.popularDishes && (
            <GlassCard className="p-6 space-y-2 border-orange-500/30" hoverEffect={false}>
              <div className="flex items-center gap-2 text-xs font-bold text-orange-700 dark:text-orange-400 uppercase tracking-wider">
                <Utensils className="w-4 h-4 text-orange-600" />
                <span>Must-Try Signature Dishes</span>
              </div>
              <p className="text-sm text-slate-800 dark:text-slate-200 font-medium">
                {place.popularDishes}
              </p>
            </GlassCard>
          )}

          {place.amenities && (
            <GlassCard className="p-6 space-y-2 border-purple-500/30" hoverEffect={false}>
              <div className="flex items-center gap-2 text-xs font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider">
                <BedDouble className="w-4 h-4 text-purple-600" />
                <span>Property Amenities</span>
              </div>
              <p className="text-sm text-slate-800 dark:text-slate-200 font-medium">
                {place.amenities}
              </p>
            </GlassCard>
          )}

          {/* Practical Tips */}
          {place.visitingTips && (
            <div className="p-5 rounded-2xl bg-blue-500/10 border border-blue-500/20 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-700 dark:text-sky-400 uppercase tracking-wider">
                <Info className="w-4 h-4 text-blue-600" />
                <span>Local Traveler Tip</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {place.visitingTips}
              </p>
            </div>
          )}

          {place.safetyNotes && (
            <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Safety & Etiquette Protocols</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {place.safetyNotes}
              </p>
            </div>
          )}
        </div>

        {/* Right 1 Col: Quick Info & Actions */}
        <div className="space-y-6">
          <GlassCard className="p-6 space-y-4" hoverEffect={false}>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-serif">
              Visiting Details
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Address:</p>
                  <p className="text-slate-600 dark:text-slate-300">{place.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Best Time:</p>
                  <p className="text-slate-600 dark:text-slate-300">{place.bestTimeToVisit || "Morning / Evening"}</p>
                </div>
              </div>

              {place.openingHours && (
                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Hours:</p>
                    <p className="text-slate-600 dark:text-slate-300">{place.openingHours}</p>
                  </div>
                </div>
              )}

              {place.nearestHub && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-800 dark:text-amber-300">
                  <strong>Transit Hub:</strong> {place.nearestHub}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-black/10 dark:border-white/10 space-y-2">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white text-xs font-semibold shadow-md transition-all"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Get Google Directions ↗</span>
              </a>

              <Link
                href={`/map?lat=${place.latitude}&lng=${place.longitude}&place=${encodeURIComponent(
                  place.name
                )}`}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white dark:bg-white/10 border border-slate-300 dark:border-white/20 text-slate-800 dark:text-white text-xs font-semibold hover:bg-slate-50 transition-all"
              >
                <span>View on Banaras Interactive Map</span>
              </Link>

              <Link
                href="/plan"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 text-xs font-bold shadow-md transition-all"
              >
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>Add to Trip Planner</span>
              </Link>
            </div>
          </GlassCard>

          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Factually verified in the official Banaras Darshan heritage index.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

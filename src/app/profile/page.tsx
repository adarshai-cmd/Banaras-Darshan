import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { User, Bookmark, Award, CalendarCheck, MapPin, Compass, ArrowRight, Star } from "lucide-react";
import { GlassCard, Button, Badge } from "@/components/ui/GlassCard";
import { PlaceCard, PlaceCardData } from "@/components/cards/PlaceCard";

export const revalidate = 60;

export default async function ProfilePage() {
  // Fetch default traveler demo profile and saved places
  const user = await prisma.user.findFirst({
    where: { role: "USER" },
    include: {
      trips: true,
    },
  });

  const featuredPlaces = await prisma.place.findMany({
    where: { isFeatured: true },
    take: 3,
  });

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-10">
      {/* Profile Header Card */}
      <GlassCard className="p-6 sm:p-8" hoverEffect={false}>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-amber-400/50 shadow-xl bg-slate-800 shrink-0">
            <img
              src={user?.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80"}
              alt="User profile"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif">
                  {user?.name || "Ananya Sharma"}
                </h1>
                <p className="text-xs text-amber-800 font-mono font-medium mt-0.5">
                  {user?.email || "ananya.travels@gmail.com"}
                </p>
              </div>
              <Badge variant="gold" className="self-center sm:self-auto text-xs px-3 py-1">
                🏆 {user?.badge || "Helpful Traveler"}
              </Badge>
            </div>

            <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
              {user?.bio || "Solo backpacker and cultural heritage photographer exploring the sacred river corridors and ancient street food of Kashi."}
            </p>

            {/* Badges & Reputation Bar */}
            <div className="pt-3 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs">
              <div className="px-3 py-1 rounded-xl bg-white border border-amber-500/20 text-slate-700 shadow-sm">
                <span className="text-amber-700 font-bold font-mono mr-1">
                  {user?.reputation || 180}
                </span>{" "}
                Reputation Points
              </div>
              <div className="px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 font-semibold shadow-sm">
                ✓ 14 Verified Tips Given
              </div>
              <div className="px-3 py-1 rounded-xl bg-sky-50 border border-sky-300 text-sky-800 font-semibold shadow-sm">
                🧭 2 Custom Trips Saved
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Saved Itinerary Showcase */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900 font-serif flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-amber-600" />
            <span>My Saved Itineraries</span>
          </h2>
          <Link href="/plan">
            <Button variant="gold" size="sm" className="text-xs">
              + Generate New Itinerary
            </Button>
          </Link>
        </div>

        <GlassCard className="p-6 space-y-3 bg-white/90 border border-amber-500/20 shadow-sm" hoverEffect={false}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/10 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-serif">
                Classic 3-Day Heritage & Soul of Kashi
              </h3>
              <p className="text-xs text-slate-500">
                Duration: 3 Days • Style: Spiritual + Food + Heritage • Group: Solo
              </p>
            </div>
            <Link href="/plan">
              <Button variant="outline" size="sm" className="text-xs">
                View Timeline Details →
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-500/15">
              <p className="text-amber-800 font-bold font-serif">Day 1: Sacred Rivers</p>
              <p className="text-slate-600 text-[11px] mt-1">Subah-e-Banaras, Ram Bhandar Kachori, Vishwanath Corridor, Evening Aarti</p>
            </div>
            <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-500/15">
              <p className="text-amber-800 font-bold font-serif">Day 2: Fortresses & Looms</p>
              <p className="text-slate-600 text-[11px] mt-1">Chet Singh Fort boat, Sankat Mochan, Sarai Mohana Silk Weavers, Paan</p>
            </div>
            <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-500/15">
              <p className="text-amber-800 font-bold font-serif">Day 3: Hidden Subterranean</p>
              <p className="text-slate-600 text-[11px] mt-1">Malaiyo tasting, Kaal Bhairav blessing, Vishwanath Gali, Manikarnika</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Bookmarked Places */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900 font-serif flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-600" />
            <span>Saved Sacred Places & Food Spots</span>
          </h2>
          <Link href="/explore" className="text-xs text-amber-700 hover:text-amber-800 font-bold">
            Explore More Places →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredPlaces.map((place) => (
            <PlaceCard key={place.id} place={place as unknown as PlaceCardData} isSaved={true} />
          ))}
        </div>
      </div>
    </div>
  );
}

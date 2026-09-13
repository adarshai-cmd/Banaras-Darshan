import React from "react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  User as UserIcon,
  Bookmark,
  Award,
  CalendarCheck,
  MapPin,
  Compass,
  ArrowRight,
  Sparkles,
  PlusCircle,
  MessageSquare,
  Bug,
  Shield,
  LogOut,
  CheckCircle2,
} from "lucide-react";
import { GlassCard, Button, Badge } from "@/components/ui/GlassCard";
import { PlaceCard, PlaceCardData } from "@/components/cards/PlaceCard";
import { ProfileClientSections } from "./ProfileClientSections";
import { AuthGuard } from "@/components/auth/AuthGuard";

export const revalidate = 0; // Dynamic for real user session

export default async function ProfilePage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <AuthGuard
        title="Explorer Profile & Saved Itineraries"
        description="Sign in or create an account to view your saved places, custom itineraries, community badges, and explorer reputation."
      >
        <div />
      </AuthGuard>
    );
  }

  // Fetch real user saved places and trips
  const [savedPlacesRecords, userTrips] = await Promise.all([
    prisma.savedPlace.findMany({
      where: { userId: currentUser.id },
      include: { place: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.trip.findMany({
      where: { userId: currentUser.id },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const savedPlaces = savedPlacesRecords.map((sp) => sp.place);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-10">
      {/* Real Profile Header Card */}
      <GlassCard className="p-6 sm:p-8 bg-white border border-slate-200 shadow-md" hoverEffect={false}>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-amber-400/50 shadow-md bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white text-3xl font-extrabold shrink-0">
            {currentUser.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{currentUser.name.charAt(0).toUpperCase()}</span>
            )}
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-950 font-serif">
                  {currentUser.name}
                </h1>
                <p className="text-xs text-amber-800 font-mono font-medium mt-0.5">
                  {currentUser.email}
                </p>
              </div>

              <div className="flex items-center gap-2 self-center sm:self-auto">
                <Badge variant="gold" className="text-xs px-3 py-1">
                  🏆 {currentUser.badge}
                </Badge>
              </div>
            </div>

            <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
              {currentUser.bio || "Pilgrim & cultural explorer documenting sacred temples, river ghats, and living heritage across Varanasi."}
            </p>

            {/* Badges & Reputation Bar */}
            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs">
              <div className="px-3 py-1 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-semibold shadow-2xs">
                <span className="text-amber-700 font-bold font-mono mr-1">
                  {currentUser.reputation}
                </span>{" "}
                Reputation Points
              </div>
              <div className="px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold shadow-2xs">
                ✓ Verified Pilgrim Account
              </div>
              <div className="px-3 py-1 rounded-xl bg-sky-50 border border-sky-200 text-sky-800 font-semibold shadow-2xs">
                🧭 {savedPlaces.length} Saved Places
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Interactive Action Sections: Suggest a Place + Feedback Form */}
      <ProfileClientSections mode="dashboard" userName={currentUser.name} />

      {/* Saved Places Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-950 font-serif flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-600" />
            <span>My Saved Places ({savedPlaces.length})</span>
          </h2>
          <Link href="/explore">
            <Button variant="outline" size="sm" className="text-xs">
              Explore More Places
            </Button>
          </Link>
        </div>

        {savedPlaces.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-white border border-slate-200 text-slate-600 text-xs space-y-2">
            <p>You haven&apos;t bookmarked any sacred places yet.</p>
            <Link href="/explore" className="text-amber-700 font-bold hover:underline">
              Browse Temples, Ghats & Food Spots →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedPlaces.map((place) => (
              <PlaceCard key={place.id} place={place as unknown as PlaceCardData} isSaved={true} />
            ))}
          </div>
        )}
      </div>

      {/* Saved Custom Itineraries */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-950 font-serif flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-orange-600" />
            <span>My Custom Itineraries</span>
          </h2>
          <Link href="/plan">
            <Button variant="gold" size="sm" className="text-xs">
              + Plan New Trip
            </Button>
          </Link>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-2 text-xs text-slate-600 shadow-xs">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-900 text-sm font-serif">
              Dynamic Itinerary Planner
            </h4>
            <Link href="/plan">
              <Button variant="outline" size="sm" className="text-xs">
                Open Trip Planner
              </Button>
            </Link>
          </div>
          <p>
            Create multi-day trip schedules configured by dawn Aarti timings, budget, and walking proximity.
          </p>
        </div>
      </div>
    </div>
  );
}

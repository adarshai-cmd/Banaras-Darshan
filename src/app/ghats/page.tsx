import React from "react";
import { prisma } from "@/lib/db";
import { Waves, Flame, Sun, AlertTriangle, Sparkles, MapPin, Compass } from "lucide-react";
import { PlaceCard, PlaceCardData } from "@/components/cards/PlaceCard";
import { GlassCard, Badge } from "@/components/ui/GlassCard";

export const revalidate = 60;

const PRIORITY_SLUGS = [
  "assi-ghat",
  "dashashwamedh-ghat",
  "manikarnika-ghat",
  "chet-singh-ghat",
  "scindia-ghat",
  "harishchandra-ghat",
  "panchganga-ghat",
  "namo-ghat",
  "rajghat",
];

export default async function GhatsPage() {
  const allGhats = await prisma.place.findMany({
    where: { category: "GHAT" },
  });

  // Sort according to priority order
  const sortedGhats = [...allGhats].sort((a, b) => {
    const indexA = PRIORITY_SLUGS.indexOf(a.slug);
    const indexB = PRIORITY_SLUGS.indexOf(b.slug);
    const orderA = indexA === -1 ? 99 : indexA;
    const orderB = indexB === -1 ? 99 : indexB;
    return orderA - orderB;
  });

  // Top 3 tourist priority ghats
  const topPriorityGhats = sortedGhats.slice(0, 3);
  const otherGhats = sortedGhats.slice(3);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-sky-700 mb-1">
          <Waves className="w-3.5 h-3.5" />
          <span>The 84 Sacred Steps</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 font-serif">
          Cinematic Ghats of the Ganga
        </h1>
        <p className="text-slate-600 text-sm sm:text-base font-normal leading-relaxed">
          The crescent riverfront of Varanasi stretches across 84 historic stone ghats. Ordered by tourist priority:
          from the dawn raga of Assi and the grand fire ceremony of Dashashwamedh to the eternal flame of Manikarnika.
        </p>
      </div>

      {/* Ghats Protocol & Safety Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <GlassCard className="p-5 space-y-2 bg-white/90 border border-amber-500/20 shadow-sm">
          <div className="flex items-center gap-2 text-sky-700 font-bold uppercase tracking-wider">
            <Sun className="w-4 h-4" />
            <span>Priority 1: Assi Ghat Dawn</span>
          </div>
          <p className="text-slate-700 leading-relaxed">
            Head to <strong className="text-slate-900">Assi Ghat</strong> by 5:00 AM for Subah-e-Banaras Vedic chanting, classical Indian
            ragas on sitar/shehnai, and community yoga overlooking the golden morning mist.
          </p>
        </GlassCard>

        <GlassCard className="p-5 space-y-2 bg-white/90 border border-amber-500/20 shadow-sm">
          <div className="flex items-center gap-2 text-orange-700 font-bold uppercase tracking-wider">
            <Flame className="w-4 h-4" />
            <span>Priority 2: Dashashwamedh Aarti</span>
          </div>
          <p className="text-slate-700 leading-relaxed">
            Every day at <strong className="text-slate-900">6:30 PM</strong>. Arrive by 5:45 PM for front step seating.
            Shared wooden bajra boat seats are standardly ₹150–₹250 per seat.
          </p>
        </GlassCard>

        <GlassCard className="p-5 space-y-2 bg-white/90 border border-rose-400/40 shadow-sm">
          <div className="flex items-center gap-2 text-rose-700 font-bold uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            <span>Priority 3: Manikarnika Reverence</span>
          </div>
          <p className="text-slate-700 leading-relaxed">
            The eternal cremation ghat. Maintain silence and solemnity. <strong className="text-rose-900">Photography and filming
            are strictly prohibited</strong>. Disregard touts claiming to collect cremation wood charity.
          </p>
        </GlassCard>
      </div>

      {/* SECTION 1: TOP 3 MUST-VISIT TOURIST GHATS */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-amber-500/30">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="gold" className="text-xs">
                Essential First-Time Visitors
              </Badge>
              <h2 className="text-2xl font-bold text-slate-950 font-serif">
                Top Priority Tourist Ghats
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Start your Varanasi exploration here: Assi (Dawn), Dashashwamedh (Dusk), and Manikarnika (Sacred Heritage).
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
            Priority 1 – 3
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {topPriorityGhats.map((place) => (
            <PlaceCard key={place.id} place={place as unknown as PlaceCardData} />
          ))}
        </div>
      </div>

      {/* SECTION 2: HISTORIC FORTRESSES & SERENE RIVER CORRIDORS */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-serif">
              Historic Fortresses, Leaning Temples & Promenades
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Medieval bastions, sunken shrines, and modernized river walkways.
            </p>
          </div>
          <span className="text-xs text-slate-500 font-semibold">
            {otherGhats.length} Additional Ghats
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherGhats.map((place) => (
            <PlaceCard key={place.id} place={place as unknown as PlaceCardData} />
          ))}
        </div>
      </div>
    </div>
  );
}

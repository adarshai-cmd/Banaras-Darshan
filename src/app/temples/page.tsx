import React from "react";
import { prisma } from "@/lib/db";
import { Landmark, ShieldAlert } from "lucide-react";
import { PlaceCard, PlaceCardData } from "@/components/cards/PlaceCard";
import { Badge } from "@/components/ui/GlassCard";

export const revalidate = 60;

export default async function TemplesPage() {
  const temples = await prisma.place.findMany({
    where: { category: "TEMPLE" },
    orderBy: { rating: "desc" },
  });

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-orange-700 mb-1">
          <Landmark className="w-3.5 h-3.5" />
          <span>The City of Shiva</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 font-serif">
          Sacred Temples of Kashi
        </h1>
        <p className="text-slate-600 text-sm sm:text-base font-normal leading-relaxed">
          Kashi is the eternal abode of Lord Shiva. Explore the golden Jyotirlinga of Shri Kashi
          Vishwanath, the guardian Kotwal Kaal Bhairav, and the peaceful sanctuary of Sankat Mochan.
        </p>
      </div>

      {/* Crucial Temple Etiquette Banner */}
      <div className="p-6 rounded-2xl bg-amber-100/70 border border-amber-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-amber-950 shadow-sm">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-amber-950">Temple Security & Locker Protocol:</h4>
            <p className="mt-1 text-slate-700 leading-relaxed">
              Mobile phones, cameras, leather belts/wallets, and large bags are strictly barred inside
              the inner sanctum of Shri Kashi Vishwanath Temple. Free digital lockers are provided at
              Corridor Gate 4 (Chowk) and Gate 1 (Lalita Ghat). Always book VIP/Sugam Darshan via the
              official trust website to avoid touts.
            </p>
          </div>
        </div>
        <Badge variant="saffron" className="whitespace-nowrap shrink-0">
          Official Trust Guidelines
        </Badge>
      </div>

      {/* Temples Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-black/10">
          <h2 className="text-2xl font-bold text-slate-900 font-serif">
            Major Sacred Shrines & Visiting Protocols
          </h2>
          <span className="text-xs text-slate-600 font-semibold">{temples.length} Verified Shrines</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {temples.map((place) => (
            <PlaceCard key={place.id} place={place as unknown as PlaceCardData} />
          ))}
        </div>
      </div>
    </div>
  );
}

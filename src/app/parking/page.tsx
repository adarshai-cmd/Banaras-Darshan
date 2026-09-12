import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import {
  SquareParking,
  Car,
  Clock,
  MapPin,
  Navigation,
  ShieldAlert,
  CheckCircle2,
  ExternalLink,
  Layers,
  Map,
  Bus,
  Bike,
  Compass,
  ArrowRight,
} from "lucide-react";
import { GlassCard, Button } from "@/components/ui/GlassCard";

export const metadata: Metadata = {
  title: "Verified Municipal Parking Stands & Vehicle Logistics | Banaras Darshan",
  description:
    "Official municipal parking facilities in Varanasi. Complete guide to Godowlia Multi-Level, Assi Ghat, Maidagin, and Namo Ghat parking stands, vehicle capacities, hourly fees, and walking distances to Shri Kashi Vishwanath Temple and ghats.",
  keywords: [
    "Varanasi parking",
    "Godowlia multi-level parking",
    "Assi ghat parking",
    "Kashi Vishwanath temple parking",
    "Maidagin parking Varanasi",
    "Namo ghat bus parking",
    "Banaras parking rates",
  ],
};

export const revalidate = 60;

export default async function ParkingPage() {
  const parkings = await prisma.parkingLocation.findMany({
    orderBy: { id: "asc" },
  });

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* 1. Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-sky-700 mb-1">
          <SquareParking className="w-3.5 h-3.5" />
          <span>Smart Mobility & Vehicle Logistics</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold text-slate-900 font-serif">
          Official Municipal Parking Stands
        </h1>
        <p className="text-slate-600 text-sm sm:text-base font-normal leading-relaxed">
          Planning to arrive in Varanasi by car or two-wheeler? Varanasi&apos;s ancient ghats and
          the Shri Kashi Vishwanath temple corridor are strictly pedestrian-only. Park your
          vehicle safely at these verified municipal facilities before exploring.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>4 Municipal Facilities Verified</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-300">
            <Clock className="w-3.5 h-3.5" />
            <span>24/7 Security & CCTV Surveillance</span>
          </span>
          <Link href="/map">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200 transition-colors">
              <Map className="w-3.5 h-3.5" />
              <span>View On Interactive Map ↗</span>
            </span>
          </Link>
        </div>
      </div>

      {/* 2. Critical Traffic Advisory Alert */}
      <div className="p-5 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center gap-4 text-xs sm:text-sm text-amber-950 shadow-sm">
        <ShieldAlert className="w-7 h-7 text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
        <div className="space-y-1">
          <strong className="font-bold text-amber-950 text-sm block">
            Strict Traffic Advisory for Drivers & Pilgrims:
          </strong>
          <p className="text-slate-700 leading-relaxed text-xs sm:text-sm">
            Private 4-wheelers (cars, taxis, and SUVs) are <strong>strictly prohibited</strong> beyond
            Godowlia Crossing towards Dashashwamedh Ghat and from Maidagin towards Chowk between{" "}
            <strong>07:00 AM and 10:00 PM</strong> daily. Violators risk immediate vehicle towing and hefty fines.
            Park at the Godowlia or Maidagin multi-level facilities and take a pedestrian walk or local e-rickshaw.
          </p>
        </div>
      </div>

      {/* 3. Verified Parking Stands Grid */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-black/10 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 font-serif">
              Designated Parking Facilities in Varanasi
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Click &quot;Directions on Maps&quot; for real-time turn-by-turn navigation directly to the parking gate.
            </p>
          </div>
          <Link href="/map">
            <Button variant="outline" size="sm" className="gap-1.5 self-start sm:self-auto">
              <Compass className="w-3.5 h-3.5 text-amber-600" />
              <span>Map View</span>
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {parkings.map((p) => {
            const isMultiLevel = p.parkingType === "MULTI_LEVEL";
            const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${p.latitude},${p.longitude}`;

            return (
              <GlassCard
                key={p.id}
                className="rounded-2xl overflow-hidden bg-white border border-amber-500/20 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                hoverEffect={true}
              >
                <div>
                  {/* Card Cover Image */}
                  <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                    {p.image ? (
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-blue-950 text-blue-300">
                        <SquareParking className="w-14 h-14 opacity-50" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Stand Category Badge */}
                    <div className="absolute top-3 left-3">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1 ${
                          isMultiLevel
                            ? "bg-blue-600 text-white"
                            : "bg-emerald-600 text-white"
                        }`}
                      >
                        <Layers className="w-3 h-3" />
                        <span>{isMultiLevel ? "Multi-Level Smart" : "Surface Stand"}</span>
                      </span>
                    </div>

                    {/* Fee Status Badge */}
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/95 text-slate-900 shadow-sm">
                        {p.feeStatus}
                      </span>
                    </div>

                    {/* Area Name at bottom */}
                    <div className="absolute bottom-2.5 left-3 right-3">
                      <p className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{p.area}</span>
                      </p>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 font-serif line-clamp-1">
                        {p.name}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                        {p.address}
                      </p>
                    </div>

                    {/* Capacity & Timings */}
                    <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                      {p.capacity && (
                        <div className="flex items-center gap-2">
                          <Car className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span className="font-semibold text-slate-800">
                            {p.capacity}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>{p.timing || "24 Hours Open"}</span>
                      </div>

                      {p.feeRate && (
                        <div className="p-2 rounded-lg bg-amber-500/10 text-[11px] text-amber-950 font-medium">
                          <strong>Standard Rates:</strong> {p.feeRate}
                        </div>
                      )}
                    </div>

                    {/* Access Tip */}
                    {p.directionsNote && (
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-700 leading-snug">
                        <strong className="text-slate-900">Pro Tip:</strong> {p.directionsNote}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Navigation Button */}
                <div className="p-4 pt-0">
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-amber-600 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Navigate on Google Maps</span>
                    <ExternalLink className="w-3 h-3 opacity-70" />
                  </a>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>

      {/* 4. Walking Guide from Parking to Key Attractions */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-amber-500/20 shadow-lg space-y-6">
        <div className="border-b border-black/10 pb-4">
          <h2 className="text-2xl font-bold text-slate-900 font-serif">
            Walking & Transit Times from Parking Stands to Holy Sites
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Plan your final walking leg from your parked vehicle to temple gates and aarti steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-2">
            <h4 className="font-bold text-slate-900 text-sm font-serif">From Godowlia Multi-Level</h4>
            <ul className="space-y-1.5 text-slate-700">
              <li>• <strong>Kashi Vishwanath Gate 4:</strong> 650m (~7 mins walk)</li>
              <li>• <strong>Dashashwamedh Ghat Aarti:</strong> 500m (~6 mins walk)</li>
              <li>• <strong>Manikarnika Ghat:</strong> 1.2 km (~14 mins walk)</li>
              <li>• <strong>Kashi Chaat Bhandar:</strong> 150m (~2 mins walk)</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 space-y-2">
            <h4 className="font-bold text-slate-900 text-sm font-serif">From Assi Ghat Surface Stand</h4>
            <ul className="space-y-1.5 text-slate-700">
              <li>• <strong>Assi Ghat Subah-e-Banaras:</strong> 150m (~2 mins walk)</li>
              <li>• <strong>Pappu Chai & Tulsi Ghat:</strong> 300m (~4 mins walk)</li>
              <li>• <strong>Sankat Mochan Temple:</strong> 1.6 km (~6 mins by auto)</li>
              <li>• <strong>BHU Main Gate:</strong> 2.2 km (~8 mins by auto)</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
            <h4 className="font-bold text-slate-900 text-sm font-serif">From Maidagin Multi-Level</h4>
            <ul className="space-y-1.5 text-slate-700">
              <li>• <strong>Kaal Bhairav Temple:</strong> 400m (~5 mins walk)</li>
              <li>• <strong>Kashi Vishwanath Gate 1:</strong> 800m (~10 mins walk)</li>
              <li>• <strong>Panchganga Ghat:</strong> 900m (~11 mins walk)</li>
              <li>• <strong>Chowk Silk Saree Bazar:</strong> 300m (~4 mins walk)</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-purple-500/5 border border-purple-500/20 space-y-2">
            <h4 className="font-bold text-slate-900 text-sm font-serif">From Namo Ghat Stand</h4>
            <ul className="space-y-1.5 text-slate-700">
              <li>• <strong>Namo Ghat Sculptures:</strong> Direct on-site access</li>
              <li>• <strong>River Cruise Terminal:</strong> 100m (~1 min walk)</li>
              <li>• <strong>Rajghat & Malviya Bridge:</strong> 400m (~5 mins walk)</li>
              <li>• <strong>Tourist Bus Friendly:</strong> Dedicated large vehicle bays</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 5. Essential Rules for Drivers in Varanasi */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <Bike className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-slate-900">Two-Wheelers & Scooters</h4>
          <p className="text-slate-600 text-xs leading-relaxed">
            Two-wheelers are allowed in more lanes, but parking on road shoulders around Godowlia and Luxa is strictly prohibited. Use designated parking stands to prevent wheel clamping.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <Car className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-slate-900">Four-Wheelers & Cabs</h4>
          <p className="text-slate-600 text-xs leading-relaxed">
            Book Godowlia Multi-Level or Maidagin early in the morning during festivals like Dev Deepawali, Shivratri, and Kartik Purnima as slots fill up by 04:00 PM.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <Bus className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-slate-900">Tourist Buses & Tempos</h4>
          <p className="text-slate-600 text-xs leading-relaxed">
            Buses are NOT permitted into Godowlia, Luxa, or Maidagin. All pilgrim tourist buses must park at Namo Ghat Northern Entrance or Cantt Railway Station bus bays.
          </p>
        </div>
      </div>

      {/* 6. Quick Action Callout */}
      <div className="text-center pt-4 pb-8">
        <Link href="/map">
          <Button variant="primary" size="lg" className="gap-2 shadow-xl shadow-orange-600/20">
            <MapPin className="w-4 h-4" />
            <span>Open All Parking Stands on Interactive Map</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

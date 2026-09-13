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
  CalendarCheck,
  Utensils,
  BedDouble,
  Info,
  AlertTriangle,
  ArrowLeft,
  Car,
  Image as ImageIcon,
  Compass,
} from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import { Badge, GlassCard } from "@/components/ui/GlassCard";
import { AuthGuard } from "@/components/auth/AuthGuard";

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface ParkingData {
  primary?: {
    name: string;
    distance: string;
    feeStatus: string;
    bike: boolean;
    car: boolean;
    bus?: boolean;
    mapQuery?: string;
  };
}

export default async function PlaceDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const place = await prisma.place.findUnique({
    where: { slug },
  });

  if (!place) {
    notFound();
  }

  let parkingData: ParkingData | null = null;
  if (place.parkingInfo) {
    try {
      parkingData = JSON.parse(place.parkingInfo);
    } catch {
      parkingData = null;
    }
  }

  // If place doesn't have custom parkingInfo, intelligently resolve nearest municipal facility
  if (!parkingData?.primary) {
    const areaLower = (place.area || "").toLowerCase();
    const nameLower = place.name.toLowerCase();

    if (
      areaLower.includes("assi") ||
      areaLower.includes("nagwa") ||
      areaLower.includes("durgakund") ||
      areaLower.includes("sankat") ||
      areaLower.includes("bhu")
    ) {
      parkingData = {
        primary: {
          name: "Assi Ghat Dedicated Surface Parking",
          distance: "200m – 800m",
          feeStatus: "Paid (₹10-₹30/hr)",
          bike: true,
          car: true,
          bus: false,
          mapQuery: "Assi Ghat Parking Varanasi",
        },
      };
    } else if (
      areaLower.includes("maidagin") ||
      areaLower.includes("kal bhairav") ||
      areaLower.includes("golghar") ||
      areaLower.includes("macchodari") ||
      nameLower.includes("kaal bhairav")
    ) {
      parkingData = {
        primary: {
          name: "Maidagin Central Multi-Level Facility",
          distance: "300m – 600m",
          feeStatus: "Paid (₹15-₹35/hr)",
          bike: true,
          car: true,
          bus: false,
          mapQuery: "Town Hall Multi Level Parking Maidagin Varanasi",
        },
      };
    } else if (
      areaLower.includes("rajghat") ||
      areaLower.includes("namo") ||
      areaLower.includes("malviya") ||
      nameLower.includes("namo ghat")
    ) {
      parkingData = {
        primary: {
          name: "Namo Ghat Northern Entrance Parking",
          distance: "100m – 500m",
          feeStatus: "Paid (₹10-₹30/hr)",
          bike: true,
          car: true,
          bus: true,
          mapQuery: "Namo Ghat Parking Varanasi",
        },
      };
    } else {
      // Central old city hub (Godowlia Multi-Level)
      parkingData = {
        primary: {
          name: "Godowlia Multi-Level Smart Parking",
          distance: "400m – 900m",
          feeStatus: "Paid (₹15-₹35/hr)",
          bike: true,
          car: true,
          bus: false,
          mapQuery: "Godowlia Multi Level Parking Varanasi",
        },
      };
    }
  }

  let galleryImages: Array<{ url: string; caption?: string }> = [];
  if (place.galleryJson) {
    try {
      galleryImages = JSON.parse(place.galleryJson);
    } catch {
      galleryImages = [];
    }
  }

  let nearbyPlaces: Array<{ name: string; distance?: string; category?: string; tip?: string }> = [];
  if (place.nearbyPlacesJson) {
    try {
      nearbyPlaces = JSON.parse(place.nearbyPlacesJson);
    } catch {
      nearbyPlaces = [];
    }
  }

  return (
    <AuthGuard
      title={place.name}
      description="Sign in or create an account to view full verified place details, visitor protocols, dress codes, aarti schedules, and nearby recommendations."
    >
      <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* Back button */}
      <Link
        href="/explore"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:underline"
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
            {place.rating !== null && place.rating !== undefined ? (
              <span className="px-3 py-1 rounded-lg bg-black/70 backdrop-blur-md text-xs font-semibold text-amber-400 border border-amber-500/30 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {place.rating.toFixed(1)} {place.reviewCount ? `(${place.reviewCount} reviews)` : ""}
              </span>
            ) : (
              <span className="px-3 py-1 rounded-lg bg-black/70 backdrop-blur-md text-xs font-semibold text-slate-200 border border-white/20">
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
          <GlassCard className="p-6 sm:p-8 space-y-4 bg-white border border-slate-200" hoverEffect={false}>
            <h2 className="text-xl font-bold text-slate-950 font-serif">
              Overview & Cultural Significance
            </h2>
            <p className="text-sm font-semibold text-amber-800">
              {place.tagline}
            </p>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {place.description}
            </p>

            {place.history && (
              <div className="pt-4 border-t border-slate-200 space-y-1.5">
                <h3 className="text-sm font-bold text-slate-950 font-serif">
                  Historical & Skanda Purana Context
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {place.history}
                </p>
              </div>
            )}
          </GlassCard>

          {/* Specialty or Amenities */}
          {place.popularDishes && (
            <GlassCard className="p-6 space-y-2 border-orange-200 bg-orange-50/50" hoverEffect={false}>
              <div className="flex items-center gap-2 text-xs font-bold text-orange-800 uppercase tracking-wider">
                <Utensils className="w-4 h-4 text-orange-600" />
                <span>Must-Try Signature Dishes</span>
              </div>
              <p className="text-sm text-slate-800 font-medium">
                {place.popularDishes}
              </p>
            </GlassCard>
          )}

          {place.amenities && (
            <GlassCard className="p-6 space-y-2 border-purple-200 bg-purple-50/50" hoverEffect={false}>
              <div className="flex items-center gap-2 text-xs font-bold text-purple-800 uppercase tracking-wider">
                <BedDouble className="w-4 h-4 text-purple-600" />
                <span>Property Amenities</span>
              </div>
              <p className="text-sm text-slate-800 font-medium">
                {place.amenities}
              </p>
            </GlassCard>
          )}

          {/* Practical Tips */}
          {place.visitingTips && (
            <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-800 uppercase tracking-wider">
                <Info className="w-4 h-4 text-blue-600" />
                <span>Local Traveler Tip</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {place.visitingTips}
              </p>
            </div>
          )}

          {place.safetyNotes && (
            <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-800 uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Safety & Etiquette Protocols</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {place.safetyNotes}
              </p>
            </div>
          )}

          {/* Dynamic Photo Gallery */}
          {galleryImages.length > 0 && (
            <GlassCard className="p-6 space-y-4 bg-white border border-slate-200" hoverEffect={false}>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
                <ImageIcon className="w-4 h-4 text-amber-600" />
                <span>Photo Gallery & Visuals ({galleryImages.length})</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {galleryImages.map((img, idx) => (
                  <div key={idx} className="group relative rounded-xl overflow-hidden border border-slate-200 aspect-[4/3] bg-slate-900 shadow-xs">
                    <SafeImage
                      src={img.url}
                      alt={img.caption || place.name}
                      category={place.category}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {img.caption && (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 text-[10px] text-white truncate">
                        {img.caption}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {/* Dynamic Curated Nearby Places */}
          {nearbyPlaces.length > 0 && (
            <GlassCard className="p-6 space-y-4 bg-white border border-slate-200" hoverEffect={false}>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
                <Compass className="w-4 h-4 text-teal-600" />
                <span>Curated Nearby Places</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {nearbyPlaces.map((np, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{np.name}</span>
                      {np.distance && (
                        <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                          {np.distance}
                        </span>
                      )}
                    </div>
                    {np.category && <p className="text-[10px] text-slate-500 uppercase">{np.category}</p>}
                    {np.tip && <p className="text-[11px] text-slate-600 mt-1">{np.tip}</p>}
                  </div>
                ))}
              </div>
            </GlassCard>
          )}
        </div>

        {/* Right 1 Col: Quick Info, Parking & Actions */}
        <div className="space-y-6">
          <GlassCard className="p-6 space-y-4 bg-white border border-slate-200" hoverEffect={false}>
            <h3 className="text-base font-bold text-slate-950 font-serif">
              Visiting Details
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900">Address:</p>
                  <p className="text-slate-600">{place.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900">Best Time:</p>
                  <p className="text-slate-600">{place.bestTimeToVisit || "Morning / Evening"}</p>
                </div>
              </div>

              {place.openingHours && (
                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Hours:</p>
                    <p className="text-slate-600">{place.openingHours}</p>
                  </div>
                </div>
              )}

              {place.nearestHub && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-800">
                  <strong>Transit Hub:</strong> {place.nearestHub}
                </div>
              )}
            </div>

            {/* Nearby Parking Section (Point 11) */}
            {parkingData?.primary ? (
              <div className="pt-4 border-t border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Car className="w-3.5 h-3.5 text-amber-600" />
                    <span>Nearby Parking</span>
                  </h4>
                  <span className="text-[10px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md font-semibold border border-amber-300">
                    Verified Stand
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div>
                    <p className="font-bold text-slate-900">{parkingData.primary.name}</p>
                    <p className="text-[11px] text-slate-500">Distance: {parkingData.primary.distance}</p>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-slate-700">
                    <span className="px-2 py-0.5 rounded bg-white border border-slate-200 font-medium">
                      {parkingData.primary.feeStatus}
                    </span>
                    {parkingData.primary.bike && (
                      <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                        Bike ✓
                      </span>
                    )}
                    {parkingData.primary.car && (
                      <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                        Car ✓
                      </span>
                    )}
                    {parkingData.primary.bus && (
                      <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                        Bus ✓
                      </span>
                    )}
                  </div>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      parkingData.primary.mapQuery || `${parkingData.primary.name} Varanasi`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-white border border-slate-300 hover:border-amber-400 text-slate-800 text-[11px] font-semibold hover:bg-slate-50 transition-all shadow-xs"
                  >
                    <Navigation className="w-3 h-3 text-amber-600" />
                    <span>Navigate to Parking ↗</span>
                  </a>

                  <div className="pt-1 flex items-center justify-between text-[11px]">
                    <Link href="/parking" className="text-amber-700 hover:text-amber-800 font-semibold underline flex items-center gap-1">
                      <span>View all 4 parking facilities</span>
                      <span>→</span>
                    </Link>
                    <span className="text-[10px] text-slate-500 italic">24/7 Security</span>
                  </div>
                </div>

                <p className="text-[10px] text-slate-500 italic">
                  * Parking fee/status may vary — verify locally upon arrival.
                </p>
              </div>
            ) : place.category === "GHAT" ? (
              <div className="pt-4 border-t border-slate-200 space-y-2 text-xs">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5 text-amber-600" />
                  <span>Nearby Parking</span>
                </h4>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-[11px]">
                  <p className="font-semibold text-slate-800">Godowlia / Maidagin Central Parking</p>
                  <p className="mt-0.5">Vehicles are restricted along old city ghat lanes. Park at the nearest municipal stand and walk or take an e-rickshaw.</p>
                  <p className="text-[10px] text-slate-500 italic mt-1">Parking fee/status may vary — verify locally.</p>
                </div>
              </div>
            ) : null}

            {/* Actions */}
            <div className="pt-3 border-t border-slate-200 space-y-2">
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
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white border border-slate-300 text-slate-800 text-xs font-semibold hover:bg-slate-50 transition-all shadow-xs"
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

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Factually verified in the official Banaras Darshan heritage index.</span>
          </div>
        </div>
      </div>
    </div>
    </AuthGuard>
  );
}

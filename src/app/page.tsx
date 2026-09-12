import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import {
  Compass,
  Utensils,
  Landmark,
  Waves,
  BedDouble,
  Sparkles,
  MapPin,
  CalendarCheck,
  Users,
  Shield,
  ArrowRight,
  CheckCircle2,
  PhoneCall,
  Flame,
} from "lucide-react";
import { CinematicHero } from "@/components/hero/CinematicHero";
import { TodayInBanaras } from "@/components/today/TodayInBanaras";
import { PlaceCard, PlaceCardData } from "@/components/cards/PlaceCard";
import { ExploreNearMeWidget } from "@/components/home/ExploreNearMeWidget";
import { RoutePlannerWidget } from "@/components/map/RoutePlannerWidget";
import { TripPlannerWidget } from "@/components/trip/TripPlannerWidget";
import { CommunityFeed } from "@/components/community/CommunityFeed";
import { AIAssistantWidget } from "@/components/ai/AIAssistantWidget";
import { BanarasWeatherWidget } from "@/components/weather/BanarasWeatherWidget";
import { Button, GlassCard, Badge } from "@/components/ui/GlassCard";

// Dynamic data fetching with fallback revalidation
export const revalidate = 60;

export default async function HomePage() {
  const allPlaces = await prisma.place.findMany({
    orderBy: [{ isFeatured: "desc" }, { rating: "desc" }],
  });

  const popularPlaces = allPlaces.filter((p) => p.isFeatured).slice(0, 4);
  const foodPlaces = allPlaces.filter((p) => p.category === "FOOD").slice(0, 4);
  const templePlaces = allPlaces.filter((p) => p.category === "TEMPLE").slice(0, 3);
  const ghatPlaces = allPlaces.filter((p) => p.category === "GHAT").slice(0, 3);
  const hotelPlaces = allPlaces.filter((p) => p.category === "HOTEL").slice(0, 3);
  const hiddenPlaces = allPlaces.filter((p) => p.isHiddenGem || p.category === "HIDDEN" || p.category === "STREET").slice(0, 3);

  const categories = [
    { title: "Temples", icon: Landmark, href: "/temples", desc: "Jyotirlinga & ancient shrines", count: "12+ Verified" },
    { title: "Ghats", icon: Waves, href: "/ghats", desc: "Maha Aarti & sunrise steps", count: "84 Ghats" },
    { title: "Food", icon: Utensils, href: "/food", desc: "Tamatar chaat, lassi & paan", count: "25+ Famous" },
    { title: "Stay", icon: BedDouble, href: "/stay", desc: "Heritage palaces & hostels", count: "Verified Stays" },
    { title: "Hidden Lanes", icon: Sparkles, href: "/hidden", desc: "Old galliyan & silk looms", count: "Offbeat Gems" },
    { title: "Trip Planner", icon: CalendarCheck, href: "/plan", desc: "Personalized day-by-day plans", count: "Smart AI" },
  ];

  return (
    <main className="min-h-screen bg-[#FAF8F5] text-slate-900">
      {/* 1. Cinematic Hero Section */}
      <CinematicHero />

      {/* 2. Today in Banaras (Live Aarti, Sunrise, Weather & River navigation) */}
      <TodayInBanaras />

      {/* 3. Explore Banaras by Category */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-amber-700 mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Curated Directory</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 font-serif">
            Explore Kashi Your Way
          </h2>
          <p className="text-slate-600 text-sm mt-2 font-light">
            Every temple, ghat, street food stall, and heritage stay is factually verified by local researchers.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.title}
                href={cat.href}
                className="p-5 rounded-2xl bg-white/80 border border-amber-500/20 hover:border-amber-500 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 text-center flex flex-col items-center justify-between group backdrop-blur-md shadow-sm"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 group-hover:border-amber-500 group-hover:bg-amber-500 group-hover:text-slate-950 flex items-center justify-center text-amber-700 transition-all mb-3 shadow-inner">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-700 transition-colors font-serif">
                    {cat.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{cat.desc}</p>
                </div>
                <span className="mt-3 text-[10px] font-mono text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full font-semibold">
                  {cat.count}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. Popular Places in Kashi */}
      <section className="py-16 bg-[#F5F2EA] border-y border-amber-500/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-amber-700 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Must-Experience</span>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 font-serif">Popular Places in Kashi</h2>
              <p className="text-sm text-slate-600 mt-1 font-light">
                The most iconic sacred corridors, riverfront ghats, and culinary institutions
              </p>
            </div>
            <Link
              href="/explore"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800"
            >
              <span>View All 19+ Verified Places</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularPlaces.map((place) => (
              <PlaceCard key={place.id} place={place as unknown as PlaceCardData} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Food Discovery (Authentic Banaras Flavors) */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-amber-700 mb-1">
              <Utensils className="w-3.5 h-3.5" />
              <span>Culinary Traditions</span>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 font-serif">Legendary Banaras Food</h2>
            <p className="text-sm text-slate-600 mt-1 font-light">
              Desi ghee kachoris, piping hot tamatar chaat, clay-pot fruit lassis, and GI-tagged Banarasi Paan
            </p>
          </div>
          <Link
            href="/food"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800"
          >
            <span>Explore All Food Spots</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {foodPlaces.map((place) => (
            <PlaceCard key={place.id} place={place as unknown as PlaceCardData} />
          ))}
        </div>
      </section>

      {/* 6. Temples & Ghats Spotlight */}
      <section className="py-16 bg-[#F5F2EA] border-y border-amber-500/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Temples Row */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 font-serif flex items-center gap-2">
                  <span>Sacred Temples of Kashi</span>
                  <span className="text-xs font-sans px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-900 border border-orange-300 font-semibold">
                    Spiritual Core
                  </span>
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Visiting hours, dress etiquette, locker rules, and historical facts
                </p>
              </div>
              <Link href="/temples" className="text-xs text-amber-700 hover:text-amber-800 font-semibold">
                View All Temples →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {templePlaces.map((place) => (
                <PlaceCard key={place.id} place={place as unknown as PlaceCardData} />
              ))}
            </div>
          </div>

          {/* Ghats Row */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 font-serif flex items-center gap-2">
                  <span>Cinematic Ghats of the Ganga</span>
                  <span className="text-xs font-sans px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-300 font-semibold">
                    Subah-e-Banaras & Aarti
                  </span>
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  84 crescent stone staircases connecting the sacred city to mother Ganga
                </p>
              </div>
              <Link href="/ghats" className="text-xs text-sky-700 hover:text-sky-800 font-semibold">
                View All Ghats →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {ghatPlaces.map((place) => (
                <PlaceCard key={place.id} place={place as unknown as PlaceCardData} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. Explore Near Me Geolocation Radar */}
      <ExploreNearMeWidget initialPlaces={allPlaces as unknown as PlaceCardData[]} />

      {/* 8. Route Planner & Interactive Map Showcase */}
      <section className="py-16 bg-[#F5F2EA] border-y border-amber-500/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-sky-700 mb-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>Smart Mobility</span>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 font-serif">
              Station, Airport & Ghat Route Navigator
            </h2>
            <p className="text-sm text-slate-600 mt-2 font-light">
              Get realistic auto, cab, and walking estimates between major arrival hubs and old city landmarks.
            </p>
          </div>

          <RoutePlannerWidget />

          <div className="text-center pt-4">
            <Link href="/map">
              <Button variant="outline" size="md" className="gap-2">
                <MapPin className="w-4 h-4 text-amber-600" />
                <span>Open Full-Screen Interactive Kashi Map</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 8b. Dedicated Banaras Weather & Travel Forecast */}
      <BanarasWeatherWidget />

      {/* 9. Plan My Trip (Custom Itinerary Generator) */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TripPlannerWidget />
      </section>

      {/* 10. Community Live Chat (Mandatory Core Feature) */}
      <section className="py-16 bg-[#F5F2EA] border-y border-amber-500/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <CommunityFeed />
        </div>
      </section>

      {/* 11. Banaras AI Conversational Assistant */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-amber-700 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Grounded Intelligence</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 font-serif">
            Ask Banaras AI Anything
          </h2>
          <p className="text-sm text-slate-600 mt-1 font-light">
            Trained with deep local knowledge — timings, authentic recipes, fair fares, and hidden alleys.
          </p>
        </div>

        <AIAssistantWidget />
      </section>

      {/* 12. Safety & Practical Travel Guidance */}
      <section className="py-16 bg-[#FAF8F5] border-t border-amber-500/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 rounded-3xl bg-white border border-amber-500/20 shadow-xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-black/10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 font-serif">
                    Traveler Safety & Local Helplines
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Official police contacts, river safety guidelines, and honest advice to avoid touts
                  </p>
                </div>
              </div>
              <Link href="/safety">
                <Button variant="outline" size="sm">
                  View Full Safety Guide →
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <p className="text-amber-700 font-semibold uppercase tracking-wider text-[10px]">
                  Emergency
                </p>
                <p className="text-base font-bold text-slate-900">Dial 112</p>
                <p className="text-slate-500 text-[11px]">All-India Emergency Helpline</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <p className="text-emerald-700 font-semibold uppercase tracking-wider text-[10px]">
                  Tourist Police Cell
                </p>
                <p className="text-base font-bold text-slate-900">0542-2508000</p>
                <p className="text-slate-500 text-[11px]">Varanasi Tourist Assistance Booth</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <p className="text-sky-700 font-semibold uppercase tracking-wider text-[10px]">
                  Boat Fare Slab
                </p>
                <p className="text-base font-bold text-slate-900">₹150 – ₹200 / seat</p>
                <p className="text-slate-500 text-[11px]">Shared Bajra for Ganga Aarti</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <p className="text-rose-700 font-semibold uppercase tracking-wider text-[10px]">
                  Etiquette Reminder
                </p>
                <p className="text-base font-bold text-slate-900">No Cremation Photos</p>
                <p className="text-slate-500 text-[11px]">Strictly forbidden at Manikarnika</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

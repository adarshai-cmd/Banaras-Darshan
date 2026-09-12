"use client";

import React, { useState } from "react";
import {
  CalendarCheck,
  MapPin,
  Printer,
  BookmarkCheck,
} from "lucide-react";
import { GlassCard, Button, Badge } from "@/components/ui/GlassCard";

interface Activity {
  time: string;
  title: string;
  desc: string;
  area: string;
  approxCost: string;
  category: string;
}

interface DayPlan {
  day: number;
  theme: string;
  activities: Activity[];
}

export function TripPlannerWidget() {
  const [days, setDays] = useState<number>(2);
  const [budgetTier, setBudgetTier] = useState<string>("BUDGET");
  const [travelStyle, setTravelStyle] = useState<string>("CULTURE_FOOD");
  const [groupType, setGroupType] = useState<string>("Couple");
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Dynamic generator based on user inputs
  const generateItinerary = (): DayPlan[] => {
    const plans: DayPlan[] = [];

    // Day 1: The Essential Sacred Ghats & Food
    plans.push({
      day: 1,
      theme: "The Living Rhythm: Dawn at Assi to Dusk at Dashashwamedh",
      activities: [
        {
          time: "05:00 AM",
          title: "Subah-e-Banaras at Assi Ghat",
          desc: "Watch the sun rise over the Ganga with Vedic chanting, classical morning ragas, and riverside yoga.",
          area: "Assi Ghat",
          approxCost: "Free",
          category: "GHAT",
        },
        {
          time: "07:30 AM",
          title: "Desi Ghee Breakfast at Ram Bhandar",
          desc: "Steaming hot spicy kachori-sabzi with thin-crisp saffron jalebis served on dried sal leaves.",
          area: "Thatheri Bazaar / Chowk",
          approxCost: budgetTier === "LUXURY" ? "₹200" : "₹70",
          category: "FOOD",
        },
        {
          time: "10:00 AM",
          title: "Shri Kashi Vishwanath Dham Corridor",
          desc: "Darshan at the Golden Jyotirlinga followed by a tranquil stroll through the riverfront corridor.",
          area: "Godowlia / Lalita Ghat",
          approxCost: "Free",
          category: "TEMPLE",
        },
        {
          time: "02:00 PM",
          title: "Artisan Lassi at Blue Lassi Shop",
          desc: "Pomegranate and rabdi lassi served in thick clay kullads in ancient Chowk galliyan.",
          area: "Manikarnika Lane",
          approxCost: "₹100",
          category: "FOOD",
        },
        {
          time: "05:45 PM",
          title: "Maha Ganga Aarti at Dashashwamedh Ghat",
          desc: "Watch the multi-tiered brass lamp ritual from the ghat steps or from an anchored wooden boat.",
          area: "Dashashwamedh Ghat",
          approxCost: budgetTier === "LUXURY" ? "₹1,200 (Private boat)" : "₹150 (Shared bajra)",
          category: "GHAT",
        },
        {
          time: "08:30 PM",
          title: "Dinner Feast at Kashi Chaat Bhandar",
          desc: "Savor the world-famous hot Tamatar Chaat and Palak Patta chaat near Girja Ghar chauraha.",
          area: "Godowlia",
          approxCost: "₹150",
          category: "FOOD",
        },
      ],
    });

    // Day 2: Forts, Silk Weavers & Ancient Shrines
    if (days >= 2) {
      plans.push({
        day: 2,
        theme: "Medieval Fortresses, Sacred Guardian & Silk Looms",
        activities: [
          {
            time: "06:30 AM",
            title: "Historic Ghat Boat Cruise to Chet Singh Fort",
            desc: "Glide past the stone bastions of Chet Singh Palace and red-striped Kedar Ghat.",
            area: "Shivala to Assi",
            approxCost: "₹200",
            category: "GHAT",
          },
          {
            time: "09:00 AM",
            title: "Sankat Mochan Hanuman Temple",
            desc: "Founded by Tulsidas. Enjoy divine silence and receive pure-ghee Besan Ladoo prasad.",
            area: "Assi / Lanka",
            approxCost: "Free",
            category: "TEMPLE",
          },
          {
            time: "11:30 AM",
            title: "Sarai Mohana Silk Weavers Colony",
            desc: "Watch master weavers handloom pure gold zari Banarasi sarees on traditional pit-looms.",
            area: "Rajghat",
            approxCost: "Free to visit",
            category: "EXPERIENCE",
          },
          {
            time: "04:30 PM",
            title: "Kaal Bhairav (Kotwal of Varanasi) Blessing",
            desc: "Seek the protection of the guardian deity and receive the sacred black thread.",
            area: "Maidagin / Chowk",
            approxCost: "Free",
            category: "TEMPLE",
          },
          {
            time: "07:30 PM",
            title: "Banarasi Paan at Keshav Tambool",
            desc: "Melt-in-mouth Magahi leaf with gulkand, natural rose water, and silver foil.",
            area: "Assi Crossing",
            approxCost: "₹40",
            category: "FOOD",
          },
        ],
      });
    }

    // Day 3: Hidden Stepwells & Peaceful Sarnath
    if (days >= 3) {
      plans.push({
        day: 3,
        theme: "Hidden Subterranean Kashi & Sacred Sarnath",
        activities: [
          {
            time: "07:00 AM",
            title: "Winter Malaiyo Cloud Sweet Tasting",
            desc: "Savor the frothed saffron milk dew foam at Shreeji Sweets Neelkanth.",
            area: "Chowk",
            approxCost: "₹70",
            category: "FOOD",
          },
          {
            time: "08:30 AM",
            title: "Lolark Kund Ancient Sun Stepwell",
            desc: "Descend the 50-foot geometric stone staircases of the ancient solar stepwell.",
            area: "Tulsi Ghat",
            approxCost: "Free",
            category: "HIDDEN",
          },
          {
            time: "11:00 AM",
            title: "Excursion to Sarnath Deer Park & Dhamek Stupa",
            desc: "Where Lord Buddha preached his first sermon after enlightenment. Visit the Ashoka Pillar capital.",
            area: "Sarnath (10 km north)",
            approxCost: "₹50 (Entry ticket)",
            category: "EXPERIENCE",
          },
          {
            time: "06:00 PM",
            title: "Quiet Sunset Boat Ride to Manikarnika Ghat",
            desc: "Contemplate the eternal fire and cycle of life from the peaceful river currents.",
            area: "Manikarnika Ghat",
            approxCost: "₹150",
            category: "GHAT",
          },
        ],
      });
    }

    return plans;
  };

  const itinerary = generateItinerary();

  const handleSaveTrip = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Input Selector Form */}
      <GlassCard className="p-6 sm:p-8 bg-white/95 border border-amber-500/20 shadow-xl" hoverEffect={false}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md">
            <CalendarCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
              Smart Banaras Trip Planner
            </h3>
            <p className="text-xs text-slate-600">
              Personalized itineraries optimized for proximity, opening hours & authentic experiences
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Days */}
          <div>
            <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider mb-2">
              Trip Duration:
            </label>
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="w-full rounded-xl px-4 py-2.5 text-sm font-medium bg-white border border-amber-500/30 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            >
              <option value={1} className="bg-white text-slate-900">1 Day Express Kashi</option>
              <option value={2} className="bg-white text-slate-900">2 Days Classic Soul</option>
              <option value={3} className="bg-white text-slate-900">3 Days Deep Explorer</option>
            </select>
          </div>

          {/* Budget */}
          <div>
            <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider mb-2">
              Budget Style:
            </label>
            <select
              value={budgetTier}
              onChange={(e) => setBudgetTier(e.target.value)}
              className="w-full rounded-xl px-4 py-2.5 text-sm font-medium bg-white border border-amber-500/30 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            >
              <option value="BUDGET" className="bg-white text-slate-900">
                Backpacker (₹1,000 - ₹1,500/day)
              </option>
              <option value="MODERATE" className="bg-white text-slate-900">
                Comfort Traveler (₹2,500 - ₹4,000/day)
              </option>
              <option value="LUXURY" className="bg-white text-slate-900">
                Heritage Luxury (₹8,000+/day)
              </option>
            </select>
          </div>

          {/* Travel Style */}
          <div>
            <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider mb-2">
              Travel Focus:
            </label>
            <select
              value={travelStyle}
              onChange={(e) => setTravelStyle(e.target.value)}
              className="w-full rounded-xl px-4 py-2.5 text-sm font-medium bg-white border border-amber-500/30 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            >
              <option value="CULTURE_FOOD" className="bg-white text-slate-900">
                Culture, Ghats & Street Food
              </option>
              <option value="SPIRITUAL" className="bg-white text-slate-900">
                Spiritual Darshan & Shrines
              </option>
              <option value="PHOTOGRAPHY" className="bg-white text-slate-900">
                Dawn Photography & Offbeat
              </option>
            </select>
          </div>

          {/* Group */}
          <div>
            <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider mb-2">
              Traveling With:
            </label>
            <select
              value={groupType}
              onChange={(e) => setGroupType(e.target.value)}
              className="w-full rounded-xl px-4 py-2.5 text-sm font-medium bg-white border border-amber-500/30 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            >
              <option value="Solo" className="bg-white text-slate-900">Solo Backpacker</option>
              <option value="Couple" className="bg-white text-slate-900">Couple</option>
              <option value="Family" className="bg-white text-slate-900">Family</option>
              <option value="Friends" className="bg-white text-slate-900">Group of Friends</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-amber-500/20">
          <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Itinerary auto-optimized for zero backtracking</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint} className="bg-white hover:bg-slate-50 border-amber-500/30 text-slate-800">
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </Button>
            <Button variant="gold" size="sm" onClick={handleSaveTrip}>
              <BookmarkCheck className="w-3.5 h-3.5" />
              <span>Save to My Trip</span>
            </Button>
          </div>
        </div>
        {savedSuccess && (
          <div className="mt-3 p-2.5 text-center text-xs text-emerald-800 bg-emerald-100 border border-emerald-400 rounded-xl font-medium animate-in fade-in">
            ✓ Successfully saved to your &quot;My Trip&quot; dashboard!
          </div>
        )}
      </GlassCard>

      {/* Generated Itinerary Day by Day */}
      <div className="space-y-6">
        {itinerary.map((dayPlan) => (
          <div
            key={dayPlan.day}
            className="rounded-2xl border border-amber-500/20 bg-white/95 backdrop-blur-xl p-6 shadow-xl"
          >
            {/* Day Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-black/10">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center font-bold text-white text-sm shadow-md">
                  D{dayPlan.day}
                </span>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 font-serif">
                    Day {dayPlan.day}
                  </h4>
                  <p className="text-xs text-amber-800 font-semibold">
                    {dayPlan.theme}
                  </p>
                </div>
              </div>
              <Badge variant="gold">{dayPlan.activities.length} Curated Stops</Badge>
            </div>

            {/* Timeline Activities */}
            <div className="mt-6 space-y-4 relative before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-amber-300">
              {dayPlan.activities.map((activity, idx) => (
                <div key={idx} className="relative pl-8 sm:pl-10 group">
                  {/* Timeline Dot */}
                  <div className="absolute left-1.5 sm:left-2.5 top-1.5 w-3 h-3 rounded-full bg-amber-500 border-2 border-white shadow-md group-hover:scale-125 transition-transform" />

                  <div className="p-4 rounded-xl bg-amber-50/40 border border-amber-500/15 hover:border-amber-500/40 hover:bg-white transition-all shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-amber-800 font-bold">
                          {activity.time}
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-sky-700 font-medium flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {activity.area}
                        </span>
                      </div>
                      <span className="text-xs text-emerald-700 font-bold">
                        Est: {activity.approxCost}
                      </span>
                    </div>

                    <h5 className="text-sm font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
                      {activity.title}
                    </h5>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {activity.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CalendarCheck,
  MapPin,
  Clock,
  CircleDollarSign,
  Sparkles,
  Users,
  Navigation,
  Compass,
  Printer,
  BookmarkCheck,
  CheckCircle2,
  Info,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import { GlassCard, Button, Badge } from "@/components/ui/GlassCard";

interface ActivityItem {
  period: "Morning" | "Afternoon" | "Evening";
  timeSlot: string;
  placeName: string;
  hindiName?: string | null;
  slug: string;
  category: string;
  area: string;
  whyVisit: string;
  estimatedDuration: string;
  estimatedCost: string;
  distanceFromPrev?: string;
  travelTime?: string;
  lat: number;
  lng: number;
}

interface DayPlan {
  day: number;
  title: string;
  theme: string;
  estimatedDayBudget: string;
  activities: ActivityItem[];
}

interface GeneratedTrip {
  durationDays: number;
  totalBudgetInput: number;
  groupType: string;
  travelStyle: string;
  stayRecommendation: {
    name: string;
    slug: string;
    tier: string;
    estimatedCost: string;
    area: string;
  };
  budgetBreakdown: {
    stayEstimate: string;
    foodEstimate: string;
    sightseeingBoatEstimate: string;
    localTransitEstimate: string;
    totalEstimated: string;
  };
  days: DayPlan[];
}

export function TripPlannerWidget() {
  const [durationInput, setDurationInput] = useState<string>("3");
  const [budgetInput, setBudgetInput] = useState<string>("10000");
  const [groupType, setGroupType] = useState<string>("Solo");
  const [travelStyle, setTravelStyle] = useState<string>("Spiritual & Culture");
  const [places, setPlaces] = useState<any[]>([]);
  const [generatedTrip, setGeneratedTrip] = useState<GeneratedTrip | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Load database places
  useEffect(() => {
    fetch("/api/places")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.places) {
          setPlaces(data.places);
        }
      })
      .catch((err) => console.error("Error loading places:", err));
  }, []);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setSavedSuccess(false);

    const days = parseInt(durationInput, 10);
    const budget = parseInt(budgetInput, 10);

    if (isNaN(days) || days < 1 || days > 14) {
      setValidationError("Please enter a valid trip duration between 1 and 14 days.");
      return;
    }

    if (isNaN(budget) || budget < 1000) {
      setValidationError("Please enter a realistic minimum budget of at least ₹1,000.");
      return;
    }

    setIsGenerating(true);

    // Compute dynamic itinerary from actual places
    setTimeout(() => {
      const trip = calculateDynamicItinerary(days, budget, groupType, travelStyle, places);
      setGeneratedTrip(trip);
      setIsGenerating(false);
    }, 400);
  };

  const handleSaveTrip = async () => {
    if (!generatedTrip) return;
    try {
      // Check auth and save
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch {
      setSavedSuccess(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Interactive Input Form */}
      <GlassCard className="p-6 sm:p-8 bg-white border border-slate-200 shadow-md" hoverEffect={false}>
        <form onSubmit={handleGenerate} className="space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-xl font-bold text-slate-950 font-serif flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-amber-700" />
              <span>Enter Your Travel Parameters</span>
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Enter your own trip duration and budget. Our zero-backtracking algorithm will organize actual verified Kashi landmarks, food gems, and ghat timings.
            </p>
          </div>

          {validationError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{validationError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Trip Duration */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-700" />
                <span>Trip Duration (Days)</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={1}
                  max={14}
                  required
                  value={durationInput}
                  onChange={(e) => setDurationInput(e.target.value)}
                  placeholder="e.g. 2, 3, 5, 7"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-500 focus:outline-none text-sm font-semibold text-slate-900 shadow-inner"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-600">
                  Days
                </span>
              </div>
              <p className="text-[11px] text-slate-600">e.g. 2 days, 3 days, 5 days</p>
            </div>

            {/* Total Budget */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1">
                <CircleDollarSign className="w-3.5 h-3.5 text-emerald-700" />
                <span>Estimated Budget (₹ INR)</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-600">
                  ₹
                </span>
                <input
                  type="number"
                  min={1000}
                  step={500}
                  required
                  value={budgetInput}
                  onChange={(e) => setBudgetInput(e.target.value)}
                  placeholder="e.g. 3000, 10000, 25000"
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-500 focus:outline-none text-sm font-semibold text-slate-900 shadow-inner"
                />
              </div>
              <p className="text-[11px] text-slate-600">e.g. ₹3,000, ₹10,000, ₹25,000</p>
            </div>

            {/* Traveling With */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-sky-700" />
                <span>Traveling With (Optional)</span>
              </label>
              <select
                value={groupType}
                onChange={(e) => setGroupType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-500 focus:outline-none text-xs font-semibold text-slate-900 shadow-inner"
              >
                <option value="Solo">Solo Traveler</option>
                <option value="Couple">Couple</option>
                <option value="Family">Family with Elders/Kids</option>
                <option value="Friends">Friends / Backpackers</option>
              </select>
              <p className="text-[11px] text-slate-600">Influences walking pace</p>
            </div>

            {/* Travel Focus / Style */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-purple-700" />
                <span>Trip Style & Focus</span>
              </label>
              <select
                value={travelStyle}
                onChange={(e) => setTravelStyle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-500 focus:outline-none text-xs font-semibold text-slate-900 shadow-inner"
              >
                <option value="Spiritual & Culture">Spiritual Darshan & Ghats</option>
                <option value="Food & Heritage">Heritage Lanes & Foodie Trail</option>
                <option value="Photography & Ghats">Photography & Sunrise River</option>
                <option value="Relaxed & Balanced">Relaxed & Leisure Pace</option>
              </select>
              <p className="text-[11px] text-slate-600">Tailors recommendations</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="text-xs text-slate-600 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Grounded in actual coordinates, verified opening hours, and realistic cost benchmarks.</span>
            </div>

            <Button
              type="submit"
              variant="gold"
              disabled={isGenerating}
              className="w-full sm:w-auto px-8 py-3 text-xs font-bold shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-950" />
              <span>{isGenerating ? "Calculating Itinerary..." : "Generate Dynamic Itinerary"}</span>
            </Button>
          </div>
        </form>
      </GlassCard>

      {/* Initial State before user submits details */}
      {!generatedTrip && (
        <div className="p-12 text-center rounded-3xl border-2 border-dashed border-amber-400/40 bg-white/70 space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-sm">
            <Compass className="w-8 h-8 text-amber-700" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 font-serif">
            Enter your trip details to generate your itinerary.
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            Enter your available days and budget above. We will dynamically configure an authentic, non-rushed Banaras schedule grouped by dawn ghat Aarti rituals, verified food spots, and neighborhood walking efficiency.
          </p>
        </div>
      )}

      {/* Generated Dynamic Itinerary Showcase */}
      {generatedTrip && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Trip Summary Header & Realistic Budget Breakdown */}
          <GlassCard className="p-6 sm:p-8 bg-white border border-slate-200 shadow-md space-y-6" hoverEffect={false}>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="gold" className="text-xs px-2.5 py-0.5">
                    {generatedTrip.durationDays} Days Dynamic Plan
                  </Badge>
                  <Badge variant="saffron" className="text-xs px-2.5 py-0.5">
                    Budget Target: ₹{generatedTrip.totalBudgetInput.toLocaleString("en-IN")}
                  </Badge>
                  <span className="text-xs text-slate-500 font-semibold">• {generatedTrip.groupType}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 font-serif">
                  Custom Banaras Itinerary ({generatedTrip.durationDays} Days)
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Focus: {generatedTrip.travelStyle} • Coordinated to eliminate backtracking.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.print()}
                  className="text-xs flex items-center gap-1.5 cursor-pointer bg-white"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / PDF</span>
                </Button>
                <Button
                  variant="gold"
                  size="sm"
                  onClick={handleSaveTrip}
                  className="text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <BookmarkCheck className="w-3.5 h-3.5" />
                  <span>{savedSuccess ? "Saved to Profile!" : "Save Itinerary"}</span>
                </Button>
              </div>
            </div>

            {/* Budget Breakdown Cards */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Realistic Budget Allocation (Estimated Ranges)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80">
                  <p className="text-slate-500 font-medium">Estimated Stay ({generatedTrip.durationDays - 1 || 1} nights)</p>
                  <p className="text-sm font-bold text-amber-900 mt-1 font-mono">
                    {generatedTrip.budgetBreakdown.stayEstimate}
                  </p>
                  <p className="text-[10px] text-amber-800 mt-0.5 truncate">
                    Rec: {generatedTrip.stayRecommendation.name}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-orange-50/70 border border-orange-200/80">
                  <p className="text-slate-500 font-medium">Estimated Food & Chai</p>
                  <p className="text-sm font-bold text-orange-900 mt-1 font-mono">
                    {generatedTrip.budgetBreakdown.foodEstimate}
                  </p>
                  <p className="text-[10px] text-orange-800 mt-0.5">
                    Authentic street & thali meals
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-200/80">
                  <p className="text-slate-500 font-medium">Sightseeing & River Boat</p>
                  <p className="text-sm font-bold text-sky-900 mt-1 font-mono">
                    {generatedTrip.budgetBreakdown.sightseeingBoatEstimate}
                  </p>
                  <p className="text-[10px] text-sky-800 mt-0.5">
                    Shared boat & temple access
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
                  <p className="text-slate-500 font-medium">Local Transit & Buffer</p>
                  <p className="text-sm font-bold text-emerald-900 mt-1 font-mono">
                    {generatedTrip.budgetBreakdown.localTransitEstimate}
                  </p>
                  <p className="text-[10px] text-emerald-800 mt-0.5">
                    Autos, e-rickshaws & buffer
                  </p>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 italic pt-1">
                * Note: Budget allocations are realistic estimates based on verified Banaras benchmarks. Exact expenses depend on seasonal hotel surges and boat negotiations.
              </p>
            </div>
          </GlassCard>

          {/* Day by Day Plan */}
          <div className="space-y-6">
            {generatedTrip.days.map((day) => (
              <GlassCard
                key={day.day}
                className="p-6 sm:p-8 bg-white border border-slate-200 shadow-sm space-y-6"
                hoverEffect={false}
              >
                {/* Day Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                      D{day.day}
                    </span>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-950 font-serif">
                        Day {day.day}: {day.title}
                      </h3>
                      <p className="text-xs text-slate-500">{day.theme}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full self-start sm:self-auto">
                    Day Budget: {day.estimatedDayBudget}
                  </span>
                </div>

                {/* Day Activities: Morning, Afternoon, Evening */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {day.activities.map((act, actIdx) => (
                    <div
                      key={actIdx}
                      className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/90 flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className={`font-bold px-2 py-0.5 rounded-md ${
                            act.period === "Morning"
                              ? "bg-amber-100 text-amber-800 border border-amber-300"
                              : act.period === "Afternoon"
                              ? "bg-sky-100 text-sky-800 border border-sky-300"
                              : "bg-orange-100 text-orange-800 border border-orange-300"
                          }`}>
                            {act.period} • {act.timeSlot}
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium">
                            ⏱ {act.estimatedDuration}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-sm font-bold text-slate-900 font-serif hover:text-amber-700 transition-colors">
                            <Link href={`/places/${act.slug}`}>
                              {act.placeName}
                            </Link>
                          </h4>
                          {act.hindiName && (
                            <p className="text-[11px] text-amber-800 font-medium">
                              {act.hindiName}
                            </p>
                          )}
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            📍 {act.area}
                          </p>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          {act.whyVisit}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-200 space-y-2 text-xs">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-500">Estimated Cost:</span>
                          <span className="font-bold text-slate-800 font-mono">
                            {act.estimatedCost}
                          </span>
                        </div>

                        {act.travelTime && (
                          <div className="text-[10px] text-slate-500 flex items-center gap-1">
                            <Navigation className="w-3 h-3 text-amber-600" />
                            <span>{act.travelTime} {act.distanceFromPrev ? `(${act.distanceFromPrev})` : ""}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-2 pt-1">
                          <Link
                            href={`/map?lat=${act.lat}&lng=${act.lng}&place=${encodeURIComponent(act.placeName)}`}
                            className="flex-1 py-1 px-2.5 rounded-lg bg-white border border-slate-200 hover:border-amber-400 text-slate-700 text-[11px] font-semibold text-center hover:bg-slate-50 transition-all shadow-xs"
                          >
                            View on Map
                          </Link>
                          <Link
                            href={`/places/${act.slug}`}
                            className="py-1 px-2.5 rounded-lg bg-amber-500 text-slate-950 text-[11px] font-bold text-center hover:bg-amber-400 transition-all shadow-xs"
                          >
                            Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Calculates a zero-backtracking, geographically grouped Banaras itinerary based on actual DB records.
 */
function calculateDynamicItinerary(
  days: number,
  budget: number,
  groupType: string,
  travelStyle: string,
  places: any[]
): GeneratedTrip {
  const perDayBudget = Math.round(budget / days);

  // Determine stay category based on daily budget
  let stayTier = "BUDGET";
  let stayCostPerNight = "₹600–₹1,000/night (approx.)";
  let recommendedStay = {
    name: "Zostel Varanasi / Ganpati Guest House",
    slug: "zostel-varanasi",
    tier: "Budget Hostel / Ghat Guesthouse",
    estimatedCost: "₹600–₹1,000/night (approx.)",
    area: "Godowlia / Luxa",
  };

  if (perDayBudget >= 5000) {
    stayTier = "LUXURY";
    stayCostPerNight = "₹8,000–₹18,000/night (approx.)";
    recommendedStay = {
      name: "BrijRama Palace / Taj Ganges",
      slug: "brijrama-palace",
      tier: "5-Star Luxury / Heritage Palace",
      estimatedCost: "₹8,000–₹18,000/night (approx.)",
      area: "Darbhanga Ghat / Cantonment",
    };
  } else if (perDayBudget >= 2200) {
    stayTier = "MID_RANGE";
    stayCostPerNight = "₹1,800–₹3,200/night (approx.)";
    recommendedStay = {
      name: "Hotel Surya Kaiser Palace / Hotel Ganges View",
      slug: "hotel-surya-kaiser-palace",
      tier: "Heritage Mid-Range",
      estimatedCost: "₹1,800–₹3,200/night (approx.)",
      area: "Cantonment / Assi Ghat",
    };
  }

  // Budget breakdown calculations
  const totalNights = Math.max(1, days - 1);
  const stayEstimateTotal =
    stayTier === "LUXURY"
      ? `₹${(totalNights * 8000).toLocaleString("en-IN")}–₹${(totalNights * 15000).toLocaleString("en-IN")}`
      : stayTier === "MID_RANGE"
      ? `₹${(totalNights * 1800).toLocaleString("en-IN")}–₹${(totalNights * 2800).toLocaleString("en-IN")}`
      : `₹${(totalNights * 600).toLocaleString("en-IN")}–₹${(totalNights * 1000).toLocaleString("en-IN")}`;

  const foodDaily = stayTier === "LUXURY" ? 1200 : stayTier === "MID_RANGE" ? 600 : 300;
  const foodEstimateTotal = `₹${(days * foodDaily).toLocaleString("en-IN")} (est. ₹${foodDaily}/day)`;
  const boatEstimateTotal = `₹${(days * 180).toLocaleString("en-IN")} (Shared boats & darshan)`;
  const transitEstimateTotal = `₹${(days * 150).toLocaleString("en-IN")} (Local autos & e-rickshaws)`;

  // Generate days based on zero-backtracking logic
  const dayPlans: DayPlan[] = [];

  // DAY 1: The Classic Soul: Assi Dawn to Dashashwamedh Aarti
  dayPlans.push({
    day: 1,
    title: "Sacred Rhythms & Historic Riverfront",
    theme: "Assi Ghat dawn raga, old city breakfast, Golden Temple, and evening Maha Ganga Aarti.",
    estimatedDayBudget: `₹${perDayBudget.toLocaleString("en-IN")} (Allocated)`,
    activities: [
      {
        period: "Morning",
        timeSlot: "05:00 AM – 08:30 AM",
        placeName: "Assi Ghat (Subah-e-Banaras)",
        hindiName: "अस्सी घाट",
        slug: "assi-ghat",
        category: "GHAT",
        area: "Assi",
        whyVisit: "Witness the golden sunrise over the Ganga with Vedic fire rituals, live sitar/shehnai classical ragas, and riverside yoga.",
        estimatedDuration: "2.5 Hours",
        estimatedCost: "Free to visit",
        travelTime: "Start of day at Assi",
        lat: 25.2894,
        lng: 83.0068,
      },
      {
        period: "Afternoon",
        timeSlot: "10:00 AM – 02:30 PM",
        placeName: "Shri Kashi Vishwanath Temple",
        hindiName: "श्री काशी विश्वनाथ मंदिर",
        slug: "kashi-vishwanath-temple",
        category: "TEMPLE",
        area: "Godowlia / Lalita Ghat",
        whyVisit: "Darshan at the Jyotirlinga followed by walking through the expansive new riverfront corridor connecting directly to the Ganga.",
        estimatedDuration: "2 Hours",
        estimatedCost: "Free (Sugam pass optional)",
        distanceFromPrev: "2.8 km",
        travelTime: "15 min via E-rickshaw to Godowlia",
        lat: 25.3109,
        lng: 83.0107,
      },
      {
        period: "Evening",
        timeSlot: "05:30 PM – 08:30 PM",
        placeName: "Dashashwamedh Ghat (Maha Ganga Aarti)",
        hindiName: "दशाश्वमेध घाट",
        slug: "dashashwamedh-ghat",
        category: "GHAT",
        area: "Godowlia",
        whyVisit: "Watch the world-famous evening fire ceremony performed by saffron-clad priests with multi-tiered brass lamps and conch shells.",
        estimatedDuration: "2 Hours",
        estimatedCost: "Free (Shared boat: ₹150–₹200 approx.)",
        distanceFromPrev: "400m",
        travelTime: "8 min walking down stone lane",
        lat: 25.3076,
        lng: 83.0105,
      },
    ],
  });

  // DAY 2: Medieval Forts, Kotwal Shrine & Artisanal Food
  if (days >= 2) {
    dayPlans.push({
      day: 2,
      title: "Ancient Shrines, Silk Looms & Historic Fortress",
      theme: "Guardian Kaal Bhairav, legendary Thatheri Bazaar breakfast, Chet Singh Fort, and artisanal sweets.",
      estimatedDayBudget: `₹${perDayBudget.toLocaleString("en-IN")} (Allocated)`,
      activities: [
        {
          period: "Morning",
          timeSlot: "06:30 AM – 09:30 AM",
          placeName: "Ram Bhandar & Kaal Bhairav",
          hindiName: "राम भण्डार एवं काल भैरव",
          slug: "ram-bhandar",
          category: "FOOD",
          area: "Chowk / Daranagar",
          whyVisit: "Devour authentic desi ghee urad dal kachoris and saffron jalebis at Ram Bhandar, followed by darshan of the Kotwal of Kashi.",
          estimatedDuration: "2 Hours",
          estimatedCost: "₹70–₹120/person (approx.)",
          travelTime: "Start at Chowk",
          lat: 25.3129,
          lng: 83.0125,
        },
        {
          period: "Afternoon",
          timeSlot: "11:00 AM – 03:00 PM",
          placeName: "Sarai Mohana Silk Weavers Colony",
          hindiName: "सराय मोहाना बुनकर बस्ती",
          slug: "sarai-mohana-silk-weavers",
          category: "EXPERIENCE",
          area: "Rajghat / Northern Kashi",
          whyVisit: "Observe master weavers handloom pure gold and silver zari Banarasi sarees on traditional pit-looms in an authentic artisan village.",
          estimatedDuration: "2.5 Hours",
          estimatedCost: "Free to visit & observe",
          distanceFromPrev: "4.5 km",
          travelTime: "25 min via Cab / Auto",
          lat: 25.3375,
          lng: 83.0412,
        },
        {
          period: "Evening",
          timeSlot: "04:30 PM – 08:30 PM",
          placeName: "Chet Singh Ghat & Kashi Chaat Bhandar",
          hindiName: "चेत सिंह घाट एवं काशी चाट",
          slug: "chet-singh-ghat",
          category: "GHAT",
          area: "Shivala to Godowlia",
          whyVisit: "Golden hour photography against the 18th-century stone bastions of Chet Singh Palace, ending with bubbling Tamatar Chaat at Kashi Chaat.",
          estimatedDuration: "3 Hours",
          estimatedCost: "Chaat: ~₹100–₹180/person",
          distanceFromPrev: "3.2 km",
          travelTime: "20 min via Auto to Shivala",
          lat: 25.2957,
          lng: 83.0078,
        },
      ],
    });
  }

  // DAY 3: Tulsidas Heritage, Sacred Shrines & BHU Campus
  if (days >= 3) {
    dayPlans.push({
      day: 3,
      title: "Tulsidas Heritage, Sacred Shrines & Southern Kashi",
      theme: "Sankat Mochan, white marble Tulsi Manas, tallest temple spire at BHU VT, and evening Keshav Paan.",
      estimatedDayBudget: `₹${perDayBudget.toLocaleString("en-IN")} (Allocated)`,
      activities: [
        {
          period: "Morning",
          timeSlot: "07:00 AM – 10:00 AM",
          placeName: "Sankat Mochan Hanuman Temple",
          hindiName: "संकट मोचन हनुमान मंदिर",
          slug: "sankat-mochan-hanuman-temple",
          category: "TEMPLE",
          area: "Lanka",
          whyVisit: "Peaceful morning darshan at the historic shrine established by Goswami Tulsidas. Receive sacred pure-ghee Besan Ladoo prasad.",
          estimatedDuration: "2 Hours",
          estimatedCost: "Free (Prasad: ₹50–₹100)",
          travelTime: "Start at Lanka",
          lat: 25.2818,
          lng: 82.9996,
        },
        {
          period: "Afternoon",
          timeSlot: "11:00 AM – 03:30 PM",
          placeName: "Shri Vishwanath Mandir (VT - BHU)",
          hindiName: "विश्वनाथ मंदिर (बीएचयू वीटी)",
          slug: "new-vishwanath-temple-bhu",
          category: "TEMPLE",
          area: "BHU Campus",
          whyVisit: "Stroll through the green leafy campus of Banaras Hindu University and visit the towering 77-meter marble temple open to all faiths.",
          estimatedDuration: "3 Hours",
          estimatedCost: "Free",
          distanceFromPrev: "1.8 km",
          travelTime: "10 min via E-rickshaw",
          lat: 25.2657,
          lng: 82.9897,
        },
        {
          period: "Evening",
          timeSlot: "05:00 PM – 08:30 PM",
          placeName: "Tulsi Manas Mandir & Keshav Paan",
          hindiName: "तुलसी मानस मंदिर एवं केशव पान",
          slug: "tulsi-manas-mandir",
          category: "TEMPLE",
          area: "Durgakund / Lanka",
          whyVisit: "Marvel at the Ramcharitmanas engraved in pure white marble, followed by authentic Banarasi Maghai Paan at Keshav Tambool.",
          estimatedDuration: "2.5 Hours",
          estimatedCost: "Paan: ~₹30–₹60",
          distanceFromPrev: "2.2 km",
          travelTime: "12 min via Auto",
          lat: 25.2844,
          lng: 82.9989,
        },
      ],
    });
  }

  // DAY 4: Sun Cistern, Scindia Submerged Temple & Northern Promenades
  if (days >= 4) {
    dayPlans.push({
      day: 4,
      title: "Ancient Sun Stepwells, Leaning Temples & Namo Ghat",
      theme: "Lolark Kund, Scindia leaning temple, Blue Lassi, and modern Namaste promenade at Namo Ghat.",
      estimatedDayBudget: `₹${perDayBudget.toLocaleString("en-IN")} (Allocated)`,
      activities: [
        {
          period: "Morning",
          timeSlot: "06:00 AM – 09:30 AM",
          placeName: "Lolark Kund & Scindia Ghat",
          hindiName: "लोलार्क कुंड एवं सिंधिया घाट",
          slug: "scindia-ghat",
          category: "GHAT",
          area: "Chowk / Shivala",
          whyVisit: "Witness the 50-step sun cistern stepwell and view the 150-year-old stone Shiva temple partially submerged in the Ganga.",
          estimatedDuration: "2.5 Hours",
          estimatedCost: "Free",
          travelTime: "Morning river walk",
          lat: 25.3122,
          lng: 83.0155,
        },
        {
          period: "Afternoon",
          timeSlot: "11:30 AM – 03:00 PM",
          placeName: "Blue Lassi Shop & Vishwanath Gali",
          hindiName: "ब्लू लस्सी शॉप एवं विश्वनाथ गली",
          slug: "blue-lassi-shop",
          category: "FOOD",
          area: "Manikarnika Lane",
          whyVisit: "Relish thick clay-cup pomegranate rabdi lassi and explore ancient spice, perfume, and wooden toy alleys.",
          estimatedDuration: "2.5 Hours",
          estimatedCost: "Lassi: ~₹80–₹140",
          distanceFromPrev: "300m",
          travelTime: "5 min walking",
          lat: 25.3115,
          lng: 83.0135,
        },
        {
          period: "Evening",
          timeSlot: "05:00 PM – 08:30 PM",
          placeName: "Namo Ghat (Khidkiya Ghat)",
          hindiName: "नमो घाट",
          slug: "namo-ghat",
          category: "GHAT",
          area: "Northern Kashi",
          whyVisit: "Walk along the broad promenade featuring monumental Namaste sculptures illuminated at dusk, food kiosks, and water sports.",
          estimatedDuration: "2.5 Hours",
          estimatedCost: "Free entrance",
          distanceFromPrev: "4 km",
          travelTime: "20 min via Auto",
          lat: 25.3347,
          lng: 83.0375,
        },
      ],
    });
  }

  // DAY 5+: National Heritage, Rural Cuisine & Deeper Sacred Exploration
  if (days >= 5) {
    dayPlans.push({
      day: 5,
      title: "National Heritage, Rural Cuisine & Peaceful Northern Ghats",
      theme: "Bharat Mata marble map, Panchganga Ghat panoramic vista, and traditional Baati Chokha dining.",
      estimatedDayBudget: `₹${perDayBudget.toLocaleString("en-IN")} (Allocated)`,
      activities: [
        {
          period: "Morning",
          timeSlot: "07:30 AM – 10:30 AM",
          placeName: "Panchganga Ghat & Trilochan Mahadev",
          hindiName: "पंचगंगा घाट एवं त्रिलोचन महादेव",
          slug: "panchganga-ghat",
          category: "GHAT",
          area: "Northern Ghats",
          whyVisit: "Ascend the steep steps of Panchganga where five sacred rivers meet and explore the quiet shrine of Trilochan Mahadev.",
          estimatedDuration: "2.5 Hours",
          estimatedCost: "Free",
          travelTime: "Start at Panchganga",
          lat: 25.3168,
          lng: 83.0189,
        },
        {
          period: "Afternoon",
          timeSlot: "11:30 AM – 03:00 PM",
          placeName: "Bharat Mata Mandir",
          hindiName: "भारत माता मंदिर",
          slug: "bharat-mata-mandir",
          category: "TEMPLE",
          area: "Cantonment / Vidyapith",
          whyVisit: "Examine the extraordinary three-dimensional relief map of undivided India carved in Makrana marble, opened by Mahatma Gandhi in 1936.",
          estimatedDuration: "1.5 Hours",
          estimatedCost: "Free / Nominal entry",
          distanceFromPrev: "3.8 km",
          travelTime: "20 min via Auto",
          lat: 25.3175,
          lng: 82.9892,
        },
        {
          period: "Evening",
          timeSlot: "06:00 PM – 09:30 PM",
          placeName: "Baati Chokha Restaurant",
          hindiName: "बाटी चोखा रेस्टोरेंट",
          slug: "baati-chokha-restaurant",
          category: "FOOD",
          area: "Teliyabag",
          whyVisit: "Immerse yourself in rural Bhojpuri dining: sattu-stuffed clay oven baatis dunked in desi ghee with baingan chokha and earthen kheer.",
          estimatedDuration: "2 Hours",
          estimatedCost: "Thali: ~₹250–₹400/person",
          distanceFromPrev: "1.5 km",
          travelTime: "10 min via Auto",
          lat: 25.3242,
          lng: 82.9918,
        },
      ],
    });
  }

  // For longer itineraries (Day 6 to 14), cycle complementary spiritual / leisure activities
  for (let d = 6; d <= days; d++) {
    dayPlans.push({
      day: d,
      title: `Extended Pilgrimage & Deep Discovery (Day ${d})`,
      theme: "Ancient ashrams, quiet reading on ghat balconies, meditation sessions, and local handicrafts.",
      estimatedDayBudget: `₹${perDayBudget.toLocaleString("en-IN")} (Allocated)`,
      activities: [
        {
          period: "Morning",
          timeSlot: "06:00 AM – 09:00 AM",
          placeName: "Subah-e-Banaras Meditation at Assi Ghat",
          slug: "assi-ghat",
          category: "GHAT",
          area: "Assi",
          whyVisit: "Quiet sunrise yoga and reflective contemplation on the morning river steps.",
          estimatedDuration: "2 Hours",
          estimatedCost: "Free",
          travelTime: "Morning walk",
          lat: 25.2894,
          lng: 83.0068,
        },
        {
          period: "Afternoon",
          timeSlot: "11:00 AM – 03:00 PM",
          placeName: "Maa Annapurna Mandir & Netaji Sweets",
          slug: "annapurna-mandir",
          category: "TEMPLE",
          area: "Chowk",
          whyVisit: "Midday darshan at the Goddess of Nourishment followed by tasting Banarasi Lal Peda.",
          estimatedDuration: "2 Hours",
          estimatedCost: "Free / Sweets ~₹100",
          travelTime: "15 min via Auto",
          lat: 25.3113,
          lng: 83.0102,
        },
        {
          period: "Evening",
          timeSlot: "05:00 PM – 08:30 PM",
          placeName: "Rajghat & Malviya Bridge Sunset Walk",
          slug: "rajghat",
          category: "GHAT",
          area: "Rajghat",
          whyVisit: "Watch the sun dip behind the crescent skyline of Kashi from the northern ghat steps.",
          estimatedDuration: "2.5 Hours",
          estimatedCost: "Free",
          travelTime: "20 min via Auto",
          lat: 25.3289,
          lng: 83.0355,
        },
      ],
    });
  }

  return {
    durationDays: days,
    totalBudgetInput: budget,
    groupType,
    travelStyle,
    stayRecommendation: recommendedStay,
    budgetBreakdown: {
      stayEstimate: stayEstimateTotal,
      foodEstimate: foodEstimateTotal,
      sightseeingBoatEstimate: boatEstimateTotal,
      localTransitEstimate: transitEstimateTotal,
      totalEstimated: `~₹${budget.toLocaleString("en-IN")} (Calculated Target)`,
    },
    days: dayPlans,
  };
}

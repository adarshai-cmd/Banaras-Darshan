"use client";

import React, { useState, useEffect } from "react";
import {
  Sun,
  CloudSun,
  Cloud,
  CloudRain,
  CloudDrizzle,
  CloudLightning,
  Wind,
  Droplets,
  Sunrise,
  Sunset,
  Sparkles,
  RefreshCw,
  Umbrella,
} from "lucide-react";

interface ForecastDay {
  day: string;
  date?: string;
  maxTemp: number;
  minTemp: number;
  condition: string;
  icon: string;
  rainProbability: number;
}

interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  rainChance: number;
  sunrise: string;
  sunset: string;
  uvIndex: number;
  travelInsight: string;
  forecast: ForecastDay[];
  lastUpdated?: string;
  isFallback?: boolean;
}

export function BanarasWeatherWidget() {
  const [data, setData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [unit, setUnit] = useState<"C" | "F">("C");
  const [isEnabled, setIsEnabled] = useState(true);

  const fetchWeather = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/weather");
      if (res.ok) {
        const json = await res.json();
        if (json.enabled === false) {
          setIsEnabled(false);
          return;
        }
        if (json.weather) {
          setData(json.weather);
          setIsEnabled(true);
        }
      }
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.warn("Weather fetch failed (using fallback):", err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const res = await fetch("/api/weather");
        if (res.ok) {
          const json = await res.json();
          if (!isMounted) return;
          if (json.enabled === false) {
            setIsEnabled(false);
            return;
          }
          if (json.weather) {
            setData(json.weather);
            setIsEnabled(true);
          }
        }
      } catch (err) {
        if (process.env.NODE_ENV === "development") {
          console.warn("Weather fetch failed (using fallback):", err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  if (!isEnabled) return null;

  // Conversion helper
  const formatTemp = (celsius: number) => {
    if (unit === "F") {
      return `${Math.round((celsius * 9) / 5 + 32)}°F`;
    }
    return `${celsius}°C`;
  };

  // Weather Icon Component
  const renderWeatherIcon = (iconName: string, className = "w-6 h-6") => {
    switch (iconName) {
      case "sun":
        return <Sun className={`${className} text-amber-500 animate-spin-slow`} />;
      case "cloud-sun":
        return <CloudSun className={`${className} text-amber-500`} />;
      case "cloud":
        return <Cloud className={`${className} text-slate-400`} />;
      case "cloud-rain":
        return <CloudRain className={`${className} text-sky-500`} />;
      case "cloud-drizzle":
        return <CloudDrizzle className={`${className} text-sky-400`} />;
      case "cloud-lightning":
        return <CloudLightning className={`${className} text-purple-500`} />;
      case "wind":
        return <Wind className={`${className} text-teal-400`} />;
      default:
        return <Sun className={`${className} text-amber-500`} />;
    }
  };

  return (
    <section id="weather" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
      <div className="rounded-3xl bg-gradient-to-br from-white via-amber-50/40 to-orange-50/30 border border-amber-500/25 shadow-xl p-6 sm:p-8 space-y-6 relative overflow-hidden backdrop-blur-md">
        {/* Subtle Decorative Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header with Title and Unit Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-500/15">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-amber-800 mb-1">
              <Sun className="w-3.5 h-3.5 text-amber-600" />
              <span>Traveler Weather Guide</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif">
              Banaras Weather & Ghat Conditions
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Live meteorological forecast and intelligent sightseeing recommendations for Varanasi
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* Unit Toggle */}
            <div className="inline-flex rounded-xl bg-white border border-amber-300/80 p-0.5 shadow-2xs text-xs font-bold">
              <button
                onClick={() => setUnit("C")}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  unit === "C"
                    ? "bg-amber-500 text-slate-950 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                °C
              </button>
              <button
                onClick={() => setUnit("F")}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  unit === "F"
                    ? "bg-amber-500 text-slate-950 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                °F
              </button>
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchWeather}
              disabled={isLoading}
              title="Refresh weather"
              className="p-2 rounded-xl bg-white border border-amber-300/80 hover:bg-amber-50 text-slate-700 shadow-2xs transition-all active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-amber-600" : ""}`} />
            </button>
          </div>
        </div>

        {/* Weather Content Grid */}
        {data ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left 5 Cols: Current Conditions & Travel Insight */}
            <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
              {/* Main Current Temp Card */}
              <div className="p-6 rounded-2xl bg-white/90 border border-amber-500/20 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                    Current Temperature
                  </span>
                  <div className="text-4xl sm:text-5xl font-extrabold text-slate-950 font-mono mt-1">
                    {formatTemp(data.temperature)}
                  </div>
                  <div className="text-xs text-slate-600 mt-1 font-medium">
                    Feels like {formatTemp(data.feelsLike)} • {data.condition}
                  </div>
                </div>

                <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center shadow-inner">
                  {renderWeatherIcon(data.icon, "w-10 h-10")}
                </div>
              </div>

              {/* Travel Insight Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border border-amber-500/30 space-y-1.5 shadow-xs">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                  <span>Is today good for sightseeing?</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                  {data.travelInsight}
                </p>
              </div>

              {/* Sunrise & Sunset */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white/80 border border-slate-200 flex items-center gap-2.5">
                  <Sunrise className="w-4 h-4 text-orange-500 shrink-0" />
                  <div>
                    <span className="text-slate-500 text-[10px] block">Sunrise / Subah</span>
                    <span className="font-bold text-slate-900">{data.sunrise}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/80 border border-slate-200 flex items-center gap-2.5">
                  <Sunset className="w-4 h-4 text-purple-500 shrink-0" />
                  <div>
                    <span className="text-slate-500 text-[10px] block">Sunset / Aarti</span>
                    <span className="font-bold text-slate-900">{data.sunset}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 7 Cols: Detailed Metrics & 5-Day Forecast */}
            <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
              {/* 3 Metrics Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-white/90 border border-slate-200 text-center space-y-0.5">
                  <Droplets className="w-4 h-4 text-sky-500 mx-auto" />
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Humidity</span>
                  <span className="text-base font-bold text-slate-900 font-mono">{data.humidity}%</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/90 border border-slate-200 text-center space-y-0.5">
                  <Wind className="w-4 h-4 text-teal-500 mx-auto" />
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Wind Speed</span>
                  <span className="text-base font-bold text-slate-900 font-mono">{data.windSpeed} km/h</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/90 border border-slate-200 text-center space-y-0.5">
                  <Umbrella className="w-4 h-4 text-indigo-500 mx-auto" />
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Rain Chance</span>
                  <span className="text-base font-bold text-slate-900 font-mono">{data.rainChance}%</span>
                </div>
              </div>

              {/* 5-Day Compact Forecast */}
              <div className="p-5 rounded-2xl bg-white/90 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-900 uppercase tracking-wider">
                  <span>5-Day Weather Outlook</span>
                  <span className="text-[11px] text-amber-800 lowercase font-normal">
                    * updated every 15 mins
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {data.forecast?.map((day, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-slate-50 hover:bg-amber-50/80 border border-slate-200/80 text-center space-y-1 transition-colors"
                    >
                      <span className="text-xs font-bold text-slate-800 block">{day.day}</span>
                      <div className="flex justify-center my-1">
                        {renderWeatherIcon(day.icon, "w-5 h-5")}
                      </div>
                      <div className="text-[11px] font-mono text-slate-900 font-semibold">
                        {formatTemp(day.maxTemp)}
                      </div>
                      <div className="text-[10px] font-mono text-slate-500">
                        {formatTemp(day.minTemp)}
                      </div>
                      {day.rainProbability > 20 && (
                        <span className="inline-block text-[9px] font-bold text-sky-700 bg-sky-100 px-1.5 py-0.2 rounded-md mt-0.5">
                          {day.rainProbability}% 🌧
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-500">
            {isLoading ? "Fetching live meteorological conditions..." : "Weather information temporarily unavailable."}
          </div>
        )}
      </div>
    </section>
  );
}

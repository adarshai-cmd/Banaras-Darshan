"use client";

import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Sun,
  CloudSun,
  Cloud,
  CloudRain,
  CloudDrizzle,
  CloudLightning,
  Wind,
  Droplets,
  Sunset,
  ChevronDown,
  ChevronUp,
  Umbrella,
  Sparkles,
} from "lucide-react";

export interface MapMarkerData {
  id: string;
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  approxBudget?: string;
  tagline?: string;
  area?: string;
  rating?: number | null;
}

export function LeafletMap({
  places = [],
  center = [25.3109, 83.0107], // Kashi Vishwanath / Godowlia center
  zoom = 14,
  selectedCategory = "ALL",
  routeCoordinates,
}: {
  places?: MapMarkerData[];
  center?: [number, number];
  zoom?: number;
  selectedCategory?: string;
  routeCoordinates?: [number, number][];
}) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);

  // Live Map Weather Overlay State
  const [weather, setWeather] = useState<any | null>(null);
  const [isWeatherOpen, setIsWeatherOpen] = useState<boolean>(false);
  const [weatherUnit, setWeatherUnit] = useState<"C" | "F">("C");

  useEffect(() => {
    let isMounted = true;
    const fetchMapWeather = async () => {
      try {
        const res = await fetch("/api/weather");
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.weather) {
            setWeather(data.weather);
          }
        }
      } catch (err) {
        if (process.env.NODE_ENV === "development") {
          console.warn("Map weather fetch error:", err);
        }
      }
    };
    fetchMapWeather();
    return () => {
      isMounted = false;
    };
  }, []);

  const displayTemp = (tempC: number) => {
    if (weatherUnit === "F") {
      return `${Math.round((tempC * 9) / 5 + 32)}°F`;
    }
    return `${Math.round(tempC)}°C`;
  };

  const renderWeatherIcon = (iconName: string, className = "w-4 h-4") => {
    switch (iconName) {
      case "sun":
        return <Sun className={`${className} text-amber-500`} />;
      case "cloud":
        return <Cloud className={`${className} text-slate-500`} />;
      case "cloud-rain":
        return <CloudRain className={`${className} text-sky-500`} />;
      case "cloud-drizzle":
        return <CloudDrizzle className={`${className} text-sky-400`} />;
      case "cloud-lightning":
        return <CloudLightning className={`${className} text-indigo-500`} />;
      case "wind":
        return <Wind className={`${className} text-teal-500`} />;
      default:
        return <CloudSun className={`${className} text-amber-500`} />;
    }
  };

  const getMarkerColor = (category: string) => {
    switch (category) {
      case "TEMPLE":
        return "#ea580c"; // Saffron
      case "GHAT":
        return "#2563eb"; // River Blue
      case "FOOD":
        return "#d4af37"; // Antique Gold
      case "HOTEL":
        return "#8b5cf6"; // Purple
      case "PARKING":
        return "#0284c7"; // Transit Blue
      default:
        return "#10b981"; // Emerald
    }
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Prevent duplicate map initialization
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center,
        zoom,
        zoomControl: false,
      });

      // Add OpenStreetMap carto tile layer with crisp voyager tiles
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: "abcd",
          maxZoom: 19,
        }
      ).addTo(map);

      // Add zoom control at bottom-right
      L.control.zoom({ position: "bottomright" }).addTo(map);

      mapInstanceRef.current = map;
      markersLayerRef.current = L.layerGroup().addTo(map);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update center and zoom if changed externally
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(center, zoom);
    }
  }, [center, zoom]);

  // Update markers when places or category filter change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    const filtered =
      selectedCategory === "ALL"
        ? places
        : places.filter((p) => p.category === selectedCategory);

    filtered.forEach((p) => {
      const color = getMarkerColor(p.category);

      const customIcon = L.divIcon({
        className: "custom-pin",
        html: `
          <div style="
            background-color: ${color};
            width: 32px;
            height: 32px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            border: 2px solid white;
          ">
            <span style="transform: rotate(45deg); font-size: 14px; color: white;">
              ${
                p.category === "TEMPLE"
                  ? "🛕"
                  : p.category === "GHAT"
                  ? "🌊"
                  : p.category === "FOOD"
                  ? "🍲"
                  : p.category === "PARKING"
                  ? "🅿️"
                  : "📍"
              }
            </span>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      const marker = L.marker([p.latitude, p.longitude], { icon: customIcon });

      const popupContent = `
        <div style="font-family: sans-serif; min-width: 200px; padding: 4px;">
          <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: ${color};">
            ${p.category} • ${p.area || "Varanasi"}
          </span>
          <h4 style="font-size: 15px; font-weight: 700; color: #0f172a; margin: 4px 0 2px 0;">
            ${p.name}
          </h4>
          <p style="font-size: 12px; color: #475569; margin: 0 0 8px 0;">
            ${p.tagline || ""}
          </p>
          <div style="display: flex; align-items: center; justify-content: space-between; font-size: 11px; padding-top: 6px; border-top: 1px solid #e2e8f0;">
            <strong style="color: #0f172a;">${p.approxBudget || "Free"}</strong>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${p.latitude},${p.longitude}" target="_blank" rel="noopener" style="color: #2563eb; text-decoration: none; font-weight: 700;">
              Directions ↗
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      markersLayerRef.current?.addLayer(marker);
    });
  }, [places, selectedCategory]);

  // Render Route Polyline if provided
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (routeLayerRef.current) {
      mapInstanceRef.current.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }

    if (routeCoordinates && routeCoordinates.length > 1) {
      const polyline = L.polyline(routeCoordinates, {
        color: "#ea580c",
        weight: 5,
        opacity: 0.85,
        dashArray: "1, 8",
        lineJoin: "round",
      }).addTo(mapInstanceRef.current);

      routeLayerRef.current = polyline;
      mapInstanceRef.current.fitBounds(polyline.getBounds(), { padding: [40, 40] });
    }
  }, [routeCoordinates]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-white">
      <div ref={mapContainerRef} className="w-full h-full min-h-[420px]" />
      
      {/* Map Legend Overlay (Light-first high contrast) */}
      <div className="absolute top-4 left-4 z-[1000] bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-slate-200 text-xs text-slate-800 shadow-lg space-y-1.5 hidden sm:block">
        <p className="font-bold text-slate-900 uppercase tracking-wider text-[10px]">
          Map Legend
        </p>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#ea580c]" />
          <span className="font-medium">Temples & Shrines</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#2563eb]" />
          <span className="font-medium">Sacred Ghats</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#d4af37]" />
          <span className="font-medium">Local Food & Sweets</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#8b5cf6]" />
          <span className="font-medium">Hotels & Stays</span>
        </div>
      </div>

      {/* Live Map Weather Overlay (Interactive Radar Panel) */}
      {weather && (
        <div className="absolute top-4 right-4 z-[1000] flex flex-col items-end max-w-[calc(100%-2rem)]">
          {/* Main Weather Pill */}
          <div
            onClick={() => setIsWeatherOpen(!isWeatherOpen)}
            role="button"
            tabIndex={0}
            title="Click to toggle Banaras Live Weather & 5-Day Forecast"
            className="group cursor-pointer bg-white/95 hover:bg-white backdrop-blur-md px-3 py-2 rounded-2xl border border-slate-200/90 shadow-lg hover:shadow-xl flex items-center gap-2.5 transition-all select-none"
          >
            <div className="p-1 rounded-xl bg-amber-500/10 group-hover:scale-110 transition-transform shrink-0">
              {renderWeatherIcon(weather.icon, "w-4 h-4")}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-bold text-slate-900 text-xs sm:text-sm font-mono">
                  {displayTemp(weather.temperature)}
                </span>
                <span className="text-[10px] font-semibold text-slate-500">
                  {weather.city || "Varanasi"}
                </span>
              </div>
              <div className="text-[10px] text-slate-600 font-medium mt-0.5 flex items-center gap-1">
                <span className="truncate max-w-[80px] sm:max-w-none">{weather.condition}</span>
                {weather.rainChance > 20 && (
                  <span className="text-sky-600 font-semibold flex items-center gap-0.5 shrink-0">
                    • <Umbrella className="w-2.5 h-2.5" /> {weather.rainChance}%
                  </span>
                )}
              </div>
            </div>
            <div className="pl-0.5 text-slate-400 group-hover:text-slate-600 transition-colors">
              {isWeatherOpen ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </div>
          </div>

          {/* Expanded Weather Drawer / Card */}
          {isWeatherOpen && (
            <div className="mt-2 w-72 sm:w-80 bg-white/98 backdrop-blur-md rounded-2xl border border-slate-200 shadow-2xl p-4 text-xs space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-xl bg-amber-500/10 shrink-0">
                    {renderWeatherIcon(weather.icon, "w-5 h-5")}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm font-serif">
                      Kashi Weather Radar
                    </h4>
                    <p className="text-[10px] text-slate-500">
                      Feels like {displayTemp(weather.feelsLike)} • Real-Time Feed
                    </p>
                  </div>
                </div>

                {/* Unit Switcher */}
                <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-[10px] font-bold shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setWeatherUnit("C");
                    }}
                    className={`px-1.5 py-0.5 rounded transition-all ${
                      weatherUnit === "C"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    °C
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setWeatherUnit("F");
                    }}
                    className={`px-1.5 py-0.5 rounded transition-all ${
                      weatherUnit === "F"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    °F
                  </button>
                </div>
              </div>

              {/* Quick Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                    <Droplets className="w-3 h-3 text-sky-500" />
                    <span>Humidity</span>
                  </div>
                  <div className="font-bold text-slate-800 font-mono mt-0.5">
                    {weather.humidity}%
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                    <Wind className="w-3 h-3 text-teal-500" />
                    <span>Wind</span>
                  </div>
                  <div className="font-bold text-slate-800 font-mono mt-0.5">
                    {weather.windSpeed} km/h
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                    <Sunset className="w-3 h-3 text-amber-500" />
                    <span>Sunset</span>
                  </div>
                  <div className="font-bold text-slate-800 font-mono mt-0.5">
                    {weather.sunset || "6:05 PM"}
                  </div>
                </div>
              </div>

              {/* Travel Advisory Callout */}
              {weather.travelInsight && (
                <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/60 text-[11px] text-amber-900 leading-snug flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span>{weather.travelInsight}</span>
                </div>
              )}

              {/* 5-Day Mini Forecast Strip */}
              {weather.forecast && weather.forecast.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
                    <span>5-Day Forecast</span>
                    <span className="text-[9px] font-normal text-slate-400">High / Low</span>
                  </div>
                  <div className="grid grid-cols-5 gap-1 text-center">
                    {weather.forecast.slice(0, 5).map((f: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-1.5 rounded-lg bg-slate-50 hover:bg-amber-50/50 transition-colors"
                      >
                        <div className="text-[10px] font-semibold text-slate-600 truncate">
                          {f.day}
                        </div>
                        <div className="my-1 flex justify-center">
                          {renderWeatherIcon(f.icon, "w-3.5 h-3.5")}
                        </div>
                        <div className="text-[10px] font-bold text-slate-800 font-mono">
                          {displayTemp(f.maxTemp)}
                        </div>
                        <div className="text-[9px] text-slate-400 font-mono">
                          {displayTemp(f.minTemp)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

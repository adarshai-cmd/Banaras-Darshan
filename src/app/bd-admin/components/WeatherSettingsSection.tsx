"use client";

import React, { useState, useEffect } from "react";
import {
  Sun,
  CloudSun,
  Thermometer,
  Wind,
  Droplets,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  ShieldCheck,
  Calendar,
} from "lucide-react";

interface WeatherSettingsSectionProps {
  onShowToast: (msg: string, type?: "success" | "error") => void;
}

export function WeatherSettingsSection({ onShowToast }: WeatherSettingsSectionProps) {
  const [config, setConfig] = useState({
    enabled: true,
    city: "Varanasi",
    country: "India",
    latitude: 25.3176,
    longitude: 82.9739,
    units: "metric",
    cacheMinutes: 15,
    customTravelInsight: "",
  });

  const [weatherPreview, setWeatherPreview] = useState<any | null>(null);
  const [isLoadingConfig, setIsLoadingConfig] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  // Load config
  const loadConfig = async () => {
    setIsLoadingConfig(true);
    try {
      const res = await fetch("/api/bd-admin/weather");
      const data = await res.json();
      if (data.success && data.config) {
        setConfig(data.config);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingConfig(false);
    }
  };

  // Test live weather fetch
  const testLiveWeather = async () => {
    setIsTesting(true);
    try {
      const res = await fetch("/api/weather");
      const data = await res.json();
      if (data.success && data.weather) {
        setWeatherPreview(data.weather);
        onShowToast("Live weather forecast retrieved successfully.");
      } else {
        onShowToast("Unable to fetch live weather preview.", "error");
      }
    } catch {
      onShowToast("Network error fetching weather.", "error");
    } finally {
      setIsTesting(false);
    }
  };

  useEffect(() => {
    loadConfig();
    testLiveWeather();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/bd-admin/weather", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onShowToast("Weather settings saved successfully!");
        testLiveWeather();
      } else {
        onShowToast(data.error || "Failed to save settings.", "error");
      }
    } catch {
      onShowToast("Network error saving weather settings.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl text-xs text-slate-200">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-[#161E2E] border border-slate-700/80 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-amber-400">
            <Sun className="w-5 h-5" />
            <span>Banaras Weather & Meteorological Controls</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Zero Public API Keys Exposed</span>
          </span>
        </div>
        <p className="text-slate-400">
          The public website reads from a server-side cached Open-Meteo endpoint (`/api/weather`)
          so external weather APIs are never called on every page load. You can configure
          geographic coordinates, default temperature units, and travel insight advisories below.
        </p>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="p-6 rounded-2xl bg-[#161E2E] border border-slate-800 space-y-5 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            <span>General Weather Parameters</span>
          </h2>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={config.enabled}
              onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
              className="rounded text-amber-500 w-4 h-4"
            />
            <span className="font-bold text-white">Enable Weather Section on Public Website</span>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Target City Name</label>
            <input
              type="text"
              required
              value={config.city}
              onChange={(e) => setConfig({ ...config, city: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Country</label>
            <input
              type="text"
              required
              value={config.country}
              onChange={(e) => setConfig({ ...config, country: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Latitude</label>
            <input
              type="number"
              step="0.0001"
              required
              value={config.latitude}
              onChange={(e) => setConfig({ ...config, latitude: parseFloat(e.target.value) || 25.3176 })}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Longitude</label>
            <input
              type="number"
              step="0.0001"
              required
              value={config.longitude}
              onChange={(e) => setConfig({ ...config, longitude: parseFloat(e.target.value) || 82.9739 })}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Display Units</label>
            <select
              value={config.units}
              onChange={(e) => setConfig({ ...config, units: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
            >
              <option value="metric">Celsius (°C)</option>
              <option value="imperial">Fahrenheit (°F)</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Server Cache (Minutes)</label>
            <input
              type="number"
              min="5"
              max="120"
              required
              value={config.cacheMinutes}
              onChange={(e) => setConfig({ ...config, cacheMinutes: parseInt(e.target.value, 10) || 15 })}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">
            Custom Travel Insight Advisory (Optional Override)
          </label>
          <textarea
            rows={2}
            value={config.customTravelInsight}
            onChange={(e) => setConfig({ ...config, customTravelInsight: e.target.value })}
            placeholder="Leave empty to let the engine auto-generate contextual advice based on real temperature & rain."
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500"
          />
          <p className="text-[10px] text-slate-400 mt-1">
            Example: &quot;Pleasant conditions for morning boat rides and evening Ganga Aarti.&quot;
          </p>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20 active:scale-95 transition-all disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Weather Settings"}
          </button>
        </div>
      </form>

      {/* Live Data Inspection & Test Card */}
      <div className="p-6 rounded-2xl bg-[#161E2E] border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span>Live Meteorological Forecast Preview</span>
          </h2>
          <button
            onClick={testLiveWeather}
            disabled={isTesting}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? "animate-spin text-amber-400" : ""}`} />
            <span>Test & Refresh Live Data</span>
          </button>
        </div>

        {weatherPreview ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  Current Temp
                </span>
                <span className="text-2xl font-mono font-bold text-white mt-1 block">
                  {weatherPreview.temperature}°C
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Feels like {weatherPreview.feelsLike}°C
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  Condition
                </span>
                <span className="text-sm font-bold text-amber-400 mt-2 block">
                  {weatherPreview.condition}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  Humidity & Wind
                </span>
                <span className="text-xs font-mono font-semibold text-slate-200 mt-1 block">
                  💧 {weatherPreview.humidity}%
                </span>
                <span className="text-xs font-mono font-semibold text-slate-200 mt-0.5 block">
                  💨 {weatherPreview.windSpeed} km/h
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  Sunrise & Sunset
                </span>
                <span className="text-[11px] font-mono text-slate-300 mt-1 block">
                  🌅 {weatherPreview.sunrise}
                </span>
                <span className="text-[11px] font-mono text-slate-300 mt-0.5 block">
                  🌇 {weatherPreview.sunset}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
              <strong>Active Travel Insight:</strong> {weatherPreview.travelInsight}
            </div>

            {/* 5-Day Outlook */}
            <div>
              <span className="text-[11px] font-bold uppercase text-slate-400 block mb-2">
                5-Day Outlook
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {weatherPreview.forecast?.map((day: any, idx: number) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-0.5">
                    <span className="text-[11px] font-bold text-white block">{day.day}</span>
                    <span className="text-[10px] text-amber-400 block">{day.condition}</span>
                    <div className="text-[11px] font-mono text-slate-300 font-semibold pt-1">
                      {day.maxTemp}° / {day.minTemp}°
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-slate-500 italic py-4 text-center">
            Click &quot;Test &amp; Refresh Live Data&quot; to inspect real-time metrics.
          </p>
        )}
      </div>
    </div>
  );
}

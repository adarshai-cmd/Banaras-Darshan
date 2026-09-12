"use client";

import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Navigation, MapPin, Layers, Sparkles } from "lucide-react";

export interface MapMarkerData {
  id: string;
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  approxBudget?: string;
  tagline?: string;
  area?: string;
  rating?: number;
}

export function LeafletMap({
  places = [],
  center = [25.3109, 83.0107], // Kashi Vishwanath / Godowlia center
  zoom = 14,
  selectedCategory = "ALL",
}: {
  places?: MapMarkerData[];
  center?: [number, number];
  zoom?: number;
  selectedCategory?: string;
}) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

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

      // Add OpenStreetMap carto tile layer with clean dark/contrast mode styling
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: "abcd",
          maxZoom: 19,
        }
      ).addTo(map);

      // Add subtle zoom control at bottom-right
      L.control.zoom({ position: "bottomright" }).addTo(map);

      mapInstanceRef.current = map;
      markersLayerRef.current = L.layerGroup().addTo(map);
    }

    return () => {
      // Map cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

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

      // Custom SVG Pin Icon
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
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
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
            <a href="https://www.google.com/maps/dir/?api=1&destination=${p.latitude},${p.longitude}" target="_blank" rel="noopener" style="color: #2563eb; text-decoration: none; font-weight: 600;">
              Get Directions ↗
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      markersLayerRef.current?.addLayer(marker);
    });
  }, [places, selectedCategory]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
      <div ref={mapContainerRef} className="w-full h-full min-h-[420px]" />
      
      {/* Map Legend Overlay */}
      <div className="absolute top-4 left-4 z-[1000] bg-[#070d1e]/90 backdrop-blur-md p-3 rounded-xl border border-white/15 text-xs text-slate-200 shadow-xl space-y-1.5 hidden sm:block">
        <p className="font-semibold text-white uppercase tracking-wider text-[10px] text-amber-300">
          Map Legend
        </p>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#ea580c]" />
          <span>Temples & Shrines</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#2563eb]" />
          <span>Sacred Ghats</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#d4af37]" />
          <span>Local Food & Sweets</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#8b5cf6]" />
          <span>Hotels & Stays</span>
        </div>
      </div>
    </div>
  );
}

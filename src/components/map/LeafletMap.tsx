"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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
    </div>
  );
}

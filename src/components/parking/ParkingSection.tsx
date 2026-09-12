"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
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
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

export interface ParkingLocationItem {
  id: string;
  name: string;
  address: string;
  area: string;
  latitude: number;
  longitude: number;
  capacity?: string | null;
  parkingType: string;
  timing?: string | null;
  vehicleSupport: string;
  feeStatus: string;
  feeRate?: string | null;
  image?: string | null;
  associatedPlaces?: string | null;
  directionsNote?: string | null;
}

interface ParkingSectionProps {
  initialParkings?: ParkingLocationItem[];
  className?: string;
  id?: string;
}

export function ParkingSection({
  initialParkings = [],
  className = "",
  id = "parking",
}: ParkingSectionProps) {
  const [parkings, setParkings] = useState<ParkingLocationItem[]>(initialParkings);
  const [isLoading, setIsLoading] = useState(initialParkings.length === 0);

  useEffect(() => {
    if (initialParkings.length > 0) return;
    let isMounted = true;

    fetch("/api/parking")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data?.success && Array.isArray(data.parkings)) {
          setParkings(data.parkings);
        }
      })
      .catch((err) => console.error("ParkingSection fetch error:", err))
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [initialParkings]);

  return (
    <section id={id} className={`py-16 scroll-mt-20 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-blue-700 mb-1">
              <SquareParking className="w-3.5 h-3.5" />
              <span>Smart Mobility & Vehicle Logistics</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 font-serif">
              Official Municipal Parking Stands
            </h2>
            <p className="text-sm text-slate-600 mt-1 font-light max-w-3xl">
              Old city ghats and the Shri Kashi Vishwanath temple corridor are strictly pedestrian-only.
              Park your car or two-wheeler safely at these verified municipal stands before proceeding.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>4 Verified Facilities</span>
            </span>
          </div>
        </div>

        {/* Traffic Advisory Notice */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start sm:items-center gap-3 text-xs text-amber-950">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
          <div className="flex-1">
            <strong className="font-semibold text-amber-900">
              Important Traffic Advisory for Travelers:{" "}
            </strong>
            <span>
              Private four-wheelers are prohibited past Godowlia crossing and Maidagin Chowk between 07:00 AM – 10:00 PM.
              Always use the multi-level facilities listed below to prevent vehicle towing and congestion.
            </span>
          </div>
        </div>

        {/* Parking Locations Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-80 rounded-2xl bg-white/60 animate-pulse border border-slate-200"
              />
            ))}
          </div>
        ) : (
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
                    {/* Parking Card Top Image & Type Badge */}
                    <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
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
                          <SquareParking className="w-12 h-12 opacity-50" />
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

                      {/* Fee Badge */}
                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/90 text-slate-900 shadow-sm">
                          {p.feeStatus}
                        </span>
                      </div>

                      {/* Area on image bottom */}
                      <div className="absolute bottom-2.5 left-3 right-3">
                        <p className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{p.area}</span>
                        </p>
                      </div>
                    </div>

                    {/* Card Content Body */}
                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="text-base font-bold text-slate-900 font-serif line-clamp-1">
                          {p.name}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                          {p.address}
                        </p>
                      </div>

                      {/* Capacity & Timing */}
                      <div className="space-y-1.5 text-xs text-slate-600 pt-1 border-t border-slate-100">
                        {p.capacity && (
                          <div className="flex items-center gap-2">
                            <Car className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span className="font-medium text-slate-800">
                              {p.capacity}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>{p.timing || "24 Hours Open"}</span>
                        </div>

                        {p.feeRate && (
                          <p className="text-[11px] text-slate-500 font-medium pl-5.5">
                            {p.feeRate}
                          </p>
                        )}
                      </div>

                      {/* Walk / Directions note */}
                      {p.directionsNote && (
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-700 leading-snug">
                          <strong>Access Tip:</strong> {p.directionsNote}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="p-4 pt-0">
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-amber-600 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Directions on Maps</span>
                      <ExternalLink className="w-3 h-3 opacity-70" />
                    </a>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

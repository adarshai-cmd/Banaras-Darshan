"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { Sparkles, ArrowRight, MapPin } from "lucide-react";
import { PromotionData, PromotionDetailModal } from "./PromotionDetailModal";

interface PromotionalSlotProps {
  placement: "LEFT" | "RIGHT";
  initialPromotions?: PromotionData[];
  className?: string;
}

export function PromotionalSlot({
  placement,
  initialPromotions = [],
  className = "",
}: PromotionalSlotProps) {
  const [promotions, setPromotions] = useState<PromotionData[]>(initialPromotions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<PromotionData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch promotions if none passed
  useEffect(() => {
    if (initialPromotions.length > 0) return;
    const fetchPromos = async () => {
      try {
        const res = await fetch(`/api/promotions?placement=${placement}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.promotions?.length > 0) {
            setPromotions(data.promotions);
          }
        }
      } catch (err) {
        console.error("Promotional slot fetch error:", err);
      }
    };
    fetchPromos();
  }, [placement, initialPromotions]);

  const activePromotion = promotions[currentIndex] || null;

  // Auto-rotation timer with hover pause
  const nextSlide = useCallback(() => {
    if (promotions.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % promotions.length);
  }, [promotions.length]);

  useEffect(() => {
    if (promotions.length <= 1 || isHovered || !activePromotion) return;

    const intervalDuration = activePromotion.autoRotationDuration || 4500;
    const timer = setInterval(() => {
      nextSlide();
    }, intervalDuration);

    return () => clearInterval(timer);
  }, [promotions.length, isHovered, activePromotion, nextSlide]);

  // Track impression when active promotion changes
  const recordedImpressions = useRef<Set<string>>(new Set());
  useEffect(() => {
    if (!activePromotion || recordedImpressions.current.has(activePromotion.id)) return;
    recordedImpressions.current.add(activePromotion.id);
    fetch(`/api/promotions/${activePromotion.id}/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "impression" }),
    }).catch(() => {});
  }, [activePromotion]);

  if (!activePromotion) return null;

  const handleOpenDetails = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedPromotion(activePromotion);
    setIsModalOpen(true);
  };

  return (
    <>
      <div
        className={`relative w-full max-w-[280px] xl:max-w-[310px] group select-none cursor-pointer ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => handleOpenDetails()}
      >
        {/* Subtle Ambient Glow */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500/30 via-orange-500/20 to-amber-600/30 rounded-3xl blur-md opacity-40 group-hover:opacity-80 transition duration-500 pointer-events-none" />

        {/* Card Container */}
        <div className="relative rounded-3xl bg-white/95 border border-amber-500/30 shadow-xl overflow-hidden backdrop-blur-md flex flex-col justify-between transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-2xl group-hover:shadow-amber-900/15">
          {/* Card Top Image */}
          <div className="relative h-36 xl:h-40 w-full overflow-hidden bg-slate-900">
            <Image
              src={activePromotion.imageUrl}
              alt={activePromotion.title}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 320px"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

            {/* Badge & Category */}
            <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1 z-10">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950 shadow-md">
                {activePromotion.badgeText || "SPECIAL"}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-black/60 text-amber-300 border border-amber-400/30 backdrop-blur-sm">
                {activePromotion.category.replace(/_/g, " ")}
              </span>
            </div>

            {/* Micro Location Pill */}
            {activePromotion.location && (
              <div className="absolute bottom-2 left-2.5 right-2.5 z-10 flex items-center gap-1 text-[11px] text-white/90 truncate drop-shadow-sm font-medium">
                <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                <span className="truncate">{activePromotion.location}</span>
              </div>
            )}
          </div>

          {/* Card Text Content */}
          <div className="p-3.5 xl:p-4 space-y-2 flex-1 flex flex-col justify-between">
            <div className="space-y-1">
              <h3 className="text-xs xl:text-sm font-bold text-slate-950 font-serif leading-snug line-clamp-2 group-hover:text-amber-800 transition-colors">
                {activePromotion.shortTitle || activePromotion.title}
              </h3>
              <p className="text-[11px] text-slate-600 line-clamp-2 font-normal leading-relaxed">
                {activePromotion.description}
              </p>
            </div>

            {/* CTA + Pagination Row */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              {/* Pagination Dots (if multiple promotions) */}
              {promotions.length > 1 ? (
                <div
                  className="flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  {promotions.map((p, idx) => (
                    <button
                      key={p.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === currentIndex
                          ? "w-4 bg-amber-600"
                          : "w-1.5 bg-slate-300 hover:bg-slate-400"
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              ) : (
                <span className="text-[10px] font-bold tracking-wider uppercase text-amber-800 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                  <span>Featured</span>
                </span>
              )}

              {/* Action Button */}
              <button
                onClick={(e) => handleOpenDetails(e)}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300/80 text-amber-900 text-[11px] font-bold shadow-2xs group-hover:border-amber-500 transition-all cursor-pointer"
              >
                <span>{activePromotion.ctaText || "Explore"}</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <PromotionDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        promotion={selectedPromotion}
      />
    </>
  );
}

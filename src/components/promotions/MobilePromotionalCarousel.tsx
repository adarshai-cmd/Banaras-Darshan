"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";
import { PromotionData, PromotionDetailModal } from "./PromotionDetailModal";

interface MobilePromotionalCarouselProps {
  initialPromotions?: PromotionData[];
  className?: string;
}

export function MobilePromotionalCarousel({
  initialPromotions = [],
  className = "",
}: MobilePromotionalCarouselProps) {
  const [promotions, setPromotions] = useState<PromotionData[]>(initialPromotions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<PromotionData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Fetch all active promotions on mobile
  useEffect(() => {
    if (initialPromotions.length > 0) return;
    const fetchPromos = async () => {
      try {
        const res = await fetch("/api/promotions?placement=ALL");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.promotions?.length > 0) {
            setPromotions(data.promotions);
          }
        }
      } catch (err) {
        console.error("Mobile promotional carousel fetch error:", err);
      }
    };
    fetchPromos();
  }, [initialPromotions]);

  const activePromotion = promotions[currentIndex] || null;

  const nextSlide = useCallback(() => {
    if (promotions.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % promotions.length);
  }, [promotions.length]);

  const prevSlide = useCallback(() => {
    if (promotions.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + promotions.length) % promotions.length);
  }, [promotions.length]);

  // Auto rotation on mobile unless touching
  useEffect(() => {
    if (promotions.length <= 1 || isInteracting || !activePromotion) return;

    const intervalDuration = activePromotion.autoRotationDuration || 4500;
    const timer = setInterval(() => {
      nextSlide();
    }, intervalDuration);

    return () => clearInterval(timer);
  }, [promotions.length, isInteracting, activePromotion, nextSlide]);

  // Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsInteracting(true);
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    setIsInteracting(false);
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 45;
    const isRightSwipe = distance < -45;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (!activePromotion) return null;

  return (
    <>
      <div className={`w-full ${className}`}>
        <div
          className="relative rounded-3xl bg-white border border-amber-500/30 shadow-lg overflow-hidden flex flex-col transition-all duration-300 active:scale-[0.99]"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={() => {
            setSelectedPromotion(activePromotion);
            setIsModalOpen(true);
          }}
        >
          {/* Visual Header */}
          <div className="relative h-44 w-full overflow-hidden bg-slate-900">
            <Image
              src={activePromotion.imageUrl}
              alt={activePromotion.title}
              fill
              className="object-cover"
              sizes="100vw"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

            {/* Badges */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950 shadow-md">
                {activePromotion.badgeText || "SPECIAL"}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-black/60 text-amber-300 border border-amber-400/30 backdrop-blur-sm">
                {activePromotion.category.replace(/_/g, " ")}
              </span>
            </div>

            {/* Micro Location */}
            {activePromotion.location && (
              <div className="absolute bottom-2.5 left-3 right-3 z-10 flex items-center gap-1 text-[11px] text-white/90 truncate font-medium drop-shadow-sm">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">{activePromotion.location}</span>
              </div>
            )}
          </div>

          {/* Body */}
          <div className="p-4 space-y-2">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-950 font-serif leading-snug">
                {activePromotion.title}
              </h3>
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {activePromotion.description}
              </p>
            </div>

            {/* Controls & CTA */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              {/* Swipe indicator dots */}
              <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                {promotions.map((p, idx) => (
                  <button
                    key={p.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === currentIndex
                        ? "w-5 bg-amber-600"
                        : "w-1.5 bg-slate-300"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Action Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPromotion(activePromotion);
                  setIsModalOpen(true);
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 text-xs font-bold shadow-2xs"
              >
                <span>{activePromotion.ctaText || "Explore"}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <PromotionDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        promotion={selectedPromotion}
      />
    </>
  );
}

"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  Navigation,
  Sparkles,
  Tag,
  CheckCircle2,
} from "lucide-react";

export interface PromotionData {
  id: string;
  title: string;
  shortTitle?: string | null;
  category: string;
  badgeText?: string | null;
  description: string;
  imageUrl: string;
  additionalImages?: string | null;
  ctaText: string;
  destinationUrl?: string | null;
  websiteUrl?: string | null;
  bookingUrl?: string | null;
  location?: string | null;
  address?: string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  placement?: string;
  priority?: number;
  autoRotationDuration?: number | null;
}

interface PromotionDetailModalProps {
  promotion: PromotionData | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PromotionDetailModal({
  promotion,
  isOpen,
  onClose,
}: PromotionDetailModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !promotion) return null;

  const handleActionClick = () => {
    // Fire analytics click
    fetch(`/api/promotions/${promotion.id}/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "click" }),
    }).catch(() => {});
  };

  const mapQuery = promotion.address || promotion.location || `${promotion.title} Varanasi`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-amber-500/30 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-sm transition-all shadow-md"
          aria-label="Close promotion details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Visual Area */}
        <div className="relative h-64 sm:h-72 w-full bg-slate-900 shrink-0">
          <Image
            src={promotion.imageUrl}
            alt={promotion.title}
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Badges on Hero */}
          <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2 z-10">
            {promotion.badgeText && (
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500 text-slate-950 shadow-md">
                {promotion.badgeText}
              </span>
            )}
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-white/90 text-slate-800 backdrop-blur-sm">
              {promotion.category.replace(/_/g, " ")}
            </span>
          </div>

          {/* Title on Hero */}
          <div className="absolute bottom-4 left-4 right-4 z-10 text-white space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold font-serif leading-snug drop-shadow-md">
              {promotion.title}
            </h2>
            {promotion.location && (
              <p className="text-xs text-amber-300 font-medium flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span>{promotion.location}</span>
              </p>
            )}
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-700 text-xs sm:text-sm leading-relaxed">
          {/* Main Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Event / Offer Overview</span>
            </h3>
            <p className="text-slate-800 text-sm font-normal leading-relaxed">
              {promotion.description}
            </p>
          </div>

          {/* Practical Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {/* Timing Card */}
            {(promotion.startTime || promotion.startDate) && (
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                  <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>Timings & Schedule</span>
                </div>
                <div className="text-xs text-slate-700">
                  {promotion.startTime && (
                    <p>
                      <strong>Time:</strong> {promotion.startTime}{" "}
                      {promotion.endTime ? `– ${promotion.endTime}` : ""}
                    </p>
                  )}
                  {promotion.startDate && (
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Valid from: {new Date(promotion.startDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Venue Location Card */}
            {promotion.address && (
              <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-200/80 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-sky-900">
                  <MapPin className="w-3.5 h-3.5 text-sky-700 shrink-0" />
                  <span>Venue Address</span>
                </div>
                <p className="text-xs text-slate-700">{promotion.address}</p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    mapQuery
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-sky-700 font-semibold hover:underline mt-1"
                >
                  <Navigation className="w-3 h-3" />
                  <span>Open in Google Maps ↗</span>
                </a>
              </div>
            )}
          </div>

          {/* Contact Details if available */}
          {(promotion.contactPhone || promotion.contactEmail) && (
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center gap-4 text-xs">
              {promotion.contactPhone && (
                <a
                  href={`tel:${promotion.contactPhone}`}
                  className="flex items-center gap-1.5 text-slate-800 font-medium hover:text-amber-700"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{promotion.contactPhone}</span>
                </a>
              )}
              {promotion.contactEmail && (
                <a
                  href={`mailto:${promotion.contactEmail}`}
                  className="flex items-center gap-1.5 text-slate-800 font-medium hover:text-amber-700"
                >
                  <Mail className="w-3.5 h-3.5 text-blue-600" />
                  <span>{promotion.contactEmail}</span>
                </a>
              )}
            </div>
          )}

          {/* Verified Guarantee Badge */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Curated and verified on the official Banaras Darshan tourism directory.
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition-colors"
          >
            Close
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {promotion.destinationUrl ? (
              <a
                href={promotion.destinationUrl}
                onClick={handleActionClick}
                className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-xs shadow-md shadow-orange-500/25 flex items-center justify-center gap-1.5 transition-all active:scale-95"
              >
                <span>{promotion.ctaText || "Explore Place"}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : promotion.bookingUrl ? (
              <a
                href={promotion.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleActionClick}
                className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 font-bold text-xs shadow-md shadow-orange-500/25 flex items-center justify-center gap-1.5 transition-all"
              >
                <span>{promotion.ctaText || "Book Now"}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : (
              <button
                onClick={() => {
                  handleActionClick();
                  onClose();
                }}
                className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs shadow-md"
              >
                <span>{promotion.ctaText || "Got it"}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

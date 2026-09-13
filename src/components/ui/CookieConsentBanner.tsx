"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, X, ShieldCheck } from "lucide-react";

export function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem("bd_cookie_consent_dismissed");
      if (!dismissed) {
        // Subtle delay for smooth page entrance
        const timer = setTimeout(() => setIsVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // In case localStorage is disabled or restricted
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      localStorage.setItem("bd_cookie_consent_dismissed", "true");
    } catch {}
  };

  if (!isVisible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie & Privacy Notice"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in slide-in-from-bottom-5 fade-in duration-300"
    >
      <div className="relative p-4 sm:p-5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-2xl text-slate-800 space-y-3">
        {/* Decorative subtle accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-t-2xl" />

        <div className="flex items-start justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0">
              <Cookie className="w-4 h-4 text-amber-600" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 font-serif">
              Privacy & Cookie Notice
            </h4>
          </div>

          <button
            onClick={handleDismiss}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
            aria-label="Dismiss cookie notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Banaras Darshan uses strictly essential session cookies to maintain
          login security. We do{" "}
          <strong className="text-slate-800 font-semibold">not</strong> use
          advertising trackers, third-party profiling, or commercial analytics
          cookies.
        </p>

        <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 text-xs">
          <Link
            href="/cookie-policy"
            className="text-amber-800 font-semibold hover:underline text-[11px]"
          >
            Read Cookie Policy →
          </Link>

          <button
            onClick={handleDismiss}
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-700 hover:bg-amber-800 text-white shadow-xs transition-all cursor-pointer"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}

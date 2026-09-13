"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { Lock, Sparkles, LogIn, UserPlus, ArrowLeft, ShieldCheck, MapPin, MessageSquare, Bot } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/GlassCard";

interface AuthGuardProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export function AuthGuard({ children, title, description }: AuthGuardProps) {
  const { isAuthenticated, isLoading, openAuthModal } = useAuth();
  const hasTriggeredModalRef = useRef(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !hasTriggeredModalRef.current) {
      hasTriggeredModalRef.current = true;
      const timer = setTimeout(() => {
        openAuthModal("login");
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isLoading, isAuthenticated, openAuthModal]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 bg-[#FAF8F5]">
        <div className="relative w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center animate-pulse">
          <span className="text-3xl">🛕</span>
        </div>
        <p className="mt-4 text-xs font-semibold text-slate-500 tracking-wider uppercase font-mono">
          Verifying Explorer Status...
        </p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 bg-[#FAF8F5]">
      <div className="relative w-full max-w-xl rounded-3xl bg-white/95 border border-amber-500/30 p-8 sm:p-10 shadow-2xl shadow-amber-900/10 backdrop-blur-xl overflow-hidden text-center space-y-6">
        {/* Top Gold Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600" />

        {/* Floating Sacred Lock Icon */}
        <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500/20 to-orange-500/10 border border-amber-500/30 shadow-inner mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 shadow-md">
            <Lock className="w-6 h-6 text-slate-950" />
          </div>
          <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-amber-500 animate-bounce" />
        </div>

        {/* Headings */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-300 text-amber-900 text-[11px] font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
            <span>Explorer Login Required</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
            {title || "Unlock the Sacred Soul of Kashi"}
          </h1>
          <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            {description ||
              "To protect authentic traveler advice and provide personalized guides, this feature is reserved for registered Banaras Darshan explorers."}
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-2 gap-3 text-left py-2">
          <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/60 flex items-start gap-2.5">
            <Bot className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-[11px]">
              <span className="font-bold text-slate-900 block">Banaras AI Guide</span>
              <span className="text-slate-600">Local verified knowledge</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-orange-50/60 border border-orange-200/60 flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-orange-700 shrink-0 mt-0.5" />
            <div className="text-[11px]">
              <span className="font-bold text-slate-900 block">Interactive Map</span>
              <span className="text-slate-600">Station-to-ghat realistic routing</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200/60 flex items-start gap-2.5">
            <MessageSquare className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
            <div className="text-[11px]">
              <span className="font-bold text-slate-900 block">Traveler Community</span>
              <span className="text-slate-600">Live Aarti & crowd updates</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/60 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div className="text-[11px]">
              <span className="font-bold text-slate-900 block">Verified Guides</span>
              <span className="text-slate-600">84 Ghats, temples & food</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Button
            onClick={() => openAuthModal("login")}
            variant="gold"
            className="w-full sm:w-auto px-6 py-3 text-xs font-bold shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In to Continue</span>
          </Button>

          <Button
            onClick={() => openAuthModal("signup")}
            variant="outline"
            className="w-full sm:w-auto px-6 py-3 text-xs font-bold border-amber-500/30 text-slate-800 hover:bg-amber-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-amber-700" />
            <span>Create My Account</span>
          </Button>
        </div>

        {/* Back Link */}
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-amber-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Front Page Preview</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

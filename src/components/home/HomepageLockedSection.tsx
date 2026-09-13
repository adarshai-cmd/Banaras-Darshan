"use client";

import React from "react";
import { Lock, Sparkles, LogIn, UserPlus, ShieldCheck, Compass, Bot, MessageSquare, MapPin } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/GlassCard";

interface HomepageLockedSectionProps {
  children: React.ReactNode;
}

export function HomepageLockedSection({ children }: HomepageLockedSectionProps) {
  const { isAuthenticated, isLoading, openAuthModal } = useAuth();

  if (isLoading) {
    return <div className="py-8">{children}</div>;
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {/* Visual Teaser with Blur & Reduced Opacity */}
      <div
        className="select-none pointer-events-none filter blur-[6px] opacity-40 max-h-[1100px] overflow-hidden"
        aria-hidden="true"
      >
        {children}
      </div>

      {/* Floating Glassmorphic Authentication Gate */}
      <div className="absolute inset-0 z-20 flex items-start justify-center pt-16 sm:pt-24 px-4 sm:px-6">
        <div className="w-full max-w-2xl rounded-3xl bg-white/95 border border-amber-500/30 p-8 sm:p-10 shadow-2xl shadow-amber-950/20 backdrop-blur-2xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
          {/* Top Gold Gradient Bar */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-t-3xl" />

          {/* Glowing Icon Badge */}
          <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-orange-500/10 border border-amber-500/30 shadow-inner mx-auto">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 shadow-md">
              <Lock className="w-5 h-5 text-slate-950" />
            </div>
            <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-amber-500 animate-spin" />
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/90 border border-amber-300 text-amber-900 text-[11px] font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
              <span>Guest Preview Mode</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-serif">
              Unlock the Full Banaras Darshan Experience
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
              You are currently viewing a brief preview. Sign in or create a free account to unlock our
              AI Travel Assistant, Live Community Chat, Station-to-Ghat Navigator, and verified guides.
            </p>
          </div>

          {/* Explorer Privileges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-2">
            <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/70 text-center">
              <Bot className="w-4 h-4 text-amber-700 mx-auto mb-1" />
              <span className="text-[11px] font-bold text-slate-900 block">Banaras AI</span>
              <span className="text-[10px] text-slate-500">24/7 Smart Guide</span>
            </div>
            <div className="p-2.5 rounded-xl bg-orange-50/70 border border-orange-200/70 text-center">
              <MapPin className="w-4 h-4 text-orange-700 mx-auto mb-1" />
              <span className="text-[11px] font-bold text-slate-900 block">Live Map</span>
              <span className="text-[10px] text-slate-500">Station Routing</span>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-200/70 text-center">
              <MessageSquare className="w-4 h-4 text-blue-700 mx-auto mb-1" />
              <span className="text-[11px] font-bold text-slate-900 block">Community</span>
              <span className="text-[10px] text-slate-500">Live Dispatches</span>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/70 text-center">
              <Compass className="w-4 h-4 text-emerald-700 mx-auto mb-1" />
              <span className="text-[11px] font-bold text-slate-900 block">Full Catalog</span>
              <span className="text-[10px] text-slate-500">84 Ghats & Shrines</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button
              onClick={() => openAuthModal("login")}
              variant="gold"
              className="w-full sm:w-auto px-8 py-3 text-xs font-bold shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In to Unlock Everything</span>
            </Button>

            <Button
              onClick={() => openAuthModal("signup")}
              variant="outline"
              className="w-full sm:w-auto px-8 py-3 text-xs font-bold border-amber-500/40 text-slate-900 hover:bg-amber-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-amber-700" />
              <span>Create My Account (Free)</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

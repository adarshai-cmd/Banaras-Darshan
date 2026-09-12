import React from "react";
import { Users, ShieldCheck, Award, MessageCircle, HelpCircle } from "lucide-react";
import { CommunityFeed } from "@/components/community/CommunityFeed";
import { GlassCard, Badge } from "@/components/ui/GlassCard";

export default function CommunityPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-10">
      {/* Community Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-amber-700 mb-1">
          <Users className="w-3.5 h-3.5" />
          <span>Real-Time Kashi Exchange</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 font-serif">
          Banaras Traveler Community
        </h1>
        <p className="text-slate-600 text-sm sm:text-base font-normal leading-relaxed">
          Connect with pilgrims, backpackers, photographers, and local Varanasi residents.
          Exchange verified advice, share morning boat meetups, and report live city dispatches.
        </p>
      </div>

      {/* Community Badges & Moderation Explainer */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <GlassCard className="p-4 space-y-1.5 bg-white/90 border border-emerald-500/30 shadow-sm" hoverEffect={false}>
          <div className="flex items-center gap-2 text-emerald-800 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Automated Moderation</span>
          </div>
          <p className="text-slate-700">
            Every post passes through multi-layer spam, abuse, and safety checks to keep our
            pilgrim community respectful and safe.
          </p>
        </GlassCard>

        <GlassCard className="p-4 space-y-1.5 bg-white/90 border border-amber-500/30 shadow-sm" hoverEffect={false}>
          <div className="flex items-center gap-2 text-amber-800 font-bold">
            <Award className="w-4 h-4 text-amber-600" />
            <span>Reputation System</span>
          </div>
          <p className="text-slate-700">
            Earn helpful badges: <em className="text-slate-900 font-semibold">New Explorer</em>, <em className="text-slate-900 font-semibold">Helpful Traveler</em>, <em className="text-slate-900 font-semibold">Local Guide</em>,
            and <em className="text-slate-900 font-semibold">Verified Contributor</em> through constructive answers.
          </p>
        </GlassCard>

        <GlassCard className="p-4 space-y-1.5 bg-white/90 border border-sky-500/30 shadow-sm" hoverEffect={false}>
          <div className="flex items-center gap-2 text-sky-800 font-bold">
            <MessageCircle className="w-4 h-4 text-sky-600" />
            <span>Verified Place Matcher</span>
          </div>
          <p className="text-slate-700">
            When users recommend authentic places, the system checks our verified database to award
            the green <strong className="text-emerald-800">✓ Verified Information</strong> badge.
          </p>
        </GlassCard>
      </div>

      {/* Real-time Interactive Feed */}
      <CommunityFeed />
    </div>
  );
}

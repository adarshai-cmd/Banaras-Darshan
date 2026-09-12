import React from "react";
import { MessageCircle, Sparkles } from "lucide-react";
import { CommunityFeed } from "@/components/community/CommunityFeed";

export const metadata = {
  title: "Traveler Community Chat | Banaras Darshan",
  description: "Connect with fellow travelers and locals in Varanasi. Share genuine tips, boat meetups, and temple advice in multiple languages.",
};

export default function CommunityPage() {
  return (
    <div className="min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6 sm:space-y-8">
      {/* Friendly, Simple Community Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200/80 text-[11px] font-bold tracking-wide uppercase">
          <MessageCircle className="w-3.5 h-3.5 text-amber-700" />
          <span>काशी यात्री चौपाल • Banaras Traveler Hub</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-950 font-serif">
          Community Chat
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
          Ask questions, meet up for dawn boat rides, and exchange authentic travel advice in your preferred language.
        </p>
      </div>

      {/* Simplified, Clean Live Chat Stream */}
      <CommunityFeed />
    </div>
  );
}

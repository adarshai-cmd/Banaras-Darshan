"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Sparkles, ShieldCheck } from "lucide-react";
import { AIAssistantWidget } from "@/components/ai/AIAssistantWidget";
import { AuthGuard } from "@/components/auth/AuthGuard";

function AIAssistantContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  return <AIAssistantWidget initialPrompt={initialQuery} />;
}

export default function AIAssistantPage() {
  return (
    <AuthGuard
      title="Banaras AI Travel Assistant"
      description="Sign in or create an account to consult our 24/7 factual AI guide for temples, aarti timings, boat rates, and personalized itineraries."
    >
      <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-amber-700 mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Factual AI Concierge</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold text-slate-900 font-serif">
          Banaras AI Travel Assistant
        </h1>
        <p className="text-slate-600 text-sm sm:text-base font-normal leading-relaxed">
          Ask any question about temple timings, fair boat fares, budget kachori spots,
          hidden galliyan, or customized itineraries. Grounded in 100% verified local facts.
        </p>
      </div>

      {/* Suspense Wrapped Assistant Content */}
      <Suspense
        fallback={
          <div className="p-12 text-center text-slate-500">
            <div className="w-8 h-8 mx-auto mb-2 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            Loading Banaras AI...
          </div>
        }
      >
        <AIAssistantContent />
      </Suspense>

      {/* Trust & Knowledge Basis */}
      <div className="p-4 rounded-2xl bg-white border border-amber-500/20 text-xs text-slate-700 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-slate-700 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Zero-Hallucination Policy: Live information is cross-referenced with verified temple and transit data.
        </span>
        <span className="text-amber-800 font-mono text-[11px] font-bold">
          Knowledge Base v2.4 • Kashi Verified
        </span>
      </div>
    </div>
    </AuthGuard>
  );
}

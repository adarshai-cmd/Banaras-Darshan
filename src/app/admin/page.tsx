"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  Users,
  Flag,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  MapPin,
  MessageSquare,
  FileText,
} from "lucide-react";
import { GlassCard, Button, Badge } from "@/components/ui/GlassCard";

interface AdminData {
  stats: {
    totalUsers: number;
    totalPlaces: number;
    totalMessages: number;
    pendingReportsCount: number;
    heldMessagesCount: number;
  };
  pendingReports: Array<{
    id: string;
    reporterName: string;
    targetId: string;
    targetContent: string | null;
    reason: string;
    details: string | null;
    status: string;
    createdAt: string;
  }>;
  heldMessages: Array<{
    id: string;
    userName: string;
    channel: string;
    content: string;
    moderationCategory: string | null;
    moderationReason: string | null;
    moderationScore: number;
    createdAt: string;
  }>;
  placeSuggestions: Array<{
    id: string;
    name: string;
    category: string;
    address: string;
    description: string;
    speciality: string | null;
    submittedBy: string | null;
    status: string;
    createdAt: string;
  }>;
  moderationLogs: Array<{
    id: string;
    action: string;
    matchedRule: string | null;
    severity: string | null;
    snippet: string | null;
    createdAt: string;
  }>;
  feedbacks: Array<{
    id: string;
    name: string;
    email: string | null;
    category: string;
    rating: number;
    message: string;
    createdAt: string;
  }>;
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/moderation");
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (err) {
      console.error("Failed to load admin data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleModerationAction = async (action: string, targetId: string, note?: string) => {
    try {
      const res = await fetch("/api/admin/moderation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, targetId, note }),
      });
      const json = await res.json();
      if (json.success) {
        setActionNotice(json.message);
        setTimeout(() => setActionNotice(null), 3000);
        fetchDashboard();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-rose-700 mb-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Platform Trust & Safety Console</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 font-serif">
            Banaras Darshan Admin Dashboard
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Real-time content moderation, community safety verification, and user suggestions
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={fetchDashboard} className="text-xs bg-white text-slate-800 border-amber-500/30">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Queue</span>
        </Button>
      </div>

      {actionNotice && (
        <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-400 text-xs text-emerald-900 font-medium animate-in fade-in">
          ✓ {actionNotice}
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <GlassCard className="p-5 bg-white/90 border border-amber-500/20 shadow-sm" hoverEffect={false}>
          <p className="text-xs text-slate-600 uppercase font-semibold">Total Places</p>
          <p className="text-2xl font-bold text-amber-700 font-serif mt-1">
            {data?.stats.totalPlaces ?? "--"}
          </p>
          <p className="text-[10px] text-emerald-700 font-medium mt-0.5">100% Verified Directory</p>
        </GlassCard>

        <GlassCard className="p-5 bg-white/90 border border-amber-500/20 shadow-sm" hoverEffect={false}>
          <p className="text-xs text-slate-600 uppercase font-semibold">Community Posts</p>
          <p className="text-2xl font-bold text-sky-700 font-serif mt-1">
            {data?.stats.totalMessages ?? "--"}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">Live Dispatches</p>
        </GlassCard>

        <GlassCard className="p-5 bg-white/90 border border-amber-500/20 shadow-sm" hoverEffect={false}>
          <p className="text-xs text-slate-600 uppercase font-semibold">Pending Reports</p>
          <p className="text-2xl font-bold text-rose-700 font-serif mt-1">
            {data?.stats.pendingReportsCount ?? "--"}
          </p>
          <p className="text-[10px] text-rose-700 mt-0.5">Awaiting Review</p>
        </GlassCard>

        <GlassCard className="p-5 bg-white/90 border border-amber-500/20 shadow-sm" hoverEffect={false}>
          <p className="text-xs text-slate-600 uppercase font-semibold">Held Messages</p>
          <p className="text-2xl font-bold text-amber-700 font-serif mt-1">
            {data?.stats.heldMessagesCount ?? "--"}
          </p>
          <p className="text-[10px] text-amber-800 mt-0.5">Spam / Unsafe Filter</p>
        </GlassCard>

        <GlassCard className="p-5 bg-white/90 border border-amber-500/20 shadow-sm" hoverEffect={false}>
          <p className="text-xs text-slate-600 uppercase font-semibold">Registered Travelers</p>
          <p className="text-2xl font-bold text-slate-900 font-serif mt-1">
            {data?.stats.totalUsers ?? "--"}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">Verified Accounts</p>
        </GlassCard>
      </div>

      {/* Moderation Queue: Held Messages */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-black/10">
          <h2 className="text-xl font-bold text-slate-900 font-serif flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <span>Messages Held for Moderator Inspection</span>
          </h2>
          <Badge variant="warning">{data?.heldMessages.length || 0} Pending</Badge>
        </div>

        {data?.heldMessages.length === 0 ? (
          <GlassCard className="p-8 text-center text-xs text-slate-400" hoverEffect={false}>
            ✓ Moderation queue is clean. No messages currently held for safety review.
          </GlassCard>
        ) : (
          <div className="space-y-3">
            {data?.heldMessages.map((msg) => (
              <GlassCard key={msg.id} className="p-5 space-y-3" hoverEffect={false}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{msg.userName}</span>
                    <Badge variant="danger">{msg.moderationCategory || "FLAGGED"}</Badge>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Risk Score: {(msg.moderationScore * 100).toFixed(0)}%
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </span>
                </div>

                <p className="text-xs text-slate-200 p-3 rounded-xl bg-black/40 border border-white/5 font-mono">
                  {msg.content}
                </p>

                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200">
                  <strong>Triggered Rule:</strong> {msg.moderationReason || "Automated spam / safety filter"}
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleModerationAction("REJECT_MESSAGE", msg.id, "Violation confirmed by moderator")}
                    className="text-xs"
                  >
                    <XCircle className="w-3.5 h-3.5 mr-1" />
                    Reject & Remove
                  </Button>
                  <Button
                    variant="gold"
                    size="sm"
                    onClick={() => handleModerationAction("APPROVE_MESSAGE", msg.id, "Verified benign by moderator")}
                    className="text-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    Approve & Publish Live
                  </Button>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>

      {/* Community Reports Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-black/10">
          <h2 className="text-xl font-bold text-slate-900 font-serif flex items-center gap-2">
            <Flag className="w-5 h-5 text-rose-600" />
            <span>Community User Reports</span>
          </h2>
          <Badge variant="danger">{data?.pendingReports.length || 0} Open Flags</Badge>
        </div>

        {data?.pendingReports.length === 0 ? (
          <GlassCard className="p-8 text-center text-xs text-slate-500 bg-white/90 border border-amber-500/20" hoverEffect={false}>
            ✓ No reported community violations.
          </GlassCard>
        ) : (
          <div className="space-y-3">
            {data?.pendingReports.map((rep) => (
              <GlassCard key={rep.id} className="p-5 space-y-3 bg-white/90 border border-amber-500/20 shadow-sm" hoverEffect={false}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">Report by: {rep.reporterName}</span>
                    <Badge variant="danger">{rep.reason}</Badge>
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {new Date(rep.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-xs text-slate-800 italic p-3 rounded-xl bg-amber-50/70 border border-amber-500/15">
                  "{rep.targetContent}"
                </p>

                {rep.details && (
                  <p className="text-xs text-amber-900 font-medium">
                    <strong>Reporter notes:</strong> {rep.details}
                  </p>
                )}

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleModerationAction("RESOLVE_REPORT", rep.id)}
                    className="text-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    Mark Resolved
                  </Button>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>

      {/* User Place Suggestions Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-black/10">
          <h2 className="text-xl font-bold text-slate-900 font-serif flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <span>Crowdsourced Place Suggestions</span>
          </h2>
          <Badge variant="gold">{data?.placeSuggestions.length || 0} Submissions</Badge>
        </div>

        {data?.placeSuggestions.length === 0 ? (
          <GlassCard className="p-8 text-center text-xs text-slate-500 bg-white/90 border border-amber-500/20" hoverEffect={false}>
            ✓ All user-suggested locations have been processed.
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data?.placeSuggestions.map((sug) => (
              <GlassCard key={sug.id} className="p-5 space-y-3 bg-white/90 border border-amber-500/20 shadow-sm" hoverEffect={false}>
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900">{sug.name}</h4>
                  <Badge variant="gold">{sug.category}</Badge>
                </div>

                <p className="text-xs text-slate-300">{sug.description}</p>
                <p className="text-[11px] text-slate-400">
                  <strong>Location:</strong> {sug.address}
                </p>
                {sug.speciality && (
                  <p className="text-[11px] text-amber-300">
                    <strong>Specialty:</strong> {sug.speciality}
                  </p>
                )}

                <div className="pt-2 flex justify-end">
                  <Button
                    variant="gold"
                    size="sm"
                    onClick={() => handleModerationAction("APPROVE_SUGGESTION", sug.id)}
                    className="text-xs"
                  >
                    Approve & Verify Place
                  </Button>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

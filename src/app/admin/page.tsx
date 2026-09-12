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
  Lock,
  Unlock,
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
  const [adminKey, setAdminKey] = useState<string>("kashi_admin_2026");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [inputKey, setInputKey] = useState<string>("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const fetchDashboard = async (key: string) => {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await fetch("/api/admin/moderation", {
        headers: {
          "x-admin-key": key,
        },
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setData(json);
        setIsAuthenticated(true);
        setAdminKey(key);
      } else {
        setIsAuthenticated(false);
        setAuthError(json.error || "Invalid passkey. Access denied.");
      }
    } catch {
      setAuthError("Failed to connect to moderation backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    fetch("/api/admin/moderation", {
      headers: {
        "x-admin-key": adminKey,
      },
    })
      .then((res) => res.json().then((json) => ({ ok: res.ok, json })))
      .then(({ ok, json }) => {
        if (ignore) return;
        if (ok && json.success) {
          setData(json);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setAuthError(json.error || "Invalid passkey. Access denied.");
        }
      })
      .catch(() => {
        if (!ignore) {
          setAuthError("Failed to connect to moderation backend.");
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [adminKey]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputKey.trim()) return;
    fetchDashboard(inputKey.trim());
  };

  const handleModerateMessage = async (targetId: string, action: "APPROVE" | "REJECT") => {
    try {
      const res = await fetch("/api/admin/moderation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify({
          action: action === "APPROVE" ? "APPROVE_MESSAGE" : "REJECT_MESSAGE",
          targetId,
          note: action === "APPROVE" ? "Approved by editorial moderator" : "Violates community guidelines",
        }),
      });
      const json = await res.json();
      if (json.success) {
        setActionNotice(json.message);
        setTimeout(() => setActionNotice(null), 3000);
        fetchDashboard(adminKey);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleResolveReport = async (targetId: string) => {
    try {
      const res = await fetch("/api/admin/moderation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify({
          action: "RESOLVE_REPORT",
          targetId,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setActionNotice("Report resolved successfully.");
        setTimeout(() => setActionNotice(null), 3000);
        fetchDashboard(adminKey);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!isAuthenticated && !loading) {
    return (
      <div className="min-h-screen py-16 px-4 flex items-center justify-center bg-[#FAF8F5]">
        <div className="w-full max-w-md p-8 rounded-2xl bg-white border border-slate-300 shadow-xl space-y-6">
          <div className="w-12 h-12 rounded-xl bg-orange-100 border border-orange-300 flex items-center justify-center text-orange-700 mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold text-slate-950 font-serif">
              Banaras Darshan Staff Access
            </h2>
            <p className="text-xs text-slate-600">
              Enter Administrator or Moderator passkey to access live moderation queues.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="Enter Staff Passkey..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-mono text-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
            </div>
            {authError && (
              <p className="text-xs text-rose-700 font-bold">{authError}</p>
            )}
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              Verify Passkey & Enter
            </button>
            <p className="text-[11px] text-center text-slate-500">
              Demo Moderator Key: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono">kashi_admin_2026</code>
            </p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 bg-[#FAF8F5]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-800 mb-1">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
            <span>Banaras Darshan Console</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-950 font-serif">
            Editorial & Moderation Operations
          </h1>
          <p className="text-slate-600 text-xs mt-1">
            Real-time inspection queue, verified crowd submissions, and content policy enforcement
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchDashboard(adminKey)}
            disabled={loading}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>
          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-950 text-xs font-bold border border-emerald-300 flex items-center gap-1">
            <Unlock className="w-3.5 h-3.5 text-emerald-700" />
            <span>Session Active</span>
          </span>
        </div>
      </div>

      {actionNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-950 animate-in fade-in">
          ✓ {actionNotice}
        </div>
      )}

      {/* KPI Stats */}
      {data?.stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Registered Places</span>
            <p className="text-2xl font-bold text-slate-950 font-serif">{data.stats.totalPlaces}</p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Community Messages</span>
            <p className="text-2xl font-bold text-slate-950 font-serif">{data.stats.totalMessages}</p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Traveler Users</span>
            <p className="text-2xl font-bold text-slate-950 font-serif">{data.stats.totalUsers}</p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-rose-200 shadow-sm space-y-1">
            <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">Held Dispatches</span>
            <p className="text-2xl font-bold text-rose-700 font-serif">{data.stats.heldMessagesCount}</p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-amber-200 shadow-sm space-y-1">
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">Pending Reports</span>
            <p className="text-2xl font-bold text-amber-800 font-serif">{data.stats.pendingReportsCount}</p>
          </div>
        </div>
      )}

      {/* Held Messages Queue */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-rose-600" />
          <h2 className="text-xl font-bold text-slate-950 font-serif">
            Held Dispatches Queue (Automated Filter Triggers)
          </h2>
        </div>

        {data?.heldMessages && data.heldMessages.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {data.heldMessages.map((msg) => (
              <div
                key={msg.id}
                className="p-5 rounded-2xl bg-white border-2 border-rose-200 shadow-sm space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-950">{msg.userName}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-xs text-slate-500 font-mono">#{msg.channel}</span>
                  </div>
                  <Badge variant="danger">Flagged: {msg.moderationCategory || "POLICY"}</Badge>
                </div>

                <p className="text-sm font-medium text-slate-900 bg-rose-50/60 p-3 rounded-xl border border-rose-100">
                  &ldquo;{msg.content}&rdquo;
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs">
                  <span className="text-rose-800 font-semibold">
                    Trigger reason: {msg.moderationReason || "Automated profanity/spam trigger"}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleModerateMessage(msg.id, "REJECT")}
                      className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer shadow-sm"
                    >
                      Confirm Reject
                    </button>
                    <button
                      onClick={() => handleModerateMessage(msg.id, "APPROVE")}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-sm"
                    >
                      Approve & Release
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center text-xs text-slate-500">
            ✓ No held messages in queue. Moderation pipeline is clear!
          </div>
        )}
      </div>

      {/* Pending User Reports */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Flag className="w-5 h-5 text-amber-600" />
          <h2 className="text-xl font-bold text-slate-950 font-serif">
            Traveler Reports ({data?.pendingReports.length ?? 0})
          </h2>
        </div>

        {data?.pendingReports && data.pendingReports.length > 0 ? (
          <div className="space-y-3">
            {data.pendingReports.map((rep) => (
              <div
                key={rep.id}
                className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-slate-900">{rep.reporterName}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-amber-800 font-semibold">Reason: {rep.reason}</span>
                  </div>
                  {rep.details && (
                    <p className="text-xs text-slate-600 mt-1 font-normal">&ldquo;{rep.details}&rdquo;</p>
                  )}
                </div>
                <button
                  onClick={() => handleResolveReport(rep.id)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shrink-0 cursor-pointer shadow-sm"
                >
                  Mark Resolved
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center text-xs text-slate-500">
            ✓ No unresolved traveler reports.
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Sparkles,
  Plus,
  Search,
  RefreshCw,
  Edit,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  Eye,
  MousePointerClick,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { PromotionFormModal } from "./PromotionFormModal";

interface PromotionsSectionProps {
  onShowToast: (msg: string, type?: "success" | "error") => void;
  onStatsUpdate?: () => void;
  onOpenCreate?: () => void;
}

export function PromotionsSection({ onShowToast, onStatsUpdate }: PromotionsSectionProps) {
  const [promotions, setPromotions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [placementFilter, setPlacementFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<any | null>(null);

  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    id: string;
    title: string;
  }>({
    isOpen: false,
    id: "",
    title: "",
  });

  const loadPromotions = useCallback(async (showLoader = false) => {
    if (showLoader) setIsLoading(true);
    try {
      let url = "/api/bd-admin/promotions";
      const params = new URLSearchParams();
      if (placementFilter !== "ALL") params.append("placement", placementFilter);
      if (statusFilter !== "ALL") params.append("status", statusFilter.toLowerCase());
      if (searchQuery.trim()) params.append("q", searchQuery.trim());

      const queryStr = params.toString();
      if (queryStr) url += `?${queryStr}`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success && data.promotions) {
        setPromotions(data.promotions);
      }
    } catch (e) {
      console.error("Load promotions error:", e);
    } finally {
      setIsLoading(false);
    }
  }, [placementFilter, statusFilter, searchQuery]);

  useEffect(() => {
    loadPromotions();
  }, [loadPromotions]);

  const handleDelete = async (id: string, title: string) => {
    try {
      const res = await fetch(`/api/bd-admin/promotions/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.success) {
        onShowToast(`Promotion "${title}" deleted.`);
        setPromotions((prev) => prev.filter((p) => p.id !== id));
        if (onStatsUpdate) onStatsUpdate();
      } else {
        onShowToast(data.error || "Failed to delete promotion.", "error");
      }
    } catch {
      onShowToast("Network error deleting promotion.", "error");
    } finally {
      setDeleteConfirm({ isOpen: false, id: "", title: "" });
    }
  };

  // Helper to determine active/scheduled/expired status
  const getPromoStatus = (p: any) => {
    if (!p.isActive) return { label: "INACTIVE", color: "bg-slate-800 text-slate-400 border-slate-700" };
    const now = new Date();
    if (p.startDate && new Date(p.startDate) > now) {
      return { label: "SCHEDULED", color: "bg-blue-950 text-blue-300 border-blue-800" };
    }
    if (p.endDate && new Date(p.endDate) < now) {
      return { label: "EXPIRED", color: "bg-rose-950 text-rose-300 border-rose-800" };
    }
    return { label: "ACTIVE", color: "bg-emerald-950 text-emerald-300 border-emerald-800" };
  };

  return (
    <div className="space-y-5 text-xs text-slate-200">
      {/* Top Filter and Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#161E2E] p-4 rounded-2xl border border-slate-800">
        {/* Search & Placement Filters */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search promotions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <select
            value={placementFilter}
            onChange={(e) => setPlacementFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
          >
            <option value="ALL">All Placements</option>
            <option value="BOTH">Both Slots</option>
            <option value="LEFT">Left Desktop Slot</option>
            <option value="RIGHT">Right Desktop Slot</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Now</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="EXPIRED">Expired</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>

        {/* Refresh & Add Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => loadPromotions(true)}
            title="Refresh list"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => {
              setEditingPromo(null);
              setModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Promotion</span>
          </button>
        </div>
      </div>

      {/* Promotions Table */}
      <div className="rounded-2xl bg-[#161E2E] border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#121824] text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Visual Preview</th>
                <th className="px-4 py-3">Title & Category</th>
                <th className="px-4 py-3">Placement</th>
                <th className="px-4 py-3">Status / Dates</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Analytics</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {promotions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-500">
                    {isLoading
                      ? "Loading promotions from database..."
                      : "No promotions found matching your filter criteria."}
                  </td>
                </tr>
              ) : (
                promotions.map((p) => {
                  const status = getPromoStatus(p);
                  const ctr =
                    p.impressionCount > 0
                      ? ((p.clickCount / p.impressionCount) * 100).toFixed(1)
                      : "0.0";

                  return (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                      {/* Image Thumbnail */}
                      <td className="px-4 py-3.5">
                        <div className="w-16 h-12 rounded-xl overflow-hidden border border-slate-700 relative bg-slate-950 shadow-inner">
                          <Image
                            src={p.imageUrl}
                            alt={p.title}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      </td>

                      {/* Title & Category */}
                      <td className="px-4 py-3.5 max-w-xs">
                        <div className="font-bold text-white text-sm line-clamp-1">
                          {p.title}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {p.category}
                          </span>
                          {p.badgeText && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-slate-800 text-slate-300">
                              {p.badgeText}
                            </span>
                          )}
                        </div>
                        {p.location && (
                          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                            <span className="truncate">{p.location}</span>
                          </div>
                        )}
                      </td>

                      {/* Placement */}
                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-300">
                          {p.placement === "BOTH"
                            ? "Both Slots"
                            : p.placement === "LEFT"
                            ? "Left Slot"
                            : "Right Slot"}
                        </span>
                        <div className="text-[10px] text-slate-500 mt-1">
                          {p.autoRotationDuration ? `${p.autoRotationDuration / 1000}s interval` : "4.5s"}
                        </div>
                      </td>

                      {/* Status / Dates */}
                      <td className="px-4 py-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${status.color}`}
                        >
                          {status.label}
                        </span>
                        {(p.startDate || p.endDate) && (
                          <div className="text-[10px] text-slate-400 mt-1 space-y-0.5">
                            {p.startDate && <div>From: {new Date(p.startDate).toLocaleDateString()}</div>}
                            {p.endDate && <div>To: {new Date(p.endDate).toLocaleDateString()}</div>}
                          </div>
                        )}
                      </td>

                      {/* Priority */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1">
                          <span className="font-mono font-bold text-amber-400 text-sm">
                            {p.priority}
                          </span>
                          <span className="text-[10px] text-slate-500">/ 10</span>
                        </div>
                        {p.isFeatured && (
                          <span className="text-[9px] text-amber-300 font-bold uppercase">
                            Featured
                          </span>
                        )}
                      </td>

                      {/* Analytics Ready */}
                      <td className="px-4 py-3.5">
                        <div className="space-y-0.5 font-mono text-[11px]">
                          <div className="flex items-center gap-1 text-slate-300">
                            <Eye className="w-3 h-3 text-sky-400" />
                            <span>{p.impressionCount} views</span>
                          </div>
                          <div className="flex items-center gap-1 text-slate-300">
                            <MousePointerClick className="w-3 h-3 text-emerald-400" />
                            <span>{p.clickCount} clicks</span>
                          </div>
                          <div className="text-[10px] text-amber-400 font-bold">
                            CTR: {ctr}%
                          </div>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setEditingPromo(p);
                              setModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 transition-colors"
                            title="Edit Promotion"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteConfirm({
                                isOpen: true,
                                id: p.id,
                                title: p.title,
                              })
                            }
                            className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 transition-colors"
                            title="Delete Promotion"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Promotion Form Modal */}
      {modalOpen && (
        <PromotionFormModal
          isOpen={modalOpen}
          promotion={editingPromo}
          onClose={() => {
            setModalOpen(false);
            setEditingPromo(null);
          }}
          onSuccess={() => {
            setModalOpen(false);
            setEditingPromo(null);
            loadPromotions();
            if (onStatsUpdate) onStatsUpdate();
            onShowToast(
              editingPromo ? "Promotion updated successfully!" : "Promotion created successfully!"
            );
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-[#161E2E] border border-slate-700 shadow-2xl p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-white">Delete Promotion</h3>
              <p className="text-xs text-slate-400">
                Are you sure you want to delete &quot;{deleteConfirm.title}&quot;?
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirm({ isOpen: false, id: "", title: "" })}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirm.id, deleteConfirm.title)}
                className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-600/20"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

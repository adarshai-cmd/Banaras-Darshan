"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Scale,
  ShieldCheck,
  FileText,
  Clock,
  History,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Edit,
  Plus,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Save,
  X,
  ChevronRight,
  Info,
  Layers,
  Trash2,
} from "lucide-react";

interface PolicyRecord {
  id: string;
  slug: string;
  title: string;
  category: string;
  version: string;
  status: "PUBLISHED" | "DRAFT" | "UNPUBLISHED";
  summary: string | null;
  content: string;
  lastUpdated: string;
  updatedAt: string;
  _count?: {
    versions: number;
  };
}

interface HistoryRecord {
  id: string;
  version: string;
  content: string;
  summary: string | null;
  status: string;
  changeNotes: string | null;
  archivedAt: string;
}

interface SectionItem {
  id: string;
  title: string;
  content: string;
}

export function LegalSettingsSection() {
  const [policies, setPolicies] = useState<PolicyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyRecord | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyList, setHistoryList] = useState<HistoryRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Editor form state
  const [editTitle, setEditTitle] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editCategory, setEditCategory] = useState("LEGAL");
  const [editVersion, setEditVersion] = useState("1.0");
  const [editStatus, setEditStatus] = useState<"PUBLISHED" | "DRAFT" | "UNPUBLISHED">("PUBLISHED");
  const [editSummary, setEditSummary] = useState("");
  const [editSections, setEditSections] = useState<SectionItem[]>([]);
  const [editChangeNotes, setEditChangeNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchPolicies = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/bd-admin/legal");
      const data = await res.json();
      if (data.success && data.policies) {
        setPolicies(data.policies);
      }
    } catch (err) {
      console.error(err);
      setNotification({
        type: "error",
        message: "Failed to load policies from database.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPolicies();
  }, [fetchPolicies]);

  const openEditor = (policy?: PolicyRecord) => {
    if (policy) {
      setSelectedPolicy(policy);
      setEditTitle(policy.title);
      setEditSlug(policy.slug);
      setEditCategory(policy.category || "LEGAL");
      setEditVersion(policy.version || "1.0");
      setEditStatus(policy.status || "PUBLISHED");
      setEditSummary(policy.summary || "");
      setEditChangeNotes("");

      let parsed: SectionItem[] = [];
      try {
        parsed = JSON.parse(policy.content);
      } catch {
        parsed = [
          {
            id: "main-content",
            title: policy.title,
            content: policy.content,
          },
        ];
      }
      setEditSections(parsed);
    } else {
      // New policy
      setSelectedPolicy(null);
      setEditTitle("");
      setEditSlug("");
      setEditCategory("LEGAL");
      setEditVersion("1.0");
      setEditStatus("DRAFT");
      setEditSummary("");
      setEditChangeNotes("Initial draft creation");
      setEditSections([
        {
          id: "section-1",
          title: "1. Overview",
          content: "Enter policy text here...",
        },
      ]);
    }
    setIsEditorOpen(true);
  };

  const openHistory = async (policy: PolicyRecord) => {
    setSelectedPolicy(policy);
    setIsHistoryOpen(true);
    setHistoryLoading(true);
    try {
      const res = await fetch(`/api/bd-admin/legal/${policy.slug}/history`);
      const data = await res.json();
      if (data.success && data.history) {
        setHistoryList(data.history);
      } else {
        setHistoryList([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleSave = async (overrideStatus?: "PUBLISHED" | "DRAFT" | "UNPUBLISHED") => {
    if (!editTitle.trim() || !editSlug.trim()) {
      alert("Title and URL slug are required.");
      return;
    }

    setSaving(true);
    const targetStatus = overrideStatus || editStatus;

    try {
      const res = await fetch("/api/bd-admin/legal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: editSlug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-"),
          title: editTitle.trim(),
          category: editCategory,
          version: editVersion.trim(),
          status: targetStatus,
          summary: editSummary.trim(),
          content: JSON.stringify(editSections),
          changeNotes: editChangeNotes.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setNotification({
          type: "success",
          message: data.message || "Policy updated successfully.",
        });
        setIsEditorOpen(false);
        fetchPolicies();
      } else {
        alert(data.error || "Failed to save policy.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving policy.");
    } finally {
      setSaving(false);
    }
  };

  const handleRestoreVersion = async (historyId: string, historyVersion: string) => {
    if (
      !confirm(
        `Are you sure you want to restore revision v${historyVersion}? The current policy state will be safely archived into history.`
      )
    ) {
      return;
    }

    if (!selectedPolicy) return;

    try {
      const res = await fetch(`/api/bd-admin/legal/${selectedPolicy.slug}/history`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ historyId }),
      });

      const data = await res.json();
      if (data.success) {
        setNotification({
          type: "success",
          message: data.message || "Revision restored successfully.",
        });
        setIsHistoryOpen(false);
        fetchPolicies();
      } else {
        alert(data.error || "Failed to restore revision.");
      }
    } catch (err) {
      console.error(err);
      alert("Error restoring revision.");
    }
  };

  const handleAddSection = () => {
    const nextNum = editSections.length + 1;
    setEditSections([
      ...editSections,
      {
        id: `section-${Date.now()}`,
        title: `${nextNum}. New Section Title`,
        content: "Enter section details...",
      },
    ]);
  };

  const handleUpdateSection = (index: number, field: "title" | "content", val: string) => {
    const updated = [...editSections];
    updated[index][field] = val;
    setEditSections(updated);
  };

  const handleRemoveSection = (index: number) => {
    if (editSections.length <= 1) {
      alert("At least one section is required.");
      return;
    }
    const updated = editSections.filter((_, i) => i !== index);
    setEditSections(updated);
  };

  const bumpVersion = (type: "minor" | "major") => {
    const parts = editVersion.split(".").map((n) => parseInt(n, 10) || 0);
    const major = parts[0] || 1;
    const minor = parts[1] || 0;

    if (type === "minor") {
      setEditVersion(`${major}.${minor + 1}`);
    } else {
      setEditVersion(`${major + 1}.0`);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Stats & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold">
              <Scale className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-serif">
              Legal, Privacy & Policy Management
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Publish, update, and version control official terms, privacy disclosures,
            community guidelines, and disclaimers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openEditor()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Policy</span>
          </button>
        </div>
      </div>

      {/* 2. Notification Toast */}
      {notification && (
        <div
          className={`p-4 rounded-2xl text-xs flex items-center justify-between border ${
            notification.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-rose-50 text-rose-800 border-rose-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            )}
            <span className="font-semibold">{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-slate-700 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 3. Policies Catalog Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 bg-white rounded-3xl border border-slate-200">
          <div className="w-6 h-6 mx-auto mb-2 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold">Loading policies...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {policies.map((policy) => {
            const isPublished = policy.status === "PUBLISHED";
            const isDraft = policy.status === "DRAFT";

            return (
              <div
                key={policy.id}
                className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-amber-400 shadow-sm transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isPublished
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : isDraft
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isPublished
                            ? "bg-emerald-500 animate-pulse"
                            : isDraft
                            ? "bg-amber-500"
                            : "bg-rose-500"
                        }`}
                      />
                      {policy.status}
                    </span>

                    <span className="text-[11px] font-mono font-bold text-slate-500">
                      v{policy.version}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 font-serif">
                      {policy.title}
                    </h3>
                    <span className="text-[11px] font-mono text-amber-800">
                      /{policy.slug}
                    </span>
                  </div>

                  {policy.summary && (
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {policy.summary}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(policy.lastUpdated).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>

                    <button
                      onClick={() => openHistory(policy)}
                      className="flex items-center gap-1 text-slate-600 hover:text-amber-800 font-medium cursor-pointer"
                      title="View Version History"
                    >
                      <History className="w-3.5 h-3.5" />
                      <span>{policy._count?.versions || 0} Revisions</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditor(policy)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-slate-800 bg-slate-50 hover:bg-amber-50 hover:text-amber-900 border border-slate-200 transition-all cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <a
                      href={`/${policy.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer"
                      title="View Live Public Page"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Policy Editor Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl max-h-[90vh] rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 overflow-y-auto">
            {/* Top Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="space-y-0.5">
                <h3 className="text-xl font-bold text-slate-900 font-serif">
                  {selectedPolicy ? `Edit: ${selectedPolicy.title}` : "Create New Legal Policy"}
                </h3>
                <p className="text-xs text-slate-500">
                  Update content, increment version, and choose publishing visibility.
                </p>
              </div>

              <button
                onClick={() => setIsEditorOpen(false)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Policy Title</label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="e.g. Privacy Policy"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">URL Slug</label>
                  <input
                    type="text"
                    required
                    value={editSlug}
                    onChange={(e) => setEditSlug(e.target.value)}
                    placeholder="e.g. privacy-policy"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Category</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500"
                  >
                    <option value="LEGAL">LEGAL</option>
                    <option value="PRIVACY">PRIVACY</option>
                    <option value="GUIDELINES">GUIDELINES</option>
                    <option value="COMPLIANCE">COMPLIANCE</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Version with Helper Bumps */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                    <span>Version</span>
                    <span className="space-x-1">
                      <button
                        type="button"
                        onClick={() => bumpVersion("minor")}
                        className="text-[10px] text-amber-700 font-bold hover:underline"
                      >
                        +0.1
                      </button>
                      <span className="text-slate-300">|</span>
                      <button
                        type="button"
                        onClick={() => bumpVersion("major")}
                        className="text-[10px] text-amber-700 font-bold hover:underline"
                      >
                        +1.0
                      </button>
                    </span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editVersion}
                    onChange={(e) => setEditVersion(e.target.value)}
                    placeholder="1.0"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Status Toggle */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Publishing Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-amber-500"
                  >
                    <option value="PUBLISHED">🟢 PUBLISHED (Live Publicly)</option>
                    <option value="DRAFT">🟡 DRAFT (Hidden from Public)</option>
                    <option value="UNPUBLISHED">🔴 UNPUBLISHED (Offline)</option>
                  </select>
                </div>

                {/* Change Notes */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Revision Notes (Audit History)
                  </label>
                  <input
                    type="text"
                    value={editChangeNotes}
                    onChange={(e) => setEditChangeNotes(e.target.value)}
                    placeholder="e.g. Added section on Haversine distance privacy"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Executive Summary</label>
                <textarea
                  rows={2}
                  value={editSummary}
                  onChange={(e) => setEditSummary(e.target.value)}
                  placeholder="Brief 1-2 sentence overview of this policy..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Sections Editor */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
                    Policy Sections ({editSections.length})
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddSection}
                    className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 hover:text-amber-900 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Section</span>
                  </button>
                </div>

                <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-1">
                  {editSections.map((sec, idx) => (
                    <div
                      key={sec.id || idx}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <input
                          type="text"
                          value={sec.title}
                          onChange={(e) => handleUpdateSection(idx, "title", e.target.value)}
                          placeholder="Section Title (e.g. 1. About Banaras Darshan)"
                          className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-900 bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveSection(idx)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 cursor-pointer"
                          title="Remove Section"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <textarea
                        rows={4}
                        value={sec.content}
                        onChange={(e) => handleUpdateSection(idx, "content", e.target.value)}
                        placeholder="Section content and markdown details..."
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs leading-relaxed font-normal bg-white"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Info className="w-3.5 h-3.5 text-amber-600" />
                <span>Saving automatically archives previous revision for audit versioning.</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={saving}
                  onClick={() => handleSave("DRAFT")}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 cursor-pointer"
                >
                  Save as Draft
                </button>

                <button
                  type="button"
                  disabled={saving}
                  onClick={() => handleSave("PUBLISHED")}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? "Saving..." : "Save & Publish"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Version History Modal */}
      {isHistoryOpen && selectedPolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[85vh] rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="space-y-0.5">
                <h3 className="text-lg font-bold text-slate-900 font-serif flex items-center gap-2">
                  <History className="w-5 h-5 text-amber-700" />
                  <span>Audit History: {selectedPolicy.title}</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Current Version: v{selectedPolicy.version} • {selectedPolicy.status}
                </p>
              </div>

              <button
                onClick={() => setIsHistoryOpen(false)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {historyLoading ? (
              <div className="p-8 text-center text-slate-500">
                <div className="w-5 h-5 mx-auto mb-2 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-semibold">Loading revision history...</span>
              </div>
            ) : historyList.length === 0 ? (
              <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <History className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-medium">
                  No previous revisions archived yet. When you edit and save this policy,
                  snapshots will be automatically preserved here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {historyList.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-300 transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs px-2.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-900">
                          v{rev.version}
                        </span>
                        <span className="text-[11px] uppercase font-bold text-slate-500">
                          {rev.status}
                        </span>
                      </div>

                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(rev.archivedAt).toLocaleString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    {rev.changeNotes && (
                      <p className="text-xs text-slate-700 italic">
                        "{rev.changeNotes}"
                      </p>
                    )}

                    <div className="pt-2 flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleRestoreVersion(rev.id, rev.version)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-amber-800 bg-white hover:bg-amber-50 border border-amber-200 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Restore This Version</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

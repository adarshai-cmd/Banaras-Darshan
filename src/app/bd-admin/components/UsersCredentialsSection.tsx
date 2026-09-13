"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Users,
  UserPlus,
  Key,
  Edit2,
  Trash2,
  Search,
  RefreshCw,
  Shield,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Database,
  Cloud,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  User,
  Sliders,
  Check,
  X,
  ExternalLink,
} from "lucide-react";

interface UsersCredentialsSectionProps {
  onShowToast?: (msg: string, type?: "success" | "error") => void;
}

export function UsersCredentialsSection({ onShowToast }: UsersCredentialsSectionProps) {
  const [users, setUsers] = useState<any[]>([]);
  const [supabaseStatus, setSupabaseStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  // Connectivity Test State
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  // Sync State
  const [isSyncing, setIsSyncing] = useState(false);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSupabaseModal, setShowSupabaseModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  // Form States
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formRole, setFormRole] = useState("USER");
  const [formBadge, setFormBadge] = useState("New Explorer");
  const [formReputation, setFormReputation] = useState(10);
  const [showPasswordPlain, setShowPasswordPlain] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Supabase Config Form
  const [sbUrl, setSbUrl] = useState("");
  const [sbAnonKey, setSbAnonKey] = useState("");
  const [sbServiceKey, setSbServiceKey] = useState("");

  const triggerToast = (msg: string, type: "success" | "error" = "success") => {
    if (onShowToast) {
      onShowToast(msg, type);
    }
  };

  // Load Users & Status
  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/bd-admin/users");
      const data = await res.json();
      if (data.success) {
        setUsers(data.users || []);
        setSupabaseStatus(data.supabaseStatus || null);
      } else {
        triggerToast(data.error || "Failed to load users", "error");
      }
    } catch {
      triggerToast("Error loading user credentials.", "error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Load Supabase config for modal
  const openSupabaseConfig = async () => {
    try {
      const res = await fetch("/api/bd-admin/users/config-supabase");
      const data = await res.json();
      if (data.success) {
        setSbUrl(data.url || "");
        setSbAnonKey(data.hasAnonKey ? "••••••••••••••••" : "");
        setSbServiceKey(data.hasServiceRoleKey ? "••••••••••••••••" : "");
      }
    } catch (e) {
      console.error(e);
    }
    setShowSupabaseModal(true);
  };

  // Run Connectivity Test
  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/bd-admin/users/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "test" }),
      });
      const data = await res.json();
      if (data.success && data.testResult) {
        setTestResult(data.testResult);
        triggerToast(data.testResult.message, data.testResult.connected ? "success" : "error");
      } else {
        triggerToast(data.error || "Connection test failed", "error");
      }
    } catch {
      triggerToast("Failed to run connectivity test", "error");
    } finally {
      setIsTesting(false);
    }
  };

  // Run Supabase User Sync
  const handleSyncUsers = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/bd-admin/users/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "sync" }),
      });
      const data = await res.json();
      if (data.success) {
        triggerToast(data.message, "success");
        loadUsers();
      } else {
        triggerToast(data.error || "Sync failed", "error");
      }
    } catch {
      triggerToast("Failed to execute sync", "error");
    } finally {
      setIsSyncing(false);
    }
  };

  // Save Supabase Config
  const handleSaveSupabaseConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    try {
      const res = await fetch("/api/bd-admin/users/config-supabase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: sbUrl,
          anonKey: sbAnonKey.includes("••••") ? "" : sbAnonKey,
          serviceRoleKey: sbServiceKey.includes("••••") ? "" : sbServiceKey,
        }),
      });
      const data = await res.json();
      if (data.success) {
        triggerToast(data.message, "success");
        setShowSupabaseModal(false);
        loadUsers();
      } else {
        setFormError(data.error || "Failed to update Supabase configuration.");
      }
    } catch {
      setFormError("Network error while updating configuration.");
    } finally {
      setFormLoading(false);
    }
  };

  // Create User
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    try {
      const res = await fetch("/api/bd-admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName,
          email: formEmail,
          password: formPassword,
          role: formRole,
          badge: formBadge,
          reputation: formReputation,
        }),
      });
      const data = await res.json();
      if (data.success) {
        triggerToast(data.message, "success");
        setShowCreateModal(false);
        resetForm();
        loadUsers();
      } else {
        setFormError(data.error || "Failed to create user.");
      }
    } catch {
      setFormError("Network error creating user.");
    } finally {
      setFormLoading(false);
    }
  };

  // Edit User
  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setFormLoading(true);
    setFormError(null);
    try {
      const res = await fetch("/api/bd-admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedUser.id,
          name: formName,
          email: formEmail,
          role: formRole,
          badge: formBadge,
          reputation: formReputation,
        }),
      });
      const data = await res.json();
      if (data.success) {
        triggerToast(data.message, "success");
        setShowEditModal(false);
        resetForm();
        loadUsers();
      } else {
        setFormError(data.error || "Failed to update user.");
      }
    } catch {
      setFormError("Network error updating user.");
    } finally {
      setFormLoading(false);
    }
  };

  // Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setFormLoading(true);
    setFormError(null);
    try {
      const res = await fetch("/api/bd-admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedUser.id,
          newPassword: formPassword,
        }),
      });
      const data = await res.json();
      if (data.success) {
        triggerToast(`Password reset successfully for ${selectedUser.name}!`, "success");
        setShowPasswordModal(false);
        resetForm();
        loadUsers();
      } else {
        setFormError(data.error || "Failed to reset password.");
      }
    } catch {
      setFormError("Network error resetting password.");
    } finally {
      setFormLoading(false);
    }
  };

  // Delete User
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    setFormLoading(true);
    try {
      const res = await fetch(`/api/bd-admin/users?id=${selectedUser.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        triggerToast("User account deleted successfully.", "success");
        setShowDeleteModal(false);
        setSelectedUser(null);
        loadUsers();
      } else {
        triggerToast(data.error || "Failed to delete user.", "error");
      }
    } catch {
      triggerToast("Error deleting user.", "error");
    } finally {
      setFormLoading(false);
    }
  };

  const resetForm = () => {
    setFormName("");
    setFormEmail("");
    setFormPassword("");
    setFormRole("USER");
    setFormBadge("New Explorer");
    setFormReputation(10);
    setShowPasswordPlain(false);
    setFormError(null);
    setSelectedUser(null);
  };

  const openEdit = (u: any) => {
    setSelectedUser(u);
    setFormName(u.name || "");
    setFormEmail(u.email || "");
    setFormRole(u.role || "USER");
    setFormBadge(u.badge || "New Explorer");
    setFormReputation(u.reputation ?? 10);
    setFormError(null);
    setShowEditModal(true);
  };

  const openPasswordModal = (u: any) => {
    setSelectedUser(u);
    setFormPassword("");
    setShowPasswordPlain(false);
    setFormError(null);
    setShowPasswordModal(true);
  };

  const openDeleteModal = (u: any) => {
    setSelectedUser(u);
    setShowDeleteModal(true);
  };

  // Filtered users
  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.id && u.id.toLowerCase().includes(q));
    return matchesRole && matchesSearch;
  });

  const adminCount = users.filter((u) => u.role === "ADMIN").length;
  const modCount = users.filter((u) => u.role === "MODERATOR").length;
  const explorerCount = users.filter((u) => u.role === "USER").length;

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-amber-950/20 border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-sm">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight font-serif">
                Login Credentials & Supabase Control
              </h2>
              <p className="text-xs text-slate-400">
                Manage traveler accounts, admin access keys, password resets & cloud Supabase synchronization
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              resetForm();
              setShowCreateModal(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 transition-all shadow-md shadow-amber-500/20 cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add New User / Credential</span>
          </button>

          <button
            onClick={openSupabaseConfig}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-all cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>Configure Supabase</span>
          </button>

          <button
            onClick={handleTestConnection}
            disabled={isTesting}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isTesting ? "animate-spin" : ""}`} />
            <span>{isTesting ? "Testing..." : "Test Connection"}</span>
          </button>

          <button
            onClick={handleSyncUsers}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-all cursor-pointer disabled:opacity-50"
          >
            <Cloud className={`w-3.5 h-3.5 text-indigo-400 ${isSyncing ? "animate-bounce" : ""}`} />
            <span>{isSyncing ? "Syncing..." : "Sync to Supabase"}</span>
          </button>
        </div>
      </div>

      {/* 2. Supabase Integration Live Status Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Status Box */}
        <div className="p-4 rounded-2xl bg-[#0c101b] border border-slate-800/90 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Supabase Auth & DB
            </span>
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  supabaseStatus?.isConfigured
                    ? "bg-emerald-400 shadow-sm shadow-emerald-400/50 animate-pulse"
                    : "bg-amber-400"
                }`}
              />
              <span className="text-sm font-bold text-white">
                {supabaseStatus?.isConfigured ? "Connected & Dual-Sync" : "Local DB (Supabase Standby)"}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              {supabaseStatus?.url ? supabaseStatus.url : "No custom cloud URL set (using local SQLite)"}
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800/60 text-slate-400">
            <Cloud className="w-5 h-5 text-cyan-400" />
          </div>
        </div>

        {/* Security Keys Status */}
        <div className="p-4 rounded-2xl bg-[#0c101b] border border-slate-800/90 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Configured API Keys
            </span>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1 text-slate-300">
                <span className={`w-1.5 h-1.5 rounded-full ${supabaseStatus?.hasAnonKey ? "bg-emerald-400" : "bg-slate-600"}`} />
                Anon Key: {supabaseStatus?.hasAnonKey ? "Active" : "Not Set"}
              </span>
              <span className="text-slate-600">|</span>
              <span className="flex items-center gap-1 text-slate-300">
                <span className={`w-1.5 h-1.5 rounded-full ${supabaseStatus?.hasServiceRoleKey ? "bg-emerald-400" : "bg-slate-600"}`} />
                Service Key: {supabaseStatus?.hasServiceRoleKey ? "Active" : "Not Set"}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Auto-creates Supabase Auth users on signup</p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800/60 text-slate-400">
            <Database className="w-5 h-5 text-indigo-400" />
          </div>
        </div>

        {/* Account Breakdown */}
        <div className="p-4 rounded-2xl bg-[#0c101b] border border-slate-800/90 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Total Managed Accounts
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">{users.length}</span>
              <span className="text-xs text-slate-400">
                ({adminCount} Admins, {modCount} Mods, {explorerCount} Users)
              </span>
            </div>
            <p className="text-[11px] text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Full login & sign up active</span>
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800/60 text-slate-400">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Connectivity Test Alert if test was run */}
      {testResult && (
        <div
          className={`p-4 rounded-2xl border flex items-start gap-3 animate-in fade-in duration-200 ${
            testResult.connected
              ? "bg-emerald-950/30 border-emerald-500/30 text-emerald-200"
              : "bg-rose-950/30 border-rose-500/30 text-rose-200"
          }`}
        >
          {testResult.connected ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          )}
          <div className="text-xs space-y-0.5 flex-1">
            <div className="font-bold flex items-center gap-2">
              <span>{testResult.message}</span>
              {testResult.latencyMs && (
                <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-mono">
                  {testResult.latencyMs}ms
                </span>
              )}
            </div>
            <p className="text-[11px] opacity-80">
              Supabase Auth API: {testResult.authWorking ? "Working & Ready" : "Standby"} | Target URL: {testResult.url || "Local"}
            </p>
          </div>
          <button
            onClick={() => setTestResult(null)}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 3. Search & Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-[#0c101b] border border-slate-800/80">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Name, Email or ID..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none transition-all"
          />
        </div>

        {/* Role Segmented Filters */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800/80 self-stretch sm:self-auto overflow-x-auto">
          {[
            { id: "ALL", label: `All (${users.length})` },
            { id: "ADMIN", label: `Admins (${adminCount})` },
            { id: "MODERATOR", label: `Mods (${modCount})` },
            { id: "USER", label: `Explorers (${explorerCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setRoleFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                roleFilter === tab.id
                  ? "bg-amber-500 text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Users Table */}
      <div className="rounded-2xl border border-slate-800 bg-[#0c101b] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">User Details</th>
                <th className="py-3 px-4">Role & Access</th>
                <th className="py-3 px-4">Community Badge</th>
                <th className="py-3 px-4">Activity</th>
                <th className="py-3 px-4">Registered</th>
                <th className="py-3 px-4 text-right">Credentials Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-500" />
                    <span>Loading registered users and credentials...</span>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <User className="w-8 h-8 mx-auto mb-2 text-slate-600 opacity-40" />
                    <span>No user accounts found matching your query.</span>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isAdmin = u.role === "ADMIN";
                  const isMod = u.role === "MODERATOR";

                  return (
                    <tr key={u.id} className="hover:bg-slate-900/40 transition-colors">
                      {/* Name & Email */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs uppercase shadow-sm ${
                              isAdmin
                                ? "bg-amber-500 text-slate-950 font-black ring-2 ring-amber-500/30"
                                : isMod
                                ? "bg-indigo-600 text-white font-bold ring-2 ring-indigo-500/30"
                                : "bg-slate-800 text-slate-200"
                            }`}
                          >
                            {u.name ? u.name.charAt(0) : "U"}
                          </div>
                          <div>
                            <span className="font-bold text-white block text-xs">{u.name}</span>
                            <span className="text-[11px] text-slate-400 font-mono">{u.email || "No email"}</span>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                            isAdmin
                              ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                              : isMod
                              ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/30"
                              : "bg-slate-800 text-slate-300 border border-slate-700"
                          }`}
                        >
                          {isAdmin ? <Shield className="w-3 h-3 text-amber-400" /> : null}
                          {isMod ? <ShieldCheck className="w-3 h-3 text-indigo-400" /> : null}
                          <span>{u.role}</span>
                        </span>
                      </td>

                      {/* Badge & Reputation */}
                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <span className="text-[11px] font-medium text-slate-300 block">
                            {u.badge || "New Explorer"}
                          </span>
                          <span className="text-[10px] text-amber-400 font-mono">
                            Rep: {u.reputation ?? 10} pts
                          </span>
                        </div>
                      </td>

                      {/* Activity */}
                      <td className="py-3 px-4">
                        <div className="text-[11px] text-slate-400 space-x-2">
                          <span>{u._count?.savedPlaces || 0} Saved</span>
                          <span>•</span>
                          <span>{u._count?.trips || 0} Trips</span>
                          <span>•</span>
                          <span className="text-emerald-400">{u._count?.sessions || 0} Sessions</span>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-3 px-4">
                        <span className="text-[11px] text-slate-500 font-mono">
                          {new Date(u.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openPasswordModal(u)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 text-[11px] font-semibold border border-slate-700 hover:border-amber-500/40 transition-all cursor-pointer"
                            title="Reset / Change Password"
                          >
                            <Key className="w-3 h-3" />
                            <span>Password</span>
                          </button>

                          <button
                            onClick={() => openEdit(u)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer"
                            title="Edit User Profile"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => openDeleteModal(u)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-500/30 transition-all cursor-pointer"
                            title="Delete User Account"
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

      {/* ---------------------------------------------------- */}
      {/* MODAL 1: Create New User / Credential */}
      {/* ---------------------------------------------------- */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md rounded-2xl bg-[#0e1424] border border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2 text-white font-serif font-bold text-base">
                <UserPlus className="w-4 h-4 text-amber-500" />
                <span>Add New User / Credential</span>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Full Name</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Adarsh Pandey"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Email Address or Login ID</label>
                <input
                  type="text"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="e.g. adarsh@kashi.in or adarsh_pandey"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
                <p className="text-[10px] text-slate-500">
                  User can sign in using this ID or email.
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Initial Password</label>
                <div className="relative">
                  <input
                    type={showPasswordPlain ? "text" : "password"}
                    required
                    minLength={6}
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full pl-3 pr-9 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-amber-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordPlain(!showPasswordPlain)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPasswordPlain ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Account Role</label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="USER">USER (Explorer)</option>
                    <option value="MODERATOR">MODERATOR</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Community Badge</label>
                  <select
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="New Explorer">New Explorer</option>
                    <option value="Helpful Traveler">Helpful Traveler</option>
                    <option value="Local Guide">Local Guide</option>
                    <option value="Trusted Contributor">Trusted Contributor</option>
                    <option value="Verified Contributor">Verified Contributor</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 transition-all cursor-pointer disabled:opacity-50"
                >
                  {formLoading ? "Creating..." : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* MODAL 2: Reset / Change Password */}
      {/* ---------------------------------------------------- */}
      {showPasswordModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md rounded-2xl bg-[#0e1424] border border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2 text-white font-serif font-bold text-base">
                <Key className="w-4 h-4 text-amber-500" />
                <span>Reset User Password</span>
              </div>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <span className="block font-bold text-white">{selectedUser.name}</span>
              <span className="text-[11px] text-slate-400 font-mono">{selectedUser.email}</span>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">New Password</label>
                <div className="relative">
                  <input
                    type={showPasswordPlain ? "text" : "password"}
                    required
                    minLength={6}
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                    placeholder="Enter new password (min 6 chars)"
                    className="w-full pl-3 pr-9 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-amber-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordPlain(!showPasswordPlain)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPasswordPlain ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-500">
                  Password will be updated in both local database and Supabase Auth.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 transition-all cursor-pointer disabled:opacity-50"
                >
                  {formLoading ? "Updating..." : "Set New Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* MODAL 3: Edit User Details */}
      {/* ---------------------------------------------------- */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md rounded-2xl bg-[#0e1424] border border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2 text-white font-serif font-bold text-base">
                <Edit2 className="w-4 h-4 text-amber-500" />
                <span>Edit User Profile</span>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleEditUser} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Display Name</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Email Address</label>
                <input
                  type="text"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Role</label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="USER">USER</option>
                    <option value="MODERATOR">MODERATOR</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Reputation</label>
                  <input
                    type="number"
                    value={formReputation}
                    onChange={(e) => setFormReputation(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Badge</label>
                <select
                  value={formBadge}
                  onChange={(e) => setFormBadge(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-amber-500 focus:outline-none"
                >
                  <option value="New Explorer">New Explorer</option>
                  <option value="Helpful Traveler">Helpful Traveler</option>
                  <option value="Local Guide">Local Guide</option>
                  <option value="Trusted Contributor">Trusted Contributor</option>
                  <option value="Verified Contributor">Verified Contributor</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 transition-all cursor-pointer disabled:opacity-50"
                >
                  {formLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* MODAL 4: Delete User Confirmation */}
      {/* ---------------------------------------------------- */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-sm rounded-2xl bg-[#0e1424] border border-rose-900/50 shadow-2xl p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/20">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white font-serif">Delete User Account?</h3>
              <p className="text-xs text-slate-400">
                Are you sure you want to permanently delete <strong className="text-white">{selectedUser.name}</strong> ({selectedUser.email})? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                disabled={formLoading}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition-all cursor-pointer disabled:opacity-50"
              >
                {formLoading ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* MODAL 5: Configure Supabase Keys */}
      {/* ---------------------------------------------------- */}
      {showSupabaseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-2xl bg-[#0e1424] border border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2 text-white font-serif font-bold text-base">
                <Cloud className="w-4 h-4 text-cyan-400" />
                <span>Configure Supabase Project</span>
              </div>
              <button
                onClick={() => setShowSupabaseModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Connect your live Supabase cloud project. Enter your project URL and API keys from your Supabase dashboard (Project Settings &rarr; API).
            </p>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveSupabaseConfig} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  Supabase Project URL (NEXT_PUBLIC_SUPABASE_URL)
                </label>
                <input
                  type="url"
                  required
                  value={sbUrl}
                  onChange={(e) => setSbUrl(e.target.value)}
                  placeholder="https://xyzproject.supabase.co"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  Supabase Anon Public Key (NEXT_PUBLIC_SUPABASE_ANON_KEY)
                </label>
                <input
                  type="text"
                  value={sbAnonKey}
                  onChange={(e) => setSbAnonKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsIn..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  Supabase Service Role Key (SUPABASE_SERVICE_ROLE_KEY) - Optional for Admin Auth
                </label>
                <input
                  type="password"
                  value={sbServiceKey}
                  onChange={(e) => setSbServiceKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsIn... (Server only)"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowSupabaseModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-all cursor-pointer disabled:opacity-50"
                >
                  {formLoading ? "Testing & Saving..." : "Save & Connect"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

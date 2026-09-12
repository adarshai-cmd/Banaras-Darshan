"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  LayoutDashboard,
  Landmark,
  Waves,
  UtensilsCrossed,
  Compass,
  SquareParking,
  Sparkles,
  ShieldAlert,
  MessageSquare,
  Bot,
  Settings,
  Image as ImageIcon,
  Plus,
  Search,
  RefreshCw,
  LogOut,
  ExternalLink,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Upload,
  MapPin,
  Clock,
  Car,
  ChevronRight,
  Filter,
  Check,
  X,
  Eye,
  Link2,
  Menu,
  Phone,
  Layers,
  FileText,
  SlidersHorizontal,
  Megaphone,
  CloudSun,
} from "lucide-react";
import { PlaceFormModal } from "./components/PlaceFormModal";
import { PromotionsSection } from "./components/PromotionsSection";
import { WeatherSettingsSection } from "./components/WeatherSettingsSection";

interface AdminUser {
  id: string;
  email?: string | null;
  name: string;
  avatar?: string | null;
  role: string;
}

interface AdminDashboardLayoutProps {
  currentUser: AdminUser;
}

type TabType =
  | "dashboard"
  | "temples"
  | "ghats"
  | "food"
  | "tourist"
  | "all-places"
  | "promotions"
  | "weather"
  | "parking"
  | "nearby"
  | "gallery"
  | "moderation"
  | "community"
  | "chatbot"
  | "website"
  | "security";

export function AdminDashboardLayout({ currentUser }: AdminDashboardLayoutProps) {
  const [currentTab, setCurrentTab] = useState<TabType>(() => {
    if (typeof window !== "undefined") {
      const tabParam = new URLSearchParams(window.location.search).get("tab") as TabType;
      if (tabParam) return tabParam;
    }
    return "dashboard";
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Stats state
  const [stats, setStats] = useState({
    totalTemples: 0,
    totalGhats: 0,
    totalFood: 0,
    totalTouristPlaces: 0,
    totalParking: 0,
    totalGallery: 0,
    pendingModeration: 0,
    pendingSuggestions: 0,
    pendingReports: 0,
    heldMessages: 0,
    totalCommunityMessages: 0,
    totalUsers: 0,
    totalPromotions: 0,
    activePromotions: 0,
  });

  // Places state
  const [places, setPlaces] = useState<any[]>([]);
  const [isPlaceModalOpen, setIsPlaceModalOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState<any | null>(null);
  const [defaultCategoryForNew, setDefaultCategoryForNew] = useState<string>("TEMPLE");

  // Parking state
  const [parkings, setParkings] = useState<any[]>([]);
  const [parkingModalOpen, setParkingModalOpen] = useState(false);
  const [editingParking, setEditingParking] = useState<any | null>(null);

  // Gallery state
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [newImagePayload, setNewImagePayload] = useState({
    title: "",
    caption: "",
    imageUrl: "",
    category: "GENERAL",
    placeName: "",
    isFeatured: false,
  });
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Moderation state
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [heldMessages, setHeldMessages] = useState<any[]>([]);

  // Community state
  const [communityMessages, setCommunityMessages] = useState<any[]>([]);

  // Chatbot config state
  const [botConfig, setBotConfig] = useState({
    welcomeGreeting: "",
    guidanceScope: "",
    customInstructions: "",
    emergencyContacts: "",
  });

  // Website Settings state
  const [siteSettings, setSiteSettings] = useState<any>({
    announcement_banner: { enabled: true, text: "", badge: "UPDATE", link: "" },
    hero_content: { badge: "", title: "", subtitle: "" },
    emergency_helpline: { touristPolice: "", nationalEmergency: "", hospital: "" },
  });

  // Password state
  const [passwordState, setPasswordState] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Delete confirm modal state
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => Promise<void>;
  }>({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: async () => {},
  });

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4500);
  };

  // --- Fetching Data ---
  const loadStats = useCallback(async () => {
    try {
      const res = await fetch("/api/bd-admin/stats");
      const data = await res.json();
      if (data.success && data.stats) {
        setStats(data.stats);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const loadPlaces = useCallback(async (cat?: string) => {
    setIsLoading(true);
    try {
      let url = "/api/bd-admin/places?limit=300";
      if (cat && cat !== "ALL") {
        url += `&category=${cat}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && data.places) {
        setPlaces(data.places);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadParkings = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/bd-admin/parking");
      const data = await res.json();
      if (data.success && data.parkings) {
        setParkings(data.parkings);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadGallery = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/bd-admin/gallery");
      const data = await res.json();
      if (data.success && data.images) {
        setGalleryImages(data.images);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadModeration = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/bd-admin/moderation");
      const data = await res.json();
      if (data.success) {
        setSuggestions(data.suggestions || []);
        setReports(data.reports || []);
        setHeldMessages(data.heldMessages || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadCommunity = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/bd-admin/community");
      const data = await res.json();
      if (data.success && data.messages) {
        setCommunityMessages(data.messages);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadChatbot = useCallback(async () => {
    try {
      const res = await fetch("/api/bd-admin/chatbot");
      const data = await res.json();
      if (data.success && data.config) {
        setBotConfig(data.config);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const loadSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/bd-admin/content");
      const data = await res.json();
      if (data.success && data.settings) {
        setSiteSettings((prev: any) => ({ ...prev, ...data.settings }));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Initial load and tab switching
  useEffect(() => {
    if (currentTab === "dashboard") {
      loadStats();
    } else if (currentTab === "temples") {
      loadPlaces("TEMPLE");
    } else if (currentTab === "ghats") {
      loadPlaces("GHAT");
    } else if (currentTab === "food") {
      loadPlaces("FOOD");
    } else if (currentTab === "tourist") {
      loadPlaces("ALL");
    } else if (currentTab === "all-places") {
      loadPlaces("ALL");
    } else if (currentTab === "parking") {
      loadParkings();
    } else if (currentTab === "nearby") {
      loadPlaces("ALL");
    } else if (currentTab === "gallery") {
      loadGallery();
    } else if (currentTab === "moderation") {
      loadModeration();
    } else if (currentTab === "community") {
      loadCommunity();
    } else if (currentTab === "chatbot") {
      loadChatbot();
    } else if (currentTab === "website") {
      loadSettings();
    }
  }, [currentTab, loadStats, loadPlaces, loadParkings, loadGallery, loadModeration, loadCommunity, loadChatbot, loadSettings]);

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch("/api/bd-admin/auth", { method: "DELETE" });
      window.location.reload();
    } catch {
      window.location.reload();
    }
  };

  // Place CRUD handlers
  const handleOpenNewPlace = (category: string = "TEMPLE") => {
    setDefaultCategoryForNew(category);
    setEditingPlace(null);
    setIsPlaceModalOpen(true);
  };

  const handleEditPlace = (place: any) => {
    setEditingPlace(place);
    setIsPlaceModalOpen(true);
  };

  const handleDeletePlace = (id: string, name: string) => {
    setDeleteConfirm({
      isOpen: true,
      title: "Delete Place",
      description: `Are you sure you want to permanently delete "${name}"? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/bd-admin/places/${id}`, { method: "DELETE" });
          const data = await res.json();
          if (res.ok && data.success) {
            showToast(`"${name}" deleted successfully.`);
            setPlaces((prev) => prev.filter((p) => p.id !== id));
            loadStats();
          } else {
            showToast(data.error || "Failed to delete place.", "error");
          }
        } catch {
          showToast("Network error deleting place.", "error");
        }
      },
    });
  };

  // Parking CRUD handlers
  const handleSaveParking = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isEditing = Boolean(editingParking?.id);
      const url = "/api/bd-admin/parking";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingParking),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message || "Parking saved successfully.");
        setParkingModalOpen(false);
        setEditingParking(null);
        loadParkings();
        loadStats();
      } else {
        showToast(data.error || "Failed to save parking.", "error");
      }
    } catch {
      showToast("Network error saving parking.", "error");
    }
  };

  const handleDeleteParking = (id: string, name: string) => {
    setDeleteConfirm({
      isOpen: true,
      title: "Delete Parking Location",
      description: `Are you sure you want to delete parking "${name}"?`,
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/bd-admin/parking?id=${id}`, { method: "DELETE" });
          const data = await res.json();
          if (res.ok && data.success) {
            showToast("Parking location deleted.");
            setParkings((prev) => prev.filter((p) => p.id !== id));
            loadStats();
          } else {
            showToast(data.error || "Failed to delete parking.", "error");
          }
        } catch {
          showToast("Network error deleting parking.", "error");
        }
      },
    });
  };

  // Gallery Handlers
  const handleUploadGalleryImage = async (file: File) => {
    setIsUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "gallery");

      const res = await fetch("/api/bd-admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setNewImagePayload((prev) => ({ ...prev, imageUrl: data.url }));
        showToast("Photo uploaded to server successfully.");
      } else {
        showToast(data.error || "Upload failed.", "error");
      }
    } catch {
      showToast("Network error during photo upload.", "error");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSaveGalleryImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImagePayload.imageUrl) {
      showToast("Please upload or enter an image URL.", "error");
      return;
    }

    try {
      const res = await fetch("/api/bd-admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newImagePayload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast("Image added to gallery!");
        setUploadModalOpen(false);
        setNewImagePayload({
          title: "",
          caption: "",
          imageUrl: "",
          category: "GENERAL",
          placeName: "",
          isFeatured: false,
        });
        loadGallery();
        loadStats();
      } else {
        showToast(data.error || "Failed to save image.", "error");
      }
    } catch {
      showToast("Network error saving image.", "error");
    }
  };

  const handleDeleteGalleryImage = (id: string) => {
    setDeleteConfirm({
      isOpen: true,
      title: "Delete Image",
      description: "Are you sure you want to remove this image from the gallery?",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/bd-admin/gallery?id=${id}`, { method: "DELETE" });
          const data = await res.json();
          if (res.ok && data.success) {
            showToast("Image deleted.");
            setGalleryImages((prev) => prev.filter((img) => img.id !== id));
            loadStats();
          } else {
            showToast(data.error || "Failed to delete image.", "error");
          }
        } catch {
          showToast("Network error.", "error");
        }
      },
    });
  };

  // Moderation Handlers
  const handleApproveSuggestion = async (id: string, name: string) => {
    try {
      const res = await fetch("/api/bd-admin/moderation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "APPROVE_SUGGESTION", targetId: id }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`"${name}" approved & published to live directory!`);
        setSuggestions((prev) => prev.filter((s) => s.id !== id));
        loadStats();
      } else {
        showToast(data.error || "Failed to approve suggestion.", "error");
      }
    } catch {
      showToast("Network error approving suggestion.", "error");
    }
  };

  const handleRejectSuggestion = async (id: string) => {
    try {
      const res = await fetch("/api/bd-admin/moderation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "REJECT_SUGGESTION", targetId: id }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast("Suggestion rejected.");
        setSuggestions((prev) => prev.filter((s) => s.id !== id));
        loadStats();
      }
    } catch {
      showToast("Error rejecting suggestion.", "error");
    }
  };

  const handleResolveReport = async (id: string) => {
    try {
      const res = await fetch("/api/bd-admin/moderation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "RESOLVE_REPORT", targetId: id }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast("Report marked as resolved.");
        setReports((prev) => prev.filter((r) => r.id !== id));
        loadStats();
      }
    } catch {
      showToast("Error resolving report.", "error");
    }
  };

  const handleReleaseHeldMessage = async (id: string) => {
    try {
      const res = await fetch("/api/bd-admin/moderation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "APPROVE_MESSAGE", targetId: id }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast("Message approved and published to community feed.");
        setHeldMessages((prev) => prev.filter((m) => m.id !== id));
        loadStats();
      }
    } catch {
      showToast("Error releasing message.", "error");
    }
  };

  // Community handlers
  const handleDeleteCommunityMessage = (messageId: string, replyId?: string) => {
    setDeleteConfirm({
      isOpen: true,
      title: replyId ? "Delete Community Reply" : "Delete Community Question",
      description: "Are you sure you want to permanently delete this content?",
      onConfirm: async () => {
        try {
          const url = replyId
            ? `/api/bd-admin/community?replyId=${replyId}`
            : `/api/bd-admin/community?messageId=${messageId}`;
          const res = await fetch(url, { method: "DELETE" });
          const data = await res.json();
          if (res.ok && data.success) {
            showToast("Deleted successfully.");
            loadCommunity();
            loadStats();
          } else {
            showToast(data.error || "Failed to delete.", "error");
          }
        } catch {
          showToast("Network error deleting community item.", "error");
        }
      },
    });
  };

  // Chatbot config save
  const handleSaveBotConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/bd-admin/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(botConfig),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast("AI Chatbot settings saved successfully!");
      } else {
        showToast(data.error || "Failed to save AI config.", "error");
      }
    } catch {
      showToast("Network error saving AI config.", "error");
    }
  };

  // Website Settings save
  const handleSaveSiteSettings = async (key: string, value: any) => {
    try {
      const res = await fetch("/api/bd-admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Website setting "${key}" updated.`);
      } else {
        showToast(data.error || "Failed to save setting.", "error");
      }
    } catch {
      showToast("Error updating settings.", "error");
    }
  };

  // Password Change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordState.newPassword !== passwordState.confirmPassword) {
      showToast("New passwords do not match.", "error");
      return;
    }
    if (passwordState.newPassword.length < 8) {
      showToast("Password must be at least 8 characters.", "error");
      return;
    }

    try {
      const res = await fetch("/api/bd-admin/auth", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordState.currentPassword,
          newPassword: passwordState.newPassword,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast("Password changed successfully.");
        setPasswordState({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        showToast(data.error || "Failed to change password.", "error");
      }
    } catch {
      showToast("Network error changing password.", "error");
    }
  };

  // Filtered places
  const displayedPlaces = places.filter((p) => {
    if (currentTab === "temples" && p.category !== "TEMPLE") return false;
    if (currentTab === "ghats" && p.category !== "GHAT") return false;
    if (currentTab === "food" && p.category !== "FOOD") return false;
    if (
      currentTab === "tourist" &&
      !["HIDDEN", "STREET", "EXPERIENCE", "HOTEL"].includes(p.category)
    )
      return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      (p.hindiName && p.hindiName.toLowerCase().includes(q)) ||
      p.area.toLowerCase().includes(q) ||
      p.address.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#0E131F] text-slate-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl border shadow-xl flex items-center gap-3 transition-all transform animate-in fade-in slide-in-from-top-2 ${
            notification.type === "success"
              ? "bg-emerald-950/90 border-emerald-500/50 text-emerald-200"
              : "bg-red-950/90 border-red-500/50 text-red-200"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          )}
          <span className="text-sm font-medium">{notification.message}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 bg-[#141B2D]/95 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-slate-950 font-serif font-black shadow-md">
              BD
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-base text-white tracking-wide">
                  Banaras Darshan
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-amber-500/20 border border-amber-500/30 text-amber-300 uppercase">
                  Admin CMS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Hidden Control Center • Live Database Management
              </p>
            </div>
          </div>
        </div>

        {/* Center Search for Places */}
        {["dashboard", "temples", "ghats", "food", "tourist", "all-places"].includes(currentTab) && (
          <div className="hidden md:flex items-center relative w-72 lg:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search places by name, area, or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#1A2234] border border-slate-700/60 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-500/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs text-slate-200 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>Public Site</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>

          <div className="h-6 w-px bg-slate-800 hidden sm:block" />

          {/* User info */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs text-amber-300 border border-amber-500/30">
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-semibold text-white leading-tight">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-amber-400/90 font-medium">
                {currentUser.role}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Logout from Admin"
            className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-800/50 text-red-300 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 relative overflow-hidden">
        {/* Left Sidebar */}
        <aside
          className={`${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 fixed lg:static z-20 inset-y-0 left-0 w-64 bg-[#111726] border-r border-slate-800/80 flex flex-col transition-transform duration-200 ease-in-out`}
        >
          <div className="p-4 border-b border-slate-800/60">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Directory Manager
            </div>
            <div className="space-y-1">
              <button
                onClick={() => {
                  setCurrentTab("dashboard");
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  currentTab === "dashboard"
                    ? "bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm"
                    : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-amber-400" />
                <span>Dashboard Overview</span>
              </button>

              <button
                onClick={() => {
                  setCurrentTab("temples");
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  currentTab === "temples"
                    ? "bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm"
                    : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Landmark className="w-4 h-4 text-amber-400" />
                  <span>Temples</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                  {stats.totalTemples}
                </span>
              </button>

              <button
                onClick={() => {
                  setCurrentTab("ghats");
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  currentTab === "ghats"
                    ? "bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm"
                    : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Waves className="w-4 h-4 text-sky-400" />
                  <span>Ghats</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                  {stats.totalGhats}
                </span>
              </button>

              <button
                onClick={() => {
                  setCurrentTab("food");
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  currentTab === "food"
                    ? "bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm"
                    : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <UtensilsCrossed className="w-4 h-4 text-orange-400" />
                  <span>Food & Eateries</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                  {stats.totalFood}
                </span>
              </button>

              <button
                onClick={() => {
                  setCurrentTab("tourist");
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  currentTab === "tourist"
                    ? "bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm"
                    : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Compass className="w-4 h-4 text-emerald-400" />
                  <span>Tourist Places</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                  {stats.totalTouristPlaces}
                </span>
              </button>

              <button
                onClick={() => {
                  setCurrentTab("all-places");
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  currentTab === "all-places"
                    ? "bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm"
                    : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-violet-400" />
                  <span>All Places</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                  {places.length || stats.totalTemples + stats.totalGhats + stats.totalFood + stats.totalTouristPlaces}
                </span>
              </button>

              <button
                onClick={() => {
                  setCurrentTab("promotions");
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  currentTab === "promotions"
                    ? "bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm"
                    : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Megaphone className="w-4 h-4 text-amber-400" />
                  <span>Promotions & Ads</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 font-semibold">
                  {stats.activePromotions || 0}
                </span>
              </button>

              <button
                onClick={() => {
                  setCurrentTab("weather");
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  currentTab === "weather"
                    ? "bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm"
                    : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                }`}
              >
                <CloudSun className="w-4 h-4 text-sky-400" />
                <span>Banaras Weather</span>
              </button>
            </div>
          </div>

          {/* Infrastructure & Operations */}
          <div className="p-4 border-b border-slate-800/60 flex-1 overflow-y-auto space-y-4">
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                City Data & Media
              </div>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setCurrentTab("parking");
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    currentTab === "parking"
                      ? "bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm"
                      : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <SquareParking className="w-4 h-4 text-blue-400" />
                    <span>Parking Locations</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                    {stats.totalParking}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setCurrentTab("nearby");
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    currentTab === "nearby"
                      ? "bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm"
                      : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                  }`}
                >
                  <Link2 className="w-4 h-4 text-teal-400" />
                  <span>Nearby Places Linking</span>
                </button>

                <button
                  onClick={() => {
                    setCurrentTab("gallery");
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    currentTab === "gallery"
                      ? "bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm"
                      : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ImageIcon className="w-4 h-4 text-pink-400" />
                    <span>Photos & Gallery</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                    {stats.totalGallery}
                  </span>
                </button>
              </div>
            </div>

            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Moderation & AI
              </div>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setCurrentTab("moderation");
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    currentTab === "moderation"
                      ? "bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm"
                      : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                    <span>Moderation Queue</span>
                  </div>
                  {stats.pendingModeration > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white animate-pulse">
                      {stats.pendingModeration}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => {
                    setCurrentTab("community");
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    currentTab === "community"
                      ? "bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm"
                      : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <MessageSquare className="w-4 h-4 text-indigo-400" />
                    <span>Community Messages</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                    {stats.totalCommunityMessages}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setCurrentTab("chatbot");
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    currentTab === "chatbot"
                      ? "bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm"
                      : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                  }`}
                >
                  <Bot className="w-4 h-4 text-purple-400" />
                  <span>AI Chatbot Directives</span>
                </button>

                <button
                  onClick={() => {
                    setCurrentTab("website");
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    currentTab === "website"
                      ? "bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm"
                      : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                  }`}
                >
                  <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
                  <span>Website Content</span>
                </button>

                <button
                  onClick={() => {
                    setCurrentTab("security");
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    currentTab === "security"
                      ? "bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm"
                      : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                  }`}
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Admin Security</span>
                </button>
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#0c101b] border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Hidden CMS v2.4</span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Connected
            </span>
          </div>
        </aside>

        {/* Main Workspace Body */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6">
          {/* Top Bar Contextual Title & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-white font-serif tracking-tight capitalize flex items-center gap-2.5">
                {currentTab === "dashboard" && "Console Overview & Metrics"}
                {currentTab === "temples" && "Temples of Kashi"}
                {currentTab === "ghats" && "Sacred Ghats of Varanasi"}
                {currentTab === "food" && "Culinary Spots & Street Food"}
                {currentTab === "tourist" && "Tourist Places & Experiences"}
                {currentTab === "all-places" && "Complete Directory Master List"}
                {currentTab === "promotions" && "Promotions & Dynamic Advertisements"}
                {currentTab === "weather" && "Banaras Weather & Travel Insights"}
                {currentTab === "parking" && "Parking Locations & Stand Manager"}
                {currentTab === "nearby" && "Nearby Places Relationship Linking"}
                {currentTab === "gallery" && "Photo Assets & Gallery Management"}
                {currentTab === "moderation" && "Live Moderation & Verification Desk"}
                {currentTab === "community" && "Community QA & Discussions"}
                {currentTab === "chatbot" && "Banaras AI Chatbot Directives"}
                {currentTab === "website" && "Website Content & Announcements"}
                {currentTab === "security" && "Administrative Security & Credentials"}
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Full live CMS control. Changes immediately reflect in the public app.
              </p>
            </div>

            {/* Quick Action Buttons Depending on Tab */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (currentTab === "dashboard") loadStats();
                  else if (["temples", "ghats", "food", "tourist", "all-places"].includes(currentTab))
                    loadPlaces();
                  else if (currentTab === "parking") loadParkings();
                  else if (currentTab === "gallery") loadGallery();
                  else if (currentTab === "moderation") loadModeration();
                  else if (currentTab === "community") loadCommunity();
                  showToast("Data refreshed.");
                }}
                title="Refresh current view"
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              </button>

              {["temples", "ghats", "food", "tourist", "all-places", "dashboard"].includes(currentTab) && (
                <button
                  onClick={() =>
                    handleOpenNewPlace(
                      currentTab === "temples"
                        ? "TEMPLE"
                        : currentTab === "ghats"
                        ? "GHAT"
                        : currentTab === "food"
                        ? "FOOD"
                        : "HIDDEN"
                    )
                  }
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold text-xs shadow-lg shadow-amber-500/20 transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>
                    Add New{" "}
                    {currentTab === "temples"
                      ? "Temple"
                      : currentTab === "ghats"
                      ? "Ghat"
                      : currentTab === "food"
                      ? "Eatery"
                      : "Place"}
                  </span>
                </button>
              )}

              {currentTab === "parking" && (
                <button
                  onClick={() => {
                    setEditingParking({
                      name: "",
                      address: "",
                      area: "",
                      latitude: 25.3109,
                      longitude: 83.0107,
                      capacity: "100 Vehicles",
                      parkingType: "MUNICIPAL",
                      timing: "24 Hours Open",
                      vehicleSupport: "BOTH",
                      feeStatus: "PAID",
                      feeRate: "₹20/hr 2-wheeler, ₹50/hr 4-wheeler",
                      directionsNote: "",
                      associatedPlaces: "",
                      image: "",
                    });
                    setParkingModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold text-xs shadow-lg shadow-blue-500/20 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Parking Stand</span>
                </button>
              )}

              {currentTab === "gallery" && (
                <button
                  onClick={() => setUploadModalOpen(true)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold text-xs shadow-lg shadow-pink-500/20 transition-all"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Photo to Server</span>
                </button>
              )}
            </div>
          </div>

          {/* ========================================================== */}
          {/* TAB: DASHBOARD OVERVIEW */}
          {/* ========================================================== */}
          {currentTab === "dashboard" && (
            <div className="space-y-6">
              {/* Metric Stat Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div
                  onClick={() => setCurrentTab("temples")}
                  className="p-4 rounded-2xl bg-[#161E2E] border border-slate-700/60 hover:border-amber-500/50 cursor-pointer transition-all hover:-translate-y-0.5 group shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">Temples</span>
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
                      <Landmark className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-3 text-2xl lg:text-3xl font-bold text-white font-mono">
                    {stats.totalTemples}
                  </div>
                  <div className="text-[11px] text-amber-400/80 mt-1 flex items-center gap-1">
                    <span>Manage sacred temples</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>

                <div
                  onClick={() => setCurrentTab("ghats")}
                  className="p-4 rounded-2xl bg-[#161E2E] border border-slate-700/60 hover:border-sky-500/50 cursor-pointer transition-all hover:-translate-y-0.5 group shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">Ghats</span>
                    <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 group-hover:scale-110 transition-transform">
                      <Waves className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-3 text-2xl lg:text-3xl font-bold text-white font-mono">
                    {stats.totalGhats}
                  </div>
                  <div className="text-[11px] text-sky-400/80 mt-1 flex items-center gap-1">
                    <span>Manage Ganga ghats</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>

                <div
                  onClick={() => setCurrentTab("food")}
                  className="p-4 rounded-2xl bg-[#161E2E] border border-slate-700/60 hover:border-orange-500/50 cursor-pointer transition-all hover:-translate-y-0.5 group shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">Food & Eateries</span>
                    <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400 group-hover:scale-110 transition-transform">
                      <UtensilsCrossed className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-3 text-2xl lg:text-3xl font-bold text-white font-mono">
                    {stats.totalFood}
                  </div>
                  <div className="text-[11px] text-orange-400/80 mt-1 flex items-center gap-1">
                    <span>Under ₹150 budget foods</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>

                <div
                  onClick={() => setCurrentTab("tourist")}
                  className="p-4 rounded-2xl bg-[#161E2E] border border-slate-700/60 hover:border-emerald-500/50 cursor-pointer transition-all hover:-translate-y-0.5 group shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">Tourist & Experiences</span>
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
                      <Compass className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-3 text-2xl lg:text-3xl font-bold text-white font-mono">
                    {stats.totalTouristPlaces}
                  </div>
                  <div className="text-[11px] text-emerald-400/80 mt-1 flex items-center gap-1">
                    <span>Hidden gems & sites</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </div>

              {/* Secondary stats row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div
                  onClick={() => setCurrentTab("parking")}
                  className="p-4 rounded-2xl bg-[#161E2E] border border-slate-700/60 hover:border-blue-500/50 cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">Parking Stands</span>
                    <SquareParking className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="mt-2 text-xl font-bold text-white font-mono">
                    {stats.totalParking}
                  </div>
                  <span className="text-[11px] text-slate-400">2-wheeler & 4-wheeler stands</span>
                </div>

                <div
                  onClick={() => setCurrentTab("gallery")}
                  className="p-4 rounded-2xl bg-[#161E2E] border border-slate-700/60 hover:border-pink-500/50 cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">Photo Assets</span>
                    <ImageIcon className="w-4 h-4 text-pink-400" />
                  </div>
                  <div className="mt-2 text-xl font-bold text-white font-mono">
                    {stats.totalGallery}
                  </div>
                  <span className="text-[11px] text-slate-400">Server & gallery images</span>
                </div>

                <div
                  onClick={() => setCurrentTab("moderation")}
                  className="p-4 rounded-2xl bg-[#161E2E] border border-slate-700/60 hover:border-rose-500/50 cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">Pending Moderation</span>
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                  </div>
                  <div className="mt-2 text-xl font-bold text-rose-400 font-mono">
                    {stats.pendingModeration}
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {stats.pendingSuggestions} suggestions, {stats.pendingReports} reports
                  </span>
                </div>

                <div
                  onClick={() => setCurrentTab("community")}
                  className="p-4 rounded-2xl bg-[#161E2E] border border-slate-700/60 hover:border-indigo-500/50 cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">Community Activity</span>
                    <MessageSquare className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="mt-2 text-xl font-bold text-white font-mono">
                    {stats.totalCommunityMessages}
                  </div>
                  <span className="text-[11px] text-slate-400">Total discussion questions</span>
                </div>

                <div
                  onClick={() => setCurrentTab("promotions")}
                  className="p-4 rounded-2xl bg-[#161E2E] border border-slate-700/60 hover:border-amber-500/50 cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">Promotions & Ads</span>
                    <Megaphone className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="mt-2 text-xl font-bold text-amber-300 font-mono">
                    {stats.activePromotions || 0} <span className="text-xs text-slate-400 font-normal">/ {stats.totalPromotions || 0} active</span>
                  </div>
                  <span className="text-[11px] text-slate-400">Hero banners & ad cards</span>
                </div>
              </div>

              {/* Quick Actions & Recent Moderation Jump */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Admin Quick Jump */}
                <div className="p-6 rounded-2xl bg-[#161E2E] border border-slate-700/60 space-y-4">
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Quick Creation & Shortcuts</span>
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleOpenNewPlace("TEMPLE")}
                      className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-left transition-colors"
                    >
                      <div className="text-xs font-bold text-amber-300">+ New Temple</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Add temple with aarti times & photo
                      </div>
                    </button>
                    <button
                      onClick={() => handleOpenNewPlace("GHAT")}
                      className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-left transition-colors"
                    >
                      <div className="text-xs font-bold text-sky-300">+ New Ghat</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Add Ganga ghat with boat rates
                      </div>
                    </button>
                    <button
                      onClick={() => handleOpenNewPlace("FOOD")}
                      className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-left transition-colors"
                    >
                      <div className="text-xs font-bold text-orange-300">+ New Eatery</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Budget food under ₹150 with photos
                      </div>
                    </button>
                    <button
                      onClick={() => setUploadModalOpen(true)}
                      className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-left transition-colors"
                    >
                      <div className="text-xs font-bold text-pink-300">+ Upload Photo</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Upload to server storage
                      </div>
                    </button>
                  </div>
                </div>

                {/* Direct Action Moderation Panel */}
                <div className="p-6 rounded-2xl bg-[#161E2E] border border-slate-700/60 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-rose-400" />
                      <span>Moderation Status</span>
                    </h2>
                    <button
                      onClick={() => setCurrentTab("moderation")}
                      className="text-xs text-amber-400 hover:underline"
                    >
                      View Desk →
                    </button>
                  </div>
                  {stats.pendingModeration === 0 ? (
                    <div className="p-8 text-center rounded-xl bg-slate-900/40 border border-slate-800 text-slate-400 text-xs">
                      <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                      Everything is clean! No pending suggestions or unhandled reports.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                        <span className="text-xs text-slate-300">
                          Pending User Place Suggestions
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300">
                          {stats.pendingSuggestions}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                        <span className="text-xs text-slate-300">Flagged User Reports</span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300">
                          {stats.pendingReports}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                        <span className="text-xs text-slate-300">Held Community Messages</span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-yellow-500/20 text-yellow-300">
                          {stats.heldMessages}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* TAB: PLACES TABLES (Temples, Ghats, Food, Tourist, All) */}
          {/* ========================================================== */}
          {["temples", "ghats", "food", "tourist", "all-places"].includes(currentTab) && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>
                  Showing {displayedPlaces.length} entries{" "}
                  {searchQuery && `(filtered for "${searchQuery}")`}
                </span>
                <span className="text-[11px] text-slate-500">
                  Click Edit to update photos, parking, timings, or gallery
                </span>
              </div>

              <div className="rounded-2xl bg-[#161E2E] border border-slate-800 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-[#121824] text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="px-4 py-3">Place Name & Area</th>
                        <th className="px-4 py-3">Category</th>
                        <th className="px-4 py-3">Timings / Details</th>
                        <th className="px-4 py-3">Image Preview</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {displayedPlaces.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-12 text-center text-slate-500">
                            {isLoading
                              ? "Loading places from live database..."
                              : "No places found matching your criteria."}
                          </td>
                        </tr>
                      ) : (
                        displayedPlaces.map((place) => (
                          <tr
                            key={place.id}
                            className="hover:bg-slate-800/40 transition-colors group"
                          >
                            {/* Name & Area */}
                            <td className="px-4 py-3.5">
                              <div className="font-bold text-white text-sm">
                                {place.name}
                              </div>
                              {place.hindiName && (
                                <div className="text-[11px] text-amber-300/80 font-serif">
                                  {place.hindiName}
                                </div>
                              )}
                              <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                                <span>{place.area || place.address}</span>
                              </div>
                            </td>

                            {/* Category Badge */}
                            <td className="px-4 py-3.5">
                              <span
                                className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                                  place.category === "TEMPLE"
                                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                    : place.category === "GHAT"
                                    ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                                    : place.category === "FOOD"
                                    ? "bg-orange-500/20 text-orange-300 border border-orange-500/30"
                                    : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                }`}
                              >
                                {place.category}
                              </span>
                              {place.subCategory && (
                                <div className="text-[10px] text-slate-400 mt-1">
                                  {place.subCategory}
                                </div>
                              )}
                            </td>

                            {/* Timings */}
                            <td className="px-4 py-3.5">
                              <div className="text-[11px] text-slate-300">
                                {place.openTime && place.closeTime
                                  ? `${place.openTime} – ${place.closeTime}`
                                  : place.openTime || "Always Open"}
                              </div>
                              {place.approxBudget && (
                                <div className="text-[10px] text-amber-400 mt-0.5">
                                  {place.approxBudget}
                                </div>
                              )}
                            </td>

                            {/* Image Thumbnail */}
                            <td className="px-4 py-3.5">
                              {place.image ? (
                                <div className="w-14 h-10 rounded-lg overflow-hidden border border-slate-700 relative bg-slate-900">
                                  <Image
                                    src={place.image}
                                    alt={place.name}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                  />
                                </div>
                              ) : (
                                <span className="text-[10px] text-slate-500 italic">No image</span>
                              )}
                            </td>

                            {/* Badges */}
                            <td className="px-4 py-3.5">
                              <div className="flex flex-wrap gap-1">
                                {place.isVerified && (
                                  <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px]">
                                    Verified
                                  </span>
                                )}
                                {place.isHiddenGem && (
                                  <span className="px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 text-[10px]">
                                    Hidden Gem
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Actions */}
                            <td className="px-4 py-3.5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <a
                                  href={`/${
                                    place.category === "TEMPLE"
                                      ? "temples"
                                      : place.category === "GHAT"
                                      ? "ghats"
                                      : place.category === "FOOD"
                                      ? "food"
                                      : "places"
                                  }/${place.slug}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                                  title="View Live"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                                <button
                                  onClick={() => handleEditPlace(place)}
                                  className="p-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 transition-colors"
                                  title="Edit Place"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeletePlace(place.id, place.name)}
                                  className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 transition-colors"
                                  title="Delete Place"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* TAB: PARKING LOCATIONS */}
          {/* ========================================================== */}
          {currentTab === "parking" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{parkings.length} Parking Stands registered across Varanasi</span>
                <span>Includes 2-wheeler, 4-wheeler, fee rates and walking distance</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {parkings.map((p) => (
                  <div
                    key={p.id}
                    className="rounded-2xl bg-[#161E2E] border border-slate-700/60 p-5 space-y-3 relative overflow-hidden shadow-lg"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <SquareParking className="w-4 h-4 text-blue-400 shrink-0" />
                          <h3 className="text-sm font-bold text-white">{p.name}</h3>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                          <span>{p.address}</span>
                        </p>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        {p.feeStatus}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Capacity:</span>
                        <span className="font-medium text-slate-200">{p.capacity || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Vehicles:</span>
                        <span className="font-medium text-slate-200">{p.vehicleSupport}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Fee Rate:</span>
                        <span className="font-medium text-amber-400">{p.feeRate || "Free"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Timing:</span>
                        <span className="font-medium text-slate-200">{p.timing}</span>
                      </div>
                      {p.associatedPlaces && (
                        <div className="text-[11px] text-slate-400 pt-1">
                          <span className="text-slate-500">Nearby to: </span>
                          {p.associatedPlaces}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                      <button
                        onClick={() => {
                          setEditingParking(p);
                          setParkingModalOpen(true);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 flex items-center gap-1 transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteParking(p.id, p.name)}
                        className="p-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 transition-colors"
                        title="Delete Parking"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* TAB: NEARBY PLACES LINKING */}
          {/* ========================================================== */}
          {currentTab === "nearby" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#161E2E] border border-slate-700/60 text-xs text-slate-300 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <Link2 className="w-4 h-4" />
                  <span>Nearby Places Cross-Linking Engine</span>
                </div>
                <p className="text-slate-400">
                  Manage associations between temples, ghats, and food spots so travelers see
                  curated next steps when viewing any place. Select any place below to edit its
                  structured `nearbyPlacesJson` attribute.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {places.map((place) => {
                  let nearbyCount = 0;
                  try {
                    if (place.nearbyPlacesJson) {
                      const parsed = JSON.parse(place.nearbyPlacesJson);
                      nearbyCount = Array.isArray(parsed) ? parsed.length : 0;
                    }
                  } catch {}

                  return (
                    <div
                      key={place.id}
                      className="p-4 rounded-2xl bg-[#161E2E] border border-slate-700/60 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-white text-sm">{place.name}</div>
                        <div className="text-xs text-slate-400">{place.category} • {place.area}</div>
                        <div className="text-[11px] text-teal-400 mt-1">
                          {nearbyCount} linked nearby spots
                        </div>
                      </div>
                      <button
                        onClick={() => handleEditPlace(place)}
                        className="px-3 py-1.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/30 text-xs font-medium transition-colors"
                      >
                        Manage Links
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* TAB: GALLERY & PHOTOS */}
          {/* ========================================================== */}
          {currentTab === "gallery" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{galleryImages.length} Photos in Gallery Repository</span>
                <span>Direct server uploads saved to public/uploads/</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {galleryImages.map((img) => (
                  <div
                    key={img.id}
                    className="rounded-2xl bg-[#161E2E] border border-slate-700/60 overflow-hidden group relative flex flex-col"
                  >
                    <div className="aspect-[4/3] relative bg-slate-950">
                      <Image
                        src={img.imageUrl}
                        alt={img.caption || img.title || "Banaras photo"}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        unoptimized
                      />
                      {img.isFeatured && (
                        <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 font-bold text-[9px] uppercase">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="p-3 flex-1 flex flex-col justify-between space-y-1">
                      <div>
                        <div className="text-xs font-semibold text-white truncate">
                          {img.title || "Untitled Image"}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {img.placeName || img.category}
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(img.imageUrl);
                            showToast("Image URL copied to clipboard!");
                          }}
                          className="text-[10px] text-amber-400 hover:underline flex items-center gap-1"
                        >
                          <Link2 className="w-3 h-3" />
                          <span>Copy URL</span>
                        </button>
                        <button
                          onClick={() => handleDeleteGalleryImage(img.id)}
                          className="p-1 rounded text-red-400 hover:bg-red-500/20 transition-colors"
                          title="Delete photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* TAB: MODERATION QUEUE */}
          {/* ========================================================== */}
          {currentTab === "moderation" && (
            <div className="space-y-6">
              {/* Suggestions Queue */}
              <div className="rounded-2xl bg-[#161E2E] border border-slate-800 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>User Place Suggestions ({suggestions.length} Pending)</span>
                  </h2>
                  <span className="text-xs text-slate-400">
                    Approving directly publishes this place into the live public directory.
                  </span>
                </div>

                {suggestions.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-4">
                    No pending place suggestions in queue.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {suggestions.map((sug) => (
                      <div
                        key={sug.id}
                        className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">{sug.name}</span>
                            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase">
                              {sug.category}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300">{sug.description}</p>
                          <div className="text-[11px] text-slate-400 flex items-center gap-3">
                            <span>📍 {sug.address}</span>
                            {sug.submittedBy && <span>👤 Submitted by {sug.submittedBy}</span>}
                            {sug.speciality && <span>✨ {sug.speciality}</span>}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleApproveSuggestion(sug.id, sug.name)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve & Publish</span>
                          </button>
                          <button
                            onClick={() => handleRejectSuggestion(sug.id)}
                            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-red-950/60 hover:text-red-300 text-slate-400 text-xs font-medium transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Reports Queue */}
              <div className="rounded-2xl bg-[#161E2E] border border-slate-800 p-5 space-y-4">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>User Flagged Reports ({reports.length} Pending)</span>
                </h2>

                {reports.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-4">No pending flagged reports.</p>
                ) : (
                  <div className="space-y-3">
                    {reports.map((rep) => (
                      <div
                        key={rep.id}
                        className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-rose-300">
                              Reason: {rep.reason}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              Target Type: {rep.targetType}
                            </span>
                          </div>
                          {rep.details && <p className="text-xs text-slate-300">{rep.details}</p>}
                        </div>

                        <button
                          onClick={() => handleResolveReport(rep.id)}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-medium transition-colors"
                        >
                          Mark Resolved
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Held Messages */}
              <div className="rounded-2xl bg-[#161E2E] border border-slate-800 p-5 space-y-4">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-yellow-400" />
                  <span>Held Community Messages ({heldMessages.length} Pending)</span>
                </h2>

                {heldMessages.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-4">
                    No community messages currently held for review.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {heldMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="text-xs font-semibold text-white">{msg.authorName}</div>
                          <p className="text-xs text-slate-300">{msg.content}</p>
                          <div className="text-[10px] text-yellow-400">
                            Flagged for: {msg.moderationReason || "Automated filter triggered"}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleReleaseHeldMessage(msg.id)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                          >
                            Release Message
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* TAB: COMMUNITY CONTENT */}
          {/* ========================================================== */}
          {currentTab === "community" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Traveler Community Questions & Threaded Replies</span>
                <span>Delete spam or offensive inquiries directly</span>
              </div>

              <div className="space-y-4">
                {communityMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className="p-5 rounded-2xl bg-[#161E2E] border border-slate-800 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{msg.authorName}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                            {msg.category || "General"}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {new Date(msg.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-200 mt-1">{msg.content}</p>
                      </div>

                      <button
                        onClick={() => handleDeleteCommunityMessage(msg.id)}
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 transition-colors"
                        title="Delete Question"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Replies */}
                    {msg.replies && msg.replies.length > 0 && (
                      <div className="pl-4 border-l-2 border-slate-800 space-y-2 mt-3 pt-2">
                        <div className="text-[11px] font-bold text-slate-400">
                          {msg.replies.length} Replies:
                        </div>
                        {msg.replies.map((reply: any) => (
                          <div
                            key={reply.id}
                            className="p-3 rounded-xl bg-slate-900/50 flex items-center justify-between text-xs"
                          >
                            <div>
                              <div className="font-semibold text-slate-300">
                                {reply.authorName}
                              </div>
                              <p className="text-slate-400 mt-0.5">{reply.content}</p>
                            </div>
                            <button
                              onClick={() => handleDeleteCommunityMessage(msg.id, reply.id)}
                              className="p-1 text-slate-500 hover:text-red-400"
                              title="Delete reply"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* TAB: AI CHATBOT DIRECTIVES */}
          {/* ========================================================== */}
          {currentTab === "chatbot" && (
            <div className="max-w-3xl space-y-6">
              <form
                onSubmit={handleSaveBotConfig}
                className="p-6 rounded-2xl bg-[#161E2E] border border-slate-800 space-y-5"
              >
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Bot className="w-5 h-5 text-purple-400" />
                    <span>Banaras AI Guide Directives</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Control how the AI assistant greets users, grounds responses, and provides verified local knowledge.
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Welcome Greeting
                    </label>
                    <input
                      type="text"
                      value={botConfig.welcomeGreeting}
                      onChange={(e) =>
                        setBotConfig({ ...botConfig, welcomeGreeting: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                      placeholder="हर हर महादेव! 🙏 Namaste! I am Banaras AI..."
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Scope of Assistance
                    </label>
                    <input
                      type="text"
                      value={botConfig.guidanceScope}
                      onChange={(e) =>
                        setBotConfig({ ...botConfig, guidanceScope: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                      placeholder="Temples, Ghats, Food under ₹150, Parking, Boat Rates..."
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Custom System Instructions & Guidelines
                    </label>
                    <textarea
                      rows={5}
                      value={botConfig.customInstructions}
                      onChange={(e) =>
                        setBotConfig({ ...botConfig, customInstructions: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                      placeholder="Directives for respecting Varanasi culture, boat bargaining tips, dress code reminders..."
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Emergency Contacts Provided by Bot
                    </label>
                    <input
                      type="text"
                      value={botConfig.emergencyContacts}
                      onChange={(e) =>
                        setBotConfig({ ...botConfig, emergencyContacts: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                      placeholder="Tourist Police: 0542-2508000 | National Emergency: 112"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/20 transition-all"
                  >
                    Save AI Directives
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ========================================================== */}
          {/* TAB: WEBSITE CONTENT */}
          {/* ========================================================== */}
          {currentTab === "website" && (
            <div className="max-w-3xl space-y-6">
              {/* Announcement Banner */}
              <div className="p-6 rounded-2xl bg-[#161E2E] border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-cyan-400" />
                    <span>Announcement Banner</span>
                  </h2>
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={siteSettings.announcement_banner?.enabled || false}
                      onChange={(e) =>
                        setSiteSettings({
                          ...siteSettings,
                          announcement_banner: {
                            ...siteSettings.announcement_banner,
                            enabled: e.target.checked,
                          },
                        })
                      }
                      className="rounded text-amber-500"
                    />
                    <span>Active Banner</span>
                  </label>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Banner Text</label>
                    <input
                      type="text"
                      value={siteSettings.announcement_banner?.text || ""}
                      onChange={(e) =>
                        setSiteSettings({
                          ...siteSettings,
                          announcement_banner: {
                            ...siteSettings.announcement_banner,
                            text: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                      placeholder="Dev Deepawali 2026 dates announced! Check special ghat aarti timings..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Badge Text</label>
                      <input
                        type="text"
                        value={siteSettings.announcement_banner?.badge || "UPDATE"}
                        onChange={(e) =>
                          setSiteSettings({
                            ...siteSettings,
                            announcement_banner: {
                              ...siteSettings.announcement_banner,
                              badge: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Optional Target Link
                      </label>
                      <input
                        type="text"
                        value={siteSettings.announcement_banner?.link || ""}
                        onChange={(e) =>
                          setSiteSettings({
                            ...siteSettings,
                            announcement_banner: {
                              ...siteSettings.announcement_banner,
                              link: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                        placeholder="/ghats or /temples"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() =>
                    handleSaveSiteSettings("announcement_banner", siteSettings.announcement_banner)
                  }
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all"
                >
                  Save Banner Settings
                </button>
              </div>

              {/* Emergency Numbers */}
              <div className="p-6 rounded-2xl bg-[#161E2E] border border-slate-800 space-y-4">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Phone className="w-5 h-5 text-amber-400" />
                  <span>Emergency Helplines (Shown in Footer & AI)</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Tourist Police</label>
                    <input
                      type="text"
                      value={siteSettings.emergency_helpline?.touristPolice || "0542-2508000"}
                      onChange={(e) =>
                        setSiteSettings({
                          ...siteSettings,
                          emergency_helpline: {
                            ...siteSettings.emergency_helpline,
                            touristPolice: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      National Emergency
                    </label>
                    <input
                      type="text"
                      value={siteSettings.emergency_helpline?.nationalEmergency || "112"}
                      onChange={(e) =>
                        setSiteSettings({
                          ...siteSettings,
                          emergency_helpline: {
                            ...siteSettings.emergency_helpline,
                            nationalEmergency: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      BHU Trauma Centre
                    </label>
                    <input
                      type="text"
                      value={siteSettings.emergency_helpline?.hospital || "0542-2369000"}
                      onChange={(e) =>
                        setSiteSettings({
                          ...siteSettings,
                          emergency_helpline: {
                            ...siteSettings.emergency_helpline,
                            hospital: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                </div>

                <button
                  onClick={() =>
                    handleSaveSiteSettings("emergency_helpline", siteSettings.emergency_helpline)
                  }
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all"
                >
                  Save Helpline Numbers
                </button>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* TAB: ADMIN SECURITY */}
          {/* ========================================================== */}
          {currentTab === "security" && (
            <div className="max-w-xl space-y-6">
              <div className="p-6 rounded-2xl bg-[#161E2E] border border-slate-800 space-y-4">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-slate-400" />
                  <span>Current Admin Session</span>
                </h2>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-500">Name:</span>
                    <span className="font-semibold text-white">{currentUser.name}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-500">Email:</span>
                    <span className="font-mono text-amber-300">{currentUser.email}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-500">System Role:</span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold uppercase text-[10px]">
                      {currentUser.role}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-500">Protection:</span>
                    <span className="text-emerald-400">Brute-Force Rate Limiting Active</span>
                  </div>
                </div>
              </div>

              <form
                onSubmit={handleChangePassword}
                className="p-6 rounded-2xl bg-[#161E2E] border border-slate-800 space-y-4 text-xs"
              >
                <h2 className="text-base font-bold text-white">Update Administrator Password</h2>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordState.currentPassword}
                    onChange={(e) =>
                      setPasswordState({ ...passwordState, currentPassword: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    New Secure Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={passwordState.newPassword}
                    onChange={(e) =>
                      setPasswordState({ ...passwordState, newPassword: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                    placeholder="Minimum 8 characters"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={passwordState.confirmPassword}
                    onChange={(e) =>
                      setPasswordState({ ...passwordState, confirmPassword: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs transition-all shadow-md"
                >
                  Update Password
                </button>
              </form>
            </div>
          )}

          {/* ========================================================== */}
          {/* TAB: PROMOTIONS & ADVERTISEMENTS */}
          {/* ========================================================== */}
          {currentTab === "promotions" && (
            <PromotionsSection onShowToast={showToast} onStatsUpdate={loadStats} />
          )}

          {/* ========================================================== */}
          {/* TAB: BANARAS WEATHER */}
          {/* ========================================================== */}
          {currentTab === "weather" && (
            <WeatherSettingsSection onShowToast={showToast} />
          )}
        </main>
      </div>

      {/* ========================================================== */}
      {/* MODAL: Comprehensive Place Form (Edit or Create) */}
      {/* ========================================================== */}
      {isPlaceModalOpen && (
        <PlaceFormModal
          isOpen={isPlaceModalOpen}
          onClose={() => {
            setIsPlaceModalOpen(false);
            setEditingPlace(null);
          }}
          onSuccess={() => {
            setIsPlaceModalOpen(false);
            setEditingPlace(null);
            loadPlaces();
            loadStats();
            showToast("Place saved successfully!");
          }}
          place={editingPlace}
          defaultCategory={defaultCategoryForNew}
          availableParkings={parkings}
          allPlaces={places}
        />
      )}

      {/* ========================================================== */}
      {/* MODAL: Parking Stand Form */}
      {/* ========================================================== */}
      {parkingModalOpen && editingParking && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-[#161E2E] border border-slate-700 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <SquareParking className="w-5 h-5 text-blue-400" />
                <span>
                  {editingParking.id ? "Edit Parking Stand" : "Add New Parking Stand"}
                </span>
              </h3>
              <button
                onClick={() => setParkingModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveParking} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Stand Name *</label>
                <input
                  type="text"
                  required
                  value={editingParking.name || ""}
                  onChange={(e) =>
                    setEditingParking({ ...editingParking, name: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  placeholder="e.g. Godowlia Multi-Level Parking"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Area *</label>
                  <input
                    type="text"
                    required
                    value={editingParking.area || ""}
                    onChange={(e) =>
                      setEditingParking({ ...editingParking, area: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                    placeholder="Godowlia / Dashashwamedh"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Capacity</label>
                  <input
                    type="text"
                    value={editingParking.capacity || ""}
                    onChange={(e) =>
                      setEditingParking({ ...editingParking, capacity: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                    placeholder="400 Two-Wheelers, 150 Cars"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Address *</label>
                <input
                  type="text"
                  required
                  value={editingParking.address || ""}
                  onChange={(e) =>
                    setEditingParking({ ...editingParking, address: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Vehicles</label>
                  <select
                    value={editingParking.vehicleSupport || "BOTH"}
                    onChange={(e) =>
                      setEditingParking({ ...editingParking, vehicleSupport: e.target.value })
                    }
                    className="w-full px-2 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                  >
                    <option value="BOTH">Both (2 & 4 W)</option>
                    <option value="TWO_WHEELER">2-Wheeler Only</option>
                    <option value="FOUR_WHEELER">4-Wheeler Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Fee Status</label>
                  <select
                    value={editingParking.feeStatus || "PAID"}
                    onChange={(e) =>
                      setEditingParking({ ...editingParking, feeStatus: e.target.value })
                    }
                    className="w-full px-2 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                  >
                    <option value="PAID">Paid</option>
                    <option value="FREE">Free</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Type</label>
                  <select
                    value={editingParking.parkingType || "MUNICIPAL"}
                    onChange={(e) =>
                      setEditingParking({ ...editingParking, parkingType: e.target.value })
                    }
                    className="w-full px-2 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                  >
                    <option value="MUNICIPAL">Municipal</option>
                    <option value="PRIVATE">Private</option>
                    <option value="TEMPLE">Temple Trust</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Fee Rate Details</label>
                <input
                  type="text"
                  value={editingParking.feeRate || ""}
                  onChange={(e) =>
                    setEditingParking({ ...editingParking, feeRate: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  placeholder="₹20 first 2 hrs for 2-wheeler; ₹50 for 4-wheeler"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Associated Nearby Places (Comma-separated)
                </label>
                <input
                  type="text"
                  value={editingParking.associatedPlaces || ""}
                  onChange={(e) =>
                    setEditingParking({ ...editingParking, associatedPlaces: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  placeholder="Kashi Vishwanath, Dashashwamedh Ghat"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setParkingModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  Save Stand
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* MODAL: Upload Photo to Server & Gallery */}
      {/* ========================================================== */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-md rounded-3xl bg-[#161E2E] border border-slate-700 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-pink-400" />
                <span>Upload Photo to Storage</span>
              </h3>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGalleryImage} className="space-y-3 text-xs">
              {/* Direct File Picker */}
              <div className="p-4 rounded-2xl border-2 border-dashed border-slate-700 bg-slate-900/50 text-center space-y-2">
                <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                <div className="text-xs text-slate-300 font-medium">
                  {isUploadingPhoto ? "Uploading file to server..." : "Choose image to upload"}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  disabled={isUploadingPhoto}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUploadGalleryImage(file);
                  }}
                  className="text-xs text-slate-400 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-pink-600 file:text-white hover:file:bg-pink-500 cursor-pointer"
                />
              </div>

              {newImagePayload.imageUrl && (
                <div className="space-y-1">
                  <div className="text-[10px] text-emerald-400">Uploaded URL:</div>
                  <div className="p-2 rounded-lg bg-slate-900 font-mono text-[10px] text-slate-300 truncate">
                    {newImagePayload.imageUrl}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Image Title</label>
                <input
                  type="text"
                  value={newImagePayload.title}
                  onChange={(e) =>
                    setNewImagePayload({ ...newImagePayload, title: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  placeholder="Ganga Aarti at Dashashwamedh"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Caption / Story</label>
                <input
                  type="text"
                  value={newImagePayload.caption}
                  onChange={(e) =>
                    setNewImagePayload({ ...newImagePayload, caption: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  placeholder="Evening maha aarti with thousands of brass lamps..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={newImagePayload.category}
                    onChange={(e) =>
                      setNewImagePayload({ ...newImagePayload, category: e.target.value })
                    }
                    className="w-full px-2 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                  >
                    <option value="GENERAL">General</option>
                    <option value="TEMPLES">Temples</option>
                    <option value="GHATS">Ghats</option>
                    <option value="FOOD">Food</option>
                    <option value="CULTURE">Culture</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Place Name (Tag)
                  </label>
                  <input
                    type="text"
                    value={newImagePayload.placeName}
                    onChange={(e) =>
                      setNewImagePayload({ ...newImagePayload, placeName: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                    placeholder="Dashashwamedh Ghat"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newImagePayload.imageUrl}
                  className="px-5 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 disabled:opacity-50 text-white font-bold"
                >
                  Add to Gallery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* MODAL: Confirmation Dialog */}
      {/* ========================================================== */}
      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-[#161E2E] border border-slate-700 shadow-2xl p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-white">{deleteConfirm.title}</h3>
              <p className="text-xs text-slate-400">{deleteConfirm.description}</p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirm({ ...deleteConfirm, isOpen: false })}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  await deleteConfirm.onConfirm();
                  setDeleteConfirm({ ...deleteConfirm, isOpen: false });
                }}
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

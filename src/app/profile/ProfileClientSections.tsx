"use client";

import React, { useState } from "react";
import {
  PlusCircle,
  MessageSquare,
  Bug,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Mail,
  Lock,
  User,
  Compass,
  MapPin,
  Camera,
  Link as LinkIcon,
  ShieldCheck,
} from "lucide-react";
import { GlassCard, Button, Badge } from "@/components/ui/GlassCard";

export function ProfileClientSections({
  mode,
  userName = "",
}: {
  mode: "auth" | "dashboard";
  userName?: string;
}) {
  // Auth Form State
  const [authTab, setAuthTab] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Dashboard Tab State
  const [activeTab, setActiveTab] = useState<"none" | "suggest" | "feedback">("none");

  // Suggest Place Form State
  const [placeName, setPlaceName] = useState("");
  const [category, setCategory] = useState("TEMPLE");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [sourceRef, setSourceRef] = useState("");
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [suggestNotice, setSuggestNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Feedback Form State
  const [feedbackCategory, setFeedbackCategory] = useState("BUG");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [pageUrl, setPageUrl] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackNotice, setFeedbackNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    try {
      const endpoint = authTab === "signup" ? "/api/auth/signup" : "/api/auth/login";
      const payload = authTab === "signup" ? { name, email, password } : { email, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setAuthError(data.error || "Authentication failed.");
        return;
      }

      window.location.reload();
    } catch {
      setAuthError("Network error. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSuggestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuggestNotice(null);
    setSuggestLoading(true);

    try {
      const res = await fetch("/api/places/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: placeName,
          category,
          description,
          address,
          speciality,
          photoUrl,
          sourceRef,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setSuggestNotice({ type: "error", text: data.error || "Submission failed." });
        return;
      }

      setSuggestNotice({
        type: "success",
        text: "Thank you! Your place suggestion has been submitted. Status: PENDING VERIFICATION. It will appear on Banaras Darshan once reviewed and approved by our editorial moderation team.",
      });

      setPlaceName("");
      setDescription("");
      setAddress("");
      setSpeciality("");
      setPhotoUrl("");
      setSourceRef("");
    } catch {
      setSuggestNotice({ type: "error", text: "Network error submitting suggestion." });
    } finally {
      setSuggestLoading(false);
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackNotice(null);
    setFeedbackLoading(true);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: feedbackCategory,
          message: feedbackMessage,
          pageUrl,
          contactInfo,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setFeedbackNotice({ type: "error", text: data.error || "Submission failed." });
        return;
      }

      setFeedbackNotice({
        type: "success",
        text: "Thank you. Your feedback has been submitted.",
      });
      setFeedbackMessage("");
      setPageUrl("");
      setContactInfo("");
    } catch {
      setFeedbackNotice({ type: "error", text: "Network error submitting feedback." });
    } finally {
      setFeedbackLoading(false);
    }
  };

  if (mode === "auth") {
    return (
      <GlassCard className="p-6 sm:p-8 bg-white border border-slate-200 shadow-xl max-w-md mx-auto space-y-6" hoverEffect={false}>
        <div className="flex rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => {
              setAuthTab("login");
              setAuthError(null);
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              authTab === "login"
                ? "bg-white text-slate-950 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthTab("signup");
              setAuthError(null);
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              authTab === "signup"
                ? "bg-white text-slate-950 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Create Account
          </button>
        </div>

        {authError && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleAuthSubmit} className="space-y-4">
          {authTab === "signup" && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Verma"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-500 focus:outline-none text-xs text-slate-900"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-500 focus:outline-none text-xs text-slate-900"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-500 focus:outline-none text-xs text-slate-900"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="gold"
            disabled={authLoading}
            className="w-full py-2.5 text-xs font-bold shadow-md cursor-pointer flex items-center justify-center gap-2"
          >
            {authLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : authTab === "signup" ? (
              "Create Account"
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </GlassCard>
    );
  }

  // Dashboard Mode: Suggest a Place + Feedback Accordion
  return (
    <div className="space-y-6">
      {/* Quick Action Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => setActiveTab(activeTab === "suggest" ? "none" : "suggest")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
            activeTab === "suggest"
              ? "bg-amber-500 text-slate-950 shadow-md"
              : "bg-white text-slate-800 border border-slate-200 hover:border-amber-400 hover:bg-slate-50"
          }`}
        >
          <PlusCircle className="w-4 h-4 text-amber-700" />
          <span>+ Suggest a New Place</span>
        </button>

        <button
          onClick={() => setActiveTab(activeTab === "feedback" ? "none" : "feedback")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
            activeTab === "feedback"
              ? "bg-orange-600 text-white shadow-md"
              : "bg-white text-slate-800 border border-slate-200 hover:border-orange-300 hover:bg-slate-50"
          }`}
        >
          <Bug className="w-4 h-4 text-orange-600" />
          <span>Feedback & Bug Report</span>
        </button>
      </div>

      {/* SUGGEST A NEW PLACE FORM (POINT 21) */}
      {activeTab === "suggest" && (
        <GlassCard className="p-6 sm:p-8 bg-white border border-amber-500/30 shadow-md space-y-6 animate-in slide-in-from-top-2 duration-200" hoverEffect={false}>
          <div className="border-b border-slate-200 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="gold" className="text-xs">Community Discovery</Badge>
              <span className="text-xs text-slate-500">• Verification Workflow</span>
            </div>
            <h3 className="text-xl font-bold text-slate-950 font-serif">
              Suggest a New Place in Banaras
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Help fellow travelers discover unmapped gems — an ancient hidden alley museum, a quiet kund, or a centuries-old sweet maker. Submissions are reviewed by our verification team before becoming public listings.
            </p>
          </div>

          {suggestNotice && (
            <div
              className={`p-4 rounded-xl text-xs flex items-center gap-2.5 ${
                suggestNotice.type === "success"
                  ? "bg-emerald-50 border border-emerald-300 text-emerald-900"
                  : "bg-rose-50 border border-rose-300 text-rose-900"
              }`}
            >
              {suggestNotice.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
              )}
              <span className="leading-relaxed">{suggestNotice.text}</span>
            </div>
          )}

          <form onSubmit={handleSuggestSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-800">Place Name *</label>
                <input
                  type="text"
                  required
                  value={placeName}
                  onChange={(e) => setPlaceName(e.target.value)}
                  placeholder="e.g. Ancient Kali Matha Shrine"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-500 focus:outline-none"
                >
                  <option value="TEMPLE">Temple / Shrine</option>
                  <option value="GHAT">Ghat / River Step</option>
                  <option value="FOOD">Food / Street Chaat</option>
                  <option value="RESTAURANT">Restaurant</option>
                  <option value="CAFE">Riverside Cafe</option>
                  <option value="SWEET_SHOP">Sweet Shop / Malaiyo</option>
                  <option value="MUSEUM">Museum / Gallery</option>
                  <option value="HERITAGE">Heritage Site / Fortress</option>
                  <option value="HIDDEN">Hidden Place / Kund</option>
                  <option value="STAY">Hotel / Hostel / Homestay</option>
                  <option value="OTHER">Other Landmark</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-800">Address / Neighborhood Location *</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Near Scindia Ghat lane, Chowk"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">Speciality / Best Known For (Optional)</label>
                <input
                  type="text"
                  value={speciality}
                  onChange={(e) => setSpeciality(e.target.value)}
                  placeholder="e.g. Century-old brass bells, unique saffron lassi"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-800">Cultural Context & Description *</label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what makes this place special, how to reach it, and best hours to visit..."
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-500 focus:outline-none resize-none leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-800">Photo URL (Optional)</label>
                <input
                  type="url"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">Source / Reference Website (Optional)</label>
                <input
                  type="text"
                  value={sourceRef}
                  onChange={(e) => setSourceRef(e.target.value)}
                  placeholder="e.g. Varanasi Tourism link, article, or local record"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Status upon submission: <strong>PENDING VERIFICATION</strong></span>
              </span>
              <Button
                type="submit"
                variant="gold"
                disabled={suggestLoading}
                className="px-6 py-2 text-xs font-bold shadow-sm cursor-pointer"
              >
                {suggestLoading ? "Submitting..." : "Submit for Verification"}
              </Button>
            </div>
          </form>
        </GlassCard>
      )}

      {/* FEEDBACK & BUG REPORT (POINT 21) */}
      {activeTab === "feedback" && (
        <GlassCard className="p-6 sm:p-8 bg-white border border-orange-200 shadow-md space-y-6 animate-in slide-in-from-top-2 duration-200" hoverEffect={false}>
          <div className="border-b border-slate-200 pb-4">
            <h3 className="text-xl font-bold text-slate-950 font-serif flex items-center gap-2">
              <Bug className="w-5 h-5 text-orange-600" />
              <span>Feedback & Bug Report</span>
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Found an incorrect temple timing, website glitch, or have an idea to improve Banaras Darshan? Let our engineering & heritage team know.
            </p>
          </div>

          {feedbackNotice && (
            <div
              className={`p-4 rounded-xl text-xs flex items-center gap-2.5 ${
                feedbackNotice.type === "success"
                  ? "bg-emerald-50 border border-emerald-300 text-emerald-900"
                  : "bg-rose-50 border border-rose-300 text-rose-900"
              }`}
            >
              {feedbackNotice.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
              )}
              <span>{feedbackNotice.text}</span>
            </div>
          )}

          <form onSubmit={handleFeedbackSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-800">Feedback Type *</label>
                <select
                  value={feedbackCategory}
                  onChange={(e) => setFeedbackCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-500 focus:outline-none"
                >
                  <option value="BUG">Bug / Technical Issue</option>
                  <option value="SITE_PROBLEM">Website Problem</option>
                  <option value="INCORRECT_INFO">Incorrect / Outdated Information</option>
                  <option value="UI_IMPROVEMENT">UI / Layout Improvement</option>
                  <option value="FEATURE_REQ">Feature Suggestion</option>
                  <option value="OTHER">Other Feedback</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">Affected Page / Feature (Optional)</label>
                <input
                  type="text"
                  value={pageUrl}
                  onChange={(e) => setPageUrl(e.target.value)}
                  placeholder="e.g. /ghats or /plan"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-800">Your Message & Details *</label>
              <textarea
                rows={3}
                required
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value)}
                placeholder="Explain the problem or your idea in detail..."
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-500 focus:outline-none resize-none leading-relaxed"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-800">Contact Info (Optional - if you would like a reply)</label>
              <input
                type="text"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                placeholder="Your email or phone number"
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <p className="text-[11px] text-slate-500">
                Your feedback helps keep Kashi travel information reliable and up to date.
              </p>
              <Button
                type="submit"
                variant="gold"
                disabled={feedbackLoading || !feedbackMessage.trim()}
                className="px-6 py-2 text-xs font-bold shadow-sm cursor-pointer"
              >
                {feedbackLoading ? "Submitting..." : "Submit Feedback"}
              </Button>
            </div>
          </form>
        </GlassCard>
      )}
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { MessageSquarePlus, Star, Send, CheckCircle2, Sparkles, MapPin } from "lucide-react";
import { GlassCard, Button } from "@/components/ui/GlassCard";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function FeedbackPage() {
  const [activeTab, setActiveTab] = useState<"FEEDBACK" | "SUGGEST">("SUGGEST");

  // Feedback State
  const [fbName, setFbName] = useState("");
  const [fbEmail, setFbEmail] = useState("");
  const [fbCategory, setFbCategory] = useState("GENERAL");
  const [fbRating, setFbRating] = useState(5);
  const [fbMessage, setFbMessage] = useState("");
  const [fbStatus, setFbStatus] = useState<string | null>(null);

  // Suggest Place State
  const [sugName, setSugName] = useState("");
  const [sugCategory, setSugCategory] = useState("FOOD");
  const [sugAddress, setSugAddress] = useState("");
  const [sugDescription, setSugDescription] = useState("");
  const [sugSpeciality, setSugSpeciality] = useState("");
  const [sugBy, setSugBy] = useState("");
  const [sugStatus, setSugStatus] = useState<string | null>(null);

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fbName.trim() || !fbMessage.trim()) return;

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fbName,
          email: fbEmail,
          category: fbCategory,
          rating: fbRating,
          message: fbMessage,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setFbStatus("Thank you! Your feedback has been received and will help improve Banaras Darshan.");
        setFbMessage("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSuggestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sugName.trim() || !sugAddress.trim() || !sugDescription.trim()) return;

    try {
      const res = await fetch("/api/places/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: sugName,
          category: sugCategory,
          address: sugAddress,
          description: sugDescription,
          speciality: sugSpeciality,
          submittedBy: sugBy,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSugStatus(data.message);
        setSugName("");
        setSugAddress("");
        setSugDescription("");
        setSugSpeciality("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AuthGuard
      title="Suggest a Place & Share Feedback"
      description="Sign in or create an account to suggest a new hidden spot, report corrections, or submit feedback to the Banaras Darshan moderation team."
    >
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-amber-700 mb-1">
            <MessageSquarePlus className="w-3.5 h-3.5" />
            <span>Crowdsourced Accuracy</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 font-serif">
            Suggest a Place & Share Feedback
          </h1>
          <p className="text-slate-600 text-sm font-normal">
            Help us document every hidden lane, historic shrine, and authentic food shop in Kashi.
          </p>
        </div>

      {/* Tabs */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setActiveTab("SUGGEST")}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold border transition-all cursor-pointer ${
            activeTab === "SUGGEST"
              ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white border-amber-600 shadow-lg"
              : "bg-white border-amber-500/20 text-slate-700 hover:text-amber-800 hover:bg-amber-50 shadow-sm"
          }`}
        >
          ✨ Suggest a New Place
        </button>
        <button
          onClick={() => setActiveTab("FEEDBACK")}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold border transition-all cursor-pointer ${
            activeTab === "FEEDBACK"
              ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white border-amber-600 shadow-lg"
              : "bg-white border-amber-500/20 text-slate-700 hover:text-amber-800 hover:bg-amber-50 shadow-sm"
          }`}
        >
          💬 Platform Feedback & Bug Report
        </button>
      </div>

      {/* Tab 1: Suggest Place Form */}
      {activeTab === "SUGGEST" && (
        <GlassCard className="p-6 sm:p-8 bg-white border border-amber-500/20 shadow-md" hoverEffect={false}>
          <div className="flex items-center gap-2.5 mb-6 text-amber-800 font-bold">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <h3 className="text-lg text-slate-900 font-serif">Recommend an Authentic Local Spot</h3>
          </div>

          {sugStatus ? (
            <div className="p-5 rounded-2xl bg-emerald-100 border border-emerald-400 text-emerald-900 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-600" />
              <p className="font-semibold text-sm">{sugStatus}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSugStatus(null)}
                className="mt-2 text-xs"
              >
                Suggest Another Place
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSuggestSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Place Name (e.g. Laxmi Chai Toast):
                  </label>
                  <input
                    type="text"
                    required
                    value={sugName}
                    onChange={(e) => setSugName(e.target.value)}
                    placeholder="Exact name of place"
                    className="w-full rounded-xl px-3.5 py-2.5 bg-white border border-amber-500/30 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Category:
                  </label>
                  <select
                    value={sugCategory}
                    onChange={(e) => setSugCategory(e.target.value)}
                    className="w-full rounded-xl px-3.5 py-2.5 bg-white border border-amber-500/30 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  >
                    <option value="FOOD" className="bg-white text-slate-900">Food & Sweets</option>
                    <option value="TEMPLE" className="bg-white text-slate-900">Temple / Shrine</option>
                    <option value="GHAT" className="bg-white text-slate-900">Ghat / Viewpoint</option>
                    <option value="HOTEL" className="bg-white text-slate-900">Hotel / Stay / Hostel</option>
                    <option value="HIDDEN" className="bg-white text-slate-900">Hidden Lane / Artisan Guild</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Location / Address / Landmark:
                </label>
                <input
                  type="text"
                  required
                  value={sugAddress}
                  onChange={(e) => setSugAddress(e.target.value)}
                  placeholder="e.g. Near Chowk Thana or lane next to Assi Ghat"
                  className="w-full rounded-xl px-3.5 py-2.5 bg-white border border-amber-500/30 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Signature Specialty (Must-Try item or historic feature):
                </label>
                <input
                  type="text"
                  value={sugSpeciality}
                  onChange={(e) => setSugSpeciality(e.target.value)}
                  placeholder="e.g. White butter toast grilled on charcoal, or 300-year-old brass bell workshop"
                  className="w-full rounded-xl px-3.5 py-2.5 bg-white border border-amber-500/30 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Why do you recommend this place?
                </label>
                <textarea
                  rows={3}
                  required
                  value={sugDescription}
                  onChange={(e) => setSugDescription(e.target.value)}
                  placeholder="Describe your personal experience and why travelers should know about it..."
                  className="w-full rounded-xl px-3.5 py-2.5 resize-none bg-white border border-amber-500/30 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Your Name / Handle (Optional):
                </label>
                <input
                  type="text"
                  value={sugBy}
                  onChange={(e) => setSugBy(e.target.value)}
                  placeholder="e.g. Local Explorer"
                  className="w-full rounded-xl px-3.5 py-2.5 bg-white border border-amber-500/30 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div className="pt-2">
                <Button type="submit" variant="gold" size="md" className="w-full">
                  <Send className="w-4 h-4 mr-1" />
                  <span>Submit for Editorial Verification</span>
                </Button>
              </div>
            </form>
          )}
        </GlassCard>
      )}

      {/* Tab 2: Feedback Form */}
      {activeTab === "FEEDBACK" && (
        <GlassCard className="p-6 sm:p-8 bg-white border border-amber-500/20 shadow-md" hoverEffect={false}>
          <div className="flex items-center gap-2.5 mb-6 text-sky-800 font-bold">
            <MessageSquarePlus className="w-5 h-5 text-sky-600" />
            <h3 className="text-lg text-slate-900 font-serif">Platform Feedback or Inaccuracy Report</h3>
          </div>

          {fbStatus ? (
            <div className="p-5 rounded-2xl bg-emerald-100 border border-emerald-400 text-emerald-900 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-600" />
              <p className="font-semibold text-sm">{fbStatus}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFbStatus(null)}
                className="mt-2 text-xs"
              >
                Send Additional Feedback
              </Button>
            </div>
          ) : (
            <form onSubmit={handleFeedbackSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Your Name:</label>
                  <input
                    type="text"
                    required
                    value={fbName}
                    onChange={(e) => setFbName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full rounded-xl px-3.5 py-2.5 bg-white border border-amber-500/30 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Email Address (Optional):
                  </label>
                  <input
                    type="email"
                    value={fbEmail}
                    onChange={(e) => setFbEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl px-3.5 py-2.5 bg-white border border-amber-500/30 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Category:</label>
                  <select
                    value={fbCategory}
                    onChange={(e) => setFbCategory(e.target.value)}
                    className="w-full rounded-xl px-3.5 py-2.5 bg-white border border-amber-500/30 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  >
                    <option value="GENERAL" className="bg-white text-slate-900">General Feedback</option>
                    <option value="INCORRECT_INFO" className="bg-white text-slate-900">Report Outdated/Incorrect Information</option>
                    <option value="FEATURE_REQ" className="bg-white text-slate-900">Feature Request</option>
                    <option value="BUG" className="bg-white text-slate-900">Technical Bug Report</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Your Overall Experience:
                  </label>
                  <div className="flex items-center gap-2 pt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setFbRating(star)}
                        className="text-lg transition-transform hover:scale-125"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= fbRating ? "fill-amber-400 text-amber-400" : "text-slate-600"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Your Message:</label>
                <textarea
                  rows={4}
                  required
                  value={fbMessage}
                  onChange={(e) => setFbMessage(e.target.value)}
                  placeholder="Please share details or link to incorrect information..."
                  className="w-full glass-input rounded-xl px-3.5 py-2.5 resize-none"
                />
              </div>

              <div className="pt-2">
                <Button type="submit" variant="primary" size="md" className="w-full">
                  <Send className="w-4 h-4 mr-1" />
                  <span>Submit Feedback</span>
                </Button>
              </div>
            </form>
          )}
        </GlassCard>
      )}
    </div>
    </AuthGuard>
  );
}

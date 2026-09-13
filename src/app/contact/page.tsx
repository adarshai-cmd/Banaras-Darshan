"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Mail,
  ShieldCheck,
  FileText,
  Send,
  HelpCircle,
  Clock,
  Phone,
  CheckCircle2,
  AlertCircle,
  Lock,
  ChevronRight,
  MessageSquare,
  Sparkles,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/GlassCard";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("PRIVACY_DATA");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatusMsg({
        type: "error",
        text: "Please complete all required fields.",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          category:
            category === "PRIVACY_DATA"
              ? "PRIVACY_REQUEST"
              : category === "CORRECTION"
              ? "INCORRECT_INFO"
              : category === "COMMUNITY"
              ? "COMMUNITY_ISSUE"
              : "GENERAL",
          rating: 5,
          message: `[${category}] ${message.trim()}`,
          contactInfo: email.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatusMsg({
          type: "success",
          text: "Your message has been received! Our support and privacy desk will review your inquiry within 48 business hours.",
        });
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setStatusMsg({
          type: "error",
          text:
            data.error || "Failed to transmit message. Please try again or email us directly.",
        });
      }
    } catch (err) {
      console.error(err);
      setStatusMsg({
        type: "error",
        text: "A network error occurred. Please check your connection.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 pb-20">
      {/* 1. Hero Header */}
      <section className="relative pt-12 pb-14 px-4 sm:px-6 lg:px-8 border-b border-amber-900/10 bg-gradient-to-b from-amber-500/10 via-orange-500/5 to-transparent overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-6">
            <Link href="/" className="hover:text-amber-700 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-amber-800 font-medium">Support</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900">Contact & Inquiries</span>
          </nav>

          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200">
              <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
              <span>Dedicated Traveler & Privacy Desk</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 font-serif tracking-tight">
              Contact Banaras Darshan
            </h1>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
              Have a privacy question, need to request account data deletion,
              wish to report outdated temple hours, or require community assistance?
              Our team is here to assist pilgrims, travelers, and contributors.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Main Content Grid */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Form */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
                  Send a Direct Message
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Inquiries are logged in our secure support queue and handled
                  strictly in order of receipt.
                </p>
              </div>

              {statusMsg && (
                <div
                  className={`p-4 rounded-2xl text-xs flex items-start gap-2.5 border ${
                    statusMsg.type === "success"
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                      : "bg-rose-50 text-rose-800 border-rose-200"
                  }`}
                >
                  {statusMsg.type === "success" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <span className="leading-relaxed font-medium">{statusMsg.text}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Your Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Anandita Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-500 focus:outline-none text-xs text-slate-900 font-medium transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-500 focus:outline-none text-xs text-slate-900 font-medium transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Category of Inquiry <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-500 focus:outline-none text-xs text-slate-900 font-medium transition-all"
                  >
                    <option value="PRIVACY_DATA">
                      🛡️ Privacy, User Rights & Data Deletion
                    </option>
                    <option value="CORRECTION">
                      ✍️ Content Correction, Timings & Place Updates
                    </option>
                    <option value="COMMUNITY">
                      👥 Community Report or Moderation Appeal
                    </option>
                    <option value="GENERAL">
                      🧭 General Feedback or Partnership Inquiry
                    </option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Your Message / Request Details{" "}
                    <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Please provide specific details. For data deletion requests, mention your registered email. For temple/place updates, mention the specific location."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-500 focus:outline-none text-xs text-slate-900 font-medium transition-all leading-relaxed"
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
                  <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>
                    Your contact information is confidential and will only be
                    used to reply to your inquiry. We never sell or share
                    contact data with commercial advertisers.
                  </span>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  variant="gold"
                  className="w-full py-3 text-xs font-bold shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span>Transmitting Message...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Inquiry</span>
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* Right Column: Support Cards & Helplines */}
          <div className="lg:col-span-5 space-y-6">
            {/* Specific Contact Inquiries */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
                Direct Contact Inboxes
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="font-bold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Privacy & Data Deletion
                  </span>
                  <p className="text-slate-600">
                    For DPDP rights, account purge requests, or cookie inquiries:
                  </p>
                  <a
                    href="mailto:privacy@banarasdarshan.com"
                    className="font-mono text-amber-700 hover:underline inline-block pt-0.5"
                  >
                    privacy@banarasdarshan.com
                  </a>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-600" />
                    Legal & Policy Matters
                  </span>
                  <p className="text-slate-600">
                    For legal notices, terms compliance, and copyright inquiries:
                  </p>
                  <a
                    href="mailto:legal@banarasdarshan.com"
                    className="font-mono text-amber-700 hover:underline inline-block pt-0.5"
                  >
                    legal@banarasdarshan.com
                  </a>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="font-bold text-slate-900 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-sky-600" />
                    Community Moderation Desk
                  </span>
                  <p className="text-slate-600">
                    To appeal a moderation action or report severe community abuse:
                  </p>
                  <a
                    href="mailto:community@banarasdarshan.com"
                    className="font-mono text-amber-700 hover:underline inline-block pt-0.5"
                  >
                    community@banarasdarshan.com
                  </a>
                </div>
              </div>
            </div>

            {/* Official Varanasi Travel Helplines */}
            <div className="p-6 rounded-3xl bg-amber-50/70 border border-amber-200/80 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-amber-950 font-bold text-xs">
                <Phone className="w-4 h-4 text-amber-700" />
                <span>Emergency On-Ground Varanasi Helplines</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                For urgent emergencies, missing persons, or on-ground safety
                situations during your pilgrimage, reach out immediately to
                official municipal helplines:
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="p-2.5 rounded-xl bg-white border border-amber-200/60">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                    Varanasi Tourist Police
                  </span>
                  <span className="font-mono font-bold text-slate-900">
                    0542-2508000
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-amber-200/60">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                    National Emergency
                  </span>
                  <span className="font-mono font-bold text-slate-900">112</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-amber-200/60">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                    Women Helpline
                  </span>
                  <span className="font-mono font-bold text-slate-900">1090</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-amber-200/60">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                    Childline
                  </span>
                  <span className="font-mono font-bold text-slate-900">1098</span>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-slate-500">
                <span>More safety numbers available on our </span>
                <Link
                  href="/safety"
                  className="font-bold text-amber-800 hover:underline"
                >
                  Traveler Safety & Helplines page →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

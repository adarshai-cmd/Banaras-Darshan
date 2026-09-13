"use client";

import React, { useState } from "react";
import { X, Lock, Mail, User, Sparkles, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/GlassCard";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "signup";
  onSuccess?: (user: any) => void;
}

export function AuthModal({
  isOpen,
  onClose,
  initialMode = "login",
  onSuccess,
}: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError(null);
      setSuccessMsg(null);
    }
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const endpoint = mode === "signup" ? "/api/auth/signup" : "/api/auth/login";
      const payload = mode === "signup" ? { name, email, password } : { email, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Authentication failed. Please check your details.");
        return;
      }

      setSuccessMsg(data.message || (mode === "signup" ? "Account created!" : "Welcome back!"));
      if (onSuccess) {
        onSuccess(data.user);
      }
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 700);
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-5 overflow-hidden">
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center space-y-1.5 pt-1">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-700 border border-amber-500/20 shadow-sm mx-auto">
            <Sparkles className="w-5 h-5 text-amber-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 font-serif">
            {mode === "signup" ? "Create Your Account" : "Sign In to Banaras Darshan"}
          </h2>
          <p className="text-xs text-slate-600 max-w-xs mx-auto">
            {mode === "signup"
              ? "Join Banaras Darshan to unlock AI Guide, Community Chat, 84 Ghats & personalized itineraries."
              : "Sign in to access your saved places, AI Guide, verified community, and trip plans."}
          </p>
        </div>

        {/* Top Segmented Tabs: Sign In / Create My Account */}
        <div className="flex p-1 rounded-2xl bg-slate-100 border border-slate-200/80 shadow-inner">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setError(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mode === "login"
                ? "bg-white text-slate-900 shadow-sm border border-slate-200/80"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setError(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mode === "signup"
                ? "bg-amber-500 text-slate-950 shadow-sm font-extrabold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Create My Account
          </button>
        </div>

        {/* Form Alerts */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Authentication Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
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
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-500 focus:outline-none text-xs text-slate-900 font-medium transition-all"
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
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-500 focus:outline-none text-xs text-slate-900 font-medium transition-all"
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
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-500 focus:outline-none text-xs text-slate-900 font-medium transition-all"
              />
            </div>
          </div>

          {mode === "signup" && (
            <p className="text-[11px] text-slate-500 leading-relaxed text-center px-1">
              By creating an account, you agree to Banaras Darshan&apos;s{" "}
              <a
                href="/terms-and-conditions"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-800 font-semibold hover:underline"
              >
                Terms & Conditions
              </a>{" "}
              and acknowledge our{" "}
              <a
                href="/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-800 font-semibold hover:underline"
              >
                Privacy Policy
              </a>
              .
            </p>
          )}

          <Button
            type="submit"
            disabled={loading}
            variant="gold"
            className="w-full py-3 text-xs font-bold shadow-md cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : mode === "signup" ? (
              "Create My Account"
            ) : (
              "Sign In to Banaras Darshan"
            )}
          </Button>
        </form>

        {/* Toggle Mode */}
        <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-600">
          {mode === "signup" ? (
            <p>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError(null);
                }}
                className="font-bold text-amber-700 hover:text-amber-800 hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </p>
          ) : (
            <p>
              Visiting Banaras for the first time?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setError(null);
                }}
                className="font-bold text-amber-700 hover:text-amber-800 hover:underline cursor-pointer"
              >
                Create an Account
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

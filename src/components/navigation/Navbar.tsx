"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Compass,
  Utensils,
  BedDouble,
  Landmark,
  Waves,
  MapPin,
  CalendarCheck,
  Users,
  Sparkles,
  Shield,
  Menu,
  X,
  User,
  LogOut,
  LogIn,
} from "lucide-react";
import { AuthModal } from "@/components/modals/AuthModal";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    name: string;
    email: string | null;
    role: string;
    avatar: string | null;
  } | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check authentication status
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setCurrentUser(data.user);
        } else {
          setCurrentUser(null);
        }
      })
      .catch(() => setCurrentUser(null));
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setCurrentUser(null);
      router.push("/");
      router.refresh();
      window.location.reload();
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const navLinks = [
    { href: "/explore", label: "Explore", icon: Compass },
    { href: "/food", label: "Food", icon: Utensils },
    { href: "/stay", label: "Stay", icon: BedDouble },
    { href: "/temples", label: "Temples", icon: Landmark },
    { href: "/ghats", label: "Ghats", icon: Waves },
    { href: "/map", label: "Map", icon: MapPin },
    { href: "/plan", label: "Plan My Trip", icon: CalendarCheck },
    { href: "/community", label: "Community", icon: Users },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? "py-2 bg-[#FAF8F5]/98 backdrop-blur-xl border-b border-slate-200 shadow-md shadow-slate-900/5"
            : "py-3 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-slate-200/80"
        }`}
      >
        <div className="w-full max-w-[1560px] mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">
            {/* 1. Left: Brand Logo moved cleanly to the left */}
            <div className="flex items-center shrink-0">
              <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
                <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-400 p-[1.5px] shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform duration-300 shrink-0">
                  <div className="w-full h-full rounded-[14px] bg-[#FAF8F5] flex items-center justify-center text-lg sm:text-xl">
                    <span>🛕</span>
                  </div>
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-base sm:text-lg lg:text-xl font-bold tracking-tight text-slate-950 flex items-center gap-1 font-serif whitespace-nowrap">
                    BANARAS <span className="text-amber-700">DARSHAN</span>
                  </span>
                  <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] text-slate-600 font-semibold tracking-wider uppercase whitespace-nowrap">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                    <span>Kashi Travel Companion</span>
                  </div>
                </div>
              </Link>
            </div>

            {/* 2. Center: Desktop Navigation Links Pill */}
            <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 p-1 rounded-full bg-white/95 border border-slate-200/90 shadow-sm shrink-0">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                const isPlan = link.href === "/plan";
                const isCommunity = link.href === "/community";

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative flex items-center gap-1.5 px-2.5 xl:px-3.5 py-1.5 rounded-full text-[11px] xl:text-xs font-bold whitespace-nowrap shrink-0 transition-all duration-200 ${
                      isActive
                        ? isPlan
                          ? "bg-orange-600 text-white shadow-sm"
                          : isCommunity
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "bg-amber-500 text-slate-950 shadow-sm"
                        : isPlan
                        ? "text-orange-950 hover:text-orange-900 hover:bg-orange-50/90 font-bold"
                        : isCommunity
                        ? "text-emerald-950 hover:text-emerald-900 hover:bg-emerald-50/90"
                        : "text-slate-700 hover:text-slate-950 hover:bg-slate-100"
                    }`}
                  >
                    <Icon
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isActive
                          ? "text-inherit"
                          : isPlan
                          ? "text-orange-600"
                          : isCommunity
                          ? "text-emerald-600"
                          : "text-amber-700"
                      }`}
                    />
                    <span className="whitespace-nowrap inline-block">{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* 3. Right Action Cluster: Ask AI + Safety + Single Sign In Button */}
            <div className="hidden lg:flex items-center gap-2 xl:gap-2.5 shrink-0">
              {/* Ask Banaras AI */}
              <Link
                href="/ai-assistant"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 border border-amber-500/50 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-900 animate-pulse shrink-0" />
                <span>Ask AI</span>
              </Link>

              {/* Travel Safety */}
              <Link
                href="/safety"
                className="p-2 rounded-full text-slate-700 hover:text-emerald-700 bg-white border border-slate-200 hover:border-emerald-300 transition-all shadow-sm shrink-0"
                title="Safety Guidelines & Police Helplines"
              >
                <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
              </Link>

              {/* Auth / Profile Area (Clean single Sign In button, no duplicate Sign Up) */}
              {currentUser ? (
                <div className="flex items-center gap-1.5">
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full text-xs font-bold text-slate-900 bg-white border border-slate-200 hover:border-amber-400 hover:bg-slate-50 transition-all shadow-sm group whitespace-nowrap"
                    title="View My Profile & Saved Places"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center text-[10px] font-extrabold shadow-sm shrink-0">
                      {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <span className="max-w-[100px] truncate text-slate-800 group-hover:text-amber-800">
                      {currentUser.name.split(" ")[0]}
                    </span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="p-1.5 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all cursor-pointer shrink-0"
                    title="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setAuthMode("login");
                    setAuthModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold text-slate-900 bg-white border border-slate-300 hover:border-amber-500 hover:bg-amber-50/50 hover:text-amber-950 transition-all shadow-sm cursor-pointer whitespace-nowrap"
                >
                  <LogIn className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>Sign In</span>
                </button>
              )}
            </div>

            {/* Mobile Menu Button (< lg) */}
            <div className="flex lg:hidden items-center gap-1.5 sm:gap-2 shrink-0">
              <Link
                href="/plan"
                className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-orange-600 text-white shadow-sm whitespace-nowrap"
              >
                Plan Trip
              </Link>
              <Link
                href="/ai-assistant"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-amber-400 text-slate-950 shadow-sm whitespace-nowrap"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-900 shrink-0" />
                <span>AI</span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-800 bg-white border border-slate-200 shadow-sm cursor-pointer"
                aria-label="Toggle Navigation"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-[#FAF8F5]/98 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200">
            <nav className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? "bg-amber-500 text-slate-950 shadow-sm"
                        : "bg-white text-slate-800 border border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="w-4 h-4 text-amber-700 shrink-0" />
                    <span className="whitespace-nowrap">{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="pt-2 border-t border-slate-200 flex flex-col gap-2">
              {currentUser ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200">
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2"
                  >
                    <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-extrabold shrink-0">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                      <p className="text-[10px] text-amber-700">View Profile & Saves</p>
                    </div>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 text-xs font-semibold cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAuthMode("login");
                    setAuthModalOpen(true);
                  }}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 border border-amber-500/40 shadow-sm text-center flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-amber-900" />
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Global Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
        onSuccess={(user) => {
          setCurrentUser(user);
        }}
      />
    </>
  );
}

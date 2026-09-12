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
  Search,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const coreNavLinks = [
    { href: "/explore", label: "Explore", icon: Compass },
    { href: "/food", label: "Food", icon: Utensils },
    { href: "/stay", label: "Stay", icon: BedDouble },
    { href: "/temples", label: "Temples", icon: Landmark },
    { href: "/ghats", label: "Ghats", icon: Waves },
    { href: "/map", label: "Map", icon: MapPin },
  ];

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchOpen(false);
    router.push(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? "py-2 bg-[#FAF8F5]/98 backdrop-blur-xl border-b border-slate-200 shadow-md shadow-slate-900/5"
            : "py-3 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-slate-200/80"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-400 p-[1.5px] shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full rounded-[14px] bg-[#FAF8F5] flex items-center justify-center text-xl">
                  <span>🛕</span>
                </div>
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
              </div>
              <div>
                <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1 font-serif">
                  BANARAS <span className="text-amber-700">DARSHAN</span>
                </span>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-600 font-semibold tracking-wider uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <span>Kashi Travel Companion</span>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-white border border-slate-200 shadow-sm">
              {coreNavLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                      isActive
                        ? "bg-amber-500 text-slate-950 shadow-sm"
                        : "text-slate-700 hover:text-slate-950 hover:bg-slate-100"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? "text-slate-950" : "text-amber-700"}`} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}

              {/* Plan My Trip - Highly Visible CTA */}
              <Link
                href="/plan"
                className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 border ${
                  pathname === "/plan"
                    ? "bg-orange-600 text-white border-orange-700 shadow-md shadow-orange-600/20"
                    : "bg-orange-50 text-orange-950 border-orange-300 hover:bg-orange-100"
                }`}
                title="Personalized day-by-day travel planner"
              >
                <CalendarCheck className="w-3.5 h-3.5 text-orange-700" />
                <span>Plan My Trip</span>
              </Link>

              {/* Community - Highly Visible Core Feature */}
              <Link
                href="/community"
                className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 border ${
                  pathname === "/community"
                    ? "bg-emerald-600 text-white border-emerald-700 shadow-md shadow-emerald-600/20"
                    : "bg-emerald-50 text-emerald-950 border-emerald-300 hover:bg-emerald-100"
                }`}
                title="Live traveler forum & Q&A"
              >
                <Users className="w-3.5 h-3.5 text-emerald-700" />
                <span>Community</span>
              </Link>
            </nav>

            {/* Right Action Cluster */}
            <div className="hidden lg:flex items-center gap-2.5 shrink-0">
              {/* Quick Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:border-amber-400 hover:bg-slate-50 transition-all shadow-sm cursor-pointer"
                title="Search temples, ghats, food..."
              >
                <Search className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-slate-500">Search...</span>
                <kbd className="px-1.5 py-0.2 rounded bg-slate-100 border border-slate-200 text-[10px] font-mono text-slate-600">
                  ⌘K
                </kbd>
              </button>

              {/* Ask Banaras AI */}
              <Link
                href="/ai-assistant"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 border border-amber-500/50 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-900 animate-pulse" />
                <span>Ask AI</span>
              </Link>

              {/* Safety Link */}
              <Link
                href="/safety"
                className="p-2 rounded-full text-slate-700 hover:text-emerald-700 bg-white border border-slate-200 hover:border-emerald-300 transition-all shadow-sm"
                title="Travel Safety & Police Helplines"
              >
                <Shield className="w-4 h-4 text-emerald-600" />
              </Link>

              {/* Profile / Saved */}
              <Link
                href="/profile"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-slate-800 bg-white border border-slate-200 hover:border-amber-400 hover:bg-slate-50 transition-all shadow-sm"
              >
                <div className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[9px] font-extrabold">
                  A
                </div>
                <span>Profile</span>
              </Link>
            </div>

            {/* Mobile Controls */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-xl text-slate-800 bg-white border border-slate-200 shadow-sm"
                aria-label="Search"
              >
                <Search className="w-4 h-4 text-amber-600" />
              </button>

              <Link
                href="/plan"
                className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-orange-600 text-white shadow-sm"
              >
                Plan Trip
              </Link>

              <Link
                href="/ai-assistant"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-amber-400 text-slate-950 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI</span>
              </Link>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 shadow-sm cursor-pointer"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-[#FAF8F5] px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top-2">
            <div className="grid grid-cols-2 gap-2">
              {coreNavLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-3 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-amber-500 text-slate-950 font-bold shadow-sm"
                        : "bg-white text-slate-800 hover:bg-slate-50 border border-slate-200"
                    }`}
                  >
                    <Icon className="w-4 h-4 text-amber-700" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Core Highlight Links on Mobile */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link
                href="/plan"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-orange-50 border-2 border-orange-400 text-orange-950 text-sm font-bold shadow-sm"
              >
                <CalendarCheck className="w-4 h-4 text-orange-700" />
                <span>Plan My Trip</span>
              </Link>

              <Link
                href="/community"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-50 border-2 border-emerald-400 text-emerald-950 text-sm font-bold shadow-sm"
              >
                <Users className="w-4 h-4 text-emerald-700" />
                <span>Community</span>
              </Link>
            </div>

            <div className="pt-3 border-t border-slate-200 grid grid-cols-3 gap-2">
              <Link
                href="/safety"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-bold shadow-sm"
              >
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                <span>Safety</span>
              </Link>
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-bold shadow-sm"
              >
                <User className="w-3.5 h-3.5 text-amber-600" />
                <span>Profile</span>
              </Link>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-bold shadow-sm"
              >
                <span>Admin</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Spotlight Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xl rounded-2xl bg-white border border-slate-300 p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
                <Search className="w-4 h-4 text-amber-600" />
                <span>Spotlight Search Across Kashi</span>
              </div>
              <button
                onClick={() => setSearchOpen(false)}
                className="text-slate-500 hover:text-slate-800 text-xs font-bold cursor-pointer"
              >
                Esc ✕
              </button>
            </div>

            <form onSubmit={handleQuickSearch} className="flex gap-2">
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search temples, ghats, tamatar chaat, stays, or galliyan..."
                className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-950 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md cursor-pointer"
              >
                Search
              </button>
            </form>

            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-600">
              <span className="font-semibold">Quick picks:</span>
              {["Kashi Vishwanath", "Dashashwamedh Aarti", "Tamatar Chaat", "Assi Ghat", "Zostel"].map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setSearchOpen(false);
                    router.push(`/explore?q=${encodeURIComponent(term)}`);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-amber-100 border border-slate-200 text-slate-800 text-xs font-medium cursor-pointer"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

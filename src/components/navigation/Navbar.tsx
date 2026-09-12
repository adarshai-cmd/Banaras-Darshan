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
  ShieldAlert,
  Search,
  Flame,
  ArrowRight,
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
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/explore", label: "Explore", icon: Compass },
    { href: "/food", label: "Food", icon: Utensils },
    { href: "/stay", label: "Stay", icon: BedDouble },
    { href: "/temples", label: "Temples", icon: Landmark },
    { href: "/ghats", label: "Ghats", icon: Waves },
    { href: "/map", label: "Map", icon: MapPin },
    { href: "/plan", label: "Plan Trip", icon: CalendarCheck },
    { href: "/community", label: "Community", icon: Users },
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
            ? "py-2 bg-[#FAF8F5]/90 dark:bg-[#070d1e]/90 backdrop-blur-xl border-b border-amber-500/20 shadow-md shadow-amber-950/5"
            : "py-3 bg-[#FAF8F5]/80 dark:bg-[#060b18]/80 backdrop-blur-md border-b border-amber-500/10"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Creative Brand Logo with glowing flame icon */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-400 p-[1.5px] shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full rounded-[14px] bg-[#FAF8F5] dark:bg-[#0A1128] flex items-center justify-center text-xl">
                  <span className="animate-pulse">🛕</span>
                </div>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-white dark:border-slate-900 animate-ping" />
              </div>
              <div>
                <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-950 dark:text-white flex items-center gap-1 font-serif">
                  BANARAS <span className="text-amber-600 dark:text-amber-400">DARSHAN</span>
                </span>
                <div className="flex items-center gap-1.5 text-[10px] text-amber-700 dark:text-amber-300 font-semibold tracking-wider uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Kashi Guide • काशी</span>
                </div>
              </div>
            </Link>

            {/* Desktop Creative Navigation Pill Links */}
            <nav className="hidden xl:flex items-center p-1.5 rounded-full bg-white/70 dark:bg-black/30 border border-amber-500/20 backdrop-blur-md shadow-inner">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-bold shadow-md shadow-orange-500/20"
                        : "text-slate-700 dark:text-slate-300 hover:text-amber-700 dark:hover:text-amber-300 hover:bg-amber-500/10"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Cluster */}
            <div className="hidden lg:flex items-center gap-2.5">
              {/* Quick Search Trigger */}
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-slate-600 dark:text-slate-300 bg-white/70 dark:bg-white/5 border border-amber-500/20 hover:border-amber-500/50 hover:bg-amber-500/10 transition-all shadow-sm"
                title="Quick Search (Temples, Ghats, Food)"
              >
                <Search className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span className="text-slate-400">Search Kashi...</span>
                <kbd className="px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[10px] font-mono text-amber-700 dark:text-amber-300">
                  ⌘K
                </kbd>
              </button>

              {/* Banaras AI Creative Assistant Button */}
              <Link
                href="/ai-assistant"
                className="relative group overflow-hidden flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300 hover:from-amber-300 hover:to-orange-400 shadow-md shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-slate-950 animate-spin [animation-duration:6s]" />
                <span>Banaras AI</span>
              </Link>

              {/* Travel Safety Hub */}
              <Link
                href="/safety"
                className="p-2 rounded-full text-slate-700 dark:text-slate-300 hover:text-emerald-600 bg-white/60 dark:bg-white/5 border border-amber-500/15 hover:border-emerald-500/40 transition-all"
                title="Travel Safety & Tourist Police"
              >
                <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </Link>

              {/* My Trip */}
              <Link
                href="/profile"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white/60 dark:bg-white/5 border border-amber-500/15 hover:border-amber-500/40 transition-all"
              >
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-slate-950 flex items-center justify-center text-[9px] font-bold">
                  A
                </div>
                <span>My Trip</span>
              </Link>

              {/* Admin */}
              <Link
                href="/admin"
                className="px-2.5 py-1.5 rounded-full text-xs font-semibold text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
                title="Admin Moderation Console"
              >
                Admin
              </Link>
            </div>

            {/* Mobile Controls */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-xl text-slate-700 dark:text-slate-200 bg-white/80 dark:bg-white/10 border border-amber-500/20"
                aria-label="Search"
              >
                <Search className="w-4 h-4 text-amber-600" />
              </button>
              <Link
                href="/ai-assistant"
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI</span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10 border border-amber-500/20"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-amber-500/20 bg-[#FAF8F5]/95 dark:bg-[#070d1e]/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2">
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 shadow-sm"
                        : "bg-white/60 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-amber-500/10"
                    }`}
                  >
                    <Icon className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-amber-500/15 grid grid-cols-3 gap-2">
              <Link
                href="/safety"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 text-xs font-semibold"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Safety</span>
              </Link>
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-amber-500/10 text-amber-800 dark:text-amber-300 text-xs font-semibold"
              >
                <User className="w-3.5 h-3.5" />
                <span>My Trip</span>
              </Link>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-rose-500/10 text-rose-800 dark:text-rose-300 text-xs font-semibold"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Admin</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Spotlight Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xl rounded-2xl bg-[#FAF8F5] dark:bg-[#091128] border border-amber-500/30 p-4 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-black/10 dark:border-white/10">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                <Search className="w-4 h-4" />
                <span>Spotlight Search Across Kashi</span>
              </div>
              <button
                onClick={() => setSearchOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xs"
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
                className="flex-1 glass-input rounded-xl px-4 py-2.5 text-sm"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-bold text-xs shadow-md"
              >
                Search
              </button>
            </form>

            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
              <span>Try:</span>
              {["Kashi Vishwanath", "Dashashwamedh Aarti", "Tamatar Chaat", "Assi Ghat", "Zostel"].map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setSearchOpen(false);
                    router.push(`/explore?q=${encodeURIComponent(term)}`);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-white/5 border border-amber-500/20 text-slate-700 dark:text-slate-300 hover:text-amber-600 hover:border-amber-500/40 text-[11px]"
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

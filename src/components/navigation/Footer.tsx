import React from "react";
import Link from "next/link";
import { Sparkles, Shield, Heart, Compass, MapPin, SquareParking } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#040813] text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-xl shadow-lg shadow-orange-950/50">
                🛕
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white font-serif">
                  BANARAS <span className="text-amber-400">DARSHAN</span>
                </span>
                <p className="text-xs text-amber-300/80 font-medium">Discover Banaras. Your Way.</p>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              The all-in-one digital companion for exploring the soul of Kashi. Discover sacred
              temples, eternal ghats, legendary food, secret galliyan, and verified local recommendations.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                100% Verified Factual Database
              </span>
            </div>
          </div>

          {/* Quick Discover */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide uppercase font-serif text-amber-300/90">
              Discover Kashi
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/temples" className="hover:text-amber-300 transition-colors">
                  Sacred Temples
                </Link>
              </li>
              <li>
                <Link href="/ghats" className="hover:text-amber-300 transition-colors">
                  Cinematic Ghats & Aarti
                </Link>
              </li>
              <li>
                <Link href="/food" className="hover:text-amber-300 transition-colors">
                  Food & Sweets Discovery
                </Link>
              </li>
              <li>
                <Link href="/stay" className="hover:text-amber-300 transition-colors">
                  Hotels, Stays & Hostels
                </Link>
              </li>
              <li>
                <Link href="/hidden" className="hover:text-amber-300 transition-colors">
                  Hidden Galliyan & Silk Looms
                </Link>
              </li>
            </ul>
          </div>

          {/* Travel Tools */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide uppercase font-serif text-amber-300/90">
              Smart Tools
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/map" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  Interactive Map & Routes
                </Link>
              </li>
              <li>
                <Link href="/parking" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <SquareParking className="w-3.5 h-3.5 text-sky-400" />
                  Municipal Parking Stands
                </Link>
              </li>
              <li>
                <Link href="/plan" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
                  Plan My Trip Generator
                </Link>
              </li>
              <li>
                <Link href="/ai-assistant" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Banaras AI Travel Guide
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-amber-300 transition-colors">
                  Community Live Chat
                </Link>
              </li>
              <li>
                <Link href="/safety" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  Traveler Safety & Helplines
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Policies */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide uppercase font-serif text-amber-300/90">
              Legal & Policies
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/privacy-policy" className="hover:text-amber-300 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="hover:text-amber-300 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="hover:text-amber-300 transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-amber-300 transition-colors">
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/community-guidelines" className="hover:text-amber-300 transition-colors">
                  Community Guidelines
                </Link>
              </li>
              <li>
                <Link href="/accessibility" className="hover:text-amber-300 transition-colors">
                  Accessibility Statement
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Direct Legal Navigation */}
        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col lg:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Banaras Darshan. All rights reserved.</p>

          <p className="flex items-center gap-1 text-slate-400">
            Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for the sacred city of Varanasi.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-slate-400 text-xs">
            <Link href="/privacy-policy" className="hover:text-amber-300 transition-colors">
              Privacy
            </Link>
            <span className="text-white/20">•</span>
            <Link href="/terms-and-conditions" className="hover:text-amber-300 transition-colors">
              Terms
            </Link>
            <span className="text-white/20">•</span>
            <Link href="/cookie-policy" className="hover:text-amber-300 transition-colors">
              Cookies
            </Link>
            <span className="text-white/20">•</span>
            <Link href="/disclaimer" className="hover:text-amber-300 transition-colors">
              Disclaimer
            </Link>
            <span className="text-white/20">•</span>
            <Link href="/community-guidelines" className="hover:text-amber-300 transition-colors">
              Guidelines
            </Link>
            <span className="text-white/20">•</span>
            <Link href="/accessibility" className="hover:text-amber-300 transition-colors">
              Accessibility
            </Link>
            <span className="text-white/20">•</span>
            <Link href="/contact" className="hover:text-amber-300 transition-colors">
              Contact & Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

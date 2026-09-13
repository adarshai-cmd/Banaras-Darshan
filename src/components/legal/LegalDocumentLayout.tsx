"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  FileText,
  Clock,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  Share2,
  Check,
  Scale,
  Sparkles,
  Cookie,
  Users,
  Eye,
  AlertCircle,
} from "lucide-react";

export interface LegalSection {
  id: string;
  title: string;
  content: string;
}

export interface LegalDocumentLayoutProps {
  slug: string;
  title: string;
  category: string;
  version: string;
  lastUpdated: string;
  summary: string;
  sections: LegalSection[];
}

const POLICY_LINKS = [
  { slug: "privacy-policy", label: "Privacy Policy", icon: ShieldCheck },
  { slug: "terms-and-conditions", label: "Terms & Conditions", icon: Scale },
  { slug: "cookie-policy", label: "Cookie Policy", icon: Cookie },
  { slug: "disclaimer", label: "Disclaimer", icon: AlertCircle },
  { slug: "community-guidelines", label: "Community Guidelines", icon: Users },
  { slug: "accessibility", label: "Accessibility Statement", icon: Eye },
  { slug: "contact", label: "Contact & Support", icon: HelpCircle },
];

export function LegalDocumentLayout({
  slug,
  title,
  category,
  version,
  lastUpdated,
  summary,
  sections,
}: LegalDocumentLayoutProps) {
  const [activeSectionId, setActiveSectionId] = useState<string>(
    sections[0]?.id || ""
  );
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSectionId(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getCategoryBadgeColor = (cat: string) => {
    switch (cat.toUpperCase()) {
      case "PRIVACY":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "GUIDELINES":
        return "bg-sky-50 text-sky-800 border-sky-200";
      case "COMPLIANCE":
        return "bg-amber-50 text-amber-800 border-amber-200";
      default:
        return "bg-amber-50 text-amber-800 border-amber-200";
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 pb-20">
      {/* 1. Header Hero Banner */}
      <section className="relative pt-12 pb-14 sm:pb-16 px-4 sm:px-6 lg:px-8 border-b border-amber-900/10 bg-gradient-to-b from-amber-500/10 via-orange-500/5 to-transparent overflow-hidden">
        {/* Subtle Background Mandala Graphic */}
        <div className="absolute -top-24 right-1/2 translate-x-1/2 md:translate-x-0 md:right-10 w-96 h-96 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-6">
            <Link href="/" className="hover:text-amber-700 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-amber-800 font-medium">Legal & Policies</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 truncate max-w-[200px] sm:max-w-none">
              {title}
            </span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2.5">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border uppercase tracking-wider ${getCategoryBadgeColor(
                    category
                  )}`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {category}
                </span>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-white text-slate-700 border border-slate-200 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Version {version}
                </span>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium text-slate-600 bg-slate-100 border border-slate-200/80">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Last Updated: {lastUpdated}
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 font-serif tracking-tight leading-tight">
                {title}
              </h1>

              {summary && (
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal pt-1">
                  {summary}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:text-amber-800 hover:border-amber-400 shadow-xs transition-all cursor-pointer"
                title="Copy link to this policy"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-slate-500" />
                    <span>Share Policy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Content Grid (TOC Sidebar + Policy Body) */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left / Sticky Table of Contents (Desktop) */}
          <aside className="lg:col-span-4 hidden lg:block">
            <div className="sticky top-24 space-y-6">
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                    Table of Contents
                  </h3>
                  <span className="text-[11px] font-semibold text-amber-700">
                    {sections.length} Sections
                  </span>
                </div>

                <nav className="space-y-1 text-xs max-h-[60vh] overflow-y-auto pr-1">
                  {sections.map((section) => {
                    const isActive = activeSectionId === section.id;
                    return (
                      <a
                        key={section.id}
                        href={`#${section.id}`}
                        className={`block px-3 py-2 rounded-xl transition-all font-medium leading-snug ${
                          isActive
                            ? "bg-amber-50 text-amber-900 font-bold border-l-2 border-amber-600 pl-2.5 shadow-2xs"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                        }`}
                      >
                        {section.title}
                      </a>
                    );
                  })}
                </nav>
              </div>

              {/* Policy Quick Links Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-200/70 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                  <Sparkles className="w-4 h-4 text-amber-700" />
                  <span>Other Website Policies</span>
                </div>
                <div className="space-y-1.5 text-xs">
                  {POLICY_LINKS.filter((item) => item.slug !== slug).map(
                    (item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.slug}
                          href={`/${item.slug}`}
                          className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-slate-700 hover:text-amber-900 hover:bg-white/80 transition-colors"
                        >
                          <span className="flex items-center gap-2 font-medium">
                            <Icon className="w-3.5 h-3.5 text-amber-700" />
                            {item.label}
                          </span>
                          <ChevronRight className="w-3 h-3 text-slate-400" />
                        </Link>
                      );
                    }
                  )}
                </div>
              </div>
            </div>
          </aside>

          {/* Right / Content Column */}
          <article className="lg:col-span-8 space-y-10">
            {/* Mobile TOC Quick Navigation Pills */}
            <div className="lg:hidden p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2.5">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                Jump to Section
              </h4>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                {sections.map((section, idx) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="shrink-0 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-amber-100 hover:text-amber-900 text-slate-700 font-medium transition-colors"
                  >
                    § {idx + 1}. {section.title.split(".")[1] || section.title}
                  </a>
                ))}
              </div>
            </div>

            {/* Sections */}
            {sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-28 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4 transition-all"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
                    {section.title}
                  </h2>
                  <a
                    href={`#${section.id}`}
                    className="text-slate-400 hover:text-amber-700 p-1 rounded-md"
                    title="Direct link to this section"
                  >
                    #
                  </a>
                </div>

                {/* Section Content with Markdown-like styling */}
                <div className="text-slate-700 text-sm sm:text-base leading-relaxed space-y-4 font-normal whitespace-pre-line">
                  {section.content}
                </div>
              </section>
            ))}

            {/* Support & Inquiry Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-600/10 border border-amber-500/30 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 uppercase tracking-wider">
                  <HelpCircle className="w-4 h-4 text-amber-700" />
                  <span>Questions or Data Requests?</span>
                </div>
                <h3 className="text-lg font-bold text-slate-950 font-serif">
                  Need Help or Wish to Exercise Your Data Rights?
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
                  Our grievance team reviews privacy queries, account deletion
                  requests, and content corrections in accordance with Indian
                  digital laws.
                </p>
              </div>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-amber-700 hover:bg-amber-800 text-white shadow-md transition-transform hover:scale-105 shrink-0"
              >
                <span>Contact Support</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Related Policy Links (Mobile and Tablet) */}
            <div className="lg:hidden p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                Explore Other Legal Policies
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {POLICY_LINKS.filter((item) => item.slug !== slug).map(
                  (item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.slug}
                        href={`/${item.slug}`}
                        className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-900 border border-slate-100 transition-colors"
                      >
                        <Icon className="w-4 h-4 text-amber-700 shrink-0" />
                        <span className="font-semibold">{item.label}</span>
                      </Link>
                    );
                  }
                )}
              </div>
            </div>
          </article>
        </div>
      </main>
    </div>
  );
}

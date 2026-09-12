"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Compass, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/GlassCard";
import { PromotionalSlot } from "@/components/promotions/PromotionalSlot";
import { MobilePromotionalCarousel } from "@/components/promotions/MobilePromotionalCarousel";

export function CinematicHero() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const samplePrompts = [
    "Best breakfast under ₹150?",
    "Where to park car near Godowlia?",
    "Which ghat should I visit at sunset?",
    "Best budget hotel near Kashi Vishwanath?",
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/ai-assistant?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleChipClick = (prompt: string) => {
    setSearchQuery(prompt);
    router.push(`/ai-assistant?q=${encodeURIComponent(prompt)}`);
  };

  // Framer Motion Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 22 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
    },
  };

  return (
    <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 py-16 sm:py-24 bg-[#FAF8F5]">
      {/* Decorative Warm Glowing Atmospheric Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Soft Golden Sunrise Radiance */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[520px] bg-gradient-to-b from-amber-200/40 via-orange-100/25 to-transparent blur-3xl rounded-full" />
        
        {/* Floating Ambient Light Accents */}
        <motion.div
          animate={{
            y: [-15, 15, -15],
            x: [-10, 10, -10],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-10 w-72 h-72 rounded-full bg-amber-400/15 blur-3xl"
        />
        <motion.div
          animate={{
            y: [15, -15, 15],
            x: [10, -10, 10],
            scale: [1.05, 1, 1.05],
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-1/4 right-10 w-80 h-80 rounded-full bg-orange-400/15 blur-3xl"
        />

        {/* Delicate Sacred Pattern at bottom */}
        <div className="absolute bottom-0 inset-x-0 h-32 opacity-15 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto text-center z-20 space-y-8 px-4"
      >
        {/* Heritage Tag Badge */}
        <motion.div variants={itemVariants}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/90 border border-amber-400/50 text-xs font-bold tracking-wider uppercase text-amber-900 shadow-sm backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600" />
            </span>
            <span className="font-serif">The Living Soul of Kashi • काशी</span>
          </div>
        </motion.div>

        {/* Main Heading with High Contrast */}
        <motion.div variants={itemVariants} className="space-y-4">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-950 font-serif leading-[1.12]">
            Discover Banaras.{" "}
            <br className="hidden sm:block" />
            <span className="saffron-gradient-text drop-shadow-sm">Your Way.</span>
          </h1>
          <p className="text-base sm:text-xl text-slate-700 max-w-2xl mx-auto font-normal leading-relaxed">
            Explore the soul of Kashi — sacred temples, eternal ghats, legendary food,
            riverside stays, hidden galliyan and unforgettable experiences.
          </p>
        </motion.div>

        {/* Central Workspace: Left Promo Slot + AI Search Center + Right Promo Slot */}
        <motion.div variants={itemVariants} className="w-full">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-6 xl:gap-8">
            {/* Left Promotional Banner (Desktop Only) */}
            <div className="hidden lg:flex shrink-0 items-center justify-end">
              <PromotionalSlot placement="LEFT" />
            </div>

            {/* Central AI Search Box Experience */}
            <div className="w-full max-w-2xl space-y-4">
              <form
                onSubmit={handleSearch}
                className="p-2 sm:p-2.5 rounded-2xl bg-white border-2 border-amber-500/30 shadow-2xl shadow-amber-900/10 focus-within:border-amber-600 focus-within:ring-4 focus-within:ring-amber-500/20 transition-all flex flex-col sm:flex-row gap-2"
              >
                <div className="relative flex-1 flex items-center pl-3">
                  <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mr-3 animate-pulse" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ask anything about Banaras… (e.g. best food under ₹150, sunset ghats, 2-day plan)"
                    className="w-full bg-transparent text-slate-950 placeholder:text-slate-500 text-sm sm:text-base focus:outline-none font-medium"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="px-6 py-3 shrink-0 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-bold text-sm shadow-md shadow-orange-500/25 hover:shadow-orange-500/40 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <span>Ask AI Guide</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </form>

              {/* Sample Prompts Chips */}
              <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
                <span className="text-slate-600 font-semibold">Try asking:</span>
                {samplePrompts.map((prompt) => (
                  <motion.button
                    key={prompt}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleChipClick(prompt)}
                    className="px-3.5 py-1.5 rounded-full bg-white hover:bg-amber-50 border border-amber-300/70 hover:border-amber-500 text-slate-800 hover:text-amber-950 text-xs font-medium shadow-sm transition-all cursor-pointer"
                  >
                    “{prompt}”
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Right Promotional Banner (Desktop Only) */}
            <div className="hidden lg:flex shrink-0 items-center justify-start">
              <PromotionalSlot placement="RIGHT" />
            </div>
          </div>

          {/* Mobile-Friendly Swipeable Promotional Carousel (Mobile & Tablet Only) */}
          <div className="block lg:hidden max-w-md mx-auto pt-6">
            <MobilePromotionalCarousel />
          </div>
        </motion.div>

        {/* Primary CTA Buttons */}
        <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link href="/explore">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Button
                variant="primary"
                size="lg"
                className="px-7 py-3.5 shadow-xl shadow-orange-600/25"
              >
                <Compass className="w-5 h-5 mr-1" />
                <span>Explore Banaras</span>
              </Button>
            </motion.div>
          </Link>
          <Link href="/plan">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Button
                variant="outline"
                size="lg"
                className="px-7 py-3.5 bg-white hover:bg-amber-50 text-slate-900 border-2 border-amber-500/40 hover:border-amber-500 font-bold shadow-md shadow-amber-900/5"
              >
                <CalendarCheck className="w-5 h-5 mr-1 text-amber-600" />
                <span>Plan My Trip</span>
              </Button>
            </motion.div>
          </Link>
        </motion.div>

        {/* Quick Stats Bar */}
        <motion.div
          variants={itemVariants}
          className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto border-t border-amber-500/20 text-center"
        >
          <div className="p-3 rounded-2xl bg-white/60 border border-amber-500/15 backdrop-blur-sm">
            <p className="text-2xl sm:text-3xl font-bold text-amber-700 font-serif">84+</p>
            <p className="text-xs text-slate-600 uppercase tracking-wider mt-0.5 font-semibold">Historic Ghats</p>
          </div>
          <div className="p-3 rounded-2xl bg-white/60 border border-amber-500/15 backdrop-blur-sm">
            <p className="text-2xl sm:text-3xl font-bold text-orange-700 font-serif">3,000+</p>
            <p className="text-xs text-slate-600 uppercase tracking-wider mt-0.5 font-semibold">Years of Living Soul</p>
          </div>
          <div className="p-3 rounded-2xl bg-white/60 border border-amber-500/15 backdrop-blur-sm">
            <p className="text-2xl sm:text-3xl font-bold text-sky-700 font-serif">100%</p>
            <p className="text-xs text-slate-600 uppercase tracking-wider mt-0.5 font-semibold">Verified Knowledge</p>
          </div>
          <div className="p-3 rounded-2xl bg-white/60 border border-amber-500/15 backdrop-blur-sm">
            <p className="text-2xl sm:text-3xl font-bold text-emerald-700 font-serif">Live</p>
            <p className="text-xs text-slate-600 uppercase tracking-wider mt-0.5 font-semibold">Traveler Community</p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

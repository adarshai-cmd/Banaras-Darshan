"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Sparkles,
  Send,
  Bot,
  User,
  CheckCircle2,
  Star,
  RotateCcw,
  Languages,
} from "lucide-react";
import { GlassCard, Button } from "@/components/ui/GlassCard";
import { SafeImage } from "@/components/ui/SafeImage";

interface ChatCard {
  id: string;
  name: string;
  slug: string;
  category: string;
  area: string;
  approxBudget: string;
  rating?: number | null;
  image: string;
  tagline: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: string[];
  cards?: ChatCard[];
  timestamp: string;
}

export function AIAssistantWidget({ initialPrompt = "" }: { initialPrompt?: string }) {
  const [selectedLang, setSelectedLang] = useState<"auto" | "hi" | "en" | "bilingual">("auto");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "हर हर महादेव! 🙏 Namaste! I am **Banaras AI (बनारस एआई)**, your local digital travel guide powered by Google Gemini.\n\nआप मुझसे **हिंदी (हिन्दी)**, **English**, या **Hinglish** में कुछ भी पूछ सकते हैं — जैसे मंदिर दर्शन समय, घाट आरती, नाव का किराया और बनारसी खान-पान!",
      sources: ["Google Gemini Multilingual Engine", "Banaras Darshan 100% Verified Heritage Directory"],
      timestamp: "10:30 AM",
    },
  ]);
  const [input, setInput] = useState<string>(initialPrompt);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialPromptSentRef = useRef<boolean>(false);

  const suggestedPrompts = [
    "काशी विश्वनाथ मंगला आरती का समय?",
    "Best breakfast under ₹150 (कचौड़ी-जलेबी)?",
    "अस्सी घाट से दशाश्वमेध नाव का सही किराया?",
    "Which ghat is best for sunset boat ride?",
    "काल भैरव मंदिर दर्शन के नियम?",
    "2 Days budget itinerary (₹3000)?",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = useCallback(
    async (questionToSend?: string) => {
      const query = questionToSend || input;
      if (!query.trim()) return;

      const userMessage: Message = {
        role: "user",
        content: query.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsTyping(true);

      try {
        const res = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: query, language: selectedLang }),
        });
        const data = await res.json();

        if (data.success) {
          const assistantMessage: Message = {
            role: "assistant",
            content: data.reply,
            sources: data.contextSources,
            cards: data.relatedPlaces,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          };
          setMessages((prev) => [...prev, assistantMessage]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: "Sorry, I had trouble processing your query. Please try again.",
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ]);
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Network error communicating with Banaras AI server.",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      } finally {
        setIsTyping(false);
      }
    },
    [input, selectedLang]
  );

  useEffect(() => {
    if (initialPrompt && initialPrompt.trim() && !initialPromptSentRef.current) {
      initialPromptSentRef.current = true;
      handleSend(initialPrompt);
    }
  }, [initialPrompt, handleSend]);

  return (
    <GlassCard className="flex flex-col h-[650px] overflow-hidden bg-white/95 border border-amber-500/20 shadow-xl" hoverEffect={false}>
      {/* AI Header */}
      <div className="p-4 border-b border-amber-500/20 bg-[#F5F2EA] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 via-orange-600 to-amber-700 flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-5 h-5 text-amber-200 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 font-serif">
              <span>Banaras AI Guide</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 font-sans font-semibold">
                Gemini Multilingual
              </span>
            </h3>
            <p className="text-[11px] text-slate-600">
              Grounded in official temple schedules, verified food spots & transit rates
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            setMessages([
              {
                role: "assistant",
                content: "हर हर महादेव! 🙏 Namaste! Conversation reset. How may I guide your journey through Kashi?",
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              },
            ])
          }
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-black/5 transition-colors"
          title="Reset Conversation"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Language Selector Ribbon */}
      <div className="px-4 py-2 bg-[#FAF7F0] border-b border-amber-500/15 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-[11px] shrink-0">
          <Languages className="w-3.5 h-3.5 text-amber-700" />
          <span>भाषा / Language:</span>
        </div>
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
          {[
            { id: "auto", label: "🌐 Auto (स्वतः)" },
            { id: "hi", label: "🇮🇳 हिन्दी" },
            { id: "en", label: "🇬🇧 English" },
            { id: "bilingual", label: "✨ Hinglish" },
          ].map((lang) => (
            <button
              key={lang.id}
              type="button"
              onClick={() => setSelectedLang(lang.id as "auto" | "hi" | "en" | "bilingual")}
              className={`px-2.5 py-0.5 rounded-lg text-[11px] transition-all cursor-pointer whitespace-nowrap ${
                selectedLang === lang.id
                  ? "bg-amber-600 text-white font-bold shadow-sm"
                  : "bg-white text-slate-700 hover:bg-amber-50 hover:text-amber-900 border border-amber-500/20"
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-[#FAF8F5]/60">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-800 shrink-0">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-2xl rounded-2xl p-4 text-sm leading-relaxed shadow-sm ${
                msg.role === "user"
                  ? "bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-tr-none shadow-md"
                  : "bg-white border border-amber-500/20 text-slate-800 rounded-tl-none"
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>

              {/* Context Sources footer */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-black/10 text-[11px] text-slate-500 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Sources: {msg.sources.join(" • ")}</span>
                </div>
              )}

              {/* Embedded Place Cards */}
              {msg.cards && msg.cards.length > 0 && (
                <div className="mt-3 pt-3 border-t border-black/10 space-y-2">
                  <p className="text-[11px] uppercase tracking-wider text-amber-800 font-bold">
                    Recommended Verified Destinations:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {msg.cards.map((card) => (
                      <Link
                        key={card.id}
                        href={`/map?place=${encodeURIComponent(card.name)}`}
                        className="p-2.5 rounded-xl bg-amber-50/50 hover:bg-white border border-amber-500/20 hover:border-amber-500/50 transition-all flex items-center gap-3 text-left shadow-sm group"
                      >
                        <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                          <SafeImage
                            src={card.image}
                            alt={card.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-900 group-hover:text-amber-700 truncate">{card.name}</p>
                          <p className="text-[10px] text-amber-800 font-medium">{card.approxBudget}</p>
                          <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                            <span className="flex items-center gap-0.5 text-amber-700 font-semibold">
                              <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                              {card.rating ? card.rating.toFixed(1) : "—"}
                            </span>
                            <span>•</span>
                            <span className="truncate">{card.area}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div
                suppressHydrationWarning
                className={`text-[10px] mt-2 text-right ${
                  msg.role === "user" ? "text-orange-100" : "text-slate-400"
                }`}
              >
                {msg.timestamp}
              </div>
            </div>

            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-xl bg-orange-600/10 border border-orange-500/30 flex items-center justify-center text-orange-700 shrink-0">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-800">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3 rounded-2xl bg-white border border-amber-500/20 rounded-tl-none flex items-center gap-1.5 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts Bar */}
      <div className="p-2.5 border-t border-amber-500/20 bg-[#F5F2EA] overflow-x-auto flex items-center gap-2 scrollbar-none">
        <span className="text-[11px] text-slate-600 font-semibold whitespace-nowrap pl-2">Ask:</span>
        {suggestedPrompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => handleSend(prompt)}
            className="px-3 py-1 rounded-full bg-white hover:bg-amber-100/60 border border-amber-400/40 text-[11px] text-slate-800 hover:text-amber-950 font-medium whitespace-nowrap transition-all shadow-sm cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-4 border-t border-amber-500/20 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              selectedLang === "hi"
                ? "काशी दर्शन, मंगला आरती समय, कचौड़ी, नाव का किराया पूछें..."
                : selectedLang === "bilingual"
                ? "Ask in Hindi or English (e.g. Kaal Bhairav rules, ₹150 breakfast)..."
                : "Ask about temples, food under ₹150, sunset ghats, boat fares..."
            }
            className="flex-1 rounded-xl px-4 py-2.5 text-sm bg-[#FAF8F5] border border-amber-500/30 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          />
          <Button
            type="submit"
            variant="gold"
            size="md"
            disabled={isTyping || !input.trim()}
            className="px-5 py-2.5 shadow-md"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </GlassCard>
  );
}

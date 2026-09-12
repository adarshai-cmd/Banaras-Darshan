"use client";

import React, { useState, useEffect } from "react";
import {
  MessageCircle,
  Send,
  Reply,
  Languages,
  Loader2,
  LogIn,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { GlassCard, Button } from "@/components/ui/GlassCard";
import { AuthModal } from "@/components/modals/AuthModal";

interface ReplyItem {
  id: string;
  userName: string;
  userBadge?: string;
  content: string;
  createdAt: string;
}

interface MessageItem {
  id: string;
  userName: string;
  userBadge?: string;
  content: string;
  createdAt: string;
  replies?: ReplyItem[];
}

const COMMUNITY_LANGUAGES = [
  { id: "all", label: "🌐 All / सब" },
  { id: "hi", label: "🇮🇳 हिन्दी", script: /[\u0900-\u097F]/ },
  { id: "bho", label: "🌾 भोजपुरी", keywords: ["का हाल", "रउआ", "बाटे", "बानि", "हमके", "भोजपुरी"] },
  { id: "en", label: "🇬🇧 English", script: /^[a-zA-Z0-9\s.,!?'"-]+$/ },
  { id: "bn", label: "🪷 বাংলা", script: /[\u0980-\u09FF]/ },
  { id: "ta", label: "🛕 தமிழ்", script: /[\u0B80-\u0BFF]/ },
  { id: "te", label: "🌸 తెలుగు", script: /[\u0C00-\u0C7F]/ },
  { id: "gu", label: "🪁 ગુજરાતી", script: /[\u0A80-\u0AFF]/ },
  { id: "mr", label: "🚩 मराठी", script: /[\u0900-\u097F]/ },
];

export function CommunityFeed() {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [activeLang, setActiveLang] = useState<string>("all");
  const [inputContent, setInputContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState<string>("");
  const [isSubmittingReply, setIsSubmittingReply] = useState<boolean>(false);

  // Auth State
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Check login state
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

  // Fetch real messages
  const fetchMessages = () => {
    setIsLoading(true);
    fetch("/api/community/messages?channel=all")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.messages)) {
          setMessages(data.messages);
        } else {
          setMessages([]);
        }
      })
      .catch(() => setMessages([]))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Post message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputContent.trim()) return;

    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }

    setIsSubmitting(true);
    setNotification(null);

    try {
      const res = await fetch("/api/community/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: inputContent.trim(),
          channel: "general",
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setNotification({
          type: "error",
          text: data.error || "Failed to post message.",
        });
        return;
      }

      setInputContent("");
      setNotification({
        type: "success",
        text: "Message posted successfully!",
      });
      setTimeout(() => setNotification(null), 3000);
      fetchMessages();
    } catch {
      setNotification({
        type: "error",
        text: "Network error. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit reply
  const handleSendReply = async (messageId: string) => {
    if (!replyContent.trim()) return;

    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }

    setIsSubmittingReply(true);

    try {
      const res = await fetch("/api/community/replies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageId,
          content: replyContent.trim(),
        }),
      });

      const data = await res.json();

      if (data.success) {
        setReplyContent("");
        setActiveReplyId(null);
        fetchMessages();
      } else {
        alert(data.error || "Could not post reply.");
      }
    } catch {
      alert("Network error posting reply.");
    } finally {
      setIsSubmittingReply(false);
    }
  };

  // Format relative time simply
  const formatTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  // Filter messages by active language if selected
  const filteredMessages = messages.filter((msg) => {
    if (activeLang === "all") return true;

    const langObj = COMMUNITY_LANGUAGES.find((l) => l.id === activeLang);
    if (!langObj) return true;

    if (langObj.keywords) {
      const lower = msg.content.toLowerCase();
      return langObj.keywords.some((k) => lower.includes(k.toLowerCase()));
    }

    if (langObj.script) {
      return langObj.script.test(msg.content);
    }

    return true;
  });

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* 1. Simple Language Filter Bar */}
      <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-2 overflow-x-auto scrollbar-thin">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 shrink-0 pr-1">
          <Languages className="w-3.5 h-3.5 text-amber-600" />
          <span>Language / भाषा:</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
          {COMMUNITY_LANGUAGES.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setActiveLang(lang.id)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                activeLang === lang.id
                  ? "bg-amber-500 text-slate-950 font-bold shadow-xs ring-1 ring-amber-400"
                  : "bg-slate-50 text-slate-600 hover:bg-amber-50 hover:text-amber-900 border border-slate-200/80"
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications */}
      {notification && (
        <div
          className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
            notification.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
              : "bg-rose-50 border border-rose-200 text-rose-800"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          )}
          <span>{notification.text}</span>
        </div>
      )}

      {/* 2. Main Chat Box */}
      <div className="rounded-3xl bg-white border border-slate-200/90 shadow-sm overflow-hidden flex flex-col">
        {/* Chat Header */}
        <div className="p-3.5 sm:p-4 bg-[#FAF7F0] border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-sm font-bold text-slate-900 font-serif">
              Live Banaras Community Board
            </h2>
          </div>
          <span className="text-[11px] text-slate-500">
            {messages.length} {messages.length === 1 ? "Message" : "Messages"}
          </span>
        </div>

        {/* Messages Stream */}
        <div className="p-4 sm:p-5 space-y-4 min-h-[300px] max-h-[560px] overflow-y-auto bg-[#FAF8F5]/40">
          {isLoading ? (
            <div className="py-20 text-center space-y-2">
              <Loader2 className="w-6 h-6 animate-spin text-amber-600 mx-auto" />
              <p className="text-xs text-slate-500">Loading conversation...</p>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="py-16 text-center space-y-2 text-slate-500">
              <div className="w-12 h-12 rounded-2xl bg-amber-100/70 text-amber-800 flex items-center justify-center mx-auto text-xl">
                💬
              </div>
              <p className="text-sm font-bold text-slate-800 font-serif">
                No messages yet
              </p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Be the first traveler or local to say Har Har Mahadev, ask for morning boat advice, or share a food tip!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2"
                >
                  {/* Message Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                        {msg.userName ? msg.userName.charAt(0).toUpperCase() : "U"}
                      </div>
                      <span className="text-xs font-bold text-slate-900">{msg.userName}</span>
                      {msg.userBadge && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                          {msg.userBadge}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {formatTime(msg.createdAt)}
                    </span>
                  </div>

                  {/* Content */}
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap pl-9">
                    {msg.content}
                  </p>

                  {/* Reply Button */}
                  <div className="pl-9 pt-1 flex items-center justify-start">
                    <button
                      onClick={() => {
                        if (!currentUser) {
                          setAuthModalOpen(true);
                        } else {
                          setActiveReplyId(activeReplyId === msg.id ? null : msg.id);
                        }
                      }}
                      className="inline-flex items-center gap-1 text-[11px] text-amber-800 hover:text-amber-950 font-semibold cursor-pointer"
                    >
                      <Reply className="w-3 h-3" />
                      <span>Reply</span>
                      {msg.replies && msg.replies.length > 0 && (
                        <span className="text-slate-400">({msg.replies.length})</span>
                      )}
                    </button>
                  </div>

                  {/* Inline Reply Input */}
                  {activeReplyId === msg.id && (
                    <div className="pl-9 pt-2 space-y-2 animate-in fade-in">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder={`Reply to ${msg.userName}...`}
                          className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-500 focus:outline-none text-xs text-slate-900"
                        />
                        <button
                          disabled={isSubmittingReply || !replyContent.trim()}
                          onClick={() => handleSendReply(msg.id)}
                          className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-2xs cursor-pointer disabled:opacity-50"
                        >
                          {isSubmittingReply ? "..." : "Send"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Nested Replies */}
                  {msg.replies && msg.replies.length > 0 && (
                    <div className="pl-9 space-y-2 pt-1">
                      <div className="border-l-2 border-amber-300 pl-3 space-y-2">
                        {msg.replies.map((reply) => (
                          <div key={reply.id} className="space-y-0.5 text-xs bg-slate-50/80 p-2 rounded-xl">
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="font-bold text-slate-900">{reply.userName}</span>
                              <span className="text-slate-400">{formatTime(reply.createdAt)}</span>
                            </div>
                            <p className="text-slate-700 text-xs leading-relaxed">
                              {reply.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3. Bottom Simple Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
          {currentUser ? (
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <input
                type="text"
                value={inputContent}
                onChange={(e) => setInputContent(e.target.value)}
                placeholder="Type a message, question, or tip in any language..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-[#FAF8F5] focus:bg-white focus:border-amber-500 focus:outline-none text-xs sm:text-sm text-slate-900"
              />
              <button
                type="submit"
                disabled={isSubmitting || !inputContent.trim()}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50 shrink-0"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Send</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="flex items-center justify-between gap-3 p-2 rounded-xl bg-amber-50/60 border border-amber-200/60 text-xs">
              <span className="text-slate-700 font-medium">
                👋 Have a question or local tip? Sign in to join the conversation.
              </span>
              <button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer shrink-0"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Global Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode="login"
        onSuccess={(user) => {
          setCurrentUser(user);
        }}
      />
    </div>
  );
}

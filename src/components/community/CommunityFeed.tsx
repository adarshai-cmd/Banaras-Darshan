"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  MessageSquare,
  ThumbsUp,
  ShieldCheck,
  AlertTriangle,
  Send,
  Flag,
  Sparkles,
  CheckCircle,
  HelpCircle,
  Clock,
  CornerDownRight,
  Filter,
} from "lucide-react";
import { GlassCard, Button, Badge } from "@/components/ui/GlassCard";

interface ReplyItem {
  id: string;
  userName: string;
  userBadge: string;
  content: string;
  isVerified: boolean;
  createdAt: string;
}

interface MessageItem {
  id: string;
  userName: string;
  userBadge: string;
  channel: string;
  content: string;
  isVerified: boolean;
  verifiedNote?: string | null;
  status: string;
  helpfulCount: number;
  createdAt: string;
  replies?: ReplyItem[];
}

export function CommunityFeed() {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [activeChannel, setActiveChannel] = useState<string>("all");
  const [inputContent, setInputContent] = useState<string>("");
  const [authorName, setAuthorName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [moderationAlert, setModerationAlert] = useState<{
    type: "error" | "warning" | "success";
    message: string;
  } | null>(null);

  // Replying state
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyAuthor, setReplyAuthor] = useState<string>("");
  const [replyContent, setReplyContent] = useState<string>("");

  // Report modal state
  const [reportingMsgId, setReportingMsgId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState<string>("SPAM");
  const [reportDetails, setReportDetails] = useState<string>("");
  const [reportSubmitted, setReportSubmitted] = useState<boolean>(false);

  const channels = [
    { id: "all", label: "All Topics" },
    { id: "general", label: "Live Traveler Help" },
    { id: "food", label: "Food & Chai" },
    { id: "ghats", label: "Ghats & Boats" },
    { id: "stays", label: "Stays & Hostels" },
  ];

  // Fetch messages
  const fetchMessages = async (channel: string) => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/community/messages?channel=${channel}`);
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.error("Failed to load messages", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages(activeChannel);
    // Polling every 12 seconds for live updates
    const timer = setInterval(() => {
      fetchMessages(activeChannel);
    }, 12000);
    return () => clearInterval(timer);
  }, [activeChannel]);

  // Handle Post Message with Moderation
  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputContent.trim()) return;

    setIsSubmitting(true);
    setModerationAlert(null);

    try {
      const res = await fetch("/api/community/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: inputContent,
          channel: activeChannel === "all" ? "general" : activeChannel,
          userName: authorName.trim() || "Traveler",
          userBadge: "Helpful Traveler",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Moderation rejected
        setModerationAlert({
          type: "error",
          message: data.error || "Message rejected by content safety pipeline.",
        });
        return;
      }

      if (data.held) {
        setModerationAlert({
          type: "warning",
          message: data.notice,
        });
        setInputContent("");
        return;
      }

      // Approved!
      setModerationAlert({
        type: "success",
        message: "Message published live to Banaras Darshan community!",
      });
      setInputContent("");
      // Add immediately to top of state
      setMessages([data.message, ...messages]);
    } catch (err) {
      setModerationAlert({
        type: "error",
        message: "Network error submitting message.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Upvote / Helpful
  const handleHelpful = async (messageId: string) => {
    try {
      const res = await fetch("/api/community/helpful", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === messageId ? { ...m, helpfulCount: data.helpfulCount } : m
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Submit reply
  const handleReplySubmit = async (messageId: string) => {
    if (!replyContent.trim()) return;
    try {
      const res = await fetch("/api/community/replies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageId,
          content: replyContent,
          userName: replyAuthor.trim() || authorName.trim() || "Fellow Traveler",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === messageId
              ? {
                  ...m,
                  replies: [...(m.replies || []), data.reply],
                  helpfulCount: m.helpfulCount + 1,
                }
              : m
          )
        );
        setReplyContent("");
        setReplyAuthor("");
        setReplyingToId(null);
      } else {
        alert(data.error || "Reply could not be posted.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Submit report
  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportingMsgId) return;

    try {
      const res = await fetch("/api/community/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageId: reportingMsgId,
          reason: reportReason,
          details: reportDetails,
          reporterName: authorName.trim() || "Concerned Traveler",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setReportSubmitted(true);
        setTimeout(() => {
          setReportingMsgId(null);
          setReportSubmitted(false);
          setReportDetails("");
        }, 2000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getBadgeStyle = (badge: string) => {
    switch (badge) {
      case "Verified Contributor":
        return "gold";
      case "Local Guide":
        return "saffron";
      case "Helpful Traveler":
        return "river";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Online Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-amber-500/20 backdrop-blur-xl shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 font-serif flex items-center gap-2">
              <span>Banaras Traveler Community</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </h3>
            <p className="text-xs text-slate-600">
              Ask questions, exchange tips, and discover verified local wisdom in real time
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-900 font-semibold shadow-sm">
            🟢 128 Travelers Online
          </span>
          <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 font-semibold shadow-sm">
            ✓ Auto-Moderated & Safe
          </span>
        </div>
      </div>

      {/* Channel Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {channels.map((ch) => (
          <button
            key={ch.id}
            onClick={() => setActiveChannel(ch.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
              activeChannel === ch.id
                ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white border-amber-600 shadow-md"
                : "bg-white text-slate-700 border-amber-500/20 hover:bg-amber-50 hover:text-amber-800 shadow-sm"
            }`}
          >
            {ch.label}
          </button>
        ))}
      </div>

      {/* New Post Box */}
      <GlassCard className="p-5 sm:p-6 bg-white border border-amber-500/20 shadow-md" hoverEffect={false}>
        <form onSubmit={handlePost} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Your Name / Handle (e.g. Rahul, Maya, Backpacker24)"
              className="sm:w-64 rounded-xl px-3.5 py-2 text-xs font-medium bg-white border border-amber-500/30 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
            <div className="flex-1 flex items-center gap-2 text-xs text-slate-600 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Posts undergo automatic spam, profanity & factual verification</span>
            </div>
          </div>

          <div>
            <textarea
              rows={3}
              value={inputContent}
              onChange={(e) => setInputContent(e.target.value)}
              placeholder="Ask a question or share a local tip (e.g. 'What is the best time for Aarti today?' or 'I recommend the Tamatar Chaat at Kashi Chaat Bhandar!')"
              className="w-full rounded-xl p-3.5 text-sm resize-none bg-white border border-amber-500/30 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          {/* Moderation Feedback Alert */}
          {moderationAlert && (
            <div
              className={`p-3 rounded-xl text-xs flex items-start gap-2.5 animate-in fade-in ${
                moderationAlert.type === "error"
                  ? "bg-rose-100 border border-rose-300 text-rose-900 font-medium"
                  : moderationAlert.type === "warning"
                  ? "bg-amber-100 border border-amber-300 text-amber-900 font-medium"
                  : "bg-emerald-100 border border-emerald-300 text-emerald-900 font-medium"
              }`}
            >
              {moderationAlert.type === "error" ? (
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              )}
              <p className="leading-relaxed font-medium">{moderationAlert.message}</p>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <div className="text-[11px] text-slate-500">
              Respectful conduct strictly enforced.
            </div>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isSubmitting || !inputContent.trim()}
              className="px-5 py-2 text-xs"
            >
              <Send className="w-3.5 h-3.5 mr-1" />
              <span>{isSubmitting ? "Verifying & Posting..." : "Post to Community"}</span>
            </Button>
          </div>
        </form>
      </GlassCard>

      {/* Messages Feed */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            <div className="w-8 h-8 mx-auto mb-3 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
            Loading real-time community dispatches...
          </div>
        ) : messages.length === 0 ? (
          <GlassCard className="p-12 text-center space-y-3 bg-white border border-amber-500/20 shadow-sm" hoverEffect={false}>
            <MessageSquare className="w-10 h-10 mx-auto text-amber-500/40" />
            <h4 className="text-base font-bold text-slate-900">No discussions in this channel yet</h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Be the first traveler or local to start the conversation!
            </p>
          </GlassCard>
        ) : (
          messages.map((msg) => (
            <GlassCard key={msg.id} className="p-5 sm:p-6 space-y-4 bg-white border border-amber-500/20 shadow-md" hoverEffect={false}>
              {/* Author Row */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 border border-amber-400 flex items-center justify-center text-white font-bold text-xs uppercase shadow-sm">
                    {msg.userName.substring(0, 2)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-slate-900">{msg.userName}</h4>
                      <Badge variant={getBadgeStyle(msg.userBadge)}>
                        {msg.userBadge}
                      </Badge>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {new Date(msg.createdAt).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                {/* Report button */}
                <button
                  onClick={() => setReportingMsgId(msg.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Report inappropriate message"
                >
                  <Flag className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Message Content */}
              <p className="text-sm text-slate-800 leading-relaxed font-normal whitespace-pre-wrap">
                {msg.content}
              </p>

              {/* Verified Recommendation Badge / Fact-Check Banner (Section 20) */}
              {msg.isVerified ? (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 flex items-start gap-2.5 text-xs text-emerald-900 shadow-sm">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-emerald-900">✓ Verified Information</span>
                    <p className="text-slate-700 text-[11px] mt-0.5">
                      {msg.verifiedNote || "This recommendation has been cross-referenced with the verified Banaras Darshan database."}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="px-3 py-1.5 rounded-lg bg-amber-50/60 border border-amber-200 flex items-center gap-2 text-[11px] text-slate-600">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Community Recommendation — Not Yet Verified</span>
                </div>
              )}

              {/* Action Bar */}
              <div className="flex items-center justify-between pt-2 border-t border-black/10 text-xs text-slate-600">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleHelpful(msg.id)}
                    className="flex items-center gap-1.5 text-slate-700 hover:text-amber-800 transition-colors font-medium cursor-pointer"
                  >
                    <ThumbsUp className="w-3.5 h-3.5 text-amber-600" />
                    <span>Helpful ({msg.helpfulCount})</span>
                  </button>
                  <button
                    onClick={() =>
                      setReplyingToId(replyingToId === msg.id ? null : msg.id)
                    }
                    className="flex items-center gap-1.5 text-slate-700 hover:text-sky-700 transition-colors font-medium cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Reply ({msg.replies?.length || 0})</span>
                  </button>
                </div>
                <span className="text-[11px] text-amber-800 uppercase tracking-wider font-mono font-semibold">
                  #{msg.channel}
                </span>
              </div>

              {/* Replies List */}
              {msg.replies && msg.replies.length > 0 && (
                <div className="mt-3 pl-4 sm:pl-6 border-l-2 border-amber-300 space-y-3">
                  {msg.replies.map((reply) => (
                    <div key={reply.id} className="p-3 rounded-xl bg-amber-50/40 border border-amber-500/15 space-y-1 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{reply.userName}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-semibold">
                            {reply.userBadge}
                          </span>
                        </div>
                        {reply.isVerified && (
                          <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-0.5">
                            ✓ Verified
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed font-normal">
                        {reply.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Form */}
              {replyingToId === msg.id && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleReplySubmit(msg.id);
                  }}
                  className="mt-3 pt-3 border-t border-black/10 flex flex-col sm:flex-row gap-2"
                >
                  <input
                    type="text"
                    value={replyAuthor}
                    onChange={(e) => setReplyAuthor(e.target.value)}
                    placeholder="Your Name"
                    className="sm:w-40 rounded-xl px-3 py-2 text-xs bg-white border border-amber-500/30 text-slate-900"
                  />
                  <input
                    type="text"
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write a verified, helpful reply..."
                    className="flex-1 rounded-xl px-3.5 py-2 text-xs bg-white border border-amber-500/30 text-slate-900"
                  />
                  <Button type="submit" variant="gold" size="sm" className="px-4 py-2 text-xs">
                    Reply
                  </Button>
                </form>
              )}
            </GlassCard>
          ))
        )}
      </div>

      {/* Report Modal */}
      {reportingMsgId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl bg-[#091128] border border-white/20 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Flag className="w-4 h-4 text-rose-400" />
                <span>Report Community Message</span>
              </h4>
              <button
                onClick={() => setReportingMsgId(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {reportSubmitted ? (
              <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-center text-xs text-emerald-300">
                ✓ Report logged. Our moderation team will inspect this post promptly.
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Violation Category:
                  </label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full glass-input rounded-xl p-2.5 text-xs bg-[#070d1e]"
                  >
                    <option value="SPAM" className="bg-[#070d1e] text-white">Spam / Advertising / Phishing</option>
                    <option value="ABUSE" className="bg-[#070d1e] text-white">Abuse / Vulgar Language / Harassment</option>
                    <option value="FALSE_INFO" className="bg-[#070d1e] text-white">Misleading / False Travel Advice</option>
                    <option value="SCAM" className="bg-[#070d1e] text-white">Scam / Unauthorized Tour Operation</option>
                    <option value="UNSAFE" className="bg-[#070d1e] text-white">Hazardous / Unsafe River Advice</option>
                    <option value="OTHER" className="bg-[#070d1e] text-white">Other Policy Violation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Additional Context (Optional):
                  </label>
                  <textarea
                    rows={3}
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    placeholder="Provide additional details to help the moderator..."
                    className="w-full glass-input rounded-xl p-2.5 text-xs resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setReportingMsgId(null)}
                  >
                    Cancel
                  </Button>
                  <Button variant="danger" size="sm" type="submit">
                    Submit Report to Admin
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

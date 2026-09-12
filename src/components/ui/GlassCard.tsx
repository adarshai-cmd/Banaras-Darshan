import React from "react";
import { Loader2 } from "lucide-react";

export function GlassCard({
  children,
  className = "",
  hoverEffect = true,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border border-slate-200/90 bg-white/95 backdrop-blur-xl shadow-sm transition-all duration-300 text-slate-900 ${
        hoverEffect
          ? "hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-900/5 hover:-translate-y-1 cursor-pointer"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  disabled = false,
  loading = false,
  type = "button",
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "gold" | "outline" | "ghost" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
}) {
  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs font-semibold rounded-lg",
    md: "px-4 py-2 text-sm font-semibold rounded-xl",
    lg: "px-6 py-3 text-base font-bold rounded-xl",
  };

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 hover:from-orange-500 hover:to-amber-500 text-white shadow-md shadow-orange-950/20 active:scale-[0.98] border border-orange-700/30",
    secondary:
      "bg-gradient-to-r from-blue-700 to-sky-600 hover:from-blue-600 hover:to-sky-500 text-white shadow-md shadow-blue-950/20 active:scale-[0.98] border border-blue-800/30",
    gold:
      "bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-bold shadow-sm active:scale-[0.98] border border-amber-500/40",
    outline:
      "border-2 border-slate-300 bg-white hover:bg-amber-50/50 hover:border-amber-500 text-slate-900 font-semibold shadow-sm active:scale-[0.98]",
    ghost:
      "text-slate-700 hover:text-slate-950 hover:bg-slate-100 font-medium active:scale-[0.98]",
    danger:
      "bg-red-600 hover:bg-red-500 text-white border border-red-700 active:scale-[0.98] shadow-sm",
    success:
      "bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-700 active:scale-[0.98] shadow-sm",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/40 ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
      {children}
    </button>
  );
}

export function Badge({
  children,
  variant = "default",
  className = "",
}: {
  children: React.ReactNode;
  variant?: "default" | "gold" | "saffron" | "river" | "success" | "warning" | "danger";
  className?: string;
}) {
  const styles = {
    default:
      "bg-slate-100 text-slate-900 border-slate-200 font-medium",
    gold:
      "bg-amber-50 text-amber-950 border-amber-300 font-bold",
    saffron:
      "bg-orange-50 text-orange-950 border-orange-300 font-bold",
    river:
      "bg-sky-50 text-sky-950 border-sky-300 font-bold",
    success:
      "bg-emerald-50 text-emerald-950 border-emerald-300 font-bold",
    warning:
      "bg-yellow-50 text-yellow-950 border-yellow-300 font-bold",
    danger:
      "bg-rose-50 text-rose-950 border-rose-300 font-bold",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

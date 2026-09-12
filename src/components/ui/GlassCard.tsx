import React from "react";

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
      className={`rounded-2xl border border-amber-500/15 dark:border-white/10 bg-white/85 dark:bg-[#0c1630]/80 backdrop-blur-xl shadow-md transition-all duration-300 text-slate-800 dark:text-slate-100 ${
        hoverEffect
          ? "hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-1 cursor-pointer"
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
  type = "button",
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "gold" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}) {
  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs font-medium rounded-lg",
    md: "px-4 py-2 text-sm font-semibold rounded-xl",
    lg: "px-6 py-3 text-base font-bold rounded-xl",
  };

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white shadow-lg shadow-orange-900/20 active:scale-[0.98]",
    secondary:
      "bg-gradient-to-r from-blue-700 to-sky-600 hover:from-blue-600 hover:to-sky-500 text-white shadow-lg shadow-blue-900/20 active:scale-[0.98]",
    gold:
      "bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold shadow-md shadow-amber-900/20 active:scale-[0.98]",
    outline:
      "border border-slate-300 dark:border-white/20 bg-white/60 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-800 dark:text-white backdrop-blur-md active:scale-[0.98]",
    ghost:
      "text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-lg active:scale-[0.98]",
    danger:
      "bg-red-600 hover:bg-red-500 text-white border border-red-500/30 active:scale-[0.98]",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
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
      "bg-slate-100 text-slate-800 border-slate-200 dark:bg-white/10 dark:text-slate-200 dark:border-white/15",
    gold:
      "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/40 font-semibold",
    saffron:
      "bg-orange-100 text-orange-900 border-orange-300 dark:bg-orange-500/20 dark:text-orange-300 dark:border-orange-500/40 font-semibold",
    river:
      "bg-sky-100 text-sky-900 border-sky-300 dark:bg-sky-500/20 dark:text-sky-300 dark:border-sky-500/40 font-semibold",
    success:
      "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/40 font-semibold",
    warning:
      "bg-yellow-100 text-yellow-900 border-yellow-300 dark:bg-yellow-500/20 dark:text-yellow-300 dark:border-yellow-500/40 font-semibold",
    danger:
      "bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/40 font-semibold",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border backdrop-blur-sm ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

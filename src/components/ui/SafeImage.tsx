"use client";

import React, { useState } from "react";

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  category?: string;
}

export function SafeImage({
  src,
  alt,
  className = "",
  fill = false,
  width,
  height,
  priority = false,
  category = "Kashi",
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  // If image fails to load or domain is blocked, fallback to a beautiful Kashi glassmorphic backdrop
  if (hasError || !src) {
    return (
      <div
        className={`relative overflow-hidden flex flex-col items-center justify-center bg-gradient-to-br from-[#0d1733] via-[#14224b] to-[#070d1e] border border-white/10 ${className}`}
        style={fill ? undefined : { width: width || 400, height: height || 250 }}
      >
        <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="z-10 text-center px-4">
          <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-white/5 border border-amber-500/30 flex items-center justify-center text-amber-400">
            🛕
          </div>
          <p className="text-xs font-semibold text-amber-300 tracking-wider uppercase">{category}</p>
          <p className="text-xs text-slate-300 line-clamp-1 mt-1 font-medium">{alt}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${fill ? "w-full h-full" : ""} ${className}`}>
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-105 ${className}`}
      />
    </div>
  );
}

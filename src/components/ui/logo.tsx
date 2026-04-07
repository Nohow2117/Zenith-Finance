import React from "react";

export function Logo({ className = "w-8 h-8", withText = true }: { className?: string; withText?: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative flex items-center justify-center w-full h-full aspect-square text-accent">
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_0_12px_rgba(0,211,149,0.4)]">
          <path d="M16 2L2 16L16 30L30 16L16 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="miter" />
          <path d="M16 8L8 16L16 24" stroke="currentColor" strokeWidth="2" strokeLinejoin="miter" />
          <path d="M16 16L24 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="16" cy="16" r="2" fill="currentColor" />
        </svg>
      </div>
      {withText && (
        <span className="font-bold tracking-tight text-xl text-white">
          ArtDe<span className="text-accent">Finance</span>
        </span>
      )}
    </div>
  );
}

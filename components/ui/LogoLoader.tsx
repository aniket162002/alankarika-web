"use client";
import React from "react";

export default function LogoLoader({ show = true }: { show?: boolean }) {
  return (
    <div
      style={{
        pointerEvents: show ? "auto" : "none",
        opacity: show ? 1 : 0,
        transition: "opacity 0.5s cubic-bezier(.4,0,.2,1)",
        zIndex: 9999,
      }}
      className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm"
      aria-hidden={!show}
    >
      <div className="relative flex items-center justify-center">
        {/* Animated conic-gradient border */}
        <span
          className="absolute w-16 h-16 rounded-full animate-spin-slower"
          style={{
            background: "conic-gradient(from 0deg, #fbbf24, #6366f1, #10b981, #f43f5e, #fbbf24)",
            filter: "blur(0.5px) drop-shadow(0 0 8px #fbbf24) drop-shadow(0 0 8px #6366f1)",
            padding: 0,
            display: "block",
            zIndex: 0,
          }}
        >
          <span
            className="block w-14 h-14 bg-white rounded-full m-1"
            style={{ boxShadow: "0 2px 12px 0 #e0e7ff55" }}
          />
        </span>
        {/* Logo with pulse/scale */}
        <img
          src="/logo.jpeg"
          alt="Loading..."
          className="w-11 h-11 rounded-full shadow-xl border-2 border-white object-cover bg-white animate-logo-pulse"
          style={{ zIndex: 1 }}
        />
      </div>
    </div>
  );
} 
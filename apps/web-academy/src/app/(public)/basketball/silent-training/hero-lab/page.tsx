"use client";

import { useState } from "react";

// V1: MINIMAL / CLEAN
function V1Minimal() {
  return (
    <section className="relative min-h-screen bg-black overflow-hidden">
      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300F6E0' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
        {/* Trust Chips */}
        <div className="flex items-center gap-3 mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1 border border-zinc-800 text-zinc-500 text-xs tracking-widest font-mono">
            <span className="w-1.5 h-1.5 bg-[#00F6E0] rounded-full animate-pulse" />
            ADAM HARRINGTON
          </span>
          <span className="text-zinc-700">/</span>
          <span className="text-zinc-600 text-xs tracking-widest font-mono">
            20+ YEARS NBA
          </span>
        </div>

        {/* Hero Split */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Typography */}
          <div className="space-y-8">
            <h1 className="text-white leading-none">
              <span
                className="block text-[clamp(3rem,8vw,7rem)] font-bold tracking-tight"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                SILENT
              </span>
              <span
                className="block text-[clamp(3rem,8vw,7rem)] font-bold tracking-tight text-[#00F6E0]"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                TRAINING
              </span>
            </h1>

            <p
              className="text-zinc-400 text-lg max-w-md leading-relaxed"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Build NBA-level shooting mechanics anywhere. No gym. No hoop. Just
              a ball and 4 square feet.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a
                href="#start"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#00F6E0] text-black font-semibold tracking-wide transition-all hover:bg-white"
              >
                <span>START PROTOCOL</span>
                <svg
                  className="w-4 h-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </a>
              <a
                href="#preview"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-zinc-800 text-zinc-400 font-medium tracking-wide transition-all hover:border-zinc-600 hover:text-white"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span>WATCH PREVIEW</span>
              </a>
            </div>

            {/* Micro-stats */}
            <div className="flex items-center gap-8 pt-8 border-t border-zinc-900">
              <div>
                <div
                  className="text-2xl font-bold text-white"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  12
                </div>
                <div className="text-xs text-zinc-600 tracking-wider">
                  DRILLS
                </div>
              </div>
              <div className="w-px h-8 bg-zinc-800" />
              <div>
                <div
                  className="text-2xl font-bold text-white"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  4
                </div>
                <div className="text-xs text-zinc-600 tracking-wider">
                  WEEKS
                </div>
              </div>
              <div className="w-px h-8 bg-zinc-800" />
              <div>
                <div
                  className="text-2xl font-bold text-white"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  0
                </div>
                <div className="text-xs text-zinc-600 tracking-wider">
                  HOOPS NEEDED
                </div>
              </div>
            </div>
          </div>

          {/* Right: Vertical Video */}
          <div className="relative">
            <div className="relative aspect-[9/16] max-w-sm mx-auto rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950">
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-950">
                <button className="w-16 h-16 rounded-full bg-[#00F6E0] flex items-center justify-center hover:scale-105 transition-transform">
                  <svg
                    className="w-6 h-6 text-black ml-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </div>
              {/* Corner anchors */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#00F6E0]" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#00F6E0]" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#00F6E0]" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#00F6E0]" />
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-black border border-zinc-800 text-xs text-zinc-500 tracking-widest font-mono">
              01:23 PREVIEW
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// V2: DATA-HEAVY / DASHBOARD
function V2Dashboard() {
  return (
    <section className="relative min-h-screen bg-[#030303] overflow-hidden">
      {/* Scanline effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,246,224,0.03) 2px, rgba(0,246,224,0.03) 4px)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-4 border-b border-zinc-800/50 mb-8">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="w-2 h-2 bg-[#00F6E0] rounded-full animate-pulse" />
              <span className="text-[#00F6E0]">LIVE</span>
            </div>
            <div className="text-zinc-600 text-xs font-mono">
              PROTOCOL: SILENT-TRAINING-V3.2
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-zinc-600 text-xs font-mono">
              CLEARANCE: PUBLIC
            </span>
            <span className="px-3 py-1 bg-[#00F6E0]/10 border border-[#00F6E0]/30 text-[#00F6E0] text-xs font-mono">
              ADAM HARRINGTON // NBA
            </span>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-[1fr_300px_300px] gap-6">
          {/* Column 1: Main Intel */}
          <div className="space-y-6">
            <div className="p-6 border border-zinc-800 bg-zinc-900/30">
              <div className="text-xs text-zinc-600 font-mono mb-4">
                // PROTOCOL DESIGNATION
              </div>
              <h1
                className="text-5xl font-bold text-white tracking-tight mb-4"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                SILENT TRAINING
              </h1>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-lg">
                Constraint-based basketball methodology. Removes auditory and
                environmental noise to isolate pure motor pattern development.
                Requires: 1 ball, 4 sq ft space.
              </p>
            </div>

            {/* Key Intel Bento Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border border-zinc-800 bg-zinc-900/20">
                <div className="text-xs text-[#00F6E0] font-mono mb-2">
                  DURATION
                </div>
                <div
                  className="text-3xl font-bold text-white"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  4 WEEKS
                </div>
                <div className="text-xs text-zinc-600 mt-1">
                  Progressive overload structure
                </div>
              </div>
              <div className="p-4 border border-zinc-800 bg-zinc-900/20">
                <div className="text-xs text-[#00F6E0] font-mono mb-2">
                  DRILL COUNT
                </div>
                <div
                  className="text-3xl font-bold text-white"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  12 CORE
                </div>
                <div className="text-xs text-zinc-600 mt-1">+ 24 variations</div>
              </div>
              <div className="p-4 border border-zinc-800 bg-zinc-900/20">
                <div className="text-xs text-[#00F6E0] font-mono mb-2">
                  EQUIPMENT
                </div>
                <div
                  className="text-3xl font-bold text-white"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  NEOBALL
                </div>
                <div className="text-xs text-zinc-600 mt-1">
                  Silent basketball (optional)
                </div>
              </div>
              <div className="p-4 border border-zinc-800 bg-zinc-900/20">
                <div className="text-xs text-[#00F6E0] font-mono mb-2">
                  DAILY COMMITMENT
                </div>
                <div
                  className="text-3xl font-bold text-white"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  15 MIN
                </div>
                <div className="text-xs text-zinc-600 mt-1">
                  Minimum effective dose
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex gap-4">
              <button className="flex-1 py-4 bg-[#00F6E0] text-black font-semibold tracking-wide text-sm hover:bg-white transition-colors">
                INITIATE PROTOCOL
              </button>
              <button className="px-6 py-4 border border-zinc-700 text-zinc-400 font-medium text-sm hover:border-zinc-500 hover:text-white transition-colors">
                METHODOLOGY
              </button>
            </div>
          </div>

          {/* Column 2: Video Feed */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-600 font-mono">
                // VIDEO FEED
              </span>
              <span className="text-xs text-[#00F6E0] font-mono">REC</span>
            </div>
            <div className="relative aspect-[9/14] bg-zinc-900 border border-zinc-800 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900">
                <svg
                  className="w-12 h-12 text-zinc-700"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-400">DRILL_001.MP4</span>
                  <span className="text-[#00F6E0]">01:23</span>
                </div>
              </div>
            </div>
            <div className="text-xs text-zinc-600 font-mono text-center">
              &quot;Remove the noise.&quot; — A. Harrington
            </div>
          </div>

          {/* Column 3: Session Builder */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-600 font-mono">
                // SESSION BUILDER
              </span>
              <span className="px-2 py-0.5 bg-[#FFD700]/20 border border-[#FFD700]/30 text-[#FFD700] text-[10px] font-mono">
                BETA
              </span>
            </div>
            <div className="border border-zinc-800 bg-zinc-900/30 p-4 space-y-4">
              <div>
                <label className="block text-xs text-zinc-500 font-mono mb-2">
                  TIME AVAILABLE
                </label>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 border border-zinc-700 text-zinc-400 text-sm hover:border-[#00F6E0] hover:text-[#00F6E0] transition-colors">
                    5m
                  </button>
                  <button className="flex-1 py-2 border border-[#00F6E0] text-[#00F6E0] text-sm bg-[#00F6E0]/10">
                    15m
                  </button>
                  <button className="flex-1 py-2 border border-zinc-700 text-zinc-400 text-sm hover:border-[#00F6E0] hover:text-[#00F6E0] transition-colors">
                    30m
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs text-zinc-500 font-mono mb-2">
                  FOCUS AREA
                </label>
                <select className="w-full py-2 px-3 bg-zinc-900 border border-zinc-700 text-zinc-300 text-sm focus:border-[#00F6E0] focus:outline-none">
                  <option>Shooting Form</option>
                  <option>Ball Control</option>
                  <option>Footwork</option>
                  <option>Full Protocol</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-zinc-500 font-mono mb-2">
                  SKILL LEVEL
                </label>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 border border-zinc-700 text-zinc-400 text-xs hover:border-[#00F6E0] hover:text-[#00F6E0] transition-colors">
                    BEGINNER
                  </button>
                  <button className="flex-1 py-2 border border-zinc-700 text-zinc-400 text-xs hover:border-[#00F6E0] hover:text-[#00F6E0] transition-colors">
                    INTER
                  </button>
                  <button className="flex-1 py-2 border border-[#00F6E0] text-[#00F6E0] text-xs bg-[#00F6E0]/10">
                    ADV
                  </button>
                </div>
              </div>
              <button className="w-full py-3 bg-[#FFD700] text-black font-semibold text-sm tracking-wide hover:bg-[#FFD700]/90 transition-colors">
                GENERATE SESSION
              </button>
              <div className="text-[10px] text-zinc-600 font-mono text-center">
                AI-powered drill sequencing
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// V3: VIDEO-FIRST / IMMERSIVE
function V3Immersive() {
  return (
    <section className="relative min-h-screen bg-black overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-zinc-900/50 to-zinc-800/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80" />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Trust bar */}
        <div className="py-4 px-6 border-b border-white/5">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00F6E0] to-[#00F6E0]/50 flex items-center justify-center border-2 border-[#00F6E0]">
                <span className="text-black font-bold text-sm">AH</span>
              </div>
              <div>
                <div className="text-white text-sm font-medium">
                  Adam Harrington
                </div>
                <div className="text-zinc-500 text-xs">
                  NBA/WNBA Skills Trainer • 20+ Years
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <span className="px-3 py-1 border border-zinc-700 text-zinc-400 text-xs font-mono">
                OKC THUNDER
              </span>
              <span className="px-3 py-1 border border-zinc-700 text-zinc-400 text-xs font-mono">
                BROOKLYN NETS
              </span>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center max-w-4xl">
            <div className="inline-flex items-center gap-3 mb-8">
              <span className="h-px w-12 bg-[#00F6E0]/50" />
              <span className="text-[#00F6E0] text-sm tracking-[0.3em] font-mono">
                CONSTRAINT-BASED TRAINING
              </span>
              <span className="h-px w-12 bg-[#00F6E0]/50" />
            </div>

            <h1 className="mb-8">
              <span
                className="block text-[clamp(4rem,12vw,10rem)] font-bold text-white leading-[0.9] tracking-tight"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                SILENT
              </span>
              <span
                className="block text-[clamp(4rem,12vw,10rem)] font-bold leading-[0.9] tracking-tight"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  background:
                    "linear-gradient(135deg, #00F6E0 0%, #00F6E0 50%, #FFD700 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                TRAINING
              </span>
            </h1>

            <p
              className="text-xl md:text-2xl text-zinc-300 max-w-2xl mx-auto mb-12 leading-relaxed"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              The gym is loud. Excellence is quiet.
              <br />
              <span className="text-zinc-500">
                Build elite mechanics anywhere.
              </span>
            </p>

            {/* Video CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
              <button className="group relative inline-flex items-center gap-4 px-10 py-5 bg-white text-black font-semibold tracking-wide text-lg transition-all hover:scale-105">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span>WATCH THE METHOD</span>
                <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-[#00F6E0] text-black text-xs font-mono">
                  1:23
                </span>
              </button>
              <a
                href="#start"
                className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
              >
                <span>Skip to protocol</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </a>
            </div>

            {/* Trust chips */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="px-4 py-2 bg-white/5 border border-white/10 text-zinc-400 text-sm backdrop-blur-sm">
                12 Core Drills
              </span>
              <span className="px-4 py-2 bg-white/5 border border-white/10 text-zinc-400 text-sm backdrop-blur-sm">
                No Hoop Required
              </span>
              <span className="px-4 py-2 bg-white/5 border border-white/10 text-zinc-400 text-sm backdrop-blur-sm">
                4 Square Feet
              </span>
              <span className="px-4 py-2 bg-[#00F6E0]/10 border border-[#00F6E0]/30 text-[#00F6E0] text-sm backdrop-blur-sm">
                FREE ACCESS
              </span>
            </div>
          </div>
        </div>

        {/* Video preview strip */}
        <div className="py-6 px-6 border-t border-white/5 bg-black/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 overflow-x-auto pb-2">
              <span className="text-zinc-600 text-xs font-mono shrink-0">
                PREVIEW:
              </span>
              <div className="flex gap-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="relative w-32 h-20 rounded overflow-hidden border border-white/10 shrink-0 cursor-pointer hover:border-[#00F6E0] transition-colors bg-zinc-900"
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-zinc-700"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <div className="absolute bottom-1 right-1 px-1 py-0.5 bg-black/80 text-[10px] text-white font-mono">
                      0:4{i + 4}
                    </div>
                  </div>
                ))}
                <div className="relative w-32 h-20 rounded overflow-hidden border border-[#00F6E0]/50 shrink-0 cursor-pointer bg-[#00F6E0]/10 flex items-center justify-center">
                  <span className="text-[#00F6E0] text-xs font-mono">
                    +9 MORE
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// V4: CARD-HEAVY / MODULAR
function V4Modular() {
  return (
    <section className="relative min-h-screen bg-[#0a0a0a] overflow-hidden py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header row */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-[#00F6E0] text-xs tracking-[0.3em] font-mono mb-2">
              PILLAR // 001
            </div>
            <h1
              className="text-5xl md:text-6xl font-bold text-white tracking-tight"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              SILENT TRAINING
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <span className="w-2 h-2 bg-[#00F6E0] rounded-full animate-pulse" />
            <span className="text-zinc-500 text-sm font-mono">
              Updated Jan 2026
            </span>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-12 gap-4">
          {/* Video Card */}
          <div className="col-span-12 md:col-span-5 row-span-2 relative rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900/50 group">
            <div className="aspect-[4/5] bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white ml-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
              <div className="text-xs text-[#00F6E0] font-mono mb-2">
                FEATURED DRILL
              </div>
              <div
                className="text-xl font-bold text-white mb-3"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                THE FOUNDATION SET
              </div>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black text-sm font-semibold hover:bg-[#00F6E0] transition-colors">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
                WATCH NOW
              </button>
            </div>
          </div>

          {/* Stats Card */}
          <div className="col-span-6 md:col-span-4 p-6 rounded-xl border border-zinc-800 bg-zinc-900/30">
            <div className="text-xs text-zinc-600 font-mono mb-4">
              // PROTOCOL STATS
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-baseline">
                <span className="text-zinc-500 text-sm">Drills</span>
                <span
                  className="text-2xl font-bold text-white"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  12
                </span>
              </div>
              <div className="h-px bg-zinc-800" />
              <div className="flex justify-between items-baseline">
                <span className="text-zinc-500 text-sm">Duration</span>
                <span
                  className="text-2xl font-bold text-white"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  4 WKS
                </span>
              </div>
              <div className="h-px bg-zinc-800" />
              <div className="flex justify-between items-baseline">
                <span className="text-zinc-500 text-sm">Daily Time</span>
                <span
                  className="text-2xl font-bold text-[#00F6E0]"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  15 MIN
                </span>
              </div>
            </div>
          </div>

          {/* Creator Badge */}
          <div className="col-span-6 md:col-span-3 p-6 rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-900/50">
            <div className="text-xs text-zinc-600 font-mono mb-4">
              // CREATED BY
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00F6E0] to-[#00F6E0]/50 flex items-center justify-center border-2 border-[#00F6E0]">
                <span className="text-black font-bold text-sm">AH</span>
              </div>
              <div>
                <div className="text-white font-semibold">Adam Harrington</div>
                <div className="text-zinc-500 text-xs">NBA Skills Trainer</div>
              </div>
            </div>
            <a
              href="/coaches/adam-harrington"
              className="inline-flex items-center gap-1 text-[#00F6E0] text-xs font-mono hover:underline"
            >
              VIEW PROFILE
              <svg
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </div>

          {/* Description */}
          <div className="col-span-12 md:col-span-4 p-6 rounded-xl border border-zinc-800 bg-zinc-900/30">
            <div className="text-xs text-zinc-600 font-mono mb-4">
              // METHODOLOGY
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed mb-4">
              Constraint-based training strips away environmental noise to
              isolate pure motor patterns. No gym, no hoop—just you, a ball, and
              focused repetition.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-zinc-800 text-zinc-500 text-xs rounded">
                Motor Learning
              </span>
              <span className="px-2 py-1 bg-zinc-800 text-zinc-500 text-xs rounded">
                Proprioception
              </span>
              <span className="px-2 py-1 bg-zinc-800 text-zinc-500 text-xs rounded">
                Biomechanics
              </span>
            </div>
          </div>

          {/* Equipment */}
          <div className="col-span-6 md:col-span-3 p-6 rounded-xl border border-[#FFD700]/30 bg-[#FFD700]/5">
            <div className="text-xs text-[#FFD700] font-mono mb-4">
              // EQUIPMENT
            </div>
            <div
              className="text-3xl font-bold text-white mb-2"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              NEOBALL
            </div>
            <p className="text-zinc-500 text-xs mb-4">
              Silent basketball for anywhere training
            </p>
            <button className="w-full py-2 border border-[#FFD700]/50 text-[#FFD700] text-xs font-mono hover:bg-[#FFD700]/10 transition-colors">
              GET YOURS →
            </button>
          </div>

          {/* CTA */}
          <div className="col-span-12 md:col-span-5 p-6 rounded-xl border border-[#00F6E0]/30 bg-gradient-to-br from-[#00F6E0]/10 to-transparent">
            <div className="flex items-center justify-between h-full">
              <div>
                <div className="text-xs text-[#00F6E0] font-mono mb-2">
                  // BEGIN TRAINING
                </div>
                <div
                  className="text-2xl font-bold text-white"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  START THE PROTOCOL
                </div>
                <p className="text-zinc-500 text-sm mt-1">
                  Free access • No account required
                </p>
              </div>
              <button className="px-8 py-4 bg-[#00F6E0] text-black font-semibold tracking-wide hover:bg-white transition-colors">
                BEGIN →
              </button>
            </div>
          </div>
        </div>

        {/* Drill Library */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <div className="text-xs text-zinc-600 font-mono">
              // DRILL LIBRARY
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 border border-[#00F6E0] text-[#00F6E0] text-xs font-mono">
                ALL
              </button>
              <button className="px-3 py-1 border border-zinc-700 text-zinc-500 text-xs font-mono hover:border-zinc-500">
                SHOOTING
              </button>
              <button className="px-3 py-1 border border-zinc-700 text-zinc-500 text-xs font-mono hover:border-zinc-500">
                HANDLES
              </button>
              <button className="px-3 py-1 border border-zinc-700 text-zinc-500 text-xs font-mono hover:border-zinc-500">
                FOOTWORK
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {["Set Position", "Release Point", "Balance", "Follow Through", "Rhythm"].map(
              (name, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900 relative group cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="text-white text-xs font-medium truncate">
                      {name}
                    </div>
                    <div className="text-zinc-500 text-[10px]">
                      0:{45 + i * 8}
                    </div>
                  </div>
                </div>
              )
            )}
            <div className="aspect-square rounded-lg overflow-hidden border border-[#00F6E0]/30 bg-[#00F6E0]/5 flex items-center justify-center cursor-pointer hover:bg-[#00F6E0]/10 transition-colors">
              <div className="text-center">
                <div
                  className="text-[#00F6E0] text-2xl font-bold"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  +7
                </div>
                <div className="text-[#00F6E0] text-xs font-mono">MORE</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// V5: GAMIFIED / ACHIEVEMENT-FOCUSED
function V5Gamified() {
  return (
    <section className="relative min-h-screen bg-black overflow-hidden">
      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#00F6E0]/10 via-black to-black" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Level indicator */}
        <div className="flex items-center justify-between mb-8 p-4 border border-zinc-800 bg-zinc-900/50 rounded-lg">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00F6E0] to-[#00F6E0]/50 flex items-center justify-center">
                <span
                  className="text-black font-bold text-lg"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  ST
                </span>
              </div>
              <div>
                <div
                  className="text-white font-bold"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  SILENT TRAINING
                </div>
                <div className="text-zinc-500 text-xs">
                  Protocol by Adam Harrington
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-zinc-500 text-xs">PROTOCOL XP</div>
              <div
                className="text-[#FFD700] font-bold"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                1,250 / 5,000
              </div>
            </div>
            <div className="w-32 h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#FFD700] to-[#00F6E0] rounded-full"
                style={{ width: "25%" }}
              />
            </div>
            <div className="px-3 py-1 bg-[#FFD700]/20 border border-[#FFD700]/30 text-[#FFD700] text-xs font-mono">
              RANK: INITIATE
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_400px] gap-8">
          {/* Main content */}
          <div className="space-y-8">
            {/* Hero card */}
            <div className="relative p-8 border border-zinc-800 bg-gradient-to-br from-zinc-900/80 to-zinc-900/30 rounded-xl overflow-hidden">
              <div className="absolute top-4 right-4 px-3 py-1 bg-[#00F6E0] text-black text-xs font-bold tracking-wide">
                FREE ACCESS
              </div>

              <div className="flex items-start gap-6">
                {/* Video thumbnail */}
                <div className="relative w-48 h-64 rounded-lg overflow-hidden border border-zinc-700 shrink-0 bg-gradient-to-br from-zinc-800 to-zinc-900">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white ml-0.5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
                    <span className="px-2 py-0.5 bg-black/80 text-[10px] text-white font-mono rounded">
                      PREVIEW
                    </span>
                    <span className="text-white text-xs font-mono">1:23</span>
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <div className="text-[#00F6E0] text-xs font-mono tracking-wider mb-2">
                      PILLAR PROTOCOL
                    </div>
                    <h1
                      className="text-4xl font-bold text-white tracking-tight"
                      style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                    >
                      SILENT TRAINING
                    </h1>
                  </div>

                  <p className="text-zinc-400 leading-relaxed">
                    Master NBA-level shooting mechanics without a gym or hoop.
                    Constraint-based training that builds elite motor patterns
                    through focused, silent repetition.
                  </p>

                  {/* Achievement preview */}
                  <div className="flex flex-wrap gap-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-800/50 border border-zinc-700 rounded-full">
                      <span className="text-lg">🎯</span>
                      <span className="text-zinc-400 text-xs">12 Drills</span>
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-800/50 border border-zinc-700 rounded-full">
                      <span className="text-lg">⚡</span>
                      <span className="text-zinc-400 text-xs">
                        4 Week Program
                      </span>
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-800/50 border border-zinc-700 rounded-full">
                      <span className="text-lg">🏆</span>
                      <span className="text-zinc-400 text-xs">
                        6 Achievements
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-2">
                    <button
                      className="px-8 py-4 bg-[#00F6E0] text-black font-bold tracking-wide text-lg hover:bg-white transition-colors"
                      style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                    >
                      START TRAINING
                    </button>
                    <button className="px-6 py-4 border border-zinc-700 text-zinc-400 font-medium hover:border-zinc-500 hover:text-white transition-colors">
                      View Curriculum
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Drill progression */}
            <div className="p-6 border border-zinc-800 bg-zinc-900/30 rounded-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-xs text-zinc-600 font-mono mb-1">
                    PROGRESSION TRACK
                  </div>
                  <div
                    className="text-lg font-bold text-white"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  >
                    WEEK 1: FOUNDATION
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-500 text-sm">0/3 Complete</span>
                  <div className="w-24 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#00F6E0] rounded-full"
                      style={{ width: "0%" }}
                    />
                  </div>
                </div>
              </div>

              {/* Drill cards */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="group relative p-4 border border-zinc-700 bg-zinc-900/50 rounded-lg cursor-pointer hover:border-[#00F6E0] transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                      <span className="text-xl">🎯</span>
                    </div>
                    <span className="px-2 py-0.5 bg-zinc-800 text-zinc-500 text-[10px] font-mono rounded">
                      +100 XP
                    </span>
                  </div>
                  <div className="text-white font-semibold mb-1">
                    Set Position
                  </div>
                  <div className="text-zinc-500 text-xs mb-3">
                    Master your shooting stance
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-600 text-xs">0:45</span>
                    <span className="text-[#00F6E0] text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                      START →
                    </span>
                  </div>
                </div>

                <div className="relative p-4 border border-zinc-800 bg-zinc-900/30 rounded-lg">
                  <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl mb-1">🔒</div>
                      <div className="text-zinc-500 text-xs">
                        Complete &quot;Set Position&quot;
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start justify-between mb-3 opacity-50">
                    <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                      <span className="text-xl">✋</span>
                    </div>
                    <span className="px-2 py-0.5 bg-zinc-800 text-zinc-500 text-[10px] font-mono rounded">
                      +150 XP
                    </span>
                  </div>
                  <div className="text-white font-semibold mb-1 opacity-50">
                    Release Point
                  </div>
                  <div className="text-zinc-500 text-xs opacity-50">
                    Perfect your follow-through
                  </div>
                </div>

                <div className="relative p-4 border border-zinc-800 bg-zinc-900/30 rounded-lg">
                  <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl mb-1">🔒</div>
                      <div className="text-zinc-500 text-xs">
                        Complete &quot;Release Point&quot;
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start justify-between mb-3 opacity-50">
                    <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                      <span className="text-xl">⚖️</span>
                    </div>
                    <span className="px-2 py-0.5 bg-zinc-800 text-zinc-500 text-[10px] font-mono rounded">
                      +150 XP
                    </span>
                  </div>
                  <div className="text-white font-semibold mb-1 opacity-50">
                    Balance Drill
                  </div>
                  <div className="text-zinc-500 text-xs opacity-50">
                    Find your center
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick session */}
            <div className="p-6 border border-[#00F6E0]/30 bg-[#00F6E0]/5 rounded-xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">⚡</span>
                <span
                  className="text-white font-bold"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  QUICK SESSION
                </span>
              </div>
              <p className="text-zinc-400 text-sm mb-4">
                Generate a personalized training session based on your time and
                goals.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">
                    I have...
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button className="py-2 border border-zinc-700 text-zinc-400 text-sm rounded hover:border-[#00F6E0] hover:text-[#00F6E0] transition-colors">
                      5 min
                    </button>
                    <button className="py-2 border border-[#00F6E0] text-[#00F6E0] text-sm rounded bg-[#00F6E0]/10">
                      15 min
                    </button>
                    <button className="py-2 border border-zinc-700 text-zinc-400 text-sm rounded hover:border-[#00F6E0] hover:text-[#00F6E0] transition-colors">
                      30 min
                    </button>
                  </div>
                </div>
                <button className="w-full py-3 bg-[#00F6E0] text-black font-bold tracking-wide hover:bg-white transition-colors">
                  GENERATE SESSION
                </button>
              </div>
            </div>

            {/* Achievements */}
            <div className="p-6 border border-zinc-800 bg-zinc-900/30 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🏆</span>
                  <span
                    className="text-white font-bold"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  >
                    ACHIEVEMENTS
                  </span>
                </div>
                <span className="text-zinc-600 text-xs">0/6 Unlocked</span>
              </div>

              <div className="space-y-3">
                {[
                  {
                    icon: "🌅",
                    name: "First Light",
                    desc: "Complete your first drill",
                    xp: 50,
                  },
                  {
                    icon: "🔥",
                    name: "On Fire",
                    desc: "7-day training streak",
                    xp: 200,
                  },
                  {
                    icon: "🎓",
                    name: "Graduate",
                    desc: "Complete Week 1",
                    xp: 500,
                  },
                ].map((achievement, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 border border-zinc-800 bg-zinc-900/50 rounded-lg opacity-60"
                  >
                    <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center grayscale">
                      <span className="text-xl">{achievement.icon}</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-zinc-400 font-medium text-sm">
                        {achievement.name}
                      </div>
                      <div className="text-zinc-600 text-xs">
                        {achievement.desc}
                      </div>
                    </div>
                    <div className="text-[#FFD700] text-xs font-mono">
                      +{achievement.xp} XP
                    </div>
                  </div>
                ))}
              </div>

              <a
                href="#all-achievements"
                className="block mt-4 text-center text-[#00F6E0] text-sm font-mono hover:underline"
              >
                View All Achievements →
              </a>
            </div>

            {/* Coach card */}
            <div className="p-6 border border-zinc-800 bg-zinc-900/30 rounded-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#00F6E0] to-[#00F6E0]/50 flex items-center justify-center border-2 border-[#00F6E0]">
                  <span className="text-black font-bold">AH</span>
                </div>
                <div>
                  <div className="text-white font-bold">Adam Harrington</div>
                  <div className="text-zinc-500 text-sm">
                    NBA/WNBA Skills Trainer
                  </div>
                </div>
              </div>
              <p className="text-zinc-400 text-sm italic mb-4">
                &quot;Remove the noise. Focus on the signal.&quot;
              </p>
              <a
                href="/coaches/adam-harrington"
                className="inline-flex items-center gap-2 text-[#00F6E0] text-sm font-mono hover:underline"
              >
                View Full Profile
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Variation selector
const variations = [
  { id: "v1", name: "V1: Minimal", component: V1Minimal },
  { id: "v2", name: "V2: Dashboard", component: V2Dashboard },
  { id: "v3", name: "V3: Immersive", component: V3Immersive },
  { id: "v4", name: "V4: Modular", component: V4Modular },
  { id: "v5", name: "V5: Gamified", component: V5Gamified },
];

export default function HeroLabPage() {
  const [activeVariation, setActiveVariation] = useState("v1");

  const ActiveComponent =
    variations.find((v) => v.id === activeVariation)?.component || V1Minimal;

  return (
    <div className="min-h-screen bg-black">
      {/* Sticky variation selector */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[#00F6E0] text-xs font-mono">
                HERO LAB
              </span>
              <span className="text-zinc-600">/</span>
              <span className="text-zinc-400 text-sm">Silent Training</span>
            </div>
            <div className="flex gap-2">
              {variations.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setActiveVariation(v.id)}
                  className={`px-4 py-2 text-xs font-mono transition-colors ${
                    activeVariation === v.id
                      ? "bg-[#00F6E0] text-black"
                      : "border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white"
                  }`}
                >
                  {v.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Active variation */}
      <div className="pt-16">
        <ActiveComponent />
      </div>
    </div>
  );
}

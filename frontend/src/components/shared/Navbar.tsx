"use client";

import React from "react";
import { 
  Compass, 
  Database, 
  Globe, 
  Mountain, 
  ShieldCheck, 
  Activity, 
  ExternalLink,
  ChevronRight,
  Radio,
  Box,
  Layers,
  Sparkles,
  ArrowRight
} from "lucide-react";

interface NavbarProps {
  currentView: "landing" | "workspace";
  onNavigate: (view: "landing" | "workspace") => void;
  activeSite: "jezero" | "gale";
  onSiteChange: (site: "jezero" | "gale") => void;
  onOpenProvenance: () => void;
  onOpen3D?: () => void;
}

export default function Navbar({
  currentView,
  onNavigate,
  activeSite,
  onSiteChange,
  onOpenProvenance,
  onOpen3D
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full shadow-2xl">
      {/* 1. Official NASA Space Apps Challenge Announcement Banner (Lime/Yellow per Reference) */}
      <div className="w-full bg-[#D4FF00] text-[#0A1628] px-4 sm:px-6 py-1.5 text-[11px] font-mono font-black flex items-center justify-between gap-3 shadow-inner select-none">
        <div className="flex items-center gap-2 tracking-wide uppercase">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0A1628] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0A1628]" />
          </span>
          <span>✦ THE 2026 NASA SPACE APPS CHALLENGE IS LIVE</span>
          <span className="text-black/30 hidden sm:inline">|</span>
          <span className="hidden sm:inline font-bold">
            INTERPLANETARY SURVIVAL GUIDE: MARTIAN MAP (TEAM MARSATLAS)
          </span>
        </div>
        
        <div className="flex items-center gap-3 text-[10px] uppercase font-bold">
          <span className="hidden md:inline text-black/70">GLOBAL HACKATHON EDITION</span>
          <a
            href="https://www.spaceappschallenge.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 underline underline-offset-2 hover:opacity-80 transition-opacity"
          >
            <span>SPACEAPPSCHALLENGE.ORG</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* 2. Top Government & Mission Telemetry Ribbon */}
      <div className="w-full bg-[#051336] border-b border-[#1E4E9E]/40 px-4 sm:px-6 py-1 text-[10px] font-mono text-[#94A3B8] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="flex items-center gap-1.5 text-[#38BDF8]">
            <Radio className="w-3 h-3 text-[#38BDF8] animate-pulse" />
            <span className="font-semibold tracking-wider uppercase text-white">ORBITAL TELEMETRY</span>
          </span>
          <span className="hidden sm:inline text-white/20">|</span>
          <span className="hidden sm:inline text-[#CBD5E1]">PROJECTION: EPSG:104905 [MARS IAU2000]</span>
          <span className="hidden md:inline text-white/20">|</span>
          <span className="hidden md:inline text-[#CBD5E1]">RAD DOSIMETRY: 0.560 mSv/SOL (GALE RAD PROXY)</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[#34D399] font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-ping" />
            <span className="font-mono text-[10px] text-white">FASTAPI ENGINE: ACTIVE</span>
          </span>
          <span className="text-white/20">|</span>
          <span className="text-[#94A3B8]">RESEARCH PROTOTYPE</span>
        </div>
      </div>

      {/* 3. Main NASA Space Blue Navigation Bar (Authentic #0B3D91 Palette) */}
      <div className="w-full bg-[#0B3D91]/95 border-b border-[#1E4E9E] backdrop-blur-xl">
        <div className="max-w-[1850px] mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
          
          {/* Brand & Mission Emblem */}
          <div 
            onClick={() => onNavigate("landing")}
            className="flex items-center gap-3.5 cursor-pointer group select-none"
          >
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 bg-[#D4FF00]/25 rounded-full blur-md group-hover:bg-[#D4FF00]/45 transition-all" />
              <img
                src="/marsatlas-brand.jpg"
                alt="MarsAtlas Emblem"
                className="relative w-9 h-9 rounded-full object-cover border-2 border-white/60 shadow-md shadow-black/40 transform group-hover:scale-105 transition-transform"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-wider text-white font-sans">
                  MARS<span className="text-[#D4FF00]">ATLAS</span>
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/15 text-white border border-white/25 tracking-wide uppercase">
                  EVA COPILOT
                </span>
              </div>
              <p className="text-[10px] text-blue-100 tracking-tight">
                Planetary Geospatial Intelligence &amp; Traverse Decision Support
              </p>
            </div>
          </div>

          {/* Operational Study Site Switcher (NASA Segmented Control) */}
          <div className="flex items-center bg-[#072460] p-1 rounded-xl border border-white/15 shadow-inner text-xs">
            <button
              onClick={() => {
                onSiteChange("jezero");
                onNavigate("workspace");
              }}
              className={`px-3.5 py-1.5 rounded-lg font-medium flex items-center gap-2 transition-all ${
                activeSite === "jezero"
                  ? "bg-[#D4FF00] text-[#0A1628] font-bold shadow-md shadow-[#D4FF00]/30"
                  : "text-blue-100 hover:text-white hover:bg-white/10"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span className="tracking-wide">SITE 01: JEZERO DELTA</span>
            </button>

            <button
              onClick={() => {
                onSiteChange("gale");
                onNavigate("workspace");
              }}
              className={`px-3.5 py-1.5 rounded-lg font-medium flex items-center gap-2 transition-all ${
                activeSite === "gale"
                  ? "bg-[#38BDF8] text-[#04070D] font-bold shadow-md shadow-[#38BDF8]/30"
                  : "text-blue-100 hover:text-white hover:bg-white/10"
              }`}
            >
              <Mountain className="w-3.5 h-3.5" />
              <span className="tracking-wide">SITE 02: MOUNT SHARP BOXWORK</span>
            </button>
          </div>

          {/* Navigation Action Buttons */}
          <div className="flex items-center gap-2 text-xs">
            {/* 3D Sector Viewer Trigger */}
            {onOpen3D && (
              <button
                onClick={onOpen3D}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-semibold border border-white/20 bg-white/10 hover:bg-white/20 text-white transition-all shadow-sm"
                title="Launch 3D WebGL Topographic Sector Viewer"
              >
                <Mountain className="w-4 h-4 text-[#38BDF8]" />
                <span className="hidden md:inline font-mono text-[11px]">3D Sector Model</span>
              </button>
            )}

            {/* Primary Action Button (Vibrant Space Apps Lime CTA) */}
            <button
              onClick={() => onNavigate(currentView === "landing" ? "workspace" : "landing")}
              className="px-4 py-2 rounded-xl font-black bg-[#D4FF00] hover:bg-[#c2eb00] text-[#0A1628] transition-all shadow-md shadow-[#D4FF00]/30 flex items-center gap-1.5 uppercase text-xs tracking-wider"
            >
              <Activity className="w-4 h-4 text-[#0A1628]" />
              <span>{currentView === "landing" ? "Explore Console" : "Mission Overview"}</span>
            </button>

            {/* Data Provenance Matrix Modal Trigger */}
            <button
              onClick={onOpenProvenance}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-semibold border border-white/20 bg-white/10 hover:bg-white/20 text-white transition-all"
              title="Inspect 4-Tier Epistemic Matrix (USGS / NASA PDS)"
            >
              <ShieldCheck className="w-4 h-4 text-[#34D399]" />
              <span className="hidden xl:inline tracking-tight font-medium">Data Provenance</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

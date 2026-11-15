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
      {/* 1. Top Mission Telemetry Bar */}
      <div className="w-full bg-[#050C1C] border-b border-white/[0.08] px-4 sm:px-6 py-1.5 text-xs font-sans text-slate-300 flex flex-wrap items-center justify-between gap-2 select-none">
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="flex items-center gap-1.5 text-[#FC3D21]">
            <Radio className="w-3.5 h-3.5 text-[#FC3D21] animate-pulse" />
            <span className="font-bold tracking-wider uppercase text-white">NASA SPACE APPS 2026</span>
          </span>
          <span className="hidden sm:inline text-white/20">|</span>
          <span className="hidden sm:inline text-slate-300 font-mono text-xs">PROJECTION: EPSG:104905 [MARS IAU2000]</span>
          <span className="hidden md:inline text-white/20">|</span>
          <span className="hidden md:inline text-slate-300 font-mono text-xs">RAD DOSIMETRY: 0.560 mSv/SOL (GALE PROXY)</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[#34D399] font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#34D399] animate-ping" />
            <span className="font-bold text-xs text-white">FASTAPI ENGINE: ACTIVE</span>
          </span>
          <span className="text-white/20">|</span>
          <span className="text-slate-300 font-semibold text-xs">RESEARCH PROTOTYPE</span>
        </div>
      </div>

      {/* 2. Main Aerospace Navigation Bar */}
      <div className="w-full bg-[#070F22]/95 border-b border-white/[0.1] backdrop-blur-xl">
        <div className="max-w-[1850px] mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
          
          {/* Brand & Mission Emblem */}
          <div 
            onClick={() => onNavigate("landing")}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 bg-[#FC3D21]/20 rounded-full blur-md group-hover:bg-[#FC3D21]/40 transition-all" />
              <img
                src="/marsatlas-brand.jpg"
                alt="MarsAtlas Emblem"
                className="relative w-9 h-9 rounded-full object-cover border border-[#FC3D21]/50 shadow-md transform group-hover:scale-105 transition-transform"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-wider text-white font-sans">
                  MARS<span className="text-[#FC3D21]">ATLAS</span>
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#FC3D21]/15 text-[#FC3D21] border border-[#FC3D21]/30 tracking-wide uppercase font-sans">
                  EVA COPILOT
                </span>
              </div>
              <p className="text-xs text-slate-300 tracking-tight font-sans">
                Planetary Geospatial Intelligence &amp; Traverse Decision Support
              </p>
            </div>
          </div>

          {/* Operational Study Site Switcher (NASA Segmented Control) */}
          <div className="flex items-center bg-[#050C1C] p-1 rounded-xl border border-white/10 shadow-inner text-xs font-sans">
            <button
              onClick={() => {
                onSiteChange("jezero");
                onNavigate("workspace");
              }}
              className={`px-3 sm:px-3.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 sm:gap-2 transition-all ${
                activeSite === "jezero"
                  ? "bg-[#FC3D21] text-white font-bold shadow-md shadow-[#FC3D21]/30"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span className="tracking-wide hidden sm:inline">SITE 01: JEZERO DELTA</span>
              <span className="tracking-wide sm:hidden text-xs">JEZERO</span>
            </button>

            <button
              onClick={() => {
                onSiteChange("gale");
                onNavigate("workspace");
              }}
              className={`px-3 sm:px-3.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 sm:gap-2 transition-all ${
                activeSite === "gale"
                  ? "bg-[#38BDF8] text-[#04070D] font-bold shadow-md shadow-[#38BDF8]/30"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <Mountain className="w-3.5 h-3.5" />
              <span className="tracking-wide hidden sm:inline">SITE 02: MOUNT SHARP BOXWORK</span>
              <span className="tracking-wide sm:hidden text-xs">GALE</span>
            </button>
          </div>

          {/* Navigation Action Buttons */}
          <div className="flex items-center gap-2 text-xs font-sans">
            {/* 3D Sector Viewer Trigger */}
            {onOpen3D && (
              <button
                onClick={onOpen3D}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold border border-white/15 bg-white/5 hover:bg-white/15 text-white transition-all shadow-sm"
                title="Launch 3D WebGL Topographic Sector Viewer"
              >
                <Mountain className="w-4 h-4 text-[#38BDF8]" />
                <span className="hidden md:inline text-xs font-bold">3D Sector Model</span>
              </button>
            )}

            {/* Primary Action Button */}
            <button
              onClick={() => onNavigate(currentView === "landing" ? "workspace" : "landing")}
              className="px-3 sm:px-4 py-2 rounded-xl font-bold bg-[#FC3D21] hover:bg-[#E0341B] text-white transition-all shadow-md shadow-[#FC3D21]/30 flex items-center gap-1.5 uppercase text-xs tracking-wider"
            >
              <Activity className="w-4 h-4 text-white" />
              <span className="hidden sm:inline">{currentView === "landing" ? "Launch Mission Console" : "Mission Overview"}</span>
              <span className="sm:hidden">{currentView === "landing" ? "Console" : "Overview"}</span>
            </button>

            {/* Data Provenance Matrix Modal Trigger */}
            <button
              onClick={onOpenProvenance}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-semibold border border-[#38BDF8]/30 bg-[#38BDF8]/10 hover:bg-[#38BDF8]/20 text-[#38BDF8] transition-all"
              title="Inspect 4-Tier Epistemic Matrix (USGS / NASA PDS)"
            >
              <ShieldCheck className="w-4 h-4 text-[#38BDF8]" />
              <span className="hidden xl:inline tracking-tight font-medium">Data Provenance</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

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
  Sparkles
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
    <header className="sticky top-0 z-40 w-full bg-[#04070D]/95 border-b border-white/[0.08] backdrop-blur-xl">
      {/* Top Government & Mission Telemetry Ribbon */}
      <div className="w-full bg-[#070B14] border-b border-white/[0.05] px-4 sm:px-6 py-1 text-[10px] font-mono text-[#64748B] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="flex items-center gap-1.5 text-[#FC3D21]">
            <Radio className="w-3 h-3 text-[#FC3D21] animate-pulse" />
            <span className="font-semibold tracking-wider uppercase">NASA SPACE APPS CHALLENGE 2026</span>
          </span>
          <span className="hidden sm:inline text-white/20">|</span>
          <span className="hidden sm:inline text-[#94A3B8]">PROJECTION: EPSG:104905 [MARS IAU2000]</span>
          <span className="hidden md:inline text-white/20">|</span>
          <span className="hidden md:inline text-[#94A3B8]">RAD DOSIMETRY: 0.560 mSv/SOL (GALE RAD PROXY)</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[#34D399] font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-ping" />
            <span>FASTAPI SERVER: ACTIVE</span>
          </span>
          <span className="text-white/20">|</span>
          <span className="text-slate-400">RESEARCH PROTOTYPE</span>
        </div>
      </div>

      {/* Main Agency Navigation Bar */}
      <div className="max-w-[1850px] mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Brand & Project Identity */}
        <div 
          onClick={() => onNavigate("landing")}
          className="flex items-center gap-3.5 cursor-pointer group select-none"
        >
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 bg-[#FC3D21]/20 rounded-full blur-md group-hover:bg-[#FC3D21]/40 transition-all" />
            <img
              src="/marsatlas-brand.jpg"
              alt="MarsAtlas Insignia"
              className="relative w-9 h-9 rounded-full object-cover border border-[#FC3D21]/50 shadow-md shadow-[#FC3D21]/25 transform group-hover:scale-105 transition-transform"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-wider text-white font-sans">
                MARS<span className="text-[#FC3D21]">ATLAS</span>
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#FC3D21]/15 text-[#FC3D21] border border-[#FC3D21]/30 tracking-wide uppercase">
                EVA COPILOT
              </span>
            </div>
            <p className="text-[10px] text-[#94A3B8] tracking-tight">
              Planetary Geospatial Intelligence &amp; Traverse Decision Support
            </p>
          </div>
        </div>

        {/* Operational Study Site Switcher (NASA Mission Segmented Control) */}
        <div className="flex items-center bg-[#0C1220] p-1 rounded-xl border border-white/[0.08] shadow-inner text-xs">
          <button
            onClick={() => {
              onSiteChange("jezero");
              onNavigate("workspace");
            }}
            className={`px-3.5 py-1.5 rounded-lg font-medium flex items-center gap-2 transition-all ${
              activeSite === "jezero"
                ? "bg-[#FC3D21] text-white font-bold shadow-md shadow-[#FC3D21]/30"
                : "text-[#94A3B8] hover:text-white hover:bg-white/[0.03]"
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
                : "text-[#94A3B8] hover:text-white hover:bg-white/[0.03]"
            }`}
          >
            <Mountain className="w-3.5 h-3.5" />
            <span className="tracking-wide">SITE 02: MOUNT SHARP BOXWORK</span>
          </button>
        </div>

        {/* Global Operational Action Controls */}
        <div className="flex items-center gap-2 text-xs">
          {/* 3D Sector Viewer Trigger */}
          {onOpen3D && (
            <button
              onClick={onOpen3D}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-semibold border border-white/[0.1] bg-[#0C1220] hover:bg-[#162034] text-white hover:border-[#38BDF8]/50 transition-all shadow-sm"
              title="Launch 3D WebGL Topographic Sector Viewer"
            >
              <Mountain className="w-4 h-4 text-[#38BDF8]" />
              <span className="hidden md:inline font-mono text-[11px]">3D Sector Model</span>
            </button>
          )}

          {/* Primary View Switcher */}
          <button
            onClick={() => onNavigate(currentView === "landing" ? "workspace" : "landing")}
            className="px-4 py-2 rounded-xl font-bold bg-[#FC3D21] hover:bg-[#d62d16] text-white transition-all shadow-md shadow-[#FC3D21]/25 flex items-center gap-1.5"
          >
            <Activity className="w-4 h-4" />
            <span>{currentView === "landing" ? "Launch Mission Console" : "Mission Overview"}</span>
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
    </header>
  );
}

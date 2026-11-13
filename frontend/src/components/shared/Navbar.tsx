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
  Radio
} from "lucide-react";

interface NavbarProps {
  currentView: "landing" | "workspace";
  onNavigate: (view: "landing" | "workspace") => void;
  activeSite: "jezero" | "gale";
  onSiteChange: (site: "jezero" | "gale") => void;
  onOpenProvenance: () => void;
}

export default function Navbar({
  currentView,
  onNavigate,
  activeSite,
  onSiteChange,
  onOpenProvenance
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#04070D]/90 border-b border-white/[0.08] backdrop-blur-xl">
      {/* Top Hairline Telemetry Ribbon */}
      <div className="w-full bg-[#070B14] border-b border-white/[0.04] px-4 py-1 text-[10px] font-mono text-[#64748B] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-[#38BDF8]">
            <Radio className="w-3 h-3 text-[#38BDF8] animate-pulse" />
            <span className="font-semibold tracking-wider">MARS 2020 & MSL ORBITAL/SURFACE TELEMETRY</span>
          </span>
          <span className="hidden sm:inline text-white/20">|</span>
          <span className="hidden sm:inline">PROJECTION: EPSG:104905 [MARS IAU2000]</span>
          <span className="hidden md:inline text-white/20">|</span>
          <span className="hidden md:inline">RAD DOSIMETRY: 0.560 mSv/SOL</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[#34D399] font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]" />
            FASTAPI RUNTIME: ONLINE
          </span>
          <span className="text-white/20">|</span>
          <span>CHALLENGE: SPACE APPS 2026</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Brand & Mission Identifier */}
        <div 
          onClick={() => onNavigate("landing")}
          className="flex items-center gap-3.5 cursor-pointer group select-none"
        >
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 bg-[#F36C3D]/25 rounded-full blur-md group-hover:bg-[#F36C3D]/40 transition-all" />
            <img
              src="/marsatlas-brand.jpg"
              alt="MarsAtlas Emblem"
              className="relative w-9 h-9 rounded-full object-cover border border-[#F36C3D]/50 shadow-md shadow-[#F36C3D]/20 transform group-hover:scale-105 transition-transform"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-wider text-white font-sans">
                MARS<span className="text-[#F36C3D]">ATLAS</span>
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#F36C3D]/10 text-[#F36C3D] border border-[#F36C3D]/25 tracking-wide">
                EVA COPILOT
              </span>
            </div>
            <p className="text-[10px] text-[#94A3B8] tracking-tight">
              Planetary Geospatial Intelligence &amp; Traverse Decision Support
            </p>
          </div>
        </div>

        {/* Site Preset Switcher (Segmented Control like JPL AMMOS) */}
        <div className="flex items-center bg-[#0C1220] p-1 rounded-xl border border-white/[0.08] shadow-inner text-xs">
          <button
            onClick={() => {
              onSiteChange("jezero");
              onNavigate("workspace");
            }}
            className={`px-3.5 py-1.5 rounded-lg font-medium flex items-center gap-2 transition-all ${
              activeSite === "jezero"
                ? "bg-[#F36C3D] text-white font-bold shadow-md shadow-[#F36C3D]/25"
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
                ? "bg-[#38BDF8] text-[#04070D] font-bold shadow-md shadow-[#38BDF8]/25"
                : "text-[#94A3B8] hover:text-white hover:bg-white/[0.03]"
            }`}
          >
            <Mountain className="w-3.5 h-3.5" />
            <span className="tracking-wide">SITE 02: MOUNT SHARP BOXWORK</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 text-xs">
          <button
            onClick={() => onNavigate(currentView === "landing" ? "workspace" : "landing")}
            className="px-4 py-2 rounded-lg font-semibold border border-white/[0.1] bg-[#0C1220] hover:bg-[#162034] text-white transition-all shadow-sm"
          >
            {currentView === "landing" ? "Launch Mission Console" : "Mission Overview"}
          </button>

          <button
            onClick={onOpenProvenance}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg font-semibold border border-[#38BDF8]/30 bg-[#38BDF8]/10 hover:bg-[#38BDF8]/20 text-[#38BDF8] transition-all"
            title="Inspect 4-Tier Epistemic Provenance (USGS / NASA PDS)"
          >
            <ShieldCheck className="w-4 h-4 text-[#38BDF8]" />
            <span className="hidden lg:inline tracking-tight font-medium">Data Provenance</span>
          </button>
        </div>
      </div>
    </header>
  );
}

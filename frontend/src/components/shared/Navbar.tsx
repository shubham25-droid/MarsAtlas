"use client";

import React from "react";
import { Compass, Database, Globe, Mountain, ArrowRight, ShieldCheck } from "lucide-react";

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
    <header className="sticky top-0 z-40 w-full bg-[#070A10]/95 border-b border-[#1E293B] backdrop-blur-md px-4 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand Logo & Name */}
        <div 
          onClick={() => onNavigate("landing")}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <img
            src="/assets/logo.png"
            alt="MarsAtlas Logo"
            className="w-8 h-8 object-contain transition-transform group-hover:scale-105"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black tracking-wider text-white">
                MARS<span className="text-[#E46A43]">ATLAS</span>
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#E46A43]/10 text-[#E46A43] border border-[#E46A43]/20">
                NASA SPACE APPS 2026
              </span>
            </div>
            <p className="text-[10px] text-[#A0ACB9] hidden sm:block">
              Interplanetary Survival Guide: Martian Map
            </p>
          </div>
        </div>

        {/* Site Preset Switcher */}
        <div className="flex items-center bg-[#131B26] p-1 rounded-xl border border-[#1E293B] text-xs">
          <button
            onClick={() => {
              onSiteChange("jezero");
              onNavigate("workspace");
            }}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
              activeSite === "jezero"
                ? "bg-[#E46A43] text-white font-bold shadow-md"
                : "text-[#A0ACB9] hover:text-white"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Site A: Jezero Delta</span>
          </button>

          <button
            onClick={() => {
              onSiteChange("gale");
              onNavigate("workspace");
            }}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
              activeSite === "gale"
                ? "bg-[#5CC8D7] text-[#070A10] font-bold shadow-md"
                : "text-[#A0ACB9] hover:text-white"
            }`}
          >
            <Mountain className="w-3.5 h-3.5" />
            <span>Site B: Mount Sharp Boxwork</span>
          </button>
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => onNavigate(currentView === "landing" ? "workspace" : "landing")}
            className="px-3 py-1.5 rounded-lg font-semibold border border-[#1E293B] bg-[#131B26] hover:bg-[#1E293B] text-[#F3F5F7] transition-colors"
          >
            {currentView === "landing" ? "Enter EVA Console" : "Mission Overview"}
          </button>

          <button
            onClick={onOpenProvenance}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold border border-[#5CC8D7]/30 bg-[#5CC8D7]/10 hover:bg-[#5CC8D7]/20 text-[#5CC8D7] transition-colors"
            title="View NASA Data Provenance & Epistemic Tiers"
          >
            <ShieldCheck className="w-4 h-4 text-[#5CC8D7]" />
            <span className="hidden md:inline">Data Provenance</span>
          </button>

          {/* Engine Status Ping */}
          <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-[#1E293B] text-[11px] text-[#A0ACB9]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#62C99B] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#62C99B]"></span>
            </span>
            <span className="font-mono text-white">FastAPI: ONLINE</span>
          </div>
        </div>
      </div>
    </header>
  );
}

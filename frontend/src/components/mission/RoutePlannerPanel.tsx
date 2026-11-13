"use client";

import React, { useState } from "react";
import { 
  Play, 
  MapPin, 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  RotateCcw, 
  Activity,
  Layers,
  ArrowRight
} from "lucide-react";

interface RoutePlannerPanelProps {
  startPoint: [number, number];
  targetPoint: [number, number];
  selectedMode: string;
  onModeChange: (mode: string) => void;
  onComputeRoute: () => void;
  isComputing: boolean;
  onApplyPreset: (start: [number, number], target: [number, number]) => void;
  onOpenBriefing: () => void;
  hasRoute: boolean;
}

export default function RoutePlannerPanel({
  startPoint,
  targetPoint,
  selectedMode,
  onModeChange,
  onComputeRoute,
  isComputing,
  onApplyPreset,
  onOpenBriefing,
  hasRoute
}: RoutePlannerPanelProps) {
  const PRESETS = [
    {
      name: "Delta Front Scarp Traverse",
      desc: "Base -> Cape Flatley Delta Contact",
      start: [77.4509, 18.4446] as [number, number],
      target: [77.4018, 18.4532] as [number, number]
    },
    {
      name: "Margin Carbonate Rim Excursion",
      desc: "Base -> Lac de Charmes Carbonate Bench",
      start: [77.4509, 18.4446] as [number, number],
      target: [77.3482, 18.4591] as [number, number]
    },
    {
      name: "Séítah Olivine Pavement Survey",
      desc: "Base -> Dourbes Ridge Bedrock",
      start: [77.4509, 18.4446] as [number, number],
      target: [77.4439, 18.4412] as [number, number]
    }
  ];

  return (
    <div className="bg-[#0D121B] border border-[#1E293B] rounded-xl p-4 flex flex-col gap-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#E46A43]" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            EVA Traverse Planner
          </h3>
        </div>
        <span className="text-[10px] font-mono text-[#5CC8D7] bg-[#5CC8D7]/10 px-2 py-0.5 rounded border border-[#5CC8D7]/30">
          NASA CSRM Solver
        </span>
      </div>

      {/* Trajectory Endpoints */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-[#131B26] p-2.5 rounded-lg border border-[#1E293B]">
          <div className="flex items-center gap-1.5 text-[#62C99B] font-semibold mb-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>Departure Base</span>
          </div>
          <div className="font-mono text-white text-[11px]">
            {startPoint[0].toFixed(4)}°E, {startPoint[1].toFixed(4)}°N
          </div>
          <div className="text-[10px] text-[#A0ACB9] mt-0.5">Octavia E. Butler Site</div>
        </div>

        <div className="bg-[#131B26] p-2.5 rounded-lg border border-[#1E293B]">
          <div className="flex items-center gap-1.5 text-[#E46A43] font-semibold mb-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>Science Destination</span>
          </div>
          <div className="font-mono text-white text-[11px]">
            {targetPoint[0].toFixed(4)}°E, {targetPoint[1].toFixed(4)}°N
          </div>
          <div className="text-[10px] text-[#A0ACB9] mt-0.5">Click map to adjust</div>
        </div>
      </div>

      {/* Canonical Mission Presets */}
      <div>
        <span className="text-[11px] font-bold text-[#A0ACB9] uppercase tracking-wider block mb-1.5">
          Canonical EVA Scenarios
        </span>
        <div className="grid grid-cols-1 gap-1.5">
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => onApplyPreset(p.start, p.target)}
              className="flex items-center justify-between px-3 py-2 text-xs bg-[#131B26] hover:bg-[#1E293B] border border-[#1E293B] hover:border-[#5CC8D7] rounded-lg transition-all text-left"
            >
              <div>
                <div className="font-medium text-white">{p.name}</div>
                <div className="text-[10px] text-[#A0ACB9]">{p.desc}</div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#5CC8D7]" />
            </button>
          ))}
        </div>
      </div>

      {/* Optimization Strategy Mode Selector */}
      <div>
        <span className="text-[11px] font-bold text-[#A0ACB9] uppercase tracking-wider block mb-1.5">
          Traverse Optimization Strategy
        </span>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => onModeChange("all")}
            className={`px-2.5 py-2 text-xs rounded-lg border font-medium flex items-center justify-center gap-1.5 transition-all ${
              selectedMode === "all"
                ? "bg-[#5CC8D7] text-[#070A10] border-[#5CC8D7] font-bold"
                : "bg-[#131B26] text-[#A0ACB9] border-[#1E293B] hover:text-white"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All 3 Modes</span>
          </button>

          <button
            onClick={() => onModeChange("safe")}
            className={`px-2.5 py-2 text-xs rounded-lg border font-medium flex items-center justify-center gap-1.5 transition-all ${
              selectedMode === "safe"
                ? "bg-[#62C99B] text-[#070A10] border-[#62C99B] font-bold"
                : "bg-[#131B26] text-[#A0ACB9] border-[#1E293B] hover:text-white"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#62C99B]" />
            <span>Min Metabolic</span>
          </button>

          <button
            onClick={() => onModeChange("balanced")}
            className={`px-2.5 py-2 text-xs rounded-lg border font-medium flex items-center justify-center gap-1.5 transition-all ${
              selectedMode === "balanced"
                ? "bg-[#3B82F6] text-white border-[#3B82F6] font-bold"
                : "bg-[#131B26] text-[#A0ACB9] border-[#1E293B] hover:text-white"
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-[#3B82F6]" />
            <span>Balanced Time</span>
          </button>

          <button
            onClick={() => onModeChange("science")}
            className={`px-2.5 py-2 text-xs rounded-lg border font-medium flex items-center justify-center gap-1.5 transition-all ${
              selectedMode === "science"
                ? "bg-[#E056FD] text-white border-[#E056FD] font-bold"
                : "bg-[#131B26] text-[#A0ACB9] border-[#1E293B] hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E056FD]" />
            <span>Science Target</span>
          </button>
        </div>
      </div>

      {/* Compute Traverses Action Button */}
      <button
        onClick={onComputeRoute}
        disabled={isComputing}
        className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-[#E46A43] to-[#A94332] hover:from-[#f0764e] hover:to-[#bd4a37] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-[#E46A43]/20 transition-all disabled:opacity-50"
      >
        {isComputing ? (
          <>
            <RotateCcw className="w-4 h-4 animate-spin" />
            <span>Evaluating 8-Connected A* Graph...</span>
          </>
        ) : (
          <>
            <Play className="w-4 h-4 fill-white" />
            <span>Compute EVA Traverse Alternatives</span>
          </>
        )}
      </button>

      {/* Flight Briefing Trigger */}
      {hasRoute && (
        <button
          onClick={onOpenBriefing}
          className="w-full py-2 px-3 bg-[#131B26] hover:bg-[#1E293B] text-[#5CC8D7] border border-[#5CC8D7]/40 hover:border-[#5CC8D7] text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all"
        >
          <span>View Flight Director Mission Briefing</span>
        </button>
      )}
    </div>
  );
}

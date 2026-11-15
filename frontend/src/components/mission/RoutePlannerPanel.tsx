"use client";

import React from "react";
import { 
  Play, 
  MapPin, 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  RotateCcw, 
  Activity,
  Layers,
  ArrowRight,
  Compass,
  FileText,
  AlertTriangle,
  Info
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
  activeSite?: "jezero" | "gale";
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
  hasRoute,
  activeSite = "jezero"
}: RoutePlannerPanelProps) {
  // Canonical scenarios tailored strictly to active mission site
  const JEZERO_PRESETS = [
    {
      name: "Delta Front Scarp Traverse",
      desc: "Base -> Cape Flatley Delta Contact",
      start: [77.4509, 18.4446] as [number, number],
      target: [77.4018, 18.4532] as [number, number],
      distance: "~2.9 km",
      unit: "Western Fan Delta"
    },
    {
      name: "Margin Carbonate Rim Excursion",
      desc: "Base -> Lac de Charmes Carbonate Bench",
      start: [77.4509, 18.4446] as [number, number],
      target: [77.3482, 18.4591] as [number, number],
      distance: "~5.8 km",
      unit: "Marginal Unit"
    },
    {
      name: "Séítah Olivine Pavement Survey",
      desc: "Base -> Dourbes Ridge Bedrock",
      start: [77.4509, 18.4446] as [number, number],
      target: [77.4439, 18.4412] as [number, number],
      distance: "~1.8 km",
      unit: "Séítah Formation"
    }
  ];

  const GALE_PRESETS = [
    {
      name: "Mount Sharp Boxwork Foothills",
      desc: "Base -> Chocolatal Boxwork Ribs",
      start: [137.4416, -4.5894] as [number, number],
      target: [137.3888, -4.8260] as [number, number],
      distance: "~4.3 km",
      unit: "Sulfate Boxwork Ridges"
    },
    {
      name: "Gediz Vallis Debris Flow Contact",
      desc: "Base -> Gediz Ridge Outcrops",
      start: [137.4416, -4.5894] as [number, number],
      target: [137.4150, -4.7120] as [number, number],
      distance: "~3.1 km",
      unit: "Debris Flow Deposit"
    },
    {
      name: "Yellowknife Bay Lakebed Survey",
      desc: "Base -> John Klein Drill Site",
      start: [137.4416, -4.5894] as [number, number],
      target: [137.4450, -4.5800] as [number, number],
      distance: "~0.8 km",
      unit: "Sheepbed Mudstone Member"
    }
  ];

  const presets = activeSite === "gale" ? GALE_PRESETS : JEZERO_PRESETS;
  const baseName = activeSite === "gale" ? "Bradbury Landing (MSL Curiosity)" : "Octavia E. Butler Site (M20)";
  const targetDefaultDesc = activeSite === "gale" ? "Mount Sharp Boxwork (Click map)" : "Cape Flatley Delta (Click map)";
  const canonicalTitle = activeSite === "gale" ? "CANONICAL GALE CRATER SCENARIOS" : "CANONICAL JEZERO SCENARIOS";

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 flex flex-col gap-4 border border-slate-200 shadow-md font-sans text-slate-800">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#EA580C]" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-sans">
            EVA Traverse Planner
          </h3>
        </div>
        <span className="text-xs font-sans text-[#0284C7] bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200 font-bold uppercase tracking-wide">
          8-CONNECTED A* ENGINE
        </span>
      </div>

      {/* Experimental Prototype Notice */}
      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
        <div>
          <span>Computational traverse evaluation based on Pandolf-Santee bioenergetics (G=0.376g) and local slope limits. Results are experimental decision-support simulations.</span>
        </div>
      </div>

      {/* Trajectory Coordinates Inspector */}
      <div className="grid grid-cols-2 gap-2.5 text-xs">
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 hover:border-slate-300 transition-all">
          <div className="flex items-center gap-1.5 text-[#15803D] font-bold text-xs uppercase tracking-wide mb-1">
            <span className="w-2 h-2 rounded-full bg-[#15803D]" />
            <span>Departure Base</span>
          </div>
          <div className="font-mono text-slate-900 text-xs font-bold num-tabular">
            {startPoint[0].toFixed(4)}°E, {Math.abs(startPoint[1]).toFixed(4)}°{startPoint[1] < 0 ? "S" : "N"}
          </div>
          <div className="text-xs text-slate-500 mt-0.5 truncate">{baseName}</div>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 hover:border-slate-300 transition-all">
          <div className="flex items-center gap-1.5 text-[#EA580C] font-bold text-xs uppercase tracking-wide mb-1">
            <span className="w-2 h-2 rounded-full bg-[#EA580C]" />
            <span>Target Location</span>
          </div>
          <div className="font-mono text-slate-900 text-xs font-bold num-tabular">
            {targetPoint[0].toFixed(4)}°E, {Math.abs(targetPoint[1]).toFixed(4)}°{targetPoint[1] < 0 ? "S" : "N"}
          </div>
          <div className="text-xs text-slate-500 mt-0.5 truncate">{targetDefaultDesc}</div>
        </div>
      </div>

      {/* Canonical Scenarios */}
      <div>
        <span className="text-xs font-sans font-bold text-slate-600 uppercase tracking-wider block mb-2">
          {canonicalTitle}
        </span>
        <div className="grid grid-cols-1 gap-2">
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => onApplyPreset(p.start, p.target)}
              className="flex items-center justify-between p-3 text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 rounded-xl transition-all text-left group shadow-sm"
            >
              <div>
                <div className="font-bold text-slate-900 group-hover:text-[#EA580C] transition-colors">{p.name}</div>
                <div className="text-xs text-slate-500 mt-0.5">{p.desc}</div>
              </div>
              <div className="text-right shrink-0 ml-2">
                <span className="font-mono text-xs text-[#15803D] font-bold block">{p.distance}</span>
                <span className="text-xs text-slate-500">{p.unit}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Computational Route Preferences Selector */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-sans font-bold text-slate-600 uppercase tracking-wider">
            ROUTE PREFERENCE (SIMULATION)
          </span>
          <span className="text-xs font-sans text-slate-500">θ ≤ 22.0° Cutoff</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onModeChange("all")}
            className={`px-3 py-2 text-xs rounded-xl border font-semibold flex items-center justify-center gap-1.5 transition-all ${
              selectedMode === "all"
                ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All 3 Modes</span>
          </button>

          <button
            onClick={() => onModeChange("safe")}
            className={`px-3 py-2 text-xs rounded-xl border font-semibold flex items-center justify-center gap-1.5 transition-all ${
              selectedMode === "safe"
                ? "bg-[#15803D] text-white border-[#15803D] shadow-sm shadow-[#15803D]/25"
                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Lower-Slope</span>
          </button>

          <button
            onClick={() => onModeChange("balanced")}
            className={`px-3 py-2 text-xs rounded-xl border font-semibold flex items-center justify-center gap-1.5 transition-all ${
              selectedMode === "balanced"
                ? "bg-[#0284C7] text-white border-[#0284C7] shadow-sm shadow-[#0284C7]/25"
                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Balanced</span>
          </button>

          <button
            onClick={() => onModeChange("science")}
            className={`px-3 py-2 text-xs rounded-xl border font-semibold flex items-center justify-center gap-1.5 transition-all ${
              selectedMode === "science"
                ? "bg-[#7C3AED] text-white border-[#7C3AED] shadow-sm shadow-[#7C3AED]/25"
                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Science Priority</span>
          </button>
        </div>
      </div>

      {/* Compute Action Button */}
      <button
        onClick={onComputeRoute}
        disabled={isComputing}
        className="w-full mt-1 py-3 px-4 bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-[#EA580C]/25 transition-all disabled:opacity-50 active:scale-[0.99] uppercase tracking-wider font-sans"
      >
        {isComputing ? (
          <>
            <RotateCcw className="w-4 h-4 animate-spin text-white" />
            <span>Computing Traverse...</span>
          </>
        ) : (
          <>
            <Play className="w-4 h-4 fill-white text-white" />
            <span>Compute Traverse Alternatives</span>
          </>
        )}
      </button>

      {/* Flight Briefing Trigger */}
      {hasRoute && (
        <button
          onClick={onOpenBriefing}
          className="w-full py-2.5 px-3 bg-slate-50 hover:bg-slate-100 text-[#0284C7] border border-slate-200 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
        >
          <FileText className="w-4 h-4 text-[#0284C7]" />
          <span>Flight Director Mission Briefing</span>
        </button>
      )}
    </div>
  );
}

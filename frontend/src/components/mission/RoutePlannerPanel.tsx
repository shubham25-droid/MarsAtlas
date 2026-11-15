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

  return (
    <div className="hud-panel rounded-2xl p-4 flex flex-col gap-3.5 shadow-2xl">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#F36C3D]" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            EVA Traverse Planner
          </h3>
        </div>
        <span className="text-[10px] font-mono text-[#38BDF8] bg-[#38BDF8]/10 px-2.5 py-0.5 rounded-full border border-[#38BDF8]/25 font-semibold">
          8-CONNECTED A* ENGINE
        </span>
      </div>

      {/* Experimental Prototype Notice */}
      <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-[11px] text-amber-300 leading-snug flex items-start gap-2">
        <Info className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
        <div>
          <span>Terrain analysis uses an experimental surrogate grid for prototype route comparison. Results are illustrative and are not validated for real mission navigation.</span>
        </div>
      </div>

      {/* Trajectory Coordinates Inspector */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-[#070B14] p-3 rounded-xl border border-white/[0.06] hover:border-white/[0.15] transition-all">
          <div className="flex items-center gap-1.5 text-[#34D399] font-bold text-[10px] tracking-wider uppercase mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]" />
            <span>Departure Base</span>
          </div>
          <div className="font-mono text-white text-[11px] font-semibold num-tabular">
            {startPoint[0].toFixed(4)}°E, {startPoint[1].toFixed(4)}°N
          </div>
          <div className="text-[10px] text-[#94A3B8] mt-0.5 truncate">Octavia E. Butler Site</div>
        </div>

        <div className="bg-[#070B14] p-3 rounded-xl border border-white/[0.06] hover:border-white/[0.15] transition-all">
          <div className="flex items-center gap-1.5 text-[#F36C3D] font-bold text-[10px] tracking-wider uppercase mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F36C3D]" />
            <span>Target Location</span>
          </div>
          <div className="font-mono text-white text-[11px] font-semibold num-tabular">
            {targetPoint[0].toFixed(4)}°E, {targetPoint[1].toFixed(4)}°N
          </div>
          <div className="text-[10px] text-[#94A3B8] mt-0.5 truncate">Click map to relocate</div>
        </div>
      </div>

      {/* Canonical Scenarios */}
      <div>
        <span className="text-[10px] font-mono font-bold text-[#64748B] uppercase tracking-widest block mb-2">
          CANONICAL JEZERO SCENARIOS
        </span>
        <div className="grid grid-cols-1 gap-1.5">
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => onApplyPreset(p.start, p.target)}
              className="flex items-center justify-between px-3 py-2 text-xs bg-[#070B14]/70 hover:bg-[#162034] border border-white/[0.05] hover:border-[#38BDF8]/40 rounded-xl transition-all text-left group"
            >
              <div>
                <div className="font-semibold text-white group-hover:text-[#38BDF8] transition-colors">{p.name}</div>
                <div className="text-[10px] text-[#94A3B8]">{p.desc}</div>
              </div>
              <div className="text-right">
                <span className="font-mono text-[10px] text-[#34D399] font-semibold block">{p.distance}</span>
                <span className="text-[9px] text-[#64748B]">{p.unit}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Computational Route Preferences Selector */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-mono font-bold text-[#64748B] uppercase tracking-widest">
            ROUTE PREFERENCE (NOT SAFETY CERTIFICATION)
          </span>
          <span className="text-[9px] font-mono text-slate-500">θ ≤ 22.0° Cutoff</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => onModeChange("all")}
            className={`px-2.5 py-2 text-xs rounded-xl border font-medium flex items-center justify-center gap-1.5 transition-all ${
              selectedMode === "all"
                ? "bg-[#38BDF8] text-[#04070D] border-[#38BDF8] font-bold shadow-md shadow-[#38BDF8]/20"
                : "bg-[#070B14] text-[#94A3B8] border-white/[0.06] hover:text-white"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All 3 Preferences</span>
          </button>

          <button
            onClick={() => onModeChange("safe")}
            className={`px-2.5 py-2 text-xs rounded-xl border font-medium flex items-center justify-center gap-1.5 transition-all ${
              selectedMode === "safe"
                ? "bg-[#34D399] text-[#04070D] border-[#34D399] font-bold shadow-md shadow-[#34D399]/20"
                : "bg-[#070B14] text-[#94A3B8] border-white/[0.06] hover:text-white"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#34D399]" />
            <span>Lower-Slope</span>
          </button>

          <button
            onClick={() => onModeChange("balanced")}
            className={`px-2.5 py-2 text-xs rounded-xl border font-medium flex items-center justify-center gap-1.5 transition-all ${
              selectedMode === "balanced"
                ? "bg-[#38BDF8] text-[#04070D] border-[#38BDF8] font-bold shadow-md shadow-[#38BDF8]/20"
                : "bg-[#070B14] text-[#94A3B8] border-white/[0.06] hover:text-white"
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Balanced</span>
          </button>

          <button
            onClick={() => onModeChange("science")}
            className={`px-2.5 py-2 text-xs rounded-xl border font-medium flex items-center justify-center gap-1.5 transition-all ${
              selectedMode === "science"
                ? "bg-[#E879F9] text-[#04070D] border-[#E879F9] font-bold shadow-md shadow-[#E879F9]/20"
                : "bg-[#070B14] text-[#94A3B8] border-white/[0.06] hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E879F9]" />
            <span>Science Priority</span>
          </button>
        </div>
      </div>

      {/* Compute Action Button */}
      <button
        onClick={onComputeRoute}
        disabled={isComputing}
        className="w-full mt-1 py-3 px-4 bg-gradient-to-r from-[#F36C3D] to-[#C84B24] hover:from-[#f57d54] hover:to-[#db542a] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-[#F36C3D]/25 transition-all disabled:opacity-50 active:scale-[0.99]"
      >
        {isComputing ? (
          <>
            <RotateCcw className="w-4 h-4 animate-spin" />
            <span>Solving 8-Connected A* Graph...</span>
          </>
        ) : (
          <>
            <Play className="w-4 h-4 fill-white" />
            <span>Compute Traverse Alternatives</span>
          </>
        )}
      </button>

      {/* Flight Briefing Trigger */}
      {hasRoute && (
        <button
          onClick={onOpenBriefing}
          className="w-full py-2.5 px-3 bg-[#070B14] hover:bg-[#162034] text-[#38BDF8] border border-[#38BDF8]/30 hover:border-[#38BDF8] text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
        >
          <FileText className="w-4 h-4 text-[#38BDF8]" />
          <span>Flight Director Mission Briefing</span>
        </button>
      )}
    </div>
  );
}

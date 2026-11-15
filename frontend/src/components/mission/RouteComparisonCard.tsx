"use client";

import React from "react";
import { RouteSummary } from "@/types/mars";
import { 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  Clock, 
  Route as RouteIcon, 
  HeartPulse, 
  AlertTriangle,
  Radio,
  CheckCircle2,
  Info
} from "lucide-react";

interface RouteComparisonCardProps {
  comparison: RouteSummary[];
  selectedMode: string;
  onSelectMode: (mode: string) => void;
}

export default function RouteComparisonCard({
  comparison,
  selectedMode,
  onSelectMode
}: RouteComparisonCardProps) {
  if (!comparison || comparison.length === 0) return null;

  // Maximum values for comparative relative bars
  const maxEnergy = Math.max(...comparison.map((r) => r.total_energy_kj), 1);
  const maxDuration = Math.max(...comparison.map((r) => r.estimated_duration_min), 1);

  return (
    <div className="hud-panel rounded-xl p-4 shadow-2xl flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#38BDF8]/10 border border-[#38BDF8]/20 flex items-center justify-center">
            <RouteIcon className="w-3.5 h-3.5 text-[#38BDF8]" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Multi-Route Trade-Off Scorecard
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">
              A* Trajectory Comparison • Pandolf-Santee Bioenergetics (G=0.376)
            </p>
          </div>
        </div>
        <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-slate-400 border border-white/[0.06]">
          3 Preferences Solved
        </span>
      </div>

      {/* Disclaimers Strip */}
      <div className="text-[10px] text-slate-400 flex items-center gap-1.5 font-mono px-1">
        <Info className="w-3 h-3 text-[#38BDF8] flex-shrink-0" />
        <span>Computational preferences on surrogate grid • Not certified astronaut safety ratings</span>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
        {comparison.map((route, idx) => {
          const modeKey = route.mode || (idx === 0 ? "safe" : idx === 1 ? "balanced" : "science");
          const isSelected = selectedMode === modeKey || selectedMode === "all";

          let borderClass = "border-[#34D399]/40 hover:border-[#34D399]";
          let activeBorder = "border-[#34D399] shadow-[0_0_15px_rgba(52,211,153,0.15)] ring-1 ring-[#34D399]/50";
          let textCol = "text-[#34D399]";
          let bgCol = "bg-[#34D399]/10";
          let barCol = "bg-[#34D399]";
          let icon = <ShieldCheck className="w-4 h-4 text-[#34D399]" />;
          let label = "LOWER-SLOPE PREFERENCE";

          if (modeKey === "balanced") {
            borderClass = "border-[#38BDF8]/40 hover:border-[#38BDF8]";
            activeBorder = "border-[#38BDF8] shadow-[0_0_15px_rgba(56,189,248,0.15)] ring-1 ring-[#38BDF8]/50";
            textCol = "text-[#38BDF8]";
            bgCol = "bg-[#38BDF8]/10";
            barCol = "bg-[#38BDF8]";
            icon = <Zap className="w-4 h-4 text-[#38BDF8]" />;
            label = "BALANCED PREFERENCE";
          } else if (modeKey === "science") {
            borderClass = "border-[#C084FC]/40 hover:border-[#C084FC]";
            activeBorder = "border-[#C084FC] shadow-[0_0_15px_rgba(192,132,252,0.15)] ring-1 ring-[#C084FC]/50";
            textCol = "text-[#C084FC]";
            bgCol = "bg-[#C084FC]/10";
            barCol = "bg-[#C084FC]";
            icon = <Sparkles className="w-4 h-4 text-[#C084FC]" />;
            label = "SCIENCE PRIORITY";
          }

          const energyPercent = Math.min(100, Math.round((route.total_energy_kj / maxEnergy) * 100));
          const timePercent = Math.min(100, Math.round((route.estimated_duration_min / maxDuration) * 100));

          return (
            <div
              key={idx}
              onClick={() => onSelectMode(modeKey)}
              className={`p-3 rounded-lg border transition-all cursor-pointer bg-[#0A0F1D]/80 flex flex-col justify-between ${
                isSelected ? activeBorder : `border-white/[0.08] opacity-80 hover:opacity-100 ${borderClass}`
              }`}
            >
              <div>
                {/* Route Header */}
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold tracking-wide flex items-center gap-1.5 ${textCol}`}>
                    {icon}
                    <span>{label}</span>
                  </span>
                  {isSelected && (
                    <CheckCircle2 className={`w-3.5 h-3.5 ${textCol}`} />
                  )}
                </div>

                {/* Primary Metric Badge */}
                <div className="flex items-baseline justify-between mb-2.5 pb-2 border-b border-white/[0.06]">
                  <span className="text-[10px] text-slate-400 font-mono">Distance</span>
                  <span className="text-sm font-mono font-bold text-white num-tabular">
                    {route.total_distance_km} <span className="text-[10px] font-normal text-slate-400">km</span>
                  </span>
                </div>

                {/* Metrics Breakdown */}
                <div className="space-y-2 text-xs">
                  {/* Duration */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-slate-400 flex items-center gap-1 text-[10px]">
                        <Clock className="w-3 h-3 text-slate-500" /> Duration
                      </span>
                      <span className="font-mono text-white font-semibold num-tabular">
                        {route.estimated_duration_min} <span className="text-[9px] text-slate-500">min</span>
                      </span>
                    </div>
                    <div className="w-full h-1 bg-white/[0.06] rounded-full overflow-hidden">
                      <div
                        className={`h-full ${barCol} transition-all duration-500`}
                        style={{ width: `${timePercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Metabolic Energy */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-slate-400 flex items-center gap-1 text-[10px]">
                        <HeartPulse className="w-3 h-3 text-slate-500" /> Workload
                      </span>
                      <span className="font-mono text-white font-semibold num-tabular">
                        {route.total_energy_kj} <span className="text-[9px] text-slate-500">kJ</span>
                      </span>
                    </div>
                    <div className="w-full h-1 bg-white/[0.06] rounded-full overflow-hidden">
                      <div
                        className={`h-full ${barCol} transition-all duration-500`}
                        style={{ width: `${energyPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Secondary Details */}
                  <div className="pt-1.5 grid grid-cols-2 gap-1.5 border-t border-white/[0.04] text-[10px] text-slate-400">
                    <div>
                      <span className="block text-[9px] text-slate-500">Peak Slope</span>
                      <span className="font-mono text-slate-200 font-bold num-tabular">
                        {route.peak_slope_deg}°
                      </span>
                    </div>
                    <div>
                      <span className="block text-[9px] text-slate-500">Avg Power</span>
                      <span className="font-mono text-slate-200 font-bold num-tabular">
                        {route.average_metabolic_w} W
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Radiation Badge with Disclosure */}
              <div className="mt-2.5 pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px]">
                <span className="text-slate-500 flex items-center gap-1" title="Illustrative radiation proxy — not a Jezero-specific radiation dose prediction">
                  <Radio className="w-3 h-3 text-slate-500" /> RAD Proxy:
                </span>
                <span className="font-mono text-[#FBBF24] font-semibold num-tabular">
                  {route.cumulative_radiation_usv} µSv
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

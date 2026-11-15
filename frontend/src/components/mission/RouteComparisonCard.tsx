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

  const maxEnergy = Math.max(...comparison.map((r) => r.total_energy_kj), 1);
  const maxDuration = Math.max(...comparison.map((r) => r.estimated_duration_min), 1);

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 flex flex-col gap-4 border border-slate-200 shadow-md font-sans text-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-sky-50 border border-sky-200 flex items-center justify-center">
            <RouteIcon className="w-3.5 h-3.5 text-[#0284C7]" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-sans">
              Multi-Route Trade-Off Scorecard
            </h3>
            <p className="text-xs text-slate-500 font-sans">
              A* Trajectory Comparison • Pandolf-Santee Bioenergetics (G=0.376)
            </p>
          </div>
        </div>
        <span className="text-xs font-sans px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 font-semibold">
          3 Modes Solved
        </span>
      </div>

      {/* Disclaimers Strip */}
      <div className="text-xs text-slate-500 flex items-center gap-1.5 font-sans px-1">
        <Info className="w-3.5 h-3.5 text-[#0284C7] shrink-0" />
        <span>Computational preferences on surrogate grid • Not certified astronaut safety ratings</span>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {comparison.map((route, idx) => {
          const modeKey = route.mode || (idx === 0 ? "safe" : idx === 1 ? "balanced" : "science");
          const isSelected = selectedMode === modeKey || selectedMode === "all";

          let borderClass = "border-slate-200 hover:border-emerald-300";
          let activeBorder = "border-2 border-[#15803D] ring-2 ring-[#15803D]/20 bg-emerald-50/50 shadow-sm";
          let textCol = "text-[#15803D]";
          let barCol = "bg-[#15803D]";
          let icon = <ShieldCheck className="w-4 h-4 text-[#15803D]" />;
          let label = "LOWER-SLOPE";

          if (modeKey === "balanced") {
            borderClass = "border-slate-200 hover:border-sky-300";
            activeBorder = "border-2 border-[#0284C7] ring-2 ring-[#0284C7]/20 bg-sky-50/50 shadow-sm";
            textCol = "text-[#0284C7]";
            barCol = "bg-[#0284C7]";
            icon = <Zap className="w-4 h-4 text-[#0284C7]" />;
            label = "BALANCED";
          } else if (modeKey === "science") {
            borderClass = "border-slate-200 hover:border-purple-300";
            activeBorder = "border-2 border-[#7C3AED] ring-2 ring-[#7C3AED]/20 bg-purple-50/50 shadow-sm";
            textCol = "text-[#7C3AED]";
            barCol = "bg-[#7C3AED]";
            icon = <Sparkles className="w-4 h-4 text-[#7C3AED]" />;
            label = "SCIENCE PRIORITY";
          }

          const energyPercent = Math.min(100, Math.round((route.total_energy_kj / maxEnergy) * 100));
          const timePercent = Math.min(100, Math.round((route.estimated_duration_min / maxDuration) * 100));

          return (
            <div
              key={idx}
              onClick={() => onSelectMode(modeKey)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer bg-slate-50 flex flex-col justify-between ${
                isSelected ? activeBorder : `opacity-85 hover:opacity-100 ${borderClass}`
              }`}
            >
              <div>
                {/* Route Header */}
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold tracking-wide flex items-center gap-1.5 ${textCol} font-sans`}>
                    {icon}
                    <span>{label}</span>
                  </span>
                  {isSelected && (
                    <CheckCircle2 className={`w-4 h-4 ${textCol}`} />
                  )}
                </div>

                {/* Primary Metric Badge */}
                <div className="flex items-baseline justify-between mb-3 pb-2 border-b border-slate-200">
                  <span className="text-xs text-slate-500 font-sans">Distance</span>
                  <span className="text-sm font-bold text-slate-900 num-tabular font-sans">
                    {route.total_distance_km} <span className="text-xs font-normal text-slate-500">km</span>
                  </span>
                </div>

                {/* Metrics Breakdown */}
                <div className="space-y-2.5 text-xs font-sans">
                  {/* Duration */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-600 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" /> Duration
                      </span>
                      <span className="font-bold text-slate-900 num-tabular font-mono">
                        {route.estimated_duration_min} <span className="text-xs font-normal text-slate-500">min</span>
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${barCol} transition-all duration-500`}
                        style={{ width: `${timePercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Metabolic Energy */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-600 flex items-center gap-1">
                        <HeartPulse className="w-3.5 h-3.5 text-slate-400" /> Workload
                      </span>
                      <span className="font-bold text-slate-900 num-tabular font-mono">
                        {route.total_energy_kj} <span className="text-xs font-normal text-slate-500">kJ</span>
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${barCol} transition-all duration-500`}
                        style={{ width: `${energyPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Secondary Details */}
                  <div className="pt-2 grid grid-cols-2 gap-2 border-t border-slate-200 text-xs text-slate-600">
                    <div>
                      <span className="block text-xs text-slate-500">Peak Slope</span>
                      <span className="font-bold text-slate-900 num-tabular font-mono">
                        {route.peak_slope_deg}°
                      </span>
                    </div>
                    <div>
                      <span className="block text-xs text-slate-500">Avg Power</span>
                      <span className="font-bold text-slate-900 num-tabular font-mono">
                        {route.average_metabolic_w} W
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Radiation Badge with Disclosure */}
              <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between text-xs font-sans">
                <span className="text-slate-500 flex items-center gap-1" title="Illustrative radiation proxy">
                  <Radio className="w-3.5 h-3.5 text-slate-400" /> RAD Proxy:
                </span>
                <span className="font-bold text-[#EA580C] num-tabular font-mono">
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

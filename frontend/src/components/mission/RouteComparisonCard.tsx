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
  Radio
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

  return (
    <div className="bg-[#0D121B] border border-[#1E293B] rounded-xl p-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-[#1E293B] pb-3 mb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#F3F5F7] flex items-center gap-2">
          <RouteIcon className="w-4 h-4 text-[#5CC8D7]" />
          Multi-Route Trade-Off Scorecard
        </h3>
        <span className="text-[10px] text-[#A0ACB9]">
          JSC CSRM / Pandolf Model
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {comparison.map((route, idx) => {
          const modeKey = route.mode || (idx === 0 ? "safe" : idx === 1 ? "balanced" : "science");
          const isSelected = selectedMode === modeKey || selectedMode === "all";

          let borderCol = "border-[#62C99B]";
          let textCol = "text-[#62C99B]";
          let bgCol = "bg-[#62C99B]/10";
          let icon = <ShieldCheck className="w-4 h-4 text-[#62C99B]" />;

          if (modeKey === "balanced") {
            borderCol = "border-[#3B82F6]";
            textCol = "text-[#3B82F6]";
            bgCol = "bg-[#3B82F6]/10";
            icon = <Zap className="w-4 h-4 text-[#3B82F6]" />;
          } else if (modeKey === "science") {
            borderCol = "border-[#E056FD]";
            textCol = "text-[#E056FD]";
            bgCol = "bg-[#E056FD]/10";
            icon = <Sparkles className="w-4 h-4 text-[#E056FD]" />;
          }

          return (
            <div
              key={idx}
              onClick={() => onSelectMode(modeKey)}
              className={`p-3 rounded-lg border transition-all cursor-pointer bg-[#131B26] ${
                isSelected ? `${borderCol} shadow-lg shadow-black/40` : "border-[#1E293B] opacity-75 hover:opacity-100"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-bold flex items-center gap-1.5 ${textCol}`}>
                  {icon}
                  {route.strategy?.split("/")[0] || modeKey.toUpperCase()}
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${bgCol} ${textCol}`}>
                  {route.total_distance_km} km
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-[#A0ACB9]">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-[11px]">
                    <Clock className="w-3 h-3 text-[#A0ACB9]" />
                    Duration:
                  </span>
                  <span className="font-mono text-white font-semibold">
                    {route.estimated_duration_min} min
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-[11px]">
                    <HeartPulse className="w-3 h-3 text-[#A0ACB9]" />
                    Energy:
                  </span>
                  <span className="font-mono text-white font-semibold">
                    {route.total_energy_kj} kJ
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-[11px]">
                    <HeartPulse className="w-3 h-3 text-[#A0ACB9]" />
                    Metabolic Work:
                  </span>
                  <span className="font-mono text-white font-semibold">
                    {route.average_metabolic_w} W
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-[11px]">
                    <AlertTriangle className="w-3 h-3 text-[#A0ACB9]" />
                    Peak Slope:
                  </span>
                  <span className="font-mono text-white font-semibold">
                    {route.peak_slope_deg}°
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-[11px]">
                    <Radio className="w-3 h-3 text-[#A0ACB9]" />
                    Radiation:
                  </span>
                  <span className="font-mono text-white font-semibold">
                    {route.cumulative_radiation_usv} µSv
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

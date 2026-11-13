"use client";

import React, { useState } from "react";
import { TelemetryPoint } from "@/types/mars";
import { Mountain, Activity, HeartPulse, Radio } from "lucide-react";

interface ElevationProfileChartProps {
  telemetry: TelemetryPoint[];
  selectedMetric?: "slope" | "watts" | "radiation";
}

export default function ElevationProfileChart({
  telemetry,
  selectedMetric = "slope"
}: ElevationProfileChartProps) {
  const [metric, setMetric] = useState<"slope" | "watts" | "radiation">(selectedMetric);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (!telemetry || telemetry.length < 2) {
    return (
      <div className="bg-[#0D121B] border border-[#1E293B] rounded-xl p-4 text-center text-xs text-[#A0ACB9]">
        Generate an EVA traverse to view the continuous 32-bit elevation and metabolic workload profile.
      </div>
    );
  }

  const width = 650;
  const height = 180;
  const padding = { top: 20, right: 30, bottom: 30, left: 50 };

  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  // Extents
  const minElev = Math.min(...telemetry.map((t) => t.elevation_m));
  const maxElev = Math.max(...telemetry.map((t) => t.elevation_m));
  const elevRange = Math.max(10, maxElev - minElev);

  const maxDist = telemetry[telemetry.length - 1].distance_m;

  // Scale functions
  const scaleX = (dist: number) => padding.left + (dist / maxDist) * plotWidth;
  const scaleY = (elev: number) =>
    padding.top + plotHeight - ((elev - minElev) / elevRange) * plotHeight;

  // Secondary metric extents
  let secondaryVals: number[] = [];
  let secColor = "#E8B65A";
  let secUnit = "°";

  if (metric === "slope") {
    secondaryVals = telemetry.map((t) => t.slope_deg);
    secColor = "#E8B65A";
    secUnit = "°";
  } else if (metric === "watts") {
    secondaryVals = telemetry.map((t) => t.metabolic_rate_w);
    secColor = "#E46A43";
    secUnit = " W";
  } else {
    secondaryVals = telemetry.map((t) => t.cumulative_radiation_usv);
    secColor = "#5CC8D7";
    secUnit = " µSv";
  }

  const maxSec = Math.max(...secondaryVals, 1);
  const scaleSecY = (val: number) => padding.top + plotHeight - (val / maxSec) * (plotHeight * 0.65);

  // Generate SVG path strings
  let pathD = `M ${scaleX(telemetry[0].distance_m)} ${scaleY(telemetry[0].elevation_m)}`;
  let areaD = `M ${scaleX(telemetry[0].distance_m)} ${scaleY(telemetry[0].elevation_m)}`;

  telemetry.forEach((t) => {
    const x = scaleX(t.distance_m);
    const y = scaleY(t.elevation_m);
    pathD += ` L ${x} ${y}`;
    areaD += ` L ${x} ${y}`;
  });

  const lastX = scaleX(telemetry[telemetry.length - 1].distance_m);
  const bottomY = padding.top + plotHeight;
  areaD += ` L ${lastX} ${bottomY} L ${padding.left} ${bottomY} Z`;

  // Secondary trace path
  let secPathD = `M ${scaleX(telemetry[0].distance_m)} ${scaleSecY(secondaryVals[0])}`;
  telemetry.forEach((t, i) => {
    const x = scaleX(t.distance_m);
    const y = scaleSecY(secondaryVals[i]);
    secPathD += ` L ${x} ${y}`;
  });

  const activePoint = hoverIndex !== null ? telemetry[hoverIndex] : telemetry[telemetry.length - 1];

  return (
    <div className="bg-[#0D121B] border border-[#1E293B] rounded-xl p-4 shadow-xl flex flex-col gap-3">
      {/* Chart Header & Metric Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1E293B] pb-2">
        <div className="flex items-center gap-2">
          <Mountain className="w-4 h-4 text-[#5CC8D7]" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Traverse Topographic & Metabolic Profile
          </h4>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-[10px] text-[#A0ACB9] uppercase font-bold mr-1">Overlay Trace:</span>
          <button
            onClick={() => setMetric("slope")}
            className={`px-2 py-0.5 rounded text-[10px] font-semibold border transition-all ${
              metric === "slope"
                ? "bg-[#E8B65A]/20 text-[#E8B65A] border-[#E8B65A]"
                : "bg-[#131B26] text-[#A0ACB9] border-[#1E293B] hover:text-white"
            }`}
          >
            Slope (Horn&apos;s)
          </button>
          <button
            onClick={() => setMetric("watts")}
            className={`px-2 py-0.5 rounded text-[10px] font-semibold border transition-all ${
              metric === "watts"
                ? "bg-[#E46A43]/20 text-[#E46A43] border-[#E46A43]"
                : "bg-[#131B26] text-[#A0ACB9] border-[#1E293B] hover:text-white"
            }`}
          >
            Metabolic (Watts)
          </button>
          <button
            onClick={() => setMetric("radiation")}
            className={`px-2 py-0.5 rounded text-[10px] font-semibold border transition-all ${
              metric === "radiation"
                ? "bg-[#5CC8D7]/20 text-[#5CC8D7] border-[#5CC8D7]"
                : "bg-[#131B26] text-[#A0ACB9] border-[#1E293B] hover:text-white"
            }`}
          >
            Radiation (µSv)
          </button>
        </div>
      </div>

      {/* SVG Elevation Chart */}
      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto max-h-48 overflow-visible"
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            <linearGradient id="elevGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5CC8D7" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#5CC8D7" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line
            x1={padding.left}
            y1={padding.top}
            x2={width - padding.right}
            y2={padding.top}
            stroke="#1E293B"
            strokeDasharray="3 3"
          />
          <line
            x1={padding.left}
            y1={bottomY}
            x2={width - padding.right}
            y2={bottomY}
            stroke="#1E293B"
          />

          {/* Elevation Area and Line */}
          <path d={areaD} fill="url(#elevGradient)" />
          <path d={pathD} fill="none" stroke="#5CC8D7" strokeWidth="2.5" />

          {/* Secondary Metric Line */}
          <path d={secPathD} fill="none" stroke={secColor} strokeWidth="1.5" strokeDasharray="4 4" />

          {/* Y Axis Labels (Elevation) */}
          <text x={padding.left - 8} y={padding.top + 4} fill="#A0ACB9" fontSize="10" textAnchor="end">
            {Math.round(maxElev)} m
          </text>
          <text x={padding.left - 8} y={bottomY - 4} fill="#A0ACB9" fontSize="10" textAnchor="end">
            {Math.round(minElev)} m
          </text>

          {/* X Axis Labels (Distance) */}
          <text x={padding.left} y={bottomY + 16} fill="#A0ACB9" fontSize="10" textAnchor="start">
            0 m
          </text>
          <text x={width - padding.right} y={bottomY + 16} fill="#A0ACB9" fontSize="10" textAnchor="end">
            {(maxDist / 1000).toFixed(2)} km
          </text>

          {/* Hover Tracker */}
          {telemetry.map((t, idx) => {
            const cx = scaleX(t.distance_m);
            return (
              <rect
                key={idx}
                x={cx - plotWidth / (telemetry.length * 2)}
                y={padding.top}
                width={Math.max(2, plotWidth / telemetry.length)}
                height={plotHeight}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoverIndex(idx)}
              />
            );
          })}

          {hoverIndex !== null && (
            <g>
              <line
                x1={scaleX(activePoint.distance_m)}
                y1={padding.top}
                x2={scaleX(activePoint.distance_m)}
                y2={bottomY}
                stroke="#F3F5F7"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              <circle
                cx={scaleX(activePoint.distance_m)}
                cy={scaleY(activePoint.elevation_m)}
                r="4.5"
                fill="#5CC8D7"
                stroke="#FFFFFF"
                strokeWidth="1.5"
              />
            </g>
          )}
        </svg>
      </div>

      {/* Active Hover Telemetry Callout */}
      <div className="flex flex-wrap items-center justify-between text-xs bg-[#131B26] p-2.5 rounded-lg border border-[#1E293B]">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-[10px] text-[#A0ACB9] block">Distance</span>
            <span className="font-mono text-white font-bold">{activePoint.distance_m} m</span>
          </div>
          <div>
            <span className="text-[10px] text-[#A0ACB9] block">Elevation</span>
            <span className="font-mono text-[#5CC8D7] font-bold">{activePoint.elevation_m} m</span>
          </div>
          <div>
            <span className="text-[10px] text-[#A0ACB9] block">Horn&apos;s Slope</span>
            <span className="font-mono text-[#E8B65A] font-bold">{activePoint.slope_deg}°</span>
          </div>
          <div>
            <span className="text-[10px] text-[#A0ACB9] block">Speed</span>
            <span className="font-mono text-white font-bold">{activePoint.speed_ms} m/s</span>
          </div>
          <div>
            <span className="text-[10px] text-[#A0ACB9] block">Metabolic Power</span>
            <span className="font-mono text-[#E46A43] font-bold">{activePoint.metabolic_rate_w} W</span>
          </div>
          <div>
            <span className="text-[10px] text-[#A0ACB9] block">Cum. Energy</span>
            <span className="font-mono text-white font-bold">{activePoint.cumulative_energy_kj} kJ</span>
          </div>
        </div>

        <span className="text-[10px] font-mono text-[#62C99B] bg-[#62C99B]/10 px-2 py-0.5 rounded border border-[#62C99B]/20">
          Nominal Traction
        </span>
      </div>
    </div>
  );
}

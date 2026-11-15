"use client";

import React, { useState } from "react";
import { TelemetryPoint } from "@/types/mars";
import { Mountain, Activity, HeartPulse, Radio, AlertTriangle } from "lucide-react";

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
      <div className="hud-panel rounded-xl p-5 text-center text-xs text-slate-400">
        Generate an EVA traverse to view the continuous 32-bit elevation and metabolic workload profile.
      </div>
    );
  }

  const width = 720;
  const height = 190;
  const padding = { top: 20, right: 35, bottom: 32, left: 55 };

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
  let secColor = "#FBBF24";
  let secUnit = "°";
  let secLabel = "Slope (Horn's)";

  if (metric === "slope") {
    secondaryVals = telemetry.map((t) => t.slope_deg);
    secColor = "#FBBF24";
    secUnit = "°";
    secLabel = "Slope (Horn's)";
  } else if (metric === "watts") {
    secondaryVals = telemetry.map((t) => t.metabolic_rate_w);
    secColor = "#F36C3D";
    secUnit = " W";
    secLabel = "Metabolic Power";
  } else {
    secondaryVals = telemetry.map((t) => t.cumulative_radiation_usv);
    secColor = "#38BDF8";
    secUnit = " µSv";
    secLabel = "RAD Proxy (Gale)";
  }

  const maxSec = Math.max(...secondaryVals, 1);
  const scaleSecY = (val: number) => padding.top + plotHeight - (val / maxSec) * (plotHeight * 0.7);

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
    <div className="hud-panel rounded-xl p-4 shadow-2xl flex flex-col gap-3">
      {/* Header & Metric Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#38BDF8]/10 border border-[#38BDF8]/20 flex items-center justify-center">
            <Mountain className="w-3.5 h-3.5 text-[#38BDF8]" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Traverse Topographic & Metabolic Cross-Section
            </h4>
            <p className="text-[10px] text-slate-400 font-mono">
              Prototype Surrogate Grid • Horn&apos;s Gradient Metric
            </p>
          </div>
        </div>

        {/* Trace Buttons */}
        <div className="flex items-center gap-1.5 text-xs bg-[#070B14]/80 p-1 rounded-lg border border-white/[0.06]">
          <span className="text-[9px] text-slate-400 uppercase font-mono mr-1">Overlay:</span>
          <button
            onClick={() => setMetric("slope")}
            className={`px-2.5 py-1 rounded text-[10px] font-mono font-medium transition-all ${
              metric === "slope"
                ? "bg-[#FBBF24]/20 text-[#FBBF24] border border-[#FBBF24]/40"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Slope (Horn)
          </button>
          <button
            onClick={() => setMetric("watts")}
            className={`px-2.5 py-1 rounded text-[10px] font-mono font-medium transition-all ${
              metric === "watts"
                ? "bg-[#F36C3D]/20 text-[#F36C3D] border border-[#F36C3D]/40"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Metabolic (W)
          </button>
          <button
            onClick={() => setMetric("radiation")}
            className={`px-2.5 py-1 rounded text-[10px] font-mono font-medium transition-all ${
              metric === "radiation"
                ? "bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/40"
                : "text-slate-400 hover:text-white"
            }`}
          >
            RAD Proxy (µSv)
          </button>
        </div>
      </div>

      {metric === "radiation" && (
        <div className="px-3 py-1.5 rounded-lg bg-[#38BDF8]/10 border border-[#38BDF8]/25 text-[10px] text-[#38BDF8] font-mono flex items-center gap-2">
          <span>Illustrative radiation proxy — not a Jezero-specific radiation dose prediction.</span>
        </div>
      )}

      {/* SVG Elevation Chart */}
      <div className="relative w-full overflow-x-auto bg-[#04070D]/60 rounded-lg p-2 border border-white/[0.04]">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto max-h-48 overflow-visible"
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            <linearGradient id="elevGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="slopeHazardGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#EF4444" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#EF4444" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Reference Lines */}
          <line
            x1={padding.left}
            y1={padding.top}
            x2={width - padding.right}
            y2={padding.top}
            stroke="rgba(255,255,255,0.08)"
            strokeDasharray="4 4"
          />
          <line
            x1={padding.left}
            y1={(padding.top + bottomY) / 2}
            x2={width - padding.right}
            y2={(padding.top + bottomY) / 2}
            stroke="rgba(255,255,255,0.04)"
            strokeDasharray="2 4"
          />
          <line
            x1={padding.left}
            y1={bottomY}
            x2={width - padding.right}
            y2={bottomY}
            stroke="rgba(255,255,255,0.12)"
          />

          {/* Elevation Area and Primary Line */}
          <path d={areaD} fill="url(#elevGradient)" />
          <path
            d={pathD}
            fill="none"
            stroke="#38BDF8"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Secondary Metric Line */}
          <path
            d={secPathD}
            fill="none"
            stroke={secColor}
            strokeWidth="1.6"
            strokeDasharray="4 3"
            strokeLinecap="round"
          />

          {/* Y Axis Labels (Elevation) */}
          <text
            x={padding.left - 8}
            y={padding.top + 4}
            fill="#94A3B8"
            fontSize="10"
            fontFamily="monospace"
            textAnchor="end"
          >
            {Math.round(maxElev)}m
          </text>
          <text
            x={padding.left - 8}
            y={bottomY - 4}
            fill="#94A3B8"
            fontSize="10"
            fontFamily="monospace"
            textAnchor="end"
          >
            {Math.round(minElev)}m
          </text>

          {/* X Axis Labels (Distance) */}
          <text
            x={padding.left}
            y={bottomY + 16}
            fill="#64748B"
            fontSize="10"
            fontFamily="monospace"
            textAnchor="start"
          >
            0.0 km
          </text>
          <text
            x={width - padding.right}
            y={bottomY + 16}
            fill="#64748B"
            fontSize="10"
            fontFamily="monospace"
            textAnchor="end"
          >
            {(maxDist / 1000).toFixed(2)} km
          </text>

          {/* Interactive Hover Columns */}
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
                className="cursor-crosshair"
                onMouseEnter={() => setHoverIndex(idx)}
              />
            );
          })}

          {/* Active Hover Crosshair */}
          {hoverIndex !== null && (
            <g>
              <line
                x1={scaleX(activePoint.distance_m)}
                y1={padding.top}
                x2={scaleX(activePoint.distance_m)}
                y2={bottomY}
                stroke="#F1F5F9"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              <circle
                cx={scaleX(activePoint.distance_m)}
                cy={scaleY(activePoint.elevation_m)}
                r="4.5"
                fill="#38BDF8"
                stroke="#FFFFFF"
                strokeWidth="2"
              />
              <circle
                cx={scaleX(activePoint.distance_m)}
                cy={scaleSecY(secondaryVals[hoverIndex])}
                r="3.5"
                fill={secColor}
                stroke="#FFFFFF"
                strokeWidth="1.5"
              />
            </g>
          )}
        </svg>
      </div>

      {/* Active Point Telemetry Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 bg-[#0A0F1D]/80 p-2.5 rounded-lg border border-white/[0.06] text-xs">
        <div>
          <span className="text-[9px] uppercase tracking-wider text-slate-500 font-mono block">Traverse Dist</span>
          <span className="font-mono text-white font-bold num-tabular">{activePoint.distance_m} <span className="text-[10px] text-slate-500">m</span></span>
        </div>
        <div>
          <span className="text-[9px] uppercase tracking-wider text-[#38BDF8] font-mono block">Datum Elevation</span>
          <span className="font-mono text-[#38BDF8] font-bold num-tabular">{activePoint.elevation_m} <span className="text-[10px] text-slate-500">m</span></span>
        </div>
        <div>
          <span className="text-[9px] uppercase tracking-wider text-[#FBBF24] font-mono block">Horn&apos;s Slope</span>
          <span className="font-mono text-[#FBBF24] font-bold num-tabular">{activePoint.slope_deg}°</span>
        </div>
        <div>
          <span className="text-[9px] uppercase tracking-wider text-[#F36C3D] font-mono block">Metabolic Power</span>
          <span className="font-mono text-[#F36C3D] font-bold num-tabular">{activePoint.metabolic_rate_w} <span className="text-[10px] text-slate-500">W</span></span>
        </div>
        <div>
          <span className="text-[9px] uppercase tracking-wider text-slate-500 font-mono block">Walking Speed</span>
          <span className="font-mono text-white font-bold num-tabular">{activePoint.speed_ms} <span className="text-[10px] text-slate-500">m/s</span></span>
        </div>
        <div className="flex flex-col justify-center">
          <span className={`text-[10px] font-mono px-2 py-1 rounded text-center font-bold border ${
            activePoint.slope_deg > 15
              ? "bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/40"
              : activePoint.slope_deg > 10
              ? "bg-[#FBBF24]/20 text-[#FBBF24] border-[#FBBF24]/40"
              : "bg-[#34D399]/20 text-[#34D399] border-[#34D399]/40"
          }`}>
            {activePoint.slope_deg > 15 ? "CAUTION: SLIP HAZARD" : activePoint.slope_deg > 10 ? "MODERATE GRADE" : "NOMINAL TRACTION"}
          </span>
        </div>
      </div>
    </div>
  );
}
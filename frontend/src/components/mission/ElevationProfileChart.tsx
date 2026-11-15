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
      <div className="bg-white/95 rounded-2xl p-5 text-center text-xs text-slate-500 border border-slate-200 shadow-sm font-sans">
        Generate an EVA traverse to view the continuous elevation and bioenergetic workload profile.
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
  let secColor = "#D97706";
  let secUnit = "°";
  let secLabel = "Slope (Horn's)";

  if (metric === "slope") {
    secondaryVals = telemetry.map((t) => t.slope_deg);
    secColor = "#D97706";
    secUnit = "°";
    secLabel = "Slope (Horn's)";
  } else if (metric === "watts") {
    secondaryVals = telemetry.map((t) => t.metabolic_rate_w);
    secColor = "#EA580C";
    secUnit = " W";
    secLabel = "Metabolic Power";
  } else {
    secondaryVals = telemetry.map((t) => t.cumulative_radiation_usv);
    secColor = "#0284C7";
    secUnit = " µSv";
    secLabel = "RAD Proxy";
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
    <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 flex flex-col gap-3.5 border border-slate-200 shadow-md font-sans text-slate-800">
      {/* Header & Metric Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-sky-50 border border-sky-200 flex items-center justify-center">
            <Mountain className="w-3.5 h-3.5 text-[#0284C7]" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-sans">
              Traverse Topographic &amp; Metabolic Cross-Section
            </h4>
            <p className="text-xs text-slate-500 font-sans">
              Surrogate Elevation Grid • Horn&apos;s Finite-Difference Method
            </p>
          </div>
        </div>

        {/* Trace Buttons */}
        <div className="flex items-center gap-1.5 text-xs bg-slate-100 p-1 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500 uppercase font-sans mr-1 px-1">Overlay:</span>
          <button
            onClick={() => setMetric("slope")}
            className={`px-3 py-1 rounded-lg text-xs font-sans font-semibold transition-all ${
              metric === "slope"
                ? "bg-white text-amber-700 shadow-sm border border-amber-300"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Slope (Horn)
          </button>
          <button
            onClick={() => setMetric("watts")}
            className={`px-3 py-1 rounded-lg text-xs font-sans font-semibold transition-all ${
              metric === "watts"
                ? "bg-white text-[#EA580C] shadow-sm border border-orange-300"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Metabolic (W)
          </button>
          <button
            onClick={() => setMetric("radiation")}
            className={`px-3 py-1 rounded-lg text-xs font-sans font-semibold transition-all ${
              metric === "radiation"
                ? "bg-white text-[#0284C7] shadow-sm border border-sky-300"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            RAD Proxy (µSv)
          </button>
        </div>
      </div>

      {metric === "radiation" && (
        <div className="px-3 py-1.5 rounded-lg bg-sky-50 border border-sky-200 text-xs text-[#0284C7] font-sans flex items-center gap-2">
          <span>Illustrative MSL RAD proxy baseline — not an empirical regional radiation dose prediction.</span>
        </div>
      )}

      {/* SVG Elevation Chart */}
      <div className="relative w-full overflow-x-auto bg-slate-50 rounded-xl p-2.5 border border-slate-200">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto max-h-48 overflow-visible"
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            <linearGradient id="lightElevGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0284C7" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#0284C7" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Horizontal Reference Lines */}
          <line
            x1={padding.left}
            y1={padding.top}
            x2={width - padding.right}
            y2={padding.top}
            stroke="#CBD5E1"
            strokeDasharray="4 4"
          />
          <line
            x1={padding.left}
            y1={(padding.top + bottomY) / 2}
            x2={width - padding.right}
            y2={(padding.top + bottomY) / 2}
            stroke="#E2E8F0"
            strokeDasharray="2 4"
          />
          <line
            x1={padding.left}
            y1={bottomY}
            x2={width - padding.right}
            y2={bottomY}
            stroke="#94A3B8"
          />

          {/* Elevation Area and Primary Line */}
          <path d={areaD} fill="url(#lightElevGradient)" />
          <path
            d={pathD}
            fill="none"
            stroke="#0284C7"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Secondary Metric Line */}
          <path
            d={secPathD}
            fill="none"
            stroke={secColor}
            strokeWidth="1.8"
            strokeDasharray="4 3"
            strokeLinecap="round"
          />

          {/* Y Axis Labels (Elevation) */}
          <text
            x={padding.left - 8}
            y={padding.top + 4}
            fill="#64748B"
            fontSize="11"
            fontFamily="monospace"
            textAnchor="end"
            fontWeight="bold"
          >
            {Math.round(maxElev)}m
          </text>
          <text
            x={padding.left - 8}
            y={bottomY - 4}
            fill="#64748B"
            fontSize="11"
            fontFamily="monospace"
            textAnchor="end"
            fontWeight="bold"
          >
            {Math.round(minElev)}m
          </text>

          {/* X Axis Labels (Distance) */}
          <text
            x={padding.left}
            y={bottomY + 16}
            fill="#64748B"
            fontSize="11"
            fontFamily="monospace"
            textAnchor="start"
          >
            0.0 km
          </text>
          <text
            x={width - padding.right}
            y={bottomY + 16}
            fill="#64748B"
            fontSize="11"
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
                stroke="#64748B"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              <circle
                cx={scaleX(activePoint.distance_m)}
                cy={scaleY(activePoint.elevation_m)}
                r="4.5"
                fill="#0284C7"
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
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs font-sans">
        <div>
          <span className="text-xs uppercase tracking-wide text-slate-500 font-sans block">Traverse Dist</span>
          <span className="font-mono text-slate-900 font-bold num-tabular text-sm">{activePoint.distance_m} <span className="text-xs font-normal text-slate-500">m</span></span>
        </div>
        <div>
          <span className="text-xs uppercase tracking-wide text-[#0284C7] font-sans block">Datum Elevation</span>
          <span className="font-mono text-[#0284C7] font-bold num-tabular text-sm">{activePoint.elevation_m} <span className="text-xs font-normal text-slate-500">m</span></span>
        </div>
        <div>
          <span className="text-xs uppercase tracking-wide text-amber-700 font-sans block">Horn&apos;s Slope</span>
          <span className="font-mono text-amber-700 font-bold num-tabular text-sm">{activePoint.slope_deg}°</span>
        </div>
        <div>
          <span className="text-xs uppercase tracking-wide text-[#EA580C] font-sans block">Metabolic Power</span>
          <span className="font-mono text-[#EA580C] font-bold num-tabular text-sm">{activePoint.metabolic_rate_w} <span className="text-xs font-normal text-slate-500">W</span></span>
        </div>
        <div>
          <span className="text-xs uppercase tracking-wide text-slate-500 font-sans block">Walking Speed</span>
          <span className="font-mono text-slate-900 font-bold num-tabular text-sm">{activePoint.speed_ms} <span className="text-xs font-normal text-slate-500">m/s</span></span>
        </div>
        <div className="flex flex-col justify-center">
          <span className={`text-xs px-2.5 py-1.5 rounded-lg text-center font-bold border ${
            activePoint.slope_deg > 15
              ? "bg-red-50 text-red-700 border-red-200"
              : activePoint.slope_deg > 10
              ? "bg-amber-50 text-amber-700 border-amber-200"
              : "bg-emerald-50 text-emerald-700 border-emerald-200"
          }`}>
            {activePoint.slope_deg > 15 ? "CAUTION: SLIP HAZARD" : activePoint.slope_deg > 10 ? "MODERATE GRADE" : "NOMINAL TRACTION"}
          </span>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { Thermometer, Wind, Gauge, Radio, Sun, ShieldCheck, Clock, Compass } from "lucide-react";

export default function EnvironmentalHud() {
  const [envData, setEnvData] = useState<any>(null);

  useEffect(() => {
    fetch("/data/environmental_telemetry.json")
      .then((res) => res.json())
      .then((data) => setEnvData(data))
      .catch(() => {});
  }, []);

  if (!envData) return null;

  const atmos = envData.atmospheric || {};
  const rad = envData.radiation || {};

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 flex flex-col gap-3.5 border border-slate-200 shadow-md font-sans text-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-orange-50 border border-orange-200 flex items-center justify-center">
            <Thermometer className="w-3.5 h-3.5 text-[#EA580C]" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-sans">
              Surface Environment &amp; Radiation HUD
            </h3>
            <p className="text-xs text-slate-500 font-sans">
              MEDA • MSL RAD Calibrated Diurnal Telemetry
            </p>
          </div>
        </div>
        <span className="text-xs font-sans px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold uppercase">
          LIVE DIURNAL CYCLE
        </span>
      </div>

      {/* Grid of Atmospheric Gauges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-sans">
        {/* Temperature */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs uppercase font-sans font-semibold">Ambient Temp</span>
            <Thermometer className="w-3.5 h-3.5 text-[#EA580C]" />
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono num-tabular">
            -21.4<span className="text-xs text-slate-500 font-normal">°C</span>
          </div>
          <div className="text-xs text-slate-500 mt-1 font-mono">
            Diurnal: -91°C / -15°C
          </div>
        </div>

        {/* Pressure */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs uppercase font-sans font-semibold">Barometric</span>
            <Gauge className="w-3.5 h-3.5 text-[#0284C7]" />
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono num-tabular">
            752 <span className="text-xs text-slate-500 font-normal">Pa</span>
          </div>
          <div className="text-xs text-slate-500 mt-1 font-mono">
            0.74% Earth 1-atm
          </div>
        </div>

        {/* Wind & Dust */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs uppercase font-sans font-semibold">Wind &amp; Dust</span>
            <Wind className="w-3.5 h-3.5 text-[#15803D]" />
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono num-tabular">
            5.6 <span className="text-xs text-slate-500 font-normal">m/s</span>
          </div>
          <div className="text-xs text-slate-500 mt-1 font-mono">
            Tau: {atmos.dust_optical_depth_tau || "0.42"} (Clear)
          </div>
        </div>

        {/* Radiation Dose Proxy */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs uppercase font-sans font-semibold">RAD Proxy</span>
            <Radio className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="text-xl font-bold text-amber-700 font-mono num-tabular">
            23.3 <span className="text-xs text-slate-500 font-normal">µSv/h</span>
          </div>
          <div className="text-xs text-slate-500 mt-1 font-mono">
            MSL RAD Baseline Proxy
          </div>
        </div>
      </div>

      {/* Radiation Disclosure Strip */}
      <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-sans">
        <span>Illustrative MSL RAD proxy baseline — not an empirical regional radiation dose prediction.</span>
      </div>

      {/* Diurnal Timeline Slider Representation */}
      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-col gap-2 font-sans">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-500" />
            <span className="text-slate-800 font-bold text-xs">Recommended EVA Traverse Window:</span>
            <span className="font-mono text-[#0284C7] font-bold">10:00 – 14:30 LTST</span>
          </div>
          <span className="text-xs font-sans px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md font-semibold border border-emerald-200">
            Thermal Peak: -15°C
          </span>
        </div>

        {/* Visual diurnal sol bar */}
        <div className="relative w-full h-3 bg-slate-200 rounded-full overflow-hidden flex items-center">
          <div className="h-full bg-blue-900/30" style={{ width: "29%" }} title="00:00 - 07:00 Deep Night (-90°C)" />
          <div className="h-full bg-amber-600/30" style={{ width: "12.5%" }} title="07:00 - 10:00 Solar Warmup" />
          <div className="h-full bg-[#0284C7]/60 border-y border-[#0284C7] shadow-sm" style={{ width: "19%" }} title="10:00 - 14:30 Optimal Surface EVA" />
          <div className="h-full bg-orange-600/30" style={{ width: "14.5%" }} title="14:30 - 18:00 Afternoon" />
          <div className="h-full bg-blue-900/30" style={{ width: "25%" }} title="18:00 - 24:00 Subzero Night" />
        </div>

        <div className="flex justify-between text-xs font-mono text-slate-500">
          <span>00:00 LTST</span>
          <span>06:00 (Dawn)</span>
          <span className="text-[#0284C7] font-bold">12:00 (Zenith)</span>
          <span>18:00 (Dusk)</span>
          <span>24:00 LTST</span>
        </div>
      </div>
    </div>
  );
}

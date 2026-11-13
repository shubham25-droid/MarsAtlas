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
    <div className="hud-panel rounded-xl p-4 shadow-2xl flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#F36C3D]/10 border border-[#F36C3D]/20 flex items-center justify-center">
            <Thermometer className="w-3.5 h-3.5 text-[#F36C3D]" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Surface Environment & Radiation HUD
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">
              MEDA • MSL RAD Calibrated Diurnal Telemetry
            </p>
          </div>
        </div>
        <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#34D399]/10 text-[#34D399] border border-[#34D399]/30 font-bold">
          LIVE DIURNAL CYCLE
        </span>
      </div>

      {/* Grid of Atmospheric Gauges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
        {/* Temperature */}
        <div className="bg-[#0A0F1D]/80 p-3 rounded-lg border border-white/[0.06]">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] uppercase font-mono tracking-wider">Ambient Temp</span>
            <Thermometer className="w-3.5 h-3.5 text-[#F36C3D]" />
          </div>
          <div className="text-lg font-bold text-white font-mono num-tabular">
            -21.4<span className="text-xs text-slate-400 font-normal">°C</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono">
            Diurnal: -91°C / -15°C
          </div>
        </div>

        {/* Pressure */}
        <div className="bg-[#0A0F1D]/80 p-3 rounded-lg border border-white/[0.06]">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] uppercase font-mono tracking-wider">Barometric</span>
            <Gauge className="w-3.5 h-3.5 text-[#38BDF8]" />
          </div>
          <div className="text-lg font-bold text-white font-mono num-tabular">
            752 <span className="text-xs text-slate-400 font-normal">Pa</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono">
            0.74% Earth 1-atm
          </div>
        </div>

        {/* Wind & Dust */}
        <div className="bg-[#0A0F1D]/80 p-3 rounded-lg border border-white/[0.06]">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] uppercase font-mono tracking-wider">Wind & Dust</span>
            <Wind className="w-3.5 h-3.5 text-[#34D399]" />
          </div>
          <div className="text-lg font-bold text-white font-mono num-tabular">
            5.6 <span className="text-xs text-slate-400 font-normal">m/s</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono">
            Tau: {atmos.dust_optical_depth_tau || "0.42"} (Clear)
          </div>
        </div>

        {/* Radiation Dose */}
        <div className="bg-[#0A0F1D]/80 p-3 rounded-lg border border-white/[0.06]">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] uppercase font-mono tracking-wider">GCR / Solar Dose</span>
            <Radio className="w-3.5 h-3.5 text-[#FBBF24]" />
          </div>
          <div className="text-lg font-bold text-[#FBBF24] font-mono num-tabular">
            23.3 <span className="text-xs text-slate-400 font-normal">µSv/h</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono">
            Daily: 0.560 mSv/sol
          </div>
        </div>
      </div>

      {/* Diurnal Timeline Slider Representation */}
      <div className="bg-[#0A0F1D]/80 p-3 rounded-lg border border-white/[0.06] flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-[#FBBF24]" />
            <span className="text-white font-medium text-xs">Recommended EVA Traverse Window:</span>
            <span className="font-mono text-[#38BDF8] font-bold">10:00 – 14:30 LTST</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 bg-[#34D399]/10 text-[#34D399] rounded font-semibold border border-[#34D399]/30">
            Thermal Peak: -15°C
          </span>
        </div>

        {/* Visual diurnal sol bar */}
        <div className="relative w-full h-3 bg-white/[0.06] rounded-full overflow-hidden flex items-center">
          {/* Night cold zone 00:00 - 07:00 */}
          <div className="h-full bg-blue-950/60" style={{ width: "29%" }} title="00:00 - 07:00 Deep Night (-90°C)" />
          {/* Dawn warmup 07:00 - 10:00 */}
          <div className="h-full bg-amber-900/40" style={{ width: "12.5%" }} title="07:00 - 10:00 Solar Warmup" />
          {/* Optimal Window 10:00 - 14:30 */}
          <div className="h-full bg-[#38BDF8]/60 border-y border-[#38BDF8] shadow-[0_0_8px_rgba(56,189,248,0.4)]" style={{ width: "19%" }} title="10:00 - 14:30 Optimal Surface EVA" />
          {/* Afternoon cool 14:30 - 18:00 */}
          <div className="h-full bg-orange-950/40" style={{ width: "14.5%" }} title="14:30 - 18:00 Afternoon" />
          {/* Night 18:00 - 24:00 */}
          <div className="h-full bg-blue-950/60" style={{ width: "25%" }} title="18:00 - 24:00 Subzero Night" />
        </div>

        <div className="flex justify-between text-[9px] font-mono text-slate-500">
          <span>00:00 LTST</span>
          <span>06:00 (Dawn)</span>
          <span className="text-[#38BDF8] font-bold">12:00 (Zenith)</span>
          <span>18:00 (Dusk)</span>
          <span>24:00 LTST</span>
        </div>
      </div>
    </div>
  );
}
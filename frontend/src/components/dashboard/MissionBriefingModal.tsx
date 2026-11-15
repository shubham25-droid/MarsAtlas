"use client";

import React, { useState } from "react";
import { X, FileText, CheckCircle, Copy, Printer, Shield, Compass, HeartPulse, AlertCircle, Award } from "lucide-react";
import { RouteSummary } from "@/types/mars";

interface MissionBriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: RouteSummary | null;
  mode: string;
}

export default function MissionBriefingModal({
  isOpen,
  onClose,
  summary,
  mode
}: MissionBriefingModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !summary) return null;

  const handleCopy = () => {
    const text = `================================================================================
MARSATLAS EVA FLIGHT DIRECTOR BRIEFING (RESEARCH PROTOTYPE)
NASA Space Apps Challenge 2026: Interplanetary Survival Guide: Martian Map
================================================================================
TRAVERSE PREFERENCE: ${mode.toUpperCase()}
TARGET REGION: Jezero Crater Western Delta (18.44°N, 77.45°E)

TRAVERSE METRICS:
- Total Surface Distance: ${summary.total_distance_km} km
- Estimated Duration: ${summary.estimated_duration_min} minutes
- Cumulative Metabolic Work: ${summary.total_energy_kj} kJ (Avg: ${summary.average_metabolic_w} W)
- Peak Topographic Gradient: ${summary.peak_slope_deg}° (Horn's 3x3 Metric Scale)
- Mean Incline: ${summary.mean_slope_deg}°
- Cumulative Ionizing Radiation Proxy: ${summary.cumulative_radiation_usv} µSv (Gale RAD baseline transfer)

COMPUTATIONAL CONSTRAINTS:
1. Life Support: Calculated via Pandolf-Santee bioenergetics for 160 kg suited ensemble.
2. Terrain Clearance: Peak slope complies with ≤ 22.0° algorithmic planner exclusion cutoff.
3. Radiation Exposure: Illustrative Gale RAD proxy — not a Jezero dose prediction.
4. Timing: Illustrative diurnal maximum advisory (10:00 - 14:30 LTST, -35°C to -15°C).

DATA GROUNDING & LIMITATIONS:
- Terrain: Prototype surrogate grid (jezero_eva_sector.npz) for route comparison.
- Physiology: Pandolf-Santee gross suited walking equations (G=0.376).
- Atmosphere: Mars 2020 MEDA Diurnal Climatology envelopes.
- Targets: Manually authored CRISM-referenced coordinates & USGS SIM 3464 overlays.
*DISCLAIMER: Experimental research prototype. Not certified for mission operations.*
================================================================================`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-[#070B14] border border-white/[0.12] rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#0A0F1D] sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#38BDF8]/10 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-wide uppercase">
                  EVA Flight Director Mission Briefing
                </h3>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/30 font-bold">
                  RESEARCH SIMULATION
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                NASA Space Apps Challenge 2026 • Experimental Route Telemetry
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 text-xs text-slate-200">
          {/* Executive Metrics HUD */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#0D1527] p-3 rounded-xl border border-white/[0.08]">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Distance</span>
              <span className="text-lg font-bold text-white font-mono num-tabular">{summary.total_distance_km} <span className="text-xs font-normal text-slate-400">km</span></span>
            </div>
            <div className="bg-[#0D1527] p-3 rounded-xl border border-white/[0.08]">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Duration</span>
              <span className="text-lg font-bold text-white font-mono num-tabular">{summary.estimated_duration_min} <span className="text-xs font-normal text-slate-400">min</span></span>
            </div>
            <div className="bg-[#0D1527] p-3 rounded-xl border border-white/[0.08]">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Workload</span>
              <span className="text-lg font-bold text-[#F36C3D] font-mono num-tabular">{summary.total_energy_kj} <span className="text-xs font-normal text-slate-400">kJ</span></span>
            </div>
            <div className="bg-[#0D1527] p-3 rounded-xl border border-white/[0.08]">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Peak Slope</span>
              <span className="text-lg font-bold text-[#FBBF24] font-mono num-tabular">{summary.peak_slope_deg}°</span>
            </div>
          </div>

          {/* Disclaimer Banner */}
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300">
            <span>Terrain analysis uses an experimental surrogate grid for prototype route comparison. Results are illustrative and are not validated for real mission navigation.</span>
          </div>

          {/* Life Support & Consumables */}
          <div className="bg-[#0D1527]/70 p-4 rounded-xl border border-white/[0.08] space-y-2">
            <h4 className="font-bold text-[#38BDF8] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <HeartPulse className="w-4 h-4 text-[#38BDF8]" />
              1. Suited Bioenergetics (Pandolf-Santee Formulation)
            </h4>
            <p className="text-slate-300 leading-relaxed">
              Calculated using the <strong>Pandolf-Santee bioenergetic equations</strong> adapted for a 75 kg explorer carrying an 85 kg pressurized spacesuit/PLSS in Martian gravity (<em>G = 0.376</em>).
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-400 pl-1 text-[11px]">
              <li>Mean metabolic power: <strong className="text-white font-mono">{summary.average_metabolic_w} W</strong>.</li>
              <li>Traverse preference: <strong className="text-[#34D399] font-mono">{mode.toUpperCase()}</strong>.</li>
            </ul>
          </div>

          {/* Topographic Hazard Clearance */}
          <div className="bg-[#0D1527]/70 p-4 rounded-xl border border-white/[0.08] space-y-2">
            <h4 className="font-bold text-[#FBBF24] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-[#FBBF24]" />
              2. Topographic & Regolith Hazard Clearance
            </h4>
            <p className="text-slate-300 leading-relaxed">
              Horn&apos;s 3x3 finite-difference gradient evaluated across the prototype surrogate grid (11.3 m resolution).
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-400 pl-1 text-[11px]">
              <li>Peak traverse grade: <strong className="text-white font-mono">{summary.peak_slope_deg}°</strong> (complies with the ≤ 22.0° algorithmic planner exclusion cutoff).</li>
              <li>Thermal Inertia check: Low-inertia aeolian dunes (<code className="text-[#FBBF24] font-mono">TI &lt; 140 J·m⁻²·K⁻¹·s⁻½</code>) avoided in favor of indurated delta benches.</li>
            </ul>
          </div>

          {/* Radiation & Diurnal Execution */}
          <div className="bg-[#0D1527]/70 p-4 rounded-xl border border-white/[0.08] space-y-2">
            <h4 className="font-bold text-[#34D399] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#34D399]" />
              3. Radiation Dosimetry Proxy & Diurnal Timing
            </h4>
            <ul className="list-disc list-inside space-y-1 text-slate-400 pl-1 text-[11px]">
              <li>Cumulative surface ionizing radiation proxy: <strong className="text-white font-mono">{summary.cumulative_radiation_usv} µSv</strong> (Illustrative radiation proxy based on Gale RAD baseline).</li>
              <li>Mars 2020 MEDA Diurnal Advisory: Optimal traverse window between <strong className="text-white font-mono">10:00 and 14:30 LTST</strong> for maximum surface temperature (-35°C to -15°C).</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/[0.08] bg-[#0A0F1D] flex items-center justify-between sticky bottom-0">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 bg-white/[0.06] hover:bg-white/[0.12] text-white text-xs font-mono rounded-lg transition-colors border border-white/[0.1]"
          >
            {copied ? <CheckCircle className="w-4 h-4 text-[#34D399]" /> : <Copy className="w-4 h-4 text-[#38BDF8]" />}
            <span>{copied ? "Copied to Clipboard" : "Copy Telemetry Text"}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#F36C3D] hover:bg-[#e05829] text-white text-xs font-bold rounded-lg transition-colors shadow-[0_0_15px_rgba(243,108,61,0.3)]"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Export Plan</span>
          </button>
        </div>
      </div>
    </div>
  );
}
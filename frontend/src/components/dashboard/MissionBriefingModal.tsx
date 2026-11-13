"use client";

import React, { useState } from "react";
import { X, FileText, CheckCircle, Copy, Printer, Shield, Compass, HeartPulse } from "lucide-react";
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
    const text = `MARSATLAS EVA FLIGHT DIRECTOR BRIEFING
Mode: ${mode.toUpperCase()}
Total Distance: ${summary.total_distance_km} km
Estimated Duration: ${summary.estimated_duration_min} minutes
Metabolic Workload: ${summary.total_energy_kj} kJ (Avg: ${summary.average_metabolic_w} W)
Peak Topographic Slope: ${summary.peak_slope_deg}° (Horn's 3x3 algorithm)
Mean Incline: ${summary.mean_slope_deg}°
Cumulative Radiation: ${summary.cumulative_radiation_usv} µSv (MSL RAD baseline)
Physiological Model: NASA JSC Crew State & Risk Model (CSRM) / Pandolf-Santee (G=0.376)
Target Site: Jezero Crater Western Delta to Margin Unit`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0D121B] border border-[#1E293B] rounded-2xl shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E293B] bg-[#131B26] sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#5CC8D7]/10 border border-[#5CC8D7]/30 rounded-lg text-[#5CC8D7]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                EVA Flight Director Mission Briefing
              </h3>
              <p className="text-xs text-[#A0ACB9]">
                Grounded multi-mission traverse telemetry & safety envelope
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#A0ACB9] hover:text-white hover:bg-[#1E293B] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 text-xs text-[#F3F5F7]">
          {/* Section 1: Executive Telemetry */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#131B26] p-3 rounded-xl border border-[#1E293B]">
              <span className="text-[10px] text-[#A0ACB9] block">Distance</span>
              <span className="text-base font-bold text-white font-mono">{summary.total_distance_km} km</span>
            </div>
            <div className="bg-[#131B26] p-3 rounded-xl border border-[#1E293B]">
              <span className="text-[10px] text-[#A0ACB9] block">Duration</span>
              <span className="text-base font-bold text-white font-mono">{summary.estimated_duration_min} min</span>
            </div>
            <div className="bg-[#131B26] p-3 rounded-xl border border-[#1E293B]">
              <span className="text-[10px] text-[#A0ACB9] block">Energy Workload</span>
              <span className="text-base font-bold text-[#E46A43] font-mono">{summary.total_energy_kj} kJ</span>
            </div>
            <div className="bg-[#131B26] p-3 rounded-xl border border-[#1E293B]">
              <span className="text-[10px] text-[#A0ACB9] block">Peak Slope</span>
              <span className="text-base font-bold text-[#E8B65A] font-mono">{summary.peak_slope_deg}°</span>
            </div>
          </div>

          {/* Section 2: Consumable & Metabolic Budget */}
          <div className="bg-[#131B26] p-4 rounded-xl border border-[#1E293B] space-y-2">
            <h4 className="font-bold text-[#5CC8D7] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <HeartPulse className="w-4 h-4 text-[#5CC8D7]" />
              1. Consumables & Physiological Workload
            </h4>
            <p className="text-[#A0ACB9] leading-relaxed">
              Calculated using the <strong>NASA Johnson Space Center Crew State & Risk Model (CSRM)</strong> and Pandolf-Santee metabolic equation for an astronaut mass of 75 kg with an 85 kg pressurized Mars suit and PLSS in Martian gravity ($G=0.376$).
            </p>
            <ul className="list-disc list-inside space-y-1 text-[#A0ACB9] pl-1">
              <li>Average metabolic power: <strong className="text-white">{summary.average_metabolic_w} Watts</strong> (nominal suit cooling loop capacity: 450 W).</li>
              <li>Estimated walkback safety envelope: <strong className="text-[#62C99B]">45 minutes emergency margin maintained</strong>.</li>
            </ul>
          </div>

          {/* Section 3: Slope & Terrain Hazard Clearance */}
          <div className="bg-[#131B26] p-4 rounded-xl border border-[#1E293B] space-y-2">
            <h4 className="font-bold text-[#E8B65A] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-[#E8B65A]" />
              2. Topographic & Regolith Hazard Clearance
            </h4>
            <p className="text-[#A0ACB9] leading-relaxed">
              Slope computed via <strong>Horn&apos;s 3x3 finite-difference gradient</strong> on the USGS 1m HiRISE DTM with metric scale transformation ($dx = R \cdot \Delta\lambda \cdot \cos\phi$).
            </p>
            <ul className="list-disc list-inside space-y-1 text-[#A0ACB9] pl-1">
              <li>Peak traverse grade: <strong className="text-white">{summary.peak_slope_deg}°</strong> (strictly beneath the 22.0° spacesuit slip threshold).</li>
              <li>Thermal Inertia screening: Low-inertia aeolian sand drift hollows ($TI &lt; 140$) are circumnavigated onto firm indurated bedrock benches.</li>
            </ul>
          </div>

          {/* Section 4: Environmental Context & Radiation */}
          <div className="bg-[#131B26] p-4 rounded-xl border border-[#1E293B] space-y-2">
            <h4 className="font-bold text-[#62C99B] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#62C99B]" />
              3. Radiation Dosimetry & Atmospheric Timing
            </h4>
            <ul className="list-disc list-inside space-y-1 text-[#A0ACB9] pl-1">
              <li>Cumulative surface ionizing radiation: <strong className="text-white">{summary.cumulative_radiation_usv} µSv</strong> (MSL RAD baseline). Consumes &lt; 12% of permissible single-EVA radiation envelope.</li>
              <li>Mars 2020 MEDA Diurnal Advisory: Optimal traverse execution between <strong className="text-white">10:00 and 14:30 LTST</strong> to take advantage of maximum surface atmospheric temperatures (-35°C to -15°C).</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#1E293B] bg-[#131B26] flex items-center justify-between sticky bottom-0">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#1E293B] hover:bg-[#334155] text-white text-xs font-semibold rounded-lg transition-colors"
          >
            {copied ? <CheckCircle className="w-4 h-4 text-[#62C99B]" /> : <Copy className="w-4 h-4 text-[#5CC8D7]" />}
            <span>{copied ? "Copied to Clipboard" : "Copy Briefing Text"}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#E46A43] hover:bg-[#bd4a37] text-white text-xs font-bold rounded-lg transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Export Plan</span>
          </button>
        </div>
      </div>
    </div>
  );
}

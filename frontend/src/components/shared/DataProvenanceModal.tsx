"use client";

import React from "react";
import { X, ShieldCheck, Database, FileText, ExternalLink } from "lucide-react";

interface DataProvenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DataProvenanceModal({ isOpen, onClose }: DataProvenanceModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#0D121B] border border-[#1E293B] rounded-2xl shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E293B] bg-[#131B26] sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#5CC8D7]/10 border border-[#5CC8D7]/30 rounded-lg text-[#5CC8D7]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                NASA & USGS Data Provenance & Epistemic Tiers
              </h3>
              <p className="text-xs text-[#A0ACB9]">
                Verified scientific traceability for NASA Space Apps Challenge 2026
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

        {/* Epistemic Tiers Table */}
        <div className="p-6 space-y-4 text-xs text-[#F3F5F7]">
          <p className="text-[#A0ACB9] leading-relaxed">
            In accordance with NASA evaluation criteria, MarsAtlas strictly distinguishes direct physical spacecraft measurements from derived computational estimates, explicit modeling assumptions, and hypothetical simulations.
          </p>

          <div className="space-y-3">
            {/* Tier 1 */}
            <div className="p-3.5 bg-[#131B26] border border-[#62C99B]/30 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#62C99B] text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#62C99B]" />
                  Tier 1: Actual Measured NASA Spacecraft Observations
                </span>
                <span className="text-[10px] bg-[#62C99B]/10 text-[#62C99B] px-2 py-0.5 rounded font-mono">
                  Ground Truth
                </span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-[#A0ACB9] pl-1">
                <li><strong>Perseverance Telemetry (MMGIS):</strong> 708 validated waypoints and 559 traverse legs spanning Sols 13–2022.</li>
                <li><strong>Curiosity Telemetry (MMGIS):</strong> 1,389 validated waypoints through Sol 5073 (comparative Gale Crater context).</li>
                <li><strong>Rover Surface Camera Imagery:</strong> Verified Mastcam-Z, SuperCam RMI, and Navcam observations linked to rover waypoints.</li>
                <li><strong>Mars 2020 MEDA &amp; MSL RAD:</strong> Diurnal surface temperature/pressure envelopes and 0.560 mSv/sol ionizing radiation baseline.</li>
                <li><strong>Global Cartographic Basemap:</strong> USGS Viking MDIM2.1 color mosaic and MOLA shaded relief streamed via USGS WMS.</li>
              </ul>
            </div>

            {/* Tier 2 */}
            <div className="p-3.5 bg-[#131B26] border border-[#5CC8D7]/30 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#5CC8D7] text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#5CC8D7]" />
                  Tier 2: Derived Computational Estimates
                </span>
                <span className="text-[10px] bg-[#5CC8D7]/10 text-[#5CC8D7] px-2 py-0.5 rounded font-mono">
                  Deterministic Math
                </span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-[#A0ACB9] pl-1">
                <li><strong>Topographic Slope (°):</strong> Horn&apos;s 3x3 finite-difference algorithm evaluated on smoothed terrain (dx = R · Δλ · cosφ).</li>
                <li><strong>Local Terrain Roughness:</strong> Local elevation standard deviation (&sigma;<sub>z</sub>) across moving window.</li>
                <li><strong>Topographic Obstacle Boundaries:</strong> Cells with slope &theta; &gt; 22.0° treated as impassable by planner.</li>
              </ul>
            </div>

            {/* Tier 3 */}
            <div className="p-3.5 bg-[#131B26] border border-[#E8B65A]/30 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#E8B65A] text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#E8B65A]" />
                  Tier 3: Explicit Modeling Assumptions &amp; Context
                </span>
                <span className="text-[10px] bg-[#E8B65A]/10 text-[#E8B65A] px-2 py-0.5 rounded font-mono">
                  Published Literature
                </span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-[#A0ACB9] pl-1">
                <li><strong>Astronaut Suit Ensemble Mass:</strong> Nude mass W = 75 kg, pressurized suit + PLSS L = 85 kg (total 160 kg, Mars G = 0.376).</li>
                <li><strong>Terrain Impedance Factor:</strong> Empirical heuristic &eta; combining thermal inertia and local roughness (&sigma;<sub>z</sub>).</li>
                <li><strong>Apollo Traverse Speed Equation:</strong> Dynamic degradation V = max(0.15, (-0.01 S + 0.75) / &eta;) m/s.</li>
                <li><strong>USGS SIM 3464 Overlays:</strong> 5 hand-simplified polygonal units after Sun &amp; Stack (2020) illustrating geological context.</li>
                <li><strong>CRISM-Referenced Locations:</strong> 5 manually authored coordinates citing published CRISM observations (no live spectral cube processing).</li>
              </ul>
            </div>

            {/* Tier 4 */}
            <div className="p-3.5 bg-[#131B26] border border-[#E46A43]/30 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#E46A43] text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#E46A43]" />
                  Tier 4: Prototype Surrogate Inputs &amp; Simulations
                </span>
                <span className="text-[10px] bg-[#E46A43]/10 text-[#E46A43] px-2 py-0.5 rounded font-mono">
                  Prototype Only
                </span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-[#A0ACB9] pl-1">
                <li><strong>Prototype Surrogate Terrain Grid:</strong> 350 × 550 cells (11.3 m spacing) for prototype route comparison; RMSE ~74 m vs rover elevations. Not a validated raw HiRISE crop.</li>
                <li><strong>Multi-Objective A* Traverses:</strong> Lower-Slope Preference, Balanced Preference, and Science Priority path options.</li>
                <li><strong>Radiation Dosage Proxy:</strong> Illustrative scaling from Gale RAD baseline — not a Jezero-specific dose prediction.</li>
              </ul>
            </div>

            {/* Documented Future Datasets Notice */}
            <div className="p-3 bg-[#0A0F1D] border border-white/[0.08] rounded-xl text-[11px] text-slate-400 space-y-1">
              <span className="text-white font-bold block">Documented Future Integration Datasets:</span>
              <p>MRO CTX (6m/px), THEMIS Nighttime IR (100m/px), and the raw USGS 1m HiRISE DTM GeoTIFF are documented reference products cataloged for future streaming integration.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#1E293B] bg-[#131B26] flex items-center justify-between text-xs">
          <span className="text-[#A0ACB9] text-[11px]">
            Coordinate System: Mars Equirectangular EPSG:104905 (R = 3,396,190 m)
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#1E293B] hover:bg-[#334155] text-white font-semibold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

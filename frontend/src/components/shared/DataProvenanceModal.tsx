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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col font-sans">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#0284C7]/10 border border-[#0284C7]/30 rounded-lg text-[#0284C7]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-wide font-sans">
                NASA &amp; USGS Data Provenance &amp; Epistemic Tiers
              </h3>
              <p className="text-xs text-slate-500 font-sans">
                Verified scientific traceability for NASA Space Apps Challenge 2026
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Epistemic Tiers Table */}
        <div className="p-6 space-y-4 text-xs text-slate-800">
          <p className="text-slate-600 leading-relaxed font-sans">
            In accordance with NASA evaluation criteria, MarsAtlas strictly distinguishes direct physical spacecraft measurements from derived computational estimates, explicit modeling assumptions, and hypothetical simulations.
          </p>

          <div className="space-y-3">
            {/* Tier 1 */}
            <div className="p-3.5 bg-slate-50 border border-[#16A34A]/40 rounded-xl space-y-1.5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#15803D] text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
                  Tier 1: Actual Measured NASA Spacecraft Observations
                </span>
                <span className="text-[10px] bg-[#DCFCE7] text-[#15803D] px-2 py-0.5 rounded font-mono font-bold">
                  Ground Truth
                </span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1 leading-relaxed">
                <li><strong className="text-slate-900 font-semibold">Perseverance Telemetry (MMGIS):</strong> 708 validated waypoints and 559 traverse legs spanning Sols 13–2022.</li>
                <li><strong className="text-slate-900 font-semibold">Curiosity Telemetry (MMGIS):</strong> 1,389 validated waypoints through Sol 5073 (comparative Gale Crater context).</li>
                <li><strong className="text-slate-900 font-semibold">Rover Surface Camera Imagery:</strong> Verified Mastcam-Z, SuperCam RMI, and Navcam observations linked to rover waypoints.</li>
                <li><strong className="text-slate-900 font-semibold">Mars 2020 MEDA &amp; MSL RAD:</strong> Diurnal surface temperature/pressure envelopes and 0.560 mSv/sol ionizing radiation baseline.</li>
                <li><strong className="text-slate-900 font-semibold">Global Cartographic Basemap:</strong> USGS Viking MDIM2.1 color mosaic and MOLA shaded relief streamed via USGS WMS.</li>
              </ul>
            </div>

            {/* Tier 2 */}
            <div className="p-3.5 bg-slate-50 border border-[#0284C7]/40 rounded-xl space-y-1.5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#0369A1] text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#0284C7]" />
                  Tier 2: Derived Computational Estimates
                </span>
                <span className="text-[10px] bg-[#E0F2FE] text-[#0369A1] px-2 py-0.5 rounded font-mono font-bold">
                  Deterministic Math
                </span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1 leading-relaxed">
                <li><strong className="text-slate-900 font-semibold">Topographic Slope (°):</strong> Horn&apos;s 3x3 finite-difference algorithm evaluated on smoothed terrain (dx = R · Δλ · cosφ).</li>
                <li><strong className="text-slate-900 font-semibold">Local Terrain Roughness:</strong> Local elevation standard deviation (&sigma;<sub>z</sub>) across moving window.</li>
                <li><strong className="text-slate-900 font-semibold">Topographic Obstacle Boundaries:</strong> Cells with slope &theta; &gt; 22.0° treated as impassable by planner.</li>
              </ul>
            </div>

            {/* Tier 3 */}
            <div className="p-3.5 bg-slate-50 border border-[#D97706]/40 rounded-xl space-y-1.5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#B45309] text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#D97706]" />
                  Tier 3: Explicit Modeling Assumptions &amp; Context
                </span>
                <span className="text-[10px] bg-[#FEF3C7] text-[#B45309] px-2 py-0.5 rounded font-mono font-bold">
                  Published Literature
                </span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1 leading-relaxed">
                <li><strong className="text-slate-900 font-semibold">Astronaut Suit Ensemble Mass:</strong> Nude mass W = 75 kg, pressurized suit + PLSS L = 85 kg (total 160 kg, Mars G = 0.376).</li>
                <li><strong className="text-slate-900 font-semibold">Terrain Impedance Factor:</strong> Empirical heuristic &eta; combining thermal inertia and local roughness (&sigma;<sub>z</sub>).</li>
                <li><strong className="text-slate-900 font-semibold">Apollo Traverse Speed Equation:</strong> Dynamic degradation V = max(0.15, (-0.01 S + 0.75) / &eta;) m/s.</li>
                <li><strong className="text-slate-900 font-semibold">USGS SIM 3464 Overlays:</strong> 5 hand-simplified polygonal units after Sun &amp; Stack (2020) illustrating geological context.</li>
                <li><strong className="text-slate-900 font-semibold">CRISM-Referenced Locations:</strong> 5 manually authored coordinates citing published CRISM observations (no live spectral cube processing).</li>
              </ul>
            </div>

            {/* Tier 4 */}
            <div className="p-3.5 bg-slate-50 border border-[#EA580C]/40 rounded-xl space-y-1.5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#C2410C] text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#EA580C]" />
                  Tier 4: Prototype Surrogate Inputs &amp; Simulations
                </span>
                <span className="text-[10px] bg-[#FFEDD5] text-[#C2410C] px-2 py-0.5 rounded font-mono font-bold">
                  Prototype Only
                </span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1 leading-relaxed">
                <li><strong className="text-slate-900 font-semibold">Prototype Surrogate Terrain Grid:</strong> 350 × 550 cells (11.3 m spacing) for prototype route comparison; RMSE ~74 m vs rover elevations. Not a validated raw HiRISE crop.</li>
                <li><strong className="text-slate-900 font-semibold">Multi-Objective A* Traverses:</strong> Lower-Slope Preference, Balanced Preference, and Science Priority path options.</li>
                <li><strong className="text-slate-900 font-semibold">Radiation Dosage Proxy:</strong> Illustrative scaling from Gale RAD baseline — not a Jezero-specific dose prediction.</li>
              </ul>
            </div>

            {/* Documented Future Datasets Notice */}
            <div className="p-3.5 bg-slate-100/90 border border-slate-200 rounded-xl text-[11px] text-slate-600 space-y-1">
              <span className="text-slate-900 font-bold block font-sans">Documented Future Integration Datasets:</span>
              <p>MRO CTX (6m/px), THEMIS Nighttime IR (100m/px), and the raw USGS 1m HiRISE DTM GeoTIFF are documented reference products cataloged for future streaming integration.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <span className="text-slate-500 text-[11px] font-mono">
            Coordinate System: Mars Equirectangular EPSG:104905 (R = 3,396,190 m)
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-lg transition-colors shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

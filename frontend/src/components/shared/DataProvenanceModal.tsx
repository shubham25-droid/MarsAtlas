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
                <li><strong>MRO HiRISE Stereo DTM:</strong> 1m/pixel co-registered elevation grid tied to MOLA datum.</li>
                <li><strong>MRO CTX Mosaic:</strong> 6m/pixel controlled orthomosaic (Mars Trek WMTS).</li>
                <li><strong>Mars Odyssey THEMIS Night IR:</strong> 100m calibrated brightness temperature & thermal inertia.</li>
                <li><strong>Mars 2020 Perseverance & MSL Curiosity Telemetry:</strong> 708 Sols of live MMGIS waypoints and raw Mastcam-Z/SuperCam images.</li>
                <li><strong>Mars 2020 MEDA & MSL RAD:</strong> Diurnal surface temperature, pressure, and 0.560 mSv/day ionizing radiation baseline.</li>
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
                <li><strong>Topographic Slope (°):</strong> Horn&apos;s 3x3 finite-difference algorithm ($dx = R \cdot \Delta\lambda \cdot \cos\phi$).</li>
                <li><strong>Local Terrain Roughness:</strong> Detrended elevation standard deviation ($\sigma_z$) across 3x3 moving window.</li>
                <li><strong>Radiation Topographic Shielding:</strong> Solid-angle reduction factor ($\psi_j \in [0.68, 0.98]$) in crater floor hollows.</li>
              </ul>
            </div>

            {/* Tier 3 */}
            <div className="p-3.5 bg-[#131B26] border border-[#E8B65A]/30 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#E8B65A] text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#E8B65A]" />
                  Tier 3: Explicit Modeling Assumptions
                </span>
                <span className="text-[10px] bg-[#E8B65A]/10 text-[#E8B65A] px-2 py-0.5 rounded font-mono">
                  Published Literature
                </span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-[#A0ACB9] pl-1">
                <li><strong>Astronaut Suit System Mass:</strong> Nude mass W = 75 kg, pressurized suit + PLSS L = 85 kg, Mars gravity G = 0.376.</li>
                <li><strong>Terrain Impedance Factor:</strong> Empirical synthesis mapping &eta; = 1.0 + 0.5 &times; clip((350 - TI)/250, 0, 1) + 0.6 &times; clip(&sigma; / 0.4, 0, 1).</li>
                <li><strong>Apollo Traverse Speed Equation:</strong> V = max(0.15, (-0.01 S + 0.75) / &eta;) m/s.</li>
              </ul>
            </div>

            {/* Tier 4 */}
            <div className="p-3.5 bg-[#131B26] border border-[#E46A43]/30 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#E46A43] text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#E46A43]" />
                  Tier 4: Hypothetical Mission Simulations
                </span>
                <span className="text-[10px] bg-[#E46A43]/10 text-[#E46A43] px-2 py-0.5 rounded font-mono">
                  Prototype Only
                </span>
              </div>
              <p className="text-[#A0ACB9] pl-1">
                Multi-objective A* paths, simulated metabolic energy depletion curves, and walkback safety buffers are experimental decision-support outputs created for the NASA Space Apps Challenge 2026.
              </p>
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

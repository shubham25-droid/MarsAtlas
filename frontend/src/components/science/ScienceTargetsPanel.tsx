"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Layers, MapPin, Compass, ArrowRight, ExternalLink, Flame } from "lucide-react";
import { ScienceTargetFeature, GeologicUnitFeature } from "@/types/mars";

interface ScienceTargetsPanelProps {
  onSetTarget: (coords: [number, number], name: string) => void;
  activeTargetId?: string;
}

export default function ScienceTargetsPanel({
  onSetTarget,
  activeTargetId
}: ScienceTargetsPanelProps) {
  const [tab, setTab] = useState<"crism" | "geology">("crism");
  const [crismTargets, setCrismTargets] = useState<ScienceTargetFeature[]>([]);
  const [geologicUnits, setGeologicUnits] = useState<GeologicUnitFeature[]>([]);

  useEffect(() => {
    fetch("/data/jezero_crism_hotspots.json")
      .then((res) => res.json())
      .then((data) => setCrismTargets(data.features || []))
      .catch(() => {});

    fetch("/data/jezero_geology_sim3464.json")
      .then((res) => res.json())
      .then((data) => setGeologicUnits(data.features || []))
      .catch(() => {});
  }, []);

  return (
    <div className="hud-panel rounded-xl p-4 shadow-2xl flex flex-col gap-3">
      {/* Header and Toggle */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#38BDF8]/10 border border-[#38BDF8]/20 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              CRISM-Referenced Science-Interest Locations
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">
              Manually Authored Context • USGS SIM 3464 Overlays
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-[#04070D]/80 p-1 rounded-lg border border-white/[0.06] text-[11px]">
          <button
            onClick={() => setTab("crism")}
            className={`px-2.5 py-1 rounded font-mono text-[10px] transition-all ${
              tab === "crism"
                ? "bg-[#38BDF8] text-[#04070D] font-bold shadow-[0_0_10px_rgba(56,189,248,0.3)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            CRISM Targets ({crismTargets.length})
          </button>
          <button
            onClick={() => setTab("geology")}
            className={`px-2.5 py-1 rounded font-mono text-[10px] transition-all ${
              tab === "geology"
                ? "bg-[#A855F7] text-white font-bold shadow-[0_0_10px_rgba(168,85,247,0.3)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            USGS Overlays ({geologicUnits.length})
          </button>
        </div>
      </div>

      <div className="px-3 py-1.5 rounded-lg bg-[#070B14] border border-white/[0.06] text-[10px] text-slate-400 font-mono">
        {tab === "crism" ? (
          <span>Manually authored coordinates citing CRISM IDs. No active spectral cube processing.</span>
        ) : (
          <span>Simplified polygonal units after Sun &amp; Stack (2020), USGS SIM 3464. Coarse approximations.</span>
        )}
      </div>

      {/* CRISM Targets List */}
      {tab === "crism" && (
        <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1">
          {crismTargets.map((target) => {
            const isSelected = activeTargetId === target.properties.id;
            return (
              <div
                key={target.properties.id}
                className={`p-3 rounded-lg border transition-all bg-[#0A0F1D]/80 ${
                  isSelected
                    ? "border-[#38BDF8] ring-1 ring-[#38BDF8]/40 shadow-[0_0_15px_rgba(56,189,248,0.15)]"
                    : "border-white/[0.06] hover:border-white/[0.15]"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/30 font-bold">
                      {target.properties.id}
                    </span>
                    <span className="text-xs font-bold text-white">
                      {target.properties.name}
                    </span>
                  </div>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#F36C3D]/10 text-[#F36C3D] border border-[#F36C3D]/30 font-bold uppercase">
                    {target.properties.priority}
                  </span>
                </div>

                <div className="text-[11px] text-slate-300 space-y-1 mb-2.5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[10px] uppercase font-mono text-slate-400">Mineralogy:</span>
                    <span className="text-white font-medium">{target.properties.spectral_signature}</span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[10px] uppercase font-mono text-slate-400">Unit:</span>
                    <span className="text-slate-300">{target.properties.geological_unit}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 bg-black/40 p-1.5 rounded border border-white/[0.04] italic">
                    {target.properties.recommended_eva_activity}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                  <span className="text-[10px] text-slate-400 font-mono num-tabular">
                    {target.geometry.coordinates[0].toFixed(4)}°E, {target.geometry.coordinates[1].toFixed(4)}°N
                  </span>
                  <button
                    onClick={() => onSetTarget(target.geometry.coordinates, target.properties.name)}
                    className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono font-semibold text-[#38BDF8] hover:text-[#04070D] bg-[#38BDF8]/10 hover:bg-[#38BDF8] rounded-md transition-all border border-[#38BDF8]/30 hover:border-[#38BDF8]"
                  >
                    <span>Route Here</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* USGS SIM 3464 Geologic Units List */}
      {tab === "geology" && (
        <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1">
          {geologicUnits.map((unit) => (
            <div
              key={unit.properties.unit_id}
              className="p-3 rounded-lg border border-white/[0.06] bg-[#0A0F1D]/80 hover:border-white/[0.15] transition-all"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full ring-1 ring-white/20"
                    style={{ backgroundColor: unit.properties.color }}
                  />
                  {unit.properties.name}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {unit.properties.age_period.split(" ")[0]}
                </span>
              </div>

              <p className="text-[11px] text-slate-300 mb-2 leading-relaxed">
                {unit.properties.description}
              </p>

              <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px]">
                <span className="text-slate-400">
                  <strong className="text-slate-200">Traversability:</strong> {unit.properties.traversability}
                </span>
                <span className="font-mono text-slate-400 text-[9px] bg-white/[0.04] px-1.5 py-0.5 rounded">
                  USGS SIM 3464
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Layers, MapPin, Compass, ArrowRight, ExternalLink } from "lucide-react";
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
    // Load local processed GeoJSON targets
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
    <div className="bg-[#0D121B] border border-[#1E293B] rounded-xl p-4 shadow-xl flex flex-col gap-3">
      {/* Header and Toggle */}
      <div className="flex items-center justify-between border-b border-[#1E293B] pb-2.5">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#5CC8D7]" />
          Science Along The Route
        </h3>

        <div className="flex items-center gap-1 bg-[#131B26] p-0.5 rounded-lg border border-[#1E293B] text-[11px]">
          <button
            onClick={() => setTab("crism")}
            className={`px-2.5 py-1 rounded font-medium transition-all ${
              tab === "crism"
                ? "bg-[#5CC8D7] text-[#070A10] font-bold"
                : "text-[#A0ACB9] hover:text-white"
            }`}
          >
            CRISM Targets
          </button>
          <button
            onClick={() => setTab("geology")}
            className={`px-2.5 py-1 rounded font-medium transition-all ${
              tab === "geology"
                ? "bg-[#8B5CF6] text-white font-bold"
                : "text-[#A0ACB9] hover:text-white"
            }`}
          >
            USGS SIM 3464
          </button>
        </div>
      </div>

      {/* CRISM Targets List */}
      {tab === "crism" && (
        <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
          {crismTargets.map((target) => {
            const isSelected = activeTargetId === target.properties.id;
            return (
              <div
                key={target.properties.id}
                className={`p-3 rounded-xl border transition-all bg-[#131B26] ${
                  isSelected ? "border-[#5CC8D7] shadow-lg shadow-[#5CC8D7]/10" : "border-[#1E293B] hover:border-[#334155]"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#5CC8D7]/10 text-[#5CC8D7] border border-[#5CC8D7]/20 font-bold mr-1.5">
                      {target.properties.id}
                    </span>
                    <span className="text-xs font-bold text-white">
                      {target.properties.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#E46A43] font-bold">
                    {target.properties.priority}
                  </span>
                </div>

                <div className="text-[11px] text-[#A0ACB9] space-y-1 mb-2.5">
                  <p><span className="text-white font-semibold">Spectral:</span> {target.properties.spectral_signature}</p>
                  <p><span className="text-white font-semibold">Geology:</span> {target.properties.geological_unit}</p>
                  <p className="text-[10px] text-[#A0ACB9]/80 italic">{target.properties.recommended_eva_activity}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#1E293B]/70">
                  <span className="text-[10px] text-[#A0ACB9] font-mono">
                    {target.geometry.coordinates[0].toFixed(4)}°E, {target.geometry.coordinates[1].toFixed(4)}°N
                  </span>
                  <button
                    onClick={() => onSetTarget(target.geometry.coordinates, target.properties.name)}
                    className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-[#5CC8D7] hover:text-white bg-[#5CC8D7]/10 hover:bg-[#5CC8D7] rounded-md transition-all"
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
        <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
          {geologicUnits.map((unit) => (
            <div
              key={unit.properties.unit_id}
              className="p-3 rounded-xl border border-[#1E293B] bg-[#131B26] hover:border-[#334155] transition-all"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: unit.properties.color }}
                  />
                  {unit.properties.name}
                </span>
                <span className="text-[10px] font-mono text-[#A0ACB9]">
                  {unit.properties.age_period.split(" ")[0]}
                </span>
              </div>

              <p className="text-[11px] text-[#A0ACB9] mb-2 leading-relaxed">
                {unit.properties.description}
              </p>

              <div className="pt-2 border-t border-[#1E293B]/70 flex items-center justify-between text-[10px]">
                <span className="text-[#A0ACB9]">
                  <strong className="text-white">Traversability:</strong> {unit.properties.traversability}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Layers, MapPin, Compass, ArrowRight, ExternalLink, Flame } from "lucide-react";
import { ScienceTargetFeature, GeologicUnitFeature } from "@/types/mars";

interface ScienceTargetsPanelProps {
  onSetTarget: (coords: [number, number], name: string) => void;
  activeTargetId?: string;
  activeSite?: "jezero" | "gale";
}

export default function ScienceTargetsPanel({
  onSetTarget,
  activeTargetId,
  activeSite = "jezero"
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

  const GALE_TARGETS = [
    {
      id: "GALE-01",
      name: "Chocolatal Boxwork Ribs",
      coords: [137.3892, -4.8255] as [number, number],
      mineral: "Sulfate Boxwork Ridges",
      formation: "Mount Sharp Boxwork Foothills",
      ti: "410 (Very High / Bedrock)",
      desc: "Interconnected mineralized fracture network protruding 1-2m above eroded sand hollows."
    },
    {
      id: "GALE-02",
      name: "Gediz Vallis Ridge Contact",
      coords: [137.4150, -4.7120] as [number, number],
      mineral: "Debris Flow Polymict Breccia",
      formation: "Mount Sharp Channel Deposits",
      ti: "340 (Moderate Scree)",
      desc: "Steep boulder-strewn debris flow ridge originating high on Mount Sharp slopes."
    },
    {
      id: "GALE-03",
      name: "Wind-Eroded Sand Moat",
      coords: [137.4010, -4.7820] as [number, number],
      mineral: "Fine Aeolian Basaltic Sand",
      formation: "Inter-Ridge Hollows",
      ti: "115 (Slip Hazard)",
      desc: "Loose active ripple sand hollow. Wheel slip risk requiring navigational diversion."
    }
  ];

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 flex flex-col gap-3.5 border border-slate-200 shadow-md font-sans text-slate-800">
      {/* Header and Toggle */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-sky-50 border border-sky-200 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-[#0284C7]" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-sans">
              {activeSite === "gale" ? "Mount Sharp Science Targets" : "CRISM-Referenced Science Targets"}
            </h3>
            <p className="text-xs text-slate-500 font-sans">
              {activeSite === "gale" ? "MSL Curiosity Landmark Coordinates" : "USGS SIM 3464 Overlays • Reference Context"}
            </p>
          </div>
        </div>

        {activeSite === "jezero" && (
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setTab("crism")}
              className={`px-3 py-1 rounded-lg text-xs font-sans font-semibold transition-all ${
                tab === "crism"
                  ? "bg-white text-[#0284C7] shadow-sm border border-sky-300"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              CRISM ({crismTargets.length})
            </button>
            <button
              onClick={() => setTab("geology")}
              className={`px-3 py-1 rounded-lg text-xs font-sans font-semibold transition-all ${
                tab === "geology"
                  ? "bg-white text-purple-700 shadow-sm border border-purple-300"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              USGS ({geologicUnits.length})
            </button>
          </div>
        )}
      </div>

      {activeSite === "gale" ? (
        /* Gale Crater Targets List */
        <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
          {GALE_TARGETS.map((t) => (
            <div
              key={t.id}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 transition-all space-y-2 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-sky-100 text-[#0284C7] border border-sky-200 font-mono">
                  {t.id}
                </span>
                <span className="text-xs font-mono text-slate-500">
                  {t.coords[0].toFixed(4)}°E, {t.coords[1].toFixed(4)}°S
                </span>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-xs font-sans">{t.name}</h4>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed font-sans">{t.desc}</p>
              </div>
              <div className="flex items-center justify-between pt-1 text-xs border-t border-slate-200">
                <span className="text-slate-500">{t.mineral}</span>
                <button
                  onClick={() => onSetTarget(t.coords, t.name)}
                  className="px-3 py-1 rounded-lg bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-xs flex items-center gap-1 transition-all shadow-sm"
                >
                  <span>Route Here</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Jezero Crater Targets List */
        <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
          {tab === "crism" ? (
            crismTargets.map((target) => (
              <div
                key={target.properties.id}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 transition-all space-y-2 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-sky-100 text-[#0284C7] border border-sky-200 font-mono">
                    {target.properties.id}
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    {(target.geometry.coordinates as number[])[0].toFixed(4)}°E, {(target.geometry.coordinates as number[])[1].toFixed(4)}°N
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs font-sans">{target.properties.name}</h4>
                  <p className="text-xs text-slate-600 mt-0.5 font-sans leading-relaxed">{target.properties.spectral_signature}</p>
                </div>
                <div className="flex items-center justify-between pt-1 text-xs border-t border-slate-200">
                  <span className="text-slate-500">{target.properties.geological_unit}</span>
                  <button
                    onClick={() => onSetTarget(target.geometry.coordinates as [number, number], target.properties.name)}
                    className="px-3 py-1 rounded-lg bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-xs flex items-center gap-1 transition-all shadow-sm"
                  >
                    <span>Route Here</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            geologicUnits.map((unit) => (
              <div
                key={unit.properties.unit_id}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 transition-all space-y-1.5 shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: unit.properties.color }} />
                  <span className="font-bold text-slate-900 text-xs font-sans">{unit.properties.name}</span>
                </div>
                <p className="text-xs text-slate-600 font-sans leading-relaxed">{unit.properties.description}</p>
                <div className="text-xs text-slate-500 font-mono">Code: {unit.properties.unit_id}</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

"use client";

import React from "react";
import { X, Camera, MapPin, Compass, ExternalLink, Calendar, Mountain, Eye } from "lucide-react";
import { RoverObservation } from "@/types/mars";

interface RoverPovModalProps {
  observation: RoverObservation | null;
  onClose: () => void;
}

export default function RoverPovModal({ observation, onClose }: RoverPovModalProps) {
  if (!observation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="relative w-full max-w-2xl bg-[#070B14] border border-white/[0.12] rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#0A0F1D]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#F36C3D]/10 border border-[#F36C3D]/30 flex items-center justify-center text-[#F36C3D]">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-wide uppercase">
                  Ground-Truth POV Briefing Card
                </h3>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#F36C3D]/10 text-[#F36C3D] border border-[#F36C3D]/30 font-bold uppercase">
                  NASA {observation.rover}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                In-situ surface imaging acquired on the Martian surface
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

        {/* Rover Ground Truth Photo */}
        <div className="relative w-full h-80 bg-black flex items-center justify-center overflow-hidden">
          <img
            src={observation.image_url}
            alt={observation.description}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-3 left-3 bg-[#04070D]/90 border border-white/[0.1] px-3 py-1.5 rounded-lg text-xs backdrop-blur-md flex items-center gap-3">
            <span className="font-mono font-bold text-[#F36C3D]">Sol {observation.sol}</span>
            <span className="text-slate-500 font-mono">|</span>
            <span className="text-white font-mono text-[11px]">{observation.instrument}</span>
          </div>
        </div>

        {/* Telemetry and Interpretation Content */}
        <div className="p-6 space-y-4 text-xs">
          <div>
            <h4 className="font-bold text-white text-sm mb-1">{observation.location_name}</h4>
            <p className="text-slate-300 leading-relaxed text-[11px]">{observation.description}</p>
          </div>

          <div className="bg-[#0D1527] p-3.5 rounded-xl border border-white/[0.08] space-y-1.5">
            <span className="font-bold text-[#38BDF8] uppercase tracking-wider text-[10px] font-mono block">
              Planetary Ground-Truth Geologic Assessment
            </span>
            <p className="text-slate-200 leading-relaxed text-[11px]">
              {observation.scientific_context}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/[0.06]">
            <div className="flex items-center gap-2 text-slate-400">
              <MapPin className="w-4 h-4 text-[#38BDF8]" />
              <div>
                <span className="block text-[9px] uppercase font-mono text-slate-500">Rover Coordinates</span>
                <span className="font-mono text-white text-[11px] num-tabular">
                  {observation.coordinates[0].toFixed(4)}°E, {observation.coordinates[1].toFixed(4)}°N
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-400">
              <Mountain className="w-4 h-4 text-[#F36C3D]" />
              <div>
                <span className="block text-[9px] uppercase font-mono text-slate-500">MOLA Elevation</span>
                <span className="font-mono text-white text-[11px] num-tabular">{observation.elevation_m} m</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-white/[0.08] bg-[#0A0F1D] flex items-center justify-between text-xs">
          <span className="text-slate-400 text-[10px] font-mono">
            Source: NASA Planetary Data System (PDS) & AMMOS MMGIS
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#F36C3D] hover:bg-[#e05829] text-white font-mono text-xs font-bold rounded-lg transition-colors shadow-[0_0_15px_rgba(243,108,61,0.25)]"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
}
"use client";

import React from "react";
import { X, Camera, MapPin, Compass, ExternalLink, Calendar, Mountain } from "lucide-react";
import { RoverObservation } from "@/types/mars";

interface RoverPovModalProps {
  observation: RoverObservation | null;
  onClose: () => void;
}

export default function RoverPovModal({ observation, onClose }: RoverPovModalProps) {
  if (!observation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="relative w-full max-w-2xl bg-[#0D121B] border border-[#1E293B] rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E293B] bg-[#131B26]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#E46A43]/10 border border-[#E46A43]/30 rounded-lg text-[#E46A43]">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                Ground-Truth POV Briefing Card
              </h3>
              <p className="text-xs text-[#A0ACB9]">
                In-situ surface imagery acquired by NASA {observation.rover}
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

        {/* Rover Ground Truth Photo */}
        <div className="relative w-full h-72 bg-black flex items-center justify-center overflow-hidden">
          <img
            src={observation.image_url}
            alt={observation.description}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-3 left-3 bg-[#070A10]/90 border border-[#1E293B] px-3 py-1.5 rounded-lg text-xs backdrop-blur-md flex items-center gap-3">
            <span className="font-bold text-[#E46A43]">Sol {observation.sol}</span>
            <span className="text-[#A0ACB9]">|</span>
            <span className="text-white font-medium">{observation.instrument}</span>
          </div>
        </div>

        {/* Telemetry and Interpretation Content */}
        <div className="p-6 space-y-4 text-xs">
          <div>
            <h4 className="font-bold text-white text-sm mb-1">{observation.location_name}</h4>
            <p className="text-[#A0ACB9] leading-relaxed">{observation.description}</p>
          </div>

          <div className="bg-[#131B26] p-3 rounded-xl border border-[#1E293B] space-y-2">
            <span className="font-bold text-[#5CC8D7] uppercase tracking-wider text-[10px] block">
              Planetary Ground-Truth Assessment
            </span>
            <p className="text-white leading-relaxed">
              {observation.scientific_context}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-2 text-[#A0ACB9]">
              <MapPin className="w-4 h-4 text-[#5CC8D7]" />
              <div>
                <span className="block text-[10px]">Rover Coordinates:</span>
                <span className="font-mono text-white">
                  {observation.coordinates[0].toFixed(4)}°E, {observation.coordinates[1].toFixed(4)}°N
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[#A0ACB9]">
              <Mountain className="w-4 h-4 text-[#E46A43]" />
              <div>
                <span className="block text-[10px]">Elevation (MOLA Geoid):</span>
                <span className="font-mono text-white">{observation.elevation_m} m</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-[#1E293B] bg-[#131B26] flex items-center justify-between text-xs">
          <span className="text-[#A0ACB9] text-[11px]">
            Source: NASA Planetary Data System & Raw Images Feed
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#E46A43] hover:bg-[#bd4a37] text-white font-bold rounded-lg transition-colors"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
}

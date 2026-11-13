"use client";

import React, { useState, useEffect } from "react";
import { Thermometer, Wind, Gauge, Radio, Sun, ShieldAlert, Clock } from "lucide-react";

export default function EnvironmentalHud() {
  const [envData, setEnvData] = useState<any>(null);

  useEffect(() => {
    fetch("/data/environmental_telemetry.json")
      .then((res) => res.json())
      .then((data) => setEnvData(data))
      .catch(() => {});
  }, []);

  if (!envData) return null;

  const atmos = envData.atmospheric;
  const rad = envData.radiation;

  return (
    <div className="bg-[#0D121B] border border-[#1E293B] rounded-xl p-4 shadow-xl flex flex-col gap-3">
      <div className="flex items-center justify-between border-b border-[#1E293B] pb-2.5">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Thermometer className="w-4 h-4 text-[#E46A43]" />
          Surface Environment & Radiation HUD
        </h3>
        <span className="text-[10px] text-[#A0ACB9] font-mono">
          MEDA + MSL RAD Calibrated
        </span>
      </div>

      {/* Grid of Atmospheric Gauges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
        {/* Temperature */}
        <div className="bg-[#131B26] p-2.5 rounded-lg border border-[#1E293B]">
          <div className="flex items-center justify-between text-[#A0ACB9] mb-1">
            <span className="text-[10px]">Ambient Air Temp</span>
            <Thermometer className="w-3.5 h-3.5 text-[#E46A43]" />
          </div>
          <div className="text-base font-bold text-white font-mono">
            -21.4°C
          </div>
          <div className="text-[10px] text-[#A0ACB9] mt-0.5">
            Diurnal: -91°C to -15°C
          </div>
        </div>

        {/* Pressure */}
        <div className="bg-[#131B26] p-2.5 rounded-lg border border-[#1E293B]">
          <div className="flex items-center justify-between text-[#A0ACB9] mb-1">
            <span className="text-[10px]">Surface Pressure</span>
            <Gauge className="w-3.5 h-3.5 text-[#5CC8D7]" />
          </div>
          <div className="text-base font-bold text-white font-mono">
            752 Pa
          </div>
          <div className="text-[10px] text-[#A0ACB9] mt-0.5">
            ~0.74% Earth 1 atm
          </div>
        </div>

        {/* Wind & Dust */}
        <div className="bg-[#131B26] p-2.5 rounded-lg border border-[#1E293B]">
          <div className="flex items-center justify-between text-[#A0ACB9] mb-1">
            <span className="text-[10px]">Wind Velocity</span>
            <Wind className="w-3.5 h-3.5 text-[#62C99B]" />
          </div>
          <div className="text-base font-bold text-white font-mono">
            5.6 m/s
          </div>
          <div className="text-[10px] text-[#A0ACB9] mt-0.5">
            Dust Tau: {atmos.dust_optical_depth_tau}
          </div>
        </div>

        {/* Radiation Dose */}
        <div className="bg-[#131B26] p-2.5 rounded-lg border border-[#1E293B]">
          <div className="flex items-center justify-between text-[#A0ACB9] mb-1">
            <span className="text-[10px]">GCR / Solar Dose</span>
            <Radio className="w-3.5 h-3.5 text-[#E8B65A]" />
          </div>
          <div className="text-base font-bold text-[#E8B65A] font-mono">
            23.3 µSv/h
          </div>
          <div className="text-[10px] text-[#A0ACB9] mt-0.5">
            Baseline: 0.56 mSv/day
          </div>
        </div>
      </div>

      {/* Recommended EVA Window Banner */}
      <div className="flex items-center justify-between bg-[#131B26] px-3 py-2 rounded-lg border border-[#5CC8D7]/30 text-xs">
        <div className="flex items-center gap-2">
          <Sun className="w-4 h-4 text-[#E8B65A]" />
          <span className="text-white font-medium">Optimal Surface EVA Operating Window:</span>
          <span className="font-mono text-[#5CC8D7] font-bold">10:00 – 14:30 LTST</span>
        </div>
        <span className="text-[10px] px-2 py-0.5 bg-[#62C99B]/10 text-[#62C99B] rounded font-semibold border border-[#62C99B]/30">
          Thermal Nominal
        </span>
      </div>
    </div>
  );
}

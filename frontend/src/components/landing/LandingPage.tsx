"use client";

import React from "react";
import { 
  Compass, 
  MapPin, 
  Mountain, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Activity, 
  Layers, 
  Eye, 
  Zap, 
  Flame, 
  Radio, 
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Gauge,
  Thermometer,
  Shield,
  Clock,
  Orbit,
  Globe2,
  AlertTriangle,
  Info
} from "lucide-react";
import dynamic from "next/dynamic";
import NasaMissionGallery from "@/components/landing/NasaMissionGallery";

const RotatingMarsGlobe = dynamic(
  () => import("@/components/landing/RotatingMarsGlobe"),
  { ssr: false, loading: () => <div className="w-full max-w-[340px] sm:max-w-[400px] aspect-square rounded-3xl bg-[#030712]/70 border border-white/10 flex items-center justify-center text-xs font-mono text-slate-500 mx-auto">Loading 3D Mars Globe...</div> }
);

const SolarSystemBackground = dynamic(
  () => import("@/components/landing/SolarSystemBackground"),
  { ssr: false }
);

interface LandingPageProps {
  onEnterWorkspace: () => void;
  onOpenProvenance: () => void;
  onSelectSite: (site: "jezero" | "gale") => void;
  onOpen3D?: () => void;
}

export default function LandingPage({
  onEnterWorkspace,
  onOpenProvenance,
  onSelectSite,
  onOpen3D
}: LandingPageProps) {
  return (
    <div className="w-full bg-[#04070D] text-[#F8FAFC] min-h-screen flex flex-col space-grid-bg selection:bg-[#FC3D21] selection:text-white font-sans">
      
      {/* 1. CINEMATIC MISSION HERO WITH TRANSLUCENT FROSTED GLASS HUD & VISIBLE VISTA */}
      <section className="relative w-full min-h-[92vh] flex flex-col items-center justify-center overflow-hidden px-4 sm:px-6 pt-10 pb-20">
        
        {/* Layer A: Pure Cosmic Deep-Space Backdrop */}
        <div className="absolute inset-0 bg-[#030712] pointer-events-none" />

        {/* Layer B: Real-Time 3D Solar System Planetary Orbits & Starfield */}
        <SolarSystemBackground />

        {/* Layer C: Gentle Warm Planetary Horizon Arc (Atmospheric depth, clean & elegant) */}
        <div className="absolute bottom-0 inset-x-0 h-[480px] bg-[radial-gradient(ellipse_at_50%_100%,rgba(243,108,61,0.18),transparent_70%)] pointer-events-none" />

        {/* Centered Hero Content Container */}
        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center text-center space-y-6 pt-2">
          
          {/* Institutional Mission Insignia Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#050C1C]/80 border border-white/15 text-xs font-mono text-[#38BDF8] shadow-2xl backdrop-blur-md">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#38BDF8] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#38BDF8]" />
            </span>
            <span className="tracking-widest font-bold uppercase text-[11px] text-[#38BDF8]">
              NASA SPACE APPS CHALLENGE 2026
            </span>
            <span className="text-white/20">|</span>
            <span className="text-slate-300 font-mono text-[11px] hidden sm:inline">
              INTERPLANETARY SURVIVAL GUIDE: MARTIAN MAP
            </span>
          </div>

          {/* Primary High-Impact Headline inside Translucent Aerospace Glass Container */}
          <div className="w-full max-w-4xl bg-[#040A18]/30 backdrop-blur-md border border-white/10 rounded-3xl p-6 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.7)] space-y-5">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white uppercase font-sans leading-[1.03] drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
              EXPLORE MARS. <br />
              <span className="text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
                UNDERSTAND TERRAIN.
              </span> <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F36C3D] via-[#f79471] to-[#E8B85A] drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
                PLAN EVERY TRAVERSE.
              </span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-200 font-normal leading-relaxed drop-shadow-md">
              MarsAtlas is an experimental planetary exploration platform combining Martian geospatial context, rover observations, and computational A* traverse planning to help users investigate terrain and compare exploration routes.
            </p>

            {/* Prototype Disclaimer Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-mono mx-auto">
              <Info className="w-3.5 h-3.5 flex-shrink-0 text-amber-400" />
              <span>Experimental research prototype • Not a certified astronaut navigation or safety system</span>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-3">
              <button
                onClick={onEnterWorkspace}
                className="px-7 py-3.5 bg-[#FC3D21] hover:bg-[#E0341B] text-white font-bold tracking-wider uppercase text-xs sm:text-sm rounded-xl shadow-xl shadow-[#FC3D21]/30 flex items-center gap-2.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Activity className="w-4 h-4 text-white" />
                <span>Launch Mission Console</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>

              {onOpen3D && (
                <button
                  onClick={onOpen3D}
                  className="px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-[#38BDF8] text-white font-bold text-xs sm:text-sm rounded-xl flex items-center gap-2.5 transition-all shadow-lg backdrop-blur-md"
                >
                  <Mountain className="w-4 h-4 text-[#38BDF8]" />
                  <span>Explore 3D Terrain Model</span>
                </button>
              )}

              <button
                onClick={onOpenProvenance}
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-[#34D399] text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-2 transition-all backdrop-blur-md"
              >
                <ShieldCheck className="w-4 h-4 text-[#34D399]" />
                <span>Epistemic Data Matrix</span>
              </button>
            </div>
          </div>

          {/* Operational Telemetry Metrics Strip */}
          <div className="pt-2 w-full max-w-4xl grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
            <div className="p-4 rounded-2xl bg-[#040A18]/40 backdrop-blur-md border border-white/10 space-y-1 shadow-lg hover:border-white/20 transition-all">
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">559</div>
              <div className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Drive Legs</div>
              <div className="text-[11px] text-slate-400">Perseverance Sols 13–2022 (MMGIS)</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#040A18]/40 backdrop-blur-md border border-white/10 space-y-1 shadow-lg hover:border-white/20 transition-all">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#38BDF8] tracking-tight">11.3 m</div>
              <div className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Spatial Cell</div>
              <div className="text-[11px] text-slate-400">350 × 550 Surrogate Grid</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#040A18]/40 backdrop-blur-md border border-white/10 space-y-1 shadow-lg hover:border-white/20 transition-all">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#FBBF24] tracking-tight">&le; 22.0°</div>
              <div className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Planner Cutoff</div>
              <div className="text-[11px] text-slate-400">Algorithmic Slope Constraint</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#040A18]/40 backdrop-blur-md border border-white/10 space-y-1 shadow-lg hover:border-white/20 transition-all">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#34D399] tracking-tight">0.38 g</div>
              <div className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Mars Gravity</div>
              <div className="text-[11px] text-slate-400">Pandolf-Santee 160 kg Ensemble</div>
            </div>
          </div>

          {/* Dual Aerospace Command Showcase: 3D Rotating Mars + Boxed Flight Insignia */}
          <div className="w-full max-w-5xl mx-auto pt-6 grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch text-left">
            
            {/* Box 1: Interactive 3D Planetary Observatory */}
            <div className="p-5 rounded-3xl bg-[#050B17]/70 backdrop-blur-xl border border-white/15 shadow-[0_12px_48px_rgba(0,0,0,0.8)] flex flex-col items-center justify-between space-y-4">
              <div className="w-full flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FC3D21] animate-ping" />
                  <span className="text-xs font-bold text-white font-sans uppercase tracking-wider">3D Planetary Observatory</span>
                </div>
                <span className="text-[10px] font-mono text-[#38BDF8] px-2 py-0.5 rounded bg-[#38BDF8]/10 border border-[#38BDF8]/20">
                  Mars IAU2000
                </span>
              </div>

              <div className="w-full flex justify-center py-1">
                <RotatingMarsGlobe />
              </div>

              <div className="w-full pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Axial Tilt: 25.19°</span>
                <span className="text-[#34D399]">Drag to Spin Globe</span>
              </div>
            </div>

            {/* Box 2: Official Mission Emblem & Flight Insignia ("logo tha na ek box me wo bhi accha lag raha tha") */}
            <div className="p-5 rounded-3xl bg-[#050B17]/70 backdrop-blur-xl border border-white/15 shadow-[0_12px_48px_rgba(0,0,0,0.8)] flex flex-col justify-between space-y-4 relative group">
              <div className="w-full flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
                  <span className="text-xs font-bold text-white font-sans uppercase tracking-wider">Official Flight Insignia</span>
                </div>
                <span className="text-[10px] font-mono text-[#FC3D21] px-2 py-0.5 rounded bg-[#FC3D21]/10 border border-[#FC3D21]/20 font-bold uppercase">
                  Space Apps 2026
                </span>
              </div>

              {/* Insignia Graphic Frame */}
              <div className="relative group max-w-[340px] sm:max-w-[380px] w-full mx-auto my-auto">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#FC3D21]/40 via-[#F97316]/25 to-[#38BDF8]/40 rounded-2xl blur-lg opacity-70 group-hover:opacity-100 transition duration-500" />
                <div className="relative rounded-2xl overflow-hidden border border-white/20 bg-[#070B14] shadow-2xl">
                  <img
                    src="/marsatlas-brand.jpg"
                    alt="MarsAtlas Official Mission Emblem"
                    className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-md bg-black/85 border border-white/10 text-[10px] font-mono text-[#38BDF8] backdrop-blur-md flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse" />
                    <span>MISSION EMBLEM</span>
                  </div>
                </div>
              </div>

              {/* Mission Badge Description */}
              <div className="w-full pt-3 border-t border-white/10 space-y-1 text-left">
                <span className="text-[10px] font-mono font-bold text-[#FC3D21] tracking-widest uppercase block">
                  Integrated Terrain Intelligence
                </span>
                <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                  Official mission emblem commemorating Perseverance at Jezero Crater, the human exploration ascent horizon, and autonomous traverse planning.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 2. AUTHENTIC PROJECT-SPECIFIC NASA MISSIONS & OBSERVATION ARCHIVES */}
      <NasaMissionGallery />

      {/* 3. THREE PILLARS (THE SCIENTIFIC PROBLEMS MARSATLAS SOLVES) */}
      <section id="overview" className="w-full py-20 px-4 sm:px-6 bg-[#070B14]/80 border-t border-b border-white/[0.08]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold text-[#FC3D21] tracking-widest uppercase">
              OPERATIONAL EVA CAPABILITIES
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight font-sans">
              From Planetary Data to Exploration Decisions
            </h2>
            <p className="max-w-2xl mx-auto text-xs sm:text-sm text-slate-300 leading-relaxed">
              MarsAtlas connects planetary orbital observations and in-situ rover telemetry with computational A* pathfinding and bioenergetic equations to evaluate exploration feasibility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-[#0A0F1D] border border-white/10 hover:border-white/25 transition-all space-y-4 shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-[#FC3D21]/15 border border-[#FC3D21]/30 flex items-center justify-center text-[#FC3D21]">
                <Mountain className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-[#FC3D21] font-bold tracking-wider uppercase">PILLAR 01</span>
                <h3 className="text-base font-bold text-white uppercase tracking-wide font-sans">
                  Topographic Terrain Analysis
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Visual imagery alone masks steep slopes and regolith hazards. MarsAtlas evaluates surface incline gradients with Horn&apos;s 3×3 finite-difference algorithm, local roughness standard deviations, and thermophysical proxy coefficients across the modelled sector.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-[#0A0F1D] border border-white/10 hover:border-white/25 transition-all space-y-4 shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-[#38BDF8]/15 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8]">
                <Activity className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-[#38BDF8] font-bold tracking-wider uppercase">PILLAR 02</span>
                <h3 className="text-base font-bold text-white uppercase tracking-wide font-sans">
                  Human Bioenergetic Workload
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Computes 8-connected A* traverse options using Pandolf-Santee bioenergetic equations adapted for a 160 kg suited system in Martian gravity (0.376 g). Compares three algorithmic preferences: <em>Lower-Slope Preference</em>, <em>Balanced Preference</em>, and <em>Science Priority</em> with an enforced 22.0° slope ceiling.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-[#0A0F1D] border border-white/10 hover:border-white/25 transition-all space-y-4 shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-[#34D399]/15 border border-[#34D399]/30 flex items-center justify-center text-[#34D399]">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-[#34D399] font-bold tracking-wider uppercase">PILLAR 03</span>
                <h3 className="text-base font-bold text-white uppercase tracking-wide font-sans">
                  Science Context Along Traverse
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Connects planned corridors with real Perseverance rover telemetry (708 waypoints, 559 drive legs), in-situ camera observations, simplified USGS SIM 3464 geological formations, and manually authored CRISM-referenced science targets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. DATA SOURCES & IMPLEMENTATION STATUS (HIGH-CONTRAST LIGHT THEME) */}
      <section className="w-full py-20 px-4 sm:px-6 bg-slate-50 border-y border-slate-200">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <span className="text-xs font-mono font-bold text-[#C2410C] tracking-widest uppercase">
                SCIENTIFIC RIGOR &amp; PROVENANCE
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight font-sans">
                Planetary Data and Scientific Context
              </h2>
            </div>
            <button
              onClick={onOpenProvenance}
              className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 hover:border-slate-400 text-slate-800 hover:text-slate-900 text-xs font-bold rounded-lg flex items-center gap-2 transition-all shadow-sm hover:shadow self-start md:self-auto"
            >
              <ShieldCheck className="w-4 h-4 text-[#0284C7]" />
              <span>Inspect Epistemic Matrix</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
            {/* 1. Global Basemap */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 space-y-2.5 shadow-sm hover:shadow-md transition-all">
              <span className="text-[10px] font-mono text-[#0369A1] bg-[#E0F2FE] px-2 py-0.5 rounded font-bold uppercase tracking-wider inline-block">Operational Base</span>
              <h4 className="font-bold text-slate-900 text-sm font-sans">USGS Viking &amp; MOLA WMS</h4>
              <p className="text-slate-600 text-[11px] leading-relaxed font-sans">
                Global MDIM2.1 color mosaic and MOLA shaded relief streamed via USGS Astrogeology WMS.
              </p>
              <div className="pt-2 border-t border-slate-100 text-[10px] text-[#0369A1] font-mono font-semibold">
                EPSG:104905 Projection
              </div>
            </div>

            {/* 2. Topo Surrogate */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 space-y-2.5 shadow-sm hover:shadow-md transition-all">
              <span className="text-[10px] font-mono text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded font-bold uppercase tracking-wider inline-block">Terrain Model</span>
              <h4 className="font-bold text-slate-900 text-sm font-sans">EVA Prototype Sector</h4>
              <p className="text-slate-600 text-[11px] leading-relaxed font-sans">
                350 × 550 surrogate grid (11.3 m spacing) for prototype route comparison and slope evaluation.
              </p>
              <div className="pt-2 border-t border-slate-100 text-[10px] text-[#15803D] font-mono font-semibold">
                Surrogate Grid (.npz)
              </div>
            </div>

            {/* 3. Rover Telemetry */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 space-y-2.5 shadow-sm hover:shadow-md transition-all">
              <span className="text-[10px] font-mono text-[#C2410C] bg-[#FFEDD5] px-2 py-0.5 rounded font-bold uppercase tracking-wider inline-block">Real Telemetry</span>
              <h4 className="font-bold text-slate-900 text-sm font-sans">NASA-AMMOS MMGIS</h4>
              <p className="text-slate-600 text-[11px] leading-relaxed font-sans">
                708 Perseverance waypoints and 559 traverse legs from landing through Sol 2022.
              </p>
              <div className="pt-2 border-t border-slate-100 text-[10px] text-[#C2410C] font-mono font-semibold">
                Real Spacecraft Data
              </div>
            </div>

            {/* 4. Geology Overlays */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 space-y-2.5 shadow-sm hover:shadow-md transition-all">
              <span className="text-[10px] font-mono text-[#7C3AED] bg-[#F3E8FF] px-2 py-0.5 rounded font-bold uppercase tracking-wider inline-block">Simplified Context</span>
              <h4 className="font-bold text-slate-900 text-sm font-sans">USGS SIM 3464 Overlays</h4>
              <p className="text-slate-600 text-[11px] leading-relaxed font-sans">
                5 hand-simplified polygon units after Sun &amp; Stack (2020) illustrating regional geological context.
              </p>
              <div className="pt-2 border-t border-slate-100 text-[10px] text-[#7C3AED] font-mono font-semibold">
                Simplified Polygon Layer
              </div>
            </div>

            {/* 5. Science Targets */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 space-y-2.5 shadow-sm hover:shadow-md transition-all">
              <span className="text-[10px] font-mono text-[#B45309] bg-[#FEF3C7] px-2 py-0.5 rounded font-bold uppercase tracking-wider inline-block">Authored Targets</span>
              <h4 className="font-bold text-slate-900 text-sm font-sans">CRISM-Referenced Points</h4>
              <p className="text-slate-600 text-[11px] leading-relaxed font-sans">
                5 manually authored locations referencing published CRISM observations (no live spectral cube processing).
              </p>
              <div className="pt-2 border-t border-slate-100 text-[10px] text-[#B45309] font-mono font-semibold">
                Authored Reference Data
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. DUAL STUDY SITES (JEZERO CRATER & GALE BOXWORK) */}
      <section className="w-full py-20 px-4 sm:px-6 bg-[#070B14]/80 border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/2 space-y-4">
            <span className="text-xs font-mono font-bold text-[#38BDF8] tracking-widest uppercase">
              SURFACE OPERATIONAL SANDBOXES
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-sans">
              Jezero Crater &amp; Mount Sharp Boxwork
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Targeted by NASA for ancient habitability and biosignature preservation. MarsAtlas provides dual regional contexts: the <strong>Jezero Crater Western Delta</strong> (primary study region with active routing) and the <strong>Gale Crater Mount Sharp Boxwork</strong> (comparative regional preset).
            </p>

            <div className="space-y-2 pt-2 text-xs">
              <div className="flex items-center gap-2.5 text-white">
                <CheckCircle2 className="w-4 h-4 text-[#34D399]" />
                <span>Elevation Span: -2605 m (Crater Floor) to -2121 m (Delta Contact)</span>
              </div>
              <div className="flex items-center gap-2.5 text-white">
                <CheckCircle2 className="w-4 h-4 text-[#34D399]" />
                <span>Horn&apos;s Slope Range: 0.0° to 22.7° (Enforced ≤22.0° Planner Exclusion Cutoff)</span>
              </div>
              <div className="flex items-center gap-2.5 text-white">
                <CheckCircle2 className="w-4 h-4 text-[#34D399]" />
                <span>Curiosity Boxwork Ridges Telemetry Context through Sol 5073</span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  onSelectSite("jezero");
                  onEnterWorkspace();
                }}
                className="px-6 py-3 bg-[#FC3D21] hover:bg-[#E0341B] text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-[#FC3D21]/30 uppercase tracking-wider"
              >
                <span>Launch Jezero Mission Map</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>

              <button
                onClick={() => {
                  onSelectSite("gale");
                  onEnterWorkspace();
                }}
                className="px-6 py-3 bg-white/5 hover:bg-white/15 border border-white/15 text-[#38BDF8] font-bold text-xs rounded-xl transition-all"
              >
                <span>Inspect Gale Boxwork</span>
              </button>
            </div>
          </div>

          <div className="w-full md:w-1/2 relative rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-black">
            <img
              src="/data/jezero_slope_hazard.png"
              alt="Jezero Slope Hazard Map"
              className="w-full h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#04070D] via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 bg-[#070B14]/90 backdrop-blur-md border border-white/15 p-3.5 rounded-xl flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-white block">Horn&apos;s Method Slope Hazard Map</span>
                <span className="text-[10px] text-slate-300">Green (&lt;8° Low Slope) | Amber (8-14° Moderate Incline) | Crimson (&gt;14° Steep Grade)</span>
              </div>
              <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/30 font-bold">
                Surrogate Grid
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. OFFICIAL MISSION INSIGNIA & PROJECT IDENTITY (DEDICATED SECTION) */}
      <section className="w-full py-20 px-4 sm:px-6 bg-[#040813] border-t border-white/[0.08] relative overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[radial-gradient(ellipse,rgba(252,61,33,0.12),transparent_70%)] blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10 relative z-10">
          {/* Emblem Visual with Holographic Framing */}
          <div className="w-full md:w-5/12 flex justify-center">
            <div className="relative group max-w-[340px] sm:max-w-[380px] w-full">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-[#FC3D21]/50 via-[#F97316]/30 to-[#38BDF8]/50 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition duration-500" />
              <div className="relative rounded-2xl overflow-hidden border border-white/20 bg-[#070B14] shadow-2xl">
                <img
                  src="/marsatlas-brand.jpg"
                  alt="Official MarsAtlas Mission Insignia"
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-3 right-3 px-3 py-1 rounded-lg bg-black/85 border border-white/15 text-[10px] font-mono text-[#38BDF8] backdrop-blur-md flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse" />
                  <span>OFFICIAL FLIGHT EMBLEM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Insignia Symbology & Story */}
          <div className="w-full md:w-7/12 space-y-4">
            <div className="space-y-1.5">
              <span className="text-xs font-mono font-bold text-[#FC3D21] tracking-widest uppercase">
                OFFICIAL FLIGHT PATCH &amp; SYMBOLOGY
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-sans">
                MarsAtlas Project Identity
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              Designed for the 2026 NASA Space Apps Challenge, the MarsAtlas emblem combines the delta front contact of Jezero Crater with autonomous EVA pathfinding vectors.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                <span className="font-bold text-[#FC3D21] block">Apex 'A' Chevron</span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Represents the ascent trajectory and computational traverse corridors across Martian terrain.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                <span className="font-bold text-[#38BDF8] block">Orbital Trajectory Ring</span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Symbolizes Mars IAU2000 equirectangular orbital mapping linking ground telemetry to satellite observations.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                <span className="font-bold text-[#34D399] block">Surface Rover Silhouette</span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Commemorates the Perseverance Mars 2020 exploration campaign through Sol 2022.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                <span className="font-bold text-[#FBBF24] block">Mars Horizon Arc</span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Depicts the Jezero modeled sector elevation gradient (-2605m to -2121m).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. INSTITUTIONAL AGENCY FOOTER */}
      <footer className="w-full py-14 px-4 sm:px-6 bg-[#030712] border-t border-white/10 text-xs text-slate-400">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3.5">
            <img src="/marsatlas-brand.jpg" alt="MarsAtlas" className="w-9 h-9 rounded-full border border-white/20 object-cover" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm tracking-wide font-sans">MARSATLAS</span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#FC3D21]/20 text-[#FC3D21] border border-[#FC3D21]/30 font-bold uppercase">
                  RESEARCH PROTOTYPE
                </span>
              </div>
              <p className="text-[11px] text-slate-500">NASA International Space Apps Challenge 2026 // Planetary Geospatial Division</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <button
              onClick={onOpenProvenance}
              className="text-[#38BDF8] hover:underline"
            >
              Epistemic Provenance
            </button>
            <span className="text-white/20">•</span>
            <a
              href="https://github.com/shubham25-droid/MarsAtlas"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-[#FC3D21] transition-colors"
            >
              GitHub Source Code
            </a>
          </div>

          <div className="text-center md:text-right text-[11px] text-slate-500 space-y-1">
            <p>Data Sources: USGS Astrogeology Science Center, NASA Solar System Treks (JPL), NASA PDS &amp; MMGIS.</p>
            <p>Built for the NASA Space Apps Challenge 2026. Does not imply official NASA endorsement.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

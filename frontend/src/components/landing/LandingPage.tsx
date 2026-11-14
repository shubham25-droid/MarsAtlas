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
  Box,
  Maximize2
} from "lucide-react";
import NasaMissionGallery from "@/components/landing/NasaMissionGallery";

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
    <div className="w-full bg-[#030712] text-[#F8FAFC] min-h-screen flex flex-col space-grid-bg selection:bg-[#FC3D21] selection:text-white font-sans">
      {/* 1. CINEMATIC MISSION HERO SECTION */}
      <section className="relative w-full min-h-[88vh] flex flex-col items-center justify-center overflow-hidden px-4 sm:px-6 pt-12 pb-20">
        {/* Deep Space Radial Gradient & Atmospheric Rim */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-15%,rgba(56,189,248,0.12),rgba(3,7,18,0.98))] pointer-events-none" />
        
        {/* Mars Horizon Glow */}
        <div className="absolute -bottom-72 w-[130vw] max-w-[1400px] h-[550px] rounded-[100%] bg-gradient-to-t from-[#FC3D21]/20 via-[#D96B3B]/10 to-transparent blur-3xl pointer-events-none" />

        {/* Ambient Grid overlay */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px]" />

        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center text-center space-y-7">
          {/* Official Agency Initiative Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#0C1220] border border-white/[0.1] text-xs shadow-xl backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#FC3D21] animate-pulse" />
            <span className="font-mono font-bold text-[#FC3D21] tracking-widest uppercase text-[11px]">
              NASA SPACE APPS CHALLENGE 2026
            </span>
            <span className="text-white/20">|</span>
            <span className="text-[#94A3B8] font-mono text-[11px] hidden sm:inline">
              INTERPLANETARY SURVIVAL GUIDE: MARTIAN MAP
            </span>
          </div>

          {/* Primary Scientific Title */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white uppercase font-sans leading-[1.08]">
              Explore Mars. <br />
              <span className="bg-gradient-to-r from-white via-[#F8FAFC] to-[#94A3B8] bg-clip-text text-transparent">
                Understand Terrain.
              </span> <br />
              <span className="bg-gradient-to-r from-[#FC3D21] via-[#F36C3D] to-[#E8B85A] bg-clip-text text-transparent">
                Plan Every Traverse.
              </span>
            </h1>
            <p className="max-w-3xl mx-auto text-sm sm:text-base md:text-lg text-[#94A3B8] font-normal leading-relaxed">
              MarsAtlas bridges raw orbital observations, metric terrain topography, and rover telemetry with human bioenergetic constraints. Designed for future human exploration of Jezero and Gale Craters.
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <button
              onClick={onEnterWorkspace}
              className="px-7 py-3.5 bg-[#FC3D21] hover:bg-[#d62d16] text-white font-bold text-xs sm:text-sm rounded-xl flex items-center gap-2.5 transition-all shadow-xl shadow-[#FC3D21]/30 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Activity className="w-4 h-4" />
              <span>Launch Mission Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {onOpen3D && (
              <button
                onClick={onOpen3D}
                className="px-6 py-3.5 bg-[#0C1220] hover:bg-[#162034] border border-white/[0.12] hover:border-[#38BDF8] text-white font-semibold text-xs sm:text-sm rounded-xl flex items-center gap-2.5 transition-all shadow-lg backdrop-blur-md"
              >
                <Mountain className="w-4 h-4 text-[#38BDF8]" />
                <span>Explore 3D Terrain Model</span>
              </button>
            )}

            <button
              onClick={onOpenProvenance}
              className="px-5 py-3.5 bg-[#0C1220]/80 hover:bg-[#162034] border border-white/[0.08] hover:border-[#34D399]/40 text-[#CBD5E1] text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-2 transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-[#34D399]" />
              <span>Epistemic Data Matrix</span>
            </button>
          </div>

          {/* Real-Time Operational Telemetry Strip */}
          <div className="pt-8 w-full max-w-4xl grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
            <div className="p-3.5 rounded-xl bg-[#0C1220]/80 border border-white/[0.06] backdrop-blur-md space-y-1">
              <span className="text-[10px] font-mono text-[#64748B] uppercase font-bold tracking-wider block">Rover Telemetry</span>
              <span className="text-white font-mono font-bold text-sm">559 Drive Legs</span>
              <span className="text-[10px] text-[#94A3B8] block">Perseverance MMGIS Sols 13–2022</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0C1220]/80 border border-white/[0.06] backdrop-blur-md space-y-1">
              <span className="text-[10px] font-mono text-[#64748B] uppercase font-bold tracking-wider block">Metric Grid</span>
              <span className="text-[#38BDF8] font-mono font-bold text-sm">11.3m Spatial Cell</span>
              <span className="text-[10px] text-[#94A3B8] block">550 × 350 Modelled Sector</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0C1220]/80 border border-white/[0.06] backdrop-blur-md space-y-1">
              <span className="text-[10px] font-mono text-[#64748B] uppercase font-bold tracking-wider block">Safety Envelope</span>
              <span className="text-[#FBBF24] font-mono font-bold text-sm">θ ≤ 22.0° Limit</span>
              <span className="text-[10px] text-[#94A3B8] block">Horn 3×3 Finite Difference</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0C1220]/80 border border-white/[0.06] backdrop-blur-md space-y-1">
              <span className="text-[10px] font-mono text-[#64748B] uppercase font-bold tracking-wider block">Bioenergetics</span>
              <span className="text-[#34D399] font-mono font-bold text-sm">0.376g Mars Gravity</span>
              <span className="text-[10px] text-[#94A3B8] block">Pandolf-Santee 160kg Suit</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. NASA MISSIONS & PLANETARY VISUAL ARCHIVES (MATCHING OFFICIAL NASA.GOV) */}
      <NasaMissionGallery />

      {/* 3. 3D WEBGL TACTICAL SECTOR VIEWER SPOTLIGHT */}
      <section className="w-full py-20 px-4 sm:px-6 bg-[#070B14] border-t border-white/[0.08] relative overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-10">
          <div className="w-full lg:w-1/2 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#38BDF8]/10 border border-[#38BDF8]/30 text-xs font-mono text-[#38BDF8] font-bold">
              <Mountain className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>TACTICAL 3D ELEVATION VIEWER</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight font-sans">
              Inspect Steep Scarps and Ridges in True 3D
            </h2>
            <p className="text-sm text-[#94A3B8] leading-relaxed">
              Orbital 2D maps obscure slope severity. The MarsAtlas 3D tactical viewer reconstructs the Jezero delta rim in real-time WebGL, overlaying <strong>Horn&apos;s slope hazard classification</strong>, dynamic solar illumination, and elevated 3D A* traverse trajectories.
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5 text-white">
                <CheckCircle2 className="w-4 h-4 text-[#34D399] mt-0.5 flex-shrink-0" />
                <span><strong>Slope Hazard Shading:</strong> Green (&lt;8° Safe), Amber (8–14° Caution), Crimson (&gt;14° Scarp Hazard) mapped directly onto relief mesh.</span>
              </div>
              <div className="flex items-start gap-2.5 text-white">
                <CheckCircle2 className="w-4 h-4 text-[#34D399] mt-0.5 flex-shrink-0" />
                <span><strong>Multi-Objective 3D Traverses:</strong> Compare Safe, Balanced, and Science routes winding around crater obstacles in physical space.</span>
              </div>
              <div className="flex items-start gap-2.5 text-white">
                <CheckCircle2 className="w-4 h-4 text-[#34D399] mt-0.5 flex-shrink-0" />
                <span><strong>Solar Lighting Simulation:</strong> Adjust sun azimuth and altitude to predict shadow casting across scarp walls during morning vs afternoon EVAs.</span>
              </div>
            </div>

            <div className="pt-3">
              {onOpen3D ? (
                <button
                  onClick={onOpen3D}
                  className="px-6 py-3 bg-[#FC3D21] hover:bg-[#d62d16] text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-[#FC3D21]/25"
                >
                  <Mountain className="w-4 h-4" />
                  <span>Launch Interactive 3D Sector Model</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={onEnterWorkspace}
                  className="px-6 py-3 bg-[#FC3D21] hover:bg-[#d62d16] text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-lg"
                >
                  <span>Launch Mission Console</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Interactive Preview Mockup Card */}
          <div 
            onClick={onOpen3D}
            className="w-full lg:w-1/2 relative rounded-2xl overflow-hidden border border-white/[0.12] bg-[#0A0F1D] shadow-2xl cursor-pointer group"
          >
            <img
              src="/data/jezero_slope_hazard.png"
              alt="Jezero 3D Slope Hazard Surface"
              className="w-full h-80 sm:h-96 object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
            
            {/* Center Play/Inspect Badge */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-[#070B14]/80 border border-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:scale-110 group-hover:border-[#38BDF8] transition-all shadow-2xl">
                <Mountain className="w-7 h-7 text-[#38BDF8]" />
              </div>
            </div>

            <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-[#070B14]/85 border border-white/[0.1] backdrop-blur-md flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-white block">Click to Open Fullscreen 3D Viewer</span>
                <span className="text-[10px] text-[#94A3B8]">Horn 3×3 Gradient • WebGL 2.0 • Real Topography</span>
              </div>
              <span className="px-2.5 py-1 rounded-md font-mono text-[10px] bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/40 font-bold">
                LAUNCH 3D
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THREE PILLARS (THE SCIENTIFIC PROBLEMS MARSATLAS SOLVES) */}
      <section className="w-full py-24 px-4 sm:px-6 bg-[#030712] border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono font-bold text-[#FC3D21] tracking-widest uppercase">
              OPERATIONAL EVA CAPABILITIES
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight font-sans">
              From Planetary Data to Exploration Decisions
            </h2>
            <p className="max-w-2xl mx-auto text-sm text-[#94A3B8] leading-relaxed">
              Standard maps show what is on Mars. MarsAtlas computes what an astronaut in a pressurized spacesuit can safely traverse, survive, and sample.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-[#0A0F1D] border border-white/[0.08] hover:border-[#38BDF8]/40 transition-all space-y-4 shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-[#38BDF8]/10 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8]">
                <Layers className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-[#38BDF8] font-bold tracking-wider uppercase">PILLAR 01</span>
                <h3 className="text-base font-bold text-white uppercase tracking-wide font-sans">
                  Beyond Visible Imagery
                </h3>
              </div>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Optical photos mask treacherous slopes and loose regolith. MarsAtlas combines 1m elevation models with Horn&apos;s gradient equations and THEMIS nighttime thermal inertia to classify mechanical slip hazards before boots touch dust.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-[#0A0F1D] border border-white/[0.08] hover:border-[#FC3D21]/40 transition-all space-y-4 shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-[#FC3D21]/10 border border-[#FC3D21]/30 flex items-center justify-center text-[#FC3D21]">
                <Activity className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-[#FC3D21] font-bold tracking-wider uppercase">PILLAR 02</span>
                <h3 className="text-base font-bold text-white uppercase tracking-wide font-sans">
                  Human Bioenergetic Margins
                </h3>
              </div>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Computes 8-connected A* traverses using the Pandolf-Santee bioenergetics model adapted to 0.38g Mars gravity. Compares Safe, Balanced, and Science modes with walkback safety envelopes respecting strict 160 kg suit mass constraints.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-[#0A0F1D] border border-white/[0.08] hover:border-[#34D399]/40 transition-all space-y-4 shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-[#34D399]/10 border border-[#34D399]/30 flex items-center justify-center text-[#34D399]">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-[#34D399] font-bold tracking-wider uppercase">PILLAR 03</span>
                <h3 className="text-base font-bold text-white uppercase tracking-wide font-sans">
                  Science Along the Traverse
                </h3>
              </div>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Connects orbital routes directly to Perseverance and Curiosity ground-truth telemetry. Astronauts inspect nearest in-situ Mastcam-Z panoramas, SuperCam telescopic details, and USGS SIM 3464 carbonate/smectite contacts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FIVE AUTHORITATIVE NASA & USGS DATASETS */}
      <section className="w-full py-20 px-4 sm:px-6 bg-[#070B14] border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <span className="text-xs font-mono font-bold text-[#FC3D21] tracking-widest uppercase">
                SCIENTIFIC RIGOR &amp; PROVENANCE
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-sans">
                Authoritative Multi-Mission Datasets
              </h2>
            </div>
            <button
              onClick={onOpenProvenance}
              className="px-4 py-2 bg-[#0C1220] hover:bg-[#162034] border border-[#38BDF8]/30 text-[#38BDF8] text-xs font-semibold rounded-lg flex items-center gap-2 transition-all self-start md:self-auto"
            >
              <ShieldCheck className="w-4 h-4 text-[#38BDF8]" />
              <span>Inspect Epistemic Matrix</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
            {/* 1. Optical */}
            <div className="p-4 rounded-xl bg-[#0A0F1D] border border-white/[0.08] space-y-2.5">
              <span className="text-[10px] font-mono text-[#38BDF8] font-bold uppercase tracking-wider block">Optical Imagery</span>
              <h4 className="font-bold text-white text-sm">MRO CTX Jezero Mosaic</h4>
              <p className="text-[#94A3B8] text-[11px] leading-relaxed">
                6 m/pixel controlled orthomosaic streamed dynamically via NASA Mars Trek OGC WMTS.
              </p>
              <div className="pt-2 border-t border-white/[0.06] text-[10px] text-[#38BDF8] font-mono">
                JEZ_ctx_B_soc_008
              </div>
            </div>

            {/* 2. Topo */}
            <div className="p-4 rounded-xl bg-[#0A0F1D] border border-white/[0.08] space-y-2.5">
              <span className="text-[10px] font-mono text-[#34D399] font-bold uppercase tracking-wider block">Topography</span>
              <h4 className="font-bold text-white text-sm">Mars 2020 TRN 1m DTM</h4>
              <p className="text-[#94A3B8] text-[11px] leading-relaxed">
                USGS 32-bit floating-point elevation raster co-registered and tied to MOLA geoid datum.
              </p>
              <div className="pt-2 border-t border-white/[0.06] text-[10px] text-[#34D399] font-mono">
                1.0 m/px Co-Registered
              </div>
            </div>

            {/* 3. Thermal */}
            <div className="p-4 rounded-xl bg-[#0A0F1D] border border-white/[0.08] space-y-2.5">
              <span className="text-[10px] font-mono text-[#FBBF24] font-bold uppercase tracking-wider block">Thermophysical</span>
              <h4 className="font-bold text-white text-sm">THEMIS Nighttime IR</h4>
              <p className="text-[#94A3B8] text-[11px] leading-relaxed">
                100 m/pixel thermal inertia separating loose sand hollows from firm bedrock ridges.
              </p>
              <div className="pt-2 border-t border-white/[0.06] text-[10px] text-[#FBBF24] font-mono">
                J·m⁻²·K⁻¹·s⁻¹/²
              </div>
            </div>

            {/* 4. Geology */}
            <div className="p-4 rounded-xl bg-[#0A0F1D] border border-white/[0.08] space-y-2.5">
              <span className="text-[10px] font-mono text-[#A78BFA] font-bold uppercase tracking-wider block">Astrogeology</span>
              <h4 className="font-bold text-white text-sm">USGS SIM 3464 Map</h4>
              <p className="text-[#94A3B8] text-[11px] leading-relaxed">
                1:75,000 peer-reviewed geological map documenting lacustrine carbonates and smectites.
              </p>
              <div className="pt-2 border-t border-white/[0.06] text-[10px] text-[#A78BFA] font-mono">
                Sun &amp; Stack (2020)
              </div>
            </div>

            {/* 5. In-Situ Rover */}
            <div className="p-4 rounded-xl bg-[#0A0F1D] border border-white/[0.08] space-y-2.5">
              <span className="text-[10px] font-mono text-[#FC3D21] font-bold uppercase tracking-wider block">In-Situ Rover</span>
              <h4 className="font-bold text-white text-sm">MMGIS &amp; Raw JSON Feeds</h4>
              <p className="text-[#94A3B8] text-[11px] leading-relaxed">
                708 Sols of Perseverance rover drive legs and Mastcam-Z / SuperCam in-situ panoramas.
              </p>
              <div className="pt-2 border-t border-white/[0.06] text-[10px] text-[#FC3D21] font-mono">
                Live NASA Endpoints
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. DUAL STUDY SITES (JEZERO CRATER & GALE BOXWORK) */}
      <section className="w-full py-20 px-4 sm:px-6 bg-[#030712] border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/2 space-y-4">
            <span className="text-xs font-mono font-bold text-[#38BDF8] tracking-widest uppercase">
              SURFACE OPERATIONAL SANDBOXES
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-sans">
              Jezero Crater &amp; Mount Sharp Boxwork
            </h2>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              Targeted by NASA for ancient habitability and biosignature preservation. MarsAtlas provides dual operational presets: the <strong>Jezero Crater Western Delta to Margin Rim</strong> (Perseverance site) and the <strong>Mount Sharp Boxwork Foothills</strong> (Curiosity 2025–2026 site).
            </p>

            <div className="space-y-2 pt-2 text-xs">
              <div className="flex items-center gap-2.5 text-white">
                <CheckCircle2 className="w-4 h-4 text-[#34D399]" />
                <span>Elevation Span: -2570 m (Crater Floor) to -1936 m (Crater Rim)</span>
              </div>
              <div className="flex items-center gap-2.5 text-white">
                <CheckCircle2 className="w-4 h-4 text-[#34D399]" />
                <span>Horn&apos;s Slope Range: 0.0° to 22.7° (Strict &lt;22.0° Suit Stability Constraint)</span>
              </div>
              <div className="flex items-center gap-2.5 text-white">
                <CheckCircle2 className="w-4 h-4 text-[#34D399]" />
                <span>Curiosity Boxwork Spiderweb Ridges vs. Sand Hollow Traversal Analysis</span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  onSelectSite("jezero");
                  onEnterWorkspace();
                }}
                className="px-6 py-3 bg-[#FC3D21] hover:bg-[#d62d16] text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-[#FC3D21]/25"
              >
                <span>Launch Jezero Mission Map</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  onSelectSite("gale");
                  onEnterWorkspace();
                }}
                className="px-6 py-3 bg-[#0C1220] hover:bg-[#162034] border border-white/[0.12] hover:border-[#38BDF8] text-[#38BDF8] font-bold text-xs rounded-xl transition-all"
              >
                <span>Inspect Gale Boxwork</span>
              </button>
            </div>
          </div>

          <div className="w-full md:w-1/2 relative rounded-2xl overflow-hidden border border-white/[0.1] shadow-2xl bg-black">
            <img
              src="/data/jezero_slope_hazard.png"
              alt="Jezero Slope Hazard Map"
              className="w-full h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#04070D] via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 bg-[#070B14]/85 border border-white/[0.1] p-3.5 rounded-xl flex items-center justify-between text-xs backdrop-blur-md">
              <div>
                <span className="font-bold text-white block">Horn&apos;s Method Slope Hazard Map</span>
                <span className="text-[10px] text-[#94A3B8]">Green (&lt;8° Safe) | Amber (8–14° Caution) | Crimson (&gt;14° Scarp Hazard)</span>
              </div>
              <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-[#34D399]/20 text-[#34D399] border border-[#34D399]/30 font-bold">
                1m HiRISE DTM
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. GOVERNMENT & INSTITUTIONAL AGENCY FOOTER */}
      <footer className="w-full py-16 px-4 sm:px-6 bg-[#02050B] border-t border-white/[0.08] text-xs text-[#94A3B8]">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/[0.06]">
            <div className="flex items-center gap-3.5">
              <img src="/marsatlas-brand.jpg" alt="MarsAtlas" className="w-10 h-10 rounded-full border border-white/20 object-cover" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-base tracking-wide font-sans">MARSATLAS</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FC3D21]/20 text-[#FC3D21] border border-[#FC3D21]/30 font-bold uppercase">
                    RESEARCH PROTOTYPE
                  </span>
                </div>
                <p className="text-[11px] text-[#64748B]">NASA International Space Apps Challenge 2026 // Navi Mumbai, India</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <button
                onClick={onOpenProvenance}
                className="text-[#38BDF8] hover:underline"
              >
                Epistemic Provenance
              </button>
              <span>•</span>
              <a
                href="https://github.com/shubham25-droid/MarsAtlas"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-[#FC3D21] transition-colors"
              >
                GitHub Source Code
              </a>
              <span>•</span>
              <a
                href="https://images.nasa.gov/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
              >
                NASA Image Library
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[11px] text-[#64748B] leading-relaxed">
            <div>
              <span className="font-bold text-slate-300 block mb-1 uppercase font-mono text-[10px]">Challenge Category</span>
              <p>NASA Space Apps Challenge 2026: <em>&ldquo;Interplanetary Survival Guide: Martian Map&rdquo;</em>. Designed as an operational decision-support tool for future human exploration.</p>
            </div>
            <div>
              <span className="font-bold text-slate-300 block mb-1 uppercase font-mono text-[10px]">Data Provenance &amp; Attribution</span>
              <p>NASA Solar System Treks (JPL), USGS Astrogeology Science Center, NASA Planetary Data System (PDS), and NASA-AMMOS MMGIS telemetry feeds.</p>
            </div>
            <div>
              <span className="font-bold text-slate-300 block mb-1 uppercase font-mono text-[10px]">Scientific Integrity Notice</span>
              <p>Built as an experimental planetary science and mission-planning prototype. Not flight-certified for active mission command. Does not imply official NASA endorsement.</p>
            </div>
          </div>

          <div className="text-center pt-4 text-[10px] text-slate-500 font-mono">
            © 2026 MarsAtlas Engineering Group • Open-Source MIT License • Mars Coordinates EPSG:104905
          </div>
        </div>
      </footer>
    </div>
  );
}

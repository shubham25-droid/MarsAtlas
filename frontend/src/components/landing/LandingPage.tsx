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
  Maximize2,
  Crosshair,
  Route as RouteIcon
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
    <div className="w-full bg-[#030712] text-[#F8FAFC] min-h-screen flex flex-col space-grid-bg selection:bg-[#F36C3D] selection:text-white font-sans">
      
      {/* 1. CINEMATIC MISSION HERO — SPLIT 2-COLUMN HIGH-IMPACT AEROSPACE ARCHITECTURE */}
      <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-12 pt-10 pb-16">
        {/* Deep Space Radial Ambient Glows */}
        <div className="absolute top-[-10%] left-[15%] w-[650px] h-[500px] bg-[radial-gradient(ellipse,rgba(56,189,248,0.12),transparent_70%)] blur-3xl pointer-events-none" />
        <div className="absolute top-[20%] right-[5%] w-[600px] h-[500px] bg-[radial-gradient(ellipse,rgba(243,108,61,0.14),transparent_70%)] blur-3xl pointer-events-none" />

        {/* Mars Horizon Planetary Arc (Bottom Ambient Glow) */}
        <div className="absolute -bottom-72 left-1/2 -translate-x-1/2 w-[140vw] max-w-[1600px] h-[520px] rounded-[100%] bg-gradient-to-t from-[#F36C3D]/20 via-[#C84B24]/08 to-transparent blur-3xl pointer-events-none" />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-15 pointer-events-none space-grid-bg" />

        {/* Main 2-Column Responsive Hero Container */}
        <div className="relative z-10 max-w-[1720px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* LEFT COLUMN (7 COLS): MISSION IDENTITY, TYPOGRAPHY & CALLS TO ACTION */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
            
            {/* Top Institutional Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#0C1220]/90 border border-white/[0.12] text-xs font-mono text-[#38BDF8] shadow-xl backdrop-blur-md">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#38BDF8] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#38BDF8]" />
              </span>
              <span className="tracking-widest font-semibold uppercase text-[11px]">NASA SPACE APPS CHALLENGE 2026</span>
              <span className="text-white/20">|</span>
              <span className="text-[#94A3B8] font-mono text-[11px] hidden sm:inline">
                INTERPLANETARY SURVIVAL GUIDE: MARTIAN MAP
              </span>
            </div>

            {/* Primary Headline */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black tracking-tight text-white uppercase font-sans leading-[1.02]">
                EXPLORE MARS. <br />
                <span className="text-white">UNDERSTAND TERRAIN.</span> <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F36C3D] via-[#f79471] to-[#E8B85A]">
                  PLAN EVERY TRAVERSE.
                </span>
              </h1>
              <p className="max-w-2xl text-sm sm:text-base text-[#94A3B8] font-normal leading-relaxed pt-2">
                MarsAtlas bridges raw orbital observations, metric terrain topography, and rover telemetry with human bioenergetic constraints. Designed for future human extravehicular activity (EVA) across Jezero Crater and Mount Sharp.
              </p>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={onEnterWorkspace}
                className="px-7 py-3.5 bg-gradient-to-r from-[#F36C3D] to-[#C84B24] hover:from-[#f57d54] hover:to-[#db542a] text-white font-bold tracking-wider uppercase text-xs sm:text-sm rounded-xl shadow-xl shadow-[#F36C3D]/25 flex items-center gap-2.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Activity className="w-4 h-4" />
                <span>Launch Mission Console</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {onOpen3D && (
                <button
                  onClick={onOpen3D}
                  className="px-6 py-3.5 bg-[#0C1220]/90 hover:bg-[#162034] border border-white/[0.12] hover:border-[#38BDF8] text-white font-semibold text-xs sm:text-sm rounded-xl flex items-center gap-2.5 transition-all shadow-lg backdrop-blur-md"
                >
                  <Mountain className="w-4 h-4 text-[#38BDF8]" />
                  <span>Explore 3D Terrain Model</span>
                </button>
              )}

              <button
                onClick={onOpenProvenance}
                className="px-5 py-3.5 bg-[#0C1220]/80 hover:bg-[#162034] border border-white/[0.1] hover:border-[#34D399]/40 text-[#CBD5E1] text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-2 transition-all backdrop-blur-md"
              >
                <ShieldCheck className="w-4 h-4 text-[#34D399]" />
                <span className="hidden sm:inline">Epistemic Matrix</span>
              </button>
            </div>

            {/* Operational Telemetry Metrics Row */}
            <div className="pt-4 w-full grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl hud-panel space-y-1">
                <span className="text-[10px] font-mono text-[#64748B] uppercase font-bold tracking-wider block">Rover Telemetry</span>
                <span className="text-white font-mono font-bold text-sm block">559 Drive Legs</span>
                <span className="text-[10px] text-[#94A3B8] block">MMGIS Sols 13–2022</span>
              </div>

              <div className="p-3.5 rounded-xl hud-panel space-y-1">
                <span className="text-[10px] font-mono text-[#64748B] uppercase font-bold tracking-wider block">Metric Grid</span>
                <span className="text-[#38BDF8] font-mono font-bold text-sm block">11.3m Spatial Cell</span>
                <span className="text-[10px] text-[#94A3B8] block">550 × 350 Modelled Sector</span>
              </div>

              <div className="p-3.5 rounded-xl hud-panel space-y-1">
                <span className="text-[10px] font-mono text-[#64748B] uppercase font-bold tracking-wider block">Safety Envelope</span>
                <span className="text-[#FBBF24] font-mono font-bold text-sm block">θ ≤ 22.0° Limit</span>
                <span className="text-[10px] text-[#94A3B8] block">Horn 3×3 Gradient</span>
              </div>

              <div className="p-3.5 rounded-xl hud-panel space-y-1">
                <span className="text-[10px] font-mono text-[#64748B] uppercase font-bold tracking-wider block">Bioenergetics</span>
                <span className="text-[#34D399] font-mono font-bold text-sm block">0.376g Gravity</span>
                <span className="text-[10px] text-[#94A3B8] block">Pandolf-Santee 160kg Suit</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (5 COLS): TACTICAL 3D SECTOR OPERATIONS HUD WIDGET */}
          <div className="lg:col-span-5 w-full flex flex-col items-center justify-center">
            <div className="w-full relative group">
              {/* Outer Ambient Glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#F36C3D]/30 via-[#38BDF8]/25 to-[#34D399]/30 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition duration-700 pointer-events-none" />

              {/* Tactical Operations Container */}
              <div className="relative rounded-2xl overflow-hidden border border-white/[0.14] bg-[#070B14] shadow-2xl flex flex-col">
                
                {/* HUD Card Top Status Bar */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-[#0C1220] border-b border-white/[0.08] text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#34D399] animate-ping" />
                    <span className="font-bold text-white tracking-wider text-[11px]">JEZERO WESTERN DELTA SECTOR</span>
                  </div>
                  <span className="text-[#38BDF8] text-[10px]">EPSG:104905 [MARS IAU2000]</span>
                </div>

                {/* Tactical Map Display Container */}
                <div className="relative w-full h-[270px] sm:h-[310px] bg-black overflow-hidden cursor-pointer" onClick={onOpen3D}>
                  <img
                    src="/data/jezero_slope_hazard.png"
                    alt="Jezero Tactical Slope Hazard Map"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 opacity-90"
                  />

                  {/* Dynamic Radar Sweep Scan Line */}
                  <div className="absolute inset-x-0 h-16 bg-gradient-to-b from-[#38BDF8]/0 via-[#38BDF8]/25 to-[#38BDF8]/0 animate-radar-sweep pointer-events-none" />

                  {/* Corner Aerospace Crosshairs */}
                  <div className="absolute top-3 left-3 text-white/40 font-mono text-xs pointer-events-none">┌</div>
                  <div className="absolute top-3 right-3 text-white/40 font-mono text-xs pointer-events-none">┐</div>
                  <div className="absolute bottom-3 left-3 text-white/40 font-mono text-xs pointer-events-none">└</div>
                  <div className="absolute bottom-3 right-3 text-white/40 font-mono text-xs pointer-events-none">┘</div>

                  {/* Tactical Map Waypoint Crosshair Beacons */}
                  {/* Start Point (Octavia E. Butler Landing Site) */}
                  <div className="absolute top-[48%] right-[12%] flex flex-col items-center pointer-events-none transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-5 h-5 rounded-full border border-white bg-white/20 flex items-center justify-center animate-ping absolute" />
                    <div className="w-2.5 h-2.5 rounded-full bg-white relative z-10 shadow-lg shadow-white/50" />
                    <span className="mt-1 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-black/80 text-white border border-white/20 whitespace-nowrap">
                      Landing Site (Sol 13)
                    </span>
                  </div>

                  {/* Target Point (Cape Flatley Delta Front) */}
                  <div className="absolute top-[42%] left-[45%] flex flex-col items-center pointer-events-none transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-6 h-6 rounded-full border border-[#FBBF24] bg-[#FBBF24]/20 flex items-center justify-center animate-ping absolute" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FBBF24] relative z-10 shadow-lg shadow-[#FBBF24]/50" />
                    <span className="mt-1 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-black/80 text-[#FBBF24] border border-[#FBBF24]/30 whitespace-nowrap">
                      Cape Flatley Target
                    </span>
                  </div>

                  {/* Scarp Hazard Caution Label */}
                  <div className="absolute top-[32%] left-[22%] pointer-events-none">
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-[#F87171]/20 text-[#F87171] border border-[#F87171]/40">
                      ▲ DELTA SCARP (&gt;14° HAZARD)
                    </span>
                  </div>

                  {/* Center Interactive Prompt Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                    <div className="px-4 py-2 rounded-xl bg-[#070B14]/90 border border-[#38BDF8]/50 text-[#38BDF8] text-xs font-mono font-bold flex items-center gap-2 shadow-2xl">
                      <Mountain className="w-4 h-4 text-[#38BDF8]" />
                      <span>CLICK TO LAUNCH INTERACTIVE 3D VIEWER</span>
                    </div>
                  </div>
                </div>

                {/* Live Tactical Telemetry Readouts Strip */}
                <div className="p-3 bg-[#0C1220] border-t border-white/[0.08] grid grid-cols-3 gap-2 text-center text-xs font-mono">
                  <div>
                    <span className="text-[9px] text-[#64748B] uppercase block">Datum Elevation</span>
                    <span className="text-white font-bold text-[11px]">-2,565.8 m</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-[#64748B] uppercase block">Horn&apos;s Slope</span>
                    <span className="text-[#34D399] font-bold text-[11px]">6.8° (Nominal)</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-[#64748B] uppercase block">Metabolic Power</span>
                    <span className="text-[#38BDF8] font-bold text-[11px]">348.6 W</span>
                  </div>
                </div>

                {/* Quick 3D Launcher Trigger Bar */}
                {onOpen3D && (
                  <button
                    onClick={onOpen3D}
                    className="w-full py-2.5 bg-[#070B14] hover:bg-[#0E1729] border-t border-white/[0.06] text-xs font-mono text-[#38BDF8] hover:text-white flex items-center justify-center gap-2 transition-all font-semibold"
                  >
                    <Mountain className="w-3.5 h-3.5 text-[#38BDF8]" />
                    <span>Launch Full 3D Topographic Mesh (WebGL 2.0)</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </button>
                )}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. AUTHENTIC PROJECT-SPECIFIC NASA MISSIONS & OBSERVATION ARCHIVES */}
      <NasaMissionGallery />

      {/* 3. THREE PILLARS (THE SCIENTIFIC PROBLEMS MARSATLAS SOLVES) */}
      <section id="overview" className="w-full py-20 px-4 sm:px-6 bg-[#070B14]/70 border-t border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold text-[#F36C3D] tracking-widest uppercase">
              OPERATIONAL EVA CAPABILITIES
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight font-sans">
              From Planetary Data to Exploration Decisions
            </h2>
            <p className="max-w-2xl mx-auto text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              Standard maps show what is on Mars. MarsAtlas computes what an astronaut in a pressurized spacesuit can safely traverse, survive, and sample.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="p-6 rounded-2xl hud-panel hud-panel-hover transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#F36C3D]/10 border border-[#F36C3D]/30 flex items-center justify-center text-[#F36C3D]">
                <Mountain className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-[#F36C3D] font-bold tracking-wider uppercase">PILLAR 01</span>
                <h3 className="text-base font-bold text-white uppercase tracking-wide font-sans">
                  Beyond Visible Imagery
                </h3>
              </div>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Optical photos mask treacherous slopes and loose regolith. MarsAtlas combines 1m elevation models with Horn&apos;s gradient equations and THEMIS nighttime thermal inertia to classify mechanical slip hazards before boots touch dust.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl hud-panel hud-panel-hover transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#38BDF8]/10 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8]">
                <Activity className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-[#38BDF8] font-bold tracking-wider uppercase">PILLAR 02</span>
                <h3 className="text-base font-bold text-white uppercase tracking-wide font-sans">
                  Human Bioenergetic Margins
                </h3>
              </div>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Compute 8-connected A* traverses grounded in the <strong>NASA JSC Crew State &amp; Risk Model (CSRM)</strong>. Compare 3 distinct strategies—Min-Metabolic, Balanced Time, and Max-Science—with dynamic walkback safety envelopes respecting 160 kg suit mass.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl hud-panel hud-panel-hover transition-all space-y-4">
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
                Connect orbital routes directly to Perseverance and Curiosity ground-truth telemetry. Click any waypoint to view in-situ Mastcam-Z panoramas, SuperCam telescopic details, and USGS SIM 3464 carbonate/smectite signatures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FIVE AUTHORITATIVE NASA & USGS DATASETS */}
      <section className="w-full py-20 px-4 sm:px-6 bg-[#04070D]">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <span className="text-xs font-mono font-bold text-[#F36C3D] tracking-widest uppercase">
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
            <div className="p-4 rounded-xl hud-panel space-y-2.5">
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
            <div className="p-4 rounded-xl hud-panel space-y-2.5">
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
            <div className="p-4 rounded-xl hud-panel space-y-2.5">
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
            <div className="p-4 rounded-xl hud-panel space-y-2.5">
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
            <div className="p-4 rounded-xl hud-panel space-y-2.5">
              <span className="text-[10px] font-mono text-[#F36C3D] font-bold uppercase tracking-wider block">In-Situ Rover</span>
              <h4 className="font-bold text-white text-sm">MMGIS &amp; Raw JSON Feeds</h4>
              <p className="text-[#94A3B8] text-[11px] leading-relaxed">
                708 Sols of Perseverance rover drive legs and Mastcam-Z / SuperCam in-situ panoramas.
              </p>
              <div className="pt-2 border-t border-white/[0.06] text-[10px] text-[#F36C3D] font-mono">
                Live NASA Endpoints
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. DUAL STUDY SITES (JEZERO CRATER & GALE BOXWORK) */}
      <section className="w-full py-20 px-4 sm:px-6 bg-[#070B14]/80 border-t border-white/[0.06]">
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
                className="px-6 py-3 bg-[#F36C3D] hover:bg-[#db542a] text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-[#F36C3D]/25"
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
            <div className="absolute bottom-4 left-4 right-4 hud-panel p-3.5 rounded-xl flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-white block">Horn&apos;s Method Slope Hazard Map</span>
                <span className="text-[10px] text-[#94A3B8]">Green (&lt;8° Safe) | Amber (8-14° Caution) | Crimson (&gt;14° Scarp Hazard)</span>
              </div>
              <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-[#34D399]/20 text-[#34D399] border border-[#34D399]/30 font-bold">
                1m HiRISE DTM
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. INSTITUTIONAL AGENCY FOOTER */}
      <footer className="w-full py-14 px-4 sm:px-6 bg-[#04070D] border-t border-white/[0.08] text-xs text-[#94A3B8]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3.5">
            <img src="/marsatlas-brand.jpg" alt="MarsAtlas" className="w-9 h-9 rounded-full border border-white/20 object-cover" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm tracking-wide font-sans">MARSATLAS</span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#F36C3D]/20 text-[#F36C3D] border border-[#F36C3D]/30 font-bold uppercase">
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
              className="text-white hover:text-[#F36C3D] transition-colors"
            >
              GitHub Source Code
            </a>
          </div>

          <div className="text-center md:text-right text-[11px] text-[#64748B] space-y-1">
            <p>Data Sources: USGS Astrogeology Science Center, NASA Solar System Treks (JPL), NASA PDS &amp; MMGIS.</p>
            <p>Built as an experimental research prototype. Does not imply official NASA endorsement.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

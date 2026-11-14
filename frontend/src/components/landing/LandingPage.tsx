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
  Orbit
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
    <div className="w-full bg-[#04070D] text-[#F8FAFC] min-h-screen flex flex-col space-grid-bg selection:bg-[#F36C3D] selection:text-white font-sans">
      {/* 1. CINEMATIC MISSION HERO WITH RESTORED RICH ATMOSPHERIC BACKGROUND */}
      <section className="relative w-full min-h-[92vh] flex flex-col items-center justify-center overflow-hidden px-4 sm:px-6 pt-10 pb-20">
        {/* Deep Space Radial Gradient & Nebular Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(56,189,248,0.15),rgba(4,7,13,0.95))] pointer-events-none" />
        
        {/* Distant Mars Atmospheric Rim Glow */}
        <div className="absolute -bottom-64 w-[120vw] max-w-[1300px] h-[500px] rounded-[100%] bg-gradient-to-t from-[#F36C3D]/25 via-[#C84B24]/10 to-transparent blur-3xl pointer-events-none" />

        {/* Hero Background Texture (Restored) */}
        <div 
          className="absolute inset-0 opacity-25 pointer-events-none bg-center bg-no-repeat bg-cover mix-blend-screen" 
          style={{ backgroundImage: "url('/assets/hero-banner.jpg')" }} 
        />

        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center text-center space-y-7">
          {/* Institutional Mission Insignia Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#0C1220]/90 border border-white/[0.12] text-xs font-mono text-[#38BDF8] shadow-2xl backdrop-blur-md">
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

          {/* Primary Scientific Title */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white uppercase font-sans leading-[1.05]">
              EXPLORE MARS. <br />
              <span className="text-white">
                UNDERSTAND TERRAIN.
              </span> <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F36C3D] via-[#f79471] to-[#E8B85A]">
                PLAN EVERY TRAVERSE.
              </span>
            </h1>
            <p className="max-w-3xl mx-auto text-sm sm:text-base text-[#94A3B8] font-normal leading-relaxed">
              MarsAtlas bridges raw orbital observations, metric terrain topography, and rover telemetry with human bioenergetic constraints. Designed for future human exploration of Jezero and Gale Craters.
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <button
              onClick={onEnterWorkspace}
              className="px-7 py-3.5 bg-gradient-to-r from-[#F36C3D] to-[#C84B24] hover:from-[#f57d54] hover:to-[#db542a] text-white font-bold tracking-wider uppercase text-xs rounded-xl shadow-xl shadow-[#F36C3D]/25 flex items-center gap-2.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Activity className="w-4 h-4" />
              <span>Launch Mission Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {onOpen3D && (
              <button
                onClick={onOpen3D}
                className="px-6 py-3.5 bg-[#0C1220]/80 hover:bg-[#162034] border border-white/[0.12] hover:border-[#38BDF8] text-white font-semibold text-xs rounded-xl flex items-center gap-2.5 transition-all shadow-lg backdrop-blur-md"
              >
                <Mountain className="w-4 h-4 text-[#38BDF8]" />
                <span>Explore 3D Terrain Model</span>
              </button>
            )}

            <button
              onClick={onOpenProvenance}
              className="px-6 py-3.5 bg-[#0C1220]/80 hover:bg-[#162034] border border-white/[0.12] hover:border-[#34D399]/40 text-[#CBD5E1] text-xs font-semibold rounded-xl flex items-center gap-2 transition-all backdrop-blur-md"
            >
              <ShieldCheck className="w-4 h-4 text-[#34D399]" />
              <span>Epistemic Data Matrix</span>
            </button>
          </div>

          {/* Operational Telemetry Metrics Strip */}
          <div className="pt-6 w-full max-w-4xl grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
            <div className="p-3.5 rounded-xl hud-panel space-y-1">
              <span className="text-[10px] font-mono text-[#64748B] uppercase font-bold tracking-wider block">Rover Telemetry</span>
              <span className="text-white font-mono font-bold text-sm">559 Drive Legs</span>
              <span className="text-[10px] text-[#94A3B8] block">Perseverance MMGIS Sols 13–2022</span>
            </div>

            <div className="p-3.5 rounded-xl hud-panel space-y-1">
              <span className="text-[10px] font-mono text-[#64748B] uppercase font-bold tracking-wider block">Metric Grid</span>
              <span className="text-[#38BDF8] font-mono font-bold text-sm">11.3m Spatial Cell</span>
              <span className="text-[10px] text-[#94A3B8] block">550 × 350 Modelled Sector</span>
            </div>

            <div className="p-3.5 rounded-xl hud-panel space-y-1">
              <span className="text-[10px] font-mono text-[#64748B] uppercase font-bold tracking-wider block">Safety Envelope</span>
              <span className="text-[#FBBF24] font-mono font-bold text-sm">θ ≤ 22.0° Limit</span>
              <span className="text-[10px] text-[#94A3B8] block">Horn 3×3 Finite Difference</span>
            </div>

            <div className="p-3.5 rounded-xl hud-panel space-y-1">
              <span className="text-[10px] font-mono text-[#64748B] uppercase font-bold tracking-wider block">Bioenergetics</span>
              <span className="text-[#34D399] font-mono font-bold text-sm">0.376g Mars Gravity</span>
              <span className="text-[10px] text-[#94A3B8] block">Pandolf-Santee 160kg Suit</span>
            </div>
          </div>

          {/* Centerpiece Mission Insignia Visual (Restored) */}
          <div className="relative group max-w-sm sm:max-w-md mx-auto pt-4">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-[#F36C3D]/40 via-[#38BDF8]/30 to-[#C084FC]/40 rounded-2xl blur-xl opacity-60 group-hover:opacity-90 transition duration-700" />
            <div className="relative rounded-2xl overflow-hidden border border-white/[0.15] bg-[#070B14] shadow-2xl">
              <img
                src="/marsatlas-brand.jpg"
                alt="MarsAtlas Insignia"
                className="w-full h-auto object-cover transform group-hover:scale-[1.02] transition-transform duration-500"
              />
              <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-md bg-black/80 border border-white/10 text-[9px] font-mono text-[#38BDF8] backdrop-blur-md flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse" />
                <span>MISSION EMBLEM • SPACE APPS 2026</span>
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
            <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
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
                <h3 className="text-base font-bold text-white uppercase tracking-wide">
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
                <h3 className="text-base font-bold text-white uppercase tracking-wide">
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
                <h3 className="text-base font-bold text-white uppercase tracking-wide">
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
              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
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
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
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
                <span className="font-bold text-white text-sm tracking-wide">MARSATLAS</span>
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

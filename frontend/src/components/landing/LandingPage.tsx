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
  Globe2
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
    <div className="w-full bg-[#04070D] text-[#F8FAFC] min-h-screen flex flex-col space-grid-bg selection:bg-[#FC3D21] selection:text-white font-sans">
      
      {/* 1. CINEMATIC MISSION HERO WITH TRANSLUCENT FROSTED GLASS HUD & VISIBLE VISTA */}
      <section className="relative w-full min-h-[92vh] flex flex-col items-center justify-center overflow-hidden px-4 sm:px-6 pt-10 pb-20">
        
        {/* Layer A: Authentic Martian Background Vista (Richly visible with sharp details, NO heavy blur) */}
        <div 
          className="absolute inset-0 bg-center bg-no-repeat bg-cover pointer-events-none opacity-80"
          style={{ backgroundImage: "url('/assets/hero-banner.jpg')" }} 
        />

        {/* Layer B: Gentle Vignette Gradient for Depth (Keeps Mars Centerpiece Vibrant) */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#04070D]/40 via-transparent to-[#04070D]" />
        
        {/* Layer C: Subtle Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[radial-gradient(ellipse,rgba(252,61,33,0.15),transparent_70%)] blur-3xl pointer-events-none" />

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
              MarsAtlas bridges raw orbital observations, metric terrain topography, and rover telemetry with human bioenergetic constraints. Designed for future human exploration of Jezero and Gale Craters.
            </p>

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

          {/* Operational Telemetry Metrics Strip (Clean NASA-Style Clean Typography) */}
          <div className="pt-2 w-full max-w-4xl grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
            <div className="p-4 rounded-2xl bg-[#040A18]/40 backdrop-blur-md border border-white/10 space-y-1 shadow-lg hover:border-white/20 transition-all">
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">559</div>
              <div className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Drive Legs</div>
              <div className="text-[11px] text-slate-400">Perseverance Sols 13–2022</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#040A18]/40 backdrop-blur-md border border-white/10 space-y-1 shadow-lg hover:border-white/20 transition-all">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#38BDF8] tracking-tight">11.3 m</div>
              <div className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Grid Cell</div>
              <div className="text-[11px] text-slate-400">550 × 350 Modelled Sector</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#040A18]/40 backdrop-blur-md border border-white/10 space-y-1 shadow-lg hover:border-white/20 transition-all">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#FBBF24] tracking-tight">&le; 22.0°</div>
              <div className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Slope Limit</div>
              <div className="text-[11px] text-slate-400">Horn 3×3 Finite Difference</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#040A18]/40 backdrop-blur-md border border-white/10 space-y-1 shadow-lg hover:border-white/20 transition-all">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#34D399] tracking-tight">0.38 g</div>
              <div className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Mars Gravity</div>
              <div className="text-[11px] text-slate-400">Pandolf-Santee 160 kg Suit</div>
            </div>
          </div>

          {/* Centerpiece Mission Insignia Visual (Square Card with Glowing Rim) */}
          <div className="relative group max-w-[280px] sm:max-w-xs mx-auto pt-3">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#FC3D21]/40 via-[#38BDF8]/30 to-[#A78BFA]/40 rounded-2xl blur-lg opacity-60 group-hover:opacity-90 transition duration-500" />
            <div className="relative rounded-2xl overflow-hidden border border-white/20 bg-[#070B14] shadow-2xl">
              <img
                src="/marsatlas-brand.jpg"
                alt="MarsAtlas Insignia"
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-md bg-black/85 border border-white/10 text-[10px] font-mono text-[#38BDF8] backdrop-blur-md flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse" />
                <span>MISSION EMBLEM</span>
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
              Standard maps show what is on Mars. MarsAtlas computes what an astronaut in a pressurized spacesuit can safely traverse, survive, and sample.
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
                  Beyond Visible Imagery
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Optical photos mask treacherous slopes and loose regolith. MarsAtlas combines 1m elevation models with Horn&apos;s gradient equations and THEMIS nighttime thermal inertia to classify mechanical slip hazards before boots touch dust.
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
                  Human Bioenergetic Margins
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Compute 8-connected A* traverses grounded in the <strong>NASA JSC Crew State &amp; Risk Model (CSRM)</strong>. Compare 3 distinct strategies—Min-Metabolic, Balanced Time, and Max-Science—with dynamic walkback safety envelopes respecting 160 kg suit mass.
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
                  Science Along the Traverse
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
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
              <span className="text-xs font-mono font-bold text-[#FC3D21] tracking-widest uppercase">
                SCIENTIFIC RIGOR &amp; PROVENANCE
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-sans">
                Authoritative Multi-Mission Datasets
              </h2>
            </div>
            <button
              onClick={onOpenProvenance}
              className="px-4 py-2 bg-[#0C1220] hover:bg-[#162034] border border-[#38BDF8]/30 text-[#38BDF8] text-xs font-bold rounded-lg flex items-center gap-2 transition-all self-start md:self-auto"
            >
              <ShieldCheck className="w-4 h-4 text-[#38BDF8]" />
              <span>Inspect Epistemic Matrix</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
            {/* 1. Optical */}
            <div className="p-4 rounded-xl bg-[#0A0F1D] border border-white/10 space-y-2.5 shadow-lg">
              <span className="text-[10px] font-mono text-[#38BDF8] font-bold uppercase tracking-wider block">Optical Imagery</span>
              <h4 className="font-bold text-white text-sm">MRO CTX Jezero Mosaic</h4>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                6 m/pixel controlled orthomosaic streamed dynamically via NASA Mars Trek OGC WMTS.
              </p>
              <div className="pt-2 border-t border-white/10 text-[10px] text-[#38BDF8] font-mono">
                JEZ_ctx_B_soc_008
              </div>
            </div>

            {/* 2. Topo */}
            <div className="p-4 rounded-xl bg-[#0A0F1D] border border-white/10 space-y-2.5 shadow-lg">
              <span className="text-[10px] font-mono text-[#34D399] font-bold uppercase tracking-wider block">Topography</span>
              <h4 className="font-bold text-white text-sm">Mars 2020 TRN 1m DTM</h4>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                USGS 32-bit floating-point elevation raster co-registered and tied to MOLA geoid datum.
              </p>
              <div className="pt-2 border-t border-white/10 text-[10px] text-[#34D399] font-mono">
                1.0 m/px Co-Registered
              </div>
            </div>

            {/* 3. Thermal */}
            <div className="p-4 rounded-xl bg-[#0A0F1D] border border-white/10 space-y-2.5 shadow-lg">
              <span className="text-[10px] font-mono text-[#FBBF24] font-bold uppercase tracking-wider block">Thermophysical</span>
              <h4 className="font-bold text-white text-sm">THEMIS Nighttime IR</h4>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                100 m/pixel thermal inertia separating loose sand hollows from firm bedrock ridges.
              </p>
              <div className="pt-2 border-t border-white/10 text-[10px] text-[#FBBF24] font-mono">
                J·m⁻²·K⁻¹·s⁻¹/²
              </div>
            </div>

            {/* 4. Geology */}
            <div className="p-4 rounded-xl bg-[#0A0F1D] border border-white/10 space-y-2.5 shadow-lg">
              <span className="text-[10px] font-mono text-[#A78BFA] font-bold uppercase tracking-wider block">Astrogeology</span>
              <h4 className="font-bold text-white text-sm">USGS SIM 3464 Map</h4>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                1:75,000 peer-reviewed geological map documenting lacustrine carbonates and smectites.
              </p>
              <div className="pt-2 border-t border-white/10 text-[10px] text-[#A78BFA] font-mono">
                Sun &amp; Stack (2020)
              </div>
            </div>

            {/* 5. In-Situ Rover */}
            <div className="p-4 rounded-xl bg-[#0A0F1D] border border-white/10 space-y-2.5 shadow-lg">
              <span className="text-[10px] font-mono text-[#FC3D21] font-bold uppercase tracking-wider block">In-Situ Rover</span>
              <h4 className="font-bold text-white text-sm">MMGIS &amp; Raw Feeds</h4>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                708 Sols of Perseverance rover drive legs and Mastcam-Z / SuperCam in-situ panoramas.
              </p>
              <div className="pt-2 border-t border-white/10 text-[10px] text-[#FC3D21] font-mono">
                Live NASA Endpoints
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
              Targeted by NASA for ancient habitability and biosignature preservation. MarsAtlas provides dual operational presets: the <strong>Jezero Crater Western Delta to Margin Rim</strong> (Perseverance site) and the <strong>Mount Sharp Boxwork Foothills</strong> (Curiosity site).
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
                <span className="text-[10px] text-slate-300">Green (&lt;8° Safe) | Amber (8-14° Caution) | Crimson (&gt;14° Scarp Hazard)</span>
              </div>
              <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-[#34D399]/20 text-[#34D399] border border-[#34D399]/30 font-bold">
                1m HiRISE DTM
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. INSTITUTIONAL AGENCY FOOTER */}
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

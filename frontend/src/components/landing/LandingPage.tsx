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

interface LandingPageProps {
  onEnterWorkspace: () => void;
  onOpenProvenance: () => void;
  onSelectSite: (site: "jezero" | "gale") => void;
}

export default function LandingPage({
  onEnterWorkspace,
  onOpenProvenance,
  onSelectSite
}: LandingPageProps) {
  return (
    <div className="w-full bg-[#04070D] text-[#F8FAFC] min-h-screen flex flex-col space-grid-bg selection:bg-[#F36C3D] selection:text-white">
      {/* 1. CINEMATIC MISSION HERO */}
      <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center overflow-hidden px-4 sm:px-6 pt-8 pb-16">
        {/* Deep Space Radial Gradient & Nebular Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(56,189,248,0.15),rgba(4,7,13,0.95))] pointer-events-none" />
        
        {/* Distant Mars Atmospheric Rim Glow */}
        <div className="absolute -bottom-64 w-[120vw] max-w-[1300px] h-[500px] rounded-[100%] bg-gradient-to-t from-[#F36C3D]/25 via-[#C84B24]/10 to-transparent blur-3xl pointer-events-none" />

        {/* Hero Background Texture */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none bg-center bg-no-repeat bg-cover mix-blend-screen" 
          style={{ backgroundImage: "url('/assets/hero-banner.jpg')" }} 
        />

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center gap-6 mt-6">
          {/* Institutional Mission Insignia Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#0C1220]/90 border border-white/[0.12] text-xs font-mono text-[#38BDF8] shadow-2xl backdrop-blur-md">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#38BDF8] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#38BDF8]"></span>
            </span>
            <span className="tracking-widest font-semibold uppercase">NASA SPACE APPS CHALLENGE 2026</span>
            <span className="text-white/20">/</span>
            <span className="text-[#94A3B8]">NAVI MUMBAI, INDIA</span>
          </div>

          {/* Editorial Display Heading */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight uppercase leading-[0.95] max-w-4xl text-white">
            THE NEXT FRONTIER <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F36C3D] via-[#f79471] to-[#38BDF8]">
              IS NOT ON EARTH.
            </span>
          </h1>

          <p className="max-w-2xl text-sm sm:text-base text-[#94A3B8] leading-relaxed font-normal">
            Explore the Red Planet through integrated orbital observations, 32-bit floating-point terrain intelligence, and physiologically grounded astronaut EVA traverse planning.
          </p>

          {/* Primary & Secondary Call to Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 mt-2">
            <button
              onClick={onEnterWorkspace}
              className="px-8 py-3.5 bg-gradient-to-r from-[#F36C3D] to-[#C84B24] hover:from-[#f57d54] hover:to-[#db542a] text-white font-bold tracking-wider uppercase text-xs rounded-xl shadow-xl shadow-[#F36C3D]/25 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Launch Mission Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenProvenance}
              className="px-7 py-3.5 bg-[#0C1220]/80 hover:bg-[#162034] border border-white/[0.12] hover:border-[#38BDF8]/50 text-white font-semibold tracking-wider uppercase text-xs rounded-xl backdrop-blur-md flex items-center gap-2 transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-[#38BDF8]" />
              <span>Scientific Provenance</span>
            </button>
          </div>

          {/* Centerpiece Mission Insignia / Brand Visual */}
          <div className="relative group max-w-sm sm:max-w-md mx-auto mt-4">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-[#F36C3D]/40 via-[#38BDF8]/30 to-[#C084FC]/40 rounded-2xl blur-xl opacity-60 group-hover:opacity-90 transition duration-700" />
            <div className="relative rounded-2xl overflow-hidden border border-white/[0.15] bg-[#070B14] shadow-2xl">
              <img
                src="/marsatlas-brand.jpg"
                alt="MarsAtlas Mission Insignia"
                className="w-full h-auto object-cover transform group-hover:scale-[1.02] transition-transform duration-500"
              />
              <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-md bg-black/80 border border-white/10 text-[9px] font-mono text-[#38BDF8] backdrop-blur-md flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse" />
                <span>MISSION EMBLEM • SPACE APPS 2026</span>
              </div>
            </div>
          </div>

          {/* Institutional Telemetry Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-10 w-full max-w-4xl pt-8 border-t border-white/[0.08] text-left">
            <div className="p-3.5 rounded-xl hud-panel">
              <span className="text-[10px] text-[#94A3B8] font-mono block tracking-wider uppercase">Primary Study Site</span>
              <span className="text-sm font-bold text-white tracking-tight">Jezero Crater</span>
              <span className="text-[10px] text-[#38BDF8] block font-mono mt-0.5">18.44°N, 77.45°E</span>
            </div>
            <div className="p-3.5 rounded-xl hud-panel">
              <span className="text-[10px] text-[#94A3B8] font-mono block tracking-wider uppercase">Stereo Elevation</span>
              <span className="text-sm font-bold text-white tracking-tight">1.0 m/px HiRISE</span>
              <span className="text-[10px] text-[#34D399] block font-mono mt-0.5">MOLA Datum Tied</span>
            </div>
            <div className="p-3.5 rounded-xl hud-panel">
              <span className="text-[10px] text-[#94A3B8] font-mono block tracking-wider uppercase">Slope Formulation</span>
              <span className="text-sm font-bold text-white tracking-tight">Horn&apos;s 3x3 Metric</span>
              <span className="text-[10px] text-[#FBBF24] block font-mono mt-0.5">R = 3,396,190 m</span>
            </div>
            <div className="p-3.5 rounded-xl hud-panel">
              <span className="text-[10px] text-[#94A3B8] font-mono block tracking-wider uppercase">Physiology Solver</span>
              <span className="text-sm font-bold text-white tracking-tight">NASA JSC CSRM</span>
              <span className="text-[10px] text-[#F36C3D] block font-mono mt-0.5">Pandolf (G=0.376)</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THREE PILLARS (THE PROBLEM MARSATLAS SOLVES) */}
      <section id="overview" className="w-full py-20 px-4 sm:px-6 bg-[#070B14]/70 border-t border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold text-[#38BDF8] tracking-widest uppercase">
              GOVERNING CHALLENGE OBJECTIVES
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
              An Active Planetary Copilot For Future Marswalks
            </h2>
            <p className="max-w-2xl mx-auto text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              Robotic mission portals are designed for retrospective analysis. MarsAtlas is engineered as an active, predictive decision-support system for astronauts in pressurized suits on the surface.
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
                  Understand The Terrain
                </h3>
              </div>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Seamlessly fuse 1m USGS HiRISE DTMs, 6m CTX orthomosaics, 100m THEMIS nighttime thermal inertia, and USGS SIM 3464 geologic formations to detect steep scarp walls and low-traction sand hollows before setting foot on the surface.
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
                  Plan The Traverse
                </h3>
              </div>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Compute 8-connected A* traverses grounded in the <strong>NASA JSC Crew State &amp; Risk Model (CSRM)</strong>. Compare 3 distinct strategies—Min-Metabolic, Balanced Time, and Max-Science—with dynamic walkback safety envelopes.
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
                  Discover Science Along The Way
                </h3>
              </div>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Connect orbital routes directly to Perseverance and Curiosity ground-truth telemetry. Click any waypoint to view in-situ Mastcam-Z panoramas, SuperCam telescopic details, and CRISM carbonate/smectite signatures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FIVE AUTHORITATIVE NASA & USGS DATASETS */}
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

      {/* 4. DUAL STUDY SITES (JEZERO CRATER & GALE BOXWORK) */}
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
              Targeted by NASA for ancient habitability and biosignature preservation. MarsAtlas provides dual operational presets: the **Jezero Crater Western Delta to Margin Rim** (Perseverance site) and the **Mount Sharp Boxwork Foothills** (Curiosity 2025–2026 site).
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

      {/* 5. INSTITUTIONAL FOOTER */}
      <footer className="w-full py-12 px-4 sm:px-6 bg-[#04070D] border-t border-white/[0.08] text-xs text-[#94A3B8]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src="/assets/logo.png" alt="MarsAtlas" className="w-8 h-8 object-contain" />
            <div>
              <span className="font-bold text-white text-sm tracking-wide">MarsAtlas</span>
              <p className="text-[11px] text-[#64748B]">NASA International Space Apps Challenge 2026 // Navi Mumbai, India</p>
            </div>
          </div>

          <div className="text-center md:text-right text-[11px] space-y-1">
            <p>Data Sources: USGS Astrogeology Science Center, NASA Solar System Treks (JPL), NASA PDS &amp; MMGIS.</p>
            <p className="text-[#64748B]">Built as an experimental research and planning prototype. Does not imply official NASA endorsement.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

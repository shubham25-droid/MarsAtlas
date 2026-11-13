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
  ExternalLink
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
    <div className="w-full bg-[#070A10] text-[#F3F5F7] min-h-screen flex flex-col">
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative w-full min-h-[92vh] flex items-center justify-center overflow-hidden px-4 sm:px-6">
        {/* Cinematic Starfield & Ambient Lighting */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#131B26] via-[#070A10] to-[#070A10] z-0" />
        
        {/* Mars Planet Horizon Graphic */}
        <div className="absolute -bottom-48 sm:-bottom-72 w-[140vw] max-w-[1400px] h-[600px] rounded-[100%] bg-gradient-to-t from-[#E46A43] via-[#A94332] to-transparent opacity-25 blur-2xl pointer-events-none" />

        {/* Hero Background Imagery */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-center bg-no-repeat bg-cover" style={{ backgroundImage: "url('/assets/hero-banner.jpg')" }} />

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center gap-6 pt-12 pb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#131B26] border border-[#E46A43]/40 text-xs font-mono text-[#E46A43] shadow-lg">
            <span className="w-2 h-2 rounded-full bg-[#E46A43] animate-pulse" />
            <span>NASA SPACE APPS CHALLENGE 2026 — NAVI MUMBAI, INDIA</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight uppercase leading-none max-w-4xl text-white">
            THE NEXT FRONTIER <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E46A43] via-[#f38d6b] to-[#5CC8D7]">
              IS NOT ON EARTH.
            </span>
          </h1>

          <p className="max-w-2xl text-base sm:text-lg text-[#A0ACB9] leading-relaxed">
            Explore the Red Planet through integrated orbital science, high-resolution 32-bit terrain intelligence, and human-scale EVA traverse mission planning.
          </p>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
            <button
              onClick={onEnterWorkspace}
              className="px-8 py-4 bg-gradient-to-r from-[#E46A43] to-[#A94332] hover:from-[#f0764e] hover:to-[#bd4a37] text-white font-black tracking-wider uppercase text-sm rounded-xl shadow-xl shadow-[#E46A43]/25 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <span>Explore Mars</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="#overview"
              className="px-8 py-4 bg-[#131B26] hover:bg-[#1E293B] border border-[#1E293B] hover:border-[#5CC8D7] text-white font-bold tracking-wider uppercase text-sm rounded-xl transition-all"
            >
              Discover The Mission
            </a>
          </div>

          {/* Quick Stats Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 w-full max-w-3xl pt-8 border-t border-[#1E293B]/60 text-left">
            <div className="p-3 bg-[#0D121B]/80 rounded-xl border border-[#1E293B]">
              <span className="text-[11px] text-[#A0ACB9] block">Primary Focus Site</span>
              <span className="text-sm font-bold text-white">Jezero Crater</span>
              <span className="text-[10px] text-[#5CC8D7] block font-mono">18.44°N, 77.45°E</span>
            </div>
            <div className="p-3 bg-[#0D121B]/80 rounded-xl border border-[#1E293B]">
              <span className="text-[11px] text-[#A0ACB9] block">Elevation Model</span>
              <span className="text-sm font-bold text-white">1 m/pixel HiRISE</span>
              <span className="text-[10px] text-[#62C99B] block font-mono">USGS TRN DTM</span>
            </div>
            <div className="p-3 bg-[#0D121B]/80 rounded-xl border border-[#1E293B]">
              <span className="text-[11px] text-[#A0ACB9] block">Slope Algorithm</span>
              <span className="text-sm font-bold text-white">Horn&apos;s 3x3 Gradient</span>
              <span className="text-[10px] text-[#E8B65A] block font-mono">Metric Mars Scale</span>
            </div>
            <div className="p-3 bg-[#0D121B]/80 rounded-xl border border-[#1E293B]">
              <span className="text-[11px] text-[#A0ACB9] block">Physiology Engine</span>
              <span className="text-sm font-bold text-white">NASA JSC CSRM</span>
              <span className="text-[10px] text-[#E46A43] block font-mono">Pandolf (G=0.376)</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SECTION B: MISSION OVERVIEW (3 PILLARS) */}
      <section id="overview" className="w-full py-20 px-4 sm:px-6 bg-[#0D121B] border-t border-b border-[#1E293B]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono font-bold text-[#5CC8D7] uppercase tracking-wider">
              Autonomous Planetary Decision-Support
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Why MarsAtlas Stands Apart
            </h2>
            <p className="max-w-2xl mx-auto text-sm text-[#A0ACB9]">
              Moving beyond static web maps to provide future Mars astronauts with quantitative terrain intelligence, physiological consumable budgeting, and in-situ ground truth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-[#131B26] border border-[#1E293B] hover:border-[#E46A43] transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#E46A43]/10 border border-[#E46A43]/30 flex items-center justify-center text-[#E46A43]">
                <Mountain className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white tracking-wide uppercase">
                1. Understand The Terrain
              </h3>
              <p className="text-xs text-[#A0ACB9] leading-relaxed">
                Seamlessly cross-reference 1m USGS HiRISE Digital Terrain Models, 6m CTX mosaics, 100m THEMIS nighttime thermal inertia, and USGS SIM 3464 geologic formations to uncover surface hazards before stepping out of the airlock.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-[#131B26] border border-[#1E293B] hover:border-[#5CC8D7] transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#5CC8D7]/10 border border-[#5CC8D7]/30 flex items-center justify-center text-[#5CC8D7]">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white tracking-wide uppercase">
                2. Plan The Traverse
              </h3>
              <p className="text-xs text-[#A0ACB9] leading-relaxed">
                Execute 8-connected A* pathfinding grounded in the <strong>NASA JSC Crew State & Risk Model (CSRM)</strong>. Compare 3 distinct strategies—Min-Metabolic, Balanced Time, and Max-Science—with real-time walkback safety contours.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-[#131B26] border border-[#1E293B] hover:border-[#62C99B] transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#62C99B]/10 border border-[#62C99B]/30 flex items-center justify-center text-[#62C99B]">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white tracking-wide uppercase">
                3. Discover Science Along The Way
              </h3>
              <p className="text-xs text-[#A0ACB9] leading-relaxed">
                Connect planned orbital routes directly to Perseverance and Curiosity in-situ observations. Click any waypoint to trigger an instant Ground-Truth Briefing with high-definition surface panoramas and CRISM spectral signatures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECTION C: SCIENTIFIC DATASETS INTEGRATED */}
      <section className="w-full py-20 px-4 sm:px-6 bg-[#070A10]">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-bold text-[#E46A43] uppercase tracking-wider">
                Full Scientific Traceability
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Five Authoritative NASA & USGS Data Layers
              </h2>
            </div>
            <button
              onClick={onOpenProvenance}
              className="px-4 py-2 bg-[#131B26] hover:bg-[#1E293B] border border-[#5CC8D7]/40 text-[#5CC8D7] text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors self-start md:self-auto"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Inspect Epistemic Provenance</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
            {/* 1. Optical */}
            <div className="bg-[#0D121B] p-4 rounded-xl border border-[#1E293B] space-y-2">
              <span className="text-[10px] font-mono text-[#5CC8D7] font-bold uppercase">Optical Imagery</span>
              <h4 className="font-bold text-white text-sm">MRO CTX Jezero Mosaic</h4>
              <p className="text-[#A0ACB9]">6 m/pixel controlled orthomosaic streamed via NASA Mars Trek WMTS.</p>
              <div className="pt-2 border-t border-[#1E293B] text-[10px] text-[#5CC8D7] font-mono">
                JEZ_ctx_B_soc_008
              </div>
            </div>

            {/* 2. Topo */}
            <div className="bg-[#0D121B] p-4 rounded-xl border border-[#1E293B] space-y-2">
              <span className="text-[10px] font-mono text-[#62C99B] font-bold uppercase">Topography</span>
              <h4 className="font-bold text-white text-sm">Mars 2020 TRN 1m DTM</h4>
              <p className="text-[#A0ACB9]">USGS 32-bit floating point elevation raster referenced to MOLA geoid.</p>
              <div className="pt-2 border-t border-[#1E293B] text-[10px] text-[#62C99B] font-mono">
                1.0 m/px Co-Registered
              </div>
            </div>

            {/* 3. Thermal */}
            <div className="bg-[#0D121B] p-4 rounded-xl border border-[#1E293B] space-y-2">
              <span className="text-[10px] font-mono text-[#E8B65A] font-bold uppercase">Thermophysical</span>
              <h4 className="font-bold text-white text-sm">THEMIS Nighttime IR</h4>
              <p className="text-[#A0ACB9]">100 m/pixel thermal inertia separating loose sand hollows from firm bedrock.</p>
              <div className="pt-2 border-t border-[#1E293B] text-[10px] text-[#E8B65A] font-mono">
                J·m⁻²·K⁻¹·s⁻¹/²
              </div>
            </div>

            {/* 4. Geology */}
            <div className="bg-[#0D121B] p-4 rounded-xl border border-[#1E293B] space-y-2">
              <span className="text-[10px] font-mono text-[#8B5CF6] font-bold uppercase">Astrogeology</span>
              <h4 className="font-bold text-white text-sm">USGS SIM 3464 Map</h4>
              <p className="text-[#A0ACB9]">1:75,000 peer-reviewed stratigraphic units mapping lacustrine carbonates & smectites.</p>
              <div className="pt-2 border-t border-[#1E293B] text-[10px] text-[#8B5CF6] font-mono">
                Sun & Stack (2020)
              </div>
            </div>

            {/* 5. In-Situ Rover */}
            <div className="bg-[#0D121B] p-4 rounded-xl border border-[#1E293B] space-y-2">
              <span className="text-[10px] font-mono text-[#E46A43] font-bold uppercase">In-Situ Rover</span>
              <h4 className="font-bold text-white text-sm">MMGIS Waypoints & Raw API</h4>
              <p className="text-[#A0ACB9]">708 Sols of Perseverance rover drive legs and Mastcam-Z / SuperCam POV photos.</p>
              <div className="pt-2 border-t border-[#1E293B] text-[10px] text-[#E46A43] font-mono">
                Live JSON Feeds
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECTION D: JEZERO CRATER PREVIEW */}
      <section className="w-full py-20 px-4 sm:px-6 bg-[#0D121B] border-t border-[#1E293B]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="w-full md:w-1/2 space-y-4">
            <span className="text-xs font-mono font-bold text-[#5CC8D7] uppercase tracking-wider">
              Primary Study Sandbox
            </span>
            <h2 className="text-3xl font-extrabold text-white">
              Jezero Crater Western Delta to Margin Rim
            </h2>
            <p className="text-xs text-[#A0ACB9] leading-relaxed">
              Targeted by NASA for ancient habitability and biosignature preservation. MarsAtlas models the high-priority traverse sector spanning the Octavia E. Butler landing site, the Séítah olivine dunes, the delta front scarp at Cape Flatley, and the ancient lacustrine carbonate rim at Lac de Charmes.
            </p>

            <div className="space-y-2 pt-2 text-xs">
              <div className="flex items-center gap-2 text-white">
                <CheckCircle2 className="w-4 h-4 text-[#62C99B]" />
                <span>Elevation Span: -2570 m (Crater Floor) up to -1936 m (Crater Rim)</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <CheckCircle2 className="w-4 h-4 text-[#62C99B]" />
                <span>Horn&apos;s Slope Range: 0.0° to 22.7° (Scarp Hazard Delineation)</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <CheckCircle2 className="w-4 h-4 text-[#62C99B]" />
                <span>Curiosity Boxwork Secondary Preset in Gale Crater (Mount Sharp)</span>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-3">
              <button
                onClick={() => {
                  onSelectSite("jezero");
                  onEnterWorkspace();
                }}
                className="px-6 py-3 bg-[#E46A43] hover:bg-[#bd4a37] text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-[#E46A43]/20"
              >
                <span>Launch Jezero Mission Map</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  onSelectSite("gale");
                  onEnterWorkspace();
                }}
                className="px-6 py-3 bg-[#131B26] hover:bg-[#1E293B] border border-[#1E293B] hover:border-[#5CC8D7] text-[#5CC8D7] font-bold text-xs rounded-xl transition-all"
              >
                <span>Inspect Gale Boxwork</span>
              </button>
            </div>
          </div>

          <div className="w-full md:w-1/2 relative rounded-2xl overflow-hidden border border-[#1E293B] shadow-2xl bg-black">
            <img
              src="/data/jezero_slope_hazard.png"
              alt="Jezero Slope Hazard Map"
              className="w-full h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070A10] via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 bg-[#0D121B]/90 border border-[#1E293B] p-3 rounded-xl backdrop-blur flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-white block">Horn&apos;s Method Slope Hazard Map</span>
                <span className="text-[10px] text-[#A0ACB9]">Green (&lt;8° Safe) | Yellow (8-14° Caution) | Red (&gt;14° Scarp)</span>
              </div>
              <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-[#62C99B]/20 text-[#62C99B] border border-[#62C99B]/30 font-bold">
                1m HiRISE DTM
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="w-full py-10 px-4 sm:px-6 bg-[#070A10] border-t border-[#1E293B] text-xs text-[#A0ACB9]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src="/assets/logo.png" alt="MarsAtlas" className="w-7 h-7 object-contain" />
            <div>
              <span className="font-bold text-white text-sm">MarsAtlas</span>
              <p className="text-[11px] text-[#A0ACB9]">NASA Space Apps Challenge 2026 | Navi Mumbai, India</p>
            </div>
          </div>

          <div className="text-center md:text-right text-[11px] space-y-1">
            <p>Data Sources: USGS Astrogeology Science Center, NASA Solar System Treks (JPL), NASA PDS & MMGIS.</p>
            <p className="text-[#A0ACB9]/60">Built for research and competitive presentation. Does not imply official NASA endorsement.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

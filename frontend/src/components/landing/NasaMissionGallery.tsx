"use client";

import React, { useState } from "react";
import { 
  ArrowRight, 
  ExternalLink, 
  X, 
  Sparkles, 
  Camera, 
  Layers, 
  Compass,
  Mountain,
  Eye,
  Activity,
  ShieldCheck,
  CheckCircle2,
  Info
} from "lucide-react";

export interface GalleryItem {
  id: string;
  title: string;
  category: "all" | "jezero" | "gale" | "orbital";
  dataTier: "Active Dataset" | "Reference Context";
  mission: string;
  instrument: string;
  target: string;
  dateOrSol: string;
  nasaId: string;
  imageSrc: string;
  description: string;
  marsAtlasRole: string;
  officialUrl: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "perseverance_delta",
    title: "Perseverance at Western Delta",
    category: "jezero",
    dataTier: "Reference Context",
    mission: "NASA Mars 2020 Exploration Mission",
    instrument: "Mastcam-Z & SuperCam Remote Micro-Imager",
    target: "Cape Flatley Delta Front Contact",
    dateOrSol: "Sol 360–2022 Continuous Telemetry",
    nasaId: "PIA24836 / Mars 2020",
    imageSrc: "/assets/nasa_gallery/perseverance.jpg",
    description: "Perseverance rover surveyed the base of the Western Delta, identifying fine-grained clay-rich lacustrine mudstones with high biosignature preservation potential. Serves as ground-truth planetary imagery.",
    marsAtlasRole: "Ground-truth visual reference: In-situ Mastcam-Z panorama providing visual ground truth for the delta contact region.",
    officialUrl: "https://mars.nasa.gov/mars2020/"
  },
  {
    id: "hirise_delta_scarp",
    title: "HiRISE 1m Jezero Scarp (Reference)",
    category: "orbital",
    dataTier: "Reference Context",
    mission: "NASA Mars Reconnaissance Orbiter (MRO)",
    instrument: "HiRISE Stereo Camera (1.0 m/pixel)",
    target: "Jezero Western Fan Scarps (Orbital Reference Context)",
    dateOrSol: "MRO Primary Planetary Science Phase",
    nasaId: "PIA23962 / PSP_001415",
    imageSrc: "/assets/nasa_gallery/hirise_delta.jpg",
    description: "1-meter-per-pixel orbital stereo digital elevation model showing the steep 60-meter drop-off and layered sedimentary strata of the delta scarp. Serves as scientific reference context; active route planning executes on the experimental surrogate grid.",
    marsAtlasRole: "Scientific reference context: Informs understanding of regional scarp geometry; computational pathfinding executes on the experimental surrogate grid with a 22.0° slope cutoff constraint.",
    officialUrl: "https://hirise.lpl.arizona.edu/"
  },
  {
    id: "mastcamz_delta_strata",
    title: "Mastcam-Z Delta Sedimentary Panorama",
    category: "jezero",
    dataTier: "Reference Context",
    mission: "NASA Mars 2020 Science Team",
    instrument: "Mastcam-Z Multispectral Stereo System",
    target: "Western Delta Front Outcrops & Boulder Fields",
    dateOrSol: "Sol 421 Primary Science Campaign",
    nasaId: "PIA25287 / Mastcam-Z",
    imageSrc: "/assets/nasa_gallery/mastcamz_delta.jpg",
    description: "Ultra-high-resolution panoramic mosaic showing boulder distributions, gravel beds, and cross-bedding sandstone layers at the delta front.",
    marsAtlasRole: "Reference observation archive: Used in nearest-neighbor visual lookups when inspecting rover ground-truth coordinates along the traverse.",
    officialUrl: "https://mars.nasa.gov/mars2020/multimedia/raw-images/"
  },
  {
    id: "curiosity_gale_boxwork",
    title: "Curiosity at Mount Sharp (Site 02)",
    category: "gale",
    dataTier: "Reference Context",
    mission: "NASA Mars Science Laboratory (MSL)",
    instrument: "Mast Camera (Mastcam) & ChemCam Laser",
    target: "Mount Sharp Gediz Vallis Ridge & Boxwork",
    dateOrSol: "Sol 1 to 5073 Continuous Traverse",
    nasaId: "PIA26251 / MSL_Gale",
    imageSrc: "/assets/nasa_gallery/curiosity_boxwork.jpg",
    description: "Curiosity climbing the steep slopes of Mount Sharp (Aeolis Mons), investigating mineralized fracture ridges ('boxwork') and boulder-strewn channels.",
    marsAtlasRole: "Comparative Gale Crater reference: Provides 1,389 real MSL drive waypoints for secondary regional terrain comparison.",
    officialUrl: "https://mars.nasa.gov/msl/"
  },
  {
    id: "m20_traverse_mmgis",
    title: "Perseverance MMGIS 559 Drive Legs",
    category: "jezero",
    dataTier: "Active Dataset",
    mission: "NASA-AMMOS Multimission Geographic Information System",
    instrument: "Engineering Hazcams & In-Situ Odometry",
    target: "Octavia E. Butler Landing Site to Delta Front",
    dateOrSol: "Sols 13–2022 Verified Telemetry",
    nasaId: "MMGIS_M20_TRAVERSE",
    imageSrc: "/assets/nasa_gallery/m20_traverse_map.png",
    description: "Official NASA-AMMOS spatial record of the Perseverance rover drive path, documenting traverse distances, sol stamps, and localized elevations.",
    marsAtlasRole: "Active operational layer: Rendered directly on our OpenLayers map canvas as a verified 559-leg telemetry benchmark alongside computed human EVA traverses.",
    officialUrl: "https://mars.nasa.gov/maps/location/?mission=M20"
  },
  {
    id: "terrain_heatmaps_derived",
    title: "Multi-Layer Terrain Intelligence Grid",
    category: "orbital",
    dataTier: "Active Dataset",
    mission: "MarsAtlas Geospatial Computation Engine",
    instrument: "Horn Finite Difference + THEMIS Thermal Inertia Proxy",
    target: "Jezero Modelled Sector (550 × 350 Surrogate Grid)",
    dateOrSol: "Derived 550 × 350 Metric Raster",
    nasaId: "MARSATLAS_GRID_01",
    imageSrc: "/assets/nasa_gallery/terrain_heatmaps.png",
    description: "Co-registered 550 × 350 cell prototype surrogate raster with elevation (-2605m to -2121m), Horn's finite-difference slope (0.0°–22.7°), local roughness (sigma_z), and thermal inertia proxy.",
    marsAtlasRole: "Active computational cost surface: Input raster for the 8-connected A* traverse planner to balance slope grade, transit time, and bioenergetics.",
    officialUrl: "https://github.com/shubham25-droid/MarsAtlas"
  },
  {
    id: "geology_sim3464_crism",
    title: "USGS SIM 3464 Units & CRISM Targets",
    category: "orbital",
    dataTier: "Active Dataset",
    mission: "USGS Astrogeology & NASA MRO CRISM",
    instrument: "Geologic Mapping & CRISM Spectral Literature",
    target: "Jezero Lacustrine Units & Carbonate Outcrops",
    dateOrSol: "Sun & Stack (2020) SIM 3464 Standard",
    nasaId: "USGS_SIM_3464 / CRISM_HOTSPOTS",
    imageSrc: "/assets/nasa_gallery/geology_sim3464.png",
    description: "Simplified geologic vector units digitized after Sun & Stack (2020) SIM 3464, combined with 5 manually authored CRISM-referenced science target locations.",
    marsAtlasRole: "Active vector overlays: Renders simplified stratigraphic units on the map canvas and provides heuristic reward bonuses in Science Priority mode.",
    officialUrl: "https://pubs.usgs.gov/sim/3464/"
  },
  {
    id: "ingenuity_aerial_scout",
    title: "Ingenuity Aerial Scout (Reference)",
    category: "jezero",
    dataTier: "Reference Context",
    mission: "NASA Mars 2020 Aerial Scout Experiment",
    instrument: "Return-to-Earth (RTE) High-Resolution Color Camera",
    target: "Airfield J & Séítah Sand Ripple Fields",
    dateOrSol: "72 Historic Flights Completed",
    nasaId: "PIA24654 / Ingenuity",
    imageSrc: "/assets/nasa_gallery/ingenuity.jpg",
    description: "Aerial color imagery captured during historic helicopter flights over Séítah sand fields, illustrating traversability hazards impassable from ground view.",
    marsAtlasRole: "Reference context: Demonstrates the necessity of orbital and aerial hazard detection to avoid sand ripple entrapment.",
    officialUrl: "https://mars.nasa.gov/technology/helicopter/"
  }
];

export default function NasaMissionGallery() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const filteredItems = selectedCategory === "all"
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.category === selectedCategory);

  return (
    <section className="w-full py-20 px-4 sm:px-6 bg-[#04070D] border-t border-white/[0.08] relative overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#F36C3D]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-7 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-white/[0.08]">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#F36C3D] animate-pulse" />
              <span className="text-xs font-mono font-bold text-[#F36C3D] tracking-widest uppercase">
                SCIENTIFIC DATA PROVENANCE &amp; OBSERVATION ARCHIVES
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase font-sans">
              Planetary Surface &amp; Mission Observations
            </h2>
            <p className="text-sm text-[#94A3B8] max-w-2xl leading-relaxed">
              Authentic NASA &amp; USGS planetary observations and mission context. Explore in-situ rover imagery, reference orbital topography, and regional geologic maps providing scientific benchmarks for our prototype traverse decision-support engine.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <span className="text-xs font-bold text-white tracking-wide uppercase font-mono">Explore NASA Archives</span>
            <a
              href="https://mars.nasa.gov/mars2020/multimedia/raw-images/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-[#F36C3D] hover:bg-[#d9582d] flex items-center justify-center text-white transition-all shadow-lg shadow-[#F36C3D]/30 group"
              title="Open Official NASA Mars 2020 Raw Image Archive"
            >
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>

        {/* Epistemic Provenance Distinction Banner */}
        <div className="p-3.5 rounded-xl bg-[#0C1220]/90 border border-white/[0.08] flex flex-col sm:flex-row sm:items-center gap-3 text-xs text-[#94A3B8]">
          <div className="flex items-center gap-2 shrink-0">
            <Info className="w-4 h-4 text-[#38BDF8]" />
            <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/30 font-bold uppercase">
              Data Distinction
            </span>
          </div>
          <p className="leading-relaxed">
            Items labeled <span className="text-[#34D399] font-semibold">Active Dataset</span> (e.g. MMGIS rover traverse telemetry, 550×350 surrogate cost grid, vector overlays) directly feed application calculations. Items labeled <span className="text-[#38BDF8] font-semibold">Reference Context</span> (e.g. raw 1m HiRISE DTMs, Mastcam-Z mosaics, Ingenuity aerial imagery) provide external planetary ground truth and scientific context.
          </p>
        </div>

        {/* Category Filters (Pill Buttons) */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              selectedCategory === "all"
                ? "bg-white text-black font-bold shadow-md shadow-white/10"
                : "bg-[#0C1220] text-[#94A3B8] hover:text-white border border-white/[0.08]"
            }`}
          >
            All Datasets ({GALLERY_ITEMS.length})
          </button>
          <button
            onClick={() => setSelectedCategory("jezero")}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              selectedCategory === "jezero"
                ? "bg-[#F36C3D] text-white font-bold shadow-md shadow-[#F36C3D]/25"
                : "bg-[#0C1220] text-[#94A3B8] hover:text-white border border-white/[0.08]"
            }`}
          >
            Site 01: Jezero Crater (Perseverance)
          </button>
          <button
            onClick={() => setSelectedCategory("gale")}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              selectedCategory === "gale"
                ? "bg-[#38BDF8] text-[#04070D] font-bold shadow-md shadow-[#38BDF8]/25"
                : "bg-[#0C1220] text-[#94A3B8] hover:text-white border border-white/[0.08]"
            }`}
          >
            Site 02: Mount Sharp Boxwork (Curiosity)
          </button>
          <button
            onClick={() => setSelectedCategory("orbital")}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              selectedCategory === "orbital"
                ? "bg-[#34D399] text-[#04070D] font-bold shadow-md shadow-[#34D399]/25"
                : "bg-[#0C1220] text-[#94A3B8] hover:text-white border border-white/[0.08]"
            }`}
          >
            Orbital DTM &amp; Geologic Maps (USGS / HiRISE)
          </button>
        </div>

        {/* 4-Column Card Grid (Matching NASA Reference Layout) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              className="group relative h-[400px] rounded-2xl overflow-hidden cursor-pointer bg-[#0A0F1D] border border-white/[0.08] hover:border-white/[0.25] transition-all duration-300 shadow-xl hover:shadow-2xl flex flex-col justify-end p-6 select-none"
            >
              {/* Image Background */}
              <img
                src={item.imageSrc}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />

              {/* Scrim Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/10 group-hover:via-black/60 transition-colors" />

              {/* Top Tag Badges: Region + Epistemic Tier */}
              <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold tracking-wider uppercase bg-black/75 text-white/90 border border-white/10 backdrop-blur-md">
                  {item.category === "jezero" ? "Jezero Crater" : item.category === "gale" ? "Mount Sharp" : "Orbital Reference"}
                </span>
                <span className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-bold tracking-wider uppercase border backdrop-blur-md ${
                  item.dataTier === "Active Dataset"
                    ? "bg-[#34D399]/25 text-[#34D399] border-[#34D399]/40"
                    : "bg-[#38BDF8]/25 text-[#38BDF8] border-[#38BDF8]/40"
                }`}>
                  {item.dataTier}
                </span>
              </div>

              {/* Bottom Information Content */}
              <div className="relative z-10 flex items-end justify-between gap-3">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white leading-tight font-sans tracking-tight drop-shadow-md">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#CBD5E1] line-clamp-1 drop-shadow">
                    {item.mission}
                  </p>
                </div>

                {/* NASA Red/Orange Circle Action Button */}
                <div className="w-8 h-8 rounded-full bg-[#F36C3D] group-hover:bg-[#d9582d] flex-shrink-0 flex items-center justify-center text-white transition-all shadow-md shadow-[#F36C3D]/30 transform group-hover:scale-110">
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Detail Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl max-h-[92vh] bg-[#070B14] border border-white/[0.12] rounded-2xl flex flex-col overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.95)]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#0A0F1D]">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#F36C3D]" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white font-sans uppercase tracking-wide">
                      {activeItem.title}
                    </h3>
                    <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase border ${
                      activeItem.dataTier === "Active Dataset"
                        ? "bg-[#34D399]/20 text-[#34D399] border-[#34D399]/30"
                        : "bg-[#38BDF8]/20 text-[#38BDF8] border-[#38BDF8]/30"
                    }`}>
                      {activeItem.dataTier}
                    </span>
                  </div>
                  <p className="text-xs text-[#94A3B8] font-mono">
                    NASA Product ID: {activeItem.nasaId}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveItem(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
                title="Close Inspector"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto p-6 space-y-6">
              {/* Image Preview */}
              <div className="w-full h-80 sm:h-96 rounded-xl overflow-hidden border border-white/[0.1] relative bg-black shadow-inner">
                <img
                  src={activeItem.imageSrc}
                  alt={activeItem.title}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-[#0C1220] border border-white/[0.06] space-y-1">
                  <span className="text-[10px] font-mono text-[#64748B] uppercase font-bold block">Mission Source</span>
                  <span className="text-white font-semibold">{activeItem.mission}</span>
                </div>
                <div className="p-3 rounded-lg bg-[#0C1220] border border-white/[0.06] space-y-1">
                  <span className="text-[10px] font-mono text-[#64748B] uppercase font-bold block">Instrument Payload</span>
                  <span className="text-[#38BDF8] font-semibold">{activeItem.instrument}</span>
                </div>
                <div className="p-3 rounded-lg bg-[#0C1220] border border-white/[0.06] space-y-1">
                  <span className="text-[10px] font-mono text-[#64748B] uppercase font-bold block">Target Feature</span>
                  <span className="text-[#34D399] font-semibold">{activeItem.target}</span>
                </div>
                <div className="p-3 rounded-lg bg-[#0C1220] border border-white/[0.06] space-y-1">
                  <span className="text-[10px] font-mono text-[#64748B] uppercase font-bold block">Data Role</span>
                  <span className={`font-semibold ${
                    activeItem.dataTier === "Active Dataset" ? "text-[#34D399]" : "text-[#38BDF8]"
                  }`}>
                    {activeItem.dataTier === "Active Dataset" ? "Operational Input" : "External Benchmark"}
                  </span>
                </div>
              </div>

              {/* Detailed Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Scientific Observation Context
                </h4>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  {activeItem.description}
                </p>
              </div>

              {/* Direct Role in MarsAtlas */}
              <div className="p-4 rounded-xl bg-[#0C1220] border border-[#38BDF8]/20 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#38BDF8]">
                  <Sparkles className="w-4 h-4 text-[#38BDF8]" />
                  <span>Integration into MarsAtlas Architecture</span>
                </div>
                <p className="text-xs text-[#CBD5E1] leading-relaxed">
                  {activeItem.marsAtlasRole}
                </p>
              </div>

              {/* Official Link */}
              <div className="flex justify-end pt-2">
                <a
                  href={activeItem.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-[#F36C3D] hover:bg-[#db542a] text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-[#F36C3D]/25"
                >
                  <span>Explore on Official NASA / USGS Mission Page</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

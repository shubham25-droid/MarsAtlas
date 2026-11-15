"use client";

import React, { useState } from "react";
import NasaOrbitalBackground from "./NasaOrbitalBackground";
import { 
  ArrowRight, 
  ExternalLink, 
  X, 
  Layers, 
  Compass,
  Mountain,
  Eye,
  Info
} from "lucide-react";

export interface GalleryItem {
  id: string;
  title: string;
  category: "all" | "jezero" | "gale" | "orbital";
  dataTier: "Active Dataset" | "Contextual Overlay" | "Reference Context";
  mission: string;
  instrument: string;
  target: string;
  dateOrSol: string;
  nasaId: string;
  imageSrc: string;
  description: string;
  marsAtlasRole: string;
  officialUrl: string;
  linkText: string;
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
    officialUrl: "https://mars.nasa.gov/mars2020/",
    linkText: "Explore NASA Mars 2020 Mission Archive"
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
    officialUrl: "https://hirise.lpl.arizona.edu/",
    linkText: "Explore University of Arizona HiRISE Archive"
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
    officialUrl: "https://mars.nasa.gov/mars2020/multimedia/raw-images/",
    linkText: "Explore NASA Mars Raw Image Catalog"
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
    marsAtlasRole: "Comparative Gale Crater reference: Ingests 1,389 real MSL drive waypoints for secondary regional terrain comparison.",
    officialUrl: "https://mars.nasa.gov/msl/",
    linkText: "Explore NASA Curiosity Mars Mission"
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
    officialUrl: "https://mars.nasa.gov/maps/location/?mission=M20",
    linkText: "Explore NASA-AMMOS MMGIS Map Portal"
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
    description: "Co-registered 550 × 350 cell prototype surrogate raster with elevation (-2605m to -2121m), Horn's finite-difference slope (0.0°–22.7°), local roughness (σ_z standard deviation), and thermal inertia proxy.",
    marsAtlasRole: "Active computational cost surface: Input raster for the 8-connected A* traverse planner to balance slope grade, transit time, and bioenergetics.",
    officialUrl: "https://trek.nasa.gov/mars/",
    linkText: "Explore NASA Mars Trek Topography Portal"
  },
  {
    id: "geology_sim3464_crism",
    title: "USGS SIM 3464 Units & CRISM Targets",
    category: "orbital",
    dataTier: "Contextual Overlay",
    mission: "USGS Astrogeology & NASA MRO CRISM",
    instrument: "Geologic Mapping & CRISM Spectral Literature",
    target: "Jezero Lacustrine Units & Carbonate Outcrops",
    dateOrSol: "Sun & Stack (2020) SIM 3464 Standard",
    nasaId: "USGS_SIM_3464 / CRISM_HOTSPOTS",
    imageSrc: "/assets/nasa_gallery/geology_sim3464.png",
    description: "Simplified geologic vector units digitized after Sun & Stack (2020) SIM 3464, combined with 5 manually authored CRISM-referenced science target locations for regional exploration context.",
    marsAtlasRole: "Contextual spatial overlay: Renders simplified stratigraphic units and science-interest targets as contextual map layers; informs Science Priority route weighting heuristics.",
    officialUrl: "https://pubs.usgs.gov/sim/3464/",
    linkText: "Explore USGS SIM 3464 Geologic Publication"
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
    officialUrl: "https://mars.nasa.gov/technology/helicopter/",
    linkText: "Explore NASA Ingenuity Flight Archive"
  }
];

export default function NasaMissionGallery() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const filteredItems = selectedCategory === "all"
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.category === selectedCategory);

  return (
    <section className="w-full py-20 px-4 sm:px-6 bg-white border-b border-slate-200 relative overflow-hidden">
      {/* Authentic NASA Space Apps Orbital Lines Background */}
      <NasaOrbitalBackground opacity={0.65} />

      <div className="max-w-7xl mx-auto space-y-7 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-slate-200">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#EA580C] animate-pulse" />
              <span className="text-xs font-sans font-bold text-[#EA580C] tracking-wider uppercase">
                Scientific Data Provenance &amp; Mission Archives
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight uppercase font-sans">
              Planetary Surface &amp; Mission Observations
            </h2>
            <p className="text-base text-slate-600 max-w-2xl leading-relaxed font-sans">
              Authentic NASA &amp; USGS planetary observations and mission context. Explore in-situ rover imagery, reference orbital topography, and regional geologic maps providing scientific benchmarks for our prototype traverse decision-support engine.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <span className="text-xs font-sans font-bold text-slate-700 tracking-wide uppercase">Explore NASA Archives</span>
            <a
              href="https://mars.nasa.gov/mars2020/multimedia/raw-images/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-[#EA580C] hover:bg-[#C2410C] flex items-center justify-center text-white transition-all shadow-md shadow-[#EA580C]/25 group"
              title="Open Official NASA Mars 2020 Raw Image Archive"
            >
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>

        {/* Epistemic Provenance Distinction Banner */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center gap-3 text-sm text-slate-700 font-sans shadow-sm">
          <div className="flex items-center gap-2 shrink-0">
            <Info className="w-4 h-4 text-[#0284C7]" />
            <span className="px-2.5 py-1 rounded-md font-sans text-xs bg-sky-100 text-[#0284C7] border border-sky-200 font-bold uppercase tracking-wide">
              Data Distinction
            </span>
          </div>
          <p className="leading-relaxed">
            Items labeled <span className="text-[#15803D] font-bold">Active Dataset</span> (e.g. MMGIS rover traverse telemetry, 550×350 surrogate cost grid) directly feed calculations. Items labeled <span className="text-[#7C3AED] font-bold">Contextual Overlay</span> (e.g. simplified USGS SIM 3464 geologic polygons, authored CRISM-referenced points) provide spatial overlays. Items labeled <span className="text-[#0284C7] font-bold">Reference Context</span> (e.g. raw 1m HiRISE DTMs, Mastcam-Z mosaics, Ingenuity aerial photography) provide external planetary ground truth.
          </p>
        </div>

        {/* Category Filters (Pill Buttons) */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-sans">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-full font-semibold transition-all ${
              selectedCategory === "all"
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
            }`}
          >
            All Datasets ({GALLERY_ITEMS.length})
          </button>
          <button
            onClick={() => setSelectedCategory("jezero")}
            className={`px-4 py-2 rounded-full font-semibold transition-all ${
              selectedCategory === "jezero"
                ? "bg-[#EA580C] text-white shadow-sm shadow-[#EA580C]/25"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
            }`}
          >
            Site 01: Jezero Crater (Perseverance)
          </button>
          <button
            onClick={() => setSelectedCategory("gale")}
            className={`px-4 py-2 rounded-full font-semibold transition-all ${
              selectedCategory === "gale"
                ? "bg-[#0284C7] text-white shadow-sm shadow-[#0284C7]/25"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
            }`}
          >
            Site 02: Mount Sharp Boxwork (Curiosity)
          </button>
          <button
            onClick={() => setSelectedCategory("orbital")}
            className={`px-4 py-2 rounded-full font-semibold transition-all ${
              selectedCategory === "orbital"
                ? "bg-[#15803D] text-white shadow-sm shadow-[#15803D]/25"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
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
              className="group relative h-[400px] rounded-2xl overflow-hidden cursor-pointer bg-slate-950 border border-slate-200 hover:border-slate-400 transition-all duration-300 shadow-md hover:shadow-xl flex flex-col justify-end p-6 select-none"
            >
              {/* Image Background */}
              <img
                src={item.imageSrc}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />

              {/* Scrim Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent group-hover:via-black/55 transition-colors" />

              {/* Top Tag Badges: Region + Epistemic Tier */}
              <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 rounded-md text-xs font-sans font-medium tracking-wide uppercase bg-black/75 text-white border border-white/10 backdrop-blur-sm">
                  {item.category === "jezero" ? "Jezero Crater" : item.category === "gale" ? "Mount Sharp" : "Orbital Reference"}
                </span>
                <span className={`px-2.5 py-1 rounded-md text-xs font-sans font-semibold tracking-wide uppercase border backdrop-blur-sm ${
                  item.dataTier === "Active Dataset"
                    ? "bg-[#15803D]/30 text-[#4ade80] border-[#4ade80]/40"
                    : item.dataTier === "Contextual Overlay"
                    ? "bg-[#7C3AED]/30 text-[#c084fc] border-[#c084fc]/40"
                    : "bg-[#0284C7]/30 text-[#38bdf8] border-[#38bdf8]/40"
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
                  <p className="text-xs text-slate-200 line-clamp-1 drop-shadow font-sans">
                    {item.mission}
                  </p>
                </div>

                {/* NASA Red/Orange Circle Action Button */}
                <div className="w-8 h-8 rounded-full bg-[#EA580C] group-hover:bg-[#C2410C] flex-shrink-0 flex items-center justify-center text-white transition-all shadow-md shadow-[#EA580C]/30 transform group-hover:scale-110">
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Detail Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl max-h-[92vh] bg-white border border-slate-200 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#EA580C]" />
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-base font-bold text-slate-900 font-sans tracking-tight">
                      {activeItem.title}
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-full font-sans text-xs font-semibold uppercase border ${
                      activeItem.dataTier === "Active Dataset"
                        ? "bg-[#DCFCE7] text-[#15803D] border-[#15803D]/30"
                        : activeItem.dataTier === "Contextual Overlay"
                        ? "bg-[#F3E8FF] text-[#7C3AED] border-[#7C3AED]/30"
                        : "bg-[#E0F2FE] text-[#0369A1] border-[#0369A1]/30"
                    }`}>
                      {activeItem.dataTier}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-sans mt-0.5">
                    Product Reference: {activeItem.nasaId}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveItem(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 transition-colors"
                title="Close Inspector"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto p-6 space-y-6">
              {/* Image Preview */}
              <div className="w-full h-80 sm:h-96 rounded-xl overflow-hidden border border-slate-200 relative bg-black shadow-inner">
                <img
                  src={activeItem.imageSrc}
                  alt={activeItem.title}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-sans">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block">Mission Source</span>
                  <span className="text-slate-900 font-bold text-xs sm:text-sm">{activeItem.mission}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block">Instrument Payload</span>
                  <span className="text-[#0284C7] font-bold text-xs sm:text-sm">{activeItem.instrument}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block">Target Feature</span>
                  <span className="text-slate-900 font-bold text-xs sm:text-sm">{activeItem.target}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block">Data Role</span>
                  <span className={`font-bold text-xs sm:text-sm ${
                    activeItem.dataTier === "Active Dataset"
                      ? "text-[#15803D]"
                      : activeItem.dataTier === "Contextual Overlay"
                      ? "text-[#7C3AED]"
                      : "text-[#0284C7]"
                  }`}>
                    {activeItem.dataTier === "Active Dataset"
                      ? "Operational Input"
                      : activeItem.dataTier === "Contextual Overlay"
                      ? "Contextual Overlay"
                      : "External Benchmark"}
                  </span>
                </div>
              </div>

              {/* Detailed Description */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#EA580C]" />
                  <h4 className="text-xs font-sans font-bold text-slate-900 uppercase tracking-wider">
                    Scientific Observation Context
                  </h4>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed font-sans pl-6">
                  {activeItem.description}
                </p>
              </div>

              {/* Direct Role in MarsAtlas */}
              <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-sans font-bold text-[#0284C7]">
                  <Layers className="w-4 h-4 text-[#0284C7]" />
                  <span>Role in MarsAtlas Geospatial Engine</span>
                </div>
                <p className="text-sm text-slate-800 leading-relaxed font-sans pl-6">
                  {activeItem.marsAtlasRole}
                </p>
              </div>

              {/* Official Link */}
              <div className="flex justify-end pt-2">
                <a
                  href={activeItem.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-sans font-semibold rounded-xl flex items-center gap-2 transition-all shadow-sm hover:shadow"
                >
                  <span>{activeItem.linkText}</span>
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

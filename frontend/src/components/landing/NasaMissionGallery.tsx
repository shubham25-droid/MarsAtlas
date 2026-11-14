"use client";

import React, { useState } from "react";
import { 
  ArrowRight, 
  ExternalLink, 
  Maximize2, 
  X, 
  Sparkles, 
  Camera, 
  Layers, 
  Globe2, 
  Compass,
  Eye,
  Info
} from "lucide-react";

export interface GalleryItem {
  id: string;
  title: string;
  category: "all" | "perseverance" | "curiosity" | "hirise" | "astrophysics";
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
    id: "webb",
    title: "James Webb Space Telescope",
    category: "astrophysics",
    mission: "JWST • Cosmic Cliffs in Carina Nebula",
    instrument: "NIRCam (Near-Infrared Camera)",
    target: "NGC 3324 Star-Forming Region",
    dateOrSol: "July 2022",
    nasaId: "PIA25324 / STScI-2022-031",
    imageSrc: "/assets/nasa_gallery/webb.jpg",
    description: "The iconic NIRCam observation of the Cosmic Cliffs revealing previously invisible areas of star birth in the Carina Nebula, showcasing cutting-edge infrared sensors.",
    marsAtlasRole: "Informs interplanetary deep space navigation context, high-energy solar radiation monitoring, and multi-spectral sensor architectures.",
    officialUrl: "https://www.nasa.gov/mission/james-webb-space-telescope/"
  },
  {
    id: "hubble",
    title: "Hubble Space Telescope",
    category: "astrophysics",
    mission: "Hubble Space Telescope in Orbit",
    instrument: "Wide Field Camera 3 (WFC3)",
    target: "Low Earth Orbit & Planetary Targets",
    dateOrSol: "Servicing Mission STS-82 / SM4",
    nasaId: "PIA03014",
    imageSrc: "/assets/nasa_gallery/hubble.jpg",
    description: "The Hubble Space Telescope in high orbit over Earth, capturing decades of planetary atmospheric changes, dust storms on Mars, and celestial milestones.",
    marsAtlasRole: "Historical calibration for long-term Martian global dust storm cycles, optical atmospheric opacity, and cross-mission planetary benchmarking.",
    officialUrl: "https://www.nasa.gov/mission/hubble-space-telescope/"
  },
  {
    id: "perseverance",
    title: "Perseverance Rover",
    category: "perseverance",
    mission: "Mars 2020 Exploration Mission",
    instrument: "Mastcam-Z & SuperCam RMI",
    target: "Jezero Crater Western Delta Contact",
    dateOrSol: "Sol 360–2022 Telemetry",
    nasaId: "PIA24836 / M20_Jezero",
    imageSrc: "/assets/nasa_gallery/perseverance.jpg",
    description: "Perseverance rover self-portrait and multispectral survey on the floor of Jezero Crater, documenting lacustrine clay-bearing mudstones and delta scarps.",
    marsAtlasRole: "Provides 708 real waypoints and 559 drive legs to ground-truth MarsAtlas slope computations and nearest-observation surface image matching.",
    officialUrl: "https://mars.nasa.gov/mars2020/"
  },
  {
    id: "eyes",
    title: "NASA's Eyes",
    category: "astrophysics",
    mission: "NASA Solar System Exploration",
    instrument: "SPICE Ephemeris & Orbital Trajectory Visualizer",
    target: "Solar System Planetary Architecture",
    dateOrSol: "Real-Time Telemetry Feed",
    nasaId: "NASA-EYES-SYS",
    imageSrc: "/assets/nasa_gallery/eyes.jpg",
    description: "NASA's real-time interactive simulation visualizing true spacecraft orbital trajectories, planetary alignments, and planetary approach corridors.",
    marsAtlasRole: "Serves as the visual paradigm for MarsAtlas's interactive 3D WebGL tactical sector viewer and orbital ephemeris synchronization.",
    officialUrl: "https://eyes.nasa.gov/"
  },
  {
    id: "curiosity",
    title: "Curiosity Rover",
    category: "curiosity",
    mission: "Mars Science Laboratory (MSL)",
    instrument: "MAHLI & ChemCam Laser",
    target: "Mount Sharp Boxwork Formations (Gale Crater)",
    dateOrSol: "Sol 1 to 5073 Continuous Drive",
    nasaId: "PIA16239 / MSL_Gale",
    imageSrc: "/assets/nasa_gallery/curiosity.jpg",
    description: "Curiosity surveying the intricate mineralized fracture ridges ('boxwork') and sulfate-bearing units on the slopes of Aeolis Mons (Mount Sharp).",
    marsAtlasRole: "Powers the Site 02 preset in MarsAtlas, providing 1,389 real drive waypoints to stress-test route traversal through sand hollows and ridge networks.",
    officialUrl: "https://mars.nasa.gov/msl/"
  },
  {
    id: "hirise_delta",
    title: "HiRISE 1m Topography",
    category: "hirise",
    mission: "Mars Reconnaissance Orbiter (MRO)",
    instrument: "HiRISE High Resolution Imaging Science Experiment",
    target: "Jezero Crater Western Fan Scarp",
    dateOrSol: "MRO Primary Science Phase",
    nasaId: "PIA23962 / PSP_001415",
    imageSrc: "/assets/nasa_gallery/hirise_delta.jpg",
    description: "1 meter/pixel stereo digital elevation model revealing 60-meter layered scarps and candidate boulder fields at the Cape Flatley delta contact.",
    marsAtlasRole: "Forms the mathematical foundation for Horn's 3x3 finite-difference slope gradient calculation and astronaut walkback stability limits (<22.0°).",
    officialUrl: "https://hirise.lpl.arizona.edu/"
  },
  {
    id: "ingenuity",
    title: "Ingenuity Mars Helicopter",
    category: "perseverance",
    mission: "Mars 2020 Aerial Scout",
    instrument: "RTE (Return-to-Earth Color Camera)",
    target: "Airfield J & Séítah Sand Hollows",
    dateOrSol: "72 Historic Flights Completed",
    nasaId: "PIA24654 / Ingenuity",
    imageSrc: "/assets/nasa_gallery/ingenuity.jpg",
    description: "The first aircraft in history to achieve powered, controlled flight on another world, scouting rover path options over hazardous ripple fields.",
    marsAtlasRole: "Demonstrates the necessity of aerial/orbital reconnaissance in human EVA pathfinding to identify hazards invisible from horizontal ground level.",
    officialUrl: "https://mars.nasa.gov/technology/helicopter/"
  },
  {
    id: "mars_global",
    title: "Mars Global Hemisphere",
    category: "hirise",
    mission: "Viking Orbiter & MOLA Albedo",
    instrument: "Viking Camera / Mars Global Surveyor MOLA",
    target: "Global Martian Planetocentric Frame",
    dateOrSol: "Global MDIM 2.1 Standard",
    nasaId: "PIA00407 / USGS_MOLA",
    imageSrc: "/assets/nasa_gallery/mars_global.jpg",
    description: "Global mosaic showing Valles Marineris, Tharsis volcanoes, and the hemispheric crustal dichotomy under standard IAU 2000 planetocentric coordinates.",
    marsAtlasRole: "Integrated into the MarsAtlas OpenLayers basemap layer stack via USGS Astrogeology Science Center WMS endpoints for global spatial orientation.",
    officialUrl: "https://astrogeology.usgs.gov/"
  }
];

export default function NasaMissionGallery() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const filteredItems = selectedCategory === "all"
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.category === selectedCategory);

  return (
    <section className="w-full py-24 px-4 sm:px-6 bg-[#04070D] border-t border-white/[0.08] relative overflow-hidden">
      {/* Background Starry Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#0B3D91]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        {/* Section Header (Authentic NASA Style) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-white/[0.08]">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FC3D21] animate-pulse" />
              <span className="text-xs font-mono font-bold text-[#FC3D21] tracking-widest uppercase">
                NASA MISSIONS &amp; PLANETARY ARCHIVES
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase font-sans">
              Planetary Surface &amp; Orbital Observations
            </h2>
            <p className="text-sm text-[#94A3B8] max-w-2xl leading-relaxed">
              Explore authentic high-resolution imagery from NASA planetary exploration missions. These multi-wavelength datasets power the topographic and science layers of MarsAtlas.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <span className="text-xs font-bold text-white tracking-wide uppercase">Discover More</span>
            <a
              href="https://images.nasa.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-[#FC3D21] hover:bg-[#d62d16] flex items-center justify-center text-white transition-all shadow-lg shadow-[#FC3D21]/30 group"
              title="Browse NASA Image Library"
            >
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>

        {/* Category Filters (NASA Pill Buttons) */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              selectedCategory === "all"
                ? "bg-white text-black font-bold shadow-md shadow-white/10"
                : "bg-[#0C1220] text-[#94A3B8] hover:text-white border border-white/[0.08]"
            }`}
          >
            All Archives ({GALLERY_ITEMS.length})
          </button>
          <button
            onClick={() => setSelectedCategory("perseverance")}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              selectedCategory === "perseverance"
                ? "bg-[#FC3D21] text-white font-bold shadow-md shadow-[#FC3D21]/20"
                : "bg-[#0C1220] text-[#94A3B8] hover:text-white border border-white/[0.08]"
            }`}
          >
            Perseverance (Jezero Delta)
          </button>
          <button
            onClick={() => setSelectedCategory("curiosity")}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              selectedCategory === "curiosity"
                ? "bg-[#38BDF8] text-[#04070D] font-bold shadow-md shadow-[#38BDF8]/20"
                : "bg-[#0C1220] text-[#94A3B8] hover:text-white border border-white/[0.08]"
            }`}
          >
            Curiosity (Mount Sharp Boxwork)
          </button>
          <button
            onClick={() => setSelectedCategory("hirise")}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              selectedCategory === "hirise"
                ? "bg-[#34D399] text-[#04070D] font-bold shadow-md shadow-[#34D399]/20"
                : "bg-[#0C1220] text-[#94A3B8] hover:text-white border border-white/[0.08]"
            }`}
          >
            HiRISE (Orbital 3D DTM)
          </button>
          <button
            onClick={() => setSelectedCategory("astrophysics")}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              selectedCategory === "astrophysics"
                ? "bg-[#A78BFA] text-[#04070D] font-bold shadow-md shadow-[#A78BFA]/20"
                : "bg-[#0C1220] text-[#94A3B8] hover:text-white border border-white/[0.08]"
            }`}
          >
            Deep Space &amp; Astrophysics
          </button>
        </div>

        {/* The 4-Column Card Grid (Matching NASA.gov reference) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              className="group relative h-[420px] rounded-2xl overflow-hidden cursor-pointer bg-[#0A0F1D] border border-white/[0.08] hover:border-white/[0.25] transition-all duration-300 shadow-xl hover:shadow-2xl flex flex-col justify-end p-6 select-none"
            >
              {/* Image Background with Zoom on Hover */}
              <img
                src={item.imageSrc}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />

              {/* Multi-stage Scrim Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10 group-hover:via-black/50 transition-colors" />

              {/* Top Tag Badge */}
              <div className="absolute top-4 left-4 z-10">
                <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold tracking-wider uppercase bg-black/60 text-white/90 border border-white/10 backdrop-blur-md">
                  {item.category === "astrophysics" ? "Deep Space" : item.category === "perseverance" ? "Mars 2020" : item.category === "curiosity" ? "MSL" : "Orbital DTM"}
                </span>
              </div>

              {/* Bottom Information Content */}
              <div className="relative z-10 flex items-end justify-between gap-3">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white leading-tight font-sans tracking-tight drop-shadow-md">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#CBD5E1] line-clamp-1 drop-shadow">
                    {item.mission}
                  </p>
                </div>

                {/* NASA Red Circle Action Button */}
                <div className="w-8 h-8 rounded-full bg-[#FC3D21] group-hover:bg-[#e0341a] flex-shrink-0 flex items-center justify-center text-white transition-all shadow-md shadow-[#FC3D21]/30 transform group-hover:scale-110">
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Detail Modal (Government Standard) */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl max-h-[92vh] bg-[#070B14] border border-white/[0.12] rounded-2xl flex flex-col overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.95)]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#0A0F1D]">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FC3D21]" />
                <div>
                  <h3 className="text-base font-bold text-white font-sans uppercase tracking-wide">
                    {activeItem.title}
                  </h3>
                  <p className="text-xs text-[#94A3B8] font-mono">
                    NASA Product ID: {activeItem.nasaId}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveItem(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
                title="Close Archive Inspector"
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
                  <span className="text-[10px] font-mono text-[#64748B] uppercase font-bold block">Mission</span>
                  <span className="text-white font-semibold">{activeItem.mission}</span>
                </div>
                <div className="p-3 rounded-lg bg-[#0C1220] border border-white/[0.06] space-y-1">
                  <span className="text-[10px] font-mono text-[#64748B] uppercase font-bold block">Instrument</span>
                  <span className="text-[#38BDF8] font-semibold">{activeItem.instrument}</span>
                </div>
                <div className="p-3 rounded-lg bg-[#0C1220] border border-white/[0.06] space-y-1">
                  <span className="text-[10px] font-mono text-[#64748B] uppercase font-bold block">Observation Target</span>
                  <span className="text-[#34D399] font-semibold">{activeItem.target}</span>
                </div>
                <div className="p-3 rounded-lg bg-[#0C1220] border border-white/[0.06] space-y-1">
                  <span className="text-[10px] font-mono text-[#64748B] uppercase font-bold block">Acquisition Date / Sol</span>
                  <span className="text-[#FBBF24] font-semibold">{activeItem.dateOrSol}</span>
                </div>
              </div>

              {/* Detailed Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Mission Observation Context
                </h4>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  {activeItem.description}
                </p>
              </div>

              {/* Role in MarsAtlas */}
              <div className="p-4 rounded-xl bg-[#0C1220] border border-[#38BDF8]/20 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#38BDF8]">
                  <Sparkles className="w-4 h-4 text-[#38BDF8]" />
                  <span>Role in MarsAtlas Planning Architecture</span>
                </div>
                <p className="text-xs text-[#CBD5E1] leading-relaxed">
                  {activeItem.marsAtlasRole}
                </p>
              </div>

              {/* External NASA link */}
              <div className="flex justify-end pt-2">
                <a
                  href={activeItem.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-[#FC3D21] hover:bg-[#d62d16] text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-[#FC3D21]/20"
                >
                  <span>Explore on Official NASA Mission Archive</span>
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

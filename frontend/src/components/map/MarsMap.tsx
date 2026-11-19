"use client";

import React, { useEffect, useRef, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import ImageLayer from "ol/layer/Image";
import VectorLayer from "ol/layer/Vector";
import TileWMS from "ol/source/TileWMS";
import XYZ from "ol/source/XYZ";
import Static from "ol/source/ImageStatic";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { Circle as CircleStyle, Fill, Stroke, Style, Text, Icon } from "ol/style";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { getRenderPixel } from "ol/render";
import ScaleLine from "ol/control/ScaleLine";
import { 
  Layers, 
  Eye, 
  EyeOff, 
  Sliders, 
  Compass, 
  MapPin, 
  AlertTriangle,
  Flame,
  Mountain,
  Sparkles,
  Columns,
  RotateCcw,
  CheckCircle2,
  Radio,
  Crosshair,
  Camera,
  Info
} from "lucide-react";
import { PlanEvaResponse, PointTelemetry, RoverObservation, ScienceTargetFeature } from "@/types/mars";
import { fetchPointTelemetry, fetchRoverGroundTruth } from "@/services/api";

const JEZERO_LANDMARKS = [
  { name: "Octavia E. Butler Landing Site", sol: 13, lon: 77.4509, lat: 18.4446, type: "base", desc: "Perseverance touchdown location (Feb 18, 2021). Flat basaltic crater floor." },
  { name: "Western Delta Scarp (Target)", sol: 420, lon: 77.4150, lat: 18.4485, type: "science", desc: "Ancient river delta cliff exposing multi-layered lacustrine clay and siltstone." },
  { name: "Kodiak Butte (Delta Remnant)", sol: 250, lon: 77.4125, lat: 18.4388, type: "landmark", desc: "Isolated sedimentary butte showing classic delta bottomset-foreset-topset beds." },
  { name: "Séítah Aeolian Dunes (Slip Hazard)", sol: 180, lon: 77.4439, lat: 18.4412, type: "hazard", desc: "Traversability slip hazard. Loose windblown sand ripples over olivine cumulate bedrock." },
  { name: "Cape Flatley (Delta Contact)", sol: 450, lon: 77.4018, lat: 18.4532, type: "science", desc: "Prime mudstone drilling target rich in organic preservation potential." },
  { name: "Lac de Charmes Carbonate Bench", sol: 1285, lon: 77.3482, lat: 18.4591, type: "science", desc: "Crater rim margin carbonate unit indicative of ancient alkaline paleolake shoreline." },
  { name: "Belva Impact Crater", sol: 800, lon: 77.3750, lat: 18.4710, type: "landmark", desc: "1 km-wide impact crater excavating deep delta cross-bedding and boulder conglomerates." }
];

const GALE_LANDMARKS = [
  { name: "Bradbury Landing Site", sol: 0, lon: 137.4416, lat: -4.5894, type: "base", desc: "NASA Curiosity rover touchdown site (Aug 5, 2012). Flat gravelly alluvial plain." },
  { name: "Mount Sharp Boxwork Ridges", sol: 5000, lon: 137.3888, lat: -4.8260, type: "science", desc: "NASA 2025–2026 Target: Hardened mineral fracture networks standing high like spiderwebs." },
  { name: "Murray Buttes Layered Mesas", sol: 1450, lon: 137.4150, lat: -4.7100, type: "landmark", desc: "Spectacular layered sandstone mesas preserved from ancient windblown dunes." },
  { name: "Chocolatal Outcrop (Sol 5000)", sol: 5020, lon: 137.3950, lat: -4.7950, type: "science", desc: "Detailed boxwork mineral veins investigated during Curiosity's 5,000-sol milestone." }
];

interface MarsMapProps {
  activeSite: "jezero" | "gale";
  selectedMode: string;
  evaResponse: PlanEvaResponse | null;
  onSelectCoordinate: (coords: [number, number]) => void;
  onSelectScienceTarget: (target: ScienceTargetFeature) => void;
  onOpenRoverPov: (obs: RoverObservation) => void;
  onOpen3DModal: () => void;
  startPoint: [number, number];
  targetPoint: [number, number];
}

export default function MarsMap({
  activeSite,
  selectedMode,
  evaResponse,
  onSelectCoordinate,
  onSelectScienceTarget,
  onOpenRoverPov,
  onOpen3DModal,
  startPoint,
  targetPoint
}: MarsMapProps) {
  const mapElement = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);

  // Layer references
  const vikingLayerRef = useRef<TileLayer<TileWMS> | null>(null);
  const molaShadeLayerRef = useRef<TileLayer<TileWMS> | null>(null);
  const hazardLayerRef = useRef<ImageLayer<Static> | null>(null);
  const geologyLayerRef = useRef<VectorLayer<any> | null>(null);
  const crismLayerRef = useRef<VectorLayer<any> | null>(null);
  const roverTraverseLayerRef = useRef<VectorLayer<any> | null>(null);
  const landmarksLayerRef = useRef<VectorLayer<any> | null>(null);
  const routeVectorLayerRef = useRef<VectorLayer<any> | null>(null);
  const pinsVectorLayerRef = useRef<VectorLayer<any> | null>(null);

  // UI state
  const [layersOpen, setLayersOpen] = useState(false);
  const [swipeMode, setSwipeMode] = useState(false);
  const [swipePosition, setSwipePosition] = useState(50);
  const [cursorCoords, setCursorCoords] = useState<{ lon: number; lat: number } | null>(null);
  const [cursorTelemetry, setCursorTelemetry] = useState<PointTelemetry | null>(null);

  // Layer visibility & opacity state
  const [layerConfig, setLayerConfig] = useState({
    viking: { visible: true, opacity: 1.0 },
    mola: { visible: true, opacity: 0.65 },
    hazard: { visible: true, opacity: 0.8 },
    geology: { visible: true, opacity: 0.5 },
    crism: { visible: true, opacity: 1.0 },
    rover: { visible: true, opacity: 1.0 },
    landmarks: { visible: true, opacity: 1.0 }
  });

  const handleResetView = () => {
    if (!mapRef.current) return;
    const view = mapRef.current.getView();
    if (activeSite === "jezero") {
      view.animate({ center: [77.415, 18.448], zoom: 12.5, duration: 600 });
    } else {
      view.animate({ center: [137.40, -4.75], zoom: 11.5, duration: 600 });
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!mapElement.current || mapRef.current) return;

    // 1. Primary Base Layer: USGS Astrogeology Viking Global Color Mosaic (MDIM21_color)
    const vikingLayer = new TileLayer({
      source: new TileWMS({
        url: "https://planetarymaps.usgs.gov/cgi-bin/mapserv?map=/maps/mars/mars_simp_cyl.map",
        params: {
          LAYERS: "MDIM21_color",
          FORMAT: "image/jpeg",
          TILED: true
        },
        serverType: "mapserver",
        crossOrigin: "anonymous"
      }),
      opacity: layerConfig.viking.opacity,
      visible: layerConfig.viking.visible
    });
    vikingLayerRef.current = vikingLayer;

    // 2. Secondary Base Layer: USGS MOLA + MEX HRSC Blended Color Hillshade (HRSC_MOLA_Blend_Hillshade)
    const molaShadeLayer = new TileLayer({
      source: new TileWMS({
        url: "https://planetarymaps.usgs.gov/cgi-bin/mapserv?map=/maps/mars/mars_simp_cyl.map",
        params: {
          LAYERS: "HRSC_MOLA_Blend_Hillshade",
          FORMAT: "image/jpeg",
          TILED: true
        },
        serverType: "mapserver",
        crossOrigin: "anonymous"
      }),
      opacity: layerConfig.mola.opacity,
      visible: layerConfig.mola.visible
    });
    molaShadeLayerRef.current = molaShadeLayer;

    // 3. Local Jezero 1m Slope & Regolith Slip Hazard Map
    const hazardLayer = new ImageLayer({
      source: new Static({
        url: "/data/jezero_slope_hazard.png",
        imageExtent: [77.30, 18.40, 77.48, 18.50],
        projection: "EPSG:4326"
      }),
      opacity: layerConfig.hazard.opacity,
      visible: layerConfig.hazard.visible
    });
    hazardLayerRef.current = hazardLayer;

    // 4. USGS SIM 3464 Geologic Units
    const geologySource = new VectorSource({
      url: "/data/jezero_geology_sim3464.json",
      format: new GeoJSON()
    });
    const geologyLayer = new VectorLayer({
      source: geologySource,
      style: (feature) => {
        const color = feature.get("color") || "#38BDF8";
        return new Style({
          fill: new Fill({ color: `${color}35` }),
          stroke: new Stroke({ color: color, width: 1.5, lineDash: [4, 4] })
        });
      },
      opacity: layerConfig.geology.opacity,
      visible: layerConfig.geology.visible
    });
    geologyLayerRef.current = geologyLayer;

    // 5. CRISM Targeted Mineral Hotspots
    const crismSource = new VectorSource({
      url: "/data/jezero_crism_hotspots.json",
      format: new GeoJSON()
    });
    const crismLayer = new VectorLayer({
      source: crismSource,
      style: (feature) => {
        const name = feature.get("name") || "";
        return new Style({
          image: new CircleStyle({
            radius: 8,
            fill: new Fill({ color: "#38BDF8" }),
            stroke: new Stroke({ color: "#FFFFFF", width: 2 })
          }),
          text: new Text({
            text: name.split(" ")[0],
            offsetY: -16,
            fill: new Fill({ color: "#FFFFFF" }),
            stroke: new Stroke({ color: "#04070D", width: 3 }),
            font: "bold 11px ui-sans-serif, system-ui, sans-serif"
          })
        });
      },
      visible: layerConfig.crism.visible
    });
    crismLayerRef.current = crismLayer;

    // 6. Rover Historical Traverse
    const traverseSource = new VectorSource({
      url: "/data/m20_traverse.json",
      format: new GeoJSON()
    });
    const traverseLayer = new VectorLayer({
      source: traverseSource,
      style: new Style({
        stroke: new Stroke({ color: "#F36C3D", width: 2.5 })
      }),
      visible: layerConfig.rover.visible
    });
    roverTraverseLayerRef.current = traverseLayer;

    // 7. Authentic Martian Landmarks & Landing Sites
    const landmarksSource = new VectorSource();
    const landmarks = activeSite === "jezero" ? JEZERO_LANDMARKS : GALE_LANDMARKS;
    landmarks.forEach((lm) => {
      const feat = new Feature({
        geometry: new Point([lm.lon, lm.lat]),
        name: lm.name,
        sol: lm.sol,
        type: lm.type,
        desc: lm.desc
      });
      landmarksSource.addFeature(feat);
    });

    const landmarksLayer = new VectorLayer({
      source: landmarksSource,
      style: (feature) => {
        const type = feature.get("type");
        const name = feature.get("name") || "";
        let color = "#38BDF8";
        let radius = 6;
        if (type === "base") {
          color = "#34D399";
          radius = 8;
        } else if (type === "hazard") {
          color = "#FBBF24";
        } else if (type === "science") {
          color = "#F36C3D";
          radius = 7;
        }

        return new Style({
          image: new CircleStyle({
            radius: radius,
            fill: new Fill({ color: color }),
            stroke: new Stroke({ color: "#FFFFFF", width: 2 })
          }),
          text: new Text({
            text: name,
            offsetY: 15,
            fill: new Fill({ color: "#FFFFFF" }),
            stroke: new Stroke({ color: "#04070D", width: 3 }),
            font: "bold 10px ui-monospace, monospace"
          })
        });
      },
      visible: layerConfig.landmarks.visible
    });
    landmarksLayerRef.current = landmarksLayer;

    // 8. Active EVA Trajectory Polyline Layer (High-Contrast Aerospace Corridors)
    const routeVectorSource = new VectorSource();
    const routeLayer = new VectorLayer({
      source: routeVectorSource,
      style: (feature) => {
        const mode = feature.get("mode") || "safe";
        let color = "#10B981"; // Lower-Slope: Emerald Green
        let width = 5.0;
        let lineDash: number[] | undefined = undefined;

        if (mode === "balanced") {
          color = "#38BDF8"; // Balanced: Vivid Cyan
          width = 5.0;
          lineDash = [8, 5];
        } else if (mode === "science") {
          color = "#C084FC"; // Science Priority: Vivid Purple
          width = 5.0;
          lineDash = [3, 5];
        }

        // High-contrast dual stroke: dark halo underlayer + vibrant core path
        return [
          new Style({
            stroke: new Stroke({ color: "rgba(4, 7, 13, 0.8)", width: width + 4.5 })
          }),
          new Style({
            stroke: new Stroke({ color: color, width: width, lineDash: lineDash })
          })
        ];
      }
    });
    routeVectorLayerRef.current = routeLayer;

    // 9. Start & Target Interactive Pins Layer
    const pinsSource = new VectorSource();
    const pinsLayer = new VectorLayer({
      source: pinsSource,
      style: (feature) => {
        const type = feature.get("type");
        if (type === "start") {
          return new Style({
            image: new CircleStyle({
              radius: 9,
              fill: new Fill({ color: "#34D399" }),
              stroke: new Stroke({ color: "#FFFFFF", width: 2.5 })
            }),
            text: new Text({
              text: "BASE",
              offsetY: -16,
              fill: new Fill({ color: "#34D399" }),
              stroke: new Stroke({ color: "#04070D", width: 3 }),
              font: "bold 11px ui-monospace, monospace"
            })
          });
        }
        return new Style({
          image: new CircleStyle({
            radius: 9,
            fill: new Fill({ color: "#F36C3D" }),
            stroke: new Stroke({ color: "#FFFFFF", width: 2.5 })
          }),
          text: new Text({
            text: "TARGET",
            offsetY: -16,
            fill: new Fill({ color: "#F36C3D" }),
            stroke: new Stroke({ color: "#04070D", width: 3 }),
            font: "bold 11px ui-monospace, monospace"
          })
        });
      }
    });
    pinsVectorLayerRef.current = pinsLayer;

    // ScaleLine Control
    const scaleLineControl = new ScaleLine({
      units: "metric",
      bar: false,
      steps: 4,
      text: true,
      minWidth: 100
    });

    const map = new Map({
      target: mapElement.current,
      layers: [
        vikingLayer,
        molaShadeLayer,
        hazardLayer,
        geologyLayer,
        crismLayer,
        traverseLayer,
        landmarksLayer,
        routeLayer,
        pinsLayer
      ],
      view: new View({
        projection: "EPSG:4326",
        center: activeSite === "jezero" ? [77.415, 18.448] : [137.40, -4.75],
        zoom: activeSite === "jezero" ? 12.5 : 11.5,
        minZoom: 3,
        maxZoom: 17
      }),
      controls: [scaleLineControl]
    });

    // Pointer move listener
    map.on("pointermove", async (evt) => {
      if (evt.dragging) return;
      const coord = evt.coordinate;
      setCursorCoords({ lon: coord[0], lat: coord[1] });
    });

    // Click handler
    map.on("singleclick", async (evt) => {
      const coord = evt.coordinate as [number, number];
      
      const feature = map.forEachFeatureAtPixel(evt.pixel, (f) => f);
      if (feature) {
        const targetProps = feature.getProperties();
        if (targetProps.spectral_signature) {
          onSelectScienceTarget(feature as any);
          return;
        }
        if (targetProps.sol !== undefined) {
          const obs = await fetchRoverGroundTruth(coord[0], coord[1]);
          onOpenRoverPov(obs);
          return;
        }
      }

      onSelectCoordinate(coord);
      const tel = await fetchPointTelemetry(coord[0], coord[1]);
      setCursorTelemetry(tel);
    });

    // Split-Screen Swipe Rendering
    molaShadeLayer.on("prerender", (event) => {
      if (!swipeMode) return;
      const ctx = event.context as CanvasRenderingContext2D;
      const mapSize = map.getSize();
      if (!mapSize) return;
      const width = mapSize[0] * (swipePosition / 100);
      const tl = getRenderPixel(event, [0, 0]);
      const tr = getRenderPixel(event, [width, 0]);
      const bl = getRenderPixel(event, [0, mapSize[1]]);
      const br = getRenderPixel(event, [width, mapSize[1]]);

      ctx.save();
      ctx.beginPath();
      ctx.rect(tl[0], tl[1], tr[0] - tl[0], br[1] - tr[1]);
      ctx.clip();
    });

    molaShadeLayer.on("postrender", (event) => {
      if (!swipeMode) return;
      const ctx = event.context as CanvasRenderingContext2D;
      ctx.restore();
    });

    mapRef.current = map;

    return () => {
      map.setTarget(undefined);
      mapRef.current = null;
    };
  }, []);

  // Sync Start & Target Pins
  useEffect(() => {
    if (!pinsVectorLayerRef.current) return;
    const source = pinsVectorLayerRef.current.getSource();
    if (!source) return;

    source.clear();
    const startFeat = new Feature({
      geometry: new Point(startPoint),
      type: "start"
    });
    const targetFeat = new Feature({
      geometry: new Point(targetPoint),
      type: "target"
    });
    source.addFeatures([startFeat, targetFeat]);
  }, [startPoint, targetPoint]);

  // Sync EVA Route Visualization
  useEffect(() => {
    if (!routeVectorLayerRef.current || !evaResponse) return;
    const source = routeVectorLayerRef.current.getSource();
    if (!source) return;

    source.clear();
    const format = new GeoJSON();

    if (evaResponse.routes) {
      if (selectedMode === "all") {
        Object.values(evaResponse.routes).forEach((rt) => {
          if (rt?.geojson) {
            const feats = format.readFeatures(rt.geojson);
            source.addFeatures(feats);
          }
        });
      } else {
        const rt = evaResponse.routes[selectedMode];
        if (rt?.geojson) {
          const feats = format.readFeatures(rt.geojson);
          source.addFeatures(feats);
        }
      }
    }
  }, [evaResponse, selectedMode]);

  // Sync Site Presets (Jezero vs Gale)
  useEffect(() => {
    if (!mapRef.current) return;
    const view = mapRef.current.getView();
    if (activeSite === "jezero") {
      view.animate({ center: [77.415, 18.448], zoom: 12.5, duration: 800 });
      if (roverTraverseLayerRef.current) {
        roverTraverseLayerRef.current.setSource(
          new VectorSource({ url: "/data/m20_traverse.json", format: new GeoJSON() }) as any
        );
      }
      if (hazardLayerRef.current) {
        hazardLayerRef.current.setVisible(layerConfig.hazard.visible);
      }
    } else {
      view.animate({ center: [137.40, -4.75], zoom: 11.5, duration: 800 });
      if (roverTraverseLayerRef.current) {
        roverTraverseLayerRef.current.setSource(
          new VectorSource({ url: "/data/msl_waypoints.json", format: new GeoJSON() }) as any
        );
      }
      if (hazardLayerRef.current) {
        hazardLayerRef.current.setVisible(false);
      }
    }

    // Refresh landmark features for active site
    if (landmarksLayerRef.current) {
      const source = landmarksLayerRef.current.getSource();
      if (source) {
        source.clear();
        const landmarks = activeSite === "jezero" ? JEZERO_LANDMARKS : GALE_LANDMARKS;
        landmarks.forEach((lm) => {
          const feat = new Feature({
            geometry: new Point([lm.lon, lm.lat]),
            name: lm.name,
            sol: lm.sol,
            type: lm.type,
            desc: lm.desc
          });
          source.addFeature(feat);
        });
      }
    }
  }, [activeSite]);

  // Handle Swipe Slider re-render
  useEffect(() => {
    if (mapRef.current && swipeMode) {
      mapRef.current.render();
    }
  }, [swipePosition, swipeMode]);

  const toggleLayer = (layerKey: keyof typeof layerConfig) => {
    const updated = {
      ...layerConfig,
      [layerKey]: {
        ...layerConfig[layerKey],
        visible: !layerConfig[layerKey].visible
      }
    };
    setLayerConfig(updated);

    if (layerKey === "viking" && vikingLayerRef.current) vikingLayerRef.current.setVisible(updated.viking.visible);
    if (layerKey === "mola" && molaShadeLayerRef.current) molaShadeLayerRef.current.setVisible(updated.mola.visible);
    if (layerKey === "hazard" && hazardLayerRef.current) hazardLayerRef.current.setVisible(updated.hazard.visible);
    if (layerKey === "geology" && geologyLayerRef.current) geologyLayerRef.current.setVisible(updated.geology.visible);
    if (layerKey === "crism" && crismLayerRef.current) crismLayerRef.current.setVisible(updated.crism.visible);
    if (layerKey === "rover" && roverTraverseLayerRef.current) roverTraverseLayerRef.current.setVisible(updated.rover.visible);
    if (layerKey === "landmarks" && landmarksLayerRef.current) landmarksLayerRef.current.setVisible(updated.landmarks.visible);
  };

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-slate-300 bg-slate-950 shadow-md flex flex-col font-sans">
      {/* Top Glassmorphic Tactical Tool Bar */}
      <div className="absolute top-3 left-3 right-3 z-30 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left Tools */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {/* Layer Panel Button */}
          <button
            onClick={() => setLayersOpen(!layersOpen)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-sans font-bold backdrop-blur-md border transition-all ${
              layersOpen 
                ? "bg-[#0284C7] text-white border-[#0284C7] shadow-md shadow-sky-500/25" 
                : "bg-white/95 text-slate-800 border-slate-200 hover:bg-slate-50 shadow-sm"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Map Layers</span>
          </button>

          {/* Swipe Comparator Toggle */}
          <button
            onClick={() => setSwipeMode(!swipeMode)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-sans font-bold backdrop-blur-md border transition-all ${
              swipeMode 
                ? "bg-[#D97706] text-white border-[#D97706] shadow-md shadow-amber-500/25" 
                : "bg-white/95 text-slate-800 border-slate-200 hover:bg-slate-50 shadow-sm"
            }`}
            title="Split-Screen Comparison: Optical vs Topographic Hillshade"
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Swipe Lens</span>
          </button>

          {/* 3D WebGL Sector Mesh */}
          <button
            onClick={onOpen3DModal}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-sans font-bold bg-white/95 hover:bg-slate-50 text-slate-800 border border-slate-200 backdrop-blur-md transition-all shadow-sm"
            title="Launch 3D WebGL Surface Inspection"
          >
            <Mountain className="w-3.5 h-3.5 text-[#EA580C]" />
            <span className="hidden sm:inline">3D Mesh View</span>
          </button>
        </div>

        {/* Right Tools */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Site Badge */}
          <div className="px-3 py-1.5 rounded-xl bg-white/95 border border-slate-200 text-xs font-sans backdrop-blur-md flex items-center gap-2 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#15803D] animate-pulse" />
            <span className="text-slate-900 font-bold uppercase tracking-wide">
              {activeSite === "jezero" ? "Jezero Crater Delta" : "Mount Sharp Boxwork"}
            </span>
          </div>

          {/* Reset Camera View */}
          <button
            onClick={handleResetView}
            className="p-2 rounded-xl bg-white/95 hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200 backdrop-blur-md transition-all shadow-sm"
            title="Re-center map on active target"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Floating Layer Selection Drawer */}
      {layersOpen && (
        <div className="absolute top-14 left-3 z-30 w-72 bg-white/95 border border-slate-200 rounded-2xl p-3.5 shadow-2xl backdrop-blur-xl text-xs font-sans space-y-2.5 text-slate-800">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="font-bold text-slate-900 uppercase text-xs tracking-wider">
              Scientific Layer Stack
            </span>
            <span className="text-[11px] text-[#0284C7] font-semibold">USGS &amp; NASA OGC</span>
          </div>

          <div className="space-y-1.5">
            {/* 1. USGS Viking Color */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-colors">
              <span className="text-slate-700 font-medium flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EA580C]" />
                USGS Viking Color Mosaic
              </span>
              <button onClick={() => toggleLayer("viking")}>
                {layerConfig.viking.visible ? <Eye className="w-4 h-4 text-[#15803D]" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
              </button>
            </div>

            {/* 2. MOLA Hillshade */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-colors">
              <span className="text-slate-700 font-medium flex items-center gap-2 text-xs">
                <Mountain className="w-4 h-4 text-[#0284C7]" />
                MOLA / HRSC Shaded Relief
              </span>
              <button onClick={() => toggleLayer("mola")}>
                {layerConfig.mola.visible ? <Eye className="w-4 h-4 text-[#15803D]" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
              </button>
            </div>

            {/* 3. HiRISE Slope Hazard */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-colors">
              <span className="text-slate-700 font-medium flex items-center gap-2 text-xs">
                <AlertTriangle className="w-4 h-4 text-[#D97706]" />
                Modelled Slope Hazard (Surrogate)
              </span>
              <button onClick={() => toggleLayer("hazard")}>
                {layerConfig.hazard.visible ? <Eye className="w-4 h-4 text-[#15803D]" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
              </button>
            </div>

            {/* 4. USGS Geology */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-colors">
              <span className="text-slate-700 font-medium flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-[#9333EA]" />
                USGS SIM 3464 Units (Simplified)
              </span>
              <button onClick={() => toggleLayer("geology")}>
                {layerConfig.geology.visible ? <Eye className="w-4 h-4 text-[#15803D]" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
              </button>
            </div>

            {/* 5. CRISM Mineralogy */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-colors">
              <span className="text-slate-700 font-medium flex items-center gap-2 text-xs">
                <Sparkles className="w-4 h-4 text-[#0284C7]" />
                CRISM-Referenced Targets (Authored)
              </span>
              <button onClick={() => toggleLayer("crism")}>
                {layerConfig.crism.visible ? <Eye className="w-4 h-4 text-[#15803D]" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
              </button>
            </div>

            {/* 6. Rover Traverse */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-colors">
              <span className="text-slate-700 font-medium flex items-center gap-2 text-xs">
                <Compass className="w-4 h-4 text-[#EA580C]" />
                Perseverance Traverse (Real Telemetry)
              </span>
              <button onClick={() => toggleLayer("rover")}>
                {layerConfig.rover.visible ? <Eye className="w-4 h-4 text-[#15803D]" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
              </button>
            </div>

            {/* 7. Martian Landmarks */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-colors">
              <span className="text-slate-700 font-medium flex items-center gap-2 text-xs">
                <MapPin className="w-4 h-4 text-[#15803D]" />
                Landmarks &amp; Rover POV
              </span>
              <button onClick={() => toggleLayer("landmarks")}>
                {layerConfig.landmarks.visible ? <Eye className="w-4 h-4 text-[#15803D]" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Swipe Lens Divider Handle */}
      {swipeMode && (
        <div 
          className="absolute top-0 bottom-0 z-20 pointer-events-auto cursor-ew-resize flex items-center justify-center"
          style={{ left: `${swipePosition}%` }}
        >
          <div className="w-0.5 h-full bg-[#D97706] shadow-[0_0_10px_#D97706]" />
          <div className="absolute w-8 h-8 rounded-full bg-white border-2 border-[#D97706] flex items-center justify-center text-[#D97706] shadow-xl">
            <Columns className="w-4 h-4" />
          </div>
        </div>
      )}

      {/* Swipe Slider Control Bar (Visible when swipe active) */}
      {swipeMode && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-30 bg-white/95 border border-amber-300 px-4 py-2 rounded-xl shadow-lg backdrop-blur-md flex items-center gap-3 text-xs font-sans text-slate-800">
          <span className="text-[#EA580C] font-bold">Viking Color</span>
          <input
            type="range"
            min="5"
            max="95"
            value={swipePosition}
            onChange={(e) => setSwipePosition(Number(e.target.value))}
            className="w-40 accent-[#D97706] cursor-ew-resize"
          />
          <span className="text-[#0284C7] font-bold">MOLA Hillshade</span>
        </div>
      )}

      {/* Main OpenLayers Map Viewport */}
      <div ref={mapElement} className="w-full flex-1 min-h-[480px]" />

      {/* Bottom Mission Telemetry HUD */}
      <div className="bg-white/95 border-t border-slate-200 px-4 py-2.5 text-xs flex flex-wrap items-center justify-between gap-3 font-sans text-slate-600 shadow-sm">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-slate-900">
            <Crosshair className="w-3.5 h-3.5 text-[#0284C7]" />
            <span className="font-semibold text-slate-600">CURSOR:</span>
            <span className="text-[#0284C7] font-bold font-mono">
              {cursorCoords 
                ? `${cursorCoords.lon.toFixed(4)}°E, ${Math.abs(cursorCoords.lat).toFixed(4)}°${cursorCoords.lat < 0 ? "S" : "N"}` 
                : activeSite === "gale" ? "137.4416°E, 4.5894°S" : "77.4150°E, 18.4480°N"}
            </span>
          </span>

          <span className="hidden sm:inline text-slate-300">|</span>

          <span className="flex items-center gap-1.5 text-slate-900">
            <Mountain className="w-3.5 h-3.5 text-[#EA580C]" />
            <span className="font-semibold text-slate-600">MOLA DATUM:</span>
            <span className="text-slate-900 font-bold font-mono">
              {cursorTelemetry?.elevation_m !== undefined ? `${cursorTelemetry.elevation_m} m` : "-2545.0 m"}
            </span>
          </span>

          <span className="hidden md:inline text-slate-300">|</span>

          <span className="hidden md:flex items-center gap-1.5 text-slate-900">
            <AlertTriangle className="w-3.5 h-3.5 text-[#D97706]" />
            <span className="font-semibold text-slate-600">HORN SLOPE:</span>
            <span className="text-slate-900 font-bold font-mono">
              {cursorTelemetry?.slope_deg !== undefined ? `${cursorTelemetry.slope_deg}°` : "5.2°"}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-[#15803D] border border-emerald-200 text-xs font-bold uppercase tracking-wide">
            {cursorTelemetry?.safety_status || "TRAVERSABLE INDURATED BEDROCK"}
          </span>
        </div>
      </div>
    </div>
  );
}
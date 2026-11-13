"use client";

import React, { useEffect, useRef, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import ImageLayer from "ol/layer/Image";
import VectorLayer from "ol/layer/Vector";
import XYZ from "ol/source/XYZ";
import Static from "ol/source/ImageStatic";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from "ol/style";
import Projection from "ol/proj/Projection";
import { addProjection } from "ol/proj";
import { transform } from "ol/proj";
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
  Crosshair
} from "lucide-react";
import { PlanEvaResponse, PointTelemetry, RoverObservation, ScienceTargetFeature } from "@/types/mars";
import { fetchPointTelemetry, fetchRoverGroundTruth } from "@/services/api";

// Configure Mars IAU2000 Equirectangular Projection (EPSG:104905)
const MARS_PROJECTION = new Projection({
  code: "EPSG:104905",
  units: "degrees",
  extent: [-180, -90, 180, 90],
  worldExtent: [-180, -90, 180, 90],
  axisOrientation: "enu"
});
addProjection(MARS_PROJECTION);

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
  const molaLayerRef = useRef<TileLayer<XYZ> | null>(null);
  const ctxLayerRef = useRef<TileLayer<XYZ> | null>(null);
  const themisLayerRef = useRef<TileLayer<XYZ> | null>(null);
  const hazardLayerRef = useRef<ImageLayer<Static> | null>(null);
  const geologyLayerRef = useRef<VectorLayer<any> | null>(null);
  const crismLayerRef = useRef<VectorLayer<any> | null>(null);
  const roverTraverseLayerRef = useRef<VectorLayer<any> | null>(null);
  const roverWaypointsLayerRef = useRef<VectorLayer<any> | null>(null);
  const routeVectorLayerRef = useRef<VectorLayer<any> | null>(null);
  const pinsVectorLayerRef = useRef<VectorLayer<any> | null>(null);

  // UI state
  const [layersOpen, setLayersOpen] = useState(false);
  const [swipeMode, setSwipeMode] = useState(false);
  const [swipePosition, setSwipePosition] = useState(50); // percentage
  const [cursorCoords, setCursorCoords] = useState<{ lon: number; lat: number } | null>(null);
  const [cursorTelemetry, setCursorTelemetry] = useState<PointTelemetry | null>(null);

  // Layer visibility & opacity state
  const [layerConfig, setLayerConfig] = useState({
    mola: { visible: true, opacity: 0.75 },
    ctx: { visible: true, opacity: 1.0 },
    themis: { visible: false, opacity: 0.7 },
    hazard: { visible: true, opacity: 0.85 },
    geology: { visible: true, opacity: 0.55 },
    crism: { visible: true, opacity: 1.0 },
    rover: { visible: true, opacity: 1.0 }
  });

  // Reset to default active sector view
  const handleResetView = () => {
    if (!mapRef.current) return;
    const view = mapRef.current.getView();
    if (activeSite === "jezero") {
      view.animate({ center: [77.415, 18.448], zoom: 13, duration: 600 });
    } else {
      view.animate({ center: [137.40, -4.75], zoom: 12, duration: 600 });
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!mapElement.current || mapRef.current) return;

    // 1. MGS MOLA + MEX HRSC Blended Color Hillshade (NASA Mars Trek WMTS)
    const molaLayer = new TileLayer({
      source: new XYZ({
        url: "https://trek.nasa.gov/tiles/Mars/EQ/Mars_MOLA_blend200ppx_HRSC_ClrShade_clon0dd_200mpp_lzw/1.0.0/default/default028mm/{z}/{y}/{x}.jpg",
        projection: MARS_PROJECTION,
        maxZoom: 9,
        wrapX: true
      }),
      opacity: layerConfig.mola.opacity,
      visible: layerConfig.mola.visible
    });
    molaLayerRef.current = molaLayer;

    // 2. MRO CTX Controlled Jezero 6m Mosaic (NASA Mars Trek WMTS)
    const ctxLayer = new TileLayer({
      source: new XYZ({
        url: "https://trek.nasa.gov/tiles/Mars/EQ/JEZ_ctx_B_soc_008_orthoMosaic_6m_Eqc_latTs0_lon0/1.0.0/default/default028mm/{z}/{y}/{x}.jpg",
        projection: MARS_PROJECTION,
        minZoom: 6,
        maxZoom: 16,
        wrapX: false
      }),
      opacity: layerConfig.ctx.opacity,
      visible: layerConfig.ctx.visible
    });
    ctxLayerRef.current = ctxLayer;

    // 3. THEMIS Controlled Nighttime IR (100m)
    const themisLayer = new TileLayer({
      source: new XYZ({
        url: "https://trek.nasa.gov/tiles/Mars/EQ/THEMIS_NightIR_ControlledMosaics_100m_v2_oct2018/1.0.0/default/default028mm/{z}/{y}/{x}.jpg",
        projection: MARS_PROJECTION,
        maxZoom: 12,
        wrapX: false
      }),
      opacity: layerConfig.themis.opacity,
      visible: layerConfig.themis.visible
    });
    themisLayerRef.current = themisLayer;

    // 4. Jezero 1m Slope & Regolith Slip Hazard Map (Horn's Method + Thermal Inertia)
    const hazardLayer = new ImageLayer({
      source: new Static({
        url: "/data/jezero_slope_hazard.png",
        imageExtent: [77.35, 18.41, 77.46, 18.48],
        projection: MARS_PROJECTION
      }),
      opacity: layerConfig.hazard.opacity,
      visible: layerConfig.hazard.visible
    });
    hazardLayerRef.current = hazardLayer;

    // 5. USGS SIM 3464 Geologic Units
    const geologySource = new VectorSource({
      url: "/data/jezero_geology_sim3464.json",
      format: new GeoJSON()
    });
    const geologyLayer = new VectorLayer({
      source: geologySource,
      style: (feature) => {
        const color = feature.get("color") || "#38BDF8";
        return new Style({
          fill: new Fill({ color: `${color}40` }),
          stroke: new Stroke({ color: color, width: 1.5, lineDash: [4, 4] })
        });
      },
      opacity: layerConfig.geology.opacity,
      visible: layerConfig.geology.visible
    });
    geologyLayerRef.current = geologyLayer;

    // 6. CRISM Targeted Mineral Hotspots
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
            offsetY: -15,
            fill: new Fill({ color: "#F8FAFC" }),
            stroke: new Stroke({ color: "#04070D", width: 3 }),
            font: "bold 11px -apple-system, sans-serif"
          })
        });
      },
      visible: layerConfig.crism.visible
    });
    crismLayerRef.current = crismLayer;

    // 7. Rover Traverse
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

    // 8. Rover Waypoints (clickable)
    const waypointsSource = new VectorSource({
      url: "/data/m20_waypoints.json",
      format: new GeoJSON()
    });
    const waypointsLayer = new VectorLayer({
      source: waypointsSource,
      style: (feature) => {
        const sol = feature.get("sol");
        if (sol && sol % 250 === 0) {
          return new Style({
            image: new CircleStyle({
              radius: 5,
              fill: new Fill({ color: "#F36C3D" }),
              stroke: new Stroke({ color: "#FFFFFF", width: 1.5 })
            }),
            text: new Text({
              text: `Sol ${sol}`,
              offsetY: 13,
              fill: new Fill({ color: "#F36C3D" }),
              stroke: new Stroke({ color: "#04070D", width: 2.5 }),
              font: "bold 10px ui-monospace, monospace"
            })
          });
        }
        return new Style({
          image: new CircleStyle({
            radius: 2,
            fill: new Fill({ color: "#F36C3D99" })
          })
        });
      },
      visible: layerConfig.rover.visible
    });
    roverWaypointsLayerRef.current = waypointsLayer;

    // 9. Planned EVA Routes Layer
    const routeSource = new VectorSource();
    const routeLayer = new VectorLayer({
      source: routeSource,
      style: (feature) => {
        const mode = feature.get("mode");
        let color = "#34D399"; // Safest (Emerald)
        let width = 4;
        let lineDash = undefined;

        if (mode === "balanced") {
          color = "#38BDF8"; // Balanced (Cyan)
          width = 3.5;
        } else if (mode === "science") {
          color = "#E879F9"; // Science (Magenta)
          width = 3.5;
        } else if (mode === "direct_unsafe") {
          color = "#F87171"; // Unsafe (Crimson)
          lineDash = [6, 6];
        }

        return new Style({
          stroke: new Stroke({ color, width, lineDash })
        });
      }
    });
    routeVectorLayerRef.current = routeLayer;

    // 10. Start and Target Pins Layer
    const pinsSource = new VectorSource();
    const pinsLayer = new VectorLayer({
      source: pinsSource,
      style: (feature) => {
        const type = feature.get("type");
        const isStart = type === "start";
        return new Style({
          image: new CircleStyle({
            radius: 9,
            fill: new Fill({ color: isStart ? "#34D399" : "#F36C3D" }),
            stroke: new Stroke({ color: "#FFFFFF", width: 2.5 })
          }),
          text: new Text({
            text: isStart ? "BASE" : "TARGET",
            offsetY: -16,
            fill: new Fill({ color: "#FFFFFF" }),
            stroke: new Stroke({ color: "#04070D", width: 3 }),
            font: "bold 11px -apple-system, sans-serif"
          })
        });
      }
    });
    pinsVectorLayerRef.current = pinsLayer;

    // Create OpenLayers Map with ScaleLine control
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
        molaLayer,
        ctxLayer,
        themisLayer,
        hazardLayer,
        geologyLayer,
        crismLayer,
        traverseLayer,
        waypointsLayer,
        routeLayer,
        pinsLayer
      ],
      view: new View({
        projection: MARS_PROJECTION,
        center: [77.415, 18.448],
        zoom: 13,
        minZoom: 4,
        maxZoom: 17
      }),
      controls: [scaleLineControl]
    });

    // Pointer move listener for coordinate & elevation telemetry
    map.on("pointermove", async (evt) => {
      if (evt.dragging) return;
      const coord = evt.coordinate;
      setCursorCoords({ lon: coord[0], lat: coord[1] });
    });

    // Click handler for map features and pin placement
    map.on("singleclick", async (evt) => {
      const coord = evt.coordinate as [number, number];
      
      const feature = map.forEachFeatureAtPixel(evt.pixel, (f) => f);
      if (feature) {
        const targetProps = feature.getProperties();
        if (targetProps.spectral_signature) {
          onSelectScienceTarget(feature as any);
          return;
        }
        if (targetProps.sol) {
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
    ctxLayer.on("prerender", (event) => {
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

    ctxLayer.on("postrender", (event) => {
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
            feats.forEach((feat) => {
              feat.set("mode", rt.mode);
              source.addFeature(feat);
            });
          }
        });
      } else {
        const activeRoute = evaResponse.routes[selectedMode];
        if (activeRoute?.geojson) {
          const feats = format.readFeatures(activeRoute.geojson);
          feats.forEach((feat) => {
            feat.set("mode", activeRoute.mode);
            source.addFeature(feat);
          });
        }
      }
    }
  }, [evaResponse, selectedMode]);

  // Sync Site Presets (Jezero vs Gale)
  useEffect(() => {
    if (!mapRef.current) return;
    const view = mapRef.current.getView();
    if (activeSite === "jezero") {
      view.animate({ center: [77.415, 18.448], zoom: 13, duration: 800 });
      if (ctxLayerRef.current) {
        ctxLayerRef.current.setSource(
          new XYZ({
            url: "https://trek.nasa.gov/tiles/Mars/EQ/JEZ_ctx_B_soc_008_orthoMosaic_6m_Eqc_latTs0_lon0/1.0.0/default/default028mm/{z}/{y}/{x}.jpg",
            projection: MARS_PROJECTION,
            minZoom: 6,
            maxZoom: 16
          })
        );
      }
      if (roverTraverseLayerRef.current) {
        roverTraverseLayerRef.current.setSource(
          new VectorSource({ url: "/data/m20_traverse.json", format: new GeoJSON() }) as any
        );
      }
    } else {
      view.animate({ center: [137.40, -4.75], zoom: 12, duration: 800 });
      if (ctxLayerRef.current) {
        ctxLayerRef.current.setSource(
          new XYZ({
            url: "https://trek.nasa.gov/tiles/Mars/EQ/Gale_CTX_BlockAdj_dd/1.0.0/default/default028mm/{z}/{y}/{x}.jpg",
            projection: MARS_PROJECTION,
            minZoom: 6,
            maxZoom: 15
          })
        );
      }
      if (roverTraverseLayerRef.current) {
        roverTraverseLayerRef.current.setSource(
          new VectorSource({ url: "/data/msl_waypoints.json", format: new GeoJSON() }) as any
        );
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
      [layerKey]: { ...layerConfig[layerKey], visible: !layerConfig[layerKey].visible }
    };
    setLayerConfig(updated);

    if (layerKey === "mola" && molaLayerRef.current) molaLayerRef.current.setVisible(updated.mola.visible);
    if (layerKey === "ctx" && ctxLayerRef.current) ctxLayerRef.current.setVisible(updated.ctx.visible);
    if (layerKey === "themis" && themisLayerRef.current) themisLayerRef.current.setVisible(updated.themis.visible);
    if (layerKey === "hazard" && hazardLayerRef.current) hazardLayerRef.current.setVisible(updated.hazard.visible);
    if (layerKey === "geology" && geologyLayerRef.current) geologyLayerRef.current.setVisible(updated.geology.visible);
    if (layerKey === "crism" && crismLayerRef.current) crismLayerRef.current.setVisible(updated.crism.visible);
    if (layerKey === "rover" && roverTraverseLayerRef.current && roverWaypointsLayerRef.current) {
      roverTraverseLayerRef.current.setVisible(updated.rover.visible);
      roverWaypointsLayerRef.current.setVisible(updated.rover.visible);
    }
  };

  const changeOpacity = (layerKey: keyof typeof layerConfig, val: number) => {
    const updated = {
      ...layerConfig,
      [layerKey]: { ...layerConfig[layerKey], opacity: val }
    };
    setLayerConfig(updated);

    if (layerKey === "mola" && molaLayerRef.current) molaLayerRef.current.setOpacity(val);
    if (layerKey === "ctx" && ctxLayerRef.current) ctxLayerRef.current.setOpacity(val);
    if (layerKey === "themis" && themisLayerRef.current) themisLayerRef.current.setOpacity(val);
    if (layerKey === "hazard" && hazardLayerRef.current) hazardLayerRef.current.setOpacity(val);
    if (layerKey === "geology" && geologyLayerRef.current) geologyLayerRef.current.setOpacity(val);
  };

  return (
    <div className="relative w-full h-full min-h-[520px] flex-1 overflow-hidden bg-[#04070D] rounded-2xl border border-white/[0.08] shadow-2xl">
      {/* OpenLayers Map Canvas */}
      <div ref={mapElement} className="w-full h-full absolute inset-0 cursor-crosshair" />

      {/* Split-Screen Swipe Divider */}
      {swipeMode && (
        <div 
          className="absolute top-0 bottom-0 z-20 pointer-events-none flex flex-col items-center"
          style={{ left: `${swipePosition}%` }}
        >
          <div className="w-[1.5px] h-full bg-[#38BDF8] shadow-[0_0_10px_#38BDF8]" />
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 bg-[#0C1220] border border-[#38BDF8] text-[#38BDF8] rounded-full p-1.5 shadow-xl pointer-events-auto cursor-ew-resize">
            <Columns className="w-4 h-4" />
          </div>
        </div>
      )}

      {/* Floating Tactical Tool Bar (Top Left) */}
      <div className="absolute top-3 left-3 z-20 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setLayersOpen(!layersOpen)}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg shadow-lg border transition-all backdrop-blur-md ${
            layersOpen 
              ? "bg-[#F36C3D] text-white border-[#F36C3D]" 
              : "hud-panel text-white hover:border-[#38BDF8] hover:text-[#38BDF8]"
          }`}
          title="Toggle NASA Layer Manager"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Data Layers</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-white font-bold">
            7
          </span>
        </button>

        <button
          onClick={() => setSwipeMode(!swipeMode)}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg shadow-lg border transition-all backdrop-blur-md ${
            swipeMode 
              ? "bg-[#38BDF8] text-[#04070D] border-[#38BDF8] font-bold" 
              : "hud-panel text-white hover:border-[#38BDF8] hover:text-[#38BDF8]"
          }`}
          title="Split-Screen Comparison Tool"
        >
          <Columns className="w-3.5 h-3.5" />
          <span>{swipeMode ? "Exit Swipe" : "Split-Screen Swipe"}</span>
        </button>

        <button
          onClick={onOpen3DModal}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg shadow-lg border hud-panel text-white hover:border-[#F36C3D] hover:text-[#F36C3D] transition-all backdrop-blur-md"
          title="Inspect 3D WebGL Mesh"
        >
          <Mountain className="w-3.5 h-3.5 text-[#F36C3D]" />
          <span>Inspect 3D Mesh</span>
        </button>

        <button
          onClick={handleResetView}
          className="p-1.5 text-xs rounded-lg shadow-lg border hud-panel text-[#94A3B8] hover:text-white transition-all backdrop-blur-md"
          title="Reset to Active Sector Extent"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Split-Screen Slider Range Control (Top Center) */}
      {swipeMode && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 hud-panel px-4 py-1.5 rounded-xl flex items-center gap-3">
          <span className="text-[10px] font-mono uppercase font-bold text-[#94A3B8]">MRO CTX (6m)</span>
          <input
            type="range"
            min="5"
            max="95"
            value={swipePosition}
            onChange={(e) => setSwipePosition(Number(e.target.value))}
            className="w-36 accent-[#38BDF8] cursor-pointer"
          />
          <span className="text-[10px] font-mono uppercase font-bold text-[#38BDF8]">Thermal / Hazard</span>
        </div>
      )}

      {/* Layer Control Panel Drawer (Left Floating) */}
      {layersOpen && (
        <div className="absolute top-14 left-3 z-30 w-72 max-h-[calc(100%-70px)] overflow-y-auto hud-panel p-4 rounded-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
            <h4 className="text-xs font-bold tracking-wider uppercase text-[#38BDF8] flex items-center gap-1.5 font-mono">
              <Sliders className="w-3.5 h-3.5" />
              Layer Stack Manager
            </h4>
            <span className="text-[10px] text-[#94A3B8] font-mono">EPSG:104905</span>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* Layer 1: CTX 6m */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-white flex items-center gap-1.5 text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
                  MRO CTX Jezero (6m)
                </span>
                <button onClick={() => toggleLayer("ctx")} className="text-[#94A3B8] hover:text-white">
                  {layerConfig.ctx.visible ? <Eye className="w-3.5 h-3.5 text-[#38BDF8]" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={layerConfig.ctx.opacity}
                onChange={(e) => changeOpacity("ctx", parseFloat(e.target.value))}
                className="w-full accent-[#38BDF8] h-1"
              />
            </div>

            {/* Layer 2: 1m Horn's Slope Hazard */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-white flex items-center gap-1.5 text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-[#F87171]" />
                  1m Slope Hazard (Horn&apos;s)
                </span>
                <button onClick={() => toggleLayer("hazard")} className="text-[#94A3B8] hover:text-white">
                  {layerConfig.hazard.visible ? <Eye className="w-3.5 h-3.5 text-[#34D399]" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={layerConfig.hazard.opacity}
                onChange={(e) => changeOpacity("hazard", parseFloat(e.target.value))}
                className="w-full accent-[#34D399] h-1"
              />
            </div>

            {/* Layer 3: THEMIS Night IR */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-white flex items-center gap-1.5 text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-[#FBBF24]" />
                  THEMIS Night IR (100m)
                </span>
                <button onClick={() => toggleLayer("themis")} className="text-[#94A3B8] hover:text-white">
                  {layerConfig.themis.visible ? <Eye className="w-3.5 h-3.5 text-[#FBBF24]" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={layerConfig.themis.opacity}
                onChange={(e) => changeOpacity("themis", parseFloat(e.target.value))}
                className="w-full accent-[#FBBF24] h-1"
              />
            </div>

            {/* Layer 4: USGS SIM 3464 Geology */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-white flex items-center gap-1.5 text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-[#A78BFA]" />
                  USGS SIM 3464 Geology
                </span>
                <button onClick={() => toggleLayer("geology")} className="text-[#94A3B8] hover:text-white">
                  {layerConfig.geology.visible ? <Eye className="w-3.5 h-3.5 text-[#A78BFA]" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={layerConfig.geology.opacity}
                onChange={(e) => changeOpacity("geology", parseFloat(e.target.value))}
                className="w-full accent-[#A78BFA] h-1"
              />
            </div>

            {/* Layer 5: CRISM Targets */}
            <div className="flex items-center justify-between py-1">
              <span className="font-medium text-white flex items-center gap-1.5 text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
                CRISM Mineral Hotspots
              </span>
              <button onClick={() => toggleLayer("crism")} className="text-[#94A3B8] hover:text-white">
                {layerConfig.crism.visible ? <Eye className="w-3.5 h-3.5 text-[#38BDF8]" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Layer 6: Rover Feeds */}
            <div className="flex items-center justify-between py-1">
              <span className="font-medium text-white flex items-center gap-1.5 text-[11px]">
                <span className="w-2 h-2 rounded-full bg-[#F36C3D]" />
                Perseverance Traverse &amp; Sols
              </span>
              <button onClick={() => toggleLayer("rover")} className="text-[#94A3B8] hover:text-white">
                {layerConfig.rover.visible ? <Eye className="w-3.5 h-3.5 text-[#F36C3D]" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Layer 7: Global MOLA */}
            <div className="space-y-1 pt-2 border-t border-white/[0.06]">
              <div className="flex items-center justify-between">
                <span className="font-medium text-white text-[11px]">MOLA Global Hillshade</span>
                <button onClick={() => toggleLayer("mola")} className="text-[#94A3B8] hover:text-white">
                  {layerConfig.mola.visible ? <Eye className="w-3.5 h-3.5 text-white" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Real-Time Precision Telemetry HUD (Bottom Right) */}
      <div className="absolute bottom-3 right-3 z-20 flex flex-wrap items-center gap-3 hud-panel px-4 py-2 rounded-xl text-xs">
        <div className="flex items-center gap-1.5 text-[#94A3B8]">
          <Compass className="w-3.5 h-3.5 text-[#38BDF8]" />
          <span className="font-mono text-[11px]">LON:</span>
          <span className="font-mono text-white font-bold num-tabular">
            {cursorCoords ? cursorCoords.lon.toFixed(4) : "77.4150"}°E
          </span>
          <span className="font-mono text-[11px] ml-1">LAT:</span>
          <span className="font-mono text-white font-bold num-tabular">
            {cursorCoords ? cursorCoords.lat.toFixed(4) : "18.4480"}°N
          </span>
        </div>

        <div className="h-4 w-px bg-white/[0.12]" />

        <div className="flex items-center gap-1.5 text-[#94A3B8]">
          <Mountain className="w-3.5 h-3.5 text-[#F36C3D]" />
          <span className="font-mono text-[11px]">ELEV:</span>
          <span className="font-mono text-white font-bold num-tabular">
            {cursorTelemetry?.elevation_m ?? -2565.8} m
          </span>
        </div>

        <div className="h-4 w-px bg-white/[0.12]" />

        <div className="flex items-center gap-1.5 text-[#94A3B8]">
          <AlertTriangle className="w-3.5 h-3.5 text-[#FBBF24]" />
          <span className="font-mono text-[11px]">SLOPE:</span>
          <span className="font-mono text-white font-bold num-tabular">
            {cursorTelemetry?.slope_deg ?? 4.8}°
          </span>
        </div>

        <div className="h-4 w-px bg-white/[0.12]" />

        <div className="flex items-center gap-1.5 text-[#94A3B8]">
          <Flame className="w-3.5 h-3.5 text-[#38BDF8]" />
          <span className="font-mono text-[11px]">TI:</span>
          <span className="font-mono text-white font-bold num-tabular">
            {cursorTelemetry?.thermal_inertia ?? 285.0}
          </span>
        </div>

        <div className="h-4 w-px bg-white/[0.12]" />

        <div className="flex items-center gap-1">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider bg-[#34D399]/15 text-[#34D399] border border-[#34D399]/30">
            NOMINAL
          </span>
        </div>
      </div>
    </div>
  );
}

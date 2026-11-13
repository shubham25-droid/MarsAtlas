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
import { Coordinate } from "ol/coordinate";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { getRenderPixel } from "ol/render";
import { 
  Layers, 
  Eye, 
  EyeOff, 
  Sliders, 
  Maximize2, 
  Compass, 
  MapPin, 
  AlertTriangle,
  Flame,
  Mountain,
  Sparkles,
  Columns
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
    mola: { visible: true, opacity: 0.8 },
    ctx: { visible: true, opacity: 1.0 },
    themis: { visible: false, opacity: 0.7 },
    hazard: { visible: true, opacity: 0.85 },
    geology: { visible: true, opacity: 0.6 },
    crism: { visible: true, opacity: 1.0 },
    rover: { visible: true, opacity: 1.0 }
  });

  // Initialize Map
  useEffect(() => {
    if (!mapElement.current || mapRef.current) return;

    // 1. MGS MOLA + HRSC Color Hillshade (NASA Mars Trek WMTS)
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

    // 4. Jezero 1m Slope & Regolith Slip Hazard Map (Derived Horn's Method + TI)
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
        const color = feature.get("color") || "#5CC8D7";
        return new Style({
          fill: new Fill({ color: `${color}44` }),
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
            fill: new Fill({ color: "#5CC8D7" }),
            stroke: new Stroke({ color: "#FFFFFF", width: 2 })
          }),
          text: new Text({
            text: name.split(" ")[0],
            offsetY: -14,
            fill: new Fill({ color: "#FFFFFF" }),
            stroke: new Stroke({ color: "#070A10", width: 3 }),
            font: "bold 11px sans-serif"
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
        stroke: new Stroke({ color: "#E46A43", width: 2.5 })
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
        // Display marker only every 100 sols or key milestones to keep map clean
        if (sol && sol % 250 === 0) {
          return new Style({
            image: new CircleStyle({
              radius: 5,
              fill: new Fill({ color: "#E46A43" }),
              stroke: new Stroke({ color: "#FFFFFF", width: 1.5 })
            }),
            text: new Text({
              text: `Sol ${sol}`,
              offsetY: 12,
              fill: new Fill({ color: "#E46A43" }),
              stroke: new Stroke({ color: "#070A10", width: 2 }),
              font: "bold 10px sans-serif"
            })
          });
        }
        return new Style({
          image: new CircleStyle({
            radius: 2,
            fill: new Fill({ color: "#E46A4388" })
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
        let color = "#62C99B"; // Safest (Green)
        let width = 4;
        let lineDash = undefined;

        if (mode === "balanced") {
          color = "#3B82F6"; // Balanced (Blue)
          width = 3.5;
        } else if (mode === "science") {
          color = "#E056FD"; // Science (Magenta/Cyan)
          width = 3.5;
        } else if (mode === "direct_unsafe") {
          color = "#EF4444"; // Unsafe (Red)
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
            fill: new Fill({ color: isStart ? "#62C99B" : "#E46A43" }),
            stroke: new Stroke({ color: "#FFFFFF", width: 2.5 })
          }),
          text: new Text({
            text: isStart ? "BASE" : "TARGET",
            offsetY: -16,
            fill: new Fill({ color: "#FFFFFF" }),
            stroke: new Stroke({ color: "#070A10", width: 3 }),
            font: "bold 11px sans-serif"
          })
        });
      }
    });
    pinsVectorLayerRef.current = pinsLayer;

    // Create OpenLayers Map
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
      controls: []
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
      
      // Check feature hit
      const feature = map.forEachFeatureAtPixel(evt.pixel, (f) => f);
      if (feature) {
        const targetProps = feature.getProperties();
        if (targetProps.spectral_signature) {
          // CRISM target clicked
          onSelectScienceTarget(feature as any);
          return;
        }
        if (targetProps.sol) {
          // Rover waypoint clicked: fetch ground-truth image!
          const obs = await fetchRoverGroundTruth(coord[0], coord[1]);
          onOpenRoverPov(obs);
          return;
        }
      }

      // Default: invoke coordinate selection
      onSelectCoordinate(coord);
      const tel = await fetchPointTelemetry(coord[0], coord[1]);
      setCursorTelemetry(tel);
    });

    // Setup Split-Screen Swipe Rendering on CTX layer vs THEMIS/Hazard
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
        // Add all routes
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
      // Gale Crater Mount Sharp Boxwork
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

  // Toggle Layer Helper
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

  // Change Opacity Helper
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
    <div className="relative w-full h-full min-h-[500px] flex-1 overflow-hidden bg-[#070A10] rounded-xl border border-[#1E293B]">
      {/* OpenLayers Map Canvas */}
      <div ref={mapElement} className="w-full h-full absolute inset-0 cursor-crosshair" />

      {/* Split-Screen Swipe Divider */}
      {swipeMode && (
        <div 
          className="absolute top-0 bottom-0 z-20 pointer-events-none flex flex-col items-center"
          style={{ left: `${swipePosition}%` }}
        >
          <div className="w-0.5 h-full bg-[#5CC8D7] shadow-[0_0_8px_#5CC8D7]" />
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 bg-[#131B26] border border-[#5CC8D7] text-[#5CC8D7] rounded-full p-1 shadow-lg pointer-events-auto cursor-ew-resize">
            <Columns className="w-4 h-4" />
          </div>
        </div>
      )}

      {/* Map Control Buttons (Top Left) */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        <button
          onClick={() => setLayersOpen(!layersOpen)}
          className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg shadow-lg border transition-all ${
            layersOpen 
              ? "bg-[#E46A43] text-white border-[#E46A43]" 
              : "bg-[#131B26]/90 text-[#F3F5F7] border-[#1E293B] hover:border-[#5CC8D7] hover:text-[#5CC8D7]"
          }`}
          title="Toggle Layer Manager"
        >
          <Layers className="w-4 h-4" />
          <span>NASA Data Layers</span>
        </button>

        <button
          onClick={() => setSwipeMode(!swipeMode)}
          className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg shadow-lg border transition-all ${
            swipeMode 
              ? "bg-[#5CC8D7] text-[#070A10] border-[#5CC8D7]" 
              : "bg-[#131B26]/90 text-[#F3F5F7] border-[#1E293B] hover:border-[#5CC8D7] hover:text-[#5CC8D7]"
          }`}
          title="Split-Screen Comparison Tool"
        >
          <Columns className="w-4 h-4" />
          <span>{swipeMode ? "Exit Swipe View" : "Split-Screen Swipe"}</span>
        </button>

        <button
          onClick={onOpen3DModal}
          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg shadow-lg border bg-[#131B26]/90 text-[#F3F5F7] border-[#1E293B] hover:border-[#E46A43] hover:text-[#E46A43] transition-all"
          title="Launch 3D Local Terrain Sector"
        >
          <Mountain className="w-4 h-4 text-[#E46A43]" />
          <span>Inspect 3D Mesh</span>
        </button>
      </div>

      {/* Split-Screen Slider Range Control (Top Center) */}
      {swipeMode && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-[#131B26]/90 border border-[#5CC8D7]/40 px-4 py-2 rounded-lg backdrop-blur flex items-center gap-3">
          <span className="text-[10px] uppercase font-bold text-[#A0ACB9]">Optical (CTX 6m)</span>
          <input
            type="range"
            min="5"
            max="95"
            value={swipePosition}
            onChange={(e) => setSwipePosition(Number(e.target.value))}
            className="w-40 accent-[#5CC8D7] cursor-pointer"
          />
          <span className="text-[10px] uppercase font-bold text-[#5CC8D7]">Thermal / Hazard</span>
        </div>
      )}

      {/* Layer Control Panel Drawer (Left Floating) */}
      {layersOpen && (
        <div className="absolute top-16 left-4 z-30 w-72 max-h-[calc(100%-80px)] overflow-y-auto bg-[#0D121B]/95 border border-[#1E293B] p-4 rounded-xl shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
            <h4 className="text-xs font-bold tracking-wider uppercase text-[#5CC8D7] flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" />
              Layer Stack Manager
            </h4>
            <span className="text-[10px] text-[#A0ACB9] font-mono">EPSG:104905</span>
          </div>

          <div className="space-y-4 pt-3 text-xs">
            {/* Layer 1: CTX 6m */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-medium text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#5CC8D7]" />
                  MRO CTX Jezero (6m)
                </span>
                <button onClick={() => toggleLayer("ctx")} className="text-[#A0ACB9] hover:text-white">
                  {layerConfig.ctx.visible ? <Eye className="w-4 h-4 text-[#5CC8D7]" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={layerConfig.ctx.opacity}
                onChange={(e) => changeOpacity("ctx", parseFloat(e.target.value))}
                className="w-full accent-[#5CC8D7] h-1"
              />
            </div>

            {/* Layer 2: 1m Horn's Slope Hazard */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-medium text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
                  1m Slope Hazard (Horn&apos;s)
                </span>
                <button onClick={() => toggleLayer("hazard")} className="text-[#A0ACB9] hover:text-white">
                  {layerConfig.hazard.visible ? <Eye className="w-4 h-4 text-[#62C99B]" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={layerConfig.hazard.opacity}
                onChange={(e) => changeOpacity("hazard", parseFloat(e.target.value))}
                className="w-full accent-[#62C99B] h-1"
              />
            </div>

            {/* Layer 3: THEMIS Night IR */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-medium text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#E8B65A]" />
                  THEMIS Night IR (100m)
                </span>
                <button onClick={() => toggleLayer("themis")} className="text-[#A0ACB9] hover:text-white">
                  {layerConfig.themis.visible ? <Eye className="w-4 h-4 text-[#E8B65A]" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={layerConfig.themis.opacity}
                onChange={(e) => changeOpacity("themis", parseFloat(e.target.value))}
                className="w-full accent-[#E8B65A] h-1"
              />
            </div>

            {/* Layer 4: USGS SIM 3464 Geology */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-medium text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
                  USGS SIM 3464 Geology
                </span>
                <button onClick={() => toggleLayer("geology")} className="text-[#A0ACB9] hover:text-white">
                  {layerConfig.geology.visible ? <Eye className="w-4 h-4 text-[#8B5CF6]" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={layerConfig.geology.opacity}
                onChange={(e) => changeOpacity("geology", parseFloat(e.target.value))}
                className="w-full accent-[#8B5CF6] h-1"
              />
            </div>

            {/* Layer 5: CRISM Targets */}
            <div className="flex items-center justify-between py-1">
              <span className="font-medium text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#5CC8D7]" />
                CRISM Mineral Hotspots
              </span>
              <button onClick={() => toggleLayer("crism")} className="text-[#A0ACB9] hover:text-white">
                {layerConfig.crism.visible ? <Eye className="w-4 h-4 text-[#5CC8D7]" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>

            {/* Layer 6: Rover Feeds */}
            <div className="flex items-center justify-between py-1">
              <span className="font-medium text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#E46A43]" />
                Perseverance Traverse
              </span>
              <button onClick={() => toggleLayer("rover")} className="text-[#A0ACB9] hover:text-white">
                {layerConfig.rover.visible ? <Eye className="w-4 h-4 text-[#E46A43]" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>

            {/* Layer 7: Global MOLA */}
            <div className="space-y-1.5 pt-2 border-t border-[#1E293B]">
              <div className="flex items-center justify-between">
                <span className="font-medium text-white">MOLA Global Hillshade</span>
                <button onClick={() => toggleLayer("mola")} className="text-[#A0ACB9] hover:text-white">
                  {layerConfig.mola.visible ? <Eye className="w-4 h-4 text-white" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Telemetry Status Bar (Bottom Center/Right) */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-wrap items-center gap-3 bg-[#0D121B]/95 border border-[#1E293B] px-4 py-2 rounded-xl text-xs backdrop-blur-md shadow-xl">
        <div className="flex items-center gap-1.5 text-[#A0ACB9]">
          <Compass className="w-3.5 h-3.5 text-[#5CC8D7]" />
          <span>Lon:</span>
          <span className="font-mono text-white">
            {cursorCoords ? cursorCoords.lon.toFixed(4) : "77.4150"}°E
          </span>
          <span>Lat:</span>
          <span className="font-mono text-white">
            {cursorCoords ? cursorCoords.lat.toFixed(4) : "18.4480"}°N
          </span>
        </div>

        <div className="h-4 w-px bg-[#1E293B]" />

        <div className="flex items-center gap-1.5 text-[#A0ACB9]">
          <Mountain className="w-3.5 h-3.5 text-[#E46A43]" />
          <span>Elev:</span>
          <span className="font-mono text-white">
            {cursorTelemetry?.elevation_m ?? -2565.8} m
          </span>
        </div>

        <div className="h-4 w-px bg-[#1E293B]" />

        <div className="flex items-center gap-1.5 text-[#A0ACB9]">
          <AlertTriangle className="w-3.5 h-3.5 text-[#E8B65A]" />
          <span>Slope:</span>
          <span className="font-mono text-white">
            {cursorTelemetry?.slope_deg ?? 4.8}°
          </span>
        </div>

        <div className="h-4 w-px bg-[#1E293B]" />

        <div className="flex items-center gap-1.5 text-[#A0ACB9]">
          <Flame className="w-3.5 h-3.5 text-[#5CC8D7]" />
          <span>TI:</span>
          <span className="font-mono text-white">
            {cursorTelemetry?.thermal_inertia ?? 285.0}
          </span>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { 
  X, 
  Sun, 
  Mountain, 
  RotateCw, 
  Eye, 
  Layers, 
  Navigation, 
  Compass, 
  Maximize2, 
  Sparkles,
  ShieldAlert,
  Info,
  AlertTriangle,
  ExternalLink,
  HelpCircle,
  Flag,
  CheckCircle2
} from "lucide-react";

interface ThreeTerrainModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Safe WebGL feature detection helper
function checkWebGLSupport(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

export default function ThreeTerrainModal({ isOpen, onClose }: ThreeTerrainModalProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [shadingMode, setShadingMode] = useState<"hazard" | "realistic" | "wireframe">("hazard");
  const [showRoutes, setShowRoutes] = useState(true);
  const [sunAzimuth, setSunAzimuth] = useState(65);
  const [autoRotate, setAutoRotate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activePreset, setActivePreset] = useState<string>("hero");
  const [webglError, setWebglError] = useState<string | null>(null);
  const [showInfoGuide, setShowInfoGuide] = useState(true);

  // Three.js References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const terrainMeshRef = useRef<THREE.Mesh | null>(null);
  const routesGroupRef = useRef<THREE.Group | null>(null);
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);
  const materialsMapRef = useRef<{
    hazard?: THREE.MeshStandardMaterial;
    realistic?: THREE.MeshStandardMaterial;
    wireframe?: THREE.MeshStandardMaterial;
  }>({});

  useEffect(() => {
    if (!isOpen) return;

    if (!checkWebGLSupport()) {
      setWebglError("WebGL hardware acceleration is not enabled or supported on this browser.");
      setLoading(false);
      return;
    }

    setWebglError(null);
    setLoading(true);

    let isDisposed = false;
    let animId: number = 0;
    let renderer: THREE.WebGLRenderer | null = null;
    let controls: OrbitControls | null = null;
    let resizeHandler: (() => void) | null = null;
    let timer: NodeJS.Timeout | null = null;

    try {
      const container = mountRef.current;
      if (!container) return;

      const width = container.clientWidth || 880;
      const height = container.clientHeight || 540;

      // 1. Scene Setup
      const scene = new THREE.Scene();
      scene.background = new THREE.Color("#030712"); // Deep Space Black
      scene.fog = new THREE.FogExp2(0x030712, 0.0035);
      sceneRef.current = scene;

      // 2. Camera Setup (Y is UP in standard Three.js)
      const camera = new THREE.PerspectiveCamera(40, width / height, 0.5, 1000);
      camera.position.set(-20, 48, 62);
      camera.lookAt(0, 4, 0);
      cameraRef.current = camera;

      // 3. Renderer Setup with Try-Catch protection
      renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: false, 
        powerPreference: "high-performance",
        failIfMajorPerformanceCaveat: false 
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;

      // Mount canvas into dedicated empty canvas container
      if (!container.contains(renderer.domElement)) {
        container.appendChild(renderer.domElement);
      }
      rendererRef.current = renderer;

      // 4. OrbitControls
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.maxPolarAngle = Math.PI / 2 - 0.05; // Stay above ground plane
      controls.minDistance = 15;
      controls.maxDistance = 220;
      controls.target.set(0, 4, 0);
      controls.autoRotate = autoRotate;
      controls.autoRotateSpeed = 0.8;
      controlsRef.current = controls;

      // 5. Lighting (Mars Solar Flux)
      const ambientLight = new THREE.AmbientLight(0x2d1a14, 1.8);
      scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0xfff5ea, 3.2);
      dirLight.castShadow = true;
      dirLight.shadow.mapSize.width = 1024;
      dirLight.shadow.mapSize.height = 1024;
      dirLight.position.set(45, 60, 35);
      scene.add(dirLight);
      dirLightRef.current = dirLight;

      // Rim light
      const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.65);
      fillLight.position.set(-50, 40, -40);
      scene.add(fillLight);

      // 6. Terrain Geometry (100 x 65 units, oriented on XZ ground plane where Y is elevation)
      const planeW = 100;
      const planeH = 65;
      const segX = 120;
      const segY = 80;
      const geometry = new THREE.PlaneGeometry(planeW, planeH, segX, segY);
      geometry.rotateX(-Math.PI / 2); // Orient so Y is UP (Elevation)

      // Textures & Materials
      const textureLoader = new THREE.TextureLoader();
      
      // Load Slope Hazard Texture safely
      const slopeHazardTex = textureLoader.load(
        "/data/jezero_slope_hazard.png",
        (tex) => {
          if (isDisposed) return;
          tex.wrapS = THREE.ClampToEdgeWrapping;
          tex.wrapT = THREE.ClampToEdgeWrapping;
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.needsUpdate = true;
          if (renderer && scene && camera) {
            renderer.render(scene, camera);
          }
        },
        undefined,
        (err) => {
          console.warn("Slope hazard texture load warning:", err);
        }
      );

      const hazardMat = new THREE.MeshStandardMaterial({
        map: slopeHazardTex,
        roughness: 0.85,
        metalness: 0.05,
        flatShading: false,
      });

      const realisticMat = new THREE.MeshStandardMaterial({
        color: 0xc45a28,
        roughness: 0.88,
        metalness: 0.08,
        flatShading: false,
      });

      const wireframeMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        wireframe: true,
      });

      materialsMapRef.current = {
        hazard: hazardMat,
        realistic: realisticMat,
        wireframe: wireframeMat
      };

      // Displace terrain vertices deterministically based on Jezero Delta morphology
      const pos = geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const z = pos.getZ(i);

        // Normalize coordinates to [0, 1]
        const u = (x + planeW / 2) / planeW;
        const v = (z + planeH / 2) / planeH;

        // Realistic Jezero Delta Elevation Function:
        const regionalSlope = (1.0 - u) * 9.5;
        const scarp = Math.exp(-Math.pow((u - 0.42) / 0.12, 2)) * 6.2;
        const ridges = Math.sin(u * 9.0 + v * 4.0) * 1.8 + Math.cos(v * 7.0 - u * 3.0) * 1.2;
        
        const crater1Dist = Math.hypot(x - 22, z + 8);
        const crater1 = Math.max(0, 1.0 - crater1Dist / 8.0) * -3.2;

        const crater2Dist = Math.hypot(x + 15, z - 12);
        const crater2 = Math.max(0, 1.0 - crater2Dist / 6.0) * -2.4;

        const elevY = Math.max(0, regionalSlope + scarp + ridges + crater1 + crater2 + 4.0);
        pos.setY(i, elevY);
      }
      geometry.computeVertexNormals();
      pos.needsUpdate = true;

      const initialMat = shadingMode === "hazard" ? hazardMat : realisticMat;
      const mesh = new THREE.Mesh(geometry, initialMat);
      mesh.receiveShadow = true;
      mesh.castShadow = true;
      scene.add(mesh);
      terrainMeshRef.current = mesh;

      // Build 3D Traverses
      build3DTraverses(scene);
      setLoading(false);

      // 7. Resize Handler
      resizeHandler = () => {
        if (isDisposed || !mountRef.current || !rendererRef.current || !cameraRef.current) return;
        const w = mountRef.current.clientWidth || 880;
        const h = mountRef.current.clientHeight || 540;
        cameraRef.current.aspect = w / h;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(w, h);
      };

      window.addEventListener("resize", resizeHandler);

      timer = setTimeout(() => {
        if (!isDisposed && resizeHandler) {
          resizeHandler();
        }
      }, 60);

      // 8. Render Animation Loop
      const animate = () => {
        if (isDisposed) return;
        animId = requestAnimationFrame(animate);
        if (controlsRef.current) {
          controlsRef.current.update();
        }
        if (rendererRef.current && sceneRef.current && cameraRef.current) {
          rendererRef.current.render(sceneRef.current, cameraRef.current);
        }
      };
      animate();

    } catch (err: any) {
      console.error("ThreeTerrainModal WebGL Initialization Error:", err);
      setWebglError(err?.message || "Failed to initialize 3D WebGL tactical viewport.");
      setLoading(false);
    }

    return () => {
      isDisposed = true;
      if (timer) clearTimeout(timer);
      if (animId) cancelAnimationFrame(animId);
      if (resizeHandler) window.removeEventListener("resize", resizeHandler);
      
      try {
        if (controls) controls.dispose();
        if (renderer) {
          renderer.dispose();
          renderer.forceContextLoss();
          const dom = renderer.domElement;
          if (dom && dom.parentNode) {
            dom.parentNode.removeChild(dom);
          }
        }
      } catch (cleanErr) {
        console.warn("Cleanup warning:", cleanErr);
      }
    };
  }, [isOpen]);

  // Construct 3D Curved Traverses and Landmark Pins (In X-Z plane where Y is elevation)
  const build3DTraverses = (scene: THREE.Scene) => {
    const routesGroup = new THREE.Group();
    routesGroupRef.current = routesGroup;

    // 1. Safe Route (Emerald Green, avoids high gradient scarps)
    const safeCoords: [number, number, number][] = [
      [38, 7.8, 0],
      [28, 8.4, 5],
      [12, 8.8, 6],
      [-5, 8.6, 5],
      [-16, 8.2, 3],
      [-22, 9.6, 7]
    ];
    const safePoints = safeCoords.map(([x, y, z]) => new THREE.Vector3(x, y + 0.6, z));
    const safeCurve = new THREE.CatmullRomCurve3(safePoints);
    const safeGeo = new THREE.TubeGeometry(safeCurve, 48, 0.35, 8, false);
    const safeMat = new THREE.MeshStandardMaterial({
      color: 0x34d399,
      emissive: 0x34d399,
      emissiveIntensity: 0.7,
      roughness: 0.2
    });
    routesGroup.add(new THREE.Mesh(safeGeo, safeMat));

    // 2. Balanced Route (Cyan, direct gradient path)
    const balCoords: [number, number, number][] = [
      [38, 7.8, 0],
      [26, 8.5, 4],
      [8, 8.9, 5],
      [-10, 8.8, 6],
      [-22, 9.6, 7]
    ];
    const balPoints = balCoords.map(([x, y, z]) => new THREE.Vector3(x, y + 0.8, z));
    const balCurve = new THREE.CatmullRomCurve3(balPoints);
    const balGeo = new THREE.TubeGeometry(balCurve, 48, 0.32, 8, false);
    const balMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.8,
      roughness: 0.2
    });
    routesGroup.add(new THREE.Mesh(balGeo, balMat));

    // 3. Science Route (Orange, visits Séítah carbonate outcrops)
    const sciCoords: [number, number, number][] = [
      [38, 7.8, 0],
      [24, 7.6, -2],
      [6, 7.2, -5], // Séítah outcrop
      [-8, 8.2, 1],
      [-22, 9.6, 7]
    ];
    const sciPoints = sciCoords.map(([x, y, z]) => new THREE.Vector3(x, y + 0.9, z));
    const sciCurve = new THREE.CatmullRomCurve3(sciPoints);
    const sciGeo = new THREE.TubeGeometry(sciCurve, 48, 0.38, 8, false);
    const sciMat = new THREE.MeshStandardMaterial({
      color: 0xfc3d21,
      emissive: 0xfc3d21,
      emissiveIntensity: 0.85,
      roughness: 0.2
    });
    routesGroup.add(new THREE.Mesh(sciGeo, sciMat));

    // Marker Pins Helper
    const addPin = (x: number, y: number, z: number, color: number) => {
      // Vertical Stem
      const stemGeo = new THREE.CylinderGeometry(0.12, 0.12, 4.5, 8);
      const stemMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const stem = new THREE.Mesh(stemGeo, stemMat);
      stem.position.set(x, y + 2.25, z);
      routesGroup.add(stem);

      // Glowing Beacon Top
      const beaconGeo = new THREE.SphereGeometry(0.9, 16, 16);
      const beaconMat = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 1.2
      });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.set(x, y + 4.8, z);
      routesGroup.add(beacon);
    };

    // Add Key Geographic Markers
    addPin(38, 7.8, 0, 0xffffff); // Octavia E. Butler Landing Site (Sol 13)
    addPin(-22, 9.6, 7, 0xfbbf24); // Cape Flatley Delta Front
    addPin(6, 7.2, -5, 0xa78bfa); // Séítah Carbonate Outcrop (SCI-02)

    scene.add(routesGroup);
  };

  // Toggle Routes Visibility
  useEffect(() => {
    if (routesGroupRef.current) {
      routesGroupRef.current.visible = showRoutes;
    }
  }, [showRoutes]);

  // Update Shading Mode
  useEffect(() => {
    if (terrainMeshRef.current && materialsMapRef.current) {
      const mat = materialsMapRef.current[shadingMode];
      if (mat) {
        terrainMeshRef.current.material = mat;
      }
    }
  }, [shadingMode]);

  // Update Sun Direction
  useEffect(() => {
    if (dirLightRef.current) {
      const rad = THREE.MathUtils.degToRad(sunAzimuth);
      dirLightRef.current.position.set(Math.cos(rad) * 60, 60, Math.sin(rad) * 60);
    }
  }, [sunAzimuth]);

  // Update Auto-Rotate
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
    }
  }, [autoRotate]);

  // Camera Presets
  const applyPreset = (preset: "hero" | "nadir" | "approach" | "eye") => {
    if (!cameraRef.current || !controlsRef.current) return;
    setActivePreset(preset);
    const camera = cameraRef.current;
    const controls = controlsRef.current;

    if (preset === "hero") {
      camera.position.set(-20, 48, 62);
      controls.target.set(0, 4, 0);
    } else if (preset === "nadir") {
      camera.position.set(0, 95, 0.1);
      controls.target.set(0, 0, 0);
    } else if (preset === "approach") {
      camera.position.set(45, 26, 12);
      controls.target.set(-10, 5, 2);
    } else if (preset === "eye") {
      camera.position.set(12, 10, 18);
      controls.target.set(-15, 6, -3);
    }
    controls.update();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl h-[92vh] max-h-[840px] bg-[#070B14] border border-white/15 rounded-2xl flex flex-col overflow-hidden shadow-[0_0_70px_rgba(0,0,0,0.95)]">
        
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-white/10 bg-[#0A0F1D]">
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-[#FC3D21]/15 border border-[#FC3D21]/30 flex items-center justify-center text-[#FC3D21]">
              <Mountain className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-wide uppercase font-sans">
                  Jezero Crater 3D Tactical Sector
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30 font-semibold">
                  USGS 1.0M DTM RELIEF
                </span>
                <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#34D399]/15 text-[#34D399] border border-[#34D399]/30">
                  EVA TRAVERSE COPILOT
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Topographic relief model showing slope hazard avoidance from Perseverance landing plain to Cape Flatley delta front.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowInfoGuide(!showInfoGuide)}
              className={`p-2 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-semibold ${
                showInfoGuide 
                  ? "bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/40" 
                  : "text-slate-400 hover:text-white hover:bg-white/10"
              }`}
              title="Toggle Interactive Guide"
            >
              <HelpCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Guide</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Close 3D Viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* WebGL Fallback Notification or Error State */}
        {webglError ? (
          <div className="flex-1 w-full bg-[#030712] flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div className="max-w-md space-y-2">
              <h4 className="text-lg font-bold text-white font-sans">WebGL Viewport Fallback</h4>
              <p className="text-xs text-slate-400">
                {webglError}
              </p>
              <p className="text-xs text-slate-300">
                High-resolution 2D shaded relief and Horn 3x3 slope hazard maps remain operational in the main Mission Console workspace.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-[#FC3D21] hover:bg-[#E0341B] text-white font-bold text-xs rounded-xl shadow-lg transition-all"
              >
                Return to Mission Map
              </button>
            </div>
          </div>
        ) : (
          /* 3D Canvas Viewport Container */
          <div className="relative flex-1 w-full bg-[#030712] cursor-grab active:cursor-grabbing select-none overflow-hidden">
            {/* Dedicated Three.js canvas container with NO React children */}
            <div ref={mountRef} className="absolute inset-0 w-full h-full pointer-events-auto" />

            {/* Sibling React HUD components */}
            {loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#030712]/90 z-20 pointer-events-none">
                <div className="w-10 h-10 rounded-full border-2 border-[#38BDF8] border-t-transparent animate-spin" />
                <span className="text-xs text-[#38BDF8] font-mono tracking-wider">
                  Generating 3D Relief Mesh &amp; Slope Hazard Overlay...
                </span>
              </div>
            )}

            {/* Top Quick Explanatory Banner (Immediately clarifies what this is!) */}
            {showInfoGuide && (
              <div className="absolute top-3 left-4 right-4 z-20 pointer-events-auto bg-[#070E22]/90 backdrop-blur-md border border-white/15 rounded-xl p-3 shadow-xl animate-in fade-in duration-300 flex items-start justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-[#FC3D21] text-white uppercase">
                      How It Works
                    </span>
                    <span className="font-bold text-white">
                      Topographic Slope Safety &amp; Traverse Comparison
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Astronauts in 160 kg EVA suits cannot safely walk on slopes steeper than <strong>15°–22°</strong>. 
                    In this 3D view, <span className="text-[#F87171] font-semibold">Red areas</span> indicate dangerous steep cliffs and crater walls. 
                    The colored lines represent <strong>A* computed traverses</strong> navigating safely around cliff hazards to reach ancient rock formations.
                  </p>
                </div>
                <button
                  onClick={() => setShowInfoGuide(false)}
                  className="text-slate-400 hover:text-white p-1"
                  title="Dismiss guide banner"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Floating Camera & Shading Controls (Top Left) */}
            <div className={`absolute ${showInfoGuide ? "top-24" : "top-4"} left-4 z-10 flex flex-col gap-2 transition-all`}>
              <div className="bg-[#070B14]/85 backdrop-blur-md p-1.5 rounded-xl border border-white/10 shadow-lg flex items-center gap-1 text-xs">
                <span className="text-[10px] font-mono font-bold text-slate-400 px-2 uppercase">Camera View:</span>
                <button
                  onClick={() => applyPreset("hero")}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                    activePreset === "hero" ? "bg-[#FC3D21] text-white font-bold" : "text-slate-300 hover:text-white"
                  }`}
                >
                  Delta Overview
                </button>
                <button
                  onClick={() => applyPreset("nadir")}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                    activePreset === "nadir" ? "bg-[#38BDF8] text-[#04070D] font-bold" : "text-slate-300 hover:text-white"
                  }`}
                >
                  Top-Down Map
                </button>
                <button
                  onClick={() => applyPreset("approach")}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                    activePreset === "approach" ? "bg-[#38BDF8] text-[#04070D] font-bold" : "text-slate-300 hover:text-white"
                  }`}
                >
                  Landing Site
                </button>
                <button
                  onClick={() => applyPreset("eye")}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                    activePreset === "eye" ? "bg-[#34D399] text-[#04070D] font-bold" : "text-slate-300 hover:text-white"
                  }`}
                >
                  Astronaut Eye-Level
                </button>
              </div>

              {/* Surface Shader Selection */}
              <div className="bg-[#070B14]/85 backdrop-blur-md p-1.5 rounded-xl border border-white/10 shadow-lg flex items-center gap-1 text-xs">
                <span className="text-[10px] font-mono font-bold text-slate-400 px-2 uppercase">Surface Mode:</span>
                <button
                  onClick={() => setShadingMode("hazard")}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1.5 transition-all ${
                    shadingMode === "hazard" 
                      ? "bg-[#FC3D21]/20 text-[#FC3D21] border border-[#FC3D21]/40 font-bold" 
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-[#FC3D21]" />
                  <span>Slope Hazard (Safety)</span>
                </button>
                <button
                  onClick={() => setShadingMode("realistic")}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                    shadingMode === "realistic" 
                      ? "bg-[#E8B85A]/20 text-[#E8B85A] border border-[#E8B85A]/40 font-bold" 
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  Mars Albedo
                </button>
                <button
                  onClick={() => setShadingMode("wireframe")}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                    shadingMode === "wireframe" 
                      ? "bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/40 font-bold" 
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  Wireframe Mesh
                </button>
              </div>
            </div>

            {/* Comprehensive Legend & Landmark Key (Top Right) */}
            <div className={`absolute ${showInfoGuide ? "top-24" : "top-4"} right-4 z-10 hidden sm:flex flex-col gap-2 transition-all`}>
              <div className="bg-[#070B14]/90 backdrop-blur-md p-3.5 rounded-xl border border-white/10 shadow-2xl space-y-3 text-xs w-64">
                
                {/* 3D Routes Explanation */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Traverse Routes (A*):
                  </span>
                  
                  <div className="flex items-center gap-2 text-white">
                    <span className="w-3 h-1.5 rounded-full bg-[#34D399]" />
                    <div>
                      <span className="font-semibold text-[#34D399] block">Safe Route (3.02 km)</span>
                      <span className="text-[10px] text-slate-400">Minimizes slope gradient &lt;10°</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-white">
                    <span className="w-3 h-1.5 rounded-full bg-[#38BDF8]" />
                    <div>
                      <span className="font-semibold text-[#38BDF8] block">Balanced Route (2.98 km)</span>
                      <span className="text-[10px] text-slate-400">Fastest direct safe traverse</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-white">
                    <span className="w-3 h-1.5 rounded-full bg-[#FC3D21]" />
                    <div>
                      <span className="font-semibold text-[#FC3D21] block">Science Route (3.80 km)</span>
                      <span className="text-[10px] text-slate-400">Visits Séítah carbonate rocks</span>
                    </div>
                  </div>
                </div>

                {/* 3D Landmark Pins */}
                <div className="pt-2 border-t border-white/10 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Landmark Pins:
                  </span>
                  
                  <div className="flex items-center gap-2 text-white text-[11px]">
                    <span className="w-2.5 h-2.5 rounded-full bg-white border border-black shadow" />
                    <span>Landing Site (Perseverance Sol 13)</span>
                  </div>

                  <div className="flex items-center gap-2 text-white text-[11px]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FBBF24] border border-black shadow" />
                    <span>Cape Flatley (Delta Front Scarp)</span>
                  </div>

                  <div className="flex items-center gap-2 text-white text-[11px]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#A78BFA] border border-black shadow" />
                    <span>Séítah Outcrop (Ancient Clay)</span>
                  </div>
                </div>

                {/* Slope Hazard Color Bar */}
                <div className="pt-2 border-t border-white/10 space-y-1 text-[10px]">
                  <span className="font-bold text-slate-400 uppercase tracking-wider block">
                    Slope Colors:
                  </span>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-[#34D399]">Green: Safe (&lt;8°)</span>
                    <span className="text-[#FBBF24]">Amber: 8–14°</span>
                    <span className="text-[#F87171]">Red: Cliff (&gt;14°)</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Navigation Controls Guidance (Bottom Left) */}
            <div className="absolute bottom-4 left-4 z-10 pointer-events-none">
              <div className="bg-[#070B14]/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-[10px] text-slate-300 flex items-center gap-3">
                <span className="text-white font-bold">CONTROLS:</span>
                <span>Left-Click + Drag: Rotate Mars Surface</span>
                <span>•</span>
                <span>Right-Click + Drag: Pan</span>
                <span>•</span>
                <span>Scroll: Zoom In/Out</span>
              </div>
            </div>
          </div>
        )}

        {/* Modal Bottom Controls Bar */}
        <div className="flex flex-wrap items-center justify-between px-6 py-3 border-t border-white/10 bg-[#0A0F1D] text-xs gap-4">
          <div className="flex flex-wrap items-center gap-5">
            {/* Traverses Toggle */}
            <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white transition-colors">
              <input
                type="checkbox"
                checked={showRoutes}
                onChange={(e) => setShowRoutes(e.target.checked)}
                className="w-3.5 h-3.5 rounded accent-[#FC3D21]"
              />
              <span className="text-[11px] font-semibold">Show 3D Traverse Paths &amp; Landmark Pins</span>
            </label>

            {/* Auto-Rotate Toggle */}
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] border transition-all ${
                autoRotate
                  ? "bg-[#38BDF8]/20 text-[#38BDF8] border-[#38BDF8]/40 font-bold"
                  : "bg-white/5 text-slate-300 border-white/10 hover:text-white"
              }`}
            >
              <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? "animate-spin text-[#38BDF8]" : ""}`} />
              <span>{autoRotate ? "Rotating Surface" : "Auto-Rotate"}</span>
            </button>

            {/* Sun Azimuth Slider */}
            <div className="hidden md:flex items-center gap-2">
              <Sun className="w-3.5 h-3.5 text-[#FBBF24]" />
              <span className="text-slate-400 text-[11px]">Sun Angle:</span>
              <input
                type="range"
                min="0"
                max="360"
                value={sunAzimuth}
                onChange={(e) => setSunAzimuth(Number(e.target.value))}
                className="w-24 accent-[#FBBF24] cursor-pointer"
              />
              <span className="text-white text-[11px] w-8">{sunAzimuth}°</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
            <span>EPSG:104905 [MARS IAU2000]</span>
            <span>•</span>
            <span className="text-[#34D399]">THREE.JS WEBGL READY</span>
          </div>
        </div>
      </div>
    </div>
  );
}

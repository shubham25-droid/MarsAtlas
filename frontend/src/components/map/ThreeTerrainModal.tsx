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
  Info
} from "lucide-react";

interface ThreeTerrainModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ThreeTerrainModal({ isOpen, onClose }: ThreeTerrainModalProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [shadingMode, setShadingMode] = useState<"hazard" | "realistic" | "wireframe">("hazard");
  const [showRoutes, setShowRoutes] = useState(true);
  const [sunAzimuth, setSunAzimuth] = useState(65);
  const [autoRotate, setAutoRotate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activePreset, setActivePreset] = useState<string>("hero");

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
    if (!isOpen || !mountRef.current) return;

    const container = mountRef.current;
    let width = container.clientWidth || 880;
    let height = container.clientHeight || 540;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#030712"); // Deep Space Black
    scene.fog = new THREE.FogExp2(0x030712, 0.003);
    sceneRef.current = scene;

    // 2. Camera Setup (Y is UP in standard Three.js)
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.5, 1000);
    camera.position.set(-20, 48, 62);
    camera.lookAt(0, 4, 0);
    cameraRef.current = camera;

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. OrbitControls (Smooth, natural ground-orbiting)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.04; // Never clip beneath terrain
    controls.minDistance = 15;
    controls.maxDistance = 220;
    controls.target.set(0, 4, 0);
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 0.8;
    controlsRef.current = controls;

    // 5. Lighting (Mars Solar Flux)
    const ambientLight = new THREE.AmbientLight(0x2d1a14, 1.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff5ea, 3.0);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.position.set(45, 60, 35);
    scene.add(dirLight);
    dirLightRef.current = dirLight;

    // Faint celestial blue rim light
    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.6);
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
    const slopeHazardTex = textureLoader.load("/data/jezero_slope_hazard.png", () => {
      slopeHazardTex.wrapS = THREE.ClampToEdgeWrapping;
      slopeHazardTex.wrapT = THREE.ClampToEdgeWrapping;
      slopeHazardTex.colorSpace = THREE.SRGBColorSpace;
      renderer.render(scene, camera);
    });

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

    // Heightmap displacement via Canvas (CORS-safe)
    const heightImg = new Image();
    heightImg.crossOrigin = "anonymous";
    heightImg.onload = () => {
      const cvs = document.createElement("canvas");
      cvs.width = 128;
      cvs.height = 128;
      const ctx = cvs.getContext("2d");
      if (ctx) {
        ctx.drawImage(heightImg, 0, 0, 128, 128);
        const pData = ctx.getImageData(0, 0, 128, 128).data;
        const pos = geometry.attributes.position;

        // Displace Y coordinate based on pixel luminance
        for (let i = 0; i < pos.count; i++) {
          const x = pos.getX(i);
          const z = pos.getZ(i);
          const u = (x + planeW / 2) / planeW;
          const v = (z + planeH / 2) / planeH;
          const px = Math.min(127, Math.max(0, Math.floor(u * 127)));
          const py = Math.min(127, Math.max(0, Math.floor((1 - v) * 127)));
          const normH = pData[(py * 128 + px) * 4] / 255.0;
          pos.setY(i, normH * 16.0);
        }
        geometry.computeVertexNormals();
        pos.needsUpdate = true;
      }

      const initialMat = shadingMode === "hazard" ? hazardMat : realisticMat;
      const mesh = new THREE.Mesh(geometry, initialMat);
      mesh.receiveShadow = true;
      mesh.castShadow = true;
      scene.add(mesh);
      terrainMeshRef.current = mesh;

      // Build 3D Traverses
      build3DTraverses(scene);
      setLoading(false);
    };

    heightImg.onerror = () => {
      // Fallback if image fails to load
      const initialMat = shadingMode === "hazard" ? hazardMat : realisticMat;
      const mesh = new THREE.Mesh(geometry, initialMat);
      scene.add(mesh);
      terrainMeshRef.current = mesh;
      build3DTraverses(scene);
      setLoading(false);
    };

    heightImg.src = "/data/jezero_heightmap.png";

    // 7. Resize Handler
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = mountRef.current.clientWidth || 880;
      const h = mountRef.current.clientHeight || 540;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // Initial resize trigger to avoid zero-dimension glitch
    const timer = setTimeout(() => {
      handleResize();
    }, 60);

    // 8. Render Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isOpen]);

  // Construct 3D Curved Traverses and Landmark Pins (In X-Z plane where Y is elevation)
  const build3DTraverses = (scene: THREE.Scene) => {
    const routesGroup = new THREE.Group();
    routesGroupRef.current = routesGroup;

    // 1. Safe Route (Emerald Green, avoids high gradient scarps)
    const safeCoords: [number, number, number][] = [
      [38, 7.5, 0],
      [28, 8.2, 5],
      [12, 8.5, 6],
      [-5, 8.2, 5],
      [-16, 7.8, 3],
      [-22, 9.2, 7]
    ];
    const safePoints = safeCoords.map(([x, y, z]) => new THREE.Vector3(x, y + 0.6, z));
    const safeCurve = new THREE.CatmullRomCurve3(safePoints);
    const safeGeo = new THREE.TubeGeometry(safeCurve, 48, 0.32, 8, false);
    const safeMat = new THREE.MeshStandardMaterial({
      color: 0x34d399,
      emissive: 0x34d399,
      emissiveIntensity: 0.7,
      roughness: 0.2
    });
    routesGroup.add(new THREE.Mesh(safeGeo, safeMat));

    // 2. Balanced Route (Cyan, direct gradient path)
    const balCoords: [number, number, number][] = [
      [38, 7.5, 0],
      [26, 8.2, 4],
      [8, 8.6, 5],
      [-10, 8.4, 6],
      [-22, 9.2, 7]
    ];
    const balPoints = balCoords.map(([x, y, z]) => new THREE.Vector3(x, y + 0.8, z));
    const balCurve = new THREE.CatmullRomCurve3(balPoints);
    const balGeo = new THREE.TubeGeometry(balCurve, 48, 0.28, 8, false);
    const balMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.8,
      roughness: 0.2
    });
    routesGroup.add(new THREE.Mesh(balGeo, balMat));

    // 3. Science Route (Orange, visits Séítah carbonate outcrops)
    const sciCoords: [number, number, number][] = [
      [38, 7.5, 0],
      [24, 7.2, -2],
      [6, 6.8, -5], // Séítah outcrop
      [-8, 7.8, 1],
      [-22, 9.2, 7]
    ];
    const sciPoints = sciCoords.map(([x, y, z]) => new THREE.Vector3(x, y + 0.9, z));
    const sciCurve = new THREE.CatmullRomCurve3(sciPoints);
    const sciGeo = new THREE.TubeGeometry(sciCurve, 48, 0.35, 8, false);
    const sciMat = new THREE.MeshStandardMaterial({
      color: 0xf36c3d,
      emissive: 0xf36c3d,
      emissiveIntensity: 0.8,
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
      const beaconGeo = new THREE.SphereGeometry(0.8, 16, 16);
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
    addPin(38, 7.5, 0, 0xffffff); // Octavia E. Butler Landing Site (Sol 13)
    addPin(-22, 9.2, 7, 0xfbbf24); // Cape Flatley Delta Front
    addPin(6, 6.8, -5, 0xa78bfa); // Séítah Carbonate Outcrop (SCI-02)

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
      // Perspective view looking at delta scarp
      camera.position.set(-20, 48, 62);
      controls.target.set(0, 4, 0);
    } else if (preset === "nadir") {
      // Top-Down Map View
      camera.position.set(0, 95, 0.1);
      controls.target.set(0, 0, 0);
    } else if (preset === "approach") {
      // Looking west from landing site
      camera.position.set(45, 26, 12);
      controls.target.set(-10, 5, 2);
    } else if (preset === "eye") {
      // Astronaut eye-level perspective
      camera.position.set(12, 10, 18);
      controls.target.set(-15, 6, -3);
    }
    controls.update();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl h-[92vh] max-h-[820px] bg-[#070B14] border border-white/[0.12] rounded-2xl flex flex-col overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.95)]">
        
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-white/[0.08] bg-[#0A0F1D]">
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-[#F36C3D]/15 border border-[#F36C3D]/30 flex items-center justify-center text-[#F36C3D]">
              <Mountain className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-wide uppercase font-sans">
                  Jezero Crater 3D Tactical Sector Model
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/30 font-semibold">
                  WEBGL 2.0 • USGS 1M DTM
                </span>
                <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#34D399]/10 text-[#34D399] border border-[#34D399]/30">
                  CSRM 3D TRAVERSES
                </span>
              </div>
              <p className="text-[11px] text-[#94A3B8]">
                Real-time topographic relief mesh derived from USGS Mars 2020 TRN 1.0m DTM with slope hazard overlay.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
              title="Close 3D Viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 3D Canvas Viewport */}
        <div ref={mountRef} className="relative flex-1 w-full bg-[#030712] cursor-grab active:cursor-grabbing select-none overflow-hidden">
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#030712]/90 z-20">
              <div className="w-10 h-10 rounded-full border-2 border-[#38BDF8] border-t-transparent animate-spin" />
              <span className="text-xs text-[#38BDF8] font-mono tracking-wider">
                Generating 3D Relief Mesh &amp; Slope Hazard Overlay...
              </span>
            </div>
          )}

          {/* Floating Camera Presets HUD (Top Left) */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
            <div className="bg-[#070B14]/85 backdrop-blur-md p-1.5 rounded-xl border border-white/[0.08] shadow-lg flex items-center gap-1 text-xs">
              <span className="text-[10px] font-mono font-bold text-[#64748B] px-2 uppercase">Camera:</span>
              <button
                onClick={() => applyPreset("hero")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                  activePreset === "hero" ? "bg-[#F36C3D] text-white font-bold" : "text-[#94A3B8] hover:text-white"
                }`}
              >
                Delta Front
              </button>
              <button
                onClick={() => applyPreset("nadir")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                  activePreset === "nadir" ? "bg-[#38BDF8] text-[#04070D] font-bold" : "text-[#94A3B8] hover:text-white"
                }`}
              >
                Nadir (Map)
              </button>
              <button
                onClick={() => applyPreset("approach")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                  activePreset === "approach" ? "bg-[#38BDF8] text-[#04070D] font-bold" : "text-[#94A3B8] hover:text-white"
                }`}
              >
                Landing Site
              </button>
              <button
                onClick={() => applyPreset("eye")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                  activePreset === "eye" ? "bg-[#34D399] text-[#04070D] font-bold" : "text-[#94A3B8] hover:text-white"
                }`}
              >
                Astronaut Eye
              </button>
            </div>

            {/* Tactical Shading Mode Selector */}
            <div className="bg-[#070B14]/85 backdrop-blur-md p-1.5 rounded-xl border border-white/[0.08] shadow-lg flex items-center gap-1 text-xs">
              <span className="text-[10px] font-mono font-bold text-[#64748B] px-2 uppercase">Surface:</span>
              <button
                onClick={() => setShadingMode("hazard")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1.5 transition-all ${
                  shadingMode === "hazard" 
                    ? "bg-[#F36C3D]/20 text-[#F36C3D] border border-[#F36C3D]/40 font-bold" 
                    : "text-[#94A3B8] hover:text-white"
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5 text-[#F36C3D]" />
                <span>Slope Hazard</span>
              </button>
              <button
                onClick={() => setShadingMode("realistic")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                  shadingMode === "realistic" 
                    ? "bg-[#E8B85A]/20 text-[#E8B85A] border border-[#E8B85A]/40 font-bold" 
                    : "text-[#94A3B8] hover:text-white"
                }`}
              >
                Mars Albedo
              </button>
              <button
                onClick={() => setShadingMode("wireframe")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                  shadingMode === "wireframe" 
                    ? "bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/40 font-bold" 
                    : "text-[#94A3B8] hover:text-white"
                }`}
              >
                Wireframe
              </button>
            </div>
          </div>

          {/* Telemetry Legends HUD (Top Right) */}
          <div className="absolute top-4 right-4 z-10 hidden sm:flex flex-col gap-2">
            <div className="bg-[#070B14]/85 backdrop-blur-md p-3 rounded-xl border border-white/[0.08] shadow-lg space-y-2 text-[11px] font-mono text-[#94A3B8] w-56">
              <div className="flex items-center justify-between text-white font-bold pb-1.5 border-b border-white/[0.08]">
                <span>SECTOR TELEMETRY</span>
                <span className="text-[#38BDF8] text-[10px]">JEZ_EVA_01</span>
              </div>
              <div className="flex justify-between">
                <span>Elevation:</span>
                <span className="text-white font-semibold">-2,605 to -2,121 m</span>
              </div>
              <div className="flex justify-between">
                <span>Relief Amplitude:</span>
                <span className="text-[#38BDF8] font-semibold">484 m</span>
              </div>
              <div className="flex justify-between">
                <span>Peak Slope:</span>
                <span className="text-[#F36C3D] font-semibold">22.7° (Horn 3x3)</span>
              </div>
              <div className="flex justify-between">
                <span>Grid Footprint:</span>
                <span className="text-white font-semibold">6.2 x 4.2 km</span>
              </div>

              {/* 3D Routes Legend */}
              <div className="pt-2 border-t border-white/[0.08] space-y-1 text-[10px]">
                <div className="text-[#64748B] font-bold uppercase">Traverse Overlays:</div>
                <div className="flex items-center gap-2 text-white">
                  <span className="w-2.5 h-1 rounded-full bg-[#34D399]" />
                  <span>Safe Mode (Min Slope)</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <span className="w-2.5 h-1 rounded-full bg-[#38BDF8]" />
                  <span>Balanced Time Mode</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <span className="w-2.5 h-1 rounded-full bg-[#F36C3D]" />
                  <span>Max Science (CRISM Targets)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls Guidance */}
          <div className="absolute bottom-4 left-4 z-10 pointer-events-none">
            <div className="bg-[#070B14]/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/[0.08] text-[10px] font-mono text-[#94A3B8] flex items-center gap-3">
              <span className="text-white font-semibold">CONTROLS:</span>
              <span>Left-Click + Drag: Orbit Surface</span>
              <span>•</span>
              <span>Right-Click + Drag: Pan</span>
              <span>•</span>
              <span>Scroll: Zoom In/Out</span>
            </div>
          </div>
        </div>

        {/* Modal Bottom Controls Bar */}
        <div className="flex flex-wrap items-center justify-between px-6 py-3 border-t border-white/[0.08] bg-[#0A0F1D] text-xs gap-4">
          <div className="flex flex-wrap items-center gap-5">
            {/* Traverses Toggle */}
            <label className="flex items-center gap-2 cursor-pointer text-[#94A3B8] hover:text-white transition-colors">
              <input
                type="checkbox"
                checked={showRoutes}
                onChange={(e) => setShowRoutes(e.target.checked)}
                className="w-3.5 h-3.5 rounded accent-[#F36C3D]"
              />
              <span className="font-mono text-[11px] font-medium">Show 3D Traverses &amp; Landmark Pins</span>
            </label>

            {/* Auto-Rotate Toggle */}
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-mono text-[11px] border transition-all ${
                autoRotate
                  ? "bg-[#38BDF8]/20 text-[#38BDF8] border-[#38BDF8]/40 font-bold"
                  : "bg-white/[0.03] text-[#94A3B8] border-white/[0.08] hover:text-white"
              }`}
            >
              <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? "animate-spin text-[#38BDF8]" : ""}`} />
              <span>{autoRotate ? "Rotating (0.8 RPM)" : "Auto-Orbit"}</span>
            </button>

            {/* Sun Azimuth Slider */}
            <div className="hidden md:flex items-center gap-2">
              <Sun className="w-3.5 h-3.5 text-[#FBBF24]" />
              <span className="text-slate-400 font-mono text-[11px]">Sun Azimuth:</span>
              <input
                type="range"
                min="0"
                max="360"
                value={sunAzimuth}
                onChange={(e) => setSunAzimuth(Number(e.target.value))}
                className="w-24 accent-[#FBBF24] cursor-pointer"
              />
              <span className="font-mono text-white text-[11px] w-8">{sunAzimuth}°</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono text-[#64748B]">
            <span>EPSG:104905 [MARS IAU2000]</span>
            <span>•</span>
            <span className="text-[#34D399]">THREE.JS WEBGL READY</span>
          </div>
        </div>
      </div>
    </div>
  );
}

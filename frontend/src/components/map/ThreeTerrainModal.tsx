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
  const [exaggeration, setExaggeration] = useState(1.8);
  const [sunAzimuth, setSunAzimuth] = useState(65);
  const [sunElevation, setSunElevation] = useState(48);
  const [autoRotate, setAutoRotate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activePreset, setActivePreset] = useState<string>("hero");

  // References for live updates
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const terrainMeshRef = useRef<THREE.Mesh | null>(null);
  const routesGroupRef = useRef<THREE.Group | null>(null);
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);
  const rawHeightArrayRef = useRef<Float32Array | null>(null);
  const materialsMapRef = useRef<{
    hazard?: THREE.MeshStandardMaterial;
    realistic?: THREE.MeshStandardMaterial;
    wireframe?: THREE.MeshStandardMaterial;
  }>({});

  useEffect(() => {
    if (!isOpen || !mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth || 920;
    const height = container.clientHeight || 560;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#030712"); // Deep Space Black
    scene.fog = new THREE.FogExp2(0x030712, 0.0035);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.5, 2000);
    // Initial heroic angle looking toward Jezero delta scarp
    camera.position.set(-25, -78, 52);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2 - 0.04; // Prevent going beneath ground
    controls.minDistance = 15;
    controls.maxDistance = 250;
    controls.target.set(0, 0, 8);
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 0.7;
    controlsRef.current = controls;

    // 5. Lighting (Simulating Mars Solar Flux & Atmospheric Scattering)
    const ambientLight = new THREE.AmbientLight(0x2d1a14, 1.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff3e6, 3.2);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 10;
    dirLight.shadow.camera.far = 300;
    dirLight.shadow.camera.left = -60;
    dirLight.shadow.camera.right = 60;
    dirLight.shadow.camera.top = 60;
    dirLight.shadow.camera.bottom = -60;
    scene.add(dirLight);
    dirLightRef.current = dirLight;

    // Distant faint celestial fill light
    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.6);
    fillLight.position.set(60, 60, 40);
    scene.add(fillLight);

    // 6. Grid plane geometry (550 x 350 aspect ratio ~ 1.57:1)
    const planeW = 110;
    const planeH = 70;
    const segX = 180;
    const segY = 115;
    const geometry = new THREE.PlaneGeometry(planeW, planeH, segX, segY);

    // Coordinate helper: from UV to 3D world position
    const uvToWorld = (u: number, v: number, zOffset = 0.6) => {
      const x = (u - 0.5) * planeW;
      const y = (v - 0.5) * planeH;
      // sample height
      let z = 0;
      if (rawHeightArrayRef.current) {
        const rawW = 256;
        const rawH = 256;
        const px = Math.min(rawW - 1, Math.max(0, Math.floor(u * rawW)));
        const py = Math.min(rawH - 1, Math.max(0, Math.floor((1 - v) * rawH)));
        const normH = rawHeightArrayRef.current[py * rawW + px];
        z = normH * (14.0 * exaggeration);
      }
      return new THREE.Vector3(x, y, z + zOffset);
    };

    // 7. Textures Loader
    const textureLoader = new THREE.TextureLoader();
    let texturesLoaded = 0;
    const checkReady = () => {
      texturesLoaded++;
      if (texturesLoaded >= 2) {
        setLoading(false);
      }
    };

    const slopeHazardTex = textureLoader.load("/data/jezero_slope_hazard.png", () => {
      slopeHazardTex.wrapS = THREE.ClampToEdgeWrapping;
      slopeHazardTex.wrapT = THREE.ClampToEdgeWrapping;
      slopeHazardTex.colorSpace = THREE.SRGBColorSpace;
      checkReady();
    });

    // Realistic Mars procedural albedo fallback
    const realisticMat = new THREE.MeshStandardMaterial({
      color: 0xba5a2f,
      roughness: 0.88,
      metalness: 0.08,
      flatShading: false,
    });

    const hazardMat = new THREE.MeshStandardMaterial({
      map: slopeHazardTex,
      roughness: 0.85,
      metalness: 0.05,
      flatShading: false,
    });

    const wireframeMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      wireframe: true,
      wireframeLinewidth: 1,
    });

    materialsMapRef.current = {
      hazard: hazardMat,
      realistic: realisticMat,
      wireframe: wireframeMat
    };

    // Load Heightmap to displace vertices
    textureLoader.load(
      "/data/jezero_heightmap.png",
      (heightmapTex) => {
        const canvas = document.createElement("canvas");
        const rw = 256;
        const rh = 256;
        canvas.width = rw;
        canvas.height = rh;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(heightmapTex.image, 0, 0, rw, rh);
          const imgData = ctx.getImageData(0, 0, rw, rh).data;
          const floatHeights = new Float32Array(rw * rh);

          for (let p = 0; p < rw * rh; p++) {
            floatHeights[p] = imgData[p * 4] / 255.0; // Normalized 0..1
          }
          rawHeightArrayRef.current = floatHeights;

          // Displace geometry
          const pos = geometry.attributes.position;
          for (let i = 0; i < pos.count; i++) {
            const u = (pos.getX(i) + planeW / 2) / planeW;
            const v = (pos.getY(i) + planeH / 2) / planeH;
            const px = Math.min(rw - 1, Math.max(0, Math.floor(u * (rw - 1))));
            const py = Math.min(rh - 1, Math.max(0, Math.floor((1 - v) * (rh - 1))));
            const normH = floatHeights[py * rw + px];
            pos.setZ(i, normH * (14.0 * exaggeration));
          }
          geometry.computeVertexNormals();
        }

        const initialMat = shadingMode === "hazard" ? hazardMat : shadingMode === "realistic" ? realisticMat : wireframeMat;
        const mesh = new THREE.Mesh(geometry, initialMat);
        mesh.receiveShadow = true;
        mesh.castShadow = true;
        scene.add(mesh);
        terrainMeshRef.current = mesh;

        // Build 3D Traverses and Waypoint Markers
        buildTraverseRoutes(scene, uvToWorld);
        checkReady();
      },
      undefined,
      () => {
        // Fallback smooth terrain if heightmap fetch fails
        const initialMat = shadingMode === "hazard" ? hazardMat : realisticMat;
        const mesh = new THREE.Mesh(geometry, initialMat);
        scene.add(mesh);
        terrainMeshRef.current = mesh;
        setLoading(false);
      }
    );

    // Resize handler
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // Animation Render Loop
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
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isOpen]);

  // Helper to construct 3D spline routes and pin markers
  const buildTraverseRoutes = (scene: THREE.Scene, uvToWorld: (u: number, v: number, zOffset?: number) => THREE.Vector3) => {
    const routesGroup = new THREE.Group();
    routesGroupRef.current = routesGroup;

    // UV coordinates inside modelled EVA Sector:
    // Sector bounds: Longitude 77.35 to 77.46, Latitude 18.41 to 18.48
    // Start (Octavia E. Butler Landing Site): ~77.45°E, 18.444°N -> u ~ 0.91, v ~ 0.49
    // Destination (Cape Flatley Delta Front): ~77.402°E, 18.453°N -> u ~ 0.47, v ~ 0.61

    // 1. Safe Route (Avoids scarp, traverses gentle valley floor)
    const safeUVs = [
      [0.91, 0.49],
      [0.85, 0.58],
      [0.72, 0.58],
      [0.58, 0.58],
      [0.49, 0.53],
      [0.47, 0.61]
    ];
    const safePoints = safeUVs.map(([u, v]) => uvToWorld(u, v, 0.7));
    const safeCurve = new THREE.CatmullRomCurve3(safePoints);
    const safeGeo = new THREE.TubeGeometry(safeCurve, 64, 0.32, 8, false);
    const safeMat = new THREE.MeshStandardMaterial({
      color: 0x34d399,
      emissive: 0x34d399,
      emissiveIntensity: 0.6,
      roughness: 0.2
    });
    routesGroup.add(new THREE.Mesh(safeGeo, safeMat));

    // 2. Balanced Route (Direct gradient path)
    const balUVs = [
      [0.91, 0.49],
      [0.84, 0.57],
      [0.70, 0.57],
      [0.55, 0.57],
      [0.47, 0.61]
    ];
    const balPoints = balUVs.map(([u, v]) => uvToWorld(u, v, 0.8));
    const balCurve = new THREE.CatmullRomCurve3(balPoints);
    const balGeo = new THREE.TubeGeometry(balCurve, 64, 0.28, 8, false);
    const balMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.7,
      roughness: 0.2
    });
    routesGroup.add(new THREE.Mesh(balGeo, balMat));

    // 3. Science Route (Visits Séítah and Delta contacts)
    const sciUVs = [
      [0.91, 0.49],
      [0.82, 0.48],
      [0.68, 0.45],
      [0.62, 0.43], // SCI-02 contact
      [0.52, 0.49],
      [0.47, 0.61]
    ];
    const sciPoints = sciUVs.map(([u, v]) => uvToWorld(u, v, 0.9));
    const sciCurve = new THREE.CatmullRomCurve3(sciPoints);
    const sciGeo = new THREE.TubeGeometry(sciCurve, 64, 0.35, 8, false);
    const sciMat = new THREE.MeshStandardMaterial({
      color: 0xf36c3d,
      emissive: 0xf36c3d,
      emissiveIntensity: 0.8,
      roughness: 0.2
    });
    routesGroup.add(new THREE.Mesh(sciGeo, sciMat));

    // Marker helper
    const addPin = (u: number, v: number, color: number, label: string) => {
      const pos = uvToWorld(u, v, 0.5);
      // Stem
      const stemGeo = new THREE.CylinderGeometry(0.12, 0.12, 4.0, 8);
      const stemMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const stem = new THREE.Mesh(stemGeo, stemMat);
      stem.position.set(pos.x, pos.y, pos.z + 2.0);
      stem.rotation.x = Math.PI / 2;
      routesGroup.add(stem);

      // Glowing Beacon Top
      const headGeo = new THREE.SphereGeometry(0.75, 16, 16);
      const headMat = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 1.2
      });
      const head = new THREE.Mesh(headGeo, headMat);
      head.position.set(pos.x, pos.y, pos.z + 4.2);
      routesGroup.add(head);
    };

    // Add Key Operational Landmarks
    addPin(0.91, 0.49, 0xffffff, "Landing Site (Sol 13)");
    addPin(0.47, 0.61, 0xfbbf24, "Cape Flatley Delta Front");
    addPin(0.62, 0.43, 0xa78bfa, "Séítah Carbonate Outcrop (SCI-02)");

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
      const azRad = THREE.MathUtils.degToRad(sunAzimuth);
      const elRad = THREE.MathUtils.degToRad(sunElevation);
      const dist = 90;
      const x = dist * Math.cos(elRad) * Math.sin(azRad);
      const y = -dist * Math.cos(elRad) * Math.cos(azRad);
      const z = dist * Math.sin(elRad);
      dirLightRef.current.position.set(x, y, z);
    }
  }, [sunAzimuth, sunElevation]);

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
      // Perspective toward delta scarp
      camera.position.set(-25, -78, 52);
      controls.target.set(0, 0, 8);
    } else if (preset === "nadir") {
      // Top-Down Map View
      camera.position.set(0, 0, 115);
      controls.target.set(0, 0, 0);
    } else if (preset === "approach") {
      // Looking west from landing site
      camera.position.set(58, -50, 36);
      controls.target.set(-5, 5, 6);
    } else if (preset === "eye") {
      // Astronaut low traverse view
      camera.position.set(10, -32, 14);
      controls.target.set(-15, 12, 9);
    }
    controls.update();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl h-[92vh] max-h-[820px] bg-[#070B14] border border-white/[0.12] rounded-2xl flex flex-col overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.9)]">
        {/* Modal Top Header (NASA Style) */}
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
                  CSRM A* TRAVERSES
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
                Reconstructing 3D Terrain &amp; Slope Hazard Overlay...
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
                  <span>Max Science (CRISM Hotspots)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Hint Footer Bar inside canvas */}
          <div className="absolute bottom-4 left-4 z-10 pointer-events-none">
            <div className="bg-[#070B14]/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/[0.08] text-[10px] font-mono text-[#94A3B8] flex items-center gap-3">
              <span className="text-white font-semibold">NAVIGATION:</span>
              <span>Left-Click + Drag: Orbit</span>
              <span>•</span>
              <span>Right-Click + Drag: Pan</span>
              <span>•</span>
              <span>Scroll: Zoom</span>
            </div>
          </div>
        </div>

        {/* Modal Bottom Tactical Controls Bar */}
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
              <span className="font-mono text-[11px] font-medium">Show 3D Traverses &amp; Landmarks</span>
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
              <span>{autoRotate ? "Rotating (0.7 RPM)" : "Auto-Orbit"}</span>
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
            <span className="text-[#34D399]">100% OPERATIONAL</span>
          </div>
        </div>
      </div>
    </div>
  );
}

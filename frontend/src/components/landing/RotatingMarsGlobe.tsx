"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Compass, RotateCw, Sparkles, Navigation, Globe, Mountain, ShieldCheck, Info } from "lucide-react";

interface TargetSite {
  id: string;
  name: string;
  mission: string;
  type: string;
  lat: number;
  lon: number;
  elevation: string;
  color: string;
  desc: string;
}

// Authentic NASA Planetary Science Landmarks & Study Sites
const SITES: TargetSite[] = [
  {
    id: "jezero",
    name: "Jezero Crater",
    mission: "Perseverance & Ingenuity (M20)",
    type: "Ancient Delta & Lacustrine Basin",
    lat: 18.38,
    lon: 77.58,
    elevation: "-2,500 m (MOLA Datum)",
    color: "#FC3D21",
    desc: "18.38°N, 77.58°E • Western Delta Biosignature Target & Cape Flatley Mudstones"
  },
  {
    id: "gale",
    name: "Gale Crater",
    mission: "Curiosity (MSL)",
    type: "Mount Sharp Sedimentary Strata",
    lat: -5.37,
    lon: 137.44,
    elevation: "-4,500 m (MOLA Datum)",
    color: "#38BDF8",
    desc: "5.37°S, 137.44°E • Gediz Vallis Ridge & 5.5 km Mount Sharp Boxwork Ridges"
  },
  {
    id: "olympus",
    name: "Olympus Mons",
    mission: "MRO & Mars Express",
    type: "Shield Volcano (Solar System's Tallest)",
    lat: 18.65,
    lon: 226.20,
    elevation: "+21,287 m (Caldera Summit)",
    color: "#FBBF24",
    desc: "18.65°N, 226.20°E • 600 km Diameter Basaltic Shield & 80 km Caldera Complex"
  },
  {
    id: "valles",
    name: "Valles Marineris",
    mission: "Viking & Mars Odyssey THEMIS",
    type: "Grand Canyon Tectonic Rifting",
    lat: -14.00,
    lon: 300.80,
    elevation: "-7,000 m (Chasma Floor)",
    color: "#34D399",
    desc: "14.00°S, 300.80°E • 4,000 km Long Tectonic Rift System up to 7 km Deep"
  }
];

// Convert Lat/Lon to 3D Cartesian coordinates on sphere surface
function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  
  return new THREE.Vector3(x, y, z);
}

export default function RotatingMarsGlobe() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [activeSite, setActiveSite] = useState<TargetSite>(SITES[0]); // Default to Jezero Crater
  const [isHovered, setIsHovered] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [facingLon, setFacingLon] = useState<number>(78);

  const animFrameId = useRef<number | null>(null);
  const marsMeshRef = useRef<THREE.Mesh | null>(null);
  const ringsRef = useRef<THREE.Mesh[]>([]);
  const targetRotationY = useRef<number | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 380;
    const height = container.clientHeight || 380;

    // 1. Scene Setup
    const scene = new THREE.Scene();

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0, 6.4);

    // 3. WebGL Renderer with High-Precision ACES Filmic Tone Mapping
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      container.appendChild(renderer.domElement);
    } catch (e) {
      console.error("WebGL initialization failed for RotatingMarsGlobe:", e);
      return;
    }

    // 4. Mars Axial Tilt Group (Mars true obliquity = 25.19°)
    const tiltGroup = new THREE.Group();
    tiltGroup.rotation.z = THREE.MathUtils.degToRad(-25.19);
    scene.add(tiltGroup);

    // 5. Mars Sphere Mesh with Procedural MOLA Relief Bump Mapping
    const sphereRadius = 2.15;
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, 64, 64);

    const textureLoader = new THREE.TextureLoader();
    const marsTexture = textureLoader.load(
      "/assets/mars_texture_2k.jpg",
      () => {
        renderer.render(scene, camera);
      }
    );
    marsTexture.colorSpace = THREE.SRGBColorSpace;

    // Standard material with bumpMap deriving relief directly from the 2K texture
    const marsMaterial = new THREE.MeshStandardMaterial({
      map: marsTexture,
      bumpMap: marsTexture,
      bumpScale: 0.038, // Realistic crater and canyon relief along the terminator
      roughness: 0.86,
      metalness: 0.02
    });

    const marsMesh = new THREE.Mesh(sphereGeo, marsMaterial);
    // Initial orientation: face Jezero Crater (Lon 77.58°)
    const initialTargetRad = -THREE.MathUtils.degToRad(77.58 + 90);
    marsMesh.rotation.y = initialTargetRad;
    tiltGroup.add(marsMesh);
    marsMeshRef.current = marsMesh;

    // 6. Realistic Mars Atmospheric Limb Scattering (6.1 hPa Dust Aerosol Glow)
    const atmoGeo = new THREE.SphereGeometry(sphereRadius * 1.022, 64, 64);
    const atmoMat = new THREE.MeshBasicMaterial({
      color: 0xf97316,
      transparent: true,
      opacity: 0.09,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending
    });
    const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
    tiltGroup.add(atmoMesh);

    // Outer faint atmospheric haze
    const outerHazeGeo = new THREE.SphereGeometry(sphereRadius * 1.045, 48, 48);
    const outerHazeMat = new THREE.MeshBasicMaterial({
      color: 0xfb923c,
      transparent: true,
      opacity: 0.04,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending
    });
    const outerHazeMesh = new THREE.Mesh(outerHazeGeo, outerHazeMat);
    tiltGroup.add(outerHazeMesh);

    // 7. Authentic NASA Landmark Pinpoints & Concentric Radar Rings
    const createdRings: THREE.Mesh[] = [];
    SITES.forEach((site) => {
      const pos = latLonToVector3(site.lat, site.lon, sphereRadius + 0.015);

      // Core landmark bead
      const markerGeo = new THREE.SphereGeometry(0.04, 16, 16);
      const markerMat = new THREE.MeshBasicMaterial({ color: site.color });
      const marker = new THREE.Mesh(markerGeo, markerMat);
      marker.position.copy(pos);
      marsMesh.add(marker);

      // Radar telemetry ring
      const ringGeo = new THREE.RingGeometry(0.06, 0.088, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: site.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(pos);
      ring.lookAt(pos.clone().multiplyScalar(2));
      marsMesh.add(ring);
      createdRings.push(ring);
    });
    ringsRef.current = createdRings;

    // 8. Authentic Sun Lighting (Solar constant at 1.524 AU = 590 W/m²)
    // Directional Sun light from upper-right
    const sunLight = new THREE.DirectionalLight(0xfff8ee, 3.4);
    sunLight.position.set(7, 3.5, 5);
    scene.add(sunLight);

    // Space ambient fill (Mars unlit side is dark but receives subtle cosmic background)
    const spaceAmbient = new THREE.AmbientLight(0x1a1210, 1.1);
    scene.add(spaceAmbient);

    // Subtle blue-tinted limb light from deep space
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.35);
    rimLight.position.set(-6, -2, -4);
    scene.add(rimLight);

    // 9. Interactive Drag / Pointer Controls
    let isDragging = false;
    let previousPointerX = 0;
    let dragVelocity = 0;
    const baseRotationSpeed = 0.0016; // Authentic leisurely planetary sidereal roll

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      setIsInteracting(true);
      targetRotationY.current = null;
      previousPointerX = e.clientX;
      dragVelocity = 0;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging || !marsMeshRef.current) return;
      const deltaX = e.clientX - previousPointerX;
      previousPointerX = e.clientX;
      dragVelocity = deltaX * 0.0045;
      marsMeshRef.current.rotation.y += dragVelocity;
    };

    const onPointerUp = () => {
      isDragging = false;
      setIsInteracting(false);
    };

    const domEl = renderer.domElement;
    domEl.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    // 10. Animation Render Loop
    let pulseTime = 0;
    const animate = () => {
      animFrameId.current = requestAnimationFrame(animate);

      if (marsMeshRef.current) {
        if (targetRotationY.current !== null) {
          const diff = targetRotationY.current - marsMeshRef.current.rotation.y;
          marsMeshRef.current.rotation.y += diff * 0.065;
          if (Math.abs(diff) < 0.001) {
            targetRotationY.current = null;
          }
        } else if (isDragging) {
          // Handled in pointer move
        } else {
          // Apply inertia or continuous sidereal rotation
          if (Math.abs(dragVelocity) > 0.0001) {
            marsMeshRef.current.rotation.y += dragVelocity;
            dragVelocity *= 0.92;
          } else {
            marsMeshRef.current.rotation.y += baseRotationSpeed;
          }
        }

        // Live calculation of sub-observer Martian longitude
        const curY = marsMeshRef.current.rotation.y;
        const deg = THREE.MathUtils.radToDeg(-curY) - 90;
        const normalizedLon = Math.round(((deg % 360) + 360) % 360);
        setFacingLon(normalizedLon);
      }

      // Pulse telemetry rings
      pulseTime += 0.035;
      const scale = 1 + Math.sin(pulseTime) * 0.22;
      const opacity = 0.5 + Math.sin(pulseTime) * 0.4;
      ringsRef.current.forEach((r) => {
        r.scale.set(scale, scale, scale);
        (r.material as THREE.MeshBasicMaterial).opacity = opacity;
      });

      renderer.render(scene, camera);
    };
    animate();

    // 11. Responsive Resize Observer
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      domEl.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);

      sphereGeo.dispose();
      marsMaterial.dispose();
      marsTexture.dispose();
      atmoGeo.dispose();
      atmoMat.dispose();
      outerHazeGeo.dispose();
      outerHazeMat.dispose();
      renderer.dispose();
      if (domEl.parentNode) {
        domEl.parentNode.removeChild(domEl);
      }
    };
  }, []);

  // Smoothly rotate globe to face selected mission site
  const focusSite = (site: TargetSite) => {
    if (!marsMeshRef.current) return;
    setActiveSite(site);

    const targetRad = -THREE.MathUtils.degToRad(site.lon + 90);
    const current = marsMeshRef.current.rotation.y;
    const twoPi = Math.PI * 2;
    const diff = ((targetRad - current) % twoPi + twoPi * 1.5) % twoPi - Math.PI;
    targetRotationY.current = current + diff;
  };

  return (
    <div 
      className="relative w-full max-w-[360px] sm:max-w-[420px] mx-auto flex flex-col items-center select-none font-sans"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Outer Atmospheric Glow Halo */}
      <div className="absolute -inset-3 bg-gradient-to-r from-[#FC3D21]/20 via-[#F97316]/15 to-[#38BDF8]/15 rounded-full blur-2xl opacity-75 pointer-events-none" />

      {/* Main Glass Sphere Viewport */}
      <div className="relative w-full aspect-square rounded-3xl bg-[#030712]/75 backdrop-blur-md border border-white/15 overflow-hidden shadow-[0_16px_50px_rgba(0,0,0,0.85)] flex items-center justify-center cursor-grab active:cursor-grabbing">
        
        {/* Top Planetary Telemetry Strip */}
        <div className="absolute top-3 inset-x-3 z-10 flex items-center justify-between pointer-events-none text-xs font-sans">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/75 border border-white/15 backdrop-blur-md text-slate-200">
            <span className="w-2 h-2 rounded-full bg-[#FC3D21] animate-ping" />
            <span className="font-bold text-white uppercase tracking-wide">MARS (MOLA RELIEF)</span>
          </div>

          <div className="px-3 py-1.5 rounded-full bg-black/75 border border-white/15 backdrop-blur-md text-[#38BDF8] font-mono font-semibold">
            <span>{facingLon}° E LON</span>
          </div>
        </div>

        {/* Dedicated Three.js WebGL Canvas Mount */}
        <div ref={mountRef} className="w-full h-full" />

        {/* Center Target Reticle on Hover */}
        <div className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${isHovered ? "opacity-35" : "opacity-0"}`}>
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-52 h-52 rounded-full border border-dashed border-[#FC3D21]/70 animate-[spin_60s_linear_infinite]" />
          </div>
        </div>

        {/* Bottom Interactive Prompt Strip */}
        <div className="absolute bottom-3 inset-x-3 z-10 flex items-center justify-between pointer-events-none text-xs font-sans">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/80 border border-white/15 backdrop-blur-md text-slate-200">
            <RotateCw className={`w-3.5 h-3.5 text-[#38BDF8] ${isInteracting ? "animate-spin" : ""}`} />
            <span className="font-medium">{isInteracting ? "ORBITING..." : "DRAG TO ROTATE"}</span>
          </div>

          <div className="px-3 py-1.5 rounded-full bg-black/80 border border-white/15 backdrop-blur-md text-[#34D399] font-semibold">
            <span>AXIAL TILT 25.19°</span>
          </div>
        </div>
      </div>

      {/* 4 Authentic NASA Landmarks Quick-Focus Selector */}
      <div className="w-full mt-3.5 grid grid-cols-2 gap-2 text-xs font-sans">
        {SITES.map((site) => {
          const isSelected = activeSite.id === site.id;
          return (
            <button
              key={site.id}
              onClick={() => focusSite(site)}
              className={`p-2.5 rounded-xl border transition-all text-left flex flex-col justify-between ${
                isSelected
                  ? "bg-[#FC3D21]/20 border-[#FC3D21] text-white shadow-md shadow-[#FC3D21]/20 ring-1 ring-[#FC3D21]/40"
                  : "bg-[#070B14]/85 border-white/15 hover:border-white/30 text-slate-300"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-bold text-xs text-white flex items-center gap-1.5 font-sans">
                  <span 
                    className="w-2.5 h-2.5 rounded-full shrink-0" 
                    style={{ backgroundColor: site.color }} 
                  />
                  {site.name}
                </span>
                <Navigation className="w-3.5 h-3.5 text-slate-400 transform rotate-45 shrink-0" />
              </div>
              <span className="text-xs text-slate-400 font-sans mt-1">
                {site.mission}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Landmark Detailed Scientific Telemetry Card */}
      {activeSite && (
        <div className="w-full mt-2.5 p-3 rounded-2xl bg-[#0A0F1D]/95 border border-white/15 text-left text-xs font-sans space-y-1.5 shadow-xl animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
            <div>
              <span className="font-extrabold text-white text-sm block font-sans">{activeSite.name}</span>
              <span className="text-xs font-semibold text-[#38BDF8] font-sans">{activeSite.type}</span>
            </div>
            <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-[#FC3D21]/20 text-[#FC3D21] border border-[#FC3D21]/30">
              {activeSite.elevation}
            </span>
          </div>
          <p className="text-xs text-slate-300 font-sans leading-relaxed pt-0.5">{activeSite.desc}</p>
        </div>
      )}
    </div>
  );
}

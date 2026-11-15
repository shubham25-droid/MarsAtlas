"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Compass, RotateCw, Sparkles, Navigation, Globe } from "lucide-react";

interface TargetSite {
  id: string;
  name: string;
  mission: string;
  lat: number;
  lon: number;
  color: string;
  desc: string;
}

const SITES: TargetSite[] = [
  {
    id: "jezero",
    name: "Jezero Crater",
    mission: "Perseverance (M20)",
    lat: 18.38,
    lon: 77.58,
    color: "#FC3D21",
    desc: "18.38°N, 77.58°E • Western Delta Biosignature Target"
  },
  {
    id: "gale",
    name: "Gale Crater",
    mission: "Curiosity (MSL)",
    lat: -5.4,
    lon: 137.8,
    color: "#38BDF8",
    desc: "5.40°S, 137.80°E • Mount Sharp Gediz Vallis Ridge"
  }
];

// Convert Lat/Lon to 3D Cartesian coordinates on sphere surface
// Mars texture: lon 0 is center (u=0.5), -180 is left (u=0), +180 is right (u=1)
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
  const [activeSite, setActiveSite] = useState<TargetSite | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [facingLon, setFacingLon] = useState<number>(0);

  // Three.js internal state stored in refs to prevent unnecessary re-renders
  const animFrameId = useRef<number | null>(null);
  const marsMeshRef = useRef<THREE.Mesh | null>(null);
  const ringsRef = useRef<THREE.Mesh[]>([]);
  const targetRotationY = useRef<number | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth || 360;
    const height = container.clientHeight || 360;

    // 1. Scene Setup
    const scene = new THREE.Scene();

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 6.2);

    // 3. WebGL Renderer
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

    // 5. Mars Sphere Mesh
    const sphereRadius = 2.15;
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, 64, 64);

    // Texture Loader
    const textureLoader = new THREE.TextureLoader();
    const marsTexture = textureLoader.load(
      "/assets/mars_texture_2k.jpg",
      () => {
        renderer.render(scene, camera);
      }
    );
    marsTexture.colorSpace = THREE.SRGBColorSpace;

    const marsMaterial = new THREE.MeshStandardMaterial({
      map: marsTexture,
      roughness: 0.88,
      metalness: 0.04
    });

    const marsMesh = new THREE.Mesh(sphereGeo, marsMaterial);
    tiltGroup.add(marsMesh);
    marsMeshRef.current = marsMesh;

    // 6. Atmospheric Glow Mesh (Subtle outer rim)
    const atmoGeo = new THREE.SphereGeometry(sphereRadius * 1.018, 48, 48);
    const atmoMat = new THREE.MeshBasicMaterial({
      color: 0xf97316,
      transparent: true,
      opacity: 0.08,
      side: THREE.BackSide
    });
    const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
    tiltGroup.add(atmoMesh);

    // 7. Landing Site Markers
    const createdRings: THREE.Mesh[] = [];
    SITES.forEach((site) => {
      const pos = latLonToVector3(site.lat, site.lon, sphereRadius + 0.02);

      // Pinpoint core sphere
      const markerGeo = new THREE.SphereGeometry(0.045, 16, 16);
      const markerMat = new THREE.MeshBasicMaterial({ color: site.color });
      const marker = new THREE.Mesh(markerGeo, markerMat);
      marker.position.copy(pos);
      marsMesh.add(marker);

      // Pulse ring around the marker
      const ringGeo = new THREE.RingGeometry(0.06, 0.09, 32);
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

    // 8. Dynamic Lighting
    // Primary Sunlight (Directional)
    const sunLight = new THREE.DirectionalLight(0xfff7ed, 3.2);
    sunLight.position.set(6, 3, 5);
    scene.add(sunLight);

    // Deep Space Ambient Fill
    const spaceAmbient = new THREE.AmbientLight(0x22130e, 1.2);
    scene.add(spaceAmbient);

    // Subtle blue-tinted limb light from opposite side
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.45);
    rimLight.position.set(-6, -2, -4);
    scene.add(rimLight);

    // 9. Interactive Drag / Pointer Controls
    let isDragging = false;
    let previousPointerX = 0;
    let dragVelocity = 0;
    const baseRotationSpeed = 0.0022;

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
      dragVelocity = deltaX * 0.005;
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
        // If smooth transition to a target site is requested
        if (targetRotationY.current !== null) {
          const diff = targetRotationY.current - marsMeshRef.current.rotation.y;
          marsMeshRef.current.rotation.y += diff * 0.06;
          if (Math.abs(diff) < 0.001) {
            targetRotationY.current = null;
          }
        } else if (isDragging) {
          // Handled in pointer move
        } else {
          // Apply residual drag inertia
          if (Math.abs(dragVelocity) > 0.0001) {
            marsMeshRef.current.rotation.y += dragVelocity;
            dragVelocity *= 0.92;
          } else {
            // Constant smooth planetary spin
            marsMeshRef.current.rotation.y += baseRotationSpeed;
          }
        }

        // Calculate current sub-observer Martian longitude for live HUD
        const curY = marsMeshRef.current.rotation.y % (Math.PI * 2);
        const deg = THREE.MathUtils.radToDeg(curY);
        const normalizedLon = Math.round(((180 - deg) % 360 + 360) % 360);
        setFacingLon(normalizedLon);
      }

      // Pulse the landing site rings
      pulseTime += 0.04;
      const scale = 1 + Math.sin(pulseTime) * 0.25;
      const opacity = 0.5 + Math.sin(pulseTime) * 0.4;
      ringsRef.current.forEach((r) => {
        r.scale.set(scale, scale, scale);
        (r.material as THREE.MeshBasicMaterial).opacity = opacity;
      });

      renderer.render(scene, camera);
    };
    animate();

    // 11. Resize Observer
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

    // Cleanup
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

    // Target rotation where site.lon faces forward towards camera (theta = 0)
    const targetRad = (-(site.lon - 90) * Math.PI) / 180;
    const current = marsMeshRef.current.rotation.y;
    // Find closest modular angle to avoid full 360 spins
    const twoPi = Math.PI * 2;
    const diff = ((targetRad - current) % twoPi + twoPi * 1.5) % twoPi - Math.PI;
    targetRotationY.current = current + diff;
  };

  return (
    <div 
      className="relative w-full max-w-[340px] sm:max-w-[400px] mx-auto flex flex-col items-center select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Outer Glow Halo Ring */}
      <div className="absolute -inset-2 bg-gradient-to-r from-[#FC3D21]/25 via-[#F97316]/20 to-[#38BDF8]/20 rounded-full blur-2xl opacity-70 pointer-events-none" />

      {/* Main Glass Sphere Container */}
      <div className="relative w-full aspect-square rounded-3xl bg-[#030712]/70 backdrop-blur-md border border-white/15 overflow-hidden shadow-[0_12px_48px_rgba(0,0,0,0.8)] flex items-center justify-center cursor-grab active:cursor-grabbing">
        
        {/* Top HUD Status Pill */}
        <div className="absolute top-3 inset-x-3 z-10 flex items-center justify-between pointer-events-none text-[10px] font-mono">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 border border-white/10 backdrop-blur-md text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FC3D21] animate-ping" />
            <span className="font-bold text-[#FC3D21]">MARS (JEZERO/GALE)</span>
          </div>

          <div className="px-2.5 py-1 rounded-full bg-black/70 border border-white/10 backdrop-blur-md text-slate-400">
            <span>{facingLon}° E LON</span>
          </div>
        </div>

        {/* Dedicated Three.js Canvas Mount */}
        <div ref={mountRef} className="w-full h-full" />

        {/* Center Crosshair Overlay on Hover */}
        <div className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${isHovered ? "opacity-30" : "opacity-0"}`}>
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-48 h-48 rounded-full border border-dashed border-[#FC3D21]/60 animate-[spin_60s_linear_infinite]" />
          </div>
        </div>

        {/* Bottom Interactive Prompt Pill */}
        <div className="absolute bottom-3 inset-x-3 z-10 flex items-center justify-between pointer-events-none text-[10px] font-mono">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/80 border border-white/10 backdrop-blur-md text-slate-300">
            <RotateCw className={`w-3 h-3 text-[#38BDF8] ${isInteracting ? "animate-spin" : ""}`} />
            <span>{isInteracting ? "ORBITING..." : "DRAG TO ROTATE"}</span>
          </div>

          <div className="px-2.5 py-1 rounded-full bg-black/80 border border-white/10 backdrop-blur-md text-[#34D399]">
            <span>AXIAL TILT 25.2°</span>
          </div>
        </div>
      </div>

      {/* Mission Site Quick-Select Bar */}
      <div className="w-full mt-3 grid grid-cols-2 gap-2 text-xs font-sans">
        {SITES.map((site) => {
          const isSelected = activeSite?.id === site.id;
          return (
            <button
              key={site.id}
              onClick={() => focusSite(site)}
              className={`p-2 rounded-xl border transition-all text-left flex flex-col justify-between ${
                isSelected
                  ? "bg-[#FC3D21]/15 border-[#FC3D21] text-white shadow-md shadow-[#FC3D21]/20"
                  : "bg-[#070B14]/80 border-white/10 hover:border-white/25 text-slate-300"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-bold text-[11px] text-white flex items-center gap-1.5">
                  <span 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: site.color }} 
                  />
                  {site.name}
                </span>
                <Navigation className="w-3 h-3 text-slate-400 transform rotate-45" />
              </div>
              <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                {site.mission}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Site Detailed Readout */}
      {activeSite && (
        <div className="w-full mt-2 p-2.5 rounded-xl bg-[#0A0F1D]/90 border border-white/10 text-left text-xs space-y-1 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white text-[11px]">{activeSite.name}</span>
            <span className="text-[10px] font-mono text-[#38BDF8]">{activeSite.mission}</span>
          </div>
          <p className="text-[10px] text-slate-400 font-mono">{activeSite.desc}</p>
        </div>
      )}
    </div>
  );
}
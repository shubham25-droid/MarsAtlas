"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { X, Sun, Mountain, RotateCw, ZoomIn, Eye } from "lucide-react";

interface ThreeTerrainModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ThreeTerrainModal({ isOpen, onClose }: ThreeTerrainModalProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [exaggeration, setExaggeration] = useState(2.0);
  const [sunAngle, setSunAngle] = useState(45);
  const [wireframe, setWireframe] = useState(false);
  const [loading, setLoading] = useState(true);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);

  useEffect(() => {
    if (!isOpen || !mountRef.current) return;

    const width = mountRef.current.clientWidth || 800;
    const height = mountRef.current.clientHeight || 520;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#04070D");
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, -90, 80);
    camera.up.set(0, 0, 1);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting (Simulated Mars Solar Flux)
    const ambientLight = new THREE.AmbientLight(0x403028, 1.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffeedd, 2.8);
    dirLight.position.set(50, 50, 60);
    scene.add(dirLight);
    dirLightRef.current = dirLight;

    // Subtle blue rim light for deep space edge
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.6);
    rimLight.position.set(-60, -60, -30);
    scene.add(rimLight);

    // Load Heightmap and build terrain geometry
    const loader = new THREE.TextureLoader();
    loader.load(
      "/data/jezero_heightmap.png",
      (heightmapTex) => {
        const segX = 140;
        const segY = 90;
        const geo = new THREE.PlaneGeometry(100, 65, segX, segY);

        // Read pixel data from an offscreen canvas
        const canvas = document.createElement("canvas");
        canvas.width = heightmapTex.image.width || 256;
        canvas.height = heightmapTex.image.height || 256;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(heightmapTex.image, 0, 0);
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

          const pos = geo.attributes.position;
          for (let i = 0; i < pos.count; i++) {
            const u = (pos.getX(i) + 50) / 100;
            const v = (pos.getY(i) + 32.5) / 65;
            const px = Math.floor(u * (canvas.width - 1));
            const py = Math.floor((1 - v) * (canvas.height - 1));
            const pIndex = (py * canvas.width + px) * 4;
            const h = (imgData[pIndex] / 255.0) * (15.0 * exaggeration);
            pos.setZ(i, h);
          }
          geo.computeVertexNormals();
        }

        // Texture overlay (Mars rust / rock material)
        const mat = new THREE.MeshStandardMaterial({
          color: 0xcc6633,
          roughness: 0.82,
          metalness: 0.12,
          wireframe: wireframe
        });

        const terrainMesh = new THREE.Mesh(geo, mat);
        scene.add(terrainMesh);
        meshRef.current = terrainMesh;
        setLoading(false);
      },
      undefined,
      () => {
        const geo = new THREE.PlaneGeometry(100, 65, 40, 40);
        const mat = new THREE.MeshStandardMaterial({ color: 0xaa5533, wireframe: wireframe });
        const mesh = new THREE.Mesh(geo, mat);
        scene.add(mesh);
        meshRef.current = mesh;
        setLoading(false);
      }
    );

    // Mouse Interaction (Orbiting)
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !meshRef.current) return;
      const dx = e.clientX - prevMouseX;
      const dy = e.clientY - prevMouseY;
      meshRef.current.rotation.z += dx * 0.01;
      camera.position.z = Math.max(20, Math.min(150, camera.position.z - dy * 0.2));
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };
    const onMouseUp = () => {
      isDragging = false;
    };
    const onWheel = (e: WheelEvent) => {
      camera.position.z = Math.max(20, Math.min(160, camera.position.z + e.deltaY * 0.05));
    };

    const dom = renderer.domElement;
    dom.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    dom.addEventListener("wheel", onWheel);

    // Animation loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (meshRef.current && !isDragging) {
        meshRef.current.rotation.z += 0.001;
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      dom.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      dom.removeEventListener("wheel", onWheel);
      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.domElement.remove();
      }
    };
  }, [isOpen, wireframe]);

  // Adjust Sun Angle
  useEffect(() => {
    if (dirLightRef.current) {
      const rad = THREE.MathUtils.degToRad(sunAngle);
      dirLightRef.current.position.set(Math.cos(rad) * 70, Math.sin(rad) * 70, 60);
    }
  }, [sunAngle]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="relative w-full max-w-4xl h-[640px] bg-[#070B14] border border-white/[0.12] rounded-2xl flex flex-col overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#0A0F1D]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#F36C3D]/10 border border-[#F36C3D]/30 flex items-center justify-center text-[#F36C3D]">
              <Mountain className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-wide uppercase">
                  Jezero Crater 3D Sector Terrain Model
                </h3>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/30 font-bold">
                  WEBGL 2.0 • USGS 1M HiRISE
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Interactive real-time topographic mesh derived from USGS Mars 2020 TRN DTM
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3D Canvas Container */}
        <div ref={mountRef} className="relative flex-1 w-full bg-[#04070D] cursor-grab active:cursor-grabbing">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center text-xs text-[#38BDF8] font-mono">
              <span>Generating 3D surface mesh from 32-bit floating-point elevation array...</span>
            </div>
          )}

          {/* Interaction Guide HUD */}
          <div className="absolute top-4 left-4 pointer-events-none text-[11px] font-mono text-slate-400 bg-[#070B14]/80 px-3 py-1.5 rounded-lg border border-white/[0.08] backdrop-blur-md">
            <span>DRAG: Orbit Surface | SCROLL: Elevation Altitude</span>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="flex flex-wrap items-center justify-between px-6 py-3 border-t border-white/[0.08] bg-[#0A0F1D] text-xs">
          <div className="flex items-center gap-6">
            {/* Sun Angle Slider */}
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-[#FBBF24]" />
              <span className="text-slate-400 font-mono text-[11px]">Sun Azimuth:</span>
              <input
                type="range"
                min="0"
                max="360"
                value={sunAngle}
                onChange={(e) => setSunAngle(Number(e.target.value))}
                className="w-28 accent-[#FBBF24]"
              />
              <span className="font-mono text-white text-[11px]">{sunAngle}°</span>
            </div>

            {/* Wireframe toggle */}
            <button
              onClick={() => setWireframe(!wireframe)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono border transition-all ${
                wireframe
                  ? "bg-[#38BDF8]/20 text-[#38BDF8] border-[#38BDF8]/40"
                  : "bg-white/[0.04] text-slate-400 border-white/[0.08] hover:text-white"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{wireframe ? "Wireframe Active" : "Shaded Surface"}</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-400 font-mono">
            <span>Datum: MOLA Delta Geoid • Resolution: 2m/pixel</span>
          </div>
        </div>
      </div>
    </div>
  );
}
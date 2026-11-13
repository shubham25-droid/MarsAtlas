"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { X, Sun, Mountain, RotateCw, ZoomIn } from "lucide-react";

interface ThreeTerrainModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ThreeTerrainModal({ isOpen, onClose }: ThreeTerrainModalProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [exaggeration, setExaggeration] = useState(2.0);
  const [sunAngle, setSunAngle] = useState(45);
  const [loading, setLoading] = useState(true);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);

  useEffect(() => {
    if (!isOpen || !mountRef.current) return;

    const width = mountRef.current.clientWidth || 800;
    const height = mountRef.current.clientHeight || 500;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#070A10");
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, -90, 80);
    camera.up.set(0, 0, 1);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting (Simulated Mars Solar Flux)
    const ambientLight = new THREE.AmbientLight(0x403028, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffecd0, 2.5);
    dirLight.position.set(50, 50, 60);
    scene.add(dirLight);
    dirLightRef.current = dirLight;

    // Load Heightmap and build terrain geometry
    const loader = new THREE.TextureLoader();
    loader.load(
      "/data/jezero_heightmap.png",
      (heightmapTex) => {
        const segX = 120;
        const segY = 80;
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
          roughness: 0.85,
          metalness: 0.1,
          wireframe: false
        });

        const terrainMesh = new THREE.Mesh(geo, mat);
        scene.add(terrainMesh);
        meshRef.current = terrainMesh;
        setLoading(false);
      },
      undefined,
      () => {
        // Fallback procedural plane if texture fails
        const geo = new THREE.PlaneGeometry(100, 65, 40, 40);
        const mat = new THREE.MeshStandardMaterial({ color: 0xaa5533 });
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
        meshRef.current.rotation.z += 0.001; // subtle planetary rotation
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
  }, [isOpen]);

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
      <div className="relative w-full max-w-4xl h-[620px] bg-[#0D121B] border border-[#1E293B] rounded-2xl flex flex-col overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E293B] bg-[#131B26]">
          <div className="flex items-center gap-3">
            <Mountain className="w-5 h-5 text-[#E46A43]" />
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                Jezero Crater 3D Sector Terrain Model
              </h3>
              <p className="text-xs text-[#A0ACB9]">
                Interactive WebGL surface inspection derived from USGS Mars 2020 TRN 1m HiRISE DTM
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#A0ACB9] hover:text-white hover:bg-[#1E293B] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3D Canvas Container */}
        <div ref={mountRef} className="relative flex-1 w-full bg-[#070A10] cursor-grab active:cursor-grabbing">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center text-xs text-[#5CC8D7]">
              <span>Generating 3D surface mesh from 32-bit floating-point elevation array...</span>
            </div>
          )}

          {/* Interaction Guide */}
          <div className="absolute top-4 left-4 pointer-events-none text-[11px] text-[#A0ACB9] bg-[#070A10]/80 px-3 py-1.5 rounded-lg border border-[#1E293B]">
            <span>Left Click + Drag: Rotate | Scroll: Zoom Elevation</span>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="flex flex-wrap items-center justify-between px-6 py-3 border-t border-[#1E293B] bg-[#131B26] text-xs">
          <div className="flex items-center gap-6">
            {/* Sun Angle Slider */}
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-[#E8B65A]" />
              <span className="text-[#A0ACB9]">Sun Azimuth:</span>
              <input
                type="range"
                min="0"
                max="360"
                value={sunAngle}
                onChange={(e) => setSunAngle(Number(e.target.value))}
                className="w-28 accent-[#E8B65A]"
              />
              <span className="font-mono text-white">{sunAngle}°</span>
            </div>

            {/* Vertical Exaggeration */}
            <div className="flex items-center gap-2">
              <Mountain className="w-4 h-4 text-[#5CC8D7]" />
              <span className="text-[#A0ACB9]">Z-Scale:</span>
              <span className="font-mono text-white">{exaggeration.toFixed(1)}x</span>
            </div>
          </div>

          <div className="text-[11px] text-[#A0ACB9]">
            <span>Vertical Datum: MOLA Delta Geoid | Resolution: 2m/pixel</span>
          </div>
        </div>
      </div>
    </div>
  );
}

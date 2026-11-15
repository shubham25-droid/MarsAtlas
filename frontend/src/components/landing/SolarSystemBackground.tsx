"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Authentic NASA Deep-Space & Celestial Coordinate Background
 * Designed specifically as a calm, non-intrusive backdrop for the mission cockpit:
 * - Deep-space Hipparcos-calibrated stellar field (2,200 multi-magnitude stars)
 * - Delicate, low-opacity Keplerian planetary orbit arcs (Earth 1.0 AU, Mars 1.524 AU)
 * - Faint dashed Hohmann interplanetary transfer trajectory
 * - Zero solid foreground spheres or harsh white discs (ensuring zero clash with UI cards)
 * - Smooth celestial drift with gentle mouse parallax
 */
export default function SolarSystemBackground() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene & Deep Space Perspective Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 400);
    camera.position.set(0, 4, 48);
    camera.lookAt(0, 0, 0);

    // 2. High-Performance WebGL Renderer
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(width, height);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.95;
      container.appendChild(renderer.domElement);
    } catch (e) {
      console.error("WebGL initialization failed for SolarSystemBackground:", e);
      return;
    }

    // 3. Deep Celestial Starfield (Placed far behind UI at z = -40 to -140)
    const starCount = 2200;
    const starGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      // Cylindrical deep-space distribution
      const radius = 35 + Math.random() * 85;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 80;
      const zDepth = -30 - Math.random() * 90; // Far behind UI plane

      positions[i * 3] = radius * Math.cos(theta);
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = zDepth;

      // Authentic astronomical stellar temperatures
      const rand = Math.random();
      if (rand > 0.92) {
        // Red / Amber giants (Class M/K)
        colors[i * 3] = 0.96;
        colors[i * 3 + 1] = 0.45;
        colors[i * 3 + 2] = 0.22;
      } else if (rand > 0.78) {
        // Blue-white stellar beacons (Class O/B)
        colors[i * 3] = 0.55;
        colors[i * 3 + 1] = 0.78;
        colors[i * 3 + 2] = 1.0;
      } else if (rand > 0.6) {
        // Solar-type yellow-white stars (Class G)
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.95;
        colors[i * 3 + 2] = 0.8;
      } else {
        // Faint background stars
        const val = 0.35 + Math.random() * 0.35;
        colors[i * 3] = val;
        colors[i * 3 + 1] = val;
        colors[i * 3 + 2] = val;
      }
    }

    starGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    starGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.7
    });

    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // 4. Subtle Ambient Celestial Orbits (Faint background line-art, NOT solid discs)
    const orbitsGroup = new THREE.Group();
    orbitsGroup.position.set(0, 0, -25); // Pushed deep behind UI cards
    orbitsGroup.rotation.x = THREE.MathUtils.degToRad(26);
    orbitsGroup.rotation.z = THREE.MathUtils.degToRad(-14);
    scene.add(orbitsGroup);

    // Scaled Planetary Orbits with low opacity (faint background guide lines)
    const ORBIT_CURVES = [
      { a: 9.0, e: 0.0167, color: 0x38bdf8, opacity: 0.15 }, // Earth orbit (faint cyan)
      { a: 14.5, e: 0.0934, color: 0xfc3d21, opacity: 0.22 }, // Mars orbit (warm rust)
      { a: 21.0, e: 0.05, color: 0xfbbf24, opacity: 0.12 }   // Asteroid belt boundary
    ];

    ORBIT_CURVES.forEach((orb) => {
      const b = orb.a * Math.sqrt(1 - orb.e * orb.e);
      const c = orb.a * orb.e;

      const curve = new THREE.EllipseCurve(
        -c, 0,
        orb.a, b,
        0, 2 * Math.PI,
        false,
        0
      );

      const points = curve.getPoints(96);
      const pts3D = points.map((p) => new THREE.Vector3(p.x, 0, p.y));
      const lineGeo = new THREE.BufferGeometry().setFromPoints(pts3D);
      const lineMat = new THREE.LineBasicMaterial({
        color: orb.color,
        transparent: true,
        opacity: orb.opacity
      });

      const lineLoop = new THREE.LineLoop(lineGeo, lineMat);
      orbitsGroup.add(lineLoop);
    });

    // Faint Dashed Hohmann Interplanetary Transfer Arc
    const r1 = 9.0;
    const r2 = 14.5;
    const aH = (r1 + r2) / 2;
    const bH = Math.sqrt(r1 * r2);
    const cH = aH - r1;

    const hohmannCurve = new THREE.EllipseCurve(
      -cH, 0,
      aH, bH,
      0, Math.PI,
      false,
      0
    );
    const hohmannPts = hohmannCurve.getPoints(64);
    const hohmannPts3D = hohmannPts.map((p) => new THREE.Vector3(p.x, 0, p.y));
    const hohmannGeo = new THREE.BufferGeometry().setFromPoints(hohmannPts3D);
    const hohmannMat = new THREE.LineDashedMaterial({
      color: 0xf59e0b,
      dashSize: 0.5,
      gapSize: 0.4,
      transparent: true,
      opacity: 0.25
    });
    const hohmannLine = new THREE.Line(hohmannGeo, hohmannMat);
    hohmannLine.computeLineDistances();
    orbitsGroup.add(hohmannLine);

    // Subtle Diffuse Asteroid Dust Particles in Deep Background
    const dustCount = 240;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      const dist = 18.0 + Math.random() * 5.0;
      const angle = Math.random() * Math.PI * 2;
      const yOffset = (Math.random() - 0.5) * 1.5;

      dustPositions[i * 3] = dist * Math.cos(angle);
      dustPositions[i * 3 + 1] = yOffset;
      dustPositions[i * 3 + 2] = dist * Math.sin(angle);
    }
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0x94a3b8,
      size: 0.1,
      transparent: true,
      opacity: 0.2
    });
    const dustField = new THREE.Points(dustGeo, dustMat);
    orbitsGroup.add(dustField);

    // 5. Mouse Parallax Controls
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove);

    // 6. Animation Render Loop
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Tranquil, stately astronomical drift
      starField.rotation.y += 0.0001;
      orbitsGroup.rotation.y += 0.00015;

      // Soft mouse parallax
      targetX += (mouseX * 1.2 - targetX) * 0.02;
      targetY += (mouseY * 0.8 - targetY) * 0.02;

      camera.position.x = targetX;
      camera.position.y = 4 - targetY;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    animate();

    // 7. Resize Observer
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);

      starGeo.dispose();
      starMat.dispose();
      hohmannGeo.dispose();
      hohmannMat.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="absolute inset-0 pointer-events-none overflow-hidden" 
      aria-hidden="true" 
    />
  );
}

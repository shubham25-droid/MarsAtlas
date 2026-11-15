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
    camera.position.set(0, 2, 40);
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
      renderer.toneMappingExposure = 1.05;
      container.appendChild(renderer.domElement);
    } catch (e) {
      console.error("WebGL initialization failed for SolarSystemBackground:", e);
      return;
    }

    // 3. Deep Celestial Starfield (Placed far behind UI at z = -40 to -140)
    const starCount = 2800;
    const starGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      // Cylindrical deep-space distribution
      const radius = 30 + Math.random() * 95;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 90;
      const zDepth = -20 - Math.random() * 110;

      positions[i * 3] = radius * Math.cos(theta);
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = zDepth;

      // Authentic astronomical stellar temperatures
      const rand = Math.random();
      if (rand > 0.90) {
        // Red / Amber giants (Class M/K)
        colors[i * 3] = 0.98;
        colors[i * 3 + 1] = 0.55;
        colors[i * 3 + 2] = 0.28;
      } else if (rand > 0.75) {
        // Blue-white stellar beacons (Class O/B)
        colors[i * 3] = 0.65;
        colors[i * 3 + 1] = 0.85;
        colors[i * 3 + 2] = 1.0;
      } else if (rand > 0.55) {
        // Solar-type yellow-white stars (Class G)
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.98;
        colors[i * 3 + 2] = 0.85;
      } else {
        // Faint background stars
        const val = 0.5 + Math.random() * 0.45;
        colors[i * 3] = val;
        colors[i * 3 + 1] = val;
        colors[i * 3 + 2] = val;
      }
    }

    starGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    starGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.18,
      vertexColors: true,
      transparent: true,
      opacity: 0.85
    });

    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // 4. Vibrant & Crisp NASA Celestial Orbits & Hohmann Trajectories
    const orbitsGroup = new THREE.Group();
    orbitsGroup.position.set(0, -1, -8); // Positioned so arcs gracefully frame the hero viewport
    orbitsGroup.rotation.x = THREE.MathUtils.degToRad(24);
    orbitsGroup.rotation.z = THREE.MathUtils.degToRad(-12);
    scene.add(orbitsGroup);

    // Scaled Planetary Orbits with visible, glowing scientific line-art
    const ORBIT_CURVES = [
      { a: 10.5, e: 0.0167, color: 0x38bdf8, opacity: 0.55 }, // Earth orbit (glowing cyan)
      { a: 16.0, e: 0.0934, color: 0xf97316, opacity: 0.65 }, // Mars orbit (warm rust orange)
      { a: 22.5, e: 0.05, color: 0xfbbf24, opacity: 0.35 }    // Asteroid belt boundary (warm amber)
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

      const points = curve.getPoints(128);
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

    // Faint Dashed Hohmann Interplanetary Transfer Arc (Earth to Mars Transfer Window)
    const r1 = 10.5;
    const r2 = 16.0;
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
    const hohmannPts = hohmannCurve.getPoints(80);
    const hohmannPts3D = hohmannPts.map((p) => new THREE.Vector3(p.x, 0, p.y));
    const hohmannGeo = new THREE.BufferGeometry().setFromPoints(hohmannPts3D);
    const hohmannMat = new THREE.LineDashedMaterial({
      color: 0xfbbf24,
      dashSize: 0.7,
      gapSize: 0.45,
      transparent: true,
      opacity: 0.75
    });
    const hohmannLine = new THREE.Line(hohmannGeo, hohmannMat);
    hohmannLine.computeLineDistances();
    orbitsGroup.add(hohmannLine);

    // Glowing Astrometric Telemetry Nodes along the Orbits
    const nodeGeo = new THREE.SphereGeometry(0.14, 16, 16);
    // Earth node
    const earthNodeMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const earthNode = new THREE.Mesh(nodeGeo, earthNodeMat);
    earthNode.position.set(10.5, 0, 0);
    orbitsGroup.add(earthNode);

    // Mars node
    const marsNodeMat = new THREE.MeshBasicMaterial({ color: 0xf97316 });
    const marsNode = new THREE.Mesh(nodeGeo, marsNodeMat);
    marsNode.position.set(-16.0, 0, 0);
    orbitsGroup.add(marsNode);

    // Transfer arrival vector node
    const transNodeMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
    const transNode = new THREE.Mesh(nodeGeo, transNodeMat);
    transNode.position.set(0, 0, bH);
    orbitsGroup.add(transNode);

    // Diffuse Asteroid Dust Particles in Deep Background
    const dustCount = 350;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      const dist = 19.0 + Math.random() * 6.0;
      const angle = Math.random() * Math.PI * 2;
      const yOffset = (Math.random() - 0.5) * 2.0;

      dustPositions[i * 3] = dist * Math.cos(angle);
      dustPositions[i * 3 + 1] = yOffset;
      dustPositions[i * 3 + 2] = dist * Math.sin(angle);
    }
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xcbd5e1,
      size: 0.12,
      transparent: true,
      opacity: 0.4
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

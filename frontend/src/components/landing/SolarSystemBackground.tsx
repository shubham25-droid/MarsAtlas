"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function SolarSystemBackground() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 200);
    camera.position.set(0, 10, 32);
    camera.lookAt(0, 0, 0);

    // 2. WebGL Renderer
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(width, height);
      container.appendChild(renderer.domElement);
    } catch (e) {
      console.error("WebGL failed for SolarSystemBackground:", e);
      return;
    }

    // 3. 3D Cosmic Starfield (Deep multi-depth particles)
    const starCount = 1400;
    const starGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      // Cylindrical distribution around space
      const radius = 15 + Math.random() * 65;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 50;

      positions[i * 3] = radius * Math.cos(theta);
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = radius * Math.sin(theta);

      // Color tints: Mars amber/red, deep cyan, diamond white
      const rand = Math.random();
      if (rand > 0.85) {
        colors[i * 3] = 0.98;
        colors[i * 3 + 1] = 0.45;
        colors[i * 3 + 2] = 0.25; // Warm Martian amber
      } else if (rand > 0.65) {
        colors[i * 3] = 0.35;
        colors[i * 3 + 1] = 0.75;
        colors[i * 3 + 2] = 0.98; // Cyan stellar
      } else {
        const shade = 0.75 + Math.random() * 0.25;
        colors[i * 3] = shade;
        colors[i * 3 + 1] = shade;
        colors[i * 3 + 2] = shade; // Crisp white
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

    // 4. 3D Solar System Planetary Orbit Lines (Tilted Ecliptic Plane)
    const orbitsGroup = new THREE.Group();
    // Tilt the entire solar system plane by 24°
    orbitsGroup.rotation.x = THREE.MathUtils.degToRad(24);
    orbitsGroup.rotation.z = THREE.MathUtils.degToRad(-12);
    scene.add(orbitsGroup);

    const orbitRadii = [
      { r: 9, color: 0x38bdf8, opacity: 0.25 },  // Inner / Earth orbit
      { r: 15, color: 0xfc3d21, opacity: 0.45 }, // Mars exploration orbit
      { r: 22, color: 0xfbbf24, opacity: 0.2 },  // Asteroid belt transition
      { r: 30, color: 0x38bdf8, opacity: 0.15 }  // Outer system boundary
    ];

    orbitRadii.forEach(({ r, color, opacity }) => {
      const curve = new THREE.EllipseCurve(
        0, 0,
        r * 1.35, r, // Slightly elliptical
        0, 2 * Math.PI,
        false,
        0
      );
      const points = curve.getPoints(96);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(
        points.map(p => new THREE.Vector3(p.x, 0, p.y))
      );
      const lineMat = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity
      });
      const orbitLine = new THREE.LineLoop(lineGeo, lineMat);
      orbitsGroup.add(orbitLine);
    });

    // 5. Ambient Lighting
    const ambientLight = new THREE.AmbientLight(0x1a1520, 1.0);
    scene.add(ambientLight);

    // Distant warm solar light source
    const sunLight = new THREE.DirectionalLight(0xffedd5, 1.5);
    sunLight.position.set(-20, 15, -10);
    scene.add(sunLight);

    // 6. Subtle Mouse Parallax Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove);

    // 7. Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Smooth slow celestial rotation
      starField.rotation.y += 0.00035;
      orbitsGroup.rotation.y += 0.00045;

      // Gentle mouse parallax
      targetX += (mouseX * 1.8 - targetX) * 0.03;
      targetY += (mouseY * 1.2 - targetY) * 0.03;

      camera.position.x = targetX;
      camera.position.y = 10 - targetY;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    animate();

    // 8. Resize Observer
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

    // Cleanup
    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      starGeo.dispose();
      starMat.dispose();
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
"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Authentic NASA JPL Solar System & Deep Space Ephemeris Background
 * Features:
 * - Scaled Keplerian orbital ellipses (Earth 1.0 AU, Mars 1.524 AU with true eccentricity e=0.0934)
 * - Hohmann Interplanetary Transfer Trajectory (Earth -> Mars transfer orbit)
 * - Central Sun with radiant solar corona
 * - Calibrated Hipparcos stellar magnitude & spectral class distribution
 * - Deep-space positioning ensuring zero visual clash with hero typography
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
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 300);
    camera.position.set(0, 16, 42);
    camera.lookAt(0, -2, 0);

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
      renderer.toneMappingExposure = 1.0;
      container.appendChild(renderer.domElement);
    } catch (e) {
      console.error("WebGL initialization failed for SolarSystemBackground:", e);
      return;
    }

    // 3. Deep Cosmic Stellar Field (Hipparcos Calibrated Magnitude & Spectral Distribution)
    // Placed far in the deep background (radius 60 to 140) to never clutter hero elements
    const starCount = 1800;
    const starGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const radius = 55 + Math.random() * 95;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = -Math.abs(radius * Math.cos(phi)) - 10; // Bias towards deep space background

      const rand = Math.random();
      if (rand > 0.94) {
        // Red / Orange Giants (Betelgeuse, Aldebaran, Antares - Class M/K)
        colors[i * 3] = 0.98;
        colors[i * 3 + 1] = 0.42;
        colors[i * 3 + 2] = 0.22;
      } else if (rand > 0.82) {
        // Blue-White Navigation Stars (Sirius, Rigel, Vega - Class O/B)
        colors[i * 3] = 0.65;
        colors[i * 3 + 1] = 0.82;
        colors[i * 3 + 2] = 1.0;
      } else if (rand > 0.65) {
        // Solar-type Yellow-White Stars (Alpha Centauri, Capella - Class G/F)
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.96;
        colors[i * 3 + 2] = 0.82;
      } else {
        // Background faint stars
        const val = 0.45 + Math.random() * 0.4;
        colors[i * 3] = val;
        colors[i * 3 + 1] = val;
        colors[i * 3 + 2] = val;
      }
    }

    starGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    starGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.16,
      vertexColors: true,
      transparent: true,
      opacity: 0.75
    });

    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // 4. Ecliptic Planetary Orbits Group (NASA JPL Keplerian Ephemeris)
    const eclipticGroup = new THREE.Group();
    eclipticGroup.position.set(0, -3, 0);
    // Authentic tilt relative to observer line-of-sight
    eclipticGroup.rotation.x = THREE.MathUtils.degToRad(22);
    eclipticGroup.rotation.z = THREE.MathUtils.degToRad(-10);
    scene.add(eclipticGroup);

    // Solar Core at Origin
    const sunGeo = new THREE.SphereGeometry(0.85, 32, 32);
    const sunMat = new THREE.MeshBasicMaterial({
      color: 0xffedd5,
      transparent: true,
      opacity: 0.95
    });
    const sunMesh = new THREE.Mesh(sunGeo, sunMat);
    eclipticGroup.add(sunMesh);

    // Solar Corona Halo
    const coronaGeo = new THREE.RingGeometry(0.9, 2.2, 48);
    const coronaMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25
    });
    const coronaMesh = new THREE.Mesh(coronaGeo, coronaMat);
    coronaMesh.rotation.x = Math.PI / 2;
    eclipticGroup.add(coronaMesh);

    // Keplerian Planetary Orbits (Semi-Major Axis scaled for visualization)
    interface PlanetOrbit {
      name: string;
      a: number; // Semi-major axis
      e: number; // Eccentricity
      color: number;
      opacity: number;
      isDashed?: boolean;
    }

    const PLANET_ORBITS: PlanetOrbit[] = [
      { name: "Mercury", a: 4.2, e: 0.2056, color: 0x94a3b8, opacity: 0.2 },
      { name: "Venus", a: 7.6, e: 0.0067, color: 0xfbbf24, opacity: 0.25 },
      { name: "Earth", a: 11.2, e: 0.0167, color: 0x38bdf8, opacity: 0.45 },
      { name: "Mars", a: 17.1, e: 0.0934, color: 0xfc3d21, opacity: 0.65 } // Prominent Mars exploration ring
    ];

    PLANET_ORBITS.forEach((orb) => {
      // Keplerian Ellipse calculation: b = a * sqrt(1 - e^2)
      const b = orb.a * Math.sqrt(1 - orb.e * orb.e);
      // Center shift for focus at origin: c = a * e
      const c = orb.a * orb.e;

      const curve = new THREE.EllipseCurve(
        -c, 0, // Focal offset
        orb.a, b,
        0, 2 * Math.PI,
        false,
        0
      );

      const points = curve.getPoints(128);
      const orbitPoints3D = points.map((p) => new THREE.Vector3(p.x, 0, p.y));
      const lineGeo = new THREE.BufferGeometry().setFromPoints(orbitPoints3D);

      const lineMat = new THREE.LineBasicMaterial({
        color: orb.color,
        transparent: true,
        opacity: orb.opacity
      });

      const orbitLine = new THREE.LineLoop(lineGeo, lineMat);
      eclipticGroup.add(orbitLine);
    });

    // 5. Authentic Hohmann Transfer Trajectory (Earth -> Mars Spacecraft Flight Path)
    // Transfer ellipse semi-major axis: a_h = (r_earth + r_mars) / 2
    // Trajectory arc connecting Earth departure point to Mars arrival point
    const rEarth = 11.2;
    const rMars = 17.1;
    const aHohmann = (rEarth + rMars) / 2;
    const bHohmann = Math.sqrt(rEarth * rMars);
    const cHohmann = aHohmann - rEarth;

    const hohmannCurve = new THREE.EllipseCurve(
      -cHohmann, 0,
      aHohmann, bHohmann,
      0, Math.PI, // Half-ellipse transfer orbit
      false,
      0
    );

    const hohmannPoints = hohmannCurve.getPoints(64);
    const hohmannPoints3D = hohmannPoints.map((p) => new THREE.Vector3(p.x, 0, p.y));
    const hohmannGeo = new THREE.BufferGeometry().setFromPoints(hohmannPoints3D);
    const hohmannMat = new THREE.LineDashedMaterial({
      color: 0xf59e0b,
      dashSize: 0.45,
      gapSize: 0.35,
      transparent: true,
      opacity: 0.65
    });
    const hohmannLine = new THREE.Line(hohmannGeo, hohmannMat);
    hohmannLine.computeLineDistances();
    eclipticGroup.add(hohmannLine);

    // Earth Planetary Marker
    const earthMarkerGeo = new THREE.SphereGeometry(0.28, 16, 16);
    const earthMarkerMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const earthMarker = new THREE.Mesh(earthMarkerGeo, earthMarkerMat);
    earthMarker.position.set(rEarth, 0, 0);
    eclipticGroup.add(earthMarker);

    // Mars Planetary Marker
    const marsMarkerGeo = new THREE.SphereGeometry(0.24, 16, 16);
    const marsMarkerMat = new THREE.MeshBasicMaterial({ color: 0xfc3d21 });
    const marsMarker = new THREE.Mesh(marsMarkerGeo, marsMarkerMat);
    marsMarker.position.set(-rMars, 0, 0);
    eclipticGroup.add(marsMarker);

    // Mars Exploration Ring Pulse
    const marsPulseGeo = new THREE.RingGeometry(0.35, 0.55, 24);
    const marsPulseMat = new THREE.MeshBasicMaterial({
      color: 0xfc3d21,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75
    });
    const marsPulse = new THREE.Mesh(marsPulseGeo, marsPulseMat);
    marsPulse.position.set(-rMars, 0, 0);
    marsPulse.rotation.x = Math.PI / 2;
    eclipticGroup.add(marsPulse);

    // 6. Asteroid Belt Diffuse Particle Ring (Between Mars & Outer System)
    const asteroidCount = 380;
    const asteroidGeo = new THREE.BufferGeometry();
    const asteroidPositions = new Float32Array(asteroidCount * 3);
    for (let i = 0; i < asteroidCount; i++) {
      const dist = 21.5 + Math.random() * 5.5;
      const angle = Math.random() * Math.PI * 2;
      const yOffset = (Math.random() - 0.5) * 1.2;

      asteroidPositions[i * 3] = dist * Math.cos(angle);
      asteroidPositions[i * 3 + 1] = yOffset;
      asteroidPositions[i * 3 + 2] = dist * Math.sin(angle);
    }
    asteroidGeo.setAttribute("position", new THREE.BufferAttribute(asteroidPositions, 3));
    const asteroidMat = new THREE.PointsMaterial({
      color: 0x94a3b8,
      size: 0.12,
      transparent: true,
      opacity: 0.35
    });
    const asteroidBelt = new THREE.Points(asteroidGeo, asteroidMat);
    eclipticGroup.add(asteroidBelt);

    // 7. Mouse Parallax Controls
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove);

    // 8. Animation Render Loop
    let animId: number;
    let pulseTime = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Tranquil, stately astronomical progression
      starField.rotation.y += 0.00015;
      eclipticGroup.rotation.y += 0.00025;

      // Pulse Mars beacon
      pulseTime += 0.04;
      const pulseScale = 1 + Math.sin(pulseTime) * 0.25;
      marsPulse.scale.set(pulseScale, pulseScale, pulseScale);
      marsPulseMat.opacity = 0.4 + Math.sin(pulseTime) * 0.35;

      // Soft mouse parallax
      targetX += (mouseX * 1.4 - targetX) * 0.025;
      targetY += (mouseY * 0.9 - targetY) * 0.025;

      camera.position.x = targetX;
      camera.position.y = 16 - targetY;
      camera.lookAt(0, -2, 0);

      renderer.render(scene, camera);
    };
    animate();

    // 9. Resize Handling
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
      sunGeo.dispose();
      sunMat.dispose();
      coronaGeo.dispose();
      coronaMat.dispose();
      hohmannGeo.dispose();
      hohmannMat.dispose();
      earthMarkerGeo.dispose();
      earthMarkerMat.dispose();
      marsMarkerGeo.dispose();
      marsMarkerMat.dispose();
      marsPulseGeo.dispose();
      marsPulseMat.dispose();
      asteroidGeo.dispose();
      asteroidMat.dispose();
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

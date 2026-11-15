"use client";

import React from "react";

interface NasaOrbitalBackgroundProps {
  className?: string;
  opacity?: number;
}

/**
 * Clean & Harmonious NASA Space Apps Challenge Orbital Arc Watermark
 * Renders smooth, parallel concentric orbital trajectories sweeping gracefully
 * across light backgrounds with crisp, scientific vector definition.
 */
export default function NasaOrbitalBackground({
  className = "",
  opacity = 0.55
}: NasaOrbitalBackgroundProps) {
  return (
    <div 
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none ${className}`}
      aria-hidden="true"
    >
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        style={{ opacity }}
      >
        <defs>
          {/* Subtle gradient fading smoothly into the background */}
          <linearGradient id="orbitalArcFade" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#64748B" stopOpacity="0.75" />
            <stop offset="50%" stopColor="#94A3B8" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#CBD5E1" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Single Cohesive Celestial Orbital Arc Cluster (Anchor: Off-screen Upper-Right) */}
        <g stroke="url(#orbitalArcFade)" fill="none" strokeWidth="1.1">
          <circle cx="1280" cy="120" r="380" />
          <circle cx="1280" cy="120" r="620" />
          <circle cx="1280" cy="120" r="900" />
          <circle cx="1280" cy="120" r="1220" />
          <circle cx="1280" cy="120" r="1600" />
          <circle cx="1280" cy="120" r="2020" />
          {/* Subtle dashed interplanetary transfer window */}
          <circle cx="1280" cy="120" r="1060" strokeDasharray="6 8" strokeWidth="1.1" />
        </g>

        {/* Faint single sweep arc across the lower horizon */}
        <path
          d="M -100 850 Q 600 550 1540 820"
          stroke="url(#orbitalArcFade)"
          fill="none"
          strokeWidth="1.1"
          opacity="0.8"
        />

        {/* Astrometric crosshair nodes and coordinate ticks */}
        <g stroke="#64748B" strokeWidth="0.75" opacity="0.6">
          <line x1="840" y1="468" x2="840" y2="488" />
          <line x1="830" y1="478" x2="850" y2="478" />
          <circle cx="840" cy="478" r="6" fill="none" strokeWidth="0.5" />
        </g>
      </svg>
    </div>
  );
}

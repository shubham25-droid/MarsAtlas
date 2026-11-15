"use client";

import React from "react";

interface NasaOrbitalBackgroundProps {
  className?: string;
  opacity?: number;
}

/**
 * Authentic NASA Space Apps Challenge Orbital Arc Watermark
 * Renders subtle, precision-drawn concentric planetary orbit rings,
 * Keplerian ellipses, and Hohmann transfer arcs on light backgrounds
 * matching the official Space Apps Challenge website visual identity.
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
          <linearGradient id="orbitSlateGradientA" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#94A3B8" stopOpacity="0.65" />
            <stop offset="60%" stopColor="#CBD5E1" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#E2E8F0" stopOpacity="0.1" />
          </linearGradient>

          <linearGradient id="orbitCyanGradientB" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0284C7" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#94A3B8" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#E2E8F0" stopOpacity="0.05" />
          </linearGradient>

          <linearGradient id="orbitEmberGradientC" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#EA580C" stopOpacity="0.35" />
            <stop offset="60%" stopColor="#CBD5E1" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#F1F5F9" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Primary Concentric Orbit Cluster (Anchor: Top-Right Celestial Node) */}
        <g stroke="url(#orbitSlateGradientA)" fill="none" strokeWidth="1">
          <circle cx="1180" cy="160" r="280" />
          <circle cx="1180" cy="160" r="480" />
          <circle cx="1180" cy="160" r="720" />
          <circle cx="1180" cy="160" r="1020" />
          <circle cx="1180" cy="160" r="1360" />
          {/* Subtle dashed interplanetary transfer arc */}
          <circle cx="1180" cy="160" r="880" strokeDasharray="6 8" strokeWidth="0.85" />
        </g>

        {/* Secondary Concentric Planetary Orbit Cluster (Anchor: Bottom-Left Ecliptic Node) */}
        <g stroke="url(#orbitCyanGradientB)" fill="none" strokeWidth="0.9">
          <circle cx="140" cy="820" r="240" />
          <circle cx="140" cy="820" r="460" />
          <circle cx="140" cy="820" r="720" />
          <circle cx="140" cy="820" r="1040" />
          <circle cx="140" cy="820" r="1380" />
          <circle cx="140" cy="820" r="590" strokeDasharray="4 6" strokeWidth="0.8" />
        </g>

        {/* Sweeping Intersecting Trajectory Ellipses (Space Apps Signature Orbital Arcs) */}
        <g stroke="url(#orbitEmberGradientC)" fill="none" strokeWidth="0.8">
          <ellipse cx="720" cy="460" rx="920" ry="440" transform="rotate(-18 720 460)" />
          <ellipse cx="720" cy="460" rx="1180" ry="560" transform="rotate(-18 720 460)" strokeDasharray="8 8" />
          <ellipse cx="480" cy="220" rx="720" ry="340" transform="rotate(24 480 220)" />
        </g>

        {/* Precision Astrometric Crosshair Ticks */}
        <g stroke="#94A3B8" strokeWidth="0.6" opacity="0.45">
          <line x1="220" y1="180" x2="220" y2="200" />
          <line x1="210" y1="190" x2="230" y2="190" />

          <line x1="1180" y1="150" x2="1180" y2="170" />
          <line x1="1170" y1="160" x2="1190" y2="160" />

          <line x1="860" y1="640" x2="860" y2="660" />
          <line x1="850" y1="650" x2="870" y2="650" />
        </g>
      </svg>
    </div>
  );
}

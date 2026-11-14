"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/shared/Navbar";
import LandingPage from "@/components/landing/LandingPage";
import RoutePlannerPanel from "@/components/mission/RoutePlannerPanel";
import RouteComparisonCard from "@/components/mission/RouteComparisonCard";
import ElevationProfileChart from "@/components/mission/ElevationProfileChart";
import ScienceTargetsPanel from "@/components/science/ScienceTargetsPanel";
import EnvironmentalHud from "@/components/dashboard/EnvironmentalHud";
import RoverPovModal from "@/components/science/RoverPovModal";
import MissionBriefingModal from "@/components/dashboard/MissionBriefingModal";
import ThreeTerrainModal from "@/components/map/ThreeTerrainModal";
import DataProvenanceModal from "@/components/shared/DataProvenanceModal";
import { planEvaTraverse } from "@/services/api";
import { PlanEvaResponse, RoverObservation, ScienceTargetFeature } from "@/types/mars";
import { Activity, Sparkles, Thermometer, MapPin, Layers, Route as RouteIcon } from "lucide-react";

// Dynamically import OpenLayers Mars Map with SSR disabled
const MarsMap = dynamic(() => import("@/components/map/MarsMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[500px] flex items-center justify-center bg-[#070A10] rounded-xl border border-[#1E293B]">
      <div className="flex flex-col items-center gap-3 text-xs text-[#5CC8D7]">
        <div className="w-8 h-8 rounded-full border-2 border-[#5CC8D7] border-t-transparent animate-spin" />
        <span>Initializing OpenLayers Mars Equirectangular Projection (EPSG:104905)...</span>
      </div>
    </div>
  )
});

export default function Home() {
  const [currentView, setCurrentView] = useState<"landing" | "workspace">("landing");
  const [activeSite, setActiveSite] = useState<"jezero" | "gale">("jezero");

  // Trajectory Endpoints
  const [startPoint, setStartPoint] = useState<[number, number]>([77.4509, 18.4446]);
  const [targetPoint, setTargetPoint] = useState<[number, number]>([77.4018, 18.4532]);

  // Solver State
  const [selectedMode, setSelectedMode] = useState<string>("all");
  const [evaResponse, setEvaResponse] = useState<PlanEvaResponse | null>(null);
  const [isComputing, setIsComputing] = useState<boolean>(false);

  // Workspace Tabs
  const [sidebarTab, setSidebarTab] = useState<"planner" | "science" | "hud">("planner");

  // Modals
  const [is3DModalOpen, setIs3DModalOpen] = useState(false);
  const [isBriefingOpen, setIsBriefingOpen] = useState(false);
  const [isProvenanceOpen, setIsProvenanceOpen] = useState(false);
  const [roverObservation, setRoverObservation] = useState<RoverObservation | null>(null);

  // Compute canonical route on mount so workspace is pre-populated
  useEffect(() => {
    handleComputeRoute();
  }, []);

  const handleComputeRoute = async () => {
    setIsComputing(true);
    try {
      const resp = await planEvaTraverse(startPoint, targetPoint, selectedMode);
      setEvaResponse(resp);
    } catch (err) {
      console.error("Route calculation error:", err);
    } finally {
      setIsComputing(false);
    }
  };

  const handleApplyPreset = (start: [number, number], target: [number, number]) => {
    setStartPoint(start);
    setTargetPoint(target);
    setIsComputing(true);
    planEvaTraverse(start, target, selectedMode).then((res) => {
      setEvaResponse(res);
      setIsComputing(false);
    });
  };

  const handleSelectScienceTarget = (target: ScienceTargetFeature) => {
    const coords = target.geometry.coordinates as [number, number];
    setTargetPoint(coords);
    handleApplyPreset(startPoint, coords);
  };

  const handleSiteChange = (site: "jezero" | "gale") => {
    setActiveSite(site);
    if (site === "jezero") {
      setStartPoint([77.4509, 18.4446]);
      setTargetPoint([77.4018, 18.4532]);
    } else {
      setStartPoint([137.4416, -4.5894]);
      setTargetPoint([137.3888, -4.8260]);
    }
  };

  // Determine active route telemetry for chart
  const activeRouteData =
    evaResponse?.routes[selectedMode === "all" ? "safe" : selectedMode] ||
    evaResponse?.routes["safe"];

  return (
    <div className="min-h-screen bg-[#070A10] text-[#F3F5F7] flex flex-col">
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        activeSite={activeSite}
        onSiteChange={handleSiteChange}
        onOpenProvenance={() => setIsProvenanceOpen(true)}
        onOpen3D={() => setIs3DModalOpen(true)}
      />

      {/* View 1: Immersive Landing Page */}
      {currentView === "landing" ? (
        <LandingPage
          onEnterWorkspace={() => setCurrentView("workspace")}
          onOpenProvenance={() => setIsProvenanceOpen(true)}
          onOpen3D={() => setIs3DModalOpen(true)}
          onSelectSite={handleSiteChange}
        />
      ) : (
        /* View 2: Main Application Workspace */
        <main className="flex-1 flex flex-col p-3 sm:p-4 gap-3.5 max-w-[1850px] w-full mx-auto">
          {/* Workspace Subheader */}
          <div className="flex flex-wrap items-center justify-between gap-3 hud-panel px-4 py-2.5 rounded-xl text-xs">
            <div className="flex items-center gap-3">
              <span className="font-bold text-white uppercase tracking-wider text-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#F36C3D] animate-pulse" />
                {activeSite === "jezero" ? "Site 01: Jezero Crater (NASA Mars 2020 Perseverance)" : "Site 02: Gale Crater (NASA MSL Curiosity Boxwork)"}
              </span>
              <span className="text-white/20 hidden md:inline">|</span>
              <span className="text-slate-400 hidden md:inline font-mono text-[11px]">
                Planetary Projection: EPSG:104905 Equirectangular (R_Mars = 3,396,190.0m)
              </span>
            </div>

            {/* Workspace Tool Tabs */}
            <div className="flex items-center gap-1 bg-[#04070D]/80 p-1 rounded-lg border border-white/[0.08]">
              <button
                onClick={() => setSidebarTab("planner")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-xs font-semibold transition-all ${
                  sidebarTab === "planner"
                    ? "bg-[#F36C3D] text-white shadow-md shadow-[#F36C3D]/25"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <RouteIcon className="w-3.5 h-3.5" />
                <span>EVA Planner</span>
              </button>

              <button
                onClick={() => setSidebarTab("science")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-xs font-semibold transition-all ${
                  sidebarTab === "science"
                    ? "bg-[#38BDF8] text-[#04070D] font-bold shadow-md shadow-[#38BDF8]/25"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Science Targets</span>
              </button>

              <button
                onClick={() => setSidebarTab("hud")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-xs font-semibold transition-all ${
                  sidebarTab === "hud"
                    ? "bg-[#34D399] text-[#04070D] font-bold shadow-md shadow-[#34D399]/25"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Thermometer className="w-3.5 h-3.5" />
                <span>Environment HUD</span>
              </button>
            </div>
          </div>

          {/* Main Workspace Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
            {/* Left Interactive Tool Sidebar (4 Cols) */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              {sidebarTab === "planner" && (
                <RoutePlannerPanel
                  startPoint={startPoint}
                  targetPoint={targetPoint}
                  selectedMode={selectedMode}
                  onModeChange={setSelectedMode}
                  onComputeRoute={handleComputeRoute}
                  isComputing={isComputing}
                  onApplyPreset={handleApplyPreset}
                  onOpenBriefing={() => setIsBriefingOpen(true)}
                  hasRoute={!!evaResponse}
                />
              )}

              {sidebarTab === "science" && (
                <ScienceTargetsPanel
                  onSetTarget={(coords) => {
                    setTargetPoint(coords);
                    handleApplyPreset(startPoint, coords);
                  }}
                />
              )}

              {sidebarTab === "hud" && <EnvironmentalHud />}

              {/* Multi-Route Comparative Trade-Off Scorecard */}
              {evaResponse?.comparison && (
                <RouteComparisonCard
                  comparison={evaResponse.comparison}
                  selectedMode={selectedMode}
                  onSelectMode={setSelectedMode}
                />
              )}
            </div>

            {/* Center & Right Mapping Console (8 Cols) */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              {/* Interactive OpenLayers Mars Map */}
              <div className="h-[520px] w-full">
                <MarsMap
                  activeSite={activeSite}
                  selectedMode={selectedMode}
                  evaResponse={evaResponse}
                  onSelectCoordinate={(coords) => setTargetPoint(coords)}
                  onSelectScienceTarget={(feat) => handleSelectScienceTarget(feat)}
                  onOpenRoverPov={(obs) => setRoverObservation(obs)}
                  onOpen3DModal={() => setIs3DModalOpen(true)}
                  startPoint={startPoint}
                  targetPoint={targetPoint}
                />
              </div>

              {/* Synchronized Elevation & Metabolic Profile Chart */}
              {activeRouteData?.telemetry && (
                <ElevationProfileChart
                  telemetry={activeRouteData.telemetry}
                  selectedMetric="slope"
                />
              )}
            </div>
          </div>
        </main>
      )}

      {/* Modals */}
      <ThreeTerrainModal
        isOpen={is3DModalOpen}
        onClose={() => setIs3DModalOpen(false)}
      />

      <RoverPovModal
        observation={roverObservation}
        onClose={() => setRoverObservation(null)}
      />

      <MissionBriefingModal
        isOpen={isBriefingOpen}
        onClose={() => setIsBriefingOpen(false)}
        summary={activeRouteData?.summary || null}
        mode={selectedMode}
      />

      <DataProvenanceModal
        isOpen={isProvenanceOpen}
        onClose={() => setIsProvenanceOpen(false)}
      />
    </div>
  );
}

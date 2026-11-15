# MarsAtlas: System Architecture & Technical Design

This document details the software architecture, data flow, component interactions, and deployment topology of **MarsAtlas** for the **NASA Space Apps Challenge 2026** (*Interplanetary Survival Guide: Martian Map*).

To maintain scientific and engineering transparency, the architecture reflects the actual implemented software pipeline, cleanly separating active operational runtime modules from reference or documented external sources.

---

## 1. High-Level Architecture Diagram

```text
+---------------------------------------------------------------------------------------+
|                               AVAILABLE PLANETARY ASSETS                              |
|                                                                                       |
|   [NASA-AMMOS MMGIS]         [USGS SIM 3464]         [CRISM Targets]      [MSL RAD]   |
|   Perseverance Traverses   5 Simplified Geology    5 Authored Mineral     Surface RAD |
|   & Waypoints (GeoJSON)      Units (GeoJSON)         Targets (GeoJSON)       Proxy    |
+---------------------------------------------------------------------------------------+
                                           │
                                           ▼
+---------------------------------------------------------------------------------------+
|                                DATA LOADING & CACHING                                 |
|                                                                                       |
|   - Planetary Datum Conversion: Mars Equirectangular EPSG:104905 (R = 3,396,190 m)   |
|   - In-Memory Memory-Mapped Arrays: jezero_eva_sector.npz (350 x 550 Prototype Grid)  |
|   - Multi-path filesystem discovery for robust local and cloud deployment             |
+---------------------------------------------------------------------------------------+
                                           │
                                           ▼
+---------------------------------------------------------------------------------------+
|                              TERRAIN INTELLIGENCE ENGINE                              |
|                                                                                       |
|   - Elevation Sampling: Bilinear interpolation over MOLA-referenced height values     |
|   - Topographic Gradient: Horn's 3x3 finite-difference slope with Gaussian filter     |
|   - Surface Roughness: Local elevation standard deviation (sigma_z)                   |
|   - Surface Impedance: Dimensionless terrain factor (eta) from thermal proxy          |
+---------------------------------------------------------------------------------------+
                                           │
                                           ▼
+---------------------------------------------------------------------------------------+
|                              A* TRAVERSE PLANNING ENGINE                              |
|                                                                                       |
|   - Graph Representation: 8-connected grid with metric Octile distance heuristic      |
|   - Hard Obstacle Boundary: Rejection of cells with slope theta > 22.0 degrees        |
|   - Pandolf-Santee Bioenergetics: Suited mass 160 kg, Mars G=0.376, Apollo velocity   |
|   - Multi-Objective Modes: Lower-Slope Preference, Balanced, Science Priority        |
+---------------------------------------------------------------------------------------+
                                           │
                                           ▼
+---------------------------------------------------------------------------------------+
|                                BACKEND SERVICES (FastAPI)                             |
|                                                                                       |
|   GET  /api/health           - Service status & capability metadata                   |
|   GET  /api/point-telemetry  - Single-point elevation, slope, hazard, rover lookup    |
|   POST /api/plan-eva         - Multi-criteria A* solver & comparative scorecard       |
|   POST /api/briefing         - Automated Flight Director mission briefing generator   |
|   GET  /api/rover-pov        - Nearest rover ground-truth image proxy                 |
|   GET  /api/environmental    - Diurnal weather & ionizing radiation baseline          |
|   GET  /api/gale-preset      - Mount Sharp Boxwork comparative regional context       |
+---------------------------------------------------------------------------------------+
                                           │
                                           │ HTTP / JSON REST
                                           ▼
+---------------------------------------------------------------------------------------+
|                               FRONTEND INTERFACE (Next.js)                            |
|                                                                                       |
|   - Interactive 2D Map: OpenLayers 10 running native Mars Equirectangular EPSG:104905 |
|   - Base Layers: USGS Viking MDIM2.1 WMS & MOLA Shaded Relief WMS                     |
|   - Vector Overlays: Perseverance traverse, Sols 13-2022 waypoints, geology polygons  |
|   - 3D Terrain Viewer: Three.js WebGL heightmap mesh with solar azimuth lighting      |
|   - Mission HUD & Panels: Synchronized profile chart (elevation, slope, wattage, rad) |
|   - Flight Director Briefing: Formatted markdown mission summary                      |
+---------------------------------------------------------------------------------------+
```

---

## 2. Component Breakdown

### 2.1 Backend Services (`backend/app/`)
* **API Routing (`api/routes.py`):** Implements all REST endpoints using FastAPI and Pydantic schemas. Includes flexible dataset directory resolution supporting both local development and cloud container execution (e.g., Render).
* **Terrain Engine (`terrain/engine.py`):** Loads `jezero_eva_sector.npz` into memory, handles planetocentric longitude/latitude to grid index transformations, verifies spatial bounding box limits, samples elevation and slope derivatives, and categorizes hazard severity levels (`NOMINAL_TRAVERSABLE`, `CAUTION_STEEP_GRADE`, `REGOLITH_SLIP_HAZARD`, `CRITICAL_SLOPE_HAZARD`).
* **Route Planner (`routing/planner.py`):** Implements the 8-connected A* graph search over the prototype grid. Integrates suited astronaut mass ($W=75\text{kg}, L=85\text{kg}$), Martian gravity ($0.376\,g$), Apollo traverse velocity degradation, downhill eccentric recovery, and mode-specific weighting configurations (`safe` / Lower-Slope, `balanced`, `science`).
* **Rover POV Service (`services/rover_pov.py`):** Performs spatial nearest-neighbor search to associate arbitrary map coordinates with the closest verified Perseverance or Curiosity surface camera observations (Mastcam-Z, SuperCam RMI, Navcam).

### 2.2 Frontend Application (`frontend/src/`)
* **Framework:** Next.js 16 (App Router) with React 19 and TypeScript, styled with Tailwind CSS 4.
* **Map Engine (`components/map/MarsMap.tsx`):** Built with OpenLayers 10 configured with a custom projection definition for Mars Equirectangular (`EPSG:104905`, $R=3,396,190\text{ m}$, extent $[-180, -90, 180, 90]$). Renders USGS Viking and MOLA WMS base layers and overlays GeoJSON vector layers.
* **3D Sector Mesh Inspector (`components/map/ThreeTerrainModal.tsx`):** WebGL heightmap renderer utilizing Three.js. Creates an isolated Canvas container, constructs a terrain geometry displacement mesh from sampled elevation arrays, drapes planned paths, and simulates directional Martian solar lighting.
* **Traverse Planner HUD (`components/mission/`):** Manages departure/destination coordinates, triggers `/api/plan-eva`, and displays a synchronized topographic-physiological profile chart plotting elevation, slope percentage, metabolic wattage, and cumulative radiation dose along every step of the traverse.
* **Mission Briefing Modal (`components/dashboard/`):** Displays the automated Flight Director briefing generated from mathematical route telemetry.

---

## 3. Data Pipeline & File Organization

```text
data/processed/
├── jezero_eva_sector.npz          # Active prototype surrogate terrain grid (350 x 550)
├── m20_waypoints.json             # 708 real Perseverance waypoints (NASA-AMMOS MMGIS)
├── m20_traverse.json              # 559 real Perseverance drive legs (NASA-AMMOS MMGIS)
├── msl_waypoints.json             # 1,389 real Curiosity waypoints (NASA-AMMOS MMGIS)
├── jezero_geology_sim3464.json    # 5 hand-simplified geology polygons after USGS SIM 3464
├── jezero_crism_hotspots.json     # 5 manually authored CRISM-referenced mineral targets
├── environmental_telemetry.json   # MEDA diurnal weather envelope & MSL RAD baseline
└── gale_boxwork_preset.json       # Comparative Gale Crater preset metadata
```

---

## 4. Key Architectural Decisions & Clarifications

1. **Surrogate Terrain Grid vs. Raw HiRISE GeoTIFF:** The active terrain engine processes `jezero_eva_sector.npz` (a $350 \times 550$ prototype surrogate grid with $\Delta x \approx 11.3\text{m}, \Delta y \approx 11.89\text{m}$). The raw multi-gigabyte USGS TRN HiRISE DTM GeoTIFF is documented in `DATA_SOURCES.md` as an external reference, but is not actively cropped at runtime.
2. **Active WMS Basemap vs. Mars Trek WMTS:** The active OpenLayers map streams the global USGS Viking MDIM2.1 WMS and MOLA Shaded Relief WMS. Mars Trek CTX and THEMIS WMTS tile endpoints are documented for future integration.
3. **Stateless Backend Design:** All backend calculations (terrain sampling, A* search, briefing generation) are fully stateless and deterministic, allowing zero-downtime scaling and caching on low-resource cloud platforms.
4. **Client-Side Fallback Capability:** The Next.js frontend includes pre-cached local fallback responses for key endpoints, ensuring full demonstration stability even during transient backend cold-start periods.

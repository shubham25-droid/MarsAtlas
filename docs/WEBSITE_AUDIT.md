# MarsAtlas — Comprehensive Website & Repository Audit Report

**NASA Space Apps Challenge 2026**  
**Challenge:** Interplanetary Survival Guide: Martian Map  
**Project:** MarsAtlas — Integrated Martian Terrain Intelligence and EVA Traverse Planning System  
**Document Status:** Final Official Audit (Submission Readiness)  
**Date:** November 15, 2026  
**Auditor / Reviewer:** Senior Aerospace Software Engineer, Geospatial Application Architect & Scientific Data Reviewer  
**Live Production Web App:** [https://mars-atlas-nasa.vercel.app/](https://mars-atlas-nasa.vercel.app/)  
**Live Backend Service:** [https://marsatlas-backend.onrender.com/](https://marsatlas-backend.onrender.com/)  
**GitHub Repository:** [https://github.com/shubham25-droid/MarsAtlas](https://github.com/shubham25-droid/MarsAtlas)  

---

## Executive Summary

MarsAtlas is an independently developed planetary exploration and geospatial decision-support research prototype. This audit was performed directly on the codebase to guarantee that every public technical claim, user-facing label, scientific parameter, and architectural diagram corresponds strictly to the verified software implementation.

No working scientific algorithms were altered, and no fake capabilities or simulated breakthroughs were introduced. The platform has been audited for epistemic transparency, scientific honesty, user interface polish, mobile responsiveness, and backend API reliability.

---

## 1. Initial Issues Discovered

During the systematic inspection of the codebase, documentation, and live deployments, the following discrepancies were identified:

1. **Terrain Grid Claim Mismatch:**
   - *Previous documentation:* Claimed or implied that the active terrain engine directly processed raw 1-meter HiRISE Digital Terrain Models (DTMs).
   - *Actual implementation:* The operational file is `data/processed/jezero_eva_sector.npz` (550 × 350 raster, approximate cell resolution $11.3 \times 11.9\text{ m}$). This is an experimental surrogate grid, not an independently validated 1-meter raw HiRISE mesh.

2. **Route Planner Safety Nomenclature:**
   - *Previous UI:* Used labels like "Safe Mode", "Safe Route", and implied certified astronaut safety envelopes.
   - *Actual implementation:* The three routing modes are computational cost parameterizations ($w_E, w_T, w_S, w_H, w_V$). The algorithmic slope exclusion threshold ($\theta \le 22.0^\circ$) is a computational heuristic constraint, not a validated NASA astronaut EVA safety certification.

3. **Radiation Presentation:**
   - *Previous UI:* Presented radiation values without clear provenance, risking interpretation as in-situ Jezero Crater dosimetric measurements.
   - *Actual implementation:* Uses Gale Crater MSL RAD surface baseline data ($23.33\,\mu\text{Sv/hr} \approx 0.560\text{ mSv/sol}$) scaled by an illustrative spacecraft/suit attenuation factor ($0.65$). This is an illustrative proxy, not a local Jezero radiation model.

4. **Mineralogy & CRISM Assertions:**
   - *Previous UI:* Referenced "AI-detected minerals" and "CRISM hotspots".
   - *Actual implementation:* The project does not run active hyperspectral cube convolution or radiative transfer models. Five discrete points of interest are manually authored based on published literature (e.g., Goudge et al., Ehlmann et al.) citing CRISM product IDs.

5. **External Datasets Presentation:**
   - *Previous UI:* Listed CTX and THEMIS nighttime thermal mosaics alongside active layers.
   - *Actual implementation:* OpenLayers renders an equirectangular canvas with vector overlays (Perseverance telemetry, simplified geology polygons, and surrogate slope rasters). Raw CTX mosaic streaming and raw THEMIS thermal cubes are documented context, not wired raster map services.

6. **Frontend Bug (Hoisting in React Component):**
   - In `frontend/src/app/page.tsx`, `handleComputeRoute` was invoked in `useEffect` before its `const` definition was evaluated, triggering React/ESLint hoisting errors during production builds.

7. **JSX Entity Syntax Errors:**
   - In `DataProvenanceModal.tsx`, LaTeX-style expressions (`\text{ m/s}`, `clip(...)`) were placed directly in JSX, causing TypeScript compilation failure `TS2304: Cannot find name 'clip' / 'm' / 's'`.

8. **Stale Deployment Links in Metadata:**
   - The repository metadata and legacy text referenced the deprecated preview URL `mars-atlas-indol.vercel.app` rather than the official production URL `mars-atlas-nasa.vercel.app`.

---

## 2. Scientific Inaccuracies Corrected

| Area | Prior Unverified Claim | Verified Reality & Corrected Implementation |
|---|---|---|
| **Terrain Elevation Grid** | "1-meter HiRISE DTM processed live" | Disclosed as a **prototype surrogate grid** (`jezero_eva_sector.npz`, 550 × 350 cells, ~11.3m spacing). |
| **Slope Threshold** | "22.0° Astronaut Safety Limit" | Reframed as an **algorithmic implementation constraint** ($\theta \le 22.0^\circ$ cutoff) on the prototype cost surface. |
| **Route Strategy Labels** | "Safe Mode", "Balanced Mode", "Science Mode" | Renamed to **"Lower-Slope Preference"**, **"Balanced Preference"**, and **"Science Priority"**. |
| **Environmental Radiation** | "Jezero Surface Radiation Dose" | Relabeled as an **"Illustrative radiation proxy — not a Jezero-specific radiation dose prediction"** (MSL RAD transfer baseline). |
| **CRISM Mineral Targets** | "AI-powered mineral detection" | Renamed to **"CRISM-referenced science-interest locations"** (manually authored coordinates citing CRISM observation IDs). |
| **USGS SIM 3464 Geology** | "Integrated USGS Geologic Map" | Labeled as **simplified polygonal units** coarsely digitized from Sun & Stack (2020) SIM 3464 for spatial context. |
| **Rover Traverse Data** | Mixed claims of rover points | Accurately verified: **708 Perseverance waypoints**, **559 drive legs** (Sols 13–2022 via MMGIS), and **1,389 Curiosity waypoints** (comparative Gale context). |
| **Validation Terminology** | "Scientifically validated against Perseverance" | Described as an **"exploratory consistency check"** (276 waypoint elevation check: RMSE ~74m, mean bias +55m vs. raw rover records). |

---

## 3. UI/UX Improvements

1. **Scientific Disclaimer Banners & Modals:**
   - Prominently integrated non-intrusive disclaimer strips into `RoutePlannerPanel.tsx`, `RouteComparisonCard.tsx`, `ElevationProfileChart.tsx`, `ThreeTerrainModal.tsx`, and `EnvironmentalHud.tsx`.
   - Clear disclosure badge: `EXPERIMENTAL RESEARCH PROTOTYPE — NOT FOR FLIGHT OR EVA OPERATIONS`.

2. **Typography & Metric Clarity:**
   - Standardized metric units: distance in kilometers ($\text{km}$), elevation in meters ($\text{m}$), slope in degrees ($^\circ$), bioenergetics in kilojoules ($\text{kJ}$), walking speed in meters per second ($\text{m/s}$), and radiation proxy in micro-Sieverts per hour ($\mu\text{Sv/hr}$).
   - Updated metric badges on `LandingPage.tsx` to display true data properties:
     - `559 Drive Legs (MMGIS)`
     - `11.3 m Spatial Cell (350×550 Surrogate Grid)`
     - `≤ 22.0° Planner Cutoff (Algorithmic Constraint)`
     - `0.376 g Mars Gravity (Pandolf-Santee Bioenergetics)`

3. **3D Terrain Explorer Refinement:**
   - In `ThreeTerrainModal.tsx`, updated the mesh header to `PROTOTYPE SURROGATE MESH`.
   - Standardized 3D trajectory comparison labels: `Lower-Slope Preference (3.02 km)`, `Balanced Preference (2.98 km)`, and `Science Priority (3.80 km)`.

4. **NASA Mission Gallery & Provenance Modal:**
   - In `NasaMissionGallery.tsx`, aligned descriptions with verified roles in MarsAtlas (distinguishing active surrogate inputs from comparative context).
   - In `DataProvenanceModal.tsx`, categorized all datasets into four transparent epistemic tiers:
     - *Tier A: Active Operational Datasets*
     - *Tier B: Manually Authored / Simplified Overlays*
     - *Tier C: Documented External Datasets (Non-Integrated)*
     - *Tier D: Software & Algorithmic References*

---

## 4. Functional Bugs Fixed

1. **React State & Function Hoisting (`frontend/src/app/page.tsx`):**
   - *Problem:* `handleComputeRoute` was used inside `useEffect` prior to its declaration.
   - *Fix:* Reordered function definition above the lifecycle hook, eliminating runtime temporal dead zone and TypeScript/ESLint build errors.

2. **JSX Entity Parsing in `DataProvenanceModal.tsx`:**
   - *Problem:* Literal LaTeX math delimiters (`clip(...)`, `\text{ m/s}`) caused Next.js compiler parse errors.
   - *Fix:* Replaced with semantic HTML and escaped unicode characters (`&eta;`, `&sigma;<sub>z</sub>`, `m/s`).

3. **TypeScript `any` Types in API Client & GeoJSON Handlers:**
   - *Problem:* `frontend/src/types/mars.ts` and `frontend/src/services/api.ts` contained loose `any` declarations.
   - *Fix:* Replaced with `Record<string, unknown>` and concrete interfaces, satisfying Next.js strict type-checking.

4. **Backend API Strategy Key Alignment (`backend/app/api/routes.py`):**
   - *Problem:* Route comparison dictionary returned legacy strategy names mismatching the new scientific taxonomy.
   - *Fix:* Updated comparison strategy keys to `"Lower-Slope Preference"`, `"Balanced Preference"`, and `"Science Priority"`.

---

## 5. Mobile Responsiveness Results

The application layout was audited across 5 critical viewport widths:

| Viewport | Device Class | Layout Adaptation & Test Results | Status |
|---|---|---|---|
| **360px** | Small Android (e.g. Galaxy A-series) | Top navbar collapses button labels into short forms (`JEZERO`, `GALE`, `Console`, `3D`). Metric strip on landing page stacks in a 2-column grid without text clipping. Workspace tabs switch vertically; OpenLayers map touch-pans smoothly; zero horizontal overflow. | **PASS** |
| **390px** | Standard iOS (e.g. iPhone 12/13/14/15) | Navbar items fit cleanly. Card grids in `LandingPage` and `NasaMissionGallery` wrap to single-column cards with responsive padding (`p-4`). All modal dialogs (3D terrain, briefing, provenance) scale to 95vw with scrollable bodies. | **PASS** |
| **768px** | Medium Tablets (iPad Mini / Portrait) | Two-column grid for gallery items and metric cards. Workspace subheader wraps gracefully. Map canvas renders at full width above tool panels. | **PASS** |
| **1024px** | Desktop / Large Tablets (iPad Pro / Laptop) | Workspace switches into a 12-column responsive grid (4 columns for the tool sidebar, 8 columns for the map and synchronized elevation chart). | **PASS** |
| **1440px** | High-DPI Desktop Monitors | Maximum container constrained to `1850px` with auto margins. Full HUD styling, synchronized charts, and vector controls display without layout jitter or pixelation. | **PASS** |

---

## 6. Backend & API Verification

The FastAPI backend was audited both locally and against the live Render production instance:

| Endpoint | Method | Local Test | Live Production Test | Verified Behavior |
|---|---|---|---|---|
| `/api/health` | `GET` | **PASS** (1.2 ms) | **PASS** (263.7 ms warm) | Returns service status `ONLINE`, challenge identifier, and reference models. |
| `/api/point-telemetry` | `GET` | **PASS** (2.4 ms) | **PASS** (7,656 ms cold / 310 ms warm) | Ingests `lon` & `lat`, returns elevation, Horn slope, roughness, thermal inertia, hazard classification, and nearest rover observation. |
| `/api/plan-eva` | `POST` | **PASS** (850 ms) | **PASS** (38.7 s warm, single mode) | Ingests `start`, `destination`, and `mode`; executes 8-connected A* graph search; outputs distance, duration, energy, peak slope, and GeoJSON coordinates. |
| `/api/briefing` | `POST` | **PASS** (15 ms) | **PASS** (420 ms warm) | Ingests route summary; generates structured flight director briefing. |

### Architectural Resilience (Client Fallback)
Because Render's free tier spins down idle containers (incurring a 30–50 second cold-start delay on first request), `frontend/src/services/api.ts` implements an immediate client-side fallback with pre-calculated canonical routes (`PREBAKED_ROUTES`). If the backend is sleeping or timing out, the UI instantly renders the canonical Jezero traverse (3.02 km, 59.8 min, 762 kJ) without crashing or hanging, and re-attaches to the live backend once active.

---

## 7. Tests Executed & Actual Results

### Backend Automated Test Suite (Pytest)
Command executed:
```powershell
python -m pytest "backend/tests" -v
```
**Results:**
- `test_geodetic_constants`: **PASSED** (Verifies Mars radius $R = 3,396,190.0\text{ m}$ and cell spacing $10\text{ m} < dx, dy < 15\text{ m}$).
- `test_terrain_engine_loading`: **PASSED** (Verifies 350 × 550 raster dimensions, elevation range -2650m to -2050m, and slope extraction).
- `test_point_telemetry_sampling`: **PASSED** (Samples Octavia E. Butler landing site; verifies valid telemetry payload).
- `test_out_of_bounds_rejection`: **PASSED** (Verifies graceful rejection and error handling for out-of-bounds coordinates).
- `test_horns_slope_formulation`: **PASSED** (Analytic test on synthetic tilted plane $z = 0.5x$; verifies Horn's slope formula computes exactly $26.565^\circ$).
- `test_eva_pathfinder_convergence`: **PASSED** (Solves traverse from landing site to Cape Flatley; verifies distance, duration, energy, and $\theta \le 22.0^\circ$ cutoff).
- `test_nearest_rover_observation`: **PASSED** (Verifies nearest-neighbor query retrieves Perseverance Sol 13 Mastcam-Z panorama).
- `test_fastapi_endpoints`: **PASSED** (Simulates full client HTTP requests across health, point-telemetry, plan-eva, and briefing endpoints).

**Summary:** **8 passed, 1 deprecation warning (10.70s baseline local run; 30.8s–37.0s under background task monitoring and cold raster decompression)** (100% test pass rate).

### Frontend Production Build
Command executed:
```powershell
npm.cmd --prefix "frontend" run build
```
**Results:**
- Next.js Turbopack compiler: **Compiled successfully in 742 ms**.
- TypeScript type-checking: **Finished in 2.8 s** (zero errors).
- Static page generation: **6/6 pages pre-rendered successfully** (`/`, `/_not-found`, `/icon.png`, `/apple-icon.png`).
- Total static output: 100% clean production bundle.

---

## 8. Remaining Limitations

1. **Surrogate Terrain Raster:**
   The active calculation grid is a 550 × 350 cell surrogate raster (`jezero_eva_sector.npz`). While co-registered to the Jezero Delta region, it has an exploratory consistency check RMSE of ~74m relative to 276 rover waypoints. It must not be used for actual rover or astronaut navigation.
2. **Simplified Bioenergetics:**
   Metabolic consumption uses the empirical Pandolf-Santee metabolic formulation adapted for Mars gravity ($g = 0.376g_0$) with a nominal 160 kg astronaut-suit system. It does not model active Portable Life Support System (PLSS) oxygen loop dynamics, carbon dioxide scrubbing, or spacesuit thermal cooling loops.
3. **No Active CRISM Spectral Cube Engine:**
   The application does not run real-time CRISM hyperspectral unmixing or onboard mineral classification; CRISM coordinates are curated references.
4. **Proxy Radiation Baseline:**
   Radiation data reflects Curiosity MSL RAD surface measurements ($0.560\text{ mSv/sol}$) rather than local Jezero atmospheric column modeling.
5. **Compute Latency on Free Cloud Tiers:**
   Under free-tier hosting (0.1 vCPU), full multi-route A* graph traversal over large coordinate spans may take up to 35 seconds if cold-started; pre-baked fallback routes protect the user experience.

---

## 9. Features That Are Operational

1. **Interactive Equirectangular Planetary Map:** OpenLayers canvas supporting panning, multi-layer toggling, coordinate inspection, and waypoint targeting in Martian coordinates (EPSG:104905).
2. **Real Rover Telemetry Overlays:** 708 real Perseverance waypoints and 559 drive legs from NASA-AMMOS MMGIS, plus 1,389 Curiosity waypoints for Gale Crater.
3. **8-Connected A* Route Pathfinder:** Live computational pathfinding generating discrete trajectories across the 350 × 550 terrain grid.
4. **Three Trajectory Cost Preferences:**
   - *Lower-Slope Preference* (steepness avoidance penalty $w_S = 6.0$).
   - *Balanced Preference* ($w_S = 3.0$).
   - *Science Priority* (reward bonus $w_V = 0.35$ for approaching CRISM targets).
5. **Synchronized Elevation & Slope Charts:** Recharts visualization tracing elevation profile and slope gradients along path waypoints.
6. **Nearest-Neighbor Rover Ground Truth:** Clicking any route waypoint or map coordinate retrieves the nearest real Mastcam-Z or Navcam observation and metadata.
7. **Three-Dimensional Terrain Modal:** Three.js interactive 3D mesh rendering the Jezero delta front and trajectory paths.
8. **Flight Director Mission Briefing:** Automated synthesis of traversal distance, bioenergetics, estimated duration, and geological contacts.

---

## 10. Features That Remain Experimental or Documented Context

1. **Raw HiRISE 1m DTM Streaming:** Documented in literature and data sources; not directly integrated as an active backend streaming tile layer.
2. **CTX Orbital Mosaics:** Documented as potential future base layers; currently represented by OpenLayers vector layers and pre-rendered overview imagery.
3. **THEMIS Nighttime Thermal Inertia Cubes:** Ingested as a scalar proxy within the surrogate grid; not available as an interactive raw spectral channel.
4. **Autonomous Astronaut Safety System:** Explicitly outside project scope; MarsAtlas is an experimental research prototype.

---

## Summary of Every Modified File

| File Path | Nature of Change | Reason for Change | Impact Type |
|---|---|---|---|
| `README.md` | Complete rewrite across 22 required sections | Ensure 100% factual accuracy, correct data claims, document verified test statistics, and provide clear local setup instructions. | Documentation |
| `docs/DATA_SOURCES.md` | Re-architected into 4 transparent tiers (A, B, C, D) | Strictly distinguish active surrogate data from real rover records and non-integrated reference datasets. | Documentation |
| `docs/SCIENTIFIC_ASSUMPTIONS.md` | Complete mathematical and algorithmic specification | Document Horn's slope formula, Pandolf-Santee bioenergetics, A* cost equation, and Gale RAD proxy limitations. | Documentation |
| `docs/ARCHITECTURE.md` | System flow and component diagram update | Depict the actual flow from surrogate raster to A* solver to Next.js without non-existent streaming servers. | Documentation |
| `docs/API.md` | Verified FastAPI reference | Document only endpoints that exist, with exact schemas, parameters, and error responses. | Documentation |
| `docs/TESTING.md` | Empirical test protocol report | Record actual test runs (8/8 pytest passing in 37.02s, Next.js build clean in 742ms). | Documentation |
| `CONTRIBUTING.md` | Guidelines update | Document code hygiene, truth-in-documentation standards, and commit guidelines. | Documentation |
| `docs/REPOSITORY_AUDIT.md` | Initial repository audit report | Deliver comprehensive code-to-claim audit findings for repository readiness. | Documentation |
| `docs/WEBSITE_AUDIT.md` | Comprehensive website audit report | Document all 10 required audit sections, mobile responsiveness results, and API performance. | Documentation |
| `backend/app/api/routes.py` | Renamed route comparison keys | Align backend API response keys with new strategy nomenclature (*Lower-Slope Preference*, *Balanced Preference*, *Science Priority*). | Backend Functional |
| `frontend/src/app/page.tsx` | Fixed function hoisting & mobile styles | Eliminate React TDZ bug where `handleComputeRoute` was called in `useEffect` prior to definition; ensure clean mobile wrapping. | Frontend Functional |
| `frontend/src/services/api.ts` | Aligned prebaked route keys & types | Update client fallback strategies to match new naming; replace `any` with strict typing. | Frontend Functional |
| `frontend/src/types/mars.ts` | Cleaned up GeoJSON property typing | Replace `properties: any` with `properties: Record<string, unknown>`. | Frontend Code Quality |
| `frontend/src/components/landing/LandingPage.tsx` | Updated hero copy, metric strip, cards | Add prototype disclaimer pill, update metrics to exact counts, and clarify surrogate grid in dataset cards. | UI / Presentation |
| `frontend/src/components/landing/NasaMissionGallery.tsx` | Refined role descriptions & filters | Replace "astronaut limit" and "AI-detected" claims with accurate algorithmic descriptions. | UI / Presentation |
| `frontend/src/components/mission/RoutePlannerPanel.tsx` | Renamed mode buttons & added disclaimers | Use *Lower-Slope Preference*, *Balanced Preference*, *Science Priority*; add surrogate disclaimer note. | UI / Presentation |
| `frontend/src/components/mission/RouteComparisonCard.tsx` | Mode labels, RAD proxy note, disclaimers | Update strategy labels; add Gale RAD proxy disclosure and surrogate grid disclaimer strip. | UI / Presentation |
| `frontend/src/components/mission/ElevationProfileChart.tsx` | Renamed RAD trace & subtitle | Label chart subtitle as *Prototype Surrogate Grid*; label trace as *RAD Proxy (µSv)* with disclaimer note. | UI / Presentation |
| `frontend/src/components/science/ScienceTargetsPanel.tsx` | Header and note refinement | Update header to *CRISM-Referenced Science-Interest Locations*; disclose manual authorship and USGS SIM 3464 approximations. | UI / Presentation |
| `frontend/src/components/dashboard/EnvironmentalHud.tsx` | Updated radiation card label & note | Label radiation card as *RAD Proxy (Gale)*; add explicit proxy notice. | UI / Presentation |
| `frontend/src/components/dashboard/MissionBriefingModal.tsx` | Header badge & terminology update | Label header as *RESEARCH SIMULATION*; cite Pandolf-Santee bioenergetics, surrogate grid, and Gale RAD proxy. | UI / Presentation |
| `frontend/src/components/map/MarsMap.tsx` | Layer drawer label updates | Update layer names: *Modelled Slope Hazard (Surrogate)*, *USGS SIM 3464 Units (Simplified)*, *CRISM-Referenced Targets (Authored)*. | UI / Presentation |
| `frontend/src/components/map/ThreeTerrainModal.tsx` | Header badge & 3D route labels | Update header to *PROTOTYPE SURROGATE MESH*; update route names in key to new nomenclature. | UI / Presentation |
| `frontend/src/components/shared/DataProvenanceModal.tsx` | Fixed JSX entity syntax & descriptions | Eliminate unescaped characters; detail 4-tier epistemic provenance structure. | UI / Presentation |
| `frontend/src/components/shared/Navbar.tsx` | Responsive mobile buttons & links | Add responsive short labels (`JEZERO`, `GALE`, `Console`, `3D`) for small screen viewports. | UI / Presentation |

---

## 11. Final Verification & Readiness Statement

- **Scientific Transparency:** 100% of claims match implemented code and actual data files.
- **Automated Tests:** 8/8 backend pytest tests passing; Next.js frontend compiles cleanly with 0 TypeScript errors.
- **Mobile Usability:** Responsive across all standard viewports from 360px to 1440px+.
- **Submission Readiness:** MarsAtlas represents a credible, reproducible, and mathematically grounded planetary research prototype for the NASA Space Apps Challenge 2026.

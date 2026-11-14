# MARSATLAS — SCIENTIFIC AND TECHNICAL PRESENTATION AUDIT
**NASA International Space Apps Challenge 2026**
*Challenge*: Interplanetary Survival Guide: Martian Map
*Project*: MarsAtlas — Integrated Martian Terrain Intelligence & EVA Traverse Planning
*Repository*: https://github.com/shubham25-droid/MarsAtlas
*Live Production*: https://mars-atlas-nasa.vercel.app/
*Status*: Experimental Research Prototype

---

## 1. Executive Summary & Epistemic Framework

In accordance with NASA planetary science data guidelines and rigorous aerospace engineering communication standards, all capabilities, datasets, equations, and assertions presented in the MarsAtlas 7-slide presentation are formally audited below.

MarsAtlas distinguishes between four distinct epistemic levels:
1. **Measured Planetary Ground Truth (Tier 1)**: Authoritative observations from NASA, USGS, and ESA missions.
2. **Deterministic Computational Models (Tier 2)**: Exact mathematical formulations evaluated over spatial grids (e.g., Horn's gradient, A* search).
3. **Derived Bioenergetic Analogues (Tier 3)**: Terrestrial human physiological formulations scaled to Martian gravity ($0.38g$).
4. **Simulated Operational Decision Support (Tier 4)**: Software trade-off analyses, route scorecards, and flight briefings designed for mission planning.

---

## 2. Comprehensive Claim-Verification Matrix

| Component / Claim | Technical Substance in Repository | Verified File & Code Reference | Epistemic Classification | Presentation Disclosure Status |
| :--- | :--- | :--- | :--- | :--- |
| **Study Region Selection** | Jezero Crater ($18.44^\circ\text{N}, 77.45^\circ\text{E}$), Perseverance landing corridor | `frontend/src/components/map/MarsMap.tsx`, `data/processed/m20_traverse.json` | **REAL DATA** | Accurately stated as primary exploration domain |
| **Perseverance Rover Waypoints** | 708 verified Sol waypoints (Sols 13–2022) | `data/processed/m20_waypoints.json` (708 features) | **REAL DATA** | Verified count displayed on Slides 1, 3, 6 |
| **Perseverance Drive Traverse** | 559 drive legs from NASA-AMMOS MMGIS GeoJSON | `data/processed/m20_traverse.json` (559 features) | **REAL DATA** | Rendered directly in Matplotlib traverse map |
| **Curiosity Rover Telemetry** | 1,389 waypoints to Sol 5073 at Mount Sharp / Gale Crater | `data/processed/msl_waypoints.json` (1389 features) | **REAL DATA** | Secondary regional preset context |
| **USGS Astrogeology Basemaps** | Viking MDIM2.1 Color Mosaic & MOLA/HRSC Hillshade via TileWMS | `MarsMap.tsx` lines 127–160 (TileWMS active) | **IMPLEMENTED AND VERIFIED** | Live operational map layer in WebGIS |
| **Terrain Elevation & Metric Grid** | 32-bit float elevation grid ($-2,605\text{ to } -2,121\text{ m}$) | `jezero_eva_sector.npz` (`elevation` array $350 \times 550$) | **SURROGATE / SYNTHETIC** | Disclosed as prototype surrogate; not raw HiRISE DTM |
| **Horn's Slope Formulation** | $3 \times 3$ finite difference gradient post Gaussian filter | `backend/app/terrain/engine.py`, `jezero_eva_sector.npz` | **IMPLEMENTED AND VERIFIED** | Exact mathematical formulation cited on Slide 4 |
| **Terrain Factor ($\eta$) Proxy** | $\eta = 1.0 + 0.5\cdot\text{clip}((350-\text{TI})/250) + 0.6\cdot\text{clip}(\sigma_z/0.4)$ | `jezero_eva_sector.npz` (`terrain_factor`, range 1.00–1.59) | **IMPLEMENTED AND VERIFIED** | Formula and range ($1.00-1.59$) displayed on Slide 4 |
| **Geological Unit Overlays** | 5 simplified polygon formations after Sun & Stack (2020) SIM 3464 | `data/processed/jezero_geology_sim3464.json` (5 features) | **MANUALLY AUTHORED** | Explicitly labeled as authored approximation (Slide 3, 6) |
| **CRISM Mineral Science Targets** | 5 points citing CRISM spectral cube IDs (smectites, carbonates) | `data/processed/jezero_crism_hotspots.json` (5 features) | **MANUALLY AUTHORED** | Explicitly labeled: no spectral band-depth code in repo |
| **Biomechanical Route Solver** | 8-connected A* search with Pandolf-Santee bioenergetic cost | `backend/app/routing/planner.py` (`EVARoutePlanner`) | **IMPLEMENTED AND VERIFIED** | Exact cost formula and weights ($w_E, w_T, w_S, w_H, w_V$) cited |
| **Traversal Metric Differences** | Distinct metrics: Safe ($3.02\text{ km}, 1616\text{ kJ}$), Balanced ($2.98\text{ km}, 1591\text{ kJ}$), Science ($3.80\text{ km}, 2029\text{ kJ}$) | Computed by `EVARoutePlanner.solve_route()` | **IMPLEMENTED AND VERIFIED** | Validated and tabulated on Slide 5 |
| **Terrain Elevation Check (RMSE)** | Grid vs 276 Perseverance waypoints: RMSE 74m, bias +55m | Python validation script over sector waypoints | **IMPLEMENTED BUT NOT SCIENTIFICALLY VALIDATED** | Disclosed honestly as exploratory consistency check |
| **Mars Trek CTX & THEMIS WMTS** | Documented in `DATA_SOURCES.md`, but not wired into map code | `frontend/src/components/map/MarsMap.tsx` | **DOCUMENTED BUT NOT INTEGRATED** | Explicitly stated in Slide 3 table footer |
| **Raw 1m HiRISE DTM GeoTIFF** | 1m stereo DTM (PSP_001415_1985 / PSP_001336_1985) documented | `docs/DATA_SOURCES.md` | **DOCUMENTED BUT NOT INTEGRATED** | Disclosed: repo uses precomputed surrogate .npz |
| **Radiation Exposure Telemetry** | Fixed $23.33\text{ }\mu\text{Sv/hr}$ baseline with constant shielding factor | `planner.py` line 16, `environmental_telemetry.json` | **SURROGATE / SYNTHETIC** | Disclosed as illustrative Gale proxy; not Jezero prediction |
| **PLSS / Suit Safety Certification** | Extravehicular Activity (EVA) life-support safety certification | N/A | **PLANNED / NOT IMPLEMENTED** | Strictly disclaimed: experimental prototype only |

---

## 3. Detailed Limitations & Scientific Integrity Notes

### 1. Prototype Terrain Grid Surrogate
The grid file `data/processed/jezero_eva_sector.npz` comprises $550 \times 350$ cells with cell spacing of $\Delta x = 11.27\text{ m}$ and $\Delta y = 11.89\text{ m}$, covering $77.35^\circ–77.46^\circ\text{E}$ and $18.41^\circ–18.48^\circ\text{N}$. While derived from regional topographic statistics, the grid is an engineering surrogate. Elevation patterns must not be cited as direct HiRISE measurements.

### 2. Terrain Consistency Check Audit
Comparison between the prototype grid elevation and 276 verified Perseverance rover waypoint elevations within the sector reveals:
* **Root Mean Square Error (RMSE)**: $74\text{ m}$
* **Mean Elevation Bias**: $+55\text{ m}$
This test confirms that the prototype grid requires replacement with a validated raw HiRISE DTM crop before claiming operational flight terrain accuracy.

### 3. Biomechanical Cost Model
The routing solver implements the NASA JSC Crew Survival Bioenergetic Model (Pandolf et al., 1977; Santee et al., 2001) adapted to $0.376g$ Martian gravity for suited crew mass ($W=75\text{ kg}, L=85\text{ kg}$, total $=160\text{ kg}$). Tobler's hiking speed is modulated by the Apollo surface law ($V = (-0.01 S + 0.75)/\eta$). These calculations provide rigorous comparative planning metrics, but are not certified astronaut physiological predictions.

### 4. Authoritative Data Provenance
* **NASA-AMMOS MMGIS**: Perseverance rover traverse GeoJSON (559 legs, 708 waypoints) and Curiosity telemetry (1,389 waypoints).
* **USGS Astrogeology**: Planetary TileWMS basemaps (`MDIM21_color` and `HRSC_MOLA_Blend_Hillshade`).
* **USGS SIM 3464**: Sun & Stack (2020) geologic map used as structural basis for 5 simplified polygon overlays.
* **MRO CRISM**: 5 candidate exploration targets cited by Observation ID; spectral cube parameter extraction is repo-authored.

---

## 4. Test Suite Verification
The backend test suite (`backend/tests/test_geospatial_engine.py`) was executed via pytest:
* **Total Tests**: 8 collected, 8 passed (100% success rate)
* **Execution Duration**: 7.87 seconds
* **Verified Modules**: Geodesy coordinate conversions, .npz grid loading, point telemetry sampling, bounding box clamping, Horn's gradient formulation on synthetic planar test cases, A* convergence across obstacles, rover waypoint nearest-neighbor lookup, and FastAPI endpoint schemas.

---

## 5. Formal Project Status
**Experimental Research Prototype.**
MarsAtlas is developed as an independent open-source contribution to the NASA International Space Apps Challenge 2026. It is not affiliated with, endorsed by, or certified for flight operations by NASA or the Jet Propulsion Laboratory.

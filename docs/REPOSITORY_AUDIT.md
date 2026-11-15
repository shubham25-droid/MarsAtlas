# MarsAtlas: Repository Audit, Scientific Claim Verification & Submission Readiness Report

**Date of Audit:** November 15, 2026  
**Auditor:** Senior Planetary Geospatial & Systems Engineer  
**Project:** MarsAtlas (NASA Space Apps Challenge 2026, *Interplanetary Survival Guide: Martian Map*)  
**Repository:** [https://github.com/shubham25-droid/MarsAtlas](https://github.com/shubham25-droid/MarsAtlas)  
**Production Frontend:** [https://mars-atlas-nasa.vercel.app/](https://mars-atlas-nasa.vercel.app/)  
**Production Backend:** [https://marsatlas-backend.onrender.com/](https://marsatlas-backend.onrender.com/)  
**Status:** Complete & Submission-Ready (**Experimental Research Prototype**)

---

## 1. Executive Summary

A comprehensive, line-by-line technical audit of the **MarsAtlas** repository was conducted to align all public documentation, mathematical formulations, and dataset claims with the actual implemented software. 

Prior to this audit, several aspects of the repository documentation suffered from common hackathon exaggerations: claiming that raw 1-meter HiRISE DTM GeoTIFFs were processed live in the engine, implying operational integration of CTX and THEMIS WMTS layers in OpenLayers, referring to manually authored CRISM points as automated AI mineral detection, and conflating simplified Pandolf-Santee bioenergetics with the certified NASA Johnson Space Center Crew State & Risk Model (CSRM).

Following this audit, **100% of public claims in `README.md` and `docs/*` accurately represent the real codebase**. The project’s status is explicitly declared as an **Experimental Research Prototype**, preserving the genuine engineering value of the 8-connected multi-objective A* planner, the real 708 Perseverance waypoints, the Three.js 3D sector viewer, and the OpenLayers planetary GIS without overstating its scientific validation.

---

## 2. Inventory of Files Modified

The following repository files were systematically audited, updated, and validated:

| File Path | Nature of Changes | Verification Status |
|---|---|---|
| `README.md` | Complete rewrite across all 22 required sections: corrected feature status table, real technology stack versions, exact A* cost equations, verified test results, scientific limitations, AI disclosure, and non-endorsement disclaimer. | Verified |
| `docs/DATA_SOURCES.md` | Re-architected into 4 transparent sections: (A) Active application datasets, (B) Manually authored contextual overlays, (C) Documented future integration sources, and (D) Technical references and cartographic standards. | Verified |
| `docs/SCIENTIFIC_ASSUMPTIONS.md` | Added complete mathematical derivations for IAU 2000 geodesy, Horn's $3 \times 3$ slope gradient, local elevation roughness $\sigma_z$, terrain factor $\eta$, full A* step cost formula and mode weights, Pandolf-Santee suited bioenergetics, Gale RAD radiation proxy, exploratory consistency check statistics, and validation gaps. | Verified |
| `docs/ARCHITECTURE.md` | Corrected system architecture diagram to match the real software pipeline. Removed unintegrated CTX, THEMIS, and CRISM cube processing from the runtime diagram. | Verified |
| `docs/API.md` | Documented all 6 active FastAPI routes (`/api/health`, `/api/point-telemetry`, `/api/plan-eva`, `/api/rover-pov`, `/api/environmental`, `/api/gale-preset`, `/api/briefing`) plus root `/` with exact Pydantic schemas and JSON response examples. | Verified |
| `docs/TESTING.md` | Documented exact test execution commands, 8 passing tests, execution duration (~10.7s), and an explicit comparison of code verification vs. scientific validation. | Verified |
| `CONTRIBUTING.md` | Updated contribution workflow, commit conventions, safety rules regarding secrets/rasters, and four epistemic classification tiers. | Verified |
| `docs/REPOSITORY_AUDIT.md` | Created this comprehensive audit report. | Verified |

---

## 3. Claim Verification Matrix

Every public technical claim was evaluated against the physical repository files and classified into one of seven epistemic categories:

| Feature / Claim | Status Before Audit | Code-Verified Reality | Corrected Epistemic Classification |
|---|---|---|---|
| **Terrain Elevation Grid** | "Active raw 1m HiRISE DTM GeoTIFF processing" | Loads `jezero_eva_sector.npz` ($350 \times 550$ cells, $dx \approx 11.3\text{m}, dy \approx 11.9\text{m}$) | **Prototype Surrogate Grid** (Explicitly disclosed as surrogate; raw HiRISE DTM moved to future reference) |
| **Topographic Consistency** | "Scientifically validated elevation model" | Evaluated against 276 real Perseverance waypoint elevations: RMSE $\approx 74.2\text{m}$, mean bias $\approx +54.8\text{m}$ | **Exploratory Consistency Check** (Not independent scientific validation) |
| **Slope Derivative** | "Operational Horn's slope" | Horn's $3 \times 3$ finite-difference method with Gaussian pre-filter evaluated in preprocessing and verified via pytest | **Implemented and Operational (on surrogate grid)** |
| **Surface Roughness** | "Soil trafficability and shear strength" | Local elevation standard deviation $\sigma_z$ ($0.0\text{m}$ to $0.256\text{m}$) | **Derived Computational Estimate** (Topographic variation, not geotechnical shear strength) |
| **Regolith Slip Proxy** | "Direct surface firmness measurement" | Parametric impedance factor $\eta$ derived from thermal inertia and roughness | **Modeling Assumption / Thermophysical Proxy** |
| **A* Traverse Planner** | "Multi-objective pathfinder" | 8-connected A* with step cost equation and 3 configurable weighting modes (`safe`, `balanced`, `science`) | **Implemented and Operational** |
| **Obstacle Slope Limit** | "Universal astronaut safety limit" | Hard obstacle cutoff at $\theta > 22.0^\circ$ | **Engineering Implementation Constraint** (Not certified NASA flight limit) |
| **Planning Mode Names** | "Safe Route", "Fast Route", "Science Route" | Mode names implied absolute safety certification | **Renamed to "Lower-Slope Preference", "Balanced Preference", "Science Priority"** |
| **Perseverance Waypoints** | "708 waypoints" | `m20_waypoints.json` contains exactly 708 valid GeoJSON point features (Sols 13–2022) | **Real Spacecraft Telemetry (NASA-AMMOS MMGIS)** |
| **Perseverance Traverse** | "559 traverse legs" | `m20_traverse.json` contains exactly 559 LineString segments | **Real Spacecraft Telemetry (NASA-AMMOS MMGIS)** |
| **Curiosity Waypoints** | "Comparative Gale Crater context" | `msl_waypoints.json` contains 1,389 point features (through Sol 5073) | **Real Spacecraft Telemetry (Comparative Context)** |
| **Geological Overlays** | "Authoritative USGS geologic map" | `jezero_geology_sim3464.json` contains 5 hand-simplified polygonal features after Sun & Stack (2020) | **Manually Authored / Simplified Context** (Not a full vector GIS map) |
| **CRISM Mineral Detection** | "AI-based spectral cube mineral detection" | `jezero_crism_hotspots.json` contains 5 hand-authored coordinates citing published CRISM observation IDs | **Manually Authored Context** (No raw spectral cube processing or AI detection) |
| **Optical CTX & THEMIS Basemaps** | "Active operational map layers" | MarsMap.tsx uses USGS Viking MDIM2.1 WMS and MOLA Shaded Relief WMS; CTX/THEMIS are documented endpoints | **Documented Potential Future Integration** (Not active in frontend OpenLayers map) |
| **Spacesuit Bioenergetics** | "NASA JSC CSRM Life Support Engine" | Suited mass $W=75\text{kg}, L=85\text{kg}, G=0.376$, Apollo speed degradation, Pandolf-Santee power equation | **Implemented Computational Approximation** (Approximates gross workload; does not model PLSS $\text{O}_2$ or cooling loops) |
| **Radiation Dosimetry** | "In-situ Jezero radiation measurement" | Static Gale Crater MSL RAD rate ($23.33\,\mu\text{Sv/hr}$) scaled with traverse duration | **Illustrative Proxy** (Gale RAD transferred) |
| **Astronaut Safety Certification** | Implied operational flight safety | None | **Not Implemented / Excluded from Scope** |

---

## 4. Key Claims Removed from Documentation

To protect scientific integrity and project credibility, the following claims were permanently removed:
1. **Removed:** Claims that the live terrain engine actively reads or tiles the raw 1.8 GB HiRISE DTM GeoTIFF (`JEZ_hirise_soc_006_...tif`). *(Clarified: The active engine reads `jezero_eva_sector.npz`, a prototype surrogate grid).*
2. **Removed:** Claims of "AI-driven mineral detection" or "automated CRISM spectral cube classification". *(Clarified: 5 hand-authored science interest coordinates citing CRISM observation IDs).*
3. **Removed:** Claims that CTX (6m) and THEMIS nighttime IR (100m) are operational layers in the live OpenLayers map. *(Clarified: Active basemap is USGS Viking MDIM2.1 and MOLA WMS; CTX/THEMIS are documented for future integration).*
4. **Removed:** References to "Certified Safe Route" or "Astronaut Safety Clearance". *(Clarified: Renamed to "Lower-Slope Preference"; added explicit disclaimers that MarsAtlas is an uncertified research prototype).*
5. **Removed:** Claims of "Full NASA JSC CSRM Integration" or modeling PLSS oxygen draw and liquid cooling loops. *(Clarified: Uses Pandolf-Santee gross suited walking equations).*
6. **Removed:** Claims of independent scientific validation of the terrain model. *(Clarified: Labeled as an exploratory consistency check with RMSE $\approx 74\text{m}$ and bias $\approx +55\text{m}$).*

---

## 5. Claims Retained After Verification

The following capabilities were verified in the codebase and retained as genuine engineering achievements:
1. **Real Perseverance Telemetry:** Exactly 708 waypoints and 559 traverse legs from NASA-AMMOS MMGIS, verified against `data/processed/m20_waypoints.json` and `m20_traverse.json`.
2. **Real Curiosity Comparative Data:** Exactly 1,389 waypoints from NASA-AMMOS MMGIS through Sol 5073.
3. **8-Connected Multi-Objective A* Planner:** Operational pathfinder in `backend/app/routing/planner.py` calculating Lower-Slope, Balanced, and Science Priority routes with an enforced $22.0^\circ$ slope ceiling.
4. **Horn's $3 \times 3$ Slope Formulation:** Analytically tested in `backend/tests/test_geospatial_engine.py` against a known inclined plane ($\theta = 26.565^\circ \pm 0.01^\circ$).
5. **Point Telemetry Sampling:** Sub-second sampling of elevation, slope, roughness, and thermal inertia via `GET /api/point-telemetry`.
6. **Interactive OpenLayers Planetary GIS:** Native Mars Equirectangular projection (`EPSG:104905`, $R=3,396,190\text{ m}$) rendering global USGS WMS mosaics and local GeoJSON vectors.
7. **Three.js WebGL 3D Sector Mesh:** 3D heightmap displacement surface mesh with solar azimuth lighting and traverse draping.
8. **Automated Flight Director Briefing:** Citation-backed briefing generator synthesizing route metrics via `POST /api/briefing`.

---

## 6. Features Remaining Unimplemented (Future Roadmap)

The following capabilities remain planned for future work:
1. **Cloud-Optimized GeoTIFF (COG) Streaming:** Direct windowed reading of raw 1m HiRISE DTM rasters rather than pre-packaged `.npz` surrogate arrays.
2. **Active CTX & THEMIS WMTS Layer Switcher:** Dynamic frontend tile loading from NASA Mars Trek WMTS endpoints.
3. **Automated CRISM Cube Processing:** Ingestion and band-ratio calculation ($D2300, BD2500, BD1900$) from raw MTRDR PDS spectral cubes.
4. **Physiological Life-Support Integration:** True simulation of PLSS consumables ($\text{O}_2$ mass flow, $\text{CO}_2$ scrubber saturation, water sublimation).
5. **Dynamic Space Weather & Topographic Horizon Shielding:** In-situ radiation modeling incorporating real-time solar particle events and localized solid-angle horizon blockage.

---

## 7. Test Results & Verification Record

* **Test Suite:** `backend/tests/test_geospatial_engine.py`
* **Test Command:** `python -m pytest backend/tests/test_geospatial_engine.py -v`
* **Test Environment:** Python 3.12.7, pytest 9.1.1, Windows 11
* **Execution Summary:** **8 passed, 1 warning in 10.70 seconds**
  * `test_geodetic_constants`: PASSED
  * `test_terrain_engine_loading`: PASSED
  * `test_point_telemetry_sampling`: PASSED
  * `test_out_of_bounds_rejection`: PASSED
  * `test_horns_slope_formulation`: PASSED
  * `test_eva_pathfinder_convergence`: PASSED
  * `test_nearest_rover_observation`: PASSED
  * `test_fastapi_endpoints`: PASSED
* **Warning Note:** 1 benign Starlette deprecation warning regarding HTTPX test client.

---

## 8. Link & Deployment Health Verification

| Target URL | Type | Status Code | Operational Health |
|---|---|---|---|
| `https://mars-atlas-nasa.vercel.app/` | Production Frontend | **200 OK** | Operational & Live |
| `https://marsatlas-backend.onrender.com/api/health` | Production Backend | **200 OK** | Operational & Live (Cold start: ~30–50s) |
| `https://github.com/shubham25-droid/MarsAtlas` | Source Repository | **200 OK** | Operational & Live |
| `https://mars-atlas-indol.vercel.app/` | Deprecated Frontend | **404 Not Found** | Deprecated / Decommissioned |

*Action Required:* The GitHub repository's "About" website field currently points to the deprecated URL (`mars-atlas-indol.vercel.app`). It should be manually updated to `https://mars-atlas-nasa.vercel.app/`.

---

## 9. Security, Hygiene & Attribution Audit

* **Committed Secrets:** A recursive regex scan across all repository files for API keys, secret tokens, private keys, and passwords revealed **zero exposed credentials**.
* **Environment Templates:** `.env.example`, `backend/.env.example`, and `frontend/.env.example` contain strictly safe placeholder values (`NASA_API_KEY=DEMO_KEY`).
* **Binary Hygiene:** No multi-gigabyte raw GeoTIFF rasters or temporary cache files are tracked in Git. The active `.npz` array is lightweight ($2.3\text{ MB}$).
* **License & Attribution:** The MIT License is retained for software source code. Third-party data provenance and attribution policies for NASA, JPL, USGS, and PDS are cataloged in `docs/DATA_SOURCES.md`.

---

## 10. Manual Actions Still Required by Project Maintainer

1. **Update GitHub Repository "About" Link:**
   * Go to [https://github.com/shubham25-droid/MarsAtlas](https://github.com/shubham25-droid/MarsAtlas).
   * Click the settings gear icon in the **About** section (top right of the repo page).
   * Update the **Website** field from `https://mars-atlas-indol.vercel.app/` to `https://mars-atlas-nasa.vercel.app/`.
2. **Review and Commit Changes:**
   * All documentation files have been updated locally in the working tree.
   * In accordance with repository constraints, no automatic git commit or push was executed.
   * To commit and push these verified changes, run:
     ```bash
     git add README.md docs/ CONTRIBUTING.md
     git commit -m "docs: complete repository audit, scientific transparency correction, and submission readiness"
     git push origin main
     ```

---

## 11. Remaining Submission Risks & Mitigation

1. **Render Free-Tier Cold Start:**
   * *Risk:* If evaluators open the application after a period of backend inactivity, the initial API call may take 30–50 seconds while the Render web service spins up.
   * *Mitigation:* The Next.js frontend includes pre-cached local fallback datasets and offline graceful degradation for route planning and telemetry inspection.
2. **Judges Questioning Topographic Ground-Truth:**
   * *Risk:* Judges with planetary science backgrounds might ask if the terrain model is directly clipped from the 1m HiRISE DTM.
   * *Mitigation:* Every document now explicitly states that `jezero_eva_sector.npz` is a prototype surrogate grid, citing the exploratory consistency check RMSE ($\approx 74\text{m}$). This demonstrates scientific maturity and honesty.
3. **NASA Endorsement Perception:**
   * *Risk:* Misinterpretation of MarsAtlas as an official NASA platform.
   * *Mitigation:* Explicit disclaimers are placed in the header, footer, README, and presentation slides affirming that MarsAtlas is an independent research prototype developed for the NASA Space Apps Challenge 2026.

---

## 9. Related Audits

- **Frontend & Live System Audit:** For comprehensive UI/UX checks, mobile responsiveness testing across 5 viewports (360px–1440px), live backend API latency measurements, and component-level audits, see [WEBSITE_AUDIT.md](WEBSITE_AUDIT.md).


# MarsAtlas: Data Provenance & Scientific Catalog

This document provides a scientifically rigorous and transparent catalog of every planetary dataset, orbital product, in-situ rover observation, and contextual source referenced by **MarsAtlas** for the **NASA Space Apps Challenge 2026** (*Interplanetary Survival Guide: Martian Map*).

To maintain scientific integrity, all sources are categorized by their actual epistemic status and role within the software:
* **Section A:** Active Application Datasets (parsed and utilized in active runtime workflows)
* **Section B:** Manually Authored or Simplified Contextual Overlays
* **Section C:** Documented Potential Future Integration Sources (reference products not actively parsed in current runtime)
* **Section D:** External Software Libraries, Cartographic Standards, and Technical References

---

## Section A: Active Application Datasets

These datasets are actively loaded, parsed, or queried by the live MarsAtlas application (frontend and/or backend).

### A.1 Perseverance Rover Waypoint Telemetry (`m20_waypoints.json`)
* **Dataset Name:** Mars 2020 Perseverance Rover Validated Waypoints
* **Provider:** NASA / Jet Propulsion Laboratory (JPL) / NASA-AMMOS MMGIS
* **Product / Endpoint:** `https://mars.nasa.gov/mmgis-maps/M20/Layers/json/M20_waypoints.json`
* **Local Path:** `data/processed/m20_waypoints.json` & `frontend/public/data/m20_waypoints.json`
* **Dataset Scope:** 708 validated point features spanning Sols 13 through 2022.
* **Coordinate System:** Planetocentric Martian Coordinates, Longitude Positive East ($0^\circ - 360^\circ$).
* **Format & Processing:** Curated GeoJSON point features containing Sol number, elevation ($m$), rover heading/orientation, roll, pitch, and site drive numbers.
* **Actual Use in MarsAtlas:** Visualized as interactive waypoint pins on the OpenLayers map; used by `rover_pov.py` and `/api/point-telemetry` to identify nearest in-situ rover observations to any queried coordinate.
* **Scientific Limitations:** Rover elevations in MMGIS are derived from rover localization and regional elevation ties, with varying local vertical accuracy.
* **Attribution:** NASA/JPL-Caltech/NASA-AMMOS.

---

### A.2 Perseverance Rover Traverse Tracks (`m20_traverse.json`)
* **Dataset Name:** Mars 2020 Perseverance Rover Surface Traverse Path
* **Provider:** NASA / Jet Propulsion Laboratory (JPL) / NASA-AMMOS MMGIS
* **Product / Endpoint:** `https://mars.nasa.gov/mmgis-maps/M20/Layers/json/M20_traverse.json`
* **Local Path:** `data/processed/m20_traverse.json` & `frontend/public/data/m20_traverse.json`
* **Dataset Scope:** 559 LineString traverse legs spanning the rover's journey from Octavia E. Butler Landing Site across the Séítah formation, delta front, and crater margin.
* **Coordinate System:** Planetocentric Martian Coordinates, Longitude Positive East.
* **Format & Processing:** Curated GeoJSON LineString features with start/end Sol, drive duration, and drive distance.
* **Actual Use in MarsAtlas:** Rendered on the OpenLayers map and draped over the Three.js 3D terrain mesh to compare robotic exploration history against hypothetical human EVA corridors.
* **Scientific Limitations:** LineStrings represent piecewise linear drive segments between localization updates, not continuous wheel track telemetry.
* **Attribution:** NASA/JPL-Caltech/NASA-AMMOS.

---

### A.3 Curiosity Rover Waypoint Telemetry (`msl_waypoints.json`)
* **Dataset Name:** Mars Science Laboratory (MSL) Curiosity Rover Waypoints
* **Provider:** NASA / Jet Propulsion Laboratory (JPL) / NASA-AMMOS MMGIS
* **Product / Endpoint:** `https://mars.nasa.gov/mmgis-maps/MSL/Layers/json/MSL_waypoints.json`
* **Local Path:** `data/processed/msl_waypoints.json` & `frontend/public/data/msl_waypoints.json`
* **Dataset Scope:** 1,389 validated point features spanning landing through Sol 5073.
* **Coordinate System:** Planetocentric Martian Coordinates, Longitude Positive East.
* **Format & Processing:** Curated GeoJSON point features with Sol number, elevation, and site identifiers.
* **Actual Use in MarsAtlas:** Rendered when switching to the Gale Crater comparative regional preset (Mount Sharp Boxwork); provides comparative exploration context. *Not used in Jezero Crater A* route-planning calculations.*
* **Scientific Limitations:** Distinct regional datum from Jezero; serves solely as comparative reference.
* **Attribution:** NASA/JPL-Caltech/NASA-AMMOS.

---

### A.4 Active Jezero EVA Sector Terrain Grid (`jezero_eva_sector.npz`)
* **Dataset Name:** Jezero Crater EVA Modeling Sector Prototype Grid
* **Provider:** MarsAtlas Research Project (Synthesized prototype surrogate)
* **Local Path:** `data/processed/jezero_eva_sector.npz`
* **Grid Dimensions:** $350 \text{ rows} \times 550 \text{ columns}$ ($192,500$ cells)
* **Spatial Resolution:** $\Delta x \approx 11.27\text{ m}$, $\Delta y \approx 11.89\text{ m}$ (evaluated at $R=3,396,190\text{ m}$, $\phi \approx 18.45^\circ\text{N}$)
* **Geographic Extent:** $77.3500^\circ\text{E} - 77.4600^\circ\text{E}$ Longitude, $18.4100^\circ\text{N} - 18.4800^\circ\text{N}$ Latitude
* **Internal Data Arrays:**
  * `elevation`: 32-bit floating-point elevations ($-2,604.87\text{ m}$ to $-2,120.65\text{ m}$)
  * `slope_deg`: 32-bit floating-point surface slope angles ($0.002^\circ$ to $22.73^\circ$, mean $4.84^\circ$)
  * `roughness`: Local elevation standard deviation ($0.000\text{ m}$ to $0.256\text{ m}$)
  * `thermal_inertia`: Proxy thermal inertia values ($109.2$ to $466.2\,\text{J}\cdot\text{m}^{-2}\cdot\text{K}^{-1}\cdot\text{s}^{-1/2}$)
  * `terrain_factor`: Dimensionless surface impedance factor $\eta$ ($1.001$ to $1.593$)
  * `lons`, `lats`: 1D coordinate coordinate vectors
  * `bounds`: Bounding box coordinates
  * `dx`, `dy`: Metric cell spacing constants
* **Actual Use in MarsAtlas:** Primary numerical input for `/api/point-telemetry`, A* route cost evaluation in `planner.py`, and heightmap generation for the Three.js 3D viewer.
* **CRITICAL SCIENTIFIC LIMITATIONS:**
  * **Prototype Surrogate Grid:** This file is a prototype surrogate grid generated to test the multi-criteria routing algorithms and spatial telemetry pipeline. It is **NOT** a raw or direct sub-sampled crop of the USGS 1-meter HiRISE DTM GeoTIFF.
  * **Consistency Check vs. Validation:** An exploratory consistency check against 276 real Perseverance waypoint elevations indicates an RMSE of $\approx 74\text{ m}$ and a mean bias of $\approx +55\text{ m}$. It must not be cited as certified ground-truth topography.
* **Attribution:** Synthesized by MarsAtlas pipeline; macro-topographic envelope informed by USGS/MOLA Jezero Crater relief.

---

### A.5 Environmental Climatology & Radiation Telemetry (`environmental_telemetry.json`)
* **Dataset Name:** Jezero Environmental Climatology & Gale RAD Radiation Baseline
* **Provider:** Curated from published Mars 2020 MEDA and MSL RAD scientific reports (Hassler et al., 2014; Rodriguez-Manfredi et al., 2021)
* **Local Path:** `data/processed/environmental_telemetry.json`
* **Parameters Provided:**
  * Ambient Air Temperature: Diurnal cycle $182\text{ K}$ to $258\text{ K}$ ($-91^\circ\text{C}$ to $-15^\circ\text{C}$)
  * Atmospheric Surface Pressure: $715\text{ Pa}$ to $782\text{ Pa}$
  * Surface Wind Velocity: Mean $4.2\text{ m/s}$, gusts to $14.2\text{ m/s}$
  * Gale RAD Surface Radiation Baseline: $23.33\,\mu\text{Sv/hr}$ ($0.560\text{ mSv/day}$)
* **Actual Use in MarsAtlas:** Served via `GET /api/environmental` and displayed in the frontend Mission HUD and Environmental Dashboard.
* **Scientific Limitations:** Atmospheric metrics represent seasonal nominal envelopes rather than real-time sensor feeds; radiation dose rate is a static Gale Crater RAD proxy transferred to Jezero Crater.
* **Attribution:** NASA/JPL-Caltech/CAB (CSIC-INTA)/SwRI.

---

### A.6 Gale Crater Comparative Preset Telemetry (`gale_boxwork_preset.json`)
* **Dataset Name:** Gale Crater Mount Sharp Boxwork Geological Preset
* **Provider:** MarsAtlas Research Project (curated from MSL mission science releases)
* **Local Path:** `data/processed/gale_boxwork_preset.json`
* **Coordinates:** $137.4000^\circ\text{E}, 4.7500^\circ\text{S}$ (Chocolatal boxwork formation)
* **Actual Use in MarsAtlas:** Served via `GET /api/gale-preset` to populate the mission briefing when switching to Site 02.
* **Scientific Limitations:** Illustrative comparative context only.
* **Attribution:** Curated from NASA MSL mission science publications.

---

### A.7 Global Planetary Basemap WMS Layers (OpenLayers Runtime)
* **Dataset Name:** USGS Viking MDIM2.1 Mars Global Mosaic & MOLA Shaded Relief WMS
* **Provider:** USGS Astrogeology Science Center / NASA Planetary Data System
* **Service Type:** OGC WMS (Web Map Service)
* **Endpoint:** `https://planetarymaps.usgs.gov/cgi-bin/mapserv?map=/maps/mars/mars_simp_wv.map`
* **Actual Use in MarsAtlas:** Configured in `frontend/src/components/map/MarsMap.tsx` as the active base imagery layer for 2D planetary navigation in Mars Equirectangular coordinates.
* **Scientific Limitations:** Moderate planetary resolution ($\approx 231\text{ m/pixel}$ for Viking, $463\text{ m/pixel}$ for MOLA); serves as global/regional visual backdrop.
* **Attribution:** USGS Astrogeology Science Center / NASA PDS Cartography and Imaging Sciences Node.

---

## Section B: Manually Authored or Simplified Contextual Datasets

These datasets represent manually authored or simplified scientific context, designed to illustrate mission-planning features without claiming independent discovery or automated detection.

### B.1 Jezero Crater Simplified Geological Overlays (`jezero_geology_sim3464.json`)
* **Dataset Name:** Jezero Crater Simplified Geological Units
* **Provider:** MarsAtlas Project (manually authored based on USGS SIM 3464)
* **Reference Source:** Sun, V. Z., & Stack, K. M. (2020). *Geologic map of Jezero crater and the Nili Planum region, Mars* (USGS Scientific Investigations Map 3464, scale 1:75,000).
* **Local Path:** `data/processed/jezero_geology_sim3464.json` & `frontend/public/data/jezero_geology_sim3464.json`
* **Dataset Scope:** 5 hand-simplified polygonal features:
  1. `w_fd`: Western Fan Delta (layered lacustrine smectite clays / siltstones)
  2. `m_rim`: Marginal Carbonate Unit (Lac de Charmes / Belva paleolake shoreline)
  3. `s_cf`: Séítah Formation (olivine cumulate and eolian bedforms)
  4. `m_cf`: Máaz Formation (crater floor basaltic flows)
  5. `c_rim`: Crater Rim Basement (pre-Noachian megabreccia)
* **Coordinate System:** Planetocentric Martian Coordinates, Longitude Positive East.
* **Actual Use in MarsAtlas:** Visualized as semi-transparent colored polygons on the OpenLayers map to illustrate geologic formation boundaries.
* **CRITICAL SCIENTIFIC LIMITATIONS:**
  * **Not an Authoritative Vector GIS Map:** These polygons are coarse, hand-drawn approximations created to demonstrate geological context within the prototype interface.
  * They do not capture the fine contact lines, fault traces, or stratigraphic complexity of the official USGS 1:75,000 publication.
* **Attribution:** Hand-simplified after Sun & Stack (2020), USGS SIM 3464.

---

### B.2 Jezero CRISM Mineral Science Targets (`jezero_crism_hotspots.json`)
* **Dataset Name:** CRISM-Referenced High-Value Science Interest Locations
* **Provider:** MarsAtlas Project (manually compiled referencing published CRISM observations)
* **Reference Source:** Compact Reconnaissance Imaging Spectrometer for Mars (CRISM) targeted observation cubes (Observation IDs: `FRT000047A3`, `FRT00005C5E`, `HRL000040FF`).
* **Local Path:** `data/processed/jezero_crism_hotspots.json` & `frontend/public/data/jezero_crism_hotspots.json`
* **Dataset Scope:** 5 point features:
  1. Delta Scarp Smectite Clay (`FRT000047A3`, $18.4532^\circ\text{N}, 77.4018^\circ\text{E}$)
  2. Lac de Charmes Shoreline Carbonate (`FRT00005C5E`, $18.4721^\circ\text{N}, 77.3712^\circ\text{E}$)
  3. Séítah Olivine-Carbonate Exposure (`HRL000040FF`, $18.4389^\circ\text{N}, 77.4365^\circ\text{E}$)
  4. Cape Flatley Delta Layering ($18.4530^\circ\text{N}, 77.4180^\circ\text{E}$)
  5. Kodiak Butte Remnant ($18.4120^\circ\text{N}, 77.4420^\circ\text{E}$)
* **Coordinate System:** Planetocentric Martian Coordinates, Longitude Positive East.
* **Actual Use in MarsAtlas:** Visualized as science interest markers on the map; provides spatial reward points ($V_{\text{sci}}$) in `planner.py` to divert Science Priority routes toward mineralogical features.
* **CRITICAL SCIENTIFIC LIMITATIONS:**
  * **No Hyperspectral Cube Processing:** MarsAtlas does **NOT** process raw CRISM spectral cubes, evaluate band ratios ($D2300, BD2500, BD1900$), or perform AI-based mineral detection.
  * The coordinates and mineral labels are hand-authored points referencing published findings.
* **Attribution:** Coordinates compiled referencing MRO CRISM data published by NASA/JPL/JHUAPL.

---

## Section C: Documented Potential Future Integration Sources

These planetary data products are documented in the repository as high-value resources for future production integration, but are **not** actively parsed, rendered, or computed in the current prototype runtime.

### C.1 Mars 2020 TRN HiRISE DTM Mosaic (1 m/pixel)
* **Product ID:** `JEZ_hirise_soc_006_DTM_MOLAtopography_DeltaGeoid_1m_Eqc_latTs0_lon0_blend40.tif`
* **Provider:** USGS Astrogeology Science Center / NASA JPL / Univ. of Arizona
* **Resolution:** $1.0\text{ m/pixel}$ (32-bit floating point, tied to MOLA areoid)
* **Archive URL:** `https://planetarymaps.usgs.gov/mosaic/mars2020_trn/HiRISE/`
* **Status in MarsAtlas:** Documented external reference product. The active application loads the prototype surrogate grid `jezero_eva_sector.npz`, not this raw multi-gigabyte GeoTIFF.
* **Future Integration:** Direct tiled streaming or Cloud-Optimized GeoTIFF (COG) serving for full-resolution terrain gradient analysis.

---

### C.2 Mars Reconnaissance Orbiter (MRO) CTX Jezero Controlled Mosaic (6 m/pixel)
* **Product ID:** `JEZ_ctx_B_soc_008_orthoMosaic_6m_Eqc_latTs0_lon0`
* **Provider:** NASA JPL / Mars Trek
* **Resolution:** $6.0\text{ m/pixel}$
* **Tile Endpoint:** `https://trek.nasa.gov/tiles/Mars/EQ/JEZ_ctx_B_soc_008_orthoMosaic_6m_Eqc_latTs0_lon0/1.0.0/default/default028mm/{z}/{y}/{x}.jpg`
* **Status in MarsAtlas:** Documented tile endpoint. In the current frontend, the active base layer is the USGS Viking/MOLA WMS. CTX is not wired into the active OpenLayers layer switcher.
* **Future Integration:** High-resolution optical basemap toggle in the layer management panel.

---

### C.3 Mars Odyssey THEMIS Controlled Nighttime Infrared Mosaic (100 m/pixel)
* **Product ID:** `THEMIS_NightIR_ControlledMosaics_100m_v2_oct2018`
* **Provider:** NASA JPL / Arizona State University / Mars Trek
* **Resolution:** $100\text{ m/pixel}$
* **Tile Endpoint:** `https://trek.nasa.gov/tiles/Mars/EQ/THEMIS_NightIR_ControlledMosaics_100m_v2_oct2018/1.0.0/default/default028mm/{z}/{y}/{x}.jpg`
* **Status in MarsAtlas:** Documented tile endpoint. The prototype terrain grid contains an embedded synthetic thermal inertia channel, but the live THEMIS WMTS tile stream is not active in the current OpenLayers map.
* **Future Integration:** Overlay layer for regional thermal inertia visualization.

---

### C.4 Global MGS MOLA DEM Mosaic (463 m/pixel)
* **Product ID:** `Mars_MGS_MOLA_DEM_mosaic_global_463m.tif`
* **Provider:** NASA PDS Geosciences Node / USGS Astrogeology
* **Resolution:** $463\text{ m/pixel}$
* **Status in MarsAtlas:** Global elevation reference; documented for planetary-scale context.

---

## Section D: External Software, Cartographic Standards & References

### D.1 Cartographic & Geodetic Standards
* **Planetary Coordinate Reference System:** Mars 2000 Equirectangular (`EPSG:104905`, `urn:ogc:def:crs:EPSG::104905`)
* **Mars Equatorial Radius ($R$):** $3,396,190.0\text{ m}$ (IAU/IAG Working Group on Cartographic Coordinates and Rotational Elements)
* **Mars Polar Radius ($C$):** $3,376,200.0\text{ m}$
* **Gravitational Acceleration Ratio:** $G = 0.376$ ($g_{\text{Mars}} = 3.71\text{ m/s}^2$)

### D.2 Open-Source Scientific Libraries
* **FastAPI:** Version 0.110.0+ (REST API framework)
* **NumPy:** Version 2.0.0+ (Array operations and grid interpolation)
* **SciPy:** Version 1.14.0+ (Gaussian spatial filtering)
* **OpenLayers:** Version 10.11.0 (Planetary coordinate map rendering)
* **Three.js:** Version 0.187.0 (WebGL 3D heightmap surface rendering)
* **Pytest:** Version 8.0.0+ (Test execution framework)

### D.3 Key Scientific Literature & References
1. **Horn, B. K. P. (1981):** *Hill shading and the reflectance map.* Proceedings of the IEEE, 69(1), 14–47. (Source for $3 \times 3$ finite-difference slope calculation).
2. **Sun, V. Z., & Stack, K. M. (2020):** *Geologic map of Jezero crater and the Nili Planum region, Mars.* USGS Scientific Investigations Map 3464, Pamphlet 14 p., 1 sheet, scale 1:75,000.
3. **Pandolf, K. B., Givoni, B., & Goldman, R. F. (1977):** *Predicting energy expenditure with loads while standing or walking very slowly.* Journal of Applied Physiology, 43(4), 577–581.
4. **Santee, W. R., et al. (2001):** *A revised metabolic rate model for walking soldiers carrying load on slopes.* Military Medicine.
5. **Hassler, D. M., et al. (2014):** *Mars' surface radiation environment measured with the Mars Science Laboratory's Curiosity rover.* Science, 343(6169), 1244797.
6. **Rodriguez-Manfredi, J. A., et al. (2021):** *The Mars Environmental Dynamics Analyzer (MEDA) Instrument on the Mars 2020 Mission.* Space Science Reviews, 217(3), 43.

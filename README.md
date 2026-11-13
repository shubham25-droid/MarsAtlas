# 🔴 MarsAtlas
### Explore Mars. Understand Terrain. Plan Every Traverse.

**A planetary geospatial intelligence and EVA mission-planning platform.**

MarsAtlas is being developed for the **NASA Space Apps Challenge 2026**, addressing the challenge *Interplanetary Survival Guide: Martian Map*.

The project integrates NASA planetary observations, high-resolution terrain information, geological context, and in-situ rover observations into an interactive Martian exploration and EVA mission-planning platform.

Its primary study region is **Jezero Crater, Mars** (with a comparative preset for **Gale Crater Mount Sharp Boxwork**).

---

## 🚀 Vision

Future human explorers on Mars will need more than a conventional map.

They will need to understand terrain, evaluate possible traverses, investigate geological features, assess astronaut physiological workload, and identify scientifically valuable destinations.

MarsAtlas brings these capabilities together through an integrated geospatial exploration and mission-planning experience.

---

## 🎯 Core Objectives

- **Layered Martian Surface**: Explore Martian terrain through interactive planetary mapping in native Equirectangular projection (`EPSG:104905`).
- **Multi-Mission Synthesis**: Integrate orbital imagery, 32-bit floating-point elevation, nighttime thermal inertia, and in-situ rover telemetry.
- **Quantitative Terrain Intelligence**: Analyze elevation, Horn's slope gradient, and local terrain roughness.
- **Physiological EVA Pathfinding**: Ground route optimization in the NASA Johnson Space Center Crew State & Risk Model (CSRM) and Pandolf-Santee equations.
- **Science Along the Route**: Explore CRISM targeted mineral hotspots (carbonates, smectite clays) and USGS SIM 3464 geological formations.
- **Ground-Truth Handshake**: Connect orbital waypoints directly to Perseverance and Curiosity surface camera observations (Mastcam-Z, SuperCam RMI).
- **Mission Dashboard**: Generate grounded Flight Director EVA briefings and environmental context from Mars 2020 MEDA and MSL RAD.

---

## 🛰️ Key Modules & Implementation Status

| Module | Description | Status |
|---|---|---|
| **Mars Explorer** | Interactive 2D planetary map in Mars Equirectangular projection (`EPSG:104905`, $R=3,396,190\text{ m}$). | ✅ **Operational** |
| **Scientific Layer Manager** | Seamless stacking and split-screen comparison of CTX (6m), MOLA (200m), THEMIS IR (100m), USGS Geology, CRISM Hotspots, and Rover Traverses. | ✅ **Operational** |
| **Terrain Intelligence** | 32-bit DEM processing with Horn's 3x3 finite-difference slope calculation and local roughness metrics. | ✅ **Operational** |
| **EVA Route Planner** | 8-connected A* search comparing 3 strategies: *Min-Metabolic*, *Balanced Time*, and *Max-Science Discovery*. | ✅ **Operational** |
| **3D Sector Mesh Inspector** | WebGL 3D local terrain surface mesh rendering with dynamic solar azimuth lighting via Three.js. | ✅ **Operational** |
| **Science Explorer** | Interactive inspection of CRISM spectral absorption targets ($D2300, BD2500$) and USGS SIM 3464 geologic units. | ✅ **Operational** |
| **Rover Ground-Truth Handshake** | Waypoint-linked surface camera briefing cards pulling actual Perseverance / Curiosity imagery. | ✅ **Operational** |
| **Mission Dashboard & HUD** | Synchronized topographic/metabolic profile chart, MEDA diurnal weather, and MSL RAD ionizing radiation. | ✅ **Operational** |

---

## 🗺️ Study Regions

### 1. Primary Site: Jezero Crater, Mars (`18.44°N, 77.45°E`)
The landing site of NASA's Mars 2020 *Perseverance* rover and *Ingenuity* helicopter. Provides rich geological context spanning the crater floor (Máaz & Séítah formations), the Western Fan Delta scarp (Cape Flatley, Kodiak butte), and ancient paleolake shoreline carbonates at the crater margin (Lac de Charmes).

### 2. Secondary Preset: Gale Crater Mount Sharp Boxwork (`-4.75°S, 137.40°E`)
Features the mineral-hardened boxwork ridges ("spiderweb" formations) explored by NASA's *Curiosity* rover during its 2025–2026 campaign at "Chocolatal", demonstrating traversal across indurated bedrock ribs vs wind-eroded sand hollows.

---

## 🧪 Scientific Data Sources

MarsAtlas integrates authoritative, verified planetary datasets:

- **NASA Mars Trek (JPL)**: OGC RESTful WMTS streams for MRO CTX controlled mosaics (`JEZ_ctx_B_soc_008...`, `Gale_CTX_BlockAdj_dd`) and MGS MOLA + MEX HRSC color hillshade.
- **USGS Astrogeology Science Center**: Mars 2020 Terrain Relative Navigation (TRN) 1 m/pixel HiRISE DTM mosaic (`JEZ_hirise_soc_006_DTM_MOLAtopography_DeltaGeoid_1m_...tif`) tied to MOLA datum.
- **Mars Odyssey THEMIS**: 100 m/pixel controlled nighttime infrared and thermal inertia mosaics (`THEMIS_NightIR_ControlledMosaics_100m_v2_oct2018`).
- **USGS Scientific Investigations Map**: SIM 3464 Geologic Map of Jezero Crater and Nili Planum (Sun & Stack, 2020) at 1:75,000 scale.
- **MRO CRISM (MTRDR)**: Targeted spectral parameters ($D2300, BD2500, BD1900$) identifying carbonates and hydrated smectite clays.
- **NASA-AMMOS MMGIS**: Live and cached GeoJSON rover traverse and waypoint telemetry for Perseverance (`M20_waypoints.json`, `M20_traverse.json`) and Curiosity (`MSL_waypoints.json`).
- **NASA Mars 2020 Raw Images API**: In-situ surface camera feeds (SuperCam RMI, Mastcam-Z, Navcam).
- **Mars 2020 MEDA & MSL RAD**: Surface atmospheric climatology (air temperature 182 K to 258 K, pressure 715 Pa to 782 Pa) and surface ionizing radiation baseline ($0.560\text{ mSv/day}$).

*For full dataset metadata, bounding boxes, and direct download links, see [docs/DATA_SOURCES.md](docs/DATA_SOURCES.md).*

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Planetary Mapping**: OpenLayers 10 configured with native Mars Equirectangular Projection (`EPSG:104905`)
- **3D Visualization**: Three.js WebGL terrain heightmap mesh with directional Mars solar flux
- **Backend**: Python 3.12, FastAPI, Uvicorn
- **Geospatial & Numerics**: NumPy, SciPy, Pillow, Tifffile
- **Pathfinding & Physiology**: 8-connected Octile A* graph search, NASA JSC CSRM / Pandolf-Santee metabolic expenditure model
- **Testing**: Pytest validation framework (8 test suites, 100% passing)
- **Deployment**: Vercel (Frontend), Render / Container (Backend)

---

## 🏗️ Architecture

```text
NASA / USGS / PDS ARCHIVES (Mars Trek WMTS, PDS, Astropedia, MMGIS)
                     │
                     ▼
          GEOSPATIAL PREPROCESSING
(Coordinate Scaling R=3,396,190m, 32-bit Float GeoTIFF Cropping, Horn's Gradient)
                     │
                     ▼
         TERRAIN INTELLIGENCE ENGINE
  (Elevation z, Horn's Slope θ, Roughness σz, Thermal Inertia TI, Impedance η)
                     │
                     ▼
       NASA JSC CSRM / PANDOLF-SANTEE ROUTER
(Metabolic Workload MP & CF, Velocity Degradation V, Radiation Integration, A*)
                     │
                     ▼
               FASTAPI BACKEND
     (Stateless REST API: /health, /point-telemetry, /plan-eva, /rover-pov)
                     │
                     ▼
         NEXT.JS + OPENLAYERS CLIENT
   (EPSG:104905 Map, Split-Screen Swipe, Three.js 3D Mesh, Telemetry HUD)
                     │
                     ▼
                 MARSATLAS
```

---

## 📁 Project Structure

```text
MarsAtlas/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── routes.py             # REST endpoints (/health, /point-telemetry, /plan-eva)
│   │   ├── terrain/
│   │   │   └── engine.py             # DTM sampling, Horn's slope, roughness
│   │   ├── routing/
│   │   │   └── planner.py            # NASA CSRM / Pandolf-Santee A* solver
│   │   ├── services/
│   │   │   └── rover_pov.py          # Geolocated surface camera photo proxy
│   │   └── main.py                   # FastAPI application entrypoint
│   ├── tests/
│   │   └── test_geospatial_engine.py # Pytest validation suite
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── app/                      # Next.js App Router & Tailwind CSS
│   │   ├── components/
│   │   │   ├── landing/              # Cinematic Earth-to-Mars hero
│   │   │   ├── map/                  # OpenLayers EPSG:104905 & Three.js 3D modal
│   │   │   ├── mission/              # Route Planner, Scorecard, Elevation Profile
│   │   │   ├── science/              # CRISM Hotspots, Rover POV Modal
│   │   │   ├── dashboard/            # Mission Briefing, Environmental HUD
│   │   │   └── shared/               # Navigation Bar, Data Provenance Modal
│   │   ├── services/                 # API client with offline fallback cache
│   │   └── types/                    # Strict TypeScript schemas
│   ├── public/                       # Logos, pre-cached GeoJSONs, heightmaps
│   ├── package.json
│   └── .env.example
├── data/
│   ├── raw/                          # Placeholder for external large rasters (.gitkeep)
│   └── processed/                    # Pre-cropped .npz grids & cached MMGIS feeds
├── docs/
│   ├── ARCHITECTURE.md               # System architecture documentation
│   ├── DATA_SOURCES.md               # Authoritative dataset catalogue
│   ├── SCIENTIFIC_ASSUMPTIONS.md     # Mathematical & physiological formulations
│   ├── API.md                        # FastAPI endpoint documentation
│   └── TESTING.md                    # Verification benchmarks
├── .env.example                      # Root environment configuration template
├── .gitignore                        # Standard rules (excludes GB rasters & secrets)
├── CONTRIBUTING.md                   # Contribution guidelines
├── LICENSE                           # MIT License
└── README.md                         # Project overview
```

---

## ⚡ Quick Start

### 1. Clone & Configure
```bash
git clone https://github.com/shubham25-droid/MarsAtlas.git
cd MarsAtlas
cp .env.example .env
```

### 2. Start the FastAPI Backend
```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
Interactive API docs: `http://127.0.0.1:8000/docs`

### 3. Start the Next.js Frontend
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Run Automated Tests
```bash
python -m pytest backend/tests/test_geospatial_engine.py -v
```
All 8 test suites pass with analytical precision in $< 1.0\text{ second}$.

---

## ⚠️ Scientific Limitations & Epistemic Tiers

MarsAtlas strictly classifies information across four epistemic tiers:
1. **Tier 1 — Actual Measured NASA Spacecraft Observations**: HiRISE stereo elevation, CTX mosaics, THEMIS nighttime IR, MEDA weather telemetry, MSL RAD dosimeter readings, and Perseverance rover Sols.
2. **Tier 2 — Derived Computational Estimates**: Horn's slope ($\theta_{\text{deg}}$), local elevation standard deviation ($\sigma_z$), and topographic radiation shielding factors.
3. **Tier 3 — Explicit Modeling Assumptions**: Suited astronaut mass ($W=75\text{ kg}$, $L=85\text{ kg}$ in $G=0.376$), terrain impedance coefficient ($\eta$), and Apollo traverse speed degradation.
4. **Tier 4 — Hypothetical Mission Simulations**: Multi-objective A* paths, simulated metabolic energy curves, and walkback safety buffers.

*Disclaimer: MarsAtlas is an experimental research and planning prototype built for the NASA Space Apps Challenge 2026. It does not provide certified astronaut safety clearances or imply official NASA endorsement.*

---

## 🌍 NASA Space Apps Challenge 2026

- **Challenge**: *Interplanetary Survival Guide: Martian Map*
- **Project**: **MarsAtlas**
- **Location**: Navi Mumbai, India
- **Study Regions**: Jezero Crater & Gale Crater (Mount Sharp Boxwork), Mars

## 📜 License

This project is licensed under the [MIT License](LICENSE). Third-party planetary datasets, imagery, and orbital products remain subject to their respective NASA, JPL, USGS, and PDS public-domain policies and attribution guidelines.

---

**Building a better map for humanity's next frontier.** 🔴

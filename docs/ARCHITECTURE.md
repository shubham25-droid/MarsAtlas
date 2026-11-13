# MarsAtlas: System Architecture

## Architecture Overview
MarsAtlas is designed as a hybrid planetary geospatial intelligence platform separating visual map rendering from high-precision physical-physiological computation:

```
+--------------------------------------------------------------------------+
|                       FRONTEND: Next.js + React + TS                      |
|                                                                          |
|  [Cinematic Hero] -> [OpenLayers EPSG:104905] -> [Three.js 3D Mesh]     |
|         |                     |                          |               |
|         v                     v                          v               |
|  Landing Briefing      Multi-Layer Stacking       Local Sector Heightmap |
|                        - Mars Trek CTX 6m         - Dynamic Lighting     |
|                        - THEMIS Night IR          - Drape Traverse       |
|                        - USGS SIM 3464 Units      - Terrain Exaggeration |
|                        - CRISM Target Hotspots                           |
|                        - MMGIS Rover Traverse                            |
+--------------------------------------------------------------------------+
                                  |
                                  | HTTP / JSON REST
                                  v
+--------------------------------------------------------------------------+
|                       BACKEND: Python FastAPI Engine                      |
|                                                                          |
|  [Point Telemetry API]  [EVA A* Path Planner]   [Rover Ground-Truth POV] |
|            |                      |                         |            |
|            v                      v                         v            |
|    Terrain Sampling       NASA JSC CSRM Energy      MMGIS / NASA Raw Feed|
|    - Horn's Slope         - 8-connected Octile A*   - Sols & Instruments |
|    - Local Roughness      - 3 Strategy Solvers      - Caching Proxy      |
|    - Thermal Inertia      - Radiation Integration                        |
|                                                                          |
|                   [Data In-Memory Cache: .npz + JSON]                    |
+--------------------------------------------------------------------------+
```

## Front-to-Back Synchronization
* **Map Engine**: OpenLayers 10 running on Mars Equirectangular projection `urn:ogc:def:crs:EPSG::104905` with `[ -180, -90, 180, 90 ]` planetary extents and Mars radius $R = 3,396,190\text{ m}$.
* **Layer Swiping & Blending**: Real-time layer opacity and split-screen comparison (e.g. Optical vs Thermal / Mineralogy).
* **Telemetry Charts**: Synchronized profile graph illustrating elevation ($m$), slope grade ($\%$), metabolic wattage ($W$), and cumulative ionizing radiation ($\mu\text{Sv}$) along every meter of the planned traverse.

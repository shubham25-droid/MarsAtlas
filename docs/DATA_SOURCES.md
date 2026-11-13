# MarsAtlas: Authoritative NASA & USGS Planetary Datasets

This document catalogs every scientific dataset integrated into **MarsAtlas** for the **NASA Space Apps Challenge 2026** (*Interplanetary Survival Guide: Martian Map*). Every layer identifier, spatial resolution, coordinate reference system, and endpoint has been verified against official NASA, JPL, USGS, and PDS documentation.

---

## 1. Primary Operational Study Regions

### Primary Target: Jezero Crater (Western Delta to Crater Rim)
* **Coordinates**: `18.3068°N – 18.6693°N`, `77.2229°E – 77.5840°E`
* **Active EVA Modeling Sector**: `18.4100°N – 18.4800°N`, `77.3500°E – 77.4600°E`
* **Significance**: Ancient lacustrine lake-delta system explored by Mars 2020 *Perseverance* rover. Features smectite clays, lacustrine carbonates, and crater rim megabreccia.

### Secondary Comparative Preset: Gale Crater (Mount Sharp Boxwork Foothills)
* **Coordinates**: `-4.9200°S – -4.6700°S`, `137.3500°E – 137.4600°E`
* **Significance**: 2025–2026 *Curiosity* campaign studying mineral-hardened boxwork ridges ("spiderwebs") and wind-eroded sandy hollows. Provides MSL RAD surface radiation baseline.

---

## 2. Integrated Dataset Specification Matrix

### A. High-Resolution Topography & Elevation
1. **Mars 2020 Terrain Relative Navigation (TRN) HiRISE DTM Mosaic**
   * **Product ID**: `JEZ_hirise_soc_006_DTM_MOLAtopography_DeltaGeoid_1m_Eqc_latTs0_lon0_blend40.tif`
   * **Source**: USGS Astrogeology Science Center / NASA JPL / Univ. of Arizona
   * **Spatial Resolution**: 1.0 m/pixel (co-registered, 32-bit floating point)
   * **Vertical Datum**: MOLA Areoid / Delta Geoid (meters)
   * **Projection**: Mars Equirectangular (`urn:ogc:def:crs:EPSG::104905`), Radius $R = 3,396,190\text{ m}$
   * **Direct URL**: `https://planetarymaps.usgs.gov/mosaic/mars2020_trn/HiRISE/JEZ_hirise_soc_006_DTM_MOLAtopography_DeltaGeoid_1m_Eqc_latTs0_lon0_blend40.tif`

2. **Mars MSL Gale Merged DEM 1m**
   * **Source**: USGS Astrogeology Science Center (blending HiRISE, CTX, HRSC, and MOLA)
   * **Spatial Resolution**: 1.0 m/pixel (co-registered, 32-bit float)
   * **Direct URL**: `https://astrogeology.usgs.gov/search/map/mars_msl_gale_merged_dem_1m`

3. **Global MGS MOLA DEM (463m)**
   * **Product ID**: `Mars_MGS_MOLA_DEM_mosaic_global_463m.tif`
   * **Direct URL**: `https://planetarymaps.usgs.gov/mosaic/Mars_MGS_MOLA_DEM_mosaic_global_463m.tif`

---

### B. Optical Basemaps & Satellite Mosaics
1. **Mars Reconnaissance Orbiter (MRO) CTX Controlled Jezero Mosaic**
   * **Layer ID**: `JEZ_ctx_B_soc_008_orthoMosaic_6m_Eqc_latTs0_lon0`
   * **Spatial Resolution**: 6.0 m/pixel
   * **Service**: Mars Trek OGC RESTful WMTS
   * **Tile Endpoint**: `https://trek.nasa.gov/tiles/Mars/EQ/JEZ_ctx_B_soc_008_orthoMosaic_6m_Eqc_latTs0_lon0/1.0.0/default/default028mm/{z}/{y}/{x}.jpg`

2. **MGS MOLA & MEX HRSC Color Hillshade Blend**
   * **Layer ID**: `Mars_MOLA_blend200ppx_HRSC_ClrShade_clon0dd_200mpp_lzw`
   * **Spatial Resolution**: 200 m/pixel (Global Context)
   * **Tile Endpoint**: `https://trek.nasa.gov/tiles/Mars/EQ/Mars_MOLA_blend200ppx_HRSC_ClrShade_clon0dd_200mpp_lzw/1.0.0/default/default028mm/{z}/{y}/{x}.jpg`

3. **Gale Crater CTX Controlled Mosaic**
   * **Layer ID**: `Gale_CTX_BlockAdj_dd`
   * **Spatial Resolution**: 6.0 m/pixel
   * **Tile Endpoint**: `https://trek.nasa.gov/tiles/Mars/EQ/Gale_CTX_BlockAdj_dd/1.0.0/default/default028mm/{z}/{y}/{x}.jpg`

---

### C. Thermophysical & Thermal Inertia Data
1. **Mars Odyssey THEMIS Controlled Nighttime IR Global Mosaic**
   * **Layer ID**: `THEMIS_NightIR_ControlledMosaics_100m_v2_oct2018`
   * **Spatial Resolution**: 100 m/pixel
   * **Physical Units**: Brightness temperature ($K$) and Thermal Inertia ($\text{J}\cdot\text{m}^{-2}\cdot\text{K}^{-1}\cdot\text{s}^{-1/2}$)
   * **Scientific Utility**: Delineates high-inertia exposed bedrock vs low-inertia fine sand hollows.
   * **Tile Endpoint**: `https://trek.nasa.gov/tiles/Mars/EQ/THEMIS_NightIR_ControlledMosaics_100m_v2_oct2018/1.0.0/default/default028mm/{z}/{y}/{x}.jpg`

---

### D. Geological & Astrobiological Mapping
1. **USGS SIM 3464 Geologic Map of Jezero Crater and Nili Planum**
   * **Scale**: 1:75,000 (Sun & Stack, 2020)
   * **Key Mapped Formations**:
     * `w_fd`: Western Fan Delta (Fe/Mg smectite clays, layered siltstones)
     * `m_rim`: Marginal Carbonate Unit (Lac de Charmes / Belva paleolake shoreline)
     * `s_cf`: Séítah Formation (olivine cumulate and dunes)
     * `m_cf`: Máaz Formation (crater floor basaltic flows)
     * `c_rim`: Crater Rim Basement (pre-Noachian megabreccia)

2. **MRO CRISM Targeted Spectral Observations (MTRDR)**
   * **Observation IDs**: `FRT000047A3`, `FRT00005C5E`, `HRL000040FF`
   * **Spectral Parameters**: $D2300$ ($2.30\,\mu\text{m}$ carbonate/smectite), $BD2500$ ($2.51\,\mu\text{m}$ magnesite), $BD1900$ ($1.93\,\mu\text{m}$ hydration).

---

### E. In-Situ Rover Telemetry & Ground-Truth
1. **NASA-AMMOS MMGIS Live Rover Feeds**
   * **Perseverance Waypoints**: `https://mars.nasa.gov/mmgis-maps/M20/Layers/json/M20_waypoints.json` (708 validated Sols, elevations, orientations)
   * **Perseverance Traverse**: `https://mars.nasa.gov/mmgis-maps/M20/Layers/json/M20_traverse.json` (559 drive legs, 45+ km)
   * **Curiosity Waypoints**: `https://mars.nasa.gov/mmgis-maps/MSL/Layers/json/MSL_waypoints.json` (1389 waypoints through Sol 5073)

2. **Perseverance Raw Images JSON API**
   * **Endpoint**: `https://mars.nasa.gov/rss/api/?feed=raw_images&category=mars2020&feedtype=json`
   * **Instruments**: SuperCam RMI, Mastcam-Z, Navcam, Hazcam.

3. **Mars 2020 MEDA Atmospheric Package**
   * **PDS Archive**: `urn:nasa:pds:mars2020_meda`
   * **Parameters**: Diurnal ambient air temperature ($182\text{ K} - 258\text{ K}$), surface pressure ($715\text{ Pa} - 782\text{ Pa}$), wind speed ($1.8 - 14.2\text{ m/s}$).

4. **MSL Radiation Assessment Detector (RAD)**
   * **PDS Archive**: `MSL-M-RAD-3-RDR-V1.0` (Hassler et al. 2014)
   * **Surface Baseline**: $0.560\text{ mSv/day}$ ($23.33\,\mu\text{Sv/hr}$), modified by local topographic horizon factor $\psi_j \in [0.65, 0.98]$.

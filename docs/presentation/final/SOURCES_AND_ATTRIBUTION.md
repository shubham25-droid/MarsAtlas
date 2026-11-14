# MARSATLAS — DATA SOURCES, CITATIONS AND ATTRIBUTION
**NASA International Space Apps Challenge 2026**
*Challenge*: Interplanetary Survival Guide: Martian Map
*Repository*: https://github.com/shubham25-droid/MarsAtlas
*Live Production*: https://mars-atlas-nasa.vercel.app/

---

## 1. Primary Planetary Science Datasets

1. **NASA Mars 2020 Perseverance Rover Traverse & Waypoints**
   * *Source*: NASA-AMMOS Multi-Mission Geographic Information System (MMGIS) & PDS Geosciences Node
   * *Coverage*: Jezero Crater, Mars (Landing Sol 13 to Sol 2022)
   * *Files in Repo*: `data/processed/m20_traverse.json` (559 drive legs), `data/processed/m20_waypoints.json` (708 waypoints)
   * *Usage*: Ground-truth rover track, waypoint coordinates, and nearest-observation inspection.

2. **NASA Mars Science Laboratory (MSL) Curiosity Waypoints**
   * *Source*: NASA-AMMOS MMGIS / JPL
   * *Coverage*: Gale Crater & Mount Sharp, Mars (Sol 0 to Sol 5073)
   * *Files in Repo*: `data/processed/msl_waypoints.json` (1,389 waypoints)
   * *Usage*: Contextual preset for secondary exploration study at Mount Sharp boxwork ridges.

3. **USGS Astrogeology Viking Global Color Mosaic (MDIM 2.1)**
   * *Source*: USGS Astrogeology Science Center / Planetary Data System
   * *Endpoint*: `https://planetarymaps.usgs.gov/cgi-bin/mapserv?map=/maps/mars/mars_simp_cyl.map` (`MDIM21_color`)
   * *Usage*: Primary global color basemap rendered via OpenLayers TileWMS.

4. **USGS MOLA / MEX HRSC Blended Color Shaded Relief**
   * *Source*: USGS Astrogeology Science Center / DLR / NASA PDS
   * *Endpoint*: `https://planetarymaps.usgs.gov/cgi-bin/mapserv?map=/maps/mars/mars_simp_cyl.map` (`HRSC_MOLA_Blend_Hillshade`)
   * *Usage*: Secondary terrain hillshade layer for morphological surface interpretation.

5. **Jezero Crater Geologic Mapping (USGS SIM 3464)**
   * *Citation*: Sun, V. Z., & Stack, K. M. (2020). *Geologic map of Jezero crater and the Nili Planum region, Mars*. USGS Scientific Investigations Map 3464.
   * *Files in Repo*: `data/processed/jezero_geology_sim3464.json`
   * *Usage*: 5 simplified stratigraphy polygons (delta front, crater floor, olivine-bearing unit, carbonate rim, crater wall).

6. **MRO CRISM Targeted Spectral Observations**
   * *Source*: NASA Compact Reconnaissance Imaging Spectrometer for Mars (CRISM)
   * *Observations Cited*: FRT000047A3, HRL000040FF, FRT00005C5E, FRT0000B24C
   * *Files in Repo*: `data/processed/jezero_crism_hotspots.json`
   * *Usage*: Candidate scientific exploration targets for EVA sample collection.

---

## 2. Peer-Reviewed Methodological & Scientific Citations

1. **Topographic Gradient & Slope Calculation**
   * *Citation*: Horn, B. K. P. (1981). *Hill shading and the reflectance map*. Proceedings of the IEEE, 69(1), 14–47.
   * *Application*: $3 \times 3$ finite difference gradient method for continuous surface slope $\theta = \arctan\sqrt{p^2 + q^2}$.

2. **Terrain Roughness Index (TRI)**
   * *Citation*: Wilson, J. P., & Gallant, J. C. (2000). *Terrain Analysis: Principles and Applications*. John Wiley & Sons.
   * *Application*: Local elevation standard deviation $\sigma_z$ across sliding window.

3. **Bioenergetic Metabolic Cost Model**
   * *Citation*: Pandolf, K. B., Givoni, B., & Goldman, R. F. (1977). *Predicting energy expenditure with loads while standing or walking very slowly*. Journal of Applied Physiology, 43(4), 577–581.
   * *Citation*: Santee, W. R., Allison, W. F., Blanchard, L. A., & Small, M. G. (2001). *A mathematical model for predicting physiological responses to human load carriage*. Military Medicine, 166(8), 739–746.
   * *Application*: NASA JSC CSRM load carriage equation adapted to Martian gravity ($0.376g$).

4. **Martian Surface Radiation Baseline**
   * *Citation*: Hassler, D. M., et al. (2014). *Mars' surface radiation environment measured with the Mars Science Laboratory's Curiosity rover*. Science, 343(6169), 1244726.
   * *Application*: MSL RAD baseline rate of $23.33\text{ }\mu\text{Sv/hr}$ used as constant background proxy.

---

## 3. Open-Source Software Stack & Libraries

* **Frontend**: Next.js 14, React 18, TypeScript, OpenLayers 9, Tailwind CSS, Lucide Icons
* **Backend**: FastAPI, Python 3.11/3.12, Rasterio / GDAL, NumPy, SciPy, NetworkX
* **Testing**: Pytest, Pytest-AsyncIO, Starlette TestClient
* **Deployment**: Vercel Global Edge CDN (Frontend), Render Cloud Services (Backend)

---

## 4. NASA Space Apps Challenge Disclaimer

MarsAtlas was created as an open-source research and educational platform for the NASA International Space Apps Challenge 2026 under the problem statement *"Interplanetary Survival Guide: Martian Map"*. This project is independent and has not been endorsed by, certified by, or officially reviewed by NASA, the Jet Propulsion Laboratory, or the USGS.

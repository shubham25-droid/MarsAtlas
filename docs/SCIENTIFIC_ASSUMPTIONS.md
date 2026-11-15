# MarsAtlas: Scientific Assumptions & Mathematical Formulations

This document provides complete, transparent documentation of the mathematical models, geodetic constants, terrain processing algorithms, pathfinding cost formulations, and bioenergetic assumptions implemented in **MarsAtlas**.

To maintain scientific rigor, theoretical derivations are strictly distinguished from model assumptions, and computational proxies are separated from physical ground truth.

---

## 1. Planetary Geodetic Constants & Coordinate Conversions

All spatial and geodetic computations in MarsAtlas adhere to the International Astronomical Union (IAU) 2000 Mars Rotational and Geodetic Reference Frame:

* **Mars Equatorial Radius ($R$):** $3,396,190.0\text{ meters}$
* **Mars Polar Radius ($C$):** $3,376,200.0\text{ meters}$
* **Volumetric Mean Radius:** $3,389,500.0\text{ meters}$
* **Cartographic Coordinate System:** Mars Equirectangular Positive-East, Planetocentric (`EPSG:104905` / `urn:ogc:def:crs:EPSG::104905`)
* **Vertical Datum:** Mars Orbiter Laser Altimeter (MOLA) Areoid (Delta Geoid, elevation $z$ in meters)

### Metric Arc-Length Conversion
For a planetocentric latitude $\phi$ and infinitesimal angular displacements $\Delta\lambda$ (longitude, radians) and $\Delta\phi$ (latitude, radians):
$$\Delta y = R \cdot \Delta\phi$$
$$\Delta x = R \cdot \Delta\lambda \cdot \cos(\phi)$$

For the active Jezero Crater EVA sector centered at latitude $\phi \approx 18.445^\circ\text{N}$ ($\cos\phi \approx 0.94863$):
$$1^\circ\text{ Latitude} = \frac{\pi}{180} \times 3,396,190.0 = 59,274.69\text{ meters}$$
$$1^\circ\text{ Longitude} = \frac{\pi}{180} \times 3,396,190.0 \times \cos(18.445^\circ) = 56,229.98\text{ meters}$$

For the prototype grid `jezero_eva_sector.npz` spanning $\Delta\lambda = 0.11^\circ$ across 550 columns and $\Delta\phi = 0.07^\circ$ across 350 rows:
$$\Delta x = \frac{0.11^\circ \times 56,229.98\text{ m}}{549} \approx 11.27\text{ meters/column}$$
$$\Delta y = \frac{0.07^\circ \times 59,274.69\text{ m}}{349} \approx 11.89\text{ meters/row}$$

---

## 2. Topographic Gradient & Slope Calculation (Horn's Method)

Local topographic slope is evaluated using Horn’s $3 \times 3$ finite-difference convolution kernel (Horn, 1981), equivalent to standard geospatial implementations (`gdaldem slope`):

$$\begin{bmatrix} z_{r-1, c-1} & z_{r-1, c} & z_{r-1, c+1} \\ z_{r, c-1} & z_{r, c} & z_{r, c+1} \\ z_{r+1, c-1} & z_{r+1, c} & z_{r+1, c+1} \end{bmatrix} = \begin{bmatrix} a & b & c \\ d & e & f \\ g & h & i \end{bmatrix}$$

The east-west ($\frac{\partial z}{\partial x}$) and north-south ($\frac{\partial z}{\partial y}$) elevation gradients are calculated as:
$$\frac{\partial z}{\partial x} = \frac{(c + 2f + i) - (a + 2d + g)}{8 \cdot \Delta x}$$
$$\frac{\partial z}{\partial y} = \frac{(g + 2h + i) - (a + 2b + c)}{8 \cdot \Delta y}$$

The scalar surface slope angle $\theta_{\text{deg}}$ is computed as:
$$\theta_{\text{rad}} = \arctan\left(\sqrt{\left(\frac{\partial z}{\partial x}\right)^2 + \left(\frac{\partial z}{\partial y}\right)^2}\right)$$
$$\theta_{\text{deg}} = \theta_{\text{rad}} \times \frac{180^\circ}{\pi}$$

### Gaussian Pre-Filtering
Orbital stereo-derived DTMs often contain high-frequency disparity noise. Following USGS and planetary mapping conventions, a normalized $3 \times 3$ Gaussian smoothing kernel is applied prior to slope gradient differentiation:
$$K = \frac{1}{16} \begin{bmatrix} 1 & 2 & 1 \\ 2 & 4 & 2 \\ 1 & 2 & 1 \end{bmatrix}$$

---

## 3. Surface Roughness & Terrain Factor Formulations

### Local Roughness ($\sigma_z$)
Local terrain roughness $\sigma_z$ is computed as the standard deviation of elevation within a local moving kernel centered at grid cell $(r, c)$:
$$\sigma_z = \sqrt{\frac{1}{N-1} \sum_{k=1}^{N} (z_k - \bar{z})^2}$$

* **Scientific Caveat:** $\sigma_z$ is a geometric metric describing high-frequency vertical elevation variation. It does **not** measure geotechnical properties such as soil bearing strength, cohesion, internal friction angle, or mechanical shear strength.

### Terrain Factor / Surface Impedance ($\eta$)
In the Pandolf bioenergetic model, $\eta$ represents the surface impedance coefficient ($\eta = 1.0$ for smooth, firm pavement; $\eta > 1.0$ for soft regolith, sand, or boulder scree). In MarsAtlas, $\eta$ is estimated using a parametric heuristic combining thermal inertia ($TI$) and local roughness ($\sigma_z$):
$$\eta = 1.0 + 0.5 \cdot \text{clip}\left(\frac{350 - TI}{250}, 0, 1\right) + 0.6 \cdot \text{clip}\left(\frac{\sigma_z}{0.4}, 0, 1\right)$$

* **Nominal Limits:** In the active prototype grid, $\eta$ ranges between $1.001$ (firm bedrock pavement) and $1.593$ (rough scree / unconsolidated sand proxy).
* **Scientific Caveat:** Thermal inertia is an orbital thermophysical measurement ($J\cdot\text{m}^{-2}\cdot\text{K}^{-1}\cdot\text{s}^{-1/2}$) driven by grain size and rock abundance. While correlated with regolith density, it is **not** a direct measurement of mechanical traversability or slip rate.

---

## 4. Multi-Criteria A* Traverse Planning Engine

Traverse optimization is formulated as an 8-connected grid graph search with an admissible Octile heuristic.

### 8-Connected Metric Adjacency
From cell $(r, c)$, transitions to 8 adjacent neighbors $(r + \Delta r, c + \Delta c)$ are evaluated with Euclidean step distances:
$$d = \begin{cases} \Delta x, & \text{if } \Delta r = 0, |\Delta c| = 1 \\ \Delta y, & \text{if } |\Delta r| = 1, \Delta c = 0 \\ \sqrt{\Delta x^2 + \Delta y^2}, & \text{if } |\Delta r| = 1, |\Delta c| = 1 \end{cases}$$

### Hard Obstacle Cutoff
A cell $(r, c)$ is deemed impassable and skipped during path expansion if:
$$\theta_{\text{deg}} > 22.0^\circ$$
* **Operational Meaning:** The $22.0^\circ$ cutoff is an engineering implementation constraint to avoid steep scarp drop-offs and prevent simulated suited astronauts from entering high-risk sliding zones. It is **not** an official or certified NASA EVA flight limit.

### A* Step Cost Formulation
For each valid edge transition over distance $d$:
$$c = \max\left(0.05,\; w_E \hat{E} + w_T \hat{T} + w_S \left(\frac{\theta}{10}\right)^2 + w_H \max\left(0, \frac{250 - TI}{100}\right) - w_V \min(0.6, V_{\text{sci}})\right) \times \left(\frac{d}{10}\right)$$

Where:
* $\hat{E} = \frac{\Delta E_{\text{kJ}}}{0.35 \cdot d}$ (normalized bioenergetic energy expenditure per meter)
* $\hat{T} = \frac{\Delta t}{d / 0.70}$ (normalized transit duration per meter)
* $\theta$ = local surface slope angle in degrees
* $TI$ = local thermal inertia value
* $V_{\text{sci}}$ = Gaussian proximity bonus from manually authored CRISM targets ($25\text{-cell}$ spatial kernel)
* $w_E, w_T, w_S, w_H, w_V$ = weighting parameters corresponding to the planning mode.

### Planning Configurations & Weights
The three operational planning configurations use the following verified weights:

| Mode (Public Name) | Internal Key | Energy Weight ($w_E$) | Time Weight ($w_T$) | Slope Weight ($w_S$) | Regolith Slip Weight ($w_H$) | Science Weight ($w_V$) |
|---|---|---|---|---|---|---|
| **Lower-Slope Preference** | `safe` | $2.5$ | $0.2$ | $8.0$ | $5.0$ | $0.0$ |
| **Balanced Preference** | `balanced` | $0.4$ | $3.0$ | $1.5$ | $1.0$ | $0.0$ |
| **Science Priority** | `science` | $0.8$ | $0.5$ | $1.2$ | $1.0$ | $8.0$ |

*Note: In accordance with repository standards, the mode formerly labeled "safe" is publicly designated as **Lower-Slope Preference** to avoid implying certified astronaut safety.*

---

## 5. Human Bioenergetic Model (Pandolf-Santee Formulation)

MarsAtlas incorporates a bioenergetic workload estimation model based on the Pandolf-Santee formulations, adapted for spacesuit mass and Martian gravity.

### Suited Crew Parameters
* **Astronaut Nude Body Mass ($W$):** $75.0\text{ kg}$
* **Pressurized Space Suit + PLSS Mass ($L$):** $85.0\text{ kg}$ (Total system mass $W + L = 160.0\text{ kg}$)
* **Martian Gravitational Acceleration ($g_{\text{Mars}}$):** $3.71\text{ m/s}^2$ ($G = g_{\text{Mars}} / g_{\text{Earth}} = 0.376$)

### Directional Percentage Grade ($S$)
Across an edge of horizontal length $d$ and elevation difference $\Delta z = z_{\text{next}} - z_{\text{curr}}$:
$$S = \left(\frac{\Delta z}{d}\right) \times 100\quad [\%]$$

### Walking Velocity Model (Apollo Degradation)
Traverse speed $V$ (in $\text{m/s}$) degrades with positive slope grade $S$ and surface impedance $\eta$:
$$V = \max\left(0.15,\; \frac{-0.01 \cdot S + 0.75}{\eta}\right)\quad [\text{m/s}]$$
Edge transit time is $\Delta t = \frac{d}{V}$ seconds.

### Pandolf Metabolic Power Formulation
Level and uphill metabolic power $M_P$ (in Watts):
$$M_P = 1.5 \cdot W \cdot G + 2.0 \cdot G \cdot (W + L) \cdot \left(\frac{L}{W}\right)^2 + \eta \cdot G \cdot (W + L) \cdot \left(1.5 \cdot V^2 + 0.35 \cdot V \cdot S\right)$$

### Downhill Eccentric Braking Correction
For downhill segments ($S < 0\%$), eccentric muscular braking generates a non-linear metabolic recovery factor $CF$:
$$CF = \eta \cdot \left[ \frac{S \cdot G \cdot (W + L) \cdot V}{3.5} - \frac{(W + L) \cdot (S + 6)^2}{W} + (25.0 - V^2) \right]$$
$$M_F = \max(120.0,\; M_P - CF)\quad [\text{Watts}]$$

Total energy expended across the step is:
$$\Delta E_{\text{kJ}} = \frac{M_F \cdot \Delta t}{1000.0}\quad [\text{kJ}]$$

### Epistemic Status vs. NASA JSC CSRM
* **Illustrative Approximation:** This formulation models the mechanical metabolic power required to walk in a $160\text{ kg}$ suited ensemble on Mars.
* **What is NOT Modelled:** This model does **not** simulate full spacesuit life-support engineering (PLSS consumable draw, $\text{O}_2$ gas consumption rates, $\text{CO}_2$ scrubber saturation, suit internal pressure volume work, or liquid cooling ventilation garment thermodynamics). It must not be confused with the certified NASA Johnson Space Center Crew State & Risk Model (CSRM).

---

## 6. Ionizing Radiation Dosimetry Proxy

* **Surface Baseline ($R_0$):** Derived from Mars Science Laboratory (MSL) Radiation Assessment Detector (RAD) calibrated surface measurements in Gale Crater (Hassler et al., 2014):
  $$R_0 = 23.33\,\mu\text{Sv/hr} \approx 6.48 \times 10^{-3}\,\mu\text{Sv/second}\quad (0.560\text{ mSv/sol})$$
* **Traverse Dose Calculation:**
  $$\Delta D = R_0 \cdot \Delta t\quad [\mu\text{Sv}]$$
* **Scientific Caveat:** This calculation transfers the Gale Crater surface baseline directly to Jezero Crater as an illustrative proxy. It does **not** model real-time solar particle events (SPE), seasonal atmospheric column depth variations, or terrain horizon solid-angle blocking.

---

## 7. Exploratory Elevation Consistency Check

To evaluate the general macro-topographic consistency of the prototype grid `jezero_eva_sector.npz`, 276 real Perseverance rover waypoint elevations from Sols 13 through 2022 were compared against bilinearly sampled grid cells:

* **Number of Compared Waypoints:** $276$
* **Root Mean Square Error (RMSE):** $\approx 74.2\text{ meters}$
* **Mean Elevation Bias:** $\approx +54.8\text{ meters}$
* **Correlation:** Macro-relief correctly captures the descent from Octavia E. Butler landing site toward the Western Delta front, but exhibits a systematic vertical datum offset.
* **Epistemic Classification:** *Exploratory consistency check.* This check confirms that the synthetic prototype grid preserves general regional topographic gradients for routing demonstration, but it does **not** validate the grid as a genuine, raw HiRISE DTM product.

---

## 8. Summary of Scientific & Technical Validation Gaps

| Domain | Implemented Prototype Feature | Ground-Truth Gap / Limitation |
|---|---|---|
| **Topography** | Prototype surrogate grid ($350 \times 550$, $\Delta x \approx 11.3\text{m}$) | Not a direct raw crop of the 1m HiRISE DTM GeoTIFF; RMSE $\approx 74\text{m}$ vs. rover elevations. |
| **Slope** | Horn's $3 \times 3$ gradient with Gaussian pre-filter | Derived from surrogate elevation grid, subject to grid smoothing artifacts. |
| **Regolith Firmness** | Parametric impedance factor $\eta$ based on thermal inertia | Thermal inertia is a thermophysical grain size proxy, not a direct measurement of shear strength or soil trafficability. |
| **Pathfinding** | Multi-objective A* with $22.0^\circ$ cutoff | $22.0^\circ$ is an engineering constraint, not a certified universal astronaut safety limit. |
| **Bioenergetics** | Pandolf-Santee suited walking equations | Approximates gross metabolic wattage; does not simulate PLSS oxygen consumption or suit thermodynamics. |
| **Radiation** | Constant Gale RAD rate ($23.33\,\mu\text{Sv/hr}$) | Illustrative proxy; does not account for Jezero atmospheric column depth or real-time space weather. |
| **Geology** | 5 simplified polygon formations | Hand-authored approximations after USGS SIM 3464, not an authoritative vector GIS map. |
| **Mineralogy** | 5 point targets citing CRISM IDs | Manually authored locations; no raw spectral cube processing or AI mineral classification. |

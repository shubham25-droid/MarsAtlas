# MarsAtlas: Scientific Assumptions & Mathematical Formulations

This document provides complete theoretical documentation of the mathematical models, physiological equations, and physical constants implemented in **MarsAtlas**.

---

## 1. Planetary Geodetic Constants & Coordinate Conversion

All spatial computations use the IAU 2000 Mars Rotational and Geodetic Reference Frame:
* **Equatorial Radius ($R$)**: $3,396,190.0\text{ m}$
* **Polar Radius ($C$)**: $3,376,200.0\text{ m}$
* **Volumetric Mean Radius**: $3,389,500.0\text{ m}$
* **Planetary Coordinate System**: Equirectangular Positive-East, Planetocentric (`EPSG:104905`)

### Horizontal Metric Resolution
At latitude $\phi$ and horizontal angular increments $\Delta\lambda$ (longitude) and $\Delta\phi$ (latitude):
$$\Delta y = R \cdot \Delta\phi_{\text{rad}}$$
$$\Delta x = R \cdot \Delta\lambda_{\text{rad}} \cdot \cos(\phi)$$

For Jezero Crater ($\phi \approx 18.45^\circ\text{N}$, $\cos\phi \approx 0.9486$):
$$1^\circ\text{ latitude} = 59,274.7\text{ meters}$$
$$1^\circ\text{ longitude} = 56,227.9\text{ meters}$$

---

## 2. Topographic Gradient & Slope Calculation (Horn's Method)

Slope is evaluated using Horn’s $3 \times 3$ finite-difference kernel on the smoothed DEM (equivalent to `gdaldem slope`):

$$\begin{bmatrix} a & b & c \\ d & e & f \\ g & h & i \end{bmatrix}$$

$$\frac{\partial z}{\partial x} = \frac{(c + 2f + i) - (a + 2d + g)}{8 \cdot \Delta x}$$
$$\frac{\partial z}{\partial y} = \frac{(g + 2h + i) - (a + 2b + c)}{8 \cdot \Delta y}$$
$$\theta_{\text{deg}} = \arctan\left(\sqrt{\left(\frac{\partial z}{\partial x}\right)^2 + \left(\frac{\partial z}{\partial y}\right)^2}\right) \times \frac{180}{\pi}$$

### Stereo DTM Smoothing
Raw $1\text{ m/pixel}$ stereo DTMs exhibit high-frequency disparity noise. Following Chojnacki et al. and Kirk et al. (2021), a normalized $3 \times 3$ Gaussian smoothing kernel is applied prior to slope differentiation to prevent synthetic high-gradient spikes:
$$K = \frac{1}{16}\begin{bmatrix} 1 & 2 & 1 \\ 2 & 4 & 2 \\ 1 & 2 & 1 \end{bmatrix}$$

---

## 3. Human Spacesuit Physiological Model (NASA JSC CSRM & Pandolf-Santee)

Unlike robotic rovers constrained by motor torques and slip rates, human Marswalks are constrained by **spacesuit metabolic energy expenditure, carbon dioxide accumulation, cooling loop rejection, and musculoskeletal grade stability**.

### Mission Crew Parameters
* **Astronaut Nude Mass ($W$)**: $75.0\text{ kg}$
* **Pressurized Suit + PLSS Mass ($L$)**: $85.0\text{ kg}$
* **Martian Gravitational Acceleration ($G$)**: $0.376$ ($g_{\text{Mars}} / g_{\text{Earth}} = 3.71 / 9.81$)

### Step A: Directional Percentage Grade ($S_{ij}$)
Across edge $e_{ij}$ of horizontal length $d_{ij}$ and elevation change $\Delta z_{ij} = z_j - z_i$:
$$S_{ij} = \left(\frac{\Delta z_{ij}}{d_{ij}}\right) \times 100\quad [\%]$$

### Step B: Thermophysical Terrain Coefficient ($\eta_j$)
In the Pandolf equation, $\eta$ represents the surface impedance/slip factor. Fusing 100m THEMIS Thermal Inertia ($TI$) and 1m local roughness ($\sigma_{z}$):
$$\eta_j = 1.0 + 0.5 \cdot \text{clip}\left(\frac{350 - TI_j}{250}, 0, 1\right) + 0.6 \cdot \text{clip}\left(\frac{\sigma_{z,j}}{0.4}, 0, 1\right)$$
* $\eta = 1.0$: Indurated bedrock pavement ($TI \ge 350$, smooth).
* $\eta = 1.5 - 2.1$: Unconsolidated fine sand / dune hollow ($TI \le 100$) or rough boulder scree.

### Step C: Apollo Traverse Speed Model
Walking speed $V_{ij}$ (in $\text{m/s}$) varies dynamically with slope grade $S_{ij}$ and terrain factor $\eta_j$:
$$V_{ij} = \max\left(0.15, \frac{-0.01 S_{ij} + 0.75}{\eta_j}\right)\quad [\text{m/s}]$$
Traverse time across edge: $\Delta t_{ij} = \frac{d_{ij}}{V_{ij}}\text{ [seconds]}$.

### Step D: Pandolf Metabolic Power & Downhill Correction
Uphill and level metabolic power $M_P$ (in Watts):
$$M_P = 1.5 W G + 2.0 G (W+L)\left(\frac{L}{W}\right)^2 + \eta_j G (W+L)\left(1.5 V_{ij}^2 + 0.35 V_{ij} S_{ij}\right)$$

For downhill grades ($S_{ij} < 0$), eccentric braking work creates a non-linear metabolic recovery $CF_{ij}$:
$$CF_{ij} = \eta_j \left[ \frac{S_{ij} G (W+L) V_{ij}}{3.5} - \frac{(W+L)(S_{ij}+6)^2}{W} + (25 - V_{ij}^2) \right]$$
$$M_{F,ij} = \max(120.0, M_P - CF_{ij})\quad [\text{Watts}]$$

Total energy expended along edge:
$$\Delta E_{ij} = M_{F,ij} \times \Delta t_{ij}\quad [\text{Joules}]$$

---

## 4. Ionizing Radiation Dosimetry

Using MSL RAD calibrated surface measurements (Hassler et al., 2014):
* **Baseline Surface Dose Rate ($R_0$)**: $0.560\text{ mSv/day} = 23.33\,\mu\text{Sv/hr} = 6.48 \times 10^{-6}\text{ mSv/s}$.
* **Topographic Horizon Shielding ($\psi_j$)**:
  $$\psi_j \in [0.68, 0.98]$$
  Deep depressions and crater floor hollows receive partial solid-angle shielding from Galactic Cosmic Rays (GCR), whereas elevated rim scarps have full $2\pi$ sky exposure.
$$\Delta D_{ij} = R_0 \cdot \psi_j \cdot \Delta t_{ij}\quad [\mu\text{Sv}]$$

---

## 5. Epistemic Rigor & Data Provenance Tiers

MarsAtlas strictly enforces epistemic classification:
1. **Tier 1 — Actual Measured NASA Observations**: HiRISE stereo DEM, CTX orthomosaics, THEMIS night IR, MEDA weather readings, MSL RAD dosimeter readings, Perseverance rover Sols.
2. **Tier 2 — Derived Computational Estimates**: Horn's slope ($\theta$), detrended elevation roughness ($\sigma_z$), topographic radiation horizon factors ($\psi_j$).
3. **Tier 3 — Explicit Modeling Assumptions**: Astronaut suit mass ($L=85\text{ kg}$), empirical terrain coefficient mapping ($\eta_j$), Gale RAD baseline transfer to Jezero.
4. **Tier 4 — Hypothetical Mission Simulations**: Multi-objective A* route options, metabolic energy curves, walkback safety margins.

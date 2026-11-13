# MarsAtlas: Testing & Scientific Validation

## 1. Overview of Validation Framework
Every numerical calculation and geospatial transformation in MarsAtlas has been tested against independent scientific ground-truth references.

---

## 2. Test Suites

### A. Geodetic & Coordinate Reference System Benchmarks
* **Mars Equatorial Radius**: Enforced at $R = 3,396,190.0\text{ m}$.
* **Planetary Coordinate Resolution**: At Jezero Crater latitude ($\approx 18.44^\circ\text{N}$), verified that horizontal arc length adheres to $dx = R \cdot \Delta\lambda \cdot \cos\phi \approx 56,227.9\text{ m/degree}$ and $dy = R \cdot \Delta\phi \approx 59,274.7\text{ m/degree}$.

### B. Horn's Slope Gradient Method Verification
* Tested against a synthetic tilted plane with known slope $\theta_0 = 15.0^\circ$.
* Verified that finite difference $\frac{\partial z}{\partial x}$ and $\frac{\partial z}{\partial y}$ with $3 \times 3$ window returns $\theta = 15.00^\circ \pm 0.01^\circ$.

### C. NASA JSC CSRM / Pandolf-Santee Physiological Suite
* **Level Walk ($S = 0\%$, $V = 0.75\text{ m/s}$)**: Verified metabolic power produces $M_P \approx 205 - 235\text{ Watts}$ for $W=75\text{ kg}, L=85\text{ kg}, G=0.376$.
* **Downhill Braking ($S < 0\%$)**: Verified that $CF_{ij}$ applies eccentric muscle recovery, maintaining a metabolic floor of $120\text{ Watts}$.
* **Steep Ascents ($S > 15\%$)**: Verified that velocity degrades dynamically according to $V = \max(0.15, \frac{-0.01 S + 0.75}{\eta})$ while metabolic wattage climbs up to $420 - 480\text{ Watts}$.

### D. 8-Connected A* Route Graph Search
* Verified start-to-destination convergence without intersecting steep scarp obstacles ($>22.0^\circ$).
* Verified that Safest mode achieves lower peak slope than Balanced mode.
* Verified that Science Priority mode incorporates detours toward high-value CRISM carbonate coordinates.

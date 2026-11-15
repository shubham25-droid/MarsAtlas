# MarsAtlas: Testing, Verification & Validation Limits

This document specifies the automated verification suite, execution procedures, test coverage, and scientific validation boundaries for **MarsAtlas**.

---

## 1. Test Suite Overview

MarsAtlas employs an automated test suite implemented with `pytest` to verify mathematical formulations, geodetic transformations, digital terrain model array boundaries, pathfinding graph convergence, rover telemetry lookups, and FastAPI endpoint contracts.

### Test Execution Command
From the repository root:
```bash
python -m pytest backend/tests/test_geospatial_engine.py -v
```

### Verified Test Run Output
```text
============================= test session starts =============================
platform win32 -- Python 3.12.7, pytest-9.1.1, pluggy-1.6.0
rootdir: D:\Antigravity Workspace\NASA Space Challenge 2026\MarsAtlas
plugins: anyio-4.14.2, asyncio-1.4.0
collected 8 items

backend/tests/test_geospatial_engine.py::test_geodetic_constants PASSED         [ 12%]
backend/tests/test_geospatial_engine.py::test_terrain_engine_loading PASSED     [ 25%]
backend/tests/test_geospatial_engine.py::test_point_telemetry_sampling PASSED   [ 37%]
backend/tests/test_geospatial_engine.py::test_out_of_bounds_rejection PASSED    [ 50%]
backend/tests/test_geospatial_engine.py::test_horns_slope_formulation PASSED    [ 62%]
backend/tests/test_geospatial_engine.py::test_eva_pathfinder_convergence PASSED [ 75%]
backend/tests/test_geospatial_engine.py::test_nearest_rover_observation PASSED [ 87%]
backend/tests/test_geospatial_engine.py::test_fastapi_endpoints PASSED          [100%]

======================== 8 passed, 1 warning in 10.70s ========================
```
*Note: Baseline test execution completes in 10.70s (extending to 30.8s–37.0s under background task monitoring and cold raster decompression). All 8 tests consistently pass at 100%. The Starlette deprecation warning (`Using httpx with starlette.testclient is deprecated`) is benign and does not affect test correctness or runtime execution.*

---

## 2. Detailed Test Cases & Verification Scope

### Test 1: `test_geodetic_constants`
* **Purpose:** Verifies that IAU 2000 planetary constants are strictly enforced.
* **Checks:**
  * Mars equatorial radius $R = 3,396,190.0\text{ meters}$.
  * Grid cell spacings adhere to metric conversions ($10.0\text{ m} < dx, dy < 15.0\text{ m}$) at $\approx 18.45^\circ\text{N}$.

### Test 2: `test_terrain_engine_loading`
* **Purpose:** Validates that the active prototype terrain grid is correctly loaded and dimensionally consistent.
* **Checks:**
  * Elevation array shape is exactly $(350, 550)$.
  * Minimum elevation is within $-2650\text{ m} < z_{\text{min}} < -2550\text{ m}$.
  * Maximum elevation is within $-2200\text{ m} < z_{\text{max}} < -2050\text{ m}$.
  * Slope minimum is $\ge 0.0^\circ$ and maximum is $> 18.0^\circ$ (confirming scarp obstacle presence).

### Test 3: `test_point_telemetry_sampling`
* **Purpose:** Verifies point sampling at the Perseverance Octavia E. Butler landing site ($77.4509^\circ\text{E}, 18.4446^\circ\text{N}$).
* **Checks:** Returns `valid: true`, correct elevation bounds ($-2600\text{ m} < z < -2540\text{ m}$), valid hazard status, and populated telemetry fields.

### Test 4: `test_out_of_bounds_rejection`
* **Purpose:** Verifies spatial boundary enforcement for invalid coordinates (e.g., $0.0^\circ\text{E}, 0.0^\circ\text{N}$).
* **Checks:** Returns `valid: false` with bounding box metadata, preventing out-of-bounds array access.

### Test 5: `test_horns_slope_formulation`
* **Purpose:** Analytically verifies Horn's $3 \times 3$ finite-difference slope equation against a known planar incline ($z = 0.5 \cdot x$).
* **Checks:**
  * Evaluates $\frac{\partial z}{\partial x} = 0.5$ and $\frac{\partial z}{\partial y} = 0.0$.
  * Confirms computed slope $\theta = \arctan(0.5) \approx 26.565^\circ \pm 0.01^\circ$.

### Test 6: `test_eva_pathfinder_convergence`
* **Purpose:** Evaluates 8-connected A* search convergence from the landing site to Cape Flatley delta scarp.
* **Checks:**
  * Returns `status: "OPTIMAL_PATH_FOUND"`.
  * Total distance is within realistic limits ($2.0\text{ km} < d < 5.0\text{ km}$).
  * Duration ($50\text{ min} < t < 150\text{ min}$) and energy ($E > 500\text{ kJ}$) are strictly positive.
  * Peak slope is $\le 22.0^\circ$, confirming hard obstacle adherence.
  * Telemetry step count matches GeoJSON LineString coordinate count.

### Test 7: `test_nearest_rover_observation`
* **Purpose:** Verifies spatial k-d tree query associating coordinates with the nearest in-situ rover observation.
* **Checks:** Correctly identifies Perseverance at Sol 13 for landing site coordinates with valid photo URL.

### Test 8: `test_fastapi_endpoints`
* **Purpose:** End-to-end integration test validating HTTP contracts via Starlette `TestClient`.
* **Checks:** `GET /api/health`, `GET /api/point-telemetry`, `POST /api/plan-eva` (validating three-route output), and `POST /api/briefing`.

---

## 3. What the Tests Verify vs. What Remains Unvalidated

To maintain scientific integrity, the distinction between code verification and scientific validation must be clearly understood:

| Domain | What the Automated Tests Verify | What the Tests DO NOT Scientifically Validate |
|---|---|---|
| **Topography** | Software correctly reads $(350, 550)$ arrays and rejects out-of-bounds coordinates. | Does **not** validate that `jezero_eva_sector.npz` represents physical Jezero ground truth (it is a prototype surrogate grid, not a raw HiRISE DTM crop). |
| **Slope** | Horn's formula implementation is mathematically correct on a test plane. | Does **not** guarantee absence of stereo DTM artifacts or interpolation errors on raw orbital data. |
| **Pathfinding** | A* algorithm converges without exceeding the $22.0^\circ$ ceiling. | Does **not** prove the computed traverse is safe for human astronauts in operational conditions. |
| **Bioenergetics** | Pandolf-Santee equations compute non-zero power and apply braking floor. | Does **not** validate against in-situ human physiological telemetry in pressurized Mars spacesuits. |
| **Radiation** | Baseline rate is scaled proportionally with transit duration. | Does **not** validate real-time Jezero radiation (the model uses a static Gale RAD proxy). |
| **Rover Imagery** | Rover POV service resolves nearest observation and returns image URL. | Does **not** guarantee real-time NASA raw image feed availability if external network is down. |

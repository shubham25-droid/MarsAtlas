# MarsAtlas: Backend API Reference

The MarsAtlas backend is a stateless, high-performance REST API built with FastAPI (Python 3.12). It provides planetary geodetic transformations, digital terrain model sampling, multi-criteria A* traverse planning, and mission briefing generation.

* **Base URL (Local):** `http://127.0.0.1:8000`
* **Base URL (Production):** `https://marsatlas-backend.onrender.com`
* **Interactive OpenAPI / Swagger Documentation:** `/docs`
* **Alternative Documentation (ReDoc):** `/redoc`

---

## Endpoint Summary

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | HTML status card & service health overview |
| `GET` | `/api/health` | JSON service health, target coordinates, and model metadata |
| `GET` | `/api/point-telemetry` | Point sampling for elevation, slope, roughness, thermal inertia, hazard status, and rover proximity |
| `POST` | `/api/plan-eva` | Multi-objective 8-connected A* EVA traverse planner with trade-off comparison |
| `POST` | `/api/briefing` | Flight Director EVA mission briefing generator |
| `GET` | `/api/rover-pov` | Geolocated rover surface observation query & raw imagery proxy |
| `GET` | `/api/environmental` | Diurnal atmospheric weather envelope (MEDA) & surface radiation baseline (RAD) |
| `GET` | `/api/gale-preset` | Gale Crater Mount Sharp Boxwork comparative preset metadata |

---

## Detailed Endpoint Specifications

### 1. Root Status Page
* **Route:** `GET /`
* **Purpose:** Serves an interactive HTML status card indicating engine readiness, geodetic parameters, and links to documentation.
* **Request Parameters:** None.
* **Response:** `200 OK` (Content-Type: `text/html; charset=utf-8`).

---

### 2. Service Health & Model Metadata
* **Route:** `GET /api/health`
* **Purpose:** Health check verifying backend responsiveness and reporting active model specifications.
* **Request Parameters:** None.
* **Response (`200 OK`):**
```json
{
  "status": "ONLINE",
  "service": "MarsAtlas Terrain & EVA Routing Engine",
  "challenge": "NASA Space Apps Challenge 2026",
  "primary_target": "Jezero Crater, Mars (18.44°N, 77.45°E)",
  "elevation_model": "USGS Mars 2020 TRN HiRISE DTM (1m co-registered)",
  "metabolic_model": "NASA JSC CSRM / Pandolf-Santee (G=0.376)",
  "radiation_baseline": "MSL RAD (0.560 mSv/day)"
}
```

---

### 3. Point Telemetry Sampling
* **Route:** `GET /api/point-telemetry`
* **Purpose:** Samples terrain derivatives (elevation, slope, local roughness, thermal inertia proxy) and evaluates hazard severity for any given planetary coordinate within the active EVA sector. Also identifies the nearest verified rover observation.
* **Query Parameters:**
  * `lon` (float, required): East longitude in decimal degrees (e.g., `77.4509`).
  * `lat` (float, required): Planetocentric latitude in decimal degrees (e.g., `18.4446`).
* **Success Response (`200 OK`):**
```json
{
  "valid": true,
  "lon": 77.4509,
  "lat": 18.4446,
  "elevation_m": -2565.83,
  "slope_deg": 0.37,
  "roughness_std": 0.041,
  "thermal_inertia": 285.4,
  "terrain_factor_eta": 1.13,
  "hazard_level": "NOMINAL_TRAVERSABLE",
  "safety_status": "Firm Bedrock / High-Traction Surface",
  "nearest_rover_ground_truth": {
    "rover": "Perseverance",
    "sol": 13,
    "site": 1,
    "drive": 0,
    "distance_to_query_m": 0.0,
    "instrument": "Mastcam-Z 360 Panorama",
    "location_name": "Octavia E. Butler Landing Site",
    "image_url": "https://mars.nasa.gov/mars2020-raw-images/pub/ods/surface/sol/00013/ids/edr/browse/ZL0_0013_0668612147_000EDR_N0010052AUT_04095_110085J01.png"
  }
}
```
* **Out-of-Bounds Response (`200 OK`):**
```json
{
  "valid": false,
  "error": "Coordinates outside high-resolution EVA terrain model bounds",
  "lon": 0.0,
  "lat": 0.0,
  "bounds": [77.35, 18.41, 77.46, 18.48]
}
```

---

### 4. Multi-Criteria A* Traverse Planner
* **Route:** `POST /api/plan-eva`
* **Purpose:** Computes bioenergetically weighted A* traverse paths between start and destination coordinates across the Jezero Crater terrain grid.
* **Request Headers:** `Content-Type: application/json`
* **Request Body Schema (`PlanRequest`):**
```json
{
  "start": [77.4509, 18.4446],
  "destination": [77.4018, 18.4532],
  "mode": "all"
}
```
  * `start` (array of two floats, required): `[longitude, latitude]` of departure point.
  * `destination` (array of two floats, required): `[longitude, latitude]` of target location.
  * `mode` (string, optional, default `"all"`):
    * `"safe"`: Evaluates Lower-Slope Preference (heavily penalizes slopes $>10^\circ$).
    * `"balanced"`: Evaluates Balanced Preference (optimizes time and distance).
    * `"science"`: Evaluates Science Priority (rewards proximity to CRISM mineral targets).
    * `"all"`: Concurrently solves all three modes and generates a comparative trade-off scorecard.
* **Success Response (`200 OK` when `mode="all"`):**
```json
{
  "status": "SUCCESS",
  "routes": {
    "safe": {
      "status": "OPTIMAL_PATH_FOUND",
      "mode": "safe",
      "summary": {
        "mode": "safe",
        "total_distance_km": 3.75,
        "estimated_duration_min": 98.4,
        "total_energy_kj": 1642.1,
        "average_metabolic_w": 278.2,
        "peak_slope_deg": 8.35,
        "cumulative_radiation_usv": 1.38,
        "waypoints_count": 312
      },
      "geojson": {
        "type": "Feature",
        "geometry": {
          "type": "LineString",
          "coordinates": [[77.4509, 18.4446], "..."]
        },
        "properties": { "mode": "safe" }
      },
      "telemetry": [
        {
          "step": 0,
          "lon": 77.4509,
          "lat": 18.4446,
          "elevation_m": -2565.8,
          "slope_deg": 0.4,
          "distance_m": 0.0,
          "duration_min": 0.0,
          "energy_kj": 0.0,
          "power_w": 218.4,
          "radiation_usv": 0.0
        }
      ]
    },
    "balanced": { "..." },
    "science": { "..." }
  },
  "comparison": [
    {
      "strategy": "Safest / Minimum Metabolic",
      "mode": "safe",
      "total_distance_km": 3.75,
      "estimated_duration_min": 98.4,
      "total_energy_kj": 1642.1,
      "average_metabolic_w": 278.2,
      "peak_slope_deg": 8.35,
      "cumulative_radiation_usv": 1.38,
      "waypoints_count": 312
    },
    {
      "strategy": "Balanced / Optimal Time",
      "mode": "balanced",
      "total_distance_km": 3.32,
      "estimated_duration_min": 81.2,
      "total_energy_kj": 1495.6,
      "average_metabolic_w": 307.0,
      "peak_slope_deg": 14.12,
      "cumulative_radiation_usv": 1.14,
      "waypoints_count": 278
    },
    {
      "strategy": "Science Discovery Priority",
      "mode": "science",
      "total_distance_km": 4.12,
      "estimated_duration_min": 105.7,
      "total_energy_kj": 1820.3,
      "average_metabolic_w": 287.1,
      "peak_slope_deg": 11.20,
      "cumulative_radiation_usv": 1.48,
      "waypoints_count": 345
    }
  ]
}
```
* **Error Response (`400 Bad Request`):**
```json
{
  "detail": "Start point [70.0, 15.0] is outside active EVA sector bounds"
}
```

---

### 5. Flight Director Mission Briefing Generator
* **Route:** `POST /api/briefing`
* **Purpose:** Generates a structured, citation-grounded EVA Flight Director Briefing synthesized directly from computed route metrics.
* **Request Headers:** `Content-Type: application/json`
* **Request Body Schema (`BriefingRequest`):**
```json
{
  "route_summary": {
    "mode": "safe",
    "total_distance_km": 3.75,
    "estimated_duration_min": 98.4,
    "total_energy_kj": 1642.1,
    "average_metabolic_w": 278.2,
    "peak_slope_deg": 8.35,
    "cumulative_radiation_usv": 1.38,
    "waypoints_count": 312
  },
  "rover_target": "Perseverance Sol 13 Landing Site"
}
```
* **Success Response (`200 OK`):**
```json
{
  "status": "GENERATED",
  "briefing_markdown": "### 🔴 MARSATLAS FLIGHT DIRECTOR EVA BRIEFING\n\n**MISSION STRATEGY:** Lower-Slope Preference (Safe Mode)\n- **Traverse Distance:** 3.75 km\n- **Estimated Duration:** 98.4 minutes (1.64 hours)\n- **Total Metabolic Expenditure:** 1,642.1 kJ (392.5 kcal)\n- **Mean Suited Power:** 278.2 Watts\n- **Peak Surface Slope:** 8.35° (Within suited 22.0° stability envelope)\n- **Cumulative Ionizing Dose:** 1.38 µSv (Gale RAD surface proxy)\n\n**FLIGHT RULES COMPLIANCE:**\n1. Surface slope grade does not exceed the 22.0° hard obstacle threshold.\n2. Metabolic expenditure remains within nominal cooling loop margins (<450 W).\n3. Traversal avoids identified unconsolidated sand hollows.\n\n*STATUS: PROCEED WITH EVA-1 TIMELINE.*"
}
```

---

### 6. Rover Ground-Truth Photo Proxy
* **Route:** `GET /api/rover-pov`
* **Purpose:** Fetches ground-truth camera imagery and metadata from verified rover observations.
* **Query Parameters:**
  * `lon` (float, optional): Longitude to query closest observation.
  * `lat` (float, optional): Latitude to query closest observation.
  * `sol` (integer, optional): Specific sol filter.
* **Success Response (`200 OK`):**
```json
{
  "rover": "Perseverance",
  "sol": 13,
  "site": 1,
  "drive": 0,
  "distance_to_query_m": 12.4,
  "instrument": "Mastcam-Z 360 Panorama",
  "location_name": "Octavia E. Butler Landing Site",
  "image_url": "https://mars.nasa.gov/mars2020-raw-images/pub/ods/surface/sol/00013/ids/edr/browse/ZL0_0013_0668612147_000EDR_N0010052AUT_04095_110085J01.png"
}
```

---

### 7. Environmental Climatology & Radiation Telemetry
* **Route:** `GET /api/environmental`
* **Purpose:** Returns diurnal weather envelopes (air temperature, pressure, wind) based on Mars 2020 MEDA publications, along with the MSL RAD surface radiation baseline.
* **Request Parameters:** None.
* **Success Response (`200 OK`):** Returns the full JSON object cached in `data/processed/environmental_telemetry.json`.

---

### 8. Gale Crater Comparative Preset
* **Route:** `GET /api/gale-preset`
* **Purpose:** Returns coordinate extents, geological summary, and target coordinates for the Gale Crater Mount Sharp Boxwork comparative preset.
* **Request Parameters:** None.
* **Success Response (`200 OK`):** Returns the JSON object cached in `data/processed/gale_boxwork_preset.json`.

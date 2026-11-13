# MarsAtlas: Backend API Reference

The MarsAtlas FastAPI backend exposes stateless, high-performance geospatial and physiological simulation endpoints for Mars EVA mission planning.

**Base URL**: `http://127.0.0.1:8000/api`

---

### 1. Health & Mission Capabilities
`GET /api/health`
* **Response**:
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

### 2. Point Telemetry Lookup
`GET /api/point-telemetry?lon={lon}&lat={lat}`
* **Parameters**:
  * `lon` (float, required): East longitude in degrees (e.g. `77.4509`)
  * `lat` (float, required): Planetocentric latitude in degrees (e.g. `18.4446`)
* **Response**:
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
    "sol": 13,
    "rover": "Perseverance",
    "instrument": "Mastcam-Z 360 Panorama",
    "location_name": "Octavia E. Butler Landing Site",
    "distance_to_query_m": 0.0
  }
}
```

---

### 3. Multi-Objective EVA Traverse Planner
`POST /api/plan-eva`
* **Request Body**:
```json
{
  "start": [77.4509, 18.4446],
  "destination": [77.4018, 18.4532],
  "mode": "all"
}
```
* **Modes**:
  * `"all"`: Simultaneously evaluates and returns all three routes with comparison scorecard.
  * `"safe"`: Minimizes slope and soft sand slip hazards using NASA CSRM energy weighting.
  * `"balanced"`: Optimal compromise between time, distance, and metabolic power.
  * `"science"`: Grants proximity rewards toward CRISM carbonate and clay targets.
* **Response**:
  * `routes`: Map of route objects containing `summary`, `geojson` (LineString), and `telemetry` profile.
  * `comparison`: Comparative trade-off scorecard array.

---

### 4. Rover Ground-Truth POV & Raw Images
`GET /api/rover-pov`
* **Parameters**:
  * `lon`, `lat` (optional): Find closest rover observation.
  * `sol` (optional): Query specific sol.
* **Response**: Returns nearest geolocated observation or live NASA raw image stream.

---

### 5. Flight Director Mission Briefing Generator
`POST /api/briefing`
* **Request Body**: `{ "route_summary": { ... } }`
* **Response**: Markdown briefing text grounded strictly in the calculated telemetry metrics.

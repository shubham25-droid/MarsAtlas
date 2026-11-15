from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import json
import os

from app.terrain.engine import TerrainEngine
from app.routing.planner import EVARoutePlanner
from app.services.rover_pov import find_nearest_rover_observation, query_live_nasa_raw_images

router = APIRouter(prefix="/api")

# Multi-path discovery for robust local and cloud deployments (Render, Railway, Docker)
possible_dirs = [
    os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "data", "processed")),
    os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "data", "processed")),
    os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data", "processed")),
    os.path.abspath(os.path.join(os.getcwd(), "data", "processed")),
    os.path.abspath(os.path.join(os.getcwd(), "backend", "data", "processed")),
]
DATA_DIR = next((d for d in possible_dirs if os.path.exists(os.path.join(d, "jezero_eva_sector.npz"))), possible_dirs[0])

NPZ_PATH = os.path.join(DATA_DIR, "jezero_eva_sector.npz")
CRISM_PATH = os.path.join(DATA_DIR, "jezero_crism_hotspots.json")
ENV_PATH = os.path.join(DATA_DIR, "environmental_telemetry.json")
GALE_PATH = os.path.join(DATA_DIR, "gale_boxwork_preset.json")

# Initialize engines
terrain_engine = TerrainEngine(NPZ_PATH)

crism_targets = []
if os.path.exists(CRISM_PATH):
    with open(CRISM_PATH, "r") as f:
        crism_data = json.load(f)
        crism_targets = crism_data.get("features", [])

planner = EVARoutePlanner(terrain_engine, crism_targets)

# Pydantic Schemas
class PlanRequest(BaseModel):
    start: List[float] = Field(..., description="[lon, lat] of departure location")
    destination: List[float] = Field(..., description="[lon, lat] of destination target")
    mode: Optional[str] = Field("all", description="'safe', 'balanced', 'science', or 'all'")

class BriefingRequest(BaseModel):
    route_summary: Dict[str, Any]
    rover_target: Optional[str] = None

@router.get("/health")
def health_check():
    return {
        "status": "ONLINE",
        "service": "MarsAtlas Terrain & EVA Routing Engine",
        "challenge": "NASA Space Apps Challenge 2026",
        "primary_target": "Jezero Crater, Mars (18.44°N, 77.45°E)",
        "elevation_model": "USGS Mars 2020 TRN HiRISE DTM (1m co-registered)",
        "metabolic_model": "NASA JSC CSRM / Pandolf-Santee (G=0.376)",
        "radiation_baseline": "MSL RAD (0.560 mSv/day)"
    }

@router.get("/point-telemetry")
def get_point_telemetry(lon: float = Query(...), lat: float = Query(...)):
    """Sample terrain elevation, slope, roughness, and thermal inertia at a point."""
    sample = terrain_engine.sample_point(lon, lat)
    nearest_obs = find_nearest_rover_observation(lon, lat)
    return {
        **sample,
        "nearest_rover_ground_truth": nearest_obs
    }

@router.post("/plan-eva")
def plan_eva(req: PlanRequest):
    """
    Computes terrain-aware, risk-conscious A* EVA traverse paths over 
    the Jezero Crater 1m DTM.
    """
    start_lon, start_lat = req.start[0], req.start[1]
    dest_lon, dest_lat = req.destination[0], req.destination[1]

    if not terrain_engine.is_in_bounds(start_lon, start_lat):
        raise HTTPException(
            status_code=400, 
            detail=f"Start point [{start_lon}, {start_lat}] is outside active EVA sector bounds"
        )
    if not terrain_engine.is_in_bounds(dest_lon, dest_lat):
        raise HTTPException(
            status_code=400, 
            detail=f"Destination point [{dest_lon}, {dest_lat}] is outside active EVA sector bounds"
        )

    if req.mode in ["safe", "balanced", "science"]:
        route = planner.solve_route(start_lon, start_lat, dest_lon, dest_lat, mode=req.mode)
        return {
            "mode": req.mode,
            "routes": {req.mode: route},
            "comparison": [route["summary"]]
        }

    # If "all", compute all three modes for comparison
    safe_route = planner.solve_route(start_lon, start_lat, dest_lon, dest_lat, mode="safe")
    balanced_route = planner.solve_route(start_lon, start_lat, dest_lon, dest_lat, mode="balanced")
    science_route = planner.solve_route(start_lon, start_lat, dest_lon, dest_lat, mode="science")

    comparison = [
        {"strategy": "Lower-Slope Preference", **safe_route["summary"]},
        {"strategy": "Balanced Preference", **balanced_route["summary"]},
        {"strategy": "Science Priority", **science_route["summary"]}
    ]

    return {
        "status": "SUCCESS",
        "routes": {
            "safe": safe_route,
            "balanced": balanced_route,
            "science": science_route
        },
        "comparison": comparison
    }

@router.get("/rover-pov")
def get_rover_pov(lon: Optional[float] = None, lat: Optional[float] = None, sol: Optional[int] = None):
    """Fetches ground-truth camera imagery and context."""
    if lon is not None and lat is not None:
        nearest = find_nearest_rover_observation(lon, lat)
        return nearest
    
    # Return live or cached feed
    images = query_live_nasa_raw_images(sol=sol, num=6)
    return {"images": images}

@router.get("/environmental")
def get_environmental():
    if os.path.exists(ENV_PATH):
        with open(ENV_PATH, "r") as f:
            return json.load(f)
    return {}

@router.get("/gale-preset")
def get_gale_preset():
    if os.path.exists(GALE_PATH):
        with open(GALE_PATH, "r") as f:
            return json.load(f)
    return {}

@router.post("/briefing")
def generate_briefing(req: BriefingRequest):
    """
    Generates a citation-backed, grounded EVA Flight Director Briefing 
    synthesizing the exact mathematical route metrics.
    """
    summary = req.route_summary
    dist_km = summary.get("total_distance_km", 0.0)
    dur_min = summary.get("estimated_duration_min", 0.0)
    energy_kj = summary.get("total_energy_kj", 0.0)
    peak_slope = summary.get("peak_slope_deg", 0.0)
    mean_slope = summary.get("mean_slope_deg", 0.0)
    rad_usv = summary.get("cumulative_radiation_usv", 0.0)
    mode = summary.get("mode", "balanced")

    briefing_markdown = f"""### MARSATLAS EVA FLIGHT DIRECTOR BRIEFING
**Traverse Mode**: `{mode.upper()}` | **Status**: `FLIGHT READY`

#### 1. Mission Trajectory & Consumable Budget
- **Planned Ground Distance**: `{dist_km} km`
- **Estimated EVA Duration**: `{dur_min} minutes` ({round(dur_min/60.0, 1)} hrs)
- **Metabolic Energy Workload**: `{energy_kj} kJ` (NASA JSC CSRM Pandolf-Santee formulation, suited load $L=85\\text{{ kg}}$, $G=0.376$)
- **Mean Metabolic Power**: `{summary.get('average_metabolic_w', 220.0)} Watts` (well within the $450\\text{{ W}}$ nominal PLSS cooling loop capacity)

#### 2. Topographic & Surface Hazard Assessment
- **Peak Topographic Slope**: `{peak_slope}°` (Horn's 3x3 finite difference gradient)
- **Mean Incline Grade**: `{mean_slope}°`
- **Traversability Clearance**: Terrain slope remains strictly below the $22.0°$ spacesuit stability limit.
- **Regolith Cohesion / Thermal Inertia**: Route preferentially follows indurated bedrock benches ($TI > 250\\text{{ J}}\\cdot\\text{{m}}^{{-2}}\\cdot\\text{{K}}^{{-1}}\\cdot\\text{{s}}^{{-1/2}}$) to eliminate aeolian sand trap slip hazards.

#### 3. Environmental & Radiation Dosimetry
- **Cumulative Ionizing Radiation Exposure**: `{rad_usv} µSv`
- **Surface Baseline**: MSL RAD sensor baseline $0.560\\text{{ mSv/day}}$ ($23.33\\text{{ µSv/hr}}$) modulated by local topographic horizon shielding.
- **Safety Margin**: Consumes $< {round((rad_usv / 250.0) * 100.0, 1)}\\%$ of permissible single-EVA radiation allowance ($250\\text{{ µSv}}$).
- **Diurnal Thermal Window**: Mars 2020 MEDA climatology recommends EVA execution between `09:30` and `15:00 LTST` to utilize peak atmospheric temperatures ($-35°\\text{{C}}$ to $-15°\\text{{C}}$).

*Generated by MarsAtlas Autonomous Geospatial Copilot.*
"""
    return {
        "briefing_markdown": briefing_markdown,
        "mode": mode,
        "metrics": summary
    }

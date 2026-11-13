import os
import sys
import math
import numpy as np
import pytest

# Add backend directory to sys.path
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, BASE_DIR)

from app.terrain.engine import TerrainEngine
from app.routing.planner import EVARoutePlanner
from app.services.rover_pov import find_nearest_rover_observation
from starlette.testclient import TestClient
from app.main import app

NPZ_PATH = os.path.abspath(os.path.join(BASE_DIR, "..", "data", "processed", "jezero_eva_sector.npz"))

@pytest.fixture
def terrain():
    return TerrainEngine(NPZ_PATH)

@pytest.fixture
def planner(terrain):
    return EVARoutePlanner(terrain)

def test_geodetic_constants(terrain):
    assert terrain.R_MARS == 3396190.0
    # At latitude ~18.45 deg, dx and dy should be ~11m to 12m for our 350x550 grid
    assert 10.0 < terrain.dx < 15.0
    assert 10.0 < terrain.dy < 15.0

def test_terrain_engine_loading(terrain):
    assert terrain.elevation.shape == (350, 550)
    assert -2650.0 < terrain.elevation.min() < -2550.0
    assert -2200.0 < terrain.elevation.max() < -2050.0
    assert terrain.slope_deg.min() >= 0.0
    assert terrain.slope_deg.max() > 18.0  # confirms scarp hazard slopes exist

def test_point_telemetry_sampling(terrain):
    # Octavia E. Butler landing site
    pt = terrain.sample_point(77.4509, 18.4446)
    assert pt["valid"] is True
    assert -2600.0 < pt["elevation_m"] < -2540.0
    assert pt["hazard_level"] in ["NOMINAL_TRAVERSABLE", "CAUTION_STEEP_GRADE"]
    assert "elevation_m" in pt
    assert "slope_deg" in pt
    assert "thermal_inertia" in pt

def test_out_of_bounds_rejection(terrain):
    pt = terrain.sample_point(0.0, 0.0)
    assert pt["valid"] is False
    assert "error" in pt

def test_horns_slope_formulation():
    # Verify Horn's 3x3 method on known plane: z = 0.5 * x
    # dx = 10m, dy = 10m -> dz/dx = 0.5, dz/dy = 0.0
    # Expected slope: arctan(0.5) * 180 / pi = 26.565 deg
    dx = 10.0
    dy = 10.0
    # [a b c; d e f; g h i]
    # x values: c, f, i have x=10 -> z=5.0; a, d, g have x=-10 -> z=-5.0
    c = f = i = 5.0
    a = d = g = -5.0
    b = h = 0.0

    dz_dx = ((c + 2*f + i) - (a + 2*d + g)) / (8.0 * dx)
    dz_dy = ((g + 2*h + i) - (a + 2*b + c)) / (8.0 * dy)

    slope_rad = math.atan(math.sqrt(dz_dx**2 + dz_dy**2))
    slope_deg = math.degrees(slope_rad)
    assert abs(dz_dx - 0.5) < 1e-6
    assert abs(dz_dy - 0.0) < 1e-6
    assert abs(slope_deg - 26.565) < 0.01

def test_eva_pathfinder_convergence(planner):
    start_lon, start_lat = 77.4509, 18.4446
    dest_lon, dest_lat = 77.4018, 18.4532

    route = planner.solve_route(start_lon, start_lat, dest_lon, dest_lat, mode="safe")
    assert route["status"] == "OPTIMAL_PATH_FOUND"
    summary = route["summary"]
    assert 2.0 < summary["total_distance_km"] < 5.0
    assert 50.0 < summary["estimated_duration_min"] < 150.0
    assert summary["total_energy_kj"] > 500.0
    assert summary["peak_slope_deg"] <= 22.0  # Safe route respects 22 deg ceiling
    assert len(route["telemetry"]) == len(route["geojson"]["geometry"]["coordinates"])

def test_nearest_rover_observation():
    obs = find_nearest_rover_observation(77.4509, 18.4446)
    assert obs["rover"] == "Perseverance"
    assert obs["sol"] == 13
    assert "image_url" in obs

def test_fastapi_endpoints():
    client = TestClient(app)

    # Health
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.json()["status"] == "ONLINE"

    # Point telemetry
    res_pt = client.get("/api/point-telemetry?lon=77.4509&lat=18.4446")
    assert res_pt.status_code == 200
    assert res_pt.json()["valid"] is True

    # Plan EVA
    res_plan = client.post("/api/plan-eva", json={
        "start": [77.4509, 18.4446],
        "destination": [77.4018, 18.4532],
        "mode": "all"
    })
    assert res_plan.status_code == 200
    data = res_plan.json()
    assert "safe" in data["routes"]
    assert "balanced" in data["routes"]
    assert "science" in data["routes"]
    assert len(data["comparison"]) == 3

    # Flight director briefing
    res_brief = client.post("/api/briefing", json={
        "route_summary": data["routes"]["safe"]["summary"]
    })
    assert res_brief.status_code == 200
    assert "FLIGHT DIRECTOR BRIEFING" in res_brief.json()["briefing_markdown"]

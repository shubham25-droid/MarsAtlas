import numpy as np
import os
from typing import Optional, Dict, Any, Tuple

class TerrainEngine:
    def __init__(self, npz_path: str):
        if not os.path.exists(npz_path):
            raise FileNotFoundError(f"Terrain data file not found: {npz_path}")
        
        data = np.load(npz_path)
        self.elevation = data['elevation']
        self.slope_deg = data['slope_deg']
        self.roughness = data['roughness']
        self.thermal_inertia = data['thermal_inertia']
        self.terrain_factor = data['terrain_factor']
        self.lons = data['lons']
        self.lats = data['lats']
        self.bounds = data['bounds']  # [min_lon, min_lat, max_lon, max_lat]
        self.dx = float(data['dx'])
        self.dy = float(data['dy'])
        self.ny, self.nx = self.elevation.shape
        
        self.min_lon, self.min_lat, self.max_lon, self.max_lat = self.bounds
        self.R_MARS = 3396190.0

    def lonlat_to_grid(self, lon: float, lat: float) -> Tuple[int, int]:
        """Convert planetary coordinates to grid indices (row, col) with bounds clamping."""
        u = (lon - self.min_lon) / (self.max_lon - self.min_lon)
        v = (lat - self.min_lat) / (self.max_lat - self.min_lat)
        
        col = int(round(u * (self.nx - 1)))
        row = int(round(v * (self.ny - 1)))
        
        col = max(0, min(self.nx - 1, col))
        row = max(0, min(self.ny - 1, row))
        return row, col

    def grid_to_lonlat(self, row: int, col: int) -> Tuple[float, float]:
        """Convert grid indices (row, col) to planetary coordinates (lon, lat)."""
        lon = float(self.lons[col])
        lat = float(self.lats[row])
        return lon, lat

    def is_in_bounds(self, lon: float, lat: float) -> bool:
        return (self.min_lon <= lon <= self.max_lon) and (self.min_lat <= lat <= self.max_lat)

    def sample_point(self, lon: float, lat: float) -> Dict[str, Any]:
        """Sample elevation, slope, roughness, thermal inertia at a single coordinate."""
        if not self.is_in_bounds(lon, lat):
            return {
                "valid": False,
                "error": "Coordinates outside high-resolution EVA terrain model bounds",
                "lon": lon,
                "lat": lat,
                "bounds": list(self.bounds)
            }
        
        row, col = self.lonlat_to_grid(lon, lat)
        elev = float(self.elevation[row, col])
        slope = float(self.slope_deg[row, col])
        rough = float(self.roughness[row, col])
        ti = float(self.thermal_inertia[row, col])
        eta = float(self.terrain_factor[row, col])

        # Hazard classification
        if slope >= 18.0:
            hazard_level = "CRITICAL_SLOPE_HAZARD"
            safety_status = "Impassable for Pressurized Mars Spacesuit"
        elif slope >= 12.0:
            hazard_level = "CAUTION_STEEP_GRADE"
            safety_status = "Moderate Incline (High Metabolic Expenditure)"
        elif ti < 140.0:
            hazard_level = "REGOLITH_SLIP_HAZARD"
            safety_status = "Unconsolidated Fine Sand / Dune Hollow"
        else:
            hazard_level = "NOMINAL_TRAVERSABLE"
            safety_status = "Firm Bedrock / High-Traction Surface"

        return {
            "valid": True,
            "lon": lon,
            "lat": lat,
            "elevation_m": round(elev, 2),
            "slope_deg": round(slope, 2),
            "roughness_std": round(rough, 3),
            "thermal_inertia": round(ti, 1),
            "terrain_factor_eta": round(eta, 2),
            "hazard_level": hazard_level,
            "safety_status": safety_status
        }

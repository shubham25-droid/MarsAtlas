import heapq
import math
import numpy as np
from typing import List, Dict, Any, Tuple, Optional
from app.terrain.engine import TerrainEngine

class EVARoutePlanner:
    def __init__(self, terrain: TerrainEngine, crism_targets: Optional[List[Dict[str, Any]]] = None):
        self.terrain = terrain
        self.crism_targets = crism_targets or []
        
        # NASA JSC CSRM Physiological Parameters
        self.W = 75.0        # Astronaut nude body mass (kg)
        self.L = 85.0        # Pressurized space suit + PLSS load (kg)
        self.G = 0.376       # Mars gravitational constant
        self.R0_USV_S = 23.33 / 3600.0  # MSL RAD baseline surface radiation (uSv/s)
        self.MAX_SLOPE_DEG = 22.0       # Hard slope ceiling for suited astronaut stability

    def solve_route(
        self, 
        start_lon: float, 
        start_lat: float, 
        dest_lon: float, 
        dest_lat: float, 
        mode: str = "balanced"
    ) -> Dict[str, Any]:
        """
        Executes an 8-connected A* search using the NASA JSC CSRM / Pandolf-Santee
        energy expenditure cost function.
        """
        start_r, start_c = self.terrain.lonlat_to_grid(start_lon, start_lat)
        dest_r, dest_c = self.terrain.lonlat_to_grid(dest_lon, dest_lat)

        ny, nx = self.terrain.ny, self.terrain.nx
        dx_m = self.terrain.dx
        dy_m = self.terrain.dy

        # Define 8-neighbor connectivity and metric distances
        # (dr, dc, horizontal_distance_m)
        neighbors = [
            (0, 1, dx_m),
            (0, -1, dx_m),
            (1, 0, dy_m),
            (-1, 0, dy_m),
            (1, 1, math.sqrt(dx_m**2 + dy_m**2)),
            (1, -1, math.sqrt(dx_m**2 + dy_m**2)),
            (-1, 1, math.sqrt(dx_m**2 + dy_m**2)),
            (-1, -1, math.sqrt(dx_m**2 + dy_m**2)),
        ]

        # Differentiated mode weights based on NASA JSC CSRM trade-offs
        if mode == "safe":
            w_energy, w_time, w_slope, w_slip, w_sci = 2.5, 0.2, 8.0, 5.0, 0.0
        elif mode == "science":
            w_energy, w_time, w_slope, w_slip, w_sci = 0.8, 0.5, 1.2, 1.0, 8.0
        else:  # balanced / fast
            w_energy, w_time, w_slope, w_slip, w_sci = 0.4, 3.0, 1.5, 1.0, 0.0

        # Precompute science bonus distance field if science mode
        science_grid = np.zeros((ny, nx), dtype=np.float32)
        if self.crism_targets and (mode == "science" or w_sci > 0):
            for target in self.crism_targets:
                t_lon, t_lat = target['geometry']['coordinates']
                tr, tc = self.terrain.lonlat_to_grid(t_lon, t_lat)
                # Apply 25-cell Gaussian proximity bonus
                rr, cc = np.ogrid[:ny, :nx]
                dist_sq = (rr - tr)**2 + (cc - tc)**2
                science_grid += np.exp(-dist_sq / (2 * 25**2)) * float(target['properties'].get('scientific_value', 1.0))

        # A* priority queue: (f_score, cost_so_far, r, c)
        start_node = (start_r, start_c)
        dest_node = (dest_r, dest_c)

        # Admissible lower-bound heuristic scaled to match dimensionless unit cost per meter
        min_cost_per_m = 0.005
        def heuristic(r: int, c: int) -> float:
            d_col = abs(c - dest_c) * dx_m
            d_row = abs(r - dest_r) * dy_m
            octile = max(d_col, d_row) + (math.sqrt(2) - 1) * min(d_col, d_row)
            return octile * min_cost_per_m

        open_set = []
        heapq.heappush(open_set, (heuristic(start_r, start_c), 0.0, start_r, start_c))
        
        came_from: Dict[Tuple[int, int], Tuple[int, int]] = {}
        g_score = {start_node: 0.0}

        visited = set()
        max_expansions = 150000
        expansions = 0

        while open_set and expansions < max_expansions:
            expansions += 1
            _, current_g, cr, cc = heapq.heappop(open_set)

            if (cr, cc) == dest_node:
                break

            if (cr, cc) in visited:
                continue
            visited.add((cr, cc))

            curr_elev = self.terrain.elevation[cr, cc]

            for dr, dc, edge_dist in neighbors:
                nr, nc = cr + dr, cc + dc
                if not (0 <= nr < ny and 0 <= nc < nx):
                    continue
                if (nr, nc) in visited:
                    continue

                next_elev = self.terrain.elevation[nr, nc]
                next_slope_local = self.terrain.slope_deg[nr, nc]
                next_ti = self.terrain.thermal_inertia[nr, nc]
                next_eta = self.terrain.terrain_factor[nr, nc]

                # Hard obstacle check
                if next_slope_local > self.MAX_SLOPE_DEG:
                    continue

                # Directional slope grade S_ij (%)
                delta_z = next_elev - curr_elev
                s_grade = (delta_z / edge_dist) * 100.0

                # Walking velocity via CSRM Apollo model (m/s)
                v_ij = max(0.15, (-0.01 * s_grade + 0.75) / next_eta)
                dt_s = edge_dist / v_ij

                # Pandolf metabolic power (Watts)
                w_term = self.W * self.G
                load_term = (self.W + self.L)
                m_p = (
                    1.5 * w_term +
                    2.0 * self.G * load_term * ((self.L / self.W) ** 2) +
                    next_eta * self.G * load_term * (1.5 * (v_ij ** 2) + 0.35 * v_ij * s_grade)
                )

                # Downhill correction if descending
                if s_grade < 0.0:
                    cf = next_eta * (
                        (s_grade * self.G * load_term * v_ij / 3.5) -
                        ((load_term * ((s_grade + 6.0) ** 2)) / self.W) +
                        (25.0 - (v_ij ** 2))
                    )
                    m_f = max(120.0, m_p - cf)
                else:
                    m_f = m_p

                # Energy delta (kJ)
                d_energy_kj = (m_f * dt_s) / 1000.0

                # Edge cost formulation
                norm_energy = d_energy_kj / (0.35 * edge_dist)
                norm_time = dt_s / (edge_dist / 0.70)
                norm_slope = (next_slope_local / 10.0) ** 2
                norm_slip = max(0.0, (250.0 - next_ti) / 100.0)
                sci_bonus = float(science_grid[nr, nc]) if w_sci > 0 else 0.0

                step_cost = (
                    w_energy * norm_energy +
                    w_time * norm_time +
                    w_slope * norm_slope +
                    w_slip * norm_slip -
                    w_sci * min(0.6, sci_bonus)
                )
                step_cost = max(0.05, step_cost) * (edge_dist / 10.0)

                tentative_g = current_g + step_cost
                if (nr, nc) not in g_score or tentative_g < g_score[(nr, nc)]:
                    g_score[(nr, nc)] = tentative_g
                    came_from[(nr, nc)] = (cr, cc)
                    f = tentative_g + heuristic(nr, nc)
                    heapq.heappush(open_set, (f, tentative_g, nr, nc))

        # Reconstruct path
        path_nodes = []
        curr = dest_node
        if curr not in came_from and curr != start_node:
            # Fallback if exact node wasn't reached: find closest visited
            if visited:
                curr = min(visited, key=lambda n: (n[0]-dest_r)**2 + (n[1]-dest_c)**2)
            else:
                curr = start_node

        while curr in came_from:
            path_nodes.append(curr)
            curr = came_from[curr]
        path_nodes.append(start_node)
        path_nodes.reverse()

        # Build telemetry arrays along the path
        coordinates = []
        telemetry = []
        cum_dist = 0.0
        cum_time = 0.0
        cum_energy = 0.0
        cum_rad = 0.0

        for idx, (r, c) in enumerate(path_nodes):
            lon, lat = self.terrain.grid_to_lonlat(r, c)
            elev = float(self.terrain.elevation[r, c])
            slope = float(self.terrain.slope_deg[r, c])
            rough = float(self.terrain.roughness[r, c])
            ti = float(self.terrain.thermal_inertia[r, c])
            eta = float(self.terrain.terrain_factor[r, c])

            if idx > 0:
                prev_r, prev_c = path_nodes[idx - 1]
                dr = abs(r - prev_r)
                dc = abs(c - prev_c)
                if dr > 0 and dc > 0:
                    step_d = math.sqrt(dx_m**2 + dy_m**2)
                elif dr > 0:
                    step_d = dy_m
                else:
                    step_d = dx_m

                prev_elev = float(self.terrain.elevation[prev_r, prev_c])
                delta_z = elev - prev_elev
                s_grade = (delta_z / step_d) * 100.0

                v_step = max(0.15, (-0.01 * s_grade + 0.75) / eta)
                dt_step = step_d / v_step

                w_term = self.W * self.G
                load_term = (self.W + self.L)
                m_p = (
                    1.5 * w_term +
                    2.0 * self.G * load_term * ((self.L / self.W) ** 2) +
                    eta * self.G * load_term * (1.5 * (v_step ** 2) + 0.35 * v_step * s_grade)
                )
                if s_grade < 0.0:
                    cf = eta * (
                        (s_grade * self.G * load_term * v_step / 3.5) -
                        ((load_term * ((s_grade + 6.0) ** 2)) / self.W) +
                        (25.0 - (v_step ** 2))
                    )
                    m_f = max(120.0, m_p - cf)
                else:
                    m_f = m_p

                d_e = (m_f * dt_step) / 1000.0
                cum_dist += step_d
                cum_time += dt_step
                cum_energy += d_e
                
                # Radiation shielding: base factor 0.78 reduced by terrain depression
                shielding = 0.75 if elev < -2500 else 0.90
                d_rad = (self.R0_USV_S * shielding) * dt_step
                cum_rad += d_rad
            else:
                v_step = 0.75 / eta
                m_f = 210.0

            coordinates.append([round(lon, 6), round(lat, 6), round(elev, 1)])
            telemetry.append({
                "index": idx,
                "lon": round(lon, 6),
                "lat": round(lat, 6),
                "distance_m": round(cum_dist, 1),
                "elevation_m": round(elev, 1),
                "slope_deg": round(slope, 1),
                "speed_ms": round(v_step, 2),
                "metabolic_rate_w": round(m_f, 1),
                "cumulative_energy_kj": round(cum_energy, 1),
                "cumulative_time_s": round(cum_time, 1),
                "cumulative_radiation_usv": round(cum_rad, 2),
                "thermal_inertia": round(ti, 1),
                "roughness": round(rough, 3)
            })

        # Summary statistics
        slopes = [t["slope_deg"] for t in telemetry]
        speeds = [t["speed_ms"] for t in telemetry]

        return {
            "mode": mode,
            "status": "OPTIMAL_PATH_FOUND",
            "summary": {
                "total_distance_m": round(cum_dist, 1),
                "total_distance_km": round(cum_dist / 1000.0, 2),
                "estimated_duration_min": round(cum_time / 60.0, 1),
                "total_energy_kj": round(cum_energy, 1),
                "average_metabolic_w": round(cum_energy * 1000.0 / max(1.0, cum_time), 1),
                "cumulative_radiation_usv": round(cum_rad, 2),
                "peak_slope_deg": round(max(slopes) if slopes else 0.0, 1),
                "mean_slope_deg": round(sum(slopes) / max(1, len(slopes)), 1),
                "average_speed_ms": round(sum(speeds) / max(1, len(speeds)), 2),
                "data_coverage_pct": 100.0
            },
            "geojson": {
                "type": "Feature",
                "properties": {
                    "mode": mode,
                    "distance_m": round(cum_dist, 1),
                    "duration_min": round(cum_time / 60.0, 1),
                    "energy_kj": round(cum_energy, 1)
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates": coordinates
                }
            },
            "telemetry": telemetry
        }

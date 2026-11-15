export interface Waypoint {
  id: string;
  name: string;
  lon: float;
  lat: float;
  elevation_m?: number;
  type: "start" | "target" | "science" | "intermediate";
}

export type float = number;

export interface TelemetryPoint {
  index: number;
  lon: number;
  lat: number;
  distance_m: number;
  elevation_m: number;
  slope_deg: number;
  speed_ms: number;
  metabolic_rate_w: number;
  cumulative_energy_kj: number;
  cumulative_time_s: number;
  cumulative_radiation_usv: number;
  thermal_inertia: number;
  roughness: number;
}

export interface RouteSummary {
  mode: string;
  strategy?: string;
  total_distance_m: number;
  total_distance_km: number;
  estimated_duration_min: number;
  total_energy_kj: number;
  average_metabolic_w: number;
  cumulative_radiation_usv: number;
  peak_slope_deg: number;
  mean_slope_deg: number;
  average_speed_ms: number;
  data_coverage_pct: number;
}

export interface RouteResult {
  mode: string;
  status: string;
  summary: RouteSummary;
  geojson: {
    type: string;
    properties: Record<string, unknown>;
    geometry: {
      type: string;
      coordinates: [number, number, number][];
    };
  };
  telemetry: TelemetryPoint[];
}

export interface PlanEvaResponse {
  status: string;
  mode?: string;
  routes: {
    safe?: RouteResult;
    balanced?: RouteResult;
    science?: RouteResult;
    [key: string]: RouteResult | undefined;
  };
  comparison: RouteSummary[];
}

export interface RoverObservation {
  sol: number;
  rover: string;
  instrument: string;
  location_name: string;
  coordinates: [number, number];
  elevation_m: number;
  image_url: string;
  description: string;
  scientific_context: string;
  distance_to_query_m?: number;
}

export interface ScienceTargetFeature {
  type: "Feature";
  properties: {
    id: string;
    name: string;
    category: string;
    spectral_signature: string;
    geological_unit: string;
    rover_sol_reference: string;
    scientific_value: number;
    priority: "Critical" | "High" | "Moderate";
    recommended_eva_activity: string;
  };
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
}

export interface GeologicUnitFeature {
  type: "Feature";
  properties: {
    unit_id: string;
    name: string;
    description: string;
    rock_type: string;
    age_period: string;
    traversability: string;
    color: string;
    fillOpacity: number;
  };
  geometry: {
    type: "Polygon";
    coordinates: number[][][];
  };
}

export interface PointTelemetry {
  valid: boolean;
  lon: number;
  lat: number;
  elevation_m: number;
  slope_deg: number;
  roughness_std: number;
  thermal_inertia: number;
  terrain_factor_eta: number;
  hazard_level: string;
  safety_status: string;
  nearest_rover_ground_truth?: RoverObservation;
}

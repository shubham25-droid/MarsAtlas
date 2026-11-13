import math
import urllib.request
import json
from typing import Dict, Any, List, Optional

CURATED_ROVER_OBSERVATIONS = [
    {
        "sol": 2031,
        "rover": "Perseverance",
        "instrument": "SuperCam RMI",
        "location_name": "Jezero Crater Western Rim Slope",
        "coordinates": [77.2332, 18.4356],
        "elevation_m": -1936.4,
        "image_url": "https://mars.nasa.gov/mars2020-raw-images/pub/ods/surface/sol/02031/ids/edr/browse/scam/LRF_2031_0847237865_241EBY_N0930000SCAM01031_0100I4J01_800.jpg",
        "description": "High-magnification telescopic mosaic of pre-Noachian crater rim megabreccia and impact melt boulders.",
        "scientific_context": "Deep crustal basement unit exposed during Jezero impact event."
    },
    {
        "sol": 1285,
        "rover": "Perseverance",
        "instrument": "Mastcam-Z",
        "location_name": "Lac de Charmes Carbonate Bench",
        "coordinates": [77.3482, 18.4591],
        "elevation_m": -2150.0,
        "image_url": "https://mars.nasa.gov/mars2020-raw-images/pub/ods/surface/sol/01285/ids/edr/browse/mcam/ZL0_1285_0783112000_120ECM_N0010000ZCAM00010_010085J01_800.jpg",
        "description": "Panoramic view of indurated carbonate benches and fractured smectite bedrock on margin unit.",
        "scientific_context": "Evidence of paleolake shoreline alteration and high potential for preserving ancient organic molecules."
    },
    {
        "sol": 420,
        "rover": "Perseverance",
        "instrument": "Navcam Left",
        "location_name": "Cape Flatley / Delta Front Scarp",
        "coordinates": [77.4018, 18.4532],
        "elevation_m": -2480.0,
        "image_url": "https://mars.nasa.gov/mars2020-raw-images/pub/ods/surface/sol/00420/ids/edr/browse/navc/NLF_0420_0704412000_120ECM_N0010000NCAM00010_010085J01_800.jpg",
        "description": "Laminated fine-grained delta bottomset siltstones exposed at the base of the western delta scarp.",
        "scientific_context": "Prime drilling target for NASA Mars Sample Return (MSR) mission."
    },
    {
        "sol": 13,
        "rover": "Perseverance",
        "instrument": "Mastcam-Z 360 Panorama",
        "location_name": "Octavia E. Butler Landing Site",
        "coordinates": [77.4509, 18.4446],
        "elevation_m": -2569.9,
        "image_url": "https://mars.nasa.gov/mars2020-raw-images/pub/ods/surface/sol/00013/ids/edr/browse/mcam/ZL0_0013_0668812000_120ECM_N0010000ZCAM00010_010085J01_800.jpg",
        "description": "First 360-degree high-definition panorama of Jezero Crater floor, showing distant delta scarp.",
        "scientific_context": "Crater floor basaltic terrain (Máaz formation) interbedded with windblown ripples."
    },
    {
        "sol": 5000,
        "rover": "Curiosity",
        "instrument": "Mastcam",
        "location_name": "Mount Sharp Boxwork Foothills (Chocolatal)",
        "coordinates": [137.3888, -4.8260],
        "elevation_m": -3472.1,
        "image_url": "https://mars.nasa.gov/system/resources/detail_files/26000_PIA26000-curiosity-sol5000-boxwork.jpg",
        "description": "Intricate polygon 'spiderweb' ridges formed by mineralized fractures standing resistant to wind erosion.",
        "scientific_context": "Late-stage subsurface hydrothermal circulation in Mount Sharp sulfate layers."
    }
]

def find_nearest_rover_observation(lon: float, lat: float) -> Dict[str, Any]:
    """Finds the closest geolocated rover surface observation to a given point."""
    R_MARS = 3396190.0
    best_obs = None
    min_dist_m = float('inf')

    for obs in CURATED_ROVER_OBSERVATIONS:
        o_lon, o_lat = obs["coordinates"]
        mean_lat = math.radians((lat + o_lat) / 2.0)
        dx = R_MARS * math.radians(lon - o_lon) * math.cos(mean_lat)
        dy = R_MARS * math.radians(lat - o_lat)
        dist = math.sqrt(dx**2 + dy**2)
        if dist < min_dist_m:
            min_dist_m = dist
            best_obs = obs

    result = dict(best_obs) if best_obs else dict(CURATED_ROVER_OBSERVATIONS[0])
    result["distance_to_query_m"] = round(min_dist_m, 1)
    return result

def query_live_nasa_raw_images(sol: Optional[int] = None, num: int = 4) -> List[Dict[str, Any]]:
    """Queries NASA's live Mars 2020 Raw Image API with safe fallback."""
    sol_param = f"&sol={sol}" if sol else ""
    url = f"https://mars.nasa.gov/rss/api/?feed=raw_images&category=mars2020&feedtype=json&num={num}&page=0{sol_param}"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'MarsAtlas/1.0 (NASA Space Apps Challenge 2026)'})
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            images = []
            for item in data.get('images', [])[:num]:
                images.append({
                    "title": item.get("title"),
                    "sol": item.get("sol"),
                    "camera": item.get("camera", {}).get("instrument"),
                    "image_url": item.get("image_files", {}).get("medium") or item.get("image_files", {}).get("large"),
                    "date_taken": item.get("date_taken_mars") or item.get("date_received")
                })
            if images:
                return images
    except Exception:
        pass

    # Fallback to curated catalog
    return [
        {
            "title": f"{obs['rover']} Sol {obs['sol']} - {obs['location_name']}",
            "sol": obs["sol"],
            "camera": obs["instrument"],
            "image_url": obs["image_url"],
            "date_taken": f"Sol {obs['sol']}"
        }
        for obs in CURATED_ROVER_OBSERVATIONS[:num]
    ]

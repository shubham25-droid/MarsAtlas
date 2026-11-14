import os
import sys
from PIL import Image

# 1. Check directories and paths
project_root = r"D:\Antigravity Workspace\NASA Space Challenge 2026\MarsAtlas"
output_dir = os.path.join(project_root, "docs", "presentation")
os.makedirs(output_dir, exist_ok=True)

slides_assets = os.path.join(project_root, "docs", "slides_assets")
os.makedirs(slides_assets, exist_ok=True)

logo_path = r"C:\Users\SHUBHAM\.gemini\antigravity\brain\15ea895b-16d2-411c-9592-2dbba8abb188\.user_uploaded\media_1794599131747_9b0d0372.jpg"
app_screenshot_path = r"C:\Users\SHUBHAM\.gemini\antigravity\brain\15ea895b-16d2-411c-9592-2dbba8abb188\.user_uploaded\media_1794611960402_990b1896.jpg"
hazard_map_path = os.path.join(project_root, "frontend", "public", "data", "jezero_slope_hazard.png")
heightmap_path = os.path.join(project_root, "frontend", "public", "data", "jezero_heightmap.png")
arch_diagram_path = os.path.join(slides_assets, "arch_diagram_cropped.png")
metabolic_curves_path = os.path.join(slides_assets, "metabolic_curves_cropped.png")

print("Checking assets:")
for p in [logo_path, app_screenshot_path, hazard_map_path, heightmap_path, arch_diagram_path, metabolic_curves_path]:
    print(p, "Exists:", os.path.exists(p))

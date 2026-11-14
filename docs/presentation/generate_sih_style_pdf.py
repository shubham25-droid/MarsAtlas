import os
from reportlab.lib import colors
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle

PAGE_WIDTH = 960.0
PAGE_HEIGHT = 540.0

# SIH Light Theme Color Palette
BG_WHITE = colors.HexColor('#FFFFFF')
CARD_BG = colors.HexColor('#F8FAFC')
CARD_BLUE = colors.HexColor('#EFF6FF')
CARD_GREEN = colors.HexColor('#F0FDF4')
CARD_ORANGE = colors.HexColor('#FFF7ED')
CARD_RED = colors.HexColor('#FEF2F2')

BORDER_SLATE = colors.HexColor('#E2E8F0')
BORDER_BLUE = colors.HexColor('#BAE6FD')
BORDER_GREEN = colors.HexColor('#BBF7D0')
BORDER_ORANGE = colors.HexColor('#FED7AA')
BORDER_RED = colors.HexColor('#FECACA')

TEXT_TITLE = colors.HexColor('#0F172A')
TEXT_BODY = colors.HexColor('#1E293B')
TEXT_MUTED = colors.HexColor('#475569')
TEXT_DIM = colors.HexColor('#64748B')

ORANGE_PRIMARY = colors.HexColor('#EA580C')
BLUE_ACCENT = colors.HexColor('#0284C7')
BLUE_DARK = colors.HexColor('#1D4ED8')
GREEN_ACCENT = colors.HexColor('#059669')
RED_ACCENT = colors.HexColor('#DC2626')

def to_rl_y(top, height):
    return PAGE_HEIGHT - top - height

def draw_header(c, tag_text, title_text, subtitle_text=None, slide_num=1, tag_color=ORANGE_PRIMARY):
    # Tag
    c.setFont('Helvetica-Bold', 8.5)
    c.setFillColor(tag_color)
    c.drawString(57.6, PAGE_HEIGHT - 38, tag_text.upper())

    # Right slide indicator badge
    c.setFont('Helvetica-Bold', 8.5)
    c.setFillColor(TEXT_DIM)
    c.drawRightString(902.4, PAGE_HEIGHT - 38, f"NASA Space Apps 2026 • {slide_num}/7")

    # Main Title
    c.setFont('Helvetica-Bold', 17)
    c.setFillColor(TEXT_TITLE)
    c.drawString(57.6, PAGE_HEIGHT - 60, title_text)

    # Subtitle
    if subtitle_text:
        c.setFont('Helvetica', 9.5)
        c.setFillColor(TEXT_MUTED)
        c.drawString(57.6, PAGE_HEIGHT - 76, subtitle_text)

    # Divider line
    c.setStrokeColor(BORDER_SLATE)
    c.setLineWidth(1)
    c.line(57.6, PAGE_HEIGHT - 88, 902.4, PAGE_HEIGHT - 88)

def draw_card(c, left, top, width, height, title=None, title_color=ORANGE_PRIMARY, bg_color=CARD_BG, border_color=BORDER_SLATE):
    y = to_rl_y(top, height)
    c.setFillColor(bg_color)
    c.setStrokeColor(border_color)
    c.setLineWidth(1)
    c.roundRect(left, y, width, height, 6, fill=1, stroke=1)

    if title:
        c.setFont('Helvetica-Bold', 9.5)
        c.setFillColor(title_color)
        c.drawString(left + 14, PAGE_HEIGHT - top - 18, title.upper())

def render_bullet_list(c, left, start_top, width, bullets, font_size=8.2, leading=10.5, space_after=4):
    curr_top = start_top
    for b in bullets:
        prefix = b.get("prefix", "")
        prefix_col = b.get("prefix_col", "#EA580C")
        text = b.get("text", "")
        text_col = b.get("text_col", "#1E293B")

        html = f'<font color="{prefix_col}">▪ <b>{prefix}</b></font> <font color="{text_col}">{text}</font>'
        style = ParagraphStyle(
            'CustomBullet',
            fontName='Helvetica',
            fontSize=font_size,
            leading=leading,
            textColor=TEXT_BODY
        )
        p = Paragraph(html, style)
        w, h = p.wrap(width, 200)
        y = to_rl_y(curr_top, h)
        p.drawOn(c, left, y)
        curr_top += h + space_after
    return curr_top

def build_sih_pdf():
    pdf_path = os.path.join(r"D:\Antigravity Workspace\NASA Space Challenge 2026\MarsAtlas\docs\presentation", "marsatlas_presentation.pdf")
    c = canvas.Canvas(pdf_path, pagesize=(PAGE_WIDTH, PAGE_HEIGHT))

    fig_dir = r"D:\Antigravity Workspace\NASA Space Challenge 2026\MarsAtlas\docs\slides_assets\extracted_figures"
    fig1 = os.path.join(fig_dir, "fig1_perseverance_traverse.png")
    fig4 = os.path.join(fig_dir, "fig4_terrain_heatmaps.png")
    fig5 = os.path.join(fig_dir, "fig5_astar_routes.png")
    fig6 = os.path.join(fig_dir, "fig6_geology_overlays.png")

    # =========================================================================
    # SLIDE 1: TITLE PAGE (SIH FORMAT)
    # =========================================================================
    c.setFillColor(BG_WHITE)
    c.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, fill=1, stroke=0)

    # Top Banner
    c.setFont('Helvetica-Bold', 10.5)
    c.setFillColor(ORANGE_PRIMARY)
    c.drawString(57.6, PAGE_HEIGHT - 38, "NASA SPACE APPS CHALLENGE 2026  •  GLOBAL SUBMISSION")

    # Left Container: Metadata Card
    draw_card(c, 57.6, 68, 440, 435, bg_color=CARD_BG, border_color=BORDER_SLATE)
    c.setFont('Helvetica-Bold', 26)
    c.setFillColor(TEXT_TITLE)
    c.drawString(75, PAGE_HEIGHT - 105, "MarsAtlas")

    c.setFont('Helvetica-Bold', 11)
    c.setFillColor(ORANGE_PRIMARY)
    c.drawString(75, PAGE_HEIGHT - 124, "Integrated Martian Terrain Intelligence and EVA Traverse Planning")

    c.setFont('Helvetica', 9.5)
    c.setFillColor(TEXT_MUTED)
    c.drawString(75, PAGE_HEIGHT - 140, "Explore Mars. Understand Terrain. Plan Every Traverse.")

    s1_bullets = [
        {"prefix": "Challenge:", "text": "Interplanetary Survival Guide: Martian Map", "prefix_col": "#1D4ED8"},
        {"prefix": "Category:", "text": "Planetary Geospatial Intelligence & Surface EVA Operations", "prefix_col": "#1D4ED8"},
        {"prefix": "Primary Study Region:", "text": "Jezero Crater, Mars (18.44°N, 77.45°E) — Perseverance Landing Site", "prefix_col": "#1D4ED8"},
        {"prefix": "Live Application:", "text": "https://mars-atlas-nasa.vercel.app/ (Production WebGIS)", "prefix_col": "#EA580C"},
        {"prefix": "High-Performance API:", "text": "https://marsatlas-backend.onrender.com/ (FastAPI / GDAL)", "prefix_col": "#EA580C"},
        {"prefix": "Open Source Code:", "text": "github.com/shubham25-droid/MarsAtlas (MIT License)", "prefix_col": "#EA580C"},
        {"prefix": "Project Status:", "text": "Experimental Research Prototype", "prefix_col": "#059669"},
        {"prefix": "Team ID / Lead:", "text": "Team MarsAtlas (shubham25-droid)", "prefix_col": "#1D4ED8"}
    ]
    render_bullet_list(c, 75, 155, 405, s1_bullets, font_size=8.2, leading=11, space_after=5)

    # Right Container: Real Traverse Plot
    draw_card(c, 515, 68, 387.4, 435, "GROUND TRUTH CONTEXT (JEZERO CRATER)", BLUE_DARK, CARD_BG)
    if os.path.exists(fig1):
        c.drawImage(fig1, 528, to_rl_y(102, 310), width=360, height=310, preserveAspectRatio=True)

    c.setFont('Helvetica', 7.5)
    c.setFillColor(TEXT_MUTED)
    p_cap1 = Paragraph('<font color="#64748B">Figure: rendered from data/processed/m20_traverse.json in repo (NASA-AMMOS MMGIS product, 559 drive legs, sols 13–2022). Dashed box = modelled EVA sector.</font>', ParagraphStyle('Cap1', fontName='Helvetica', fontSize=7.5, leading=10))
    p_cap1.wrap(360, 45)
    p_cap1.drawOn(c, 528, to_rl_y(430, p_cap1.height))

    c.showPage()

    # =========================================================================
    # SLIDE 2: THE SCIENTIFIC PROBLEM
    # =========================================================================
    c.setFillColor(BG_WHITE)
    c.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, fill=1, stroke=0)
    draw_header(c, "THE SCIENTIFIC PROBLEM",
                "Mapping Mars Is Not the Same as Planning a Marswalk.",
                "Mission archives hold rich observations, but each product answers a different scientific question.",
                slide_num=2, tag_color=RED_ACCENT)

    # Left Column: Silos
    draw_card(c, 57.6, 98, 260, 360, "MISSION OBSERVATION ARCHIVES", BLUE_DARK, CARD_BG)
    s2_silos = [
        {"prefix": "Orbital imagery:", "text": "CTX, HiRISE · 2D image tiles (albedo & morphology)", "prefix_col": "#1D4ED8"},
        {"prefix": "Digital terrain models:", "text": "HiRISE DTM, MOLA · elevation (m) & regional topography", "prefix_col": "#1D4ED8"},
        {"prefix": "Geologic maps:", "text": "USGS SIM 3464 · 1:75,000 stratigraphy vectors", "prefix_col": "#1D4ED8"},
        {"prefix": "Thermal observations:", "text": "THEMIS, TES · thermal inertia (regolith grain proxy)", "prefix_col": "#1D4ED8"},
        {"prefix": "Mineralogy:", "text": "CRISM MTRDR · hyperspectral parameters (clays, carbonates)", "prefix_col": "#1D4ED8"},
        {"prefix": "Rover ground truth:", "text": "NASA-AMMOS MMGIS · waypoints, in-situ Mastcam/SuperCam", "prefix_col": "#1D4ED8"}
    ]
    render_bullet_list(c, 70, 126, 235, s2_silos, font_size=7.8, leading=10.5, space_after=6)

    # Center: Differences to Reconcile
    draw_card(c, 332, 135, 215, 290, "DIFFERENCES TO RECONCILE", ORANGE_PRIMARY, CARD_ORANGE, BORDER_ORANGE)
    s2_diff = [
        {"prefix": "Spatial Resolution:", "text": "1m (HiRISE) to 100m (THEMIS) to 463m (MOLA)", "prefix_col": "#EA580C"},
        {"prefix": "Coordinate Reference:", "text": "Equirectangular vs Orthographic planetocentric", "prefix_col": "#EA580C"},
        {"prefix": "Spatial Coverage:", "text": "Narrow strips vs global continuous basemaps", "prefix_col": "#EA580C"},
        {"prefix": "Acquisition Time:", "text": "Decades apart under differing solar phases", "prefix_col": "#EA580C"},
        {"prefix": "Scientific Purpose:", "text": "Mineral science vs safety landing vs navigation", "prefix_col": "#EA580C"}
    ]
    render_bullet_list(c, 344, 163, 190, s2_diff, font_size=7.8, leading=10.5, space_after=6)

    # Right: What an Explorer Needs
    draw_card(c, 562, 98, 340.4, 360, "WHAT AN EXPLORER ACTUALLY NEEDS", GREEN_ACCENT, CARD_GREEN, BORDER_GREEN)
    s2_needs = [
        {"prefix": "Understand Terrain Kinematics:", "text": "Assess 3D slope gradients, slip boundaries, and obstacle roughness rather than optical brightness.", "prefix_col": "#059669"},
        {"prefix": "Investigate Candidate Targets:", "text": "Identify high-priority mineral contacts and stratigraphy within safe walking distance.", "prefix_col": "#059669"},
        {"prefix": "Compare Candidate Traverses:", "text": "Evaluate terrain-aware route alternatives respecting strict PLSS consumable margins (oxygen, cooling, power).", "prefix_col": "#059669"},
        {"prefix": "Science Along the Path:", "text": "Maximize sample return opportunities without crossing impassable cliffs (>20°).", "prefix_col": "#059669"},
        {"prefix": "Unified Spatial Scale:", "text": "Inspect all observations simultaneously in one calibrated coordinate space.", "prefix_col": "#059669"}
    ]
    render_bullet_list(c, 576, 126, 312, s2_needs, font_size=8.2, leading=11, space_after=7)

    # Bottom Callout Banner
    draw_card(c, 57.6, 470, 844.8, 45, "", bg_color=CARD_BLUE, border_color=BORDER_BLUE)
    p_b2 = Paragraph('<font color="#1D4ED8"><b>CORE OPERATIONAL QUESTION: How can heterogeneous planetary observations become actionable exploration intelligence for future human Marswalks?</b></font>', ParagraphStyle('B2', fontName='Helvetica', fontSize=9, leading=12))
    p_b2.wrap(820, 35)
    p_b2.drawOn(c, 72, to_rl_y(478, p_b2.height))

    c.showPage()

    # =========================================================================
    # SLIDE 3: PROPOSED SOLUTION & INNOVATION
    # =========================================================================
    c.setFillColor(BG_WHITE)
    c.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, fill=1, stroke=0)
    draw_header(c, "PROPOSED SOLUTION & INNOVATION",
                "One Exploration Environment. Multiple Scientific Perspectives.",
                "Data actually present in the repository, with how each item enters the app. Status reflects what the code does.",
                slide_num=3, tag_color=ORANGE_PRIMARY)

    # Horizontal 5-Step Pipeline Flowbar
    steps = [
        ("1. Planetary Observations", "USGS, PDS, MMGIS", CARD_BLUE, BORDER_BLUE),
        ("2. Coordinate Standard", "R = 3,396,190 m", CARD_BLUE, BORDER_BLUE),
        ("3. Terrain + Science Grid", "Elevation, Slope, η, CRISM", CARD_ORANGE, BORDER_ORANGE),
        ("4. Interactive Map & API", "OpenLayers + FastAPI", CARD_BLUE, BORDER_BLUE),
        ("5. Traverse Comparison", "Multi-Objective A*", CARD_GREEN, BORDER_GREEN)
    ]
    step_w = 157.0
    gap = 14.9
    for idx, (s_title, s_sub, s_bg, s_bc) in enumerate(steps):
        sx = 57.6 + idx * (step_w + gap)
        draw_card(c, sx, 98, step_w, 48, "", bg_color=s_bg, border_color=s_bc)
        c.setFont('Helvetica-Bold', 8)
        c.setFillColor(TEXT_TITLE)
        c.drawString(sx + 8, PAGE_HEIGHT - 114, s_title)
        c.setFont('Helvetica', 7)
        c.setFillColor(TEXT_MUTED)
        c.drawString(sx + 8, PAGE_HEIGHT - 128, s_sub)

    # Integration Table
    t_left = 57.6
    t_top = 158
    t_w = 844.8
    col_w = [185, 110, 160, 270, 119.8]

    # Header Row
    c.setFillColor(CARD_BG)
    c.rect(t_left, to_rl_y(t_top, 22), t_w, 22, fill=1, stroke=0)
    c.setStrokeColor(BORDER_SLATE)
    c.line(t_left, to_rl_y(t_top, 22), t_left + t_w, to_rl_y(t_top, 22))
    c.setFont('Helvetica-Bold', 7.5)
    c.setFillColor(BLUE_DARK)
    th_x = t_left + 6
    headers3 = ["DATASET (AS USED)", "ORIGIN", "COVERAGE / GRID", "ROLE IN MARSATLAS", "STATUS"]
    for j, h in enumerate(headers3):
        c.drawString(th_x, to_rl_y(t_top, 15), h)
        th_x += col_w[j]

    t3_rows = [
        ("USGS Astrogeology WMS basemaps (Viking, MOLA)", "USGS / NASA", "Global", "Basemap and swipe comparison in map UI", "In app (real data)"),
        ("Perseverance waypoints (708) & traverse (559 legs)", "NASA-AMMOS MMGIS", "Jezero; sols 13–2022", "Ground-truth track layer; nearest-obs lookup", "In app (real data)"),
        ("Curiosity waypoints (1,389)", "NASA-AMMOS MMGIS", "Gale; to sol 5073", "Gale boxwork preset context", "In app (real data)"),
        ("Terrain grid: elevation, slope, roughness, thermal inertia, η", "Repo jezero_eva_sector.npz", "550×350 cells, ~11.3×11.9 m; 77.35–77.46°E", "Cost surface for A* and point telemetry", "Surrogate; documented"),
        ("Geologic units (5) after Sun & Stack (2020), SIM 3464", "Hand-simplified polygons", "Jezero / Nili Planum", "Geologic context overlay", "Authored approx."),
        ("CRISM-referenced science targets (5 points)", "Hand-authored GeoJSON", "Jezero", "Targets and science bonus in route cost", "Authored; no cubes"),
        ("Rover observations: 5 curated + live NASA raw API", "NASA Mars 2020 API", "Jezero, Gale", "Waypoint-linked surface imagery cards", "In app (with fallback)")
    ]

    r_top = t_top + 22
    for i, r in enumerate(t3_rows):
        c.setFillColor(BG_WHITE if i % 2 == 0 else CARD_BG)
        c.rect(t_left, to_rl_y(r_top, 38), t_w, 38, fill=1, stroke=0)
        c.setStrokeColor(BORDER_SLATE)
        c.line(t_left, to_rl_y(r_top, 38), t_left + t_w, to_rl_y(r_top, 38))

        td_x = t_left + 6
        for j, val in enumerate(r):
            if j == 4:
                c.setFont('Helvetica-Bold', 7)
                c.setFillColor(GREEN_ACCENT if "real" in val else (ORANGE_PRIMARY if "documented" in val else TEXT_MUTED))
            elif j == 0:
                c.setFont('Helvetica-Bold', 7)
                c.setFillColor(TEXT_TITLE)
            else:
                c.setFont('Helvetica', 7)
                c.setFillColor(TEXT_BODY)
            p_cell = Paragraph(val, ParagraphStyle('Cell', fontName='Helvetica-Bold' if j in [0,4] else 'Helvetica', fontSize=7, leading=9, textColor=c._fillColorObj))
            p_cell.wrap(col_w[j] - 8, 34)
            p_cell.drawOn(c, td_x, to_rl_y(r_top, p_cell.height + 6))
            td_x += col_w[j]
        r_top += 38

    # Footer note
    c.setFont('Helvetica', 7.5)
    c.setFillColor(TEXT_DIM)
    c.drawString(57.6, PAGE_HEIGHT - 508, "Documented in DATA_SOURCES.md but not wired into frontend map code: Mars Trek CTX & THEMIS WMTS layers, and raw 1m HiRISE DTM GeoTIFF.")

    c.showPage()

    # =========================================================================
    # SLIDE 4: TECHNICAL APPROACH: TERRAIN INTELLIGENCE
    # =========================================================================
    c.setFillColor(BG_WHITE)
    c.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, fill=1, stroke=0)
    draw_header(c, "TECHNICAL APPROACH: TERRAIN INTELLIGENCE",
                "Understanding the Surface Beyond What the Eye Can See.",
                "Terrain-derived cost surface: elevation, slope, roughness and thermal inertia on one grid.",
                slide_num=4, tag_color=BLUE_DARK)

    # Left Panel: Figures
    draw_card(c, 57.6, 98, 440, 415, "REPOSITORY GRID HEATMAPS (JEZERO_EVA_SECTOR.NPZ)", BLUE_DARK, CARD_BG)
    if os.path.exists(fig4):
        c.drawImage(fig4, 68, to_rl_y(124, 290), width=419, height=290, preserveAspectRatio=True)

    c.setFont('Helvetica', 7.5)
    c.setFillColor(TEXT_MUTED)
    p_cap4 = Paragraph('<font color="#64748B">Figure rendered from repository grid (jezero_eva_sector.npz, 550×350 cells, ~11.3×11.9 m/cell). Note: The grid is a prototype surrogate, not a validated raw HiRISE crop, so patterns shown are surrogate synthetic terrain.</font>', ParagraphStyle('Cap4', fontName='Helvetica', fontSize=7.5, leading=10))
    p_cap4.wrap(419, 45)
    p_cap4.drawOn(c, 68, to_rl_y(430, p_cap4.height))

    # Right Panel: Methods in Code
    draw_card(c, 515, 98, 387.4, 210, "METHODS IN THE CODE", ORANGE_PRIMARY, CARD_BG)
    s4_methods = [
        {"prefix": "Slope (θ):", "text": "Horn 3×3 finite difference applied after 3×3 Gaussian smoothing; precomputed in grid.", "prefix_col": "#EA580C"},
        {"prefix": "Roughness (σz):", "text": "Local elevation standard deviation σz, stored precomputed in the grid.", "prefix_col": "#EA580C"},
        {"prefix": "Terrain Factor (η):", "text": "η = 1.0 + 0.5·clip((350−TI)/250) + 0.6·clip(σz/0.4); grid range: 1.00–1.59.", "prefix_col": "#EA580C"},
        {"prefix": "Coordinates:", "text": "Angular to metres with Mars radius R = 3,396,190 m and cos(latitude).", "prefix_col": "#EA580C"}
    ]
    render_bullet_list(c, 528, 126, 360, s4_methods, font_size=8.0, leading=10.5, space_after=5)

    # Right Panel Bottom: Validation Audit
    draw_card(c, 515, 320, 387.4, 193, "GRID VALUES & VALIDATION AUDIT", GREEN_ACCENT, CARD_GREEN, BORDER_GREEN)
    s4_audit = [
        {"prefix": "Grid Values (From File):", "text": "Elevation: −2,605 to −2,121 m · Slope: 0.0–22.7° (mean 4.8°) · Thermal inertia: 109–466 · Roughness: ≤ 0.26 m.", "prefix_col": "#059669"},
        {"prefix": "Validation Check I Ran:", "text": "Grid vs 276 Perseverance waypoint elevations in sector: RMSE 74 m, mean bias +55 m. Replace with real calibrated DTM before claiming operational flight accuracy.", "prefix_col": "#059669"},
        {"prefix": "Known Limits:", "text": "Raster cell bounds detectable features · Roughness is not bearing strength · Thermal inertia is not traction · No safety certification.", "prefix_col": "#DC2626"}
    ]
    render_bullet_list(c, 528, 346, 360, s4_audit, font_size=7.8, leading=10.5, space_after=5)

    c.showPage()

    # =========================================================================
    # SLIDE 5: FEASIBILITY AND VIABILITY: ROUTE SOLVER
    # =========================================================================
    c.setFillColor(BG_WHITE)
    c.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, fill=1, stroke=0)
    draw_header(c, "FEASIBILITY AND VIABILITY: ROUTE SOLVER",
                "From Shortest Distance to Terrain-Aware Traverse Decisions.",
                "8-connected A* search with a Pandolf-Santee metabolic cost, run on the repository grid.",
                slide_num=5, tag_color=ORANGE_PRIMARY)

    # Left Panel: Route Plot & Table
    draw_card(c, 57.6, 98, 410, 415, "A* ROUTE OUTPUT & TRAVERSE COMPARISON", BLUE_DARK, CARD_BG)
    if os.path.exists(fig5):
        c.drawImage(fig5, 68, to_rl_y(124, 210), width=389, height=210, preserveAspectRatio=True)

    # Table below plot
    t_left5 = 68
    t_top5 = 346
    t_w5 = 389
    col_w5 = [85, 55, 60, 60, 64, 65]

    c.setFillColor(CARD_BG)
    c.rect(t_left5, to_rl_y(t_top5, 20), t_w5, 20, fill=1, stroke=0)
    c.setStrokeColor(BORDER_SLATE)
    c.line(t_left5, to_rl_y(t_top5, 20), t_left5 + t_w5, to_rl_y(t_top5, 20))
    c.setFont('Helvetica-Bold', 7.5)
    c.setFillColor(BLUE_DARK)
    th_x5 = t_left5 + 4
    headers5 = ["STRATEGY", "DIST", "TIME", "ENERGY", "PEAK SLOPE", "DOSE*"]
    for j, h in enumerate(headers5):
        c.drawString(th_x5, to_rl_y(t_top5, 14), h)
        th_x5 += col_w5[j]

    rows5 = [
        ("Safe", "3.02 km", "88.0 min", "1,616 kJ", "13.3°", "27.0 µSv"),
        ("Balanced", "2.98 km", "86.6 min", "1,591 kJ", "13.3°", "26.6 µSv"),
        ("Science", "3.80 km", "113.0 min", "2,029 kJ", "13.7°", "35.3 µSv")
    ]
    r_top5 = t_top5 + 20
    for i, r in enumerate(rows5):
        c.setFillColor(BG_WHITE if i % 2 == 0 else CARD_BG)
        c.rect(t_left5, to_rl_y(r_top5, 24), t_w5, 24, fill=1, stroke=0)
        c.setStrokeColor(BORDER_SLATE)
        c.line(t_left5, to_rl_y(r_top5, 24), t_left5 + t_w5, to_rl_y(r_top5, 24))
        td_x5 = t_left5 + 4
        for j, val in enumerate(r):
            c.setFont('Helvetica-Bold' if j == 0 else 'Helvetica', 7.5)
            c.setFillColor(ORANGE_PRIMARY if j == 0 else TEXT_BODY)
            c.drawString(td_x5, to_rl_y(r_top5, 16), val)
            td_x5 += col_w5[j]
        r_top5 += 24

    c.setFont('Helvetica', 7)
    c.setFillColor(TEXT_DIM)
    c.drawString(t_left5, PAGE_HEIGHT - 495, "*Model estimate: constant shielding factor × 23.33 µSv/h baseline. Not a dose prediction.")

    # Right Panel: Step Cost Formula & Weights
    draw_card(c, 485, 98, 417.4, 210, "STEP COST ACTUALLY IMPLEMENTED (PLANNER.PY)", ORANGE_PRIMARY, CARD_BG)
    s5_cost = [
        {"prefix": "Cost Function Formula:", "text": "c = max(0.05, wE·E_hat + wT·T_hat + wS·(θ/10)² + wH·max(0, (250−TI)/100) − wV·min(0.6, V)) × d/10", "prefix_col": "#EA580C"},
        {"prefix": "Variables:", "text": "E_hat, T_hat: energy and time per metre from Pandolf-Santee model and Apollo speed law V = (−0.01·S + 0.75)/η. θ: local slope (cells > 22° impassable). TI: thermal inertia slip proxy. V: authored CRISM target Gaussian bonus (σ = 25 cells).", "prefix_col": "#1E293B"},
        {"prefix": "Mode Weights:", "text": "Safe (wE=2.5, wT=0.2, wS=8.0, wH=5.0, wV=0) · Balanced (wE=0.4, wT=3.0, wS=1.5, wH=1.0, wV=0) · Science (wE=0.8, wT=0.5, wS=1.2, wH=1.0, wV=8.0).", "prefix_col": "#1D4ED8"}
    ]
    render_bullet_list(c, 498, 126, 390, s5_cost, font_size=7.8, leading=10, space_after=4)

    # Right Panel Bottom: What these results do and do not show
    draw_card(c, 485, 320, 417.4, 193, "WHAT THESE RESULTS DO AND DO NOT SHOW", GREEN_ACCENT, CARD_ORANGE, BORDER_ORANGE)
    s5_what = [
        {"prefix": "Science Mode Impact:", "text": "Adds +28% distance and +28% energy vs Balanced for this pair.", "prefix_col": "#EA580C"},
        {"prefix": "Safe Mode Overlap:", "text": "Safe did not reduce energy vs Balanced here (1,616 vs 1,591 kJ); the two routes share 42% of nodes.", "prefix_col": "#EA580C"},
        {"prefix": "Planning Preferences:", "text": "These are planning preferences on a surrogate grid, not astronaut performance predictions.", "prefix_col": "#EA580C"},
        {"prefix": "Fallback Behavior:", "text": "If backend is unreachable, web UI falls back to pre-baked routes; those numbers are static.", "prefix_col": "#DC2626"}
    ]
    render_bullet_list(c, 498, 346, 390, s5_what, font_size=7.8, leading=10.5, space_after=5)

    c.showPage()

    # =========================================================================
    # SLIDE 6: REAL-WORLD EVIDENCE & SCIENCE ALONG THE TRAVERSE
    # =========================================================================
    c.setFillColor(BG_WHITE)
    c.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, fill=1, stroke=0)
    draw_header(c, "REAL-WORLD EVIDENCE & SCIENTIFIC CONTEXT",
                "A Marswalk Should Explore More Than Distance.",
                "Scientific context is layered over the route, with orbital interpretation kept separate from rover ground truth.",
                slide_num=6, tag_color=GREEN_ACCENT)

    # Left Panel: Rover Track over Authored Geology
    draw_card(c, 57.6, 98, 435, 415, "ROVER GROUND TRACK OVER AUTHORED GEOLOGY", BLUE_DARK, CARD_BG)
    if os.path.exists(fig6):
        c.drawImage(fig6, 68, to_rl_y(124, 290), width=414, height=290, preserveAspectRatio=True)

    c.setFont('Helvetica', 7.5)
    c.setFillColor(TEXT_MUTED)
    p_cap6 = Paragraph('<font color="#64748B">Orange track & white dots: real Perseverance MMGIS data. Coloured polygons & stars: authored overlays in repo (coarse polygons, hand-placed targets). Blue dashed box: modelled sector.</font>', ParagraphStyle('Cap6', fontName='Helvetica', fontSize=7.5, leading=10))
    p_cap6.wrap(414, 45)
    p_cap6.drawOn(c, 68, to_rl_y(430, p_cap6.height))

    # Right Panel: Ground Truth vs Orbital Interpretation
    draw_card(c, 510, 98, 392.4, 175, "GROUND TRUTH (ROVER)", GREEN_ACCENT, CARD_GREEN, BORDER_GREEN)
    s6_gt = [
        {"prefix": "Perseverance MMGIS Data:", "text": "Waypoint & traverse GeoJSON from NASA-AMMOS MMGIS (559 legs, 708 points).", "prefix_col": "#059669"},
        {"prefix": "Nearest-Observation Lookup:", "text": "Surface image cards (5 curated entries; live NASA raw-image API call with fallback).", "prefix_col": "#059669"},
        {"prefix": "Gale Crater Context:", "text": "Curiosity rover waypoints to sol 5073 for Gale boxwork preset context.", "prefix_col": "#059669"}
    ]
    render_bullet_list(c, 524, 126, 364, s6_gt, font_size=7.8, leading=10.5, space_after=4)

    draw_card(c, 510, 285, 392.4, 175, "ORBITAL INTERPRETATION (AUTHORED)", ORANGE_PRIMARY, CARD_ORANGE, BORDER_ORANGE)
    s6_oi = [
        {"prefix": "5 Geologic Unit Polygons:", "text": "Simplified after Sun & Stack (2020), USGS SIM 3464.", "prefix_col": "#EA580C"},
        {"prefix": "5 CRISM Science Targets:", "text": "Hand-authored GeoJSON citing CRISM cube IDs (no band-depth computation in repo).", "prefix_col": "#EA580C"},
        {"prefix": "Target Boundary Handling:", "text": "Lac de Charmes target (SCI-01) lies just outside routable sector: planner correctly rejects it.", "prefix_col": "#EA580C"}
    ]
    render_bullet_list(c, 524, 311, 364, s6_oi, font_size=7.8, leading=10.5, space_after=4)

    # Bottom Equation Pill
    draw_card(c, 510, 470, 392.4, 43, "", bg_color=CARD_BLUE, border_color=BORDER_BLUE)
    p_eq = Paragraph('<font color="#1D4ED8"><b>Terrain understanding + Scientific context + Route choice = Science-informed exploration planning</b></font>', ParagraphStyle('Eq', fontName='Helvetica', fontSize=7.5, leading=10.5, alignment=1))
    p_eq.wrap(380, 35)
    p_eq.drawOn(c, 516, to_rl_y(476, p_eq.height))

    c.showPage()

    # =========================================================================
    # SLIDE 7: ENGINEERING ARCHITECTURE, IMPACT, REFERENCES & LIMITATIONS
    # =========================================================================
    c.setFillColor(BG_WHITE)
    c.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, fill=1, stroke=0)
    draw_header(c, "ENGINEERING, IMPACT, REFERENCES & LIMITATIONS",
                "Building a Foundation for Data-Driven Mars Exploration.",
                "How the system is built, what has been tested, and what it cannot yet claim.",
                slide_num=7, tag_color=BLUE_DARK)

    # Left Column: Implementation & Testing
    draw_card(c, 57.6, 98, 400, 360, "SYSTEM IMPLEMENTATION & TESTING", BLUE_DARK, CARD_BG)
    s7_stk = [
        {"prefix": "Client:", "text": "Next.js 14 / React 18 · TypeScript · Tailwind CSS · OpenLayers 9 · Three.js (3D sector preview)", "prefix_col": "#1D4ED8"},
        {"prefix": "Services:", "text": "Python 3.11 · FastAPI · NumPy · SciPy · Rasterio · Endpoints: /health, /point-telemetry, /plan-eva, /rover-pov, /environmental, /briefing", "prefix_col": "#1D4ED8"},
        {"prefix": "Computation:", "text": "TerrainEngine (grid sampling, hazard classes) · EVARoutePlanner (8-connected A*, Pandolf-Santee cost)", "prefix_col": "#1D4ED8"},
        {"prefix": "Data:", "text": "Static .npz grid & GeoJSON in repo; live NASA raw-image API call with curated fallback", "prefix_col": "#1D4ED8"},
        {"prefix": "Deployment:", "text": "Frontend on Vercel (mars-atlas-nasa.vercel.app); Backend on Render via render.yaml", "prefix_col": "#1D4ED8"},
        {"prefix": "Testing:", "text": "8 pytest tests pass in 7s: geodesy, grid loading, point sampling, bounds, Horn formula, A* convergence, rover lookup, API endpoints", "prefix_col": "#059669"}
    ]
    render_bullet_list(c, 70, 126, 375, s7_stk, font_size=7.8, leading=10.5, space_after=6)

    # Right Column Top: Intended Impact
    draw_card(c, 475, 98, 427.4, 170, "INTENDED IMPACT", GREEN_ACCENT, CARD_GREEN, BORDER_GREEN)
    s7_imp = [
        {"prefix": "Workflow Integration:", "text": "MarsAtlas demonstrates how planetary observations can be organised into one workflow: terrain interpretation, scientific context, and computational traverse comparison.", "prefix_col": "#059669"},
        {"prefix": "NASA Challenge Response:", "text": "Directly targets the challenge's call for a layered, route-aware view for future Marswalk planning.", "prefix_col": "#059669"}
    ]
    render_bullet_list(c, 489, 126, 399, s7_imp, font_size=8.0, leading=11, space_after=6)

    # Right Column Bottom: Limitations
    draw_card(c, 475, 280, 427.4, 178, "LIMITATIONS & SCIENTIFIC INTEGRITY", RED_ACCENT, CARD_RED, BORDER_RED)
    s7_lim = [
        {"prefix": "Prototype Status:", "text": "Experimental prototype; not a certified astronaut safety system.", "prefix_col": "#DC2626"},
        {"prefix": "Surrogate Data:", "text": "Terrain grid is a surrogate; real HiRISE-derived data is required before claiming terrain accuracy.", "prefix_col": "#DC2626"},
        {"prefix": "Model Assumptions:", "text": "Route outputs depend on Tier 3 model assumptions (75 kg + 85 kg, η mapping).", "prefix_col": "#DC2626"},
        {"prefix": "Radiation Proxy:", "text": "Radiation shielding is a fixed factor; Gale RAD baseline used as Jezero proxy.", "prefix_col": "#DC2626"}
    ]
    render_bullet_list(c, 489, 308, 399, s7_lim, font_size=8.0, leading=11, space_after=6)

    # Bottom Banner
    draw_card(c, 57.6, 470, 844.8, 45, "", bg_color=CARD_BLUE, border_color=BORDER_BLUE)
    p_b7 = Paragraph('<font color="#1D4ED8"><b>MarsAtlas — From Planetary Data to Exploration Decisions.</b></font><br/><font color="#EA580C">Live Application: https://mars-atlas-nasa.vercel.app/   •   Source Code: https://github.com/shubham25-droid/MarsAtlas</font>', ParagraphStyle('B7', fontName='Helvetica', fontSize=8.5, leading=11.5, alignment=1))
    p_b7.wrap(820, 35)
    p_b7.drawOn(c, 70, to_rl_y(476, p_b7.height))

    c.save()
    print(f"SIH-Style PDF Presentation saved successfully: {pdf_path}")

if __name__ == "__main__":
    build_sih_pdf()

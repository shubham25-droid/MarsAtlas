import os
import pptx
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

from reportlab.lib import colors
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle

# =============================================================================
# DESIGN SYSTEM CONSTANTS
# =============================================================================
# Colors (Deep Space Palette)
C_NAVY_HEX = '#08111F'
C_SLATE_HEX = '#111D2E'
C_WHITE_HEX = '#F5F7FA'
C_GREY_HEX = '#AAB7C4'
C_ORANGE_HEX = '#D96B3B'
C_CYAN_HEX = '#55C7D9'
C_GOLD_HEX = '#E8B85A'
C_BORDER_HEX = '#29394B'
C_RED_HEX = '#E05252'
C_GREEN_HEX = '#34D399'

# PPTX Colors
RGB_NAVY = RGBColor(8, 17, 31)          # #08111F
RGB_SLATE = RGBColor(17, 29, 46)        # #111D2E
RGB_WHITE = RGBColor(245, 247, 250)     # #F5F7FA
RGB_GREY = RGBColor(170, 183, 196)      # #AAB7C4
RGB_ORANGE = RGBColor(217, 107, 59)     # #D96B3B
RGB_CYAN = RGBColor(85, 199, 217)       # #55C7D9
RGB_GOLD = RGBColor(232, 184, 90)       # #E8B85A
RGB_BORDER = RGBColor(41, 57, 75)       # #29394B
RGB_RED = RGBColor(224, 82, 82)         # #E05252
RGB_GREEN = RGBColor(52, 211, 153)      # #34D399

# ReportLab Colors
RL_NAVY = colors.HexColor(C_NAVY_HEX)
RL_SLATE = colors.HexColor(C_SLATE_HEX)
RL_WHITE = colors.HexColor(C_WHITE_HEX)
RL_GREY = colors.HexColor(C_GREY_HEX)
RL_ORANGE = colors.HexColor(C_ORANGE_HEX)
RL_CYAN = colors.HexColor(C_CYAN_HEX)
RL_GOLD = colors.HexColor(C_GOLD_HEX)
RL_BORDER = colors.HexColor(C_BORDER_HEX)
RL_RED = colors.HexColor(C_RED_HEX)
RL_GREEN = colors.HexColor(C_GREEN_HEX)

# Dimensions
PAGE_W_PT = 960.0
PAGE_H_PT = 540.0
SLIDE_W_IN = 13.333
SLIDE_H_IN = 7.5

BASE_DIR = r"D:\Antigravity Workspace\NASA Space Challenge 2026\MarsAtlas\docs\presentation\final"
ASSETS_DIR = os.path.join(BASE_DIR, "assets")

FIG1 = os.path.join(ASSETS_DIR, "fig1_perseverance_traverse.png")
FIG4 = os.path.join(ASSETS_DIR, "fig4_terrain_heatmaps.png")
FIG5 = os.path.join(ASSETS_DIR, "fig5_astar_routes.png")
FIG6 = os.path.join(ASSETS_DIR, "fig6_geology_overlays.png")
INSIGNIA = os.path.join(ASSETS_DIR, "marsatlas_insignia.jpg")
APP_SCREEN = os.path.join(ASSETS_DIR, "app_screenshot.jpg")

# =============================================================================
# PART 1: POWERPOINT (PPTX) GENERATOR
# =============================================================================
def generate_pptx():
    prs = pptx.Presentation()
    prs.slide_width = Inches(SLIDE_W_IN)
    prs.slide_height = Inches(SLIDE_H_IN)
    blank_layout = prs.slide_layouts[6]

    def set_bg(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(SLIDE_W_IN), Inches(SLIDE_H_IN))
        bg.fill.solid()
        bg.fill.fore_color.rgb = RGB_NAVY
        bg.line.fill.background()
        return bg

    def add_header(slide, tag_text, title_text, subtitle_text=None, slide_num=1, tag_color=RGB_ORANGE):
        hb = slide.shapes.add_textbox(Inches(0.8), Inches(0.35), Inches(11.733), Inches(1.15))
        tf = hb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0

        p_tag = tf.paragraphs[0]
        p_tag.text = tag_text.upper()
        p_tag.font.name = "Arial"
        p_tag.font.size = Pt(10.5)
        p_tag.font.bold = True
        p_tag.font.color.rgb = tag_color
        p_tag.space_after = Pt(2)

        p_title = tf.add_paragraph()
        p_title.text = title_text
        p_title.font.name = "Arial"
        p_title.font.size = Pt(22)
        p_title.font.bold = True
        p_title.font.color.rgb = RGB_WHITE

        if subtitle_text:
            p_sub = tf.add_paragraph()
            p_sub.text = subtitle_text
            p_sub.font.name = "Arial"
            p_sub.font.size = Pt(11.5)
            p_sub.font.color.rgb = RGB_GREY
            p_sub.space_before = Pt(2)

        # Right header badge
        badge = slide.shapes.add_textbox(Inches(9.2), Inches(0.38), Inches(3.333), Inches(0.4))
        tf_b = badge.text_frame
        p_b = tf_b.paragraphs[0]
        p_b.alignment = PP_ALIGN.RIGHT
        p_b.text = f"NASA Space Apps 2026  •  Slide {slide_num} of 7"
        p_b.font.name = "Arial"
        p_b.font.size = Pt(10)
        p_b.font.bold = True
        p_b.font.color.rgb = RGB_CYAN

        # Divider line
        line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.52), Inches(11.733), Inches(0.018))
        line.fill.solid()
        line.fill.fore_color.rgb = RGB_BORDER
        line.line.fill.background()

    def add_card(slide, left, top, width, height, title=None, title_color=RGB_ORANGE, bg_color=RGB_SLATE, border_color=RGB_BORDER):
        shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(height))
        shape.fill.solid()
        shape.fill.fore_color.rgb = bg_color
        shape.line.color.rgb = border_color
        shape.line.width = Pt(1.2)

        if title:
            tb = slide.shapes.add_textbox(Inches(left + 0.22), Inches(top + 0.16), Inches(width - 0.44), Inches(0.35))
            tf = tb.text_frame
            tf.word_wrap = True
            tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
            p = tf.paragraphs[0]
            p.text = title.upper()
            p.font.name = "Arial"
            p.font.size = Pt(11)
            p.font.bold = True
            p.font.color.rgb = title_color
        return shape

    def add_bullet(text_frame, bold_prefix, text_body, pt_size=10, prefix_col=RGB_CYAN, text_col=RGB_WHITE, space_after=5):
        p = text_frame.add_paragraph() if len(text_frame.text) > 0 else text_frame.paragraphs[0]
        p.space_after = Pt(space_after)
        p.line_spacing = 1.15

        run_bullet = p.add_run()
        run_bullet.text = "▪ "
        run_bullet.font.name = "Arial"
        run_bullet.font.size = Pt(pt_size)
        run_bullet.font.bold = True
        run_bullet.font.color.rgb = prefix_col

        if bold_prefix:
            run_bold = p.add_run()
            run_bold.text = bold_prefix + (" " if not bold_prefix.endswith(" ") else "")
            run_bold.font.name = "Arial"
            run_bold.font.size = Pt(pt_size)
            run_bold.font.bold = True
            run_bold.font.color.rgb = prefix_col

        run_text = p.add_run()
        run_text.text = text_body
        run_text.font.name = "Arial"
        run_text.font.size = Pt(pt_size)
        run_text.font.color.rgb = text_col

    # -------------------------------------------------------------------------
    # SLIDE 1: PROJECT TITLE & SUMMARY
    # -------------------------------------------------------------------------
    s1 = prs.slides.add_slide(blank_layout)
    set_bg(s1)

    # Top Tag
    tb1_top = s1.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.733), Inches(0.5))
    tf1_top = tb1_top.text_frame
    p1_t = tf1_top.paragraphs[0]
    p1_t.text = "NASA SPACE APPS CHALLENGE 2026  •  INTERPLANETARY SURVIVAL GUIDE: MARTIAN MAP"
    p1_t.font.name = "Arial"
    p1_t.font.size = Pt(11)
    p1_t.font.bold = True
    p1_t.font.color.rgb = RGB_ORANGE

    # Left Container: Title, Summary, Metadata
    add_card(s1, 0.8, 1.05, 6.2, 5.9, bg_color=RGB_SLATE, border_color=RGB_BORDER)
    
    tb1_m = s1.shapes.add_textbox(Inches(1.05), Inches(1.25), Inches(5.7), Inches(5.5))
    tf1_m = tb1_m.text_frame
    tf1_m.word_wrap = True

    p1_title = tf1_m.paragraphs[0]
    p1_title.text = "MarsAtlas"
    p1_title.font.name = "Arial"
    p1_title.font.size = Pt(36)
    p1_title.font.bold = True
    p1_title.font.color.rgb = RGB_WHITE

    p1_sub = tf1_m.add_paragraph()
    p1_sub.text = "Integrated Martian Terrain Intelligence and EVA Traverse Planning"
    p1_sub.font.name = "Arial"
    p1_sub.font.size = Pt(14)
    p1_sub.font.bold = True
    p1_sub.font.color.rgb = RGB_CYAN
    p1_sub.space_before = Pt(3)

    p1_tagline = tf1_m.add_paragraph()
    p1_tagline.text = "Explore Mars. Understand Terrain. Plan Every Traverse."
    p1_tagline.font.name = "Arial"
    p1_tagline.font.size = Pt(11.5)
    p1_tagline.font.bold = True
    p1_tagline.font.color.rgb = RGB_GOLD
    p1_tagline.space_before = Pt(2)
    p1_tagline.space_after = Pt(10)

    # 55-75 word concise summary
    p1_sum = tf1_m.add_paragraph()
    p1_sum.text = "MarsAtlas is an integrated planetary geospatial intelligence and extravehicular activity (EVA) mission-planning platform developed for the NASA Space Apps Challenge 2026. Designed for future human exploration of Jezero Crater, Mars, MarsAtlas bridges raw orbital observations, metric terrain topography, and rover telemetry with human bioenergetic constraints. By modeling slope-dependent metabolic workloads, the system enables astronauts and flight controllers to evaluate realistic, terrain-aware surface traverse alternatives."
    p1_sum.font.name = "Arial"
    p1_sum.font.size = Pt(10)
    p1_sum.font.color.rgb = RGB_WHITE
    p1_sum.space_after = Pt(12)

    # Bullet metadata
    add_bullet(tf1_m, "Primary Study Region:", "Jezero Crater, Mars (18.44°N, 77.45°E) — Perseverance Landing Corridor", 9.5, prefix_col=RGB_CYAN)
    add_bullet(tf1_m, "Live Application:", "https://mars-atlas-nasa.vercel.app/ (Production WebGIS)", 9.5, prefix_col=RGB_ORANGE)
    add_bullet(tf1_m, "High-Performance API:", "https://marsatlas-backend.onrender.com/ (FastAPI / GDAL)", 9.5, prefix_col=RGB_ORANGE)
    add_bullet(tf1_m, "Source Code:", "github.com/shubham25-droid/MarsAtlas (MIT License)", 9.5, prefix_col=RGB_ORANGE)
    add_bullet(tf1_m, "Project Status:", "Experimental Research Prototype", 9.5, prefix_col=RGB_GREEN)

    # Right Container: Real Perseverance Traverse Map
    add_card(s1, 7.2, 1.05, 5.333, 5.9, title="PERSEVERANCE TRAVERSE & MODELLED SECTOR", title_color=RGB_CYAN, bg_color=RGB_SLATE)
    if os.path.exists(FIG1):
        s1.shapes.add_picture(FIG1, Inches(7.4), Inches(1.5), width=Inches(4.933))

    tb1_cap = s1.shapes.add_textbox(Inches(7.4), Inches(5.4), Inches(4.933), Inches(1.3))
    tf1_cap = tb1_cap.text_frame
    tf1_cap.word_wrap = True
    p1_cap = tf1_cap.paragraphs[0]
    p1_cap.text = "Figure rendered directly from data/processed/m20_traverse.json in the repository (NASA-AMMOS MMGIS product, 559 drive legs, sols 13–2022). Dashed box = modelled EVA sector (77.35–77.46°E, 18.41–18.48°N).\nIndependent project. Not affiliated with or endorsed by NASA."
    p1_cap.font.name = "Arial"
    p1_cap.font.size = Pt(8.5)
    p1_cap.font.color.rgb = RGB_GREY

    # -------------------------------------------------------------------------
    # SLIDE 2: THE PROBLEM
    # -------------------------------------------------------------------------
    s2 = prs.slides.add_slide(blank_layout)
    set_bg(s2)
    add_header(s2, "THE SCIENTIFIC PROBLEM",
               "Mapping Mars Is Not the Same as Planning a Marswalk.",
               "Mission archives hold rich observations, but each product answers a different scientific question.",
               slide_num=2, tag_color=RGB_RED)

    # Left Column: 6 Mission Observation Silos
    add_card(s2, 0.8, 1.65, 3.6, 4.6, title="MISSION OBSERVATION ARCHIVES", title_color=RGB_CYAN, bg_color=RGB_SLATE)
    tb2_s = s2.shapes.add_textbox(Inches(0.95), Inches(2.05), Inches(3.3), Inches(4.1))
    tf2_s = tb2_s.text_frame
    tf2_s.word_wrap = True
    add_bullet(tf2_s, "Orbital Imagery:", "CTX, HiRISE · 2D image tiles (albedo & optical morphology only)", 9.5, prefix_col=RGB_CYAN)
    add_bullet(tf2_s, "Digital Terrain Models:", "HiRISE DTM, MOLA · elevation (m) & regional topography", 9.5, prefix_col=RGB_CYAN)
    add_bullet(tf2_s, "Geologic Maps:", "USGS SIM 3464 · 1:75,000 stratigraphy & formation polygons", 9.5, prefix_col=RGB_CYAN)
    add_bullet(tf2_s, "Thermal Observations:", "THEMIS, TES · thermal inertia (regolith grain-size proxy)", 9.5, prefix_col=RGB_CYAN)
    add_bullet(tf2_s, "Mineralogy:", "CRISM MTRDR · hyperspectral parameters (smectites, carbonates)", 9.5, prefix_col=RGB_CYAN)
    add_bullet(tf2_s, "Rover Ground Truth:", "NASA-AMMOS MMGIS · waypoints, in-situ Mastcam/SuperCam", 9.5, prefix_col=RGB_CYAN)

    # Center: Differences to Reconcile
    add_card(s2, 4.6, 2.1, 2.7, 3.7, title="DIFFERENCES TO RECONCILE", title_color=RGB_ORANGE, bg_color=RGB_SLATE, border_color=RGB_ORANGE)
    tb2_d = s2.shapes.add_textbox(Inches(4.75), Inches(2.55), Inches(2.4), Inches(3.1))
    tf2_d = tb2_d.text_frame
    tf2_d.word_wrap = True
    add_bullet(tf2_d, "Spatial Resolution:", "1m (HiRISE) to 100m (THEMIS) to 463m (MOLA)", 9.5, prefix_col=RGB_ORANGE)
    add_bullet(tf2_d, "Coordinate Reference:", "Equirectangular vs Orthographic planetocentric", 9.5, prefix_col=RGB_ORANGE)
    add_bullet(tf2_d, "Spatial Coverage:", "Narrow targeted strips vs global continuous basemaps", 9.5, prefix_col=RGB_ORANGE)
    add_bullet(tf2_d, "Acquisition Times:", "Decades apart under differing solar phases", 9.5, prefix_col=RGB_ORANGE)
    add_bullet(tf2_d, "Scientific Purpose:", "Mineral science vs safety landing vs navigation", 9.5, prefix_col=RGB_ORANGE)

    # Right: What an Explorer Needs
    add_card(s2, 7.5, 1.65, 5.033, 4.6, title="WHAT AN EXPLORER ACTUALLY NEEDS", title_color=RGB_GREEN, bg_color=RGB_SLATE)
    tb2_n = s2.shapes.add_textbox(Inches(7.75), Inches(2.05), Inches(4.533), Inches(4.1))
    tf2_n = tb2_n.text_frame
    tf2_n.word_wrap = True
    add_bullet(tf2_n, "Understand Terrain Kinematics:", "Assess 3D slope gradients, slip boundaries, and obstacle roughness rather than optical brightness.", 10, prefix_col=RGB_GREEN)
    add_bullet(tf2_n, "Investigate Candidate Targets:", "Identify high-priority mineral contacts and stratigraphy within safe walking distance.", 10, prefix_col=RGB_GREEN)
    add_bullet(tf2_n, "Compare Candidate Traverses:", "Evaluate terrain-aware route alternatives respecting strict PLSS consumable margins (oxygen, cooling, power).", 10, prefix_col=RGB_GREEN)
    add_bullet(tf2_n, "Science Along the Path:", "Maximize sample return opportunities without crossing impassable cliffs (>20°).", 10, prefix_col=RGB_GREEN)
    add_bullet(tf2_n, "Unified Spatial Scale:", "Inspect all observations simultaneously in one calibrated coordinate space.", 10, prefix_col=RGB_GREEN)

    # Bottom Question Banner
    add_card(s2, 0.8, 6.4, 11.733, 0.65, bg_color=RGB_SLATE, border_color=RGB_CYAN)
    tb2_b = s2.shapes.add_textbox(Inches(1.0), Inches(6.48), Inches(11.333), Inches(0.5))
    p2_bb = tb2_b.text_frame.paragraphs[0]
    p2_bb.text = "CORE OPERATIONAL QUESTION: How can heterogeneous planetary observations become actionable exploration intelligence for future human Marswalks?"
    p2_bb.font.name = "Arial"
    p2_bb.font.size = Pt(10.5)
    p2_bb.font.bold = True
    p2_bb.font.color.rgb = RGB_CYAN

    # -------------------------------------------------------------------------
    # SLIDE 3: THE SOLUTION & DATA PIPELINE
    # -------------------------------------------------------------------------
    s3 = prs.slides.add_slide(blank_layout)
    set_bg(s3)
    add_header(s3, "THE MARSATLAS APPROACH",
               "One Exploration Environment. Multiple Scientific Perspectives.",
               "Data actually present in the repository, with how each item enters the app. Status reflects what the code does.",
               slide_num=3, tag_color=RGB_ORANGE)

    # 5-Step Process Pipeline Flowbar
    steps = [
        ("1. Planetary Observations", "USGS, PDS, MMGIS"),
        ("2. Coordinate Standard", "R = 3,396,190 m"),
        ("3. Terrain + Science Grid", "Elevation, Slope, η, CRISM"),
        ("4. Interactive Map & API", "OpenLayers + FastAPI"),
        ("5. Traverse Comparison", "Multi-Objective A*")
    ]
    step_w = 2.18
    step_gap = 0.2
    for idx, (st_t, st_d) in enumerate(steps):
        sx = 0.8 + idx * (step_w + step_gap)
        add_card(s3, sx, 1.65, step_w, 0.65, bg_color=RGB_SLATE, border_color=RGB_ORANGE if idx==2 else (RGB_GREEN if idx==4 else RGB_CYAN))
        tb_st = s3.shapes.add_textbox(Inches(sx + 0.08), Inches(1.7), Inches(step_w - 0.16), Inches(0.55))
        tf_st = tb_st.text_frame
        p_st1 = tf_st.paragraphs[0]
        p_st1.text = st_t
        p_st1.font.name = "Arial"
        p_st1.font.size = Pt(9)
        p_st1.font.bold = True
        p_st1.font.color.rgb = RGB_WHITE
        p_st2 = tf_st.add_paragraph()
        p_st2.text = st_d
        p_st2.font.name = "Arial"
        p_st2.font.size = Pt(7.5)
        p_st2.font.color.rgb = RGB_GREY

    # Repository Data Table
    t_shape3 = s3.shapes.add_table(8, 5, Inches(0.8), Inches(2.45), Inches(11.733), Inches(4.1))
    t3 = t_shape3.table
    t3.columns[0].width = Inches(2.8)
    t3.columns[1].width = Inches(1.7)
    t3.columns[2].width = Inches(2.3)
    t3.columns[3].width = Inches(3.333)
    t3.columns[4].width = Inches(1.6)

    h3_titles = ["DATASET (AS USED)", "ORIGIN", "COVERAGE / GRID", "ROLE IN MARSATLAS", "STATUS"]
    for j, h in enumerate(h3_titles):
        cell = t3.cell(0, j)
        cell.fill.solid()
        cell.fill.fore_color.rgb = RGB_BORDER
        p = cell.text_frame.paragraphs[0]
        p.text = h
        p.font.name = "Arial"
        p.font.size = Pt(9)
        p.font.bold = True
        p.font.color.rgb = RGB_CYAN

    t3_data = [
        ("USGS Astrogeology WMS basemaps (Viking mosaic, MOLA relief)", "USGS / NASA", "Global", "Basemap and swipe comparison in map UI", "In app (real data)"),
        ("Perseverance waypoints (708) & traverse (559 legs)", "NASA-AMMOS MMGIS", "Jezero; sols 13–2022", "Ground-truth track layer; nearest-obs lookup", "In app (real data)"),
        ("Curiosity waypoints (1,389)", "NASA-AMMOS MMGIS", "Gale; to sol 5073", "Gale boxwork preset context", "In app (real data)"),
        ("Terrain grid: elevation, slope, roughness, thermal inertia, η", "Repo jezero_eva_sector.npz", "550×350 cells, ~11.3×11.9 m; 77.35–77.46°E", "Cost surface for A* and point telemetry", "Surrogate; documented"),
        ("Geologic units (5) after Sun & Stack (2020), SIM 3464", "Hand-simplified polygons", "Jezero / Nili Planum", "Geologic context overlay", "Authored approx."),
        ("CRISM-referenced science targets (5 points)", "Hand-authored GeoJSON", "Jezero", "Targets and science bonus in route cost", "Authored; no cubes"),
        ("Rover observations: 5 curated + live NASA raw API", "NASA Mars 2020 API", "Jezero, Gale", "Waypoint-linked surface imagery cards", "In app (with fallback)")
    ]

    for i, row in enumerate(t3_data):
        for j, val in enumerate(row):
            cell = t3.cell(i + 1, j)
            cell.fill.solid()
            cell.fill.fore_color.rgb = RGB_SLATE if i % 2 == 0 else RGB_NAVY
            p = cell.text_frame.paragraphs[0]
            p.text = val
            p.font.name = "Arial"
            p.font.size = Pt(8.5)
            if j == 4:
                p.font.bold = True
                p.font.color.rgb = RGB_GREEN if "real" in val else (RGB_ORANGE if "documented" in val else RGB_GREY)
            elif j == 0:
                p.font.bold = True
                p.font.color.rgb = RGB_WHITE
            else:
                p.font.color.rgb = RGB_GREY

    tb3_fn = s3.shapes.add_textbox(Inches(0.8), Inches(6.65), Inches(11.733), Inches(0.4))
    p3_fn = tb3_fn.text_frame.paragraphs[0]
    p3_fn.text = "Documented in DATA_SOURCES.md but not wired into frontend map code: Mars Trek CTX & THEMIS WMTS layers, and raw 1m HiRISE DTM GeoTIFF."
    p3_fn.font.name = "Arial"
    p3_fn.font.size = Pt(8.5)
    p3_fn.font.color.rgb = RGB_GREY

    # -------------------------------------------------------------------------
    # SLIDE 4: TERRAIN INTELLIGENCE
    # -------------------------------------------------------------------------
    s4 = prs.slides.add_slide(blank_layout)
    set_bg(s4)
    add_header(s4, "TERRAIN INTELLIGENCE",
               "Understanding the Surface Beyond What the Eye Can See.",
               "Terrain-derived cost surface: elevation, slope, roughness and thermal inertia on one grid.",
               slide_num=4, tag_color=RGB_CYAN)

    add_card(s4, 0.8, 1.65, 6.2, 5.3, title="REPOSITORY GRID HEATMAPS (JEZERO_EVA_SECTOR.NPZ)", title_color=RGB_CYAN, bg_color=RGB_SLATE)
    if os.path.exists(FIG4):
        s4.shapes.add_picture(FIG4, Inches(0.95), Inches(2.05), width=Inches(5.9))

    tb4_cap = s4.shapes.add_textbox(Inches(0.95), Inches(5.65), Inches(5.9), Inches(1.2))
    tf4_cap = tb4_cap.text_frame
    tf4_cap.word_wrap = True
    p4_c = tf4_cap.paragraphs[0]
    p4_c.text = "Figure rendered from repository grid (jezero_eva_sector.npz, 550×350 cells, ~11.3×11.9 m/cell). Note: The grid is a prototype surrogate, not a validated raw HiRISE crop, so patterns shown are surrogate synthetic terrain."
    p4_c.font.name = "Arial"
    p4_c.font.size = Pt(8.5)
    p4_c.font.color.rgb = RGB_GREY

    add_card(s4, 7.2, 1.65, 5.333, 2.7, title="METHODS IN THE CODE", title_color=RGB_ORANGE, bg_color=RGB_SLATE)
    tb4_m = s4.shapes.add_textbox(Inches(7.4), Inches(2.0), Inches(4.933), Inches(2.3))
    tf4_m = tb4_m.text_frame
    tf4_m.word_wrap = True
    add_bullet(tf4_m, "Slope (θ):", "Horn 3×3 finite difference applied after 3×3 Gaussian smoothing; precomputed in grid.", 9, prefix_col=RGB_ORANGE)
    add_bullet(tf4_m, "Roughness (σz):", "Local elevation standard deviation σz, stored precomputed in the grid.", 9, prefix_col=RGB_ORANGE)
    add_bullet(tf4_m, "Terrain Factor (η):", "η = 1.0 + 0.5·clip((350−TI)/250) + 0.6·clip(σz/0.4); grid range: 1.00–1.59.", 9, prefix_col=RGB_ORANGE)
    add_bullet(tf4_m, "Coordinates:", "Angular to metres with Mars radius R = 3,396,190 m and cos(latitude).", 9, prefix_col=RGB_ORANGE)

    add_card(s4, 7.2, 4.45, 5.333, 2.5, title="GRID VALUES & VALIDATION AUDIT", title_color=RGB_GREEN, bg_color=RGB_SLATE)
    tb4_v = s4.shapes.add_textbox(Inches(7.4), Inches(4.8), Inches(4.933), Inches(2.1))
    tf4_v = tb4_v.text_frame
    tf4_v.word_wrap = True
    add_bullet(tf4_v, "Grid Values (From File):", "Elevation: −2,605 to −2,121 m · Slope: 0.0–22.7° (mean 4.8°) · Thermal inertia: 109–466 · Roughness: ≤ 0.26 m.", 9, prefix_col=RGB_GREEN)
    add_bullet(tf4_v, "Validation Check I Ran:", "Grid vs 276 Perseverance waypoint elevations in sector: RMSE 74 m, mean bias +55 m. Replace with real calibrated DTM before claiming operational flight accuracy.", 9, prefix_col=RGB_GREEN)
    add_bullet(tf4_v, "Known Limits:", "Raster cell bounds detectable features · Roughness is not bearing strength · Thermal inertia is not traction · No safety certification.", 9, prefix_col=RGB_RED)

    # -------------------------------------------------------------------------
    # SLIDE 5: ROUTE PLANNING
    # -------------------------------------------------------------------------
    s5 = prs.slides.add_slide(blank_layout)
    set_bg(s5)
    add_header(s5, "EVA TRAVERSE PLANNING",
               "From Shortest Distance to Terrain-Aware Traverse Decisions.",
               "8-connected A* search with a Pandolf-Santee metabolic cost, run on the repository grid.",
               slide_num=5, tag_color=RGB_ORANGE)

    add_card(s5, 0.8, 1.65, 5.6, 5.3, title="A* ROUTE OUTPUT & TRAVERSE COMPARISON", title_color=RGB_CYAN, bg_color=RGB_SLATE)
    if os.path.exists(FIG5):
        s5.shapes.add_picture(FIG5, Inches(1.4), Inches(2.05), width=Inches(4.4), height=Inches(3.0))

    t_shape5 = s5.shapes.add_table(4, 6, Inches(0.95), Inches(5.15), Inches(5.3), Inches(1.2))
    t5 = t_shape5.table
    t5.columns[0].width = Inches(1.1)
    t5.columns[1].width = Inches(0.8)
    t5.columns[2].width = Inches(0.85)
    t5.columns[3].width = Inches(0.85)
    t5.columns[4].width = Inches(0.85)
    t5.columns[5].width = Inches(0.85)

    h5_titles = ["STRATEGY", "DIST", "TIME", "ENERGY", "PEAK SLOPE", "DOSE*"]
    for j, h in enumerate(h5_titles):
        cell = t5.cell(0, j)
        cell.fill.solid()
        cell.fill.fore_color.rgb = RGB_BORDER
        p = cell.text_frame.paragraphs[0]
        p.text = h
        p.font.name = "Arial"
        p.font.size = Pt(8.5)
        p.font.bold = True
        p.font.color.rgb = RGB_CYAN

    t5_data = [
        ("Safe", "3.02 km", "88.0 min", "1,616 kJ", "13.3°", "27.0 µSv"),
        ("Balanced", "2.98 km", "86.6 min", "1,591 kJ", "13.3°", "26.6 µSv"),
        ("Science", "3.80 km", "113.0 min", "2,029 kJ", "13.7°", "35.3 µSv")
    ]
    for i, row in enumerate(t5_data):
        for j, val in enumerate(row):
            cell = t5.cell(i + 1, j)
            cell.fill.solid()
            cell.fill.fore_color.rgb = RGB_SLATE if i % 2 == 0 else RGB_NAVY
            p = cell.text_frame.paragraphs[0]
            p.text = val
            p.font.name = "Arial"
            p.font.size = Pt(8.5)
            p.font.color.rgb = RGB_ORANGE if j == 0 else RGB_WHITE

    tb5_note = s5.shapes.add_textbox(Inches(0.95), Inches(6.45), Inches(5.3), Inches(0.35))
    p5_n = tb5_note.text_frame.paragraphs[0]
    p5_n.text = "*Model estimate: constant shielding factor × 23.33 µSv/h baseline. Not a dose prediction."
    p5_n.font.name = "Arial"
    p5_n.font.size = Pt(8)
    p5_n.font.color.rgb = RGB_GREY

    add_card(s5, 6.6, 1.65, 5.933, 2.7, title="STEP COST ACTUALLY IMPLEMENTED (PLANNER.PY)", title_color=RGB_ORANGE, bg_color=RGB_SLATE)
    tb5_c = s5.shapes.add_textbox(Inches(6.8), Inches(2.0), Inches(5.533), Inches(2.3))
    tf5_c = tb5_c.text_frame
    tf5_c.word_wrap = True
    add_bullet(tf5_c, "Cost Function Formula:", "c = max(0.05, wE·E_hat + wT·T_hat + wS·(θ/10)² + wH·max(0, (250−TI)/100) − wV·min(0.6, V)) × d/10", 9, prefix_col=RGB_ORANGE)
    add_bullet(tf5_c, "Variables:", "E_hat, T_hat: energy and time per metre from Pandolf-Santee model and Apollo speed law V = (−0.01·S + 0.75)/η. θ: local slope (cells > 22° impassable). TI: thermal inertia slip proxy. V: authored CRISM target Gaussian bonus (σ = 25 cells).", 8.5)
    add_bullet(tf5_c, "Mode Weights:", "Safe (wE=2.5, wT=0.2, wS=8.0, wH=5.0, wV=0) · Balanced (wE=0.4, wT=3.0, wS=1.5, wH=1.0, wV=0) · Science (wE=0.8, wT=0.5, wS=1.2, wH=1.0, wV=8.0).", 8.5)

    add_card(s5, 6.6, 4.45, 5.933, 2.5, title="WHAT THESE RESULTS DO AND DO NOT SHOW", title_color=RGB_GOLD, bg_color=RGB_SLATE)
    tb5_w = s5.shapes.add_textbox(Inches(6.8), Inches(4.8), Inches(5.533), Inches(2.1))
    tf5_w = tb5_w.text_frame
    tf5_w.word_wrap = True
    add_bullet(tf5_w, "Science Mode Impact:", "Adds +28% distance and +28% energy vs Balanced for this pair.", 9, prefix_col=RGB_GOLD)
    add_bullet(tf5_w, "Safe Mode Overlap:", "Safe did not reduce energy vs Balanced here (1,616 vs 1,591 kJ); the two routes share 42% of nodes.", 9, prefix_col=RGB_GOLD)
    add_bullet(tf5_w, "Planning Preferences:", "These are planning preferences on a surrogate grid, not astronaut performance predictions.", 9, prefix_col=RGB_GOLD)
    add_bullet(tf5_w, "Fallback Behavior:", "If backend is unreachable, web UI falls back to pre-baked routes; those numbers are static.", 9, prefix_col=RGB_RED)

    # -------------------------------------------------------------------------
    # SLIDE 6: ROVER EVIDENCE & SCIENCE CONTEXT
    # -------------------------------------------------------------------------
    s6 = prs.slides.add_slide(blank_layout)
    set_bg(s6)
    add_header(s6, "SCIENCE ALONG THE TRAVERSE",
               "A Marswalk Should Explore More Than Distance.",
               "Scientific context is layered over the route, with orbital interpretation kept separate from rover ground truth.",
               slide_num=6, tag_color=RGB_CYAN)

    add_card(s6, 0.8, 1.65, 5.8, 5.3, title="ROVER GROUND TRACK OVER AUTHORED GEOLOGY", title_color=RGB_CYAN, bg_color=RGB_SLATE)
    if os.path.exists(FIG6):
        s6.shapes.add_picture(FIG6, Inches(0.95), Inches(2.05), width=Inches(5.5))

    tb6_cap = s6.shapes.add_textbox(Inches(0.95), Inches(5.75), Inches(5.5), Inches(1.1))
    tf6_cap = tb6_cap.text_frame
    tf6_cap.word_wrap = True
    p6_c = tf6_cap.paragraphs[0]
    p6_c.text = "Orange track & white dots: real Perseverance MMGIS data. Coloured polygons & stars: authored overlays in repo (coarse polygons, hand-placed targets). Blue dashed box: modelled sector."
    p6_c.font.name = "Arial"
    p6_c.font.size = Pt(8.5)
    p6_c.font.color.rgb = RGB_GREY

    add_card(s6, 6.8, 1.65, 5.733, 2.3, title="GROUND TRUTH (ROVER)", title_color=RGB_GREEN, bg_color=RGB_SLATE)
    tb6_gt = s6.shapes.add_textbox(Inches(7.0), Inches(2.0), Inches(5.333), Inches(1.9))
    tf6_gt = tb6_gt.text_frame
    tf6_gt.word_wrap = True
    add_bullet(tf6_gt, "Perseverance MMGIS Data:", "Waypoint & traverse GeoJSON from NASA-AMMOS MMGIS (559 legs, 708 points).", 9, prefix_col=RGB_GREEN)
    add_bullet(tf6_gt, "Nearest-Observation Lookup:", "Surface image cards (5 curated entries; live NASA raw-image API call with fallback).", 9, prefix_col=RGB_GREEN)
    add_bullet(tf6_gt, "Gale Crater Context:", "Curiosity rover waypoints to sol 5073 for Gale boxwork preset context.", 9, prefix_col=RGB_GREEN)

    add_card(s6, 6.8, 4.05, 5.733, 2.3, title="ORBITAL INTERPRETATION (AUTHORED)", title_color=RGB_ORANGE, bg_color=RGB_SLATE)
    tb6_oi = s6.shapes.add_textbox(Inches(7.0), Inches(4.4), Inches(5.333), Inches(1.9))
    tf6_oi = tb6_oi.text_frame
    tf6_oi.word_wrap = True
    add_bullet(tf6_oi, "5 Geologic Unit Polygons:", "Simplified after Sun & Stack (2020), USGS SIM 3464.", 9, prefix_col=RGB_ORANGE)
    add_bullet(tf6_oi, "5 CRISM Science Targets:", "Hand-authored GeoJSON citing CRISM cube IDs (no band-depth computation in repo).", 9, prefix_col=RGB_ORANGE)
    add_bullet(tf6_oi, "Target Boundary Handling:", "Lac de Charmes target (SCI-01) lies just outside routable sector: planner correctly rejects it.", 9, prefix_col=RGB_ORANGE)

    bot_p6 = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(6.45), Inches(5.733), Inches(0.5))
    bot_p6.fill.solid()
    bot_p6.fill.fore_color.rgb = RGB_SLATE
    bot_p6.line.color.rgb = RGB_CYAN
    tb6_p = s6.shapes.add_textbox(Inches(6.9), Inches(6.5), Inches(5.533), Inches(0.4))
    p6_bp = tb6_p.text_frame.paragraphs[0]
    p6_bp.alignment = PP_ALIGN.CENTER
    p6_bp.text = "Terrain understanding + Scientific context + Route choice = Science-informed planning"
    p6_bp.font.name = "Arial"
    p6_bp.font.size = Pt(9)
    p6_bp.font.bold = True
    p6_bp.font.color.rgb = RGB_CYAN

    # -------------------------------------------------------------------------
    # SLIDE 7: ENGINEERING, IMPACT & LIMITATIONS
    # -------------------------------------------------------------------------
    s7 = prs.slides.add_slide(blank_layout)
    set_bg(s7)
    add_header(s7, "ENGINEERING, IMPACT AND LIMITATIONS",
               "Building a Foundation for Data-Driven Mars Exploration.",
               "How the system is built, what has been tested, and what it cannot yet claim.",
               slide_num=7, tag_color=RGB_CYAN)

    add_card(s7, 0.8, 1.65, 5.6, 4.6, title="SYSTEM IMPLEMENTATION & TESTING", title_color=RGB_CYAN, bg_color=RGB_SLATE)
    tb7_s = s7.shapes.add_textbox(Inches(0.95), Inches(2.05), Inches(5.3), Inches(4.1))
    tf7_s = tb7_s.text_frame
    tf7_s.word_wrap = True
    add_bullet(tf7_s, "Client:", "Next.js 14 / React 18 · TypeScript · Tailwind CSS · OpenLayers 9 · Three.js (3D sector preview)", 9, prefix_col=RGB_CYAN)
    add_bullet(tf7_s, "Services:", "Python 3.11 · FastAPI · NumPy · SciPy · Rasterio · Endpoints: /health, /point-telemetry, /plan-eva, /rover-pov, /environmental, /briefing", 9, prefix_col=RGB_CYAN)
    add_bullet(tf7_s, "Computation:", "TerrainEngine (grid sampling, hazard classes) · EVARoutePlanner (8-connected A*, Pandolf-Santee cost)", 9, prefix_col=RGB_CYAN)
    add_bullet(tf7_s, "Data:", "Static .npz grid & GeoJSON in repo; live NASA raw-image API call with curated fallback", 9, prefix_col=RGB_CYAN)
    add_bullet(tf7_s, "Deployment:", "Frontend on Vercel (mars-atlas-nasa.vercel.app); Backend on Render via render.yaml", 9, prefix_col=RGB_CYAN)
    add_bullet(tf7_s, "Testing:", "8 pytest tests pass in 7s: geodesy, grid loading, point sampling, bounds, Horn formula, A* convergence, rover lookup, API endpoints", 9, prefix_col=RGB_GREEN)

    add_card(s7, 6.6, 1.65, 5.933, 2.2, title="INTENDED IMPACT", title_color=RGB_GREEN, bg_color=RGB_SLATE)
    tb7_i = s7.shapes.add_textbox(Inches(6.8), Inches(2.0), Inches(5.533), Inches(1.8))
    tf7_i = tb7_i.text_frame
    tf7_i.word_wrap = True
    add_bullet(tf7_i, "Workflow Integration:", "MarsAtlas demonstrates how planetary observations can be organised into one workflow: terrain interpretation, scientific context, and computational traverse comparison.", 9, prefix_col=RGB_GREEN)
    add_bullet(tf7_i, "NASA Challenge Response:", "Directly targets the challenge's call for a layered, route-aware view for future Marswalk planning.", 9, prefix_col=RGB_GREEN)

    add_card(s7, 6.6, 3.95, 5.933, 2.3, title="LIMITATIONS & SCIENTIFIC INTEGRITY", title_color=RGB_RED, bg_color=RGB_SLATE)
    tb7_l = s7.shapes.add_textbox(Inches(6.8), Inches(4.3), Inches(5.533), Inches(1.9))
    tf7_l = tb7_l.text_frame
    tf7_l.word_wrap = True
    add_bullet(tf7_l, "Prototype Status:", "Experimental prototype; not a certified astronaut safety system.", 9, prefix_col=RGB_RED)
    add_bullet(tf7_l, "Surrogate Data:", "Terrain grid is a surrogate; real HiRISE-derived data is required before claiming terrain accuracy.", 9, prefix_col=RGB_RED)
    add_bullet(tf7_l, "Model Assumptions:", "Route outputs depend on Tier 3 model assumptions (75 kg + 85 kg, η mapping).", 9, prefix_col=RGB_RED)
    add_bullet(tf7_l, "Radiation Proxy:", "Radiation shielding is a fixed factor; Gale RAD baseline used as Jezero proxy.", 9, prefix_col=RGB_RED)

    # Bottom Banner
    add_card(s7, 0.8, 6.35, 11.733, 0.7, bg_color=RGB_SLATE, border_color=RGB_CYAN)
    tb7_b = s7.shapes.add_textbox(Inches(1.0), Inches(6.42), Inches(11.333), Inches(0.55))
    tf7_b = tb7_b.text_frame
    p7_1 = tf7_b.paragraphs[0]
    p7_1.alignment = PP_ALIGN.CENTER
    p7_1.text = "MARSATLAS — FROM PLANETARY DATA TO EXPLORATION DECISIONS."
    p7_1.font.name = "Arial"
    p7_1.font.size = Pt(11.5)
    p7_1.font.bold = True
    p7_1.font.color.rgb = RGB_CYAN

    p7_2 = tf7_b.add_paragraph()
    p7_2.alignment = PP_ALIGN.CENTER
    p7_2.text = "Live Application: https://mars-atlas-nasa.vercel.app/   •   Source Code: https://github.com/shubham25-droid/MarsAtlas"
    p7_2.font.name = "Arial"
    p7_2.font.size = Pt(9.5)
    p7_2.font.color.rgb = RGB_ORANGE

    pptx_path = os.path.join(BASE_DIR, "MarsAtlas_NASA_Space_Apps_2026_Final.pptx")
    prs.save(pptx_path)
    print(f"PowerPoint Presentation generated: {pptx_path}")

# =============================================================================
# PART 2: REPORTLAB PDF GENERATOR
# =============================================================================
def generate_pdf():
    pdf_path = os.path.join(BASE_DIR, "MarsAtlas_NASA_Space_Apps_2026_Final.pdf")
    c = canvas.Canvas(pdf_path, pagesize=(PAGE_W_PT, PAGE_H_PT))

    def to_rl_y(top, height):
        return PAGE_H_PT - top - height

    def set_bg():
        c.setFillColor(RL_NAVY)
        c.rect(0, 0, PAGE_W_PT, PAGE_H_PT, fill=1, stroke=0)

    def draw_header(tag_text, title_text, subtitle_text=None, slide_num=1, tag_color=RL_ORANGE):
        c.setFont('Helvetica-Bold', 9)
        c.setFillColor(tag_color)
        c.drawString(57.6, PAGE_H_PT - 36, tag_text.upper())

        c.setFont('Helvetica-Bold', 9)
        c.setFillColor(RL_CYAN)
        c.drawRightString(902.4, PAGE_H_PT - 36, f"NASA Space Apps 2026  •  Slide {slide_num} of 7")

        c.setFont('Helvetica-Bold', 18)
        c.setFillColor(RL_WHITE)
        c.drawString(57.6, PAGE_H_PT - 58, title_text)

        if subtitle_text:
            c.setFont('Helvetica', 9.5)
            c.setFillColor(RL_GREY)
            c.drawString(57.6, PAGE_H_PT - 74, subtitle_text)

        c.setStrokeColor(RL_BORDER)
        c.setLineWidth(1)
        c.line(57.6, PAGE_H_PT - 84, 902.4, PAGE_H_PT - 84)

    def draw_card(left, top, width, height, title=None, title_color=RL_ORANGE, bg_color=RL_SLATE, border_color=RL_BORDER):
        y = to_rl_y(top, height)
        c.setFillColor(bg_color)
        c.setStrokeColor(border_color)
        c.setLineWidth(1)
        c.roundRect(left, y, width, height, 6, fill=1, stroke=1)

        if title:
            c.setFont('Helvetica-Bold', 9.5)
            c.setFillColor(title_color)
            c.drawString(left + 14, PAGE_H_PT - top - 18, title.upper())

    def render_bullets(left, start_top, width, bullets, font_size=8.2, leading=10.5, space_after=4):
        curr_top = start_top
        for b in bullets:
            prefix = b.get("prefix", "")
            prefix_col = b.get("prefix_col", C_CYAN_HEX)
            text = b.get("text", "")
            text_col = b.get("text_col", C_WHITE_HEX)

            html = f'<font color="{prefix_col}">▪ <b>{prefix}</b></font> <font color="{text_col}">{text}</font>'
            style = ParagraphStyle(
                'BulletStyle',
                fontName='Helvetica',
                fontSize=font_size,
                leading=leading,
                textColor=RL_WHITE
            )
            p = Paragraph(html, style)
            w, h = p.wrap(width, 200)
            y = to_rl_y(curr_top, h)
            p.drawOn(c, left, y)
            curr_top += h + space_after
        return curr_top

    # -------------------------------------------------------------------------
    # SLIDE 1: TITLE & SUMMARY
    # -------------------------------------------------------------------------
    set_bg()
    c.setFont('Helvetica-Bold', 9.5)
    c.setFillColor(RL_ORANGE)
    c.drawString(57.6, PAGE_H_PT - 36, "NASA SPACE APPS CHALLENGE 2026  •  INTERPLANETARY SURVIVAL GUIDE: MARTIAN MAP")

    draw_card(57.6, 68, 440, 435, bg_color=RL_SLATE, border_color=RL_BORDER)
    c.setFont('Helvetica-Bold', 28)
    c.setFillColor(RL_WHITE)
    c.drawString(75, PAGE_H_PT - 105, "MarsAtlas")

    c.setFont('Helvetica-Bold', 11)
    c.setFillColor(RL_CYAN)
    c.drawString(75, PAGE_H_PT - 124, "Integrated Martian Terrain Intelligence and EVA Traverse Planning")

    c.setFont('Helvetica-Bold', 9.5)
    c.setFillColor(RL_GOLD)
    c.drawString(75, PAGE_H_PT - 139, "Explore Mars. Understand Terrain. Plan Every Traverse.")

    p1_sum = Paragraph('<font color="#F5F7FA">MarsAtlas is an integrated planetary geospatial intelligence and extravehicular activity (EVA) mission-planning platform developed for the NASA Space Apps Challenge 2026. Designed for future human exploration of Jezero Crater, Mars, MarsAtlas bridges raw orbital observations, metric terrain topography, and rover telemetry with human bioenergetic constraints. By modeling slope-dependent metabolic workloads, the system enables astronauts and flight controllers to evaluate realistic, terrain-aware surface traverse alternatives.</font>', ParagraphStyle('Sum', fontName='Helvetica', fontSize=7.8, leading=10.5))
    p1_sum.wrap(405, 100)
    p1_sum.drawOn(c, 75, to_rl_y(150, p1_sum.height))

    s1_bullets = [
        {"prefix": "Primary Study Region:", "text": "Jezero Crater, Mars (18.44°N, 77.45°E) — Perseverance Landing Corridor", "prefix_col": C_CYAN_HEX},
        {"prefix": "Live Application:", "text": "https://mars-atlas-nasa.vercel.app/ (Production WebGIS)", "prefix_col": C_ORANGE_HEX},
        {"prefix": "High-Performance API:", "text": "https://marsatlas-backend.onrender.com/ (FastAPI / GDAL)", "prefix_col": C_ORANGE_HEX},
        {"prefix": "Source Code:", "text": "github.com/shubham25-droid/MarsAtlas (MIT License)", "prefix_col": C_ORANGE_HEX},
        {"prefix": "Project Status:", "text": "Experimental Research Prototype", "prefix_col": C_GREEN_HEX}
    ]
    render_bullets(75, 255, 405, s1_bullets, font_size=8.0, leading=10.5, space_after=4)

    draw_card(515, 68, 387.4, 435, "PERSEVERANCE TRAVERSE & MODELLED SECTOR", RL_CYAN, RL_SLATE)
    if os.path.exists(FIG1):
        c.drawImage(FIG1, 528, to_rl_y(102, 310), width=360, height=310, preserveAspectRatio=True)

    p1_cap = Paragraph('<font color="#AAB7C4">Figure rendered directly from data/processed/m20_traverse.json in repo (NASA-AMMOS MMGIS product, 559 drive legs, sols 13–2022). Dashed box = modelled EVA sector (77.35–77.46°E, 18.41–18.48°N).<br/>Independent project. Not affiliated with or endorsed by NASA.</font>', ParagraphStyle('Cap1', fontName='Helvetica', fontSize=7.2, leading=9.5))
    p1_cap.wrap(360, 45)
    p1_cap.drawOn(c, 528, to_rl_y(430, p1_cap.height))

    c.showPage()

    # -------------------------------------------------------------------------
    # SLIDE 2: THE PROBLEM
    # -------------------------------------------------------------------------
    set_bg()
    draw_header("THE SCIENTIFIC PROBLEM",
                "Mapping Mars Is Not the Same as Planning a Marswalk.",
                "Mission archives hold rich observations, but each product answers a different scientific question.",
                slide_num=2, tag_color=RL_RED)

    draw_card(57.6, 98, 260, 360, "MISSION OBSERVATION ARCHIVES", RL_CYAN, RL_SLATE)
    s2_silos = [
        {"prefix": "Orbital imagery:", "text": "CTX, HiRISE · 2D image tiles (albedo & optical morphology)", "prefix_col": C_CYAN_HEX},
        {"prefix": "Digital terrain models:", "text": "HiRISE DTM, MOLA · elevation (m) & regional topography", "prefix_col": C_CYAN_HEX},
        {"prefix": "Geologic maps:", "text": "USGS SIM 3464 · 1:75,000 stratigraphy vectors", "prefix_col": C_CYAN_HEX},
        {"prefix": "Thermal observations:", "text": "THEMIS, TES · thermal inertia (regolith grain proxy)", "prefix_col": C_CYAN_HEX},
        {"prefix": "Mineralogy:", "text": "CRISM MTRDR · hyperspectral parameters (clays, carbonates)", "prefix_col": C_CYAN_HEX},
        {"prefix": "Rover ground truth:", "text": "NASA-AMMOS MMGIS · waypoints, in-situ Mastcam/SuperCam", "prefix_col": C_CYAN_HEX}
    ]
    render_bullets(70, 126, 235, s2_silos, font_size=7.8, leading=10.5, space_after=6)

    draw_card(332, 135, 215, 290, "DIFFERENCES TO RECONCILE", RL_ORANGE, RL_SLATE, RL_ORANGE)
    s2_diff = [
        {"prefix": "Spatial Resolution:", "text": "1m (HiRISE) to 100m (THEMIS) to 463m (MOLA)", "prefix_col": C_ORANGE_HEX},
        {"prefix": "Coordinate Reference:", "text": "Equirectangular vs Orthographic planetocentric", "prefix_col": C_ORANGE_HEX},
        {"prefix": "Spatial Coverage:", "text": "Narrow strips vs global continuous basemaps", "prefix_col": C_ORANGE_HEX},
        {"prefix": "Acquisition Time:", "text": "Decades apart under differing solar phases", "prefix_col": C_ORANGE_HEX},
        {"prefix": "Scientific Purpose:", "text": "Mineral science vs safety landing vs navigation", "prefix_col": C_ORANGE_HEX}
    ]
    render_bullets(344, 163, 190, s2_diff, font_size=7.8, leading=10.5, space_after=6)

    draw_card(562, 98, 340.4, 360, "WHAT AN EXPLORER ACTUALLY NEEDS", RL_GREEN, RL_SLATE)
    s2_needs = [
        {"prefix": "Understand Terrain Kinematics:", "text": "Assess 3D slope gradients, slip boundaries, and obstacle roughness rather than optical brightness.", "prefix_col": C_GREEN_HEX},
        {"prefix": "Investigate Candidate Targets:", "text": "Identify high-priority mineral contacts and stratigraphy within safe walking distance.", "prefix_col": C_GREEN_HEX},
        {"prefix": "Compare Candidate Traverses:", "text": "Evaluate terrain-aware route alternatives respecting strict PLSS consumable margins (oxygen, cooling, power).", "prefix_col": C_GREEN_HEX},
        {"prefix": "Science Along the Path:", "text": "Maximize sample return opportunities without crossing impassable cliffs (>20°).", "prefix_col": C_GREEN_HEX},
        {"prefix": "Unified Spatial Scale:", "text": "Inspect all observations simultaneously in one calibrated coordinate space.", "prefix_col": C_GREEN_HEX}
    ]
    render_bullets(576, 126, 312, s2_needs, font_size=8.2, leading=11, space_after=7)

    draw_card(57.6, 470, 844.8, 45, "", bg_color=RL_SLATE, border_color=RL_CYAN)
    p2_b = Paragraph('<font color="#55C7D9"><b>CORE OPERATIONAL QUESTION: How can heterogeneous planetary observations become actionable exploration intelligence for future human Marswalks?</b></font>', ParagraphStyle('B2', fontName='Helvetica', fontSize=8.8, leading=11.5))
    p2_b.wrap(820, 35)
    p2_b.drawOn(c, 72, to_rl_y(478, p2_b.height))

    c.showPage()

    # -------------------------------------------------------------------------
    # SLIDE 3: THE SOLUTION & DATA PIPELINE
    # -------------------------------------------------------------------------
    set_bg()
    draw_header("THE MARSATLAS APPROACH",
                "One Exploration Environment. Multiple Scientific Perspectives.",
                "Data actually present in the repository, with how each item enters the app. Status reflects what the code does.",
                slide_num=3, tag_color=RL_ORANGE)

    # 5 Process Steps
    steps = [
        ("1. Planetary Observations", "USGS, PDS, MMGIS", RL_CYAN),
        ("2. Coordinate Standard", "R = 3,396,190 m", RL_CYAN),
        ("3. Terrain + Science Grid", "Elevation, Slope, η, CRISM", RL_ORANGE),
        ("4. Interactive Map & API", "OpenLayers + FastAPI", RL_CYAN),
        ("5. Traverse Comparison", "Multi-Objective A*", RL_GREEN)
    ]
    step_w = 157.0
    gap = 14.9
    for idx, (s_title, s_sub, s_col) in enumerate(steps):
        sx = 57.6 + idx * (step_w + gap)
        draw_card(sx, 98, step_w, 48, "", bg_color=RL_SLATE, border_color=s_col)
        c.setFont('Helvetica-Bold', 8)
        c.setFillColor(RL_WHITE)
        c.drawString(sx + 8, PAGE_H_PT - 114, s_title)
        c.setFont('Helvetica', 7)
        c.setFillColor(RL_GREY)
        c.drawString(sx + 8, PAGE_H_PT - 128, s_sub)

    # Integration Table
    t_left = 57.6
    t_top = 158
    t_w = 844.8
    col_w = [185, 110, 160, 270, 119.8]

    c.setFillColor(RL_BORDER)
    c.rect(t_left, to_rl_y(t_top, 22), t_w, 22, fill=1, stroke=0)
    c.setFont('Helvetica-Bold', 7.5)
    c.setFillColor(RL_CYAN)
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
        c.setFillColor(RL_SLATE if i % 2 == 0 else RL_NAVY)
        c.rect(t_left, to_rl_y(r_top, 38), t_w, 38, fill=1, stroke=0)
        c.setStrokeColor(RL_BORDER)
        c.line(t_left, to_rl_y(r_top, 38), t_left + t_w, to_rl_y(r_top, 38))

        td_x = t_left + 6
        for j, val in enumerate(r):
            if j == 4:
                col_txt = C_GREEN_HEX if "real" in val else (C_ORANGE_HEX if "documented" in val else C_GREY_HEX)
                bold = True
            elif j == 0:
                col_txt = C_WHITE_HEX
                bold = True
            else:
                col_txt = C_GREY_HEX
                bold = False
            p_cell = Paragraph(f'<font color="{col_txt}"><b>{val}</b></font>' if bold else f'<font color="{col_txt}">{val}</font>',
                               ParagraphStyle('Cell', fontName='Helvetica-Bold' if bold else 'Helvetica', fontSize=7, leading=9))
            p_cell.wrap(col_w[j] - 8, 34)
            p_cell.drawOn(c, td_x, to_rl_y(r_top, p_cell.height + 6))
            td_x += col_w[j]
        r_top += 38

    c.setFont('Helvetica', 7.5)
    c.setFillColor(RL_GREY)
    c.drawString(57.6, PAGE_H_PT - 508, "Documented in DATA_SOURCES.md but not wired into frontend map code: Mars Trek CTX & THEMIS WMTS layers, and raw 1m HiRISE DTM GeoTIFF.")

    c.showPage()

    # -------------------------------------------------------------------------
    # SLIDE 4: TERRAIN INTELLIGENCE
    # -------------------------------------------------------------------------
    set_bg()
    draw_header("TERRAIN INTELLIGENCE",
                "Understanding the Surface Beyond What the Eye Can See.",
                "Terrain-derived cost surface: elevation, slope, roughness and thermal inertia on one grid.",
                slide_num=4, tag_color=RL_CYAN)

    draw_card(57.6, 98, 440, 415, "REPOSITORY GRID HEATMAPS (JEZERO_EVA_SECTOR.NPZ)", RL_CYAN, RL_SLATE)
    if os.path.exists(FIG4):
        c.drawImage(FIG4, 68, to_rl_y(124, 290), width=419, height=290, preserveAspectRatio=True)

    p_cap4 = Paragraph('<font color="#AAB7C4">Figure rendered from repository grid (jezero_eva_sector.npz, 550×350 cells, ~11.3×11.9 m/cell). Note: The grid is a prototype surrogate, not a validated raw HiRISE crop, so patterns shown are surrogate synthetic terrain.</font>', ParagraphStyle('Cap4', fontName='Helvetica', fontSize=7.5, leading=10))
    p_cap4.wrap(419, 45)
    p_cap4.drawOn(c, 68, to_rl_y(430, p_cap4.height))

    draw_card(515, 98, 387.4, 210, "METHODS IN THE CODE", RL_ORANGE, RL_SLATE)
    s4_methods = [
        {"prefix": "Slope (θ):", "text": "Horn 3×3 finite difference applied after 3×3 Gaussian smoothing; precomputed in grid.", "prefix_col": C_ORANGE_HEX},
        {"prefix": "Roughness (σz):", "text": "Local elevation standard deviation σz, stored precomputed in the grid.", "prefix_col": C_ORANGE_HEX},
        {"prefix": "Terrain Factor (η):", "text": "η = 1.0 + 0.5·clip((350−TI)/250) + 0.6·clip(σz/0.4); grid range: 1.00–1.59.", "prefix_col": C_ORANGE_HEX},
        {"prefix": "Coordinates:", "text": "Angular to metres with Mars radius R = 3,396,190 m and cos(latitude).", "prefix_col": C_ORANGE_HEX}
    ]
    render_bullets(528, 126, 360, s4_methods, font_size=8.0, leading=10.5, space_after=5)

    draw_card(515, 320, 387.4, 193, "GRID VALUES & VALIDATION AUDIT", RL_GREEN, RL_SLATE)
    s4_audit = [
        {"prefix": "Grid Values (From File):", "text": "Elevation: −2,605 to −2,121 m · Slope: 0.0–22.7° (mean 4.8°) · Thermal inertia: 109–466 · Roughness: ≤ 0.26 m.", "prefix_col": C_GREEN_HEX},
        {"prefix": "Validation Check I Ran:", "text": "Grid vs 276 Perseverance waypoint elevations in sector: RMSE 74 m, mean bias +55 m. Replace with real calibrated DTM before claiming operational flight accuracy.", "prefix_col": C_GREEN_HEX},
        {"prefix": "Known Limits:", "text": "Raster cell bounds detectable features · Roughness is not bearing strength · Thermal inertia is not traction · No safety certification.", "prefix_col": C_RED_HEX}
    ]
    render_bullets(528, 346, 360, s4_audit, font_size=7.8, leading=10.5, space_after=5)

    c.showPage()

    # -------------------------------------------------------------------------
    # SLIDE 5: ROUTE PLANNING
    # -------------------------------------------------------------------------
    set_bg()
    draw_header("EVA TRAVERSE PLANNING",
                "From Shortest Distance to Terrain-Aware Traverse Decisions.",
                "8-connected A* search with a Pandolf-Santee metabolic cost, run on the repository grid.",
                slide_num=5, tag_color=RL_ORANGE)

    draw_card(57.6, 98, 410, 415, "A* ROUTE OUTPUT & TRAVERSE COMPARISON", RL_CYAN, RL_SLATE)
    if os.path.exists(FIG5):
        c.drawImage(FIG5, 105, to_rl_y(122, 215), width=315, height=215, preserveAspectRatio=True)

    t_left5 = 68
    t_top5 = 344
    t_w5 = 389
    col_w5 = [85, 55, 60, 60, 64, 65]

    c.setFillColor(RL_BORDER)
    c.rect(t_left5, to_rl_y(t_top5, 18), t_w5, 18, fill=1, stroke=0)
    c.setFont('Helvetica-Bold', 7.5)
    c.setFillColor(RL_CYAN)
    th_x5 = t_left5 + 4
    headers5 = ["STRATEGY", "DIST", "TIME", "ENERGY", "PEAK SLOPE", "DOSE*"]
    for j, h in enumerate(headers5):
        c.drawString(th_x5, to_rl_y(t_top5, 13), h)
        th_x5 += col_w5[j]

    rows5 = [
        ("Safe", "3.02 km", "88.0 min", "1,616 kJ", "13.3°", "27.0 µSv"),
        ("Balanced", "2.98 km", "86.6 min", "1,591 kJ", "13.3°", "26.6 µSv"),
        ("Science", "3.80 km", "113.0 min", "2,029 kJ", "13.7°", "35.3 µSv")
    ]
    r_top5 = t_top5 + 18
    for i, r in enumerate(rows5):
        c.setFillColor(RL_SLATE if i % 2 == 0 else RL_NAVY)
        c.rect(t_left5, to_rl_y(r_top5, 18), t_w5, 18, fill=1, stroke=0)
        c.setStrokeColor(RL_BORDER)
        c.line(t_left5, to_rl_y(r_top5, 18), t_left5 + t_w5, to_rl_y(r_top5, 18))
        td_x5 = t_left5 + 4
        for j, val in enumerate(r):
            c.setFont('Helvetica-Bold' if j == 0 else 'Helvetica', 7.5)
            c.setFillColor(RL_ORANGE if j == 0 else RL_WHITE)
            c.drawString(td_x5, to_rl_y(r_top5, 13), val)
            td_x5 += col_w5[j]
        r_top5 += 18

    c.setFont('Helvetica', 7)
    c.setFillColor(RL_GREY)
    c.drawString(t_left5, to_rl_y(425, 8), "*Model estimate: constant shielding factor × 23.33 µSv/h baseline. Not a dose prediction.")

    draw_card(485, 98, 417.4, 210, "STEP COST ACTUALLY IMPLEMENTED (PLANNER.PY)", RL_ORANGE, RL_SLATE)
    s5_cost = [
        {"prefix": "Cost Function Formula:", "text": "c = max(0.05, wE·E_hat + wT·T_hat + wS·(θ/10)² + wH·max(0, (250−TI)/100) − wV·min(0.6, V)) × d/10", "prefix_col": C_ORANGE_HEX},
        {"prefix": "Variables:", "text": "E_hat, T_hat: energy and time per metre from Pandolf-Santee model and Apollo speed law V = (−0.01·S + 0.75)/η. θ: local slope (cells > 22° impassable). TI: thermal inertia slip proxy. V: authored CRISM target Gaussian bonus (σ = 25 cells).", "prefix_col": C_WHITE_HEX},
        {"prefix": "Mode Weights:", "text": "Safe (wE=2.5, wT=0.2, wS=8.0, wH=5.0, wV=0) · Balanced (wE=0.4, wT=3.0, wS=1.5, wH=1.0, wV=0) · Science (wE=0.8, wT=0.5, wS=1.2, wH=1.0, wV=8.0).", "prefix_col": C_CYAN_HEX}
    ]
    render_bullets(498, 126, 390, s5_cost, font_size=7.8, leading=10, space_after=4)

    draw_card(485, 320, 417.4, 193, "WHAT THESE RESULTS DO AND DO NOT SHOW", RL_GOLD, RL_SLATE)
    s5_what = [
        {"prefix": "Science Mode Impact:", "text": "Adds +28% distance and +28% energy vs Balanced for this pair.", "prefix_col": C_GOLD_HEX},
        {"prefix": "Safe Mode Overlap:", "text": "Safe did not reduce energy vs Balanced here (1,616 vs 1,591 kJ); the two routes share 42% of nodes.", "prefix_col": C_GOLD_HEX},
        {"prefix": "Planning Preferences:", "text": "These are planning preferences on a surrogate grid, not astronaut performance predictions.", "prefix_col": C_GOLD_HEX},
        {"prefix": "Fallback Behavior:", "text": "If backend is unreachable, web UI falls back to pre-baked routes; those numbers are static.", "prefix_col": C_RED_HEX}
    ]
    render_bullets(498, 346, 390, s5_what, font_size=7.8, leading=10.5, space_after=5)

    c.showPage()

    # -------------------------------------------------------------------------
    # SLIDE 6: ROVER EVIDENCE & SCIENCE CONTEXT
    # -------------------------------------------------------------------------
    set_bg()
    draw_header("SCIENCE ALONG THE TRAVERSE",
                "A Marswalk Should Explore More Than Distance.",
                "Scientific context is layered over the route, with orbital interpretation kept separate from rover ground truth.",
                slide_num=6, tag_color=RL_CYAN)

    draw_card(57.6, 98, 435, 415, "ROVER GROUND TRACK OVER AUTHORED GEOLOGY", RL_CYAN, RL_SLATE)
    if os.path.exists(FIG6):
        c.drawImage(FIG6, 68, to_rl_y(124, 290), width=414, height=290, preserveAspectRatio=True)

    p_cap6 = Paragraph('<font color="#AAB7C4">Orange track & white dots: real Perseverance MMGIS data. Coloured polygons & stars: authored overlays in repo (coarse polygons, hand-placed targets). Blue dashed box: modelled sector.</font>', ParagraphStyle('Cap6', fontName='Helvetica', fontSize=7.5, leading=10))
    p_cap6.wrap(414, 45)
    p_cap6.drawOn(c, 68, to_rl_y(430, p_cap6.height))

    draw_card(510, 98, 392.4, 175, "GROUND TRUTH (ROVER)", RL_GREEN, RL_SLATE)
    s6_gt = [
        {"prefix": "Perseverance MMGIS Data:", "text": "Waypoint & traverse GeoJSON from NASA-AMMOS MMGIS (559 legs, 708 points).", "prefix_col": C_GREEN_HEX},
        {"prefix": "Nearest-Observation Lookup:", "text": "Surface image cards (5 curated entries; live NASA raw-image API call with fallback).", "prefix_col": C_GREEN_HEX},
        {"prefix": "Gale Crater Context:", "text": "Curiosity rover waypoints to sol 5073 for Gale boxwork preset context.", "prefix_col": C_GREEN_HEX}
    ]
    render_bullets(524, 126, 364, s6_gt, font_size=7.8, leading=10.5, space_after=4)

    draw_card(510, 285, 392.4, 175, "ORBITAL INTERPRETATION (AUTHORED)", RL_ORANGE, RL_SLATE)
    s6_oi = [
        {"prefix": "5 Geologic Unit Polygons:", "text": "Simplified after Sun & Stack (2020), USGS SIM 3464.", "prefix_col": C_ORANGE_HEX},
        {"prefix": "5 CRISM Science Targets:", "text": "Hand-authored GeoJSON citing CRISM cube IDs (no band-depth computation in repo).", "prefix_col": C_ORANGE_HEX},
        {"prefix": "Target Boundary Handling:", "text": "Lac de Charmes target (SCI-01) lies just outside routable sector: planner correctly rejects it.", "prefix_col": C_ORANGE_HEX}
    ]
    render_bullets(524, 311, 364, s6_oi, font_size=7.8, leading=10.5, space_after=4)

    draw_card(510, 470, 392.4, 43, "", bg_color=RL_SLATE, border_color=RL_CYAN)
    p_eq = Paragraph('<font color="#55C7D9"><b>Terrain understanding + Scientific context + Route choice = Science-informed exploration planning</b></font>', ParagraphStyle('Eq', fontName='Helvetica', fontSize=7.5, leading=10.5, alignment=1))
    p_eq.wrap(380, 35)
    p_eq.drawOn(c, 516, to_rl_y(476, p_eq.height))

    c.showPage()

    # -------------------------------------------------------------------------
    # SLIDE 7: ENGINEERING, IMPACT & LIMITATIONS
    # -------------------------------------------------------------------------
    set_bg()
    draw_header("ENGINEERING, IMPACT AND LIMITATIONS",
                "Building a Foundation for Data-Driven Mars Exploration.",
                "How the system is built, what has been tested, and what it cannot yet claim.",
                slide_num=7, tag_color=RL_CYAN)

    draw_card(57.6, 98, 400, 360, "SYSTEM IMPLEMENTATION & TESTING", RL_CYAN, RL_SLATE)
    s7_stk = [
        {"prefix": "Client:", "text": "Next.js 14 / React 18 · TypeScript · Tailwind CSS · OpenLayers 9 · Three.js (3D sector preview)", "prefix_col": C_CYAN_HEX},
        {"prefix": "Services:", "text": "Python 3.11 · FastAPI · NumPy · SciPy · Rasterio · Endpoints: /health, /point-telemetry, /plan-eva, /rover-pov, /environmental, /briefing", "prefix_col": C_CYAN_HEX},
        {"prefix": "Computation:", "text": "TerrainEngine (grid sampling, hazard classes) · EVARoutePlanner (8-connected A*, Pandolf-Santee cost)", "prefix_col": C_CYAN_HEX},
        {"prefix": "Data:", "text": "Static .npz grid & GeoJSON in repo; live NASA raw-image API call with curated fallback", "prefix_col": C_CYAN_HEX},
        {"prefix": "Deployment:", "text": "Frontend on Vercel (mars-atlas-nasa.vercel.app); Backend on Render via render.yaml", "prefix_col": C_CYAN_HEX},
        {"prefix": "Testing:", "text": "8 pytest tests pass in 7s: geodesy, grid loading, point sampling, bounds, Horn formula, A* convergence, rover lookup, API endpoints", "prefix_col": C_GREEN_HEX}
    ]
    render_bullets(70, 126, 375, s7_stk, font_size=7.8, leading=10.5, space_after=6)

    draw_card(475, 98, 427.4, 170, "INTENDED IMPACT", RL_GREEN, RL_SLATE)
    s7_imp = [
        {"prefix": "Workflow Integration:", "text": "MarsAtlas demonstrates how planetary observations can be organised into one workflow: terrain interpretation, scientific context, and computational traverse comparison.", "prefix_col": C_GREEN_HEX},
        {"prefix": "NASA Challenge Response:", "text": "Directly targets the challenge's call for a layered, route-aware view for future Marswalk planning.", "prefix_col": C_GREEN_HEX}
    ]
    render_bullets(489, 126, 399, s7_imp, font_size=8.0, leading=11, space_after=6)

    draw_card(475, 280, 427.4, 178, "LIMITATIONS & SCIENTIFIC INTEGRITY", RL_RED, RL_SLATE)
    s7_lim = [
        {"prefix": "Prototype Status:", "text": "Experimental prototype; not a certified astronaut safety system.", "prefix_col": C_RED_HEX},
        {"prefix": "Surrogate Data:", "text": "Terrain grid is a surrogate; real HiRISE-derived data is required before claiming terrain accuracy.", "prefix_col": C_RED_HEX},
        {"prefix": "Model Assumptions:", "text": "Route outputs depend on Tier 3 model assumptions (75 kg + 85 kg, η mapping).", "prefix_col": C_RED_HEX},
        {"prefix": "Radiation Proxy:", "text": "Radiation shielding is a fixed factor; Gale RAD baseline used as Jezero proxy.", "prefix_col": C_RED_HEX}
    ]
    render_bullets(489, 308, 399, s7_lim, font_size=8.0, leading=11, space_after=6)

    draw_card(57.6, 470, 844.8, 45, "", bg_color=RL_SLATE, border_color=RL_CYAN)
    p_b7 = Paragraph('<font color="#55C7D9"><b>MARSATLAS — FROM PLANETARY DATA TO EXPLORATION DECISIONS.</b></font><br/><font color="#D96B3B">Live Application: https://mars-atlas-nasa.vercel.app/   •   Source Code: https://github.com/shubham25-droid/MarsAtlas</font>', ParagraphStyle('B7', fontName='Helvetica', fontSize=8.5, leading=11.5, alignment=1))
    p_b7.wrap(820, 35)
    p_b7.drawOn(c, 70, to_rl_y(476, p_b7.height))

    c.save()
    print(f"PDF Presentation generated: {pdf_path}")

if __name__ == "__main__":
    generate_pptx()
    generate_pdf()

import os
import pptx
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

def build_sih_pptx():
    prs = pptx.Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # SIH Style Light Color Palette
    BG_WHITE = RGBColor(255, 255, 255)         # Pure White
    CARD_BG = RGBColor(248, 250, 252)          # Slate 50
    CARD_BLUE = RGBColor(239, 246, 255)        # Blue 50
    CARD_GREEN = RGBColor(240, 253, 244)       # Green 50
    CARD_ORANGE = RGBColor(255, 247, 237)      # Orange 50
    CARD_RED = RGBColor(254, 242, 242)         # Red 50
    BORDER_SLATE = RGBColor(226, 232, 240)     # Slate 200
    BORDER_BLUE = RGBColor(186, 230, 253)      # Sky 200
    BORDER_GREEN = RGBColor(187, 247, 208)     # Green 200
    BORDER_ORANGE = RGBColor(254, 215, 170)    # Orange 200
    BORDER_RED = RGBColor(254, 202, 202)       # Red 200

    TEXT_TITLE = RGBColor(15, 23, 42)          # Slate 900
    TEXT_BODY = RGBColor(30, 41, 59)           # Slate 800
    TEXT_MUTED = RGBColor(71, 85, 105)         # Slate 600
    TEXT_DIM = RGBColor(100, 116, 139)         # Slate 500

    ORANGE_PRIMARY = RGBColor(234, 88, 12)     # Orange 600 (Mars Accent)
    BLUE_ACCENT = RGBColor(2, 132, 199)        # Sky 600
    BLUE_DARK = RGBColor(29, 78, 216)          # Blue 700
    GREEN_ACCENT = RGBColor(5, 150, 105)       # Emerald 600
    RED_ACCENT = RGBColor(220, 38, 38)         # Red 600

    def set_slide_background(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_WHITE
        bg.line.fill.background()
        return bg

    def add_header(slide, tag_text, title_text, subtitle_text=None, slide_num=1, tag_color=ORANGE_PRIMARY):
        # Header Container
        header_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.32), Inches(11.733), Inches(1.15))
        tf = header_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0

        # Tag + Slide counter
        p_tag = tf.paragraphs[0]
        p_tag.text = f"{tag_text.upper()}"
        p_tag.font.name = "Arial"
        p_tag.font.size = Pt(10)
        p_tag.font.bold = True
        p_tag.font.color.rgb = tag_color
        p_tag.space_after = Pt(2)

        # Main Title
        p_title = tf.add_paragraph()
        p_title.text = title_text
        p_title.font.name = "Arial"
        p_title.font.size = Pt(20)
        p_title.font.bold = True
        p_title.font.color.rgb = TEXT_TITLE

        # Subtitle
        if subtitle_text:
            p_sub = tf.add_paragraph()
            p_sub.text = subtitle_text
            p_sub.font.name = "Arial"
            p_sub.font.size = Pt(11)
            p_sub.font.color.rgb = TEXT_MUTED
            p_sub.space_before = Pt(2)

        # Right-aligned header badge
        badge = slide.shapes.add_textbox(Inches(9.5), Inches(0.35), Inches(3.0), Inches(0.4))
        tf_b = badge.text_frame
        tf_b.word_wrap = False
        p_b = tf_b.paragraphs[0]
        p_b.alignment = PP_ALIGN.RIGHT
        p_b.text = f"NASA Space Apps 2026 • {slide_num}/7"
        p_b.font.name = "Arial"
        p_b.font.size = Pt(9.5)
        p_b.font.bold = True
        p_b.font.color.rgb = TEXT_DIM

        # Thin divider line
        line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.5), Inches(11.733), Inches(0.015))
        line.fill.solid()
        line.fill.fore_color.rgb = BORDER_SLATE
        line.line.fill.background()

    def add_card(slide, left, top, width, height, title=None, title_color=ORANGE_PRIMARY, bg_color=CARD_BG, border_color=BORDER_SLATE):
        shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(height))
        shape.fill.solid()
        shape.fill.fore_color.rgb = bg_color
        shape.line.color.rgb = border_color
        shape.line.width = Pt(1)

        if title:
            tb = slide.shapes.add_textbox(Inches(left + 0.2), Inches(top + 0.15), Inches(width - 0.4), Inches(0.35))
            tf = tb.text_frame
            tf.word_wrap = True
            tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
            p = tf.paragraphs[0]
            p.text = title.upper()
            p.font.name = "Arial"
            p.font.size = Pt(10.5)
            p.font.bold = True
            p.font.color.rgb = title_color
        return shape

    def add_bullet(text_frame, bold_prefix, text_body, pt_size=9.5, prefix_col=ORANGE_PRIMARY, text_col=TEXT_BODY, space_after=4):
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

    # Asset paths
    fig_dir = r"D:\Antigravity Workspace\NASA Space Challenge 2026\MarsAtlas\docs\slides_assets\extracted_figures"
    fig1 = os.path.join(fig_dir, "fig1_perseverance_traverse.png")
    fig4 = os.path.join(fig_dir, "fig4_terrain_heatmaps.png")
    fig5 = os.path.join(fig_dir, "fig5_astar_routes.png")
    fig6 = os.path.join(fig_dir, "fig6_geology_overlays.png")
    insignia = r"D:\Antigravity Workspace\NASA Space Challenge 2026\MarsAtlas\docs\slides_assets\marsatlas_insignia.jpg"

    # =========================================================================
    # SLIDE 1: TITLE PAGE (SIH HACKATHON TEMPLATE FORMAT)
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    set_slide_background(s1)

    # Top SIH / NASA Header Banner
    h_box = s1.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.733), Inches(0.6))
    tf_h = h_box.text_frame
    p_h = tf_h.paragraphs[0]
    p_h.text = "NASA SPACE APPS CHALLENGE 2026  •  GLOBAL SUBMISSION"
    p_h.font.name = "Arial"
    p_h.font.size = Pt(11)
    p_h.font.bold = True
    p_h.font.color.rgb = ORANGE_PRIMARY

    # Left Container: Project Metadata Card (SIH Template Style)
    add_card(s1, 0.8, 1.1, 6.2, 5.8, bg_color=CARD_BG, border_color=BORDER_SLATE)
    
    # Title & Subtitle inside card
    tb_t = s1.shapes.add_textbox(Inches(1.1), Inches(1.3), Inches(5.6), Inches(1.3))
    tf_t = tb_t.text_frame
    tf_t.word_wrap = True
    p_t1 = tf_t.paragraphs[0]
    p_t1.text = "MarsAtlas"
    p_t1.font.name = "Arial"
    p_t1.font.size = Pt(32)
    p_t1.font.bold = True
    p_t1.font.color.rgb = TEXT_TITLE
    
    p_t2 = tf_t.add_paragraph()
    p_t2.text = "Integrated Martian Terrain Intelligence and EVA Traverse Planning"
    p_t2.font.name = "Arial"
    p_t2.font.size = Pt(13)
    p_t2.font.bold = True
    p_t2.font.color.rgb = ORANGE_PRIMARY
    p_t2.space_before = Pt(3)

    p_t3 = tf_t.add_paragraph()
    p_t3.text = "Explore Mars. Understand Terrain. Plan Every Traverse."
    p_t3.font.name = "Arial"
    p_t3.font.size = Pt(11)
    p_t3.font.color.rgb = TEXT_MUTED
    p_t3.space_before = Pt(2)

    # Metadata Details Table / List inside Card
    tb_meta = s1.shapes.add_textbox(Inches(1.1), Inches(2.75), Inches(5.6), Inches(4.0))
    tf_m = tb_meta.text_frame
    tf_m.word_wrap = True
    
    add_bullet(tf_m, "Challenge:", "Interplanetary Survival Guide: Martian Map", 10, prefix_col=BLUE_DARK)
    add_bullet(tf_m, "Category:", "Planetary Geospatial Intelligence & Surface EVA Operations", 10, prefix_col=BLUE_DARK)
    add_bullet(tf_m, "Primary Study Region:", "Jezero Crater, Mars (18.44°N, 77.45°E) — Perseverance Landing Corridor", 10, prefix_col=BLUE_DARK)
    add_bullet(tf_m, "Live Application:", "https://mars-atlas-nasa.vercel.app/ (Production WebGIS)", 10, prefix_col=ORANGE_PRIMARY)
    add_bullet(tf_m, "High-Performance API:", "https://marsatlas-backend.onrender.com/ (FastAPI / GDAL)", 10, prefix_col=ORANGE_PRIMARY)
    add_bullet(tf_m, "Open Source Code:", "github.com/shubham25-droid/MarsAtlas (MIT License)", 10, prefix_col=ORANGE_PRIMARY)
    add_bullet(tf_m, "Project Status:", "Experimental Research Prototype", 10, prefix_col=GREEN_ACCENT)
    add_bullet(tf_m, "Team ID / Lead:", "Team MarsAtlas (shubham25-droid)", 10, prefix_col=BLUE_DARK)

    # Right Container: Real Traverse Plot
    add_card(s1, 7.2, 1.1, 5.333, 5.8, title="GROUND TRUTH CONTEXT (JEZERO CRATER)", title_color=BLUE_DARK, bg_color=CARD_BG)
    if os.path.exists(fig1):
        s1.shapes.add_picture(fig1, Inches(7.4), Inches(1.55), width=Inches(4.933))
    
    # Caption box below plot
    tb_c1 = s1.shapes.add_textbox(Inches(7.4), Inches(5.4), Inches(4.933), Inches(1.3))
    tf_c1 = tb_c1.text_frame
    tf_c1.word_wrap = True
    p_c1 = tf_c1.paragraphs[0]
    p_c1.text = "Figure: rendered from data/processed/m20_traverse.json in the repository (NASA-AMMOS MMGIS product, 559 drive legs, sols 13–2022). Dashed box = modelled EVA sector (77.35–77.46°E, 18.41–18.48°N)."
    p_c1.font.name = "Arial"
    p_c1.font.size = Pt(8.5)
    p_c1.font.color.rgb = TEXT_MUTED

    # =========================================================================
    # SLIDE 2: THE SCIENTIFIC PROBLEM (SIH STYLE)
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    set_slide_background(s2)
    add_header(s2, "THE SCIENTIFIC PROBLEM", 
               "Mapping Mars Is Not the Same as Planning a Marswalk.",
               "Mission archives hold rich observations, but each product answers a different scientific question.",
               slide_num=2, tag_color=RED_ACCENT)

    # Left Column: 6 Mission Observation Data Silos
    col_w = 3.5
    add_card(s2, 0.8, 1.65, col_w, 4.6, title="MISSION OBSERVATION ARCHIVES", title_color=BLUE_DARK, bg_color=CARD_BG)
    tb_silos = s2.shapes.add_textbox(Inches(0.95), Inches(2.05), Inches(col_w - 0.3), Inches(4.1))
    tf_s = tb_silos.text_frame
    tf_s.word_wrap = True
    add_bullet(tf_s, "Orbital Imagery:", "CTX, HiRISE · 2D image tiles (albedo & visual morphology)", 9, prefix_col=BLUE_DARK)
    add_bullet(tf_s, "Digital Terrain Models:", "HiRISE DTM, MOLA · elevation (m) & regional topography", 9, prefix_col=BLUE_DARK)
    add_bullet(tf_s, "Geologic Maps:", "USGS SIM 3464 · 1:75,000 stratigraphy & formation polygons", 9, prefix_col=BLUE_DARK)
    add_bullet(tf_s, "Thermal Observations:", "THEMIS, TES · thermal inertia (regolith grain-size proxy)", 9, prefix_col=BLUE_DARK)
    add_bullet(tf_s, "Mineralogy:", "CRISM MTRDR · hyperspectral parameters (smectites, carbonates)", 9, prefix_col=BLUE_DARK)
    add_bullet(tf_s, "Rover Ground Truth:", "NASA-AMMOS MMGIS · waypoints, in-situ Mastcam/SuperCam", 9, prefix_col=BLUE_DARK)

    # Center Card: Differences to Reconcile
    add_card(s2, 4.55, 2.1, 2.7, 3.7, title="DIFFERENCES TO RECONCILE", title_color=ORANGE_PRIMARY, bg_color=CARD_ORANGE, border_color=BORDER_ORANGE)
    tb_diff = s2.shapes.add_textbox(Inches(4.7), Inches(2.55), Inches(2.4), Inches(3.1))
    tf_d = tb_diff.text_frame
    tf_d.word_wrap = True
    add_bullet(tf_d, "Spatial Resolution:", "1m (HiRISE) to 100m (THEMIS) to 463m (MOLA)", 9, prefix_col=ORANGE_PRIMARY)
    add_bullet(tf_d, "Coordinate Reference:", "Equirectangular vs Orthographic planetocentric", 9, prefix_col=ORANGE_PRIMARY)
    add_bullet(tf_d, "Spatial Coverage:", "Narrow targeted strips vs global continuous maps", 9, prefix_col=ORANGE_PRIMARY)
    add_bullet(tf_d, "Acquisition Times:", "Decades apart under differing solar phases", 9, prefix_col=ORANGE_PRIMARY)
    add_bullet(tf_d, "Scientific Purpose:", "Mineral science vs safety landing vs navigation", 9, prefix_col=ORANGE_PRIMARY)

    # Right Card: What an Explorer Needs
    add_card(s2, 7.5, 1.65, 5.033, 4.6, title="WHAT AN EXPLORER ACTUALLY NEEDS", title_color=GREEN_ACCENT, bg_color=CARD_GREEN, border_color=BORDER_GREEN)
    tb_need = s2.shapes.add_textbox(Inches(7.75), Inches(2.05), Inches(4.533), Inches(4.1))
    tf_n = tb_need.text_frame
    tf_n.word_wrap = True
    add_bullet(tf_n, "Understand Terrain Kinematics:", "Assess 3D slope gradients, slip boundaries, and obstacle roughness rather than optical brightness.", 9.5, prefix_col=GREEN_ACCENT)
    add_bullet(tf_n, "Investigate Candidate Targets:", "Identify high-priority mineral contacts and stratigraphy within safe walking distance.", 9.5, prefix_col=GREEN_ACCENT)
    add_bullet(tf_n, "Compare Candidate Traverses:", "Evaluate terrain-aware route alternatives respecting strict PLSS consumable margins (oxygen, cooling, power).", 9.5, prefix_col=GREEN_ACCENT)
    add_bullet(tf_n, "Science Along the Path:", "Maximize sample return opportunities without crossing impassable cliffs (>20°).", 9.5, prefix_col=GREEN_ACCENT)
    add_bullet(tf_n, "Unified Spatial Scale:", "Inspect all observations simultaneously in one calibrated coordinate space.", 9.5, prefix_col=GREEN_ACCENT)

    # Bottom Callout Banner (SIH Style)
    bot_box = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(6.4), Inches(11.733), Inches(0.65))
    bot_box.fill.solid()
    bot_box.fill.fore_color.rgb = CARD_BLUE
    bot_box.line.color.rgb = BORDER_BLUE
    tb_bot = s2.shapes.add_textbox(Inches(1.0), Inches(6.48), Inches(11.333), Inches(0.5))
    p_bb = tb_bot.text_frame.paragraphs[0]
    p_bb.text = "CORE QUESTION: How can heterogeneous planetary observations become actionable exploration intelligence for future human Marswalks?"
    p_bb.font.name = "Arial"
    p_bb.font.size = Pt(10)
    p_bb.font.bold = True
    p_bb.font.color.rgb = BLUE_DARK

    # =========================================================================
    # SLIDE 3: PROPOSED SOLUTION & INNOVATION (5-STEP PROCESS & DATA TABLE)
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    set_slide_background(s3)
    add_header(s3, "PROPOSED SOLUTION & INNOVATION",
               "One Exploration Environment. Multiple Scientific Perspectives.",
               "Data actually present in the repository, with how each item enters the app. Status reflects what the code does.",
               slide_num=3, tag_color=ORANGE_PRIMARY)

    # Horizontal 5-Step Process Flowbar (SIH hallmark!)
    steps = [
        ("1. Planetary Observations", "USGS, PDS, MMGIS"),
        ("2. Coordinates", "R = 3,396,190 m"),
        ("3. Terrain + Science Grid", "Elevation, Slope, η, CRISM"),
        ("4. Interactive Map & API", "OpenLayers + FastAPI"),
        ("5. Traverse Comparison", "Multi-Objective A*")
    ]
    step_w = 2.18
    step_gap = 0.2
    for idx, (title_st, desc_st) in enumerate(steps):
        s_left = 0.8 + idx * (step_w + step_gap)
        s_shape = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(s_left), Inches(1.65), Inches(step_w), Inches(0.65))
        s_shape.fill.solid()
        s_shape.fill.fore_color.rgb = CARD_ORANGE if idx == 2 else (CARD_GREEN if idx == 4 else CARD_BLUE)
        s_shape.line.color.rgb = BORDER_ORANGE if idx == 2 else (BORDER_GREEN if idx == 4 else BORDER_BLUE)
        tb_st = s3.shapes.add_textbox(Inches(s_left + 0.05), Inches(1.7), Inches(step_w - 0.1), Inches(0.55))
        tf_st = tb_st.text_frame
        tf_st.word_wrap = True
        p_st1 = tf_st.paragraphs[0]
        p_st1.text = title_st
        p_st1.font.name = "Arial"
        p_st1.font.size = Pt(8.5)
        p_st1.font.bold = True
        p_st1.font.color.rgb = TEXT_TITLE
        p_st2 = tf_st.add_paragraph()
        p_st2.text = desc_st
        p_st2.font.name = "Arial"
        p_st2.font.size = Pt(7.5)
        p_st2.font.color.rgb = TEXT_MUTED

    # Core Repository Integration Table
    t_shape3 = s3.shapes.add_table(8, 5, Inches(0.8), Inches(2.45), Inches(11.733), Inches(4.1))
    t3 = t_shape3.table
    t3.columns[0].width = Inches(2.7)
    t3.columns[1].width = Inches(1.7)
    t3.columns[2].width = Inches(2.3)
    t3.columns[3].width = Inches(3.433)
    t3.columns[4].width = Inches(1.6)

    h3_titles = ["DATASET (AS USED)", "ORIGIN", "COVERAGE / GRID", "ROLE IN MARSATLAS", "STATUS"]
    for j, h in enumerate(h3_titles):
        cell = t3.cell(0, j)
        cell.fill.solid()
        cell.fill.fore_color.rgb = RGBColor(241, 245, 249)
        p = cell.text_frame.paragraphs[0]
        p.text = h
        p.font.name = "Arial"
        p.font.size = Pt(8.5)
        p.font.bold = True
        p.font.color.rgb = BLUE_DARK

    t3_data = [
        ("USGS Astrogeology WMS basemaps (Viking mosaic, MOLA relief)", "USGS / NASA", "Global", "Basemap and swipe comparison in map UI", "In app (real data)"),
        ("Perseverance waypoints (708) & traverse (559 legs)", "NASA-AMMOS MMGIS", "Jezero; sols 13–2022", "Ground-truth track layer; nearest-observation lookup", "In app (real data)"),
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
            cell.fill.fore_color.rgb = BG_WHITE if i % 2 == 0 else CARD_BG
            p = cell.text_frame.paragraphs[0]
            p.text = val
            p.font.name = "Arial"
            p.font.size = Pt(8)
            if j == 4:
                p.font.bold = True
                p.font.color.rgb = GREEN_ACCENT if "real" in val else (ORANGE_PRIMARY if "documented" in val else TEXT_MUTED)
            else:
                p.font.color.rgb = TEXT_BODY

    # Footer note
    tb_fn = s3.shapes.add_textbox(Inches(0.8), Inches(6.65), Inches(11.733), Inches(0.4))
    p_fn = tb_fn.text_frame.paragraphs[0]
    p_fn.text = "Documented in DATA_SOURCES.md but not wired into frontend map code: Mars Trek CTX & THEMIS WMTS layers, and raw 1m HiRISE DTM GeoTIFF."
    p_fn.font.name = "Arial"
    p_fn.font.size = Pt(8)
    p_fn.font.color.rgb = TEXT_DIM

    # =========================================================================
    # SLIDE 4: TECHNICAL APPROACH: TERRAIN INTELLIGENCE
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    set_slide_background(s4)
    add_header(s4, "TECHNICAL APPROACH: TERRAIN INTELLIGENCE",
               "Understanding the Surface Beyond What the Eye Can See.",
               "Terrain-derived cost surface: elevation, slope, roughness and thermal inertia on one grid.",
               slide_num=4, tag_color=BLUE_DARK)

    # Left Panel: Matplotlib Heatmap Figures
    add_card(s4, 0.8, 1.65, 6.2, 5.3, title="REPOSITORY GRID HEATMAPS (JEZERO_EVA_SECTOR.NPZ)", title_color=BLUE_DARK, bg_color=CARD_BG)
    if os.path.exists(fig4):
        s4.shapes.add_picture(fig4, Inches(0.95), Inches(2.05), width=Inches(5.9))

    tb_f4_cap = s4.shapes.add_textbox(Inches(0.95), Inches(5.65), Inches(5.9), Inches(1.2))
    tf_f4 = tb_f4_cap.text_frame
    tf_f4.word_wrap = True
    p_f4 = tf_f4.paragraphs[0]
    p_f4.text = "Figure rendered from repository grid (jezero_eva_sector.npz, 550×350 cells, ~11.3×11.9 m/cell). Note: The grid is a prototype surrogate, not a validated raw HiRISE crop, so patterns shown are surrogate synthetic terrain."
    p_f4.font.name = "Arial"
    p_f4.font.size = Pt(8)
    p_f4.font.color.rgb = TEXT_MUTED

    # Right Panel: Methods in the Code & Honest Validation
    add_card(s4, 7.2, 1.65, 5.333, 2.7, title="METHODS IN THE CODE", title_color=ORANGE_PRIMARY, bg_color=CARD_BG)
    tb_m4 = s4.shapes.add_textbox(Inches(7.4), Inches(2.0), Inches(4.933), Inches(2.3))
    tf_m4 = tb_m4.text_frame
    tf_m4.word_wrap = True
    add_bullet(tf_m4, "Slope (θ):", "Horn 3×3 finite difference applied after 3×3 Gaussian smoothing; precomputed in grid.", 8.5, prefix_col=ORANGE_PRIMARY)
    add_bullet(tf_m4, "Roughness (σz):", "Local elevation standard deviation σz, stored precomputed in the grid.", 8.5, prefix_col=ORANGE_PRIMARY)
    add_bullet(tf_m4, "Terrain Factor (η):", "η = 1.0 + 0.5·clip((350−TI)/250) + 0.6·clip(σz/0.4); grid range: 1.00–1.59.", 8.5, prefix_col=ORANGE_PRIMARY)
    add_bullet(tf_m4, "Coordinates:", "Angular to metres with Mars radius R = 3,396,190 m and cos(latitude).", 8.5, prefix_col=ORANGE_PRIMARY)

    add_card(s4, 7.2, 4.45, 5.333, 2.5, title="GRID VALUES & VALIDATION AUDIT", title_color=GREEN_ACCENT, bg_color=CARD_GREEN, border_color=BORDER_GREEN)
    tb_v4 = s4.shapes.add_textbox(Inches(7.4), Inches(4.8), Inches(4.933), Inches(2.1))
    tf_v4 = tb_v4.text_frame
    tf_v4.word_wrap = True
    add_bullet(tf_v4, "Grid Values (From File):", "Elevation: −2,605 to −2,121 m · Slope: 0.0–22.7° (mean 4.8°) · Thermal inertia: 109–466 · Roughness: ≤ 0.26 m.", 8.5, prefix_col=GREEN_ACCENT)
    add_bullet(tf_v4, "Validation Check I Ran:", "Grid vs 276 Perseverance waypoint elevations in sector: RMSE 74 m, mean bias +55 m. Replace with real calibrated DTM before claiming operational flight accuracy.", 8.5, prefix_col=GREEN_ACCENT)
    add_bullet(tf_v4, "Known Limits:", "Raster cell bounds detectable features · Roughness is not bearing strength · Thermal inertia is not traction · No safety certification.", 8.5, prefix_col=RED_ACCENT)

    # =========================================================================
    # SLIDE 5: FEASIBILITY & VIABILITY: EVA TRAVERSE PLANNING
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    set_slide_background(s5)
    add_header(s5, "FEASIBILITY AND VIABILITY: ROUTE SOLVER",
               "From Shortest Distance to Terrain-Aware Traverse Decisions.",
               "8-connected A* search with a Pandolf-Santee metabolic cost, run on the repository grid.",
               slide_num=5, tag_color=ORANGE_PRIMARY)

    # Left Panel: Route Plot & Table
    add_card(s5, 0.8, 1.65, 5.6, 5.3, title="A* ROUTE OUTPUT & TRAVERSE COMPARISON", title_color=BLUE_DARK, bg_color=CARD_BG)
    if os.path.exists(fig5):
        s5.shapes.add_picture(fig5, Inches(0.95), Inches(2.05), width=Inches(5.3))

    # Quantitative Strategy Table below image
    t_shape5 = s5.shapes.add_table(4, 6, Inches(0.95), Inches(4.6), Inches(5.3), Inches(1.8))
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
        cell.fill.fore_color.rgb = RGBColor(241, 245, 249)
        p = cell.text_frame.paragraphs[0]
        p.text = h
        p.font.name = "Arial"
        p.font.size = Pt(8)
        p.font.bold = True
        p.font.color.rgb = BLUE_DARK

    t5_data = [
        ("Safe", "3.02 km", "88.0 min", "1,616 kJ", "13.3°", "27.0 µSv"),
        ("Balanced", "2.98 km", "86.6 min", "1,591 kJ", "13.3°", "26.6 µSv"),
        ("Science", "3.80 km", "113.0 min", "2,029 kJ", "13.7°", "35.3 µSv")
    ]
    for i, row in enumerate(t5_data):
        for j, val in enumerate(row):
            cell = t5.cell(i + 1, j)
            cell.fill.solid()
            cell.fill.fore_color.rgb = BG_WHITE if i % 2 == 0 else CARD_BG
            p = cell.text_frame.paragraphs[0]
            p.text = val
            p.font.name = "Arial"
            p.font.size = Pt(8)
            p.font.color.rgb = ORANGE_PRIMARY if j == 0 else TEXT_BODY

    tb_t5_note = s5.shapes.add_textbox(Inches(0.95), Inches(6.45), Inches(5.3), Inches(0.4))
    p_n5 = tb_t5_note.text_frame.paragraphs[0]
    p_n5.text = "*Model estimate: constant shielding factor × 23.33 µSv/h baseline. Not a dose prediction."
    p_n5.font.name = "Arial"
    p_n5.font.size = Pt(7.5)
    p_n5.font.color.rgb = TEXT_DIM

    # Right Panel: Step Cost Actually Implemented & Weights
    add_card(s5, 6.6, 1.65, 5.933, 2.7, title="STEP COST ACTUALLY IMPLEMENTED (PLANNER.PY)", title_color=ORANGE_PRIMARY, bg_color=CARD_BG)
    tb_c5 = s5.shapes.add_textbox(Inches(6.8), Inches(2.0), Inches(5.533), Inches(2.3))
    tf_c5 = tb_c5.text_frame
    tf_c5.word_wrap = True
    add_bullet(tf_c5, "Cost Function Formula:", "c = max(0.05, wE·E_hat + wT·T_hat + wS·(θ/10)² + wH·max(0, (250−TI)/100) − wV·min(0.6, V)) × d/10", 8.5, prefix_col=ORANGE_PRIMARY)
    add_bullet(tf_c5, "Variables:", "E_hat, T_hat: energy and time per metre from Pandolf-Santee model and Apollo speed law V = (−0.01·S + 0.75)/η. θ: local slope (cells > 22° impassable). TI: thermal inertia slip proxy. V: authored CRISM target Gaussian bonus (σ = 25 cells).", 8)
    add_bullet(tf_c5, "Mode Weights:", "Safe (wE=2.5, wT=0.2, wS=8.0, wH=5.0, wV=0) · Balanced (wE=0.4, wT=3.0, wS=1.5, wH=1.0, wV=0) · Science (wE=0.8, wT=0.5, wS=1.2, wH=1.0, wV=8.0).", 8)

    add_card(s5, 6.6, 4.45, 5.933, 2.5, title="WHAT THESE RESULTS DO AND DO NOT SHOW", title_color=GREEN_ACCENT, bg_color=CARD_ORANGE, border_color=BORDER_ORANGE)
    tb_w5 = s5.shapes.add_textbox(Inches(6.8), Inches(4.8), Inches(5.533), Inches(2.1))
    tf_w5 = tb_w5.text_frame
    tf_w5.word_wrap = True
    add_bullet(tf_w5, "Science Mode Impact:", "Adds +28% distance and +28% energy vs Balanced for this pair.", 8.5, prefix_col=ORANGE_PRIMARY)
    add_bullet(tf_w5, "Safe Mode Overlap:", "Safe did not reduce energy vs Balanced here (1,616 vs 1,591 kJ); the two routes share 42% of nodes.", 8.5, prefix_col=ORANGE_PRIMARY)
    add_bullet(tf_w5, "Planning Preferences:", "These are planning preferences on a surrogate grid, not astronaut performance predictions.", 8.5, prefix_col=ORANGE_PRIMARY)
    add_bullet(tf_w5, "Fallback Behavior:", "If backend is unreachable, web UI falls back to pre-baked routes; those numbers are static.", 8.5, prefix_col=RED_ACCENT)

    # =========================================================================
    # SLIDE 6: REAL-WORLD EVIDENCE & SCIENCE ALONG THE TRAVERSE
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    set_slide_background(s6)
    add_header(s6, "REAL-WORLD EVIDENCE & SCIENTIFIC CONTEXT",
               "A Marswalk Should Explore More Than Distance.",
               "Scientific context is layered over the route, with orbital interpretation kept separate from rover ground truth.",
               slide_num=6, tag_color=GREEN_ACCENT)

    # Left Panel: Rover Track over Authored Geology
    add_card(s6, 0.8, 1.65, 5.8, 5.3, title="ROVER GROUND TRACK OVER AUTHORED GEOLOGY", title_color=BLUE_DARK, bg_color=CARD_BG)
    if os.path.exists(fig6):
        s6.shapes.add_picture(fig6, Inches(0.95), Inches(2.05), width=Inches(5.5))

    tb_f6_cap = s6.shapes.add_textbox(Inches(0.95), Inches(5.75), Inches(5.5), Inches(1.1))
    tf_f6 = tb_f6_cap.text_frame
    tf_f6.word_wrap = True
    p_f6 = tf_f6.paragraphs[0]
    p_f6.text = "Orange track & white dots: real Perseverance MMGIS data. Coloured polygons & stars: authored overlays in repo (coarse polygons, hand-placed targets). Blue dashed box: modelled sector."
    p_f6.font.name = "Arial"
    p_f6.font.size = Pt(8)
    p_f6.font.color.rgb = TEXT_MUTED

    # Right Panel: Ground Truth vs Orbital Interpretation Cards
    add_card(s6, 6.8, 1.65, 5.733, 2.3, title="GROUND TRUTH (ROVER)", title_color=GREEN_ACCENT, bg_color=CARD_GREEN, border_color=BORDER_GREEN)
    tb_gt = s6.shapes.add_textbox(Inches(7.0), Inches(2.0), Inches(5.333), Inches(1.9))
    tf_gt = tb_gt.text_frame
    tf_gt.word_wrap = True
    add_bullet(tf_gt, "Perseverance MMGIS Data:", "Waypoint & traverse GeoJSON from NASA-AMMOS MMGIS (559 legs, 708 points).", 8.5, prefix_col=GREEN_ACCENT)
    add_bullet(tf_gt, "Nearest-Observation Lookup:", "Surface image cards (5 curated entries; live NASA raw-image API call with fallback).", 8.5, prefix_col=GREEN_ACCENT)
    add_bullet(tf_gt, "Gale Crater Context:", "Curiosity rover waypoints to sol 5073 for Gale boxwork preset context.", 8.5, prefix_col=GREEN_ACCENT)

    add_card(s6, 6.8, 4.05, 5.733, 2.3, title="ORBITAL INTERPRETATION (AUTHORED)", title_color=ORANGE_PRIMARY, bg_color=CARD_ORANGE, border_color=BORDER_ORANGE)
    tb_oi = s6.shapes.add_textbox(Inches(7.0), Inches(4.4), Inches(5.333), Inches(1.9))
    tf_oi = tb_oi.text_frame
    tf_oi.word_wrap = True
    add_bullet(tf_oi, "5 Geologic Unit Polygons:", "Simplified after Sun & Stack (2020), USGS SIM 3464.", 8.5, prefix_col=ORANGE_PRIMARY)
    add_bullet(tf_oi, "5 CRISM Science Targets:", "Hand-authored GeoJSON citing CRISM cube IDs (no band-depth computation in repo).", 8.5, prefix_col=ORANGE_PRIMARY)
    add_bullet(tf_oi, "Target Boundary Handling:", "Lac de Charmes target (SCI-01) lies just outside routable sector: planner correctly rejects it.", 8.5, prefix_col=ORANGE_PRIMARY)

    # Bottom Pill
    bot_p6 = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(6.45), Inches(5.733), Inches(0.5))
    bot_p6.fill.solid()
    bot_p6.fill.fore_color.rgb = CARD_BLUE
    bot_p6.line.color.rgb = BORDER_BLUE
    tb_p6 = s6.shapes.add_textbox(Inches(6.9), Inches(6.5), Inches(5.533), Inches(0.4))
    p_bp6 = tb_p6.text_frame.paragraphs[0]
    p_bp6.alignment = PP_ALIGN.CENTER
    p_bp6.text = "Terrain understanding + Scientific context + Route choice = Science-informed planning"
    p_bp6.font.name = "Arial"
    p_bp6.font.size = Pt(8.5)
    p_bp6.font.bold = True
    p_bp6.font.color.rgb = BLUE_DARK

    # =========================================================================
    # SLIDE 7: ENGINEERING ARCHITECTURE, IMPACT, REFERENCES & LIMITATIONS
    # =========================================================================
    s7 = prs.slides.add_slide(blank_layout)
    set_slide_background(s7)
    add_header(s7, "ENGINEERING, IMPACT, REFERENCES & LIMITATIONS",
               "Building a Foundation for Data-Driven Mars Exploration.",
               "How the system is built, what has been tested, and what it cannot yet claim.",
               slide_num=7, tag_color=BLUE_DARK)

    # Left Panel: Tech Stack (SIH Style)
    add_card(s7, 0.8, 1.65, 5.6, 4.6, title="SYSTEM IMPLEMENTATION & TESTING", title_color=BLUE_DARK, bg_color=CARD_BG)
    tb_stk7 = s7.shapes.add_textbox(Inches(0.95), Inches(2.05), Inches(5.3), Inches(4.1))
    tf_stk7 = tb_stk7.text_frame
    tf_stk7.word_wrap = True
    add_bullet(tf_stk7, "Client:", "Next.js 14 / React 18 · TypeScript · Tailwind CSS · OpenLayers 9 · Three.js (3D sector preview)", 8.5, prefix_col=BLUE_DARK)
    add_bullet(tf_stk7, "Services:", "Python 3.11 · FastAPI · NumPy · SciPy · Rasterio · Endpoints: /health, /point-telemetry, /plan-eva, /rover-pov, /environmental, /briefing", 8.5, prefix_col=BLUE_DARK)
    add_bullet(tf_stk7, "Computation:", "TerrainEngine (grid sampling, hazard classes) · EVARoutePlanner (8-connected A*, Pandolf-Santee cost)", 8.5, prefix_col=BLUE_DARK)
    add_bullet(tf_stk7, "Data:", "Static .npz grid & GeoJSON in repo; live NASA raw-image API call with curated fallback", 8.5, prefix_col=BLUE_DARK)
    add_bullet(tf_stk7, "Deployment:", "Frontend on Vercel (mars-atlas-nasa.vercel.app); Backend on Render via render.yaml", 8.5, prefix_col=BLUE_DARK)
    add_bullet(tf_stk7, "Testing:", "8 pytest tests pass in 7s: geodesy, grid loading, point sampling, bounds, Horn formula, A* convergence, rover lookup, API endpoints", 8.5, prefix_col=GREEN_ACCENT)

    # Right Panel Top: Intended Impact
    add_card(s7, 6.6, 1.65, 5.933, 2.2, title="INTENDED IMPACT", title_color=GREEN_ACCENT, bg_color=CARD_GREEN, border_color=BORDER_GREEN)
    tb_imp = s7.shapes.add_textbox(Inches(6.8), Inches(2.0), Inches(5.533), Inches(1.8))
    tf_imp = tb_imp.text_frame
    tf_imp.word_wrap = True
    add_bullet(tf_imp, "Workflow Integration:", "MarsAtlas demonstrates how planetary observations can be organised into one workflow: terrain interpretation, scientific context, and computational traverse comparison.", 8.5, prefix_col=GREEN_ACCENT)
    add_bullet(tf_imp, "NASA Challenge Response:", "Directly targets the challenge's call for a layered, route-aware view for future Marswalk planning.", 8.5, prefix_col=GREEN_ACCENT)

    # Right Panel Bottom: Limitations
    add_card(s7, 6.6, 3.95, 5.933, 2.3, title="LIMITATIONS & SCIENTIFIC INTEGRITY", title_color=RED_ACCENT, bg_color=CARD_RED, border_color=BORDER_RED)
    tb_lim = s7.shapes.add_textbox(Inches(6.8), Inches(4.3), Inches(5.533), Inches(1.9))
    tf_lim = tb_lim.text_frame
    tf_lim.word_wrap = True
    add_bullet(tf_lim, "Prototype Status:", "Experimental prototype; not a certified astronaut safety system.", 8.5, prefix_col=RED_ACCENT)
    add_bullet(tf_lim, "Surrogate Data:", "Terrain grid is a surrogate; real HiRISE-derived data is required before claiming terrain accuracy.", 8.5, prefix_col=RED_ACCENT)
    add_bullet(tf_lim, "Model Assumptions:", "Route outputs depend on Tier 3 model assumptions (75 kg + 85 kg, η mapping).", 8.5, prefix_col=RED_ACCENT)
    add_bullet(tf_lim, "Radiation Proxy:", "Radiation shielding is a fixed factor; Gale RAD baseline used as Jezero proxy.", 8.5, prefix_col=RED_ACCENT)

    # Bottom Callout Banner
    bot_b7 = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(6.35), Inches(11.733), Inches(0.7))
    bot_b7.fill.solid()
    bot_b7.fill.fore_color.rgb = CARD_BLUE
    bot_b7.line.color.rgb = BORDER_BLUE
    tb_b7 = s7.shapes.add_textbox(Inches(1.0), Inches(6.42), Inches(11.333), Inches(0.55))
    tf_b7 = tb_b7.text_frame
    p_b7_1 = tf_b7.paragraphs[0]
    p_b7_1.alignment = PP_ALIGN.CENTER
    p_b7_1.text = "MarsAtlas — From Planetary Data to Exploration Decisions."
    p_b7_1.font.name = "Arial"
    p_b7_1.font.size = Pt(11)
    p_b7_1.font.bold = True
    p_b7_1.font.color.rgb = BLUE_DARK
    p_b7_2 = tf_b7.add_paragraph()
    p_b7_2.alignment = PP_ALIGN.CENTER
    p_b7_2.text = "Live Application: https://mars-atlas-nasa.vercel.app/   •   Source Code: https://github.com/shubham25-droid/MarsAtlas"
    p_b7_2.font.name = "Arial"
    p_b7_2.font.size = Pt(9.5)
    p_b7_2.font.color.rgb = ORANGE_PRIMARY

    output_path = os.path.join(r"D:\Antigravity Workspace\NASA Space Challenge 2026\MarsAtlas\docs\presentation", "marsatlas_presentation.pptx")
    prs.save(output_path)
    print(f"SIH-Style PowerPoint Presentation saved successfully: {output_path}")

if __name__ == "__main__":
    build_sih_pptx()

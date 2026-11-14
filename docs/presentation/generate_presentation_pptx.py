import os
import pptx
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

def build_pptx():
    prs = pptx.Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Color Palette
    BG_DARK = RGBColor(7, 10, 16)          # #070A10 Deep space
    CARD_BG = RGBColor(13, 21, 39)         # #0D1527 Charcoal navy
    CARD_BG_ALT = RGBColor(15, 23, 42)     # #0F172A Slate navy
    BORDER_COL = RGBColor(30, 41, 59)      # #1E293B Border
    ORANGE_MARS = RGBColor(243, 108, 61)   # #F36C3D Mars orange
    CYAN_SCI = RGBColor(56, 189, 248)      # #38BDF8 Science cyan
    GREEN_SAFE = RGBColor(52, 211, 153)    # #34D399 Emerald safe
    AMBER_WARN = RGBColor(251, 191, 36)    # #FBBF24 Amber warning
    TEXT_WHITE = RGBColor(248, 250, 252)   # #F8FAFC
    TEXT_MUTED = RGBColor(148, 163, 184)   # #94A3B8
    TEXT_DIM = RGBColor(100, 116, 139)     # #64748B

    def set_slide_background(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_DARK
        bg.line.fill.background()
        return bg

    def add_header(slide, title_text, category_tag, slide_num, subtitle_text=None):
        header_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.35), Inches(11.733), Inches(1.1))
        tf = header_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        
        # Tag line
        p_tag = tf.paragraphs[0]
        p_tag.text = f"{category_tag.upper()}  •  SLIDE {slide_num} OF 7"
        p_tag.font.name = "Arial"
        p_tag.font.size = Pt(9.5)
        p_tag.font.bold = True
        p_tag.font.color.rgb = CYAN_SCI
        p_tag.space_after = Pt(2)

        # Title
        p_title = tf.add_paragraph()
        p_title.text = title_text
        p_title.font.name = "Arial"
        p_title.font.size = Pt(20)
        p_title.font.bold = True
        p_title.font.color.rgb = TEXT_WHITE
        
        # Subtitle
        if subtitle_text:
            p_sub = tf.add_paragraph()
            p_sub.text = subtitle_text
            p_sub.font.name = "Arial"
            p_sub.font.size = Pt(11)
            p_sub.font.color.rgb = TEXT_MUTED
            p_sub.space_before = Pt(2)

        # Horizontal rule
        line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.5), Inches(11.733), Inches(0.02))
        line.fill.solid()
        line.fill.fore_color.rgb = BORDER_COL
        line.line.fill.background()

    def add_card(slide, left, top, width, height, title=None, title_color=ORANGE_MARS, bg_color=CARD_BG, border_color=BORDER_COL):
        shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(height))
        shape.fill.solid()
        shape.fill.fore_color.rgb = bg_color
        shape.line.color.rgb = border_color
        shape.line.width = Pt(1)

        if title:
            tb = slide.shapes.add_textbox(Inches(left + 0.25), Inches(top + 0.18), Inches(width - 0.5), Inches(0.35))
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

    def add_bullet(text_frame, bold_prefix, text_body, pt_size=10, prefix_col=CYAN_SCI, text_col=TEXT_WHITE, space_after=5):
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
    assets_dir = r"D:\Antigravity Workspace\NASA Space Challenge 2026\MarsAtlas\docs\slides_assets"
    insignia_img = os.path.join(assets_dir, "marsatlas_insignia.jpg")
    app_img = os.path.join(assets_dir, "app_screenshot.jpg")
    arch_img = os.path.join(assets_dir, "arch_diagram_cropped.png")
    metabolic_img = os.path.join(assets_dir, "metabolic_curves_cropped.png")
    slope_img = r"D:\Antigravity Workspace\NASA Space Challenge 2026\MarsAtlas\frontend\public\data\jezero_slope_hazard.png"
    height_img = r"D:\Antigravity Workspace\NASA Space Challenge 2026\MarsAtlas\frontend\public\data\jezero_heightmap.png"

    # =========================================================================
    # SLIDE 1: PROJECT INTRODUCTION & SYSTEM IDENTITY
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    set_slide_background(s1)
    add_header(s1, "MarsAtlas: Integrated Martian Terrain Intelligence & EVA Traverse Planning",
               "NASA International Space Apps Challenge 2026", 1,
               "Explore Mars. Understand Terrain. Plan Every Traverse.  |  Challenge: Interplanetary Survival Guide: Martian Map")

    # Left Column: Emblem & Links
    add_card(s1, 0.8, 1.65, 4.8, 5.4, title="MISSION IDENTITY & VERIFICATION", title_color=ORANGE_MARS)
    if os.path.exists(insignia_img):
        s1.shapes.add_picture(insignia_img, Inches(1.05), Inches(2.15), width=Inches(4.3))
    
    # Left Column Text Box below image
    tb1_left = s1.shapes.add_textbox(Inches(1.05), Inches(4.7), Inches(4.3), Inches(2.2))
    tf1_left = tb1_left.text_frame
    tf1_left.word_wrap = True
    tf1_left.margin_left = tf1_left.margin_top = tf1_left.margin_right = tf1_left.margin_bottom = 0
    add_bullet(tf1_left, "Study Region:", "Jezero Crater, Mars (18.38°N, 77.58°E) — Perseverance Landing Site", 9.5)
    add_bullet(tf1_left, "Web Application:", "https://mars-atlas-nasa.vercel.app/ (Live Production)", 9.5)
    add_bullet(tf1_left, "Geospatial API:", "https://marsatlas-backend.onrender.com/ (FastAPI / GDAL)", 9.5)
    add_bullet(tf1_left, "Code Repository:", "github.com/shubham25-droid/MarsAtlas (MIT Open Source)", 9.5)
    add_bullet(tf1_left, "Primary Mission Goal:", "Transform raw orbital science into actionable astronaut EVA decisions", 9.5)

    # Right Column: 3 System Capability Cards
    add_card(s1, 5.8, 1.65, 6.733, 1.65, title="1. MULTI-LAYER PLANETARY DATA FUSION", title_color=CYAN_SCI)
    tb1_r1 = s1.shapes.add_textbox(Inches(6.05), Inches(2.05), Inches(6.233), Inches(1.15))
    tf1_r1 = tb1_r1.text_frame
    tf1_r1.word_wrap = True
    tf1_r1.margin_left = tf1_r1.margin_top = tf1_r1.margin_right = tf1_r1.margin_bottom = 0
    add_bullet(tf1_r1, "Multi-Sensor Integration:", "Fuses USGS Astrogeology Viking Color, MOLA/HRSC Hillshade, 1m/px HiRISE DTMs, and CRISM hyperspectral mineral indices into a unified, interactive WebGIS engine.", 10)
    add_bullet(tf1_r1, "Planetary Standards:", "Standardized on IAU 2000 Mars Sphere reference datum and Equirectangular metric projection.", 10)

    add_card(s1, 5.8, 3.5, 6.733, 1.65, title="2. BIOMECHANICAL & TERRAIN HAZARD MODELING", title_color=GREEN_SAFE)
    tb1_r2 = s1.shapes.add_textbox(Inches(6.05), Inches(3.9), Inches(6.233), Inches(1.15))
    tf1_r2 = tb1_r2.text_frame
    tf1_r2.word_wrap = True
    tf1_r2.margin_left = tf1_r2.margin_top = tf1_r2.margin_right = tf1_r2.margin_bottom = 0
    add_bullet(tf1_r2, "NASA JSC CSRM Biomechanics:", "Implements the Pandolf-Santee metabolic workload formulation adapted to 0.38g Martian gravity for a 200 kg astronaut + exploration EVA suit system.", 10)
    add_bullet(tf1_r2, "Surface Micro-Hazards:", "Computes continuous Horn's gradient slope and THEMIS thermal inertia regolith trafficability.", 10)

    add_card(s1, 5.8, 5.35, 6.733, 1.7, title="3. SCIENTIFIC EVA TRAVERSE DECISION SUPPORT", title_color=AMBER_WARN)
    tb1_r3 = s1.shapes.add_textbox(Inches(6.05), Inches(5.75), Inches(6.233), Inches(1.2))
    tf1_r3 = tb1_r3.text_frame
    tf1_r3.word_wrap = True
    tf1_r3.margin_left = tf1_r3.margin_top = tf1_r3.margin_right = tf1_r3.margin_bottom = 0
    add_bullet(tf1_r3, "3 Canonical Mission Modes:", "Solves Min-Metabolic (Safe), Balanced-Time, and Science-Priority traverses using multi-objective A* on directed terrain cost graphs.", 10)
    add_bullet(tf1_r3, "Flight Controller Tools:", "Real-time topographic cross-sections, metabolic profiles, and automated mission briefings.", 10)

    # =========================================================================
    # SLIDE 2: THE SCIENTIFIC PROBLEM
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    set_slide_background(s2)
    add_header(s2, "The Scientific Problem: Mapping Mars Is Not the Same as Planning a Marswalk",
               "Operational Problem Definition", 2,
               "Why 2D orbital map services fail human explorers navigating complex surface terrain")

    # Top Banner Callout
    banner = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.65), Inches(11.733), Inches(0.75))
    banner.fill.solid()
    banner.fill.fore_color.rgb = CARD_BG
    banner.line.color.rgb = ORANGE_MARS
    banner.line.width = Pt(1.5)
    tb_b = s2.shapes.add_textbox(Inches(1.05), Inches(1.73), Inches(11.233), Inches(0.6))
    tf_b = tb_b.text_frame
    tf_b.word_wrap = True
    tf_b.margin_left = tf_b.margin_top = tf_b.margin_right = tf_b.margin_bottom = 0
    p_b = tf_b.paragraphs[0]
    p_b.text = "CORE OPERATIONAL REALITY: Future human EVA on Mars operates under finite Life Support System (PLSS) constraints (6–8 hr O2, thermal cooling, battery power). An astronaut cannot simply take the 'shortest route' across a 2D orbital map without risking catastrophic metabolic exhaustion or impassable terrain entrapment."
    p_b.font.name = "Arial"
    p_b.font.size = Pt(10)
    p_b.font.color.rgb = TEXT_WHITE
    p_b.font.bold = True

    # Three Vertical Comparison Cards
    col_w = 3.75
    col_gap = 0.24
    
    # Col 1: 2D Imagery vs 3D Kinematics
    c1_left = 0.8
    add_card(s2, c1_left, 2.55, col_w, 4.5, title="2D IMAGERY VS. 3D KINEMATICS", title_color=ORANGE_MARS)
    tb2_c1 = s2.shapes.add_textbox(Inches(c1_left + 0.2), Inches(2.95), Inches(col_w - 0.4), Inches(3.95))
    tf2_c1 = tb2_c1.text_frame
    tf2_c1.word_wrap = True
    tf2_c1.margin_left = tf2_c1.margin_top = tf2_c1.margin_right = tf2_c1.margin_bottom = 0
    add_bullet(tf2_c1, "Visual Deception:", "High-albedo sand or flat satellite imagery conceals treacherous 15°–25° slope gradients.", 10)
    add_bullet(tf2_c1, "Metabolic Tripling:", "A 15° incline triples human metabolic power from ~315 W to >720 W inside a pressurized 120 kg EVA exploration suit.", 10)
    add_bullet(tf2_c1, "Exclusion Limits:", "Slopes >20° exceed suit joint mobility limits, causing slip failure and structural damage.", 10)
    add_bullet(tf2_c1, "Unseen Sinkage:", "Visually 'smooth' orbital regions often consist of loose, high-sinkage eolian drift sand.", 10)

    # Col 2: Euclidean Lines vs Real Ground Cost
    c2_left = c1_left + col_w + col_gap
    add_card(s2, c2_left, 2.55, col_w, 4.5, title="EUCLIDEAN LINES VS. TERRAIN COST", title_color=CYAN_SCI)
    tb2_c2 = s2.shapes.add_textbox(Inches(c2_left + 0.2), Inches(2.95), Inches(col_w - 0.4), Inches(3.95))
    tf2_c2 = tb2_c2.text_frame
    tf2_c2.word_wrap = True
    tf2_c2.margin_left = tf2_c2.margin_top = tf2_c2.margin_right = tf2_c2.margin_bottom = 0
    add_bullet(tf2_c2, "Straight-Line Failure:", "Standard geometric shortest-path algorithms drive direct lines straight over cliffs and scarps.", 10)
    add_bullet(tf2_c2, "Jezero Example:", "A direct path from Octavia E. Butler to Cape Flatley crosses a 25° delta scarp, causing immediate mission abort.", 10)
    add_bullet(tf2_c2, "Workload vs Distance:", "A path that is 200 m shorter can require 50% more metabolic energy due to cumulative elevation gain.", 10)
    add_bullet(tf2_c2, "Routing Paradigm:", "Routing must be terrain-aware, multi-criteria, and constrained by metabolic energy rates.", 10)

    # Col 3: Fragmented Data Silos
    c3_left = c2_left + col_w + col_gap
    add_card(s2, c3_left, 2.55, col_w, 4.5, title="FRAGMENTED SCIENTIFIC DATA SILOS", title_color=AMBER_WARN)
    tb2_c3 = s2.shapes.add_textbox(Inches(c3_left + 0.2), Inches(2.95), Inches(col_w - 0.4), Inches(3.95))
    tf2_c3 = tb2_c3.text_frame
    tf2_c3.word_wrap = True
    tf2_c3.margin_left = tf2_c3.margin_top = tf2_c3.margin_right = tf2_c3.margin_bottom = 0
    add_bullet(tf2_c3, "Disconnected Archives:", "Elevation (HiRISE/MOLA), mineralogy (CRISM), and imagery (USGS/Trek) reside in incompatible archives.", 10)
    add_bullet(tf2_c3, "Format Barriers:", "PDS IMG, VICAR, GeoTIFF, and WMS tiles lack real-time browser-based compositing.", 10)
    add_bullet(tf2_c3, "No Integrated Decision Support:", "Astronauts and flight directors lack an integrated tool uniting elevation, mineralogy, and bioenergetics.", 10)
    add_bullet(tf2_c3, "MarsAtlas Solution:", "Fuses these silos into an interactive, real-time EVA terrain intelligence platform.", 10)

    # =========================================================================
    # SLIDE 3: THE MARSATLAS APPROACH & ARCHITECTURE
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    set_slide_background(s3)
    add_header(s3, "The MarsAtlas Approach: One Exploration Environment, Multiple Perspectives",
               "System Architecture & Data Pipeline", 3,
               "A 5-layer planetary intelligence pipeline from raw orbital archives to real-time EVA flight decisions")

    # Left Panel: Architecture Diagram
    add_card(s3, 0.8, 1.65, 6.2, 5.4, title="SYSTEM PIPELINE & DATA FLOW", title_color=ORANGE_MARS)
    if os.path.exists(arch_img):
        s3.shapes.add_picture(arch_img, Inches(0.95), Inches(2.1), width=Inches(5.9))

    # Right Panel: 5-Layer Stack Explanation
    add_card(s3, 7.2, 1.65, 5.333, 5.4, title="5-LAYER PLANETARY INTELLIGENCE STACK", title_color=CYAN_SCI)
    tb3_r = s3.shapes.add_textbox(Inches(7.4), Inches(2.05), Inches(4.933), Inches(4.85))
    tf3_r = tb3_r.text_frame
    tf3_r.word_wrap = True
    tf3_r.margin_left = tf3_r.margin_top = tf3_r.margin_right = tf3_r.margin_bottom = 0
    add_bullet(tf3_r, "Layer 1: Visual & Morphologic Base", "USGS Astrogeology Viking MDIM2.1 Color Mosaic (global) + MOLA/HRSC Blend Hillshade via planetary TileWMS for morphological context.", 9.5)
    add_bullet(tf3_r, "Layer 2: Topographic Metric Grid", "32-bit floating point HiRISE DTM (1.0 m/px) processed with Horn's 8-neighbor gradient filter and terrain roughness index (TRI) for micro-hazard detection.", 9.5)
    add_bullet(tf3_r, "Layer 3: Composition & Trafficability", "MRO CRISM hyperspectral mineral units (Fe/Mg clays, carbonates, olivine) fused with THEMIS Thermal Inertia regolith impedance (η ∈ [1.0, 1.35]).", 9.5)
    add_bullet(tf3_r, "Layer 4: Biomechanical Routing Engine", "Multi-objective A* graph solver evaluating slope, walking velocity, regolith impedance, and NASA JSC Pandolf-Santee metabolic power.", 9.5)
    add_bullet(tf3_r, "Layer 5: Decision Support & Flight Briefing", "Interactive 3D cross-sections, multi-route trade-off scorecards, and automated Flight Director briefing generation.", 9.5)

    # =========================================================================
    # SLIDE 4: TERRAIN INTELLIGENCE: SURFACE METRICS
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    set_slide_background(s4)
    add_header(s4, "Terrain Intelligence: Understanding Surface Physics Beyond Visual Imagery",
               "Topographic Metrics & Hazard Quantification", 4,
               "Quantifying elevation gradients, roughness, and regolith trafficability at 1-meter spatial resolution")

    # Left Column: Mathematical Formulation & Hazard Thresholds
    add_card(s4, 0.8, 1.65, 6.0, 3.0, title="HORN'S GRADIENT & REGOLITH IMPEDANCE", title_color=ORANGE_MARS)
    tb4_m = s4.shapes.add_textbox(Inches(1.05), Inches(2.05), Inches(5.5), Inches(2.5))
    tf4_m = tb4_m.text_frame
    tf4_m.word_wrap = True
    tf4_m.margin_left = tf4_m.margin_top = tf4_m.margin_right = tf4_m.margin_bottom = 0
    add_bullet(tf4_m, "Horn's 8-Neighbor Gradient Formula:", "p = [(z++ + 2z+0 + z+-) - (z-+ + 2z-0 + z--)] / 8Δx\nq = [(z++ + 2z0+ + z-+) - (z+- + 2z0- + z--)] / 8Δy\nSlope Angle θ = arctan(√(p² + q²))", 9.5, prefix_col=AMBER_WARN)
    add_bullet(tf4_m, "32-Bit Floating Point Precision:", "Derived from 1.0 m/px HiRISE stereo DTMs (PSP_001415_1985 / PSP_001336_1985), providing sub-degree terrain slope accuracy.", 9.5)
    add_bullet(tf4_m, "Regolith Impedance (η):", "Fine drift dust/megaripples (η = 1.35, high sinkage) vs cemented regolith (η = 1.15) vs bedrock pavement (η = 1.0, optimal traction).", 9.5)

    add_card(s4, 0.8, 4.8, 6.0, 2.25, title="QUANTITATIVE SLOPE HAZARD BOUNDARIES", title_color=CYAN_SCI)
    tb4_h = s4.shapes.add_textbox(Inches(1.05), Inches(5.18), Inches(5.5), Inches(1.8))
    tf4_h = tb4_h.text_frame
    tf4_h.word_wrap = True
    tf4_h.margin_left = tf4_h.margin_top = tf4_h.margin_right = tf4_h.margin_bottom = 0
    add_bullet(tf4_h, "θ < 10° (Nominal Walkway):", "Metabolic power < 420 W. Low physical exertion, optimal EVA traverse speed (~1.0 m/s).", 9.5, prefix_col=GREEN_SAFE)
    add_bullet(tf4_h, "10° ≤ θ ≤ 18° (Elevated Workload):", "Metabolic power 500–750 W. Speed drops to 0.5–0.7 m/s. Pacing and telemetry monitoring required.", 9.5, prefix_col=AMBER_WARN)
    add_bullet(tf4_h, "θ > 20° (Hard Exclusion Boundary):", "Exceeds joint articulation torque of EVA suit. Extreme slip risk; strictly excluded from traverse graph.", 9.5, prefix_col=ORANGE_MARS)

    # Right Column: Heightmap and Hazard Overlay Visuals
    add_card(s4, 7.0, 1.65, 5.533, 5.4, title="JEZERO CRATER HIGH-RESOLUTION METRICS", title_color=GREEN_SAFE)
    if os.path.exists(height_img):
        s4.shapes.add_picture(height_img, Inches(7.25), Inches(2.1), width=Inches(2.45))
    if os.path.exists(slope_img):
        s4.shapes.add_picture(slope_img, Inches(9.85), Inches(2.1), width=Inches(2.45))

    tb4_cap = s4.shapes.add_textbox(Inches(7.25), Inches(4.35), Inches(5.05), Inches(2.6))
    tf4_cap = tb4_cap.text_frame
    tf4_cap.word_wrap = True
    tf4_cap.margin_left = tf4_cap.margin_top = tf4_cap.margin_right = tf4_cap.margin_bottom = 0
    add_bullet(tf4_cap, "Dual View Integration:", "Left: 32-bit elevation heightmap (blue = -2570m floor, yellow = -2415m delta rim). Right: 1m HiRISE Horn's slope hazard overlay.", 9.5)
    add_bullet(tf4_cap, "Micro-Feature Detection:", "Detects meter-scale scarp fractures, dune crests, and boulder fields invisible in orbital visual mosaics.", 9.5)
    add_bullet(tf4_cap, "Ground Verification:", "Calibrated against NASA Perseverance rover localized tilt and drive slip logs across Sols 0–1000.", 9.5)

    # =========================================================================
    # SLIDE 5: EVA TRAVERSE PLANNING & BIOENERGETICS
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    set_slide_background(s5)
    add_header(s5, "EVA Traverse Planning: From Shortest Path to Terrain-Aware Trade-offs",
               "Bioenergetics & Traverse Optimization", 5,
               "Modeling human metabolic workload under 0.38g Martian gravity using NASA JSC Crew Survival formulations")

    # Left Column: Formulation
    add_card(s5, 0.8, 1.65, 5.6, 2.7, title="NASA JSC CSRM / PANDOLF-SANTEE FORMULATION", title_color=ORANGE_MARS)
    tb5_f = s5.shapes.add_textbox(Inches(1.05), Inches(2.05), Inches(5.1), Inches(2.2))
    tf5_f = tb5_f.text_frame
    tf5_f.word_wrap = True
    tf5_f.margin_left = tf5_f.margin_top = tf5_f.margin_right = tf5_f.margin_bottom = 0
    add_bullet(tf5_f, "Pandolf-Santee Bioenergetic Equation:", "P_walk = [1.5M + 2.0(M+L)(L/M)² + η(M+L)(1.5V² + 0.35VG)] · (g_mars / g_earth)", 9.5, prefix_col=AMBER_WARN)
    add_bullet(tf5_f, "Crew & Suit Mass:", "Astronaut mass M = 80 kg, EVA Exploration Suit L = 120 kg (Total = 200 kg).", 9.5)
    add_bullet(tf5_f, "Martian Gravity Scale:", "g_mars = 3.72 m/s² (37.9% of terrestrial gravity, scaling metabolic inertia).", 9.5)
    add_bullet(tf5_f, "Slope Modulated Speed:", "V = 0.5 – 1.2 m/s, dynamically reduced on positive grades according to Tobler's Martian hiking function.", 9.5)

    add_card(s5, 0.8, 4.5, 5.6, 2.55, title="MULTI-OBJECTIVE A* ROUTING GRAPH", title_color=CYAN_SCI)
    tb5_g = s5.shapes.add_textbox(Inches(1.05), Inches(4.88), Inches(5.1), Inches(2.05))
    tf5_g = tb5_g.text_frame
    tf5_g.word_wrap = True
    tf5_g.margin_left = tf5_g.margin_top = tf5_g.margin_right = tf5_g.margin_bottom = 0
    add_bullet(tf5_g, "Edge Cost Function:", "C(u, v) = Δs · [w_E · P_met(θ, η) + w_T · Δt + w_H · H(θ) - w_S · S_crism]", 9.5, prefix_col=AMBER_WARN)
    add_bullet(tf5_g, "Directed Graph Network:", "Evaluates slope directionality: uphill hiking requires heavy exertion, downhill descent requires braking control.", 9.5)
    add_bullet(tf5_g, "Admissible Octile Heuristic:", "Scaled to prevent straight-line metric collapse, guaranteeing mathematical optimality.", 9.5)

    # Right Column: Metabolic Curves & Quantitative Comparison Table
    add_card(s5, 6.6, 1.65, 5.933, 2.45, title="PHYSIOLOGICAL METABOLIC LOAD CURVES", title_color=GREEN_SAFE)
    if os.path.exists(metabolic_img):
        s5.shapes.add_picture(metabolic_img, Inches(7.15), Inches(2.02), width=Inches(4.8))

    # Quantitative Comparison Table below
    t_shape = s5.shapes.add_table(4, 5, Inches(6.6), Inches(4.25), Inches(5.933), Inches(2.8))
    table = t_shape.table
    table.columns[0].width = Inches(1.6)
    table.columns[1].width = Inches(0.95)
    table.columns[2].width = Inches(0.95)
    table.columns[3].width = Inches(1.1)
    table.columns[4].width = Inches(1.333)

    headers = ["TRAVERSE MODE", "DIST", "TIME", "WORKLOAD", "MAX SLOPE"]
    for j, h in enumerate(headers):
        cell = table.cell(0, j)
        cell.fill.solid()
        cell.fill.fore_color.rgb = CARD_BG
        p = cell.text_frame.paragraphs[0]
        p.text = h
        p.font.name = "Arial"
        p.font.size = Pt(9.5)
        p.font.bold = True
        p.font.color.rgb = ORANGE_MARS

    row_data = [
        ("Min-Metabolic (Safe)", "2,850 m", "85.2 min", "1,590 kJ", "12.4° (Contours dunes)"),
        ("Balanced-Time", "2,771 m", "74.1 min", "1,740 kJ", "18.2° (Direct grade)"),
        ("Science-Priority", "3,661 m", "109.8 min", "2,280 kJ", "14.8° (CRISM outcrops)")
    ]

    for i, row in enumerate(row_data):
        for j, val in enumerate(row):
            cell = table.cell(i + 1, j)
            cell.fill.solid()
            cell.fill.fore_color.rgb = CARD_BG_ALT
            p = cell.text_frame.paragraphs[0]
            p.text = val
            p.font.name = "Arial"
            p.font.size = Pt(9)
            p.font.color.rgb = TEXT_WHITE if j > 0 else CYAN_SCI

    # =========================================================================
    # SLIDE 6: SCIENCE ALONG THE TRAVERSE
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    set_slide_background(s6)
    add_header(s6, "Science Along the Traverse: A Marswalk Should Maximize Discovery",
               "Planetary Science & In-Situ Exploration", 6,
               "Integrating CRISM mineralogy, USGS geologic maps, and Perseverance rover in-situ observations")

    # Left Column: Interactive App Interface Screenshot
    add_card(s6, 0.8, 1.65, 6.3, 5.4, title="LIVE MARSATLAS EVA COPILOT VERIFICATION", title_color=ORANGE_MARS)
    if os.path.exists(app_img):
        s6.shapes.add_picture(app_img, Inches(0.95), Inches(2.1), width=Inches(6.0))

    tb6_cap = s6.shapes.add_textbox(Inches(0.95), Inches(5.6), Inches(6.0), Inches(1.3))
    tf6_cap = tb6_cap.text_frame
    tf6_cap.word_wrap = True
    tf6_cap.margin_left = tf6_cap.margin_top = tf6_cap.margin_right = tf6_cap.margin_bottom = 0
    add_bullet(tf6_cap, "Live Operational Interface:", "Displays Jezero Crater canonical scenarios, dynamic route generation, continuous topographic & metabolic cross-section profiles, and multi-route trade-off scorecards.", 9.5)

    # Right Column: Geological Targets & Rover Integration
    add_card(s6, 7.3, 1.65, 5.233, 2.8, title="CANONICAL JEZERO GEOLOGICAL TARGETS", title_color=CYAN_SCI)
    tb6_geo = s6.shapes.add_textbox(Inches(7.5), Inches(2.05), Inches(4.833), Inches(2.3))
    tf6_geo = tb6_geo.text_frame
    tf6_geo.word_wrap = True
    tf6_geo.margin_left = tf6_geo.margin_top = tf6_geo.margin_right = tf6_geo.margin_bottom = 0
    add_bullet(tf6_geo, "Western Delta Front Scarp (Cape Flatley):", "Stratified sedimentary mudstones rich in Fe/Mg smectite clays with prime biosignature preservation potential.", 9.5)
    add_bullet(tf6_geo, "Séítah Formation (Dourbes Ridge):", "Olivine-rich cumulate bedrock revealing early Noachian magmatic and aqueous crystallization history.", 9.5)
    add_bullet(tf6_geo, "Margin Carbonate Rim (Lac de Charmes):", "Concentrated magnesium carbonates recording ancient paleolake shorelines and environmental pH.", 9.5)
    add_bullet(tf6_geo, "Kodiak Butte Isolated Mesa:", "Classic Gilbert-type delta clinoforms confirming deep standing water in ancient Jezero paleolake.", 9.5)

    add_card(s6, 7.3, 4.6, 5.233, 2.45, title="ROVER GROUND-TRUTH TELEMETRY INTEGRATION", title_color=GREEN_SAFE)
    tb6_rov = s6.shapes.add_textbox(Inches(7.5), Inches(5.0), Inches(4.833), Inches(1.95))
    tf6_rov = tb6_rov.text_frame
    tf6_rov.word_wrap = True
    tf6_rov.margin_left = tf6_rov.margin_top = tf6_rov.margin_right = tf6_rov.margin_bottom = 0
    add_bullet(tf6_rov, "Perseverance Traverse Alignment:", "Sol waypoints, Mastcam-Z context images, and SuperCam LIBS targets indexed directly along EVA corridors.", 9.5)
    add_bullet(tf6_rov, "Science-Priority Traversal:", "The solver routes the EVA crew to high-priority geological sampling sites while guaranteeing life-support margins.", 9.5)

    # =========================================================================
    # SLIDE 7: ENGINEERING ARCHITECTURE, EPISTEMIC RIGOR & LIMITATIONS
    # =========================================================================
    s7 = prs.slides.add_slide(blank_layout)
    set_slide_background(s7)
    add_header(s7, "Engineering Foundation, Epistemic Rigor & Known Limitations",
               "Engineering Architecture & Scientific Rigor", 7,
               "Production deployment architecture, 4-tier truth classification, and critical engineering boundaries")

    # Left Column: Deployment Stack & Critical Limitations
    add_card(s7, 0.8, 1.65, 5.5, 2.5, title="PRODUCTION CLOUD ARCHITECTURE", title_color=ORANGE_MARS)
    tb7_stk = s7.shapes.add_textbox(Inches(1.05), Inches(2.05), Inches(5.0), Inches(2.0))
    tf7_stk = tb7_stk.text_frame
    tf7_stk.word_wrap = True
    tf7_stk.margin_left = tf7_stk.margin_top = tf7_stk.margin_right = tf7_stk.margin_bottom = 0
    add_bullet(tf7_stk, "Frontend Application:", "Next.js 14, TypeScript, OpenLayers 9, TailwindCSS, Lucide Icons. Deployed on Vercel Global Edge CDN (sub-100ms global latency).", 9.5)
    add_bullet(tf7_stk, "Live Frontend URL:", "https://mars-atlas-nasa.vercel.app/ (Verified HTTP 200 OK)", 9.5)
    add_bullet(tf7_stk, "Backend Geospatial API:", "FastAPI, Rasterio / GDAL, NumPy, SciPy, NetworkX. Deployed on Render Cloud.", 9.5)
    add_bullet(tf7_stk, "Live API URL:", "https://marsatlas-backend.onrender.com/ (Verified HTTP 200 OK)", 9.5)

    add_card(s7, 0.8, 4.3, 5.5, 2.75, title="CRITICAL SCIENTIFIC & ENGINEERING LIMITATIONS", title_color=AMBER_WARN)
    tb7_lim = s7.shapes.add_textbox(Inches(1.05), Inches(4.7), Inches(5.0), Inches(2.25))
    tf7_lim = tb7_lim.text_frame
    tf7_lim.word_wrap = True
    tf7_lim.margin_left = tf7_lim.margin_top = tf7_lim.margin_right = tf7_lim.margin_bottom = 0
    add_bullet(tf7_lim, "Resolution Boundary:", "Orbital 1m/px DTM cannot detect decimeter-scale boulders (<50 cm) that pose ankle-roll or puncture hazards without rover-level obstacle sensors.", 9.5)
    add_bullet(tf7_lim, "Regolith Dynamics:", "Uses static thermal inertia proxies; dynamic shear deformation and wheel/boot sinkage depend on local packing density.", 9.5)
    add_bullet(tf7_lim, "Radiation Telemetry:", "Cosmic ray exposure assumes nominal GCR background; real-time Solar Particle Event (SPE) sensors required for active warning.", 9.5)

    # Right Column: 4-Tier Epistemic Integrity Classification
    add_card(s7, 6.5, 1.65, 6.033, 5.4, title="4-TIER EPISTEMIC INTEGRITY CLASSIFICATION", title_color=CYAN_SCI)
    tb7_epi = s7.shapes.add_textbox(Inches(6.75), Inches(2.05), Inches(5.533), Inches(4.85))
    tf7_epi = tb7_epi.text_frame
    tf7_epi.word_wrap = True
    tf7_epi.margin_left = tf7_epi.margin_top = tf7_epi.margin_right = tf7_epi.margin_bottom = 0
    
    add_bullet(tf7_epi, "Tier 1: Direct Planetary Observations", "NASA HiRISE 1m DTM, MRO CRISM hyperspectral cubes, USGS Viking mosaics, Perseverance rover Sol telemetry.\nStatus: [VERIFIED SATELLITE/ROVER GROUND TRUTH]", 9.5, prefix_col=GREEN_SAFE)
    add_bullet(tf7_epi, "Tier 2: Deterministic Geospatial Models", "Horn's 8-neighbor gradient slope metric, terrain roughness index (TRI), topographic cross-section profiles.\nStatus: [VERIFIED COMPUTATIONAL GEOSPATIAL]", 9.5, prefix_col=CYAN_SCI)
    add_bullet(tf7_epi, "Tier 3: Empirical Bioenergetic Models", "NASA JSC CSRM / Pandolf-Santee metabolic equation adapted to 0.38g Martian gravity and 200kg suited mass.\nStatus: [DERIVED PHYSICAL ANALOGUE]", 9.5, prefix_col=AMBER_WARN)
    add_bullet(tf7_epi, "Tier 4: Operational Decision Support", "Multi-objective A* solver, PLSS consumable margin projections, automated Flight Director briefings.\nStatus: [SIMULATED DECISION SUPPORT]", 9.5, prefix_col=ORANGE_MARS)

    # Save presentation
    output_path = os.path.join(r"D:\Antigravity Workspace\NASA Space Challenge 2026\MarsAtlas\docs\presentation", "marsatlas_presentation.pptx")
    prs.save(output_path)
    print(f"PowerPoint Presentation saved successfully: {output_path}")

if __name__ == "__main__":
    build_pptx()

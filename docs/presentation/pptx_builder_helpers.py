import os
import pptx
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

# Initialize Presentation 16:9
prs = pptx.Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)
blank_layout = prs.slide_layouts[6]

# Theme Colors
BG_DARK = RGBColor(7, 10, 16)          # #070A10
CARD_BG = RGBColor(13, 21, 39)         # #0D1527
BORDER_COL = RGBColor(30, 41, 59)      # #1E293B
ORANGE_MARS = RGBColor(243, 108, 61)   # #F36C3D
CYAN_SCI = RGBColor(56, 189, 248)      # #38BDF8
GREEN_SAFE = RGBColor(52, 211, 153)    # #34D399
AMBER_WARN = RGBColor(251, 191, 36)    # #FBBF24
TEXT_WHITE = RGBColor(248, 250, 252)   # #F8FAFC
TEXT_MUTED = RGBColor(148, 163, 184)   # #94A3B8
TEXT_DIM = RGBColor(100, 116, 139)     # #64748B

def set_slide_background(slide):
    # Full bleed background rectangle
    bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg.fill.solid()
    bg.fill.fore_color.rgb = BG_DARK
    bg.line.fill.background()
    return bg

def add_header(slide, title_text, category_tag, slide_num):
    # Header container
    header_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.733), Inches(1.1))
    tf = header_box.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
    
    # Tag line
    p_tag = tf.paragraphs[0]
    p_tag.text = f"{category_tag.upper()}  •  SLIDE {slide_num} OF 7"
    p_tag.font.name = "Arial"
    p_tag.font.size = Pt(10)
    p_tag.font.bold = True
    p_tag.font.color.rgb = CYAN_SCI
    p_tag.space_after = Pt(4)

    # Title
    p_title = tf.add_paragraph()
    p_title.text = title_text
    p_title.font.name = "Arial"
    p_title.font.size = Pt(22)
    p_title.font.bold = True
    p_title.font.color.rgb = TEXT_WHITE

    # Horizontal hairline rule
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
        tb = slide.shapes.add_textbox(Inches(left + 0.25), Inches(top + 0.2), Inches(width - 0.5), Inches(0.4))
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

def add_bullet(text_frame, bold_prefix, text_body, pt_size=11, prefix_col=CYAN_SCI, text_col=TEXT_WHITE, space_after=6):
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
        run_bold.text = bold_prefix + " "
        run_bold.font.name = "Arial"
        run_bold.font.size = Pt(pt_size)
        run_bold.font.bold = True
        run_bold.font.color.rgb = prefix_col

    run_text = p.add_run()
    run_text.text = text_body
    run_text.font.name = "Arial"
    run_text.font.size = Pt(pt_size)
    run_text.font.color.rgb = text_col

print("Helper functions defined successfully")

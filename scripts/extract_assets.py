#!/usr/bin/env python3
"""
Extract assets from the mockup image:
1. Riana hero photo (top portion of mockup)
2. Crowd background (middle portion)
3. Sample color bands for verification
"""

from PIL import Image, ImageEnhance, ImageFilter
import os

MOCKUP = "/home/z/my-project/upload/ChatGPT Image Jul 24, 2026, 09_23_28 PM.png"
OUT_DIR = "/home/z/my-project/public/brand"
os.makedirs(OUT_DIR, exist_ok=True)

img = Image.open(MOCKUP).convert("RGB")
W, H = img.size
print(f"Mockup size: {W}x{H}")

# The mockup is 864x1821. Hero section is roughly top 0-700px
# Riana is positioned on the right side around x=500-820, y=80-650

# === 1. Riana hero crop (right portion of hero section) ===
# Tight crop on Riana figure
riana_box = (440, 60, 864, 720)
riana = img.crop(riana_box)
riana.save(f"{OUT_DIR}/riana-hero.png", quality=92, optimize=True)
print(f"✓ Riana hero: {riana.size}")

# === 2. Crowd background (the blurred mass of people behind hero) ===
# Looking at the mockup, crowd is in the middle band behind hero text
crowd_box = (0, 100, 864, 600)
crowd = img.crop(crowd_box)
# Heavy blur for background use
crowd_blurred = crowd.filter(ImageFilter.GaussianBlur(radius=15))
crowd_blurred.save(f"{OUT_DIR}/crowd-bg.jpg", quality=85, optimize=True)
print(f"✓ Crowd background: {crowd_blurred.size}")

# === 3. Riana portrait tighter (for Meet Riana section) ===
# Face + upper body
riana_face_box = (530, 80, 820, 480)
riana_face = img.crop(riana_face_box)
riana_face.save(f"{OUT_DIR}/riana-portrait.png", quality=92, optimize=True)
print(f"✓ Riana portrait: {riana_face.size}")

# === 4. Color swatches (verify extracted colors) ===
swatch_size = 100
swatches = [
    ("magenta-primary",  (220, 30, 110),  "#DF2679"),
    ("orange-secondary", (241, 114, 56),  "#F17238"),
    ("purpleblack-dark", (21, 15, 30),    "#150F1E"),
    ("cream-bg",         (249, 239, 234), "#F9EFEA"),
    ("coral-accent",     (232, 148, 143), "#E8948F"),
    ("plum-deep",        (81, 52, 63),    "#51343F"),
]
swatch_img = Image.new("RGB", (swatch_size * len(swatches), swatch_size + 30), "white")
from PIL import ImageDraw, ImageFont
draw = ImageDraw.Draw(swatch_img)
for i, (name, rgb, hex_code) in enumerate(swatches):
    x = i * swatch_size
    draw.rectangle([x, 0, x + swatch_size, swatch_size], fill=rgb)
    draw.text((x + 5, swatch_size + 5), hex_code, fill="black")
swatch_img.save(f"{OUT_DIR}/palette-swatches.png")
print(f"✓ Palette swatches saved")

# === 5. Try simple background removal on Riana (chroma key style) ===
# The mockup background is gradient pink-orange. Try to make it transparent.
riana_rgba = img.crop(riana_box).convert("RGBA")
pixels = riana_rgba.load()
w, h = riana_rgba.size
removed = 0
for y in range(h):
    for x in range(w):
        r, g, b, a = pixels[x, y]
        # Detect pinkish-orange background (high R, medium G, low-medium B)
        # Background pixels: R>180, G in 80-200, B in 100-180
        is_bg = (
            r > 200 and 80 < g < 200 and 80 < b < 200
            and abs(r - g) > 30
            and r > b
        )
        # Also detect pure white background
        is_white = (r > 240 and g > 240 and b > 240)
        # And cream background
        is_cream = (r > 240 and 230 < g < 245 and 220 < b < 240)
        if is_bg or is_white or is_cream:
            pixels[x, y] = (r, g, b, 0)
            removed += 1
print(f"✓ Background removal: {removed} pixels made transparent ({removed/(w*h)*100:.1f}%)")
riana_rgba.save(f"{OUT_DIR}/riana-cutout.png")
print(f"✓ Riana cutout (transparent bg): {riana_rgba.size}")

# === 6. Print final asset list ===
print("\n=== ASSET LIBRARY ===")
for f in sorted(os.listdir(OUT_DIR)):
    path = os.path.join(OUT_DIR, f)
    size = os.path.getsize(path) / 1024
    print(f"  /brand/{f}  ({size:.1f} KB)")

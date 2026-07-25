#!/usr/bin/env python3
"""
Process user uploaded poster image for Hero background use:
1. Crop center portion (skip busy text edges)
2. Apply dark gradient pre-overlay baked into image
3. Output Hero-ready version
"""

from PIL import Image, ImageEnhance, ImageFilter

SRC = "/home/z/my-project/public/brand/user-hero.png"
OUT_HERO = "/home/z/my-project/public/brand/user-hero-processed.jpg"

img = Image.open(SRC).convert("RGB")
W, H = img.size
print(f"Source: {W}x{H}")

# Crop center 60% width, full height (skip left/right text columns)
# Keep center where the main photo of Riana + crowd is
crop_left = int(W * 0.20)
crop_right = int(W * 0.80)
crop_top = int(H * 0.05)
crop_bottom = int(H * 0.95)
cropped = img.crop((crop_left, crop_top, crop_right, crop_bottom))
print(f"Cropped: {cropped.size}")

# Slight blur for less distraction from text overlay
cropped = cropped.filter(ImageFilter.GaussianBlur(radius=2))

# Darken the image so Hero text overlay is readable
enhancer = ImageEnhance.Brightness(cropped)
darkened = enhancer.enhance(0.55)  # 55% brightness

# Color enhance - boost saturation slightly for vibrancy
sat_enhancer = ImageEnhance.Color(darkened)
final = sat_enhancer.enhance(1.15)

# Save as JPEG (smaller for web)
final.save(OUT_HERO, quality=85, optimize=True)
print(f"✓ Saved Hero bg: {OUT_HERO}")

# Also extract just Riana's face area as portrait alternative
# (center-top of image typically has the instructor)
portrait = img.crop((int(W * 0.30), int(H * 0.10), int(W * 0.70), int(H * 0.85)))
portrait.thumbnail((600, 800), Image.LANCZOS)
portrait.save("/home/z/my-project/public/brand/user-hero-portrait.jpg", quality=88, optimize=True)
print(f"✓ Saved portrait: /home/z/my-project/public/brand/user-hero-portrait.jpg")

#!/usr/bin/env python3
"""Extract color palette from uploaded image."""

import sys
from collections import Counter
from PIL import Image
import numpy as np

def rgb_to_hex(rgb):
    return "#{:02x}{:02x}{:02x}".format(*rgb)

def rgb_to_hsl(rgb):
    r, g, b = [x / 255.0 for x in rgb]
    mx = max(r, g, b)
    mn = min(r, g, b)
    diff = mx - mn
    l = (mx + mn) / 2
    if diff == 0:
        h = s = 0
    else:
        s = diff / (2 - mx - mn) if l > 0.5 else diff / (mx + mn)
        if mx == r:
            h = ((g - b) / diff) % 6
        elif mx == g:
            h = (b - r) / diff + 2
        else:
            h = (r - g) / diff + 4
        h *= 60
    return h, s, l

def categorize(h, s, l):
    if l < 0.1:
        return "black"
    if l > 0.92 and s < 0.1:
        return "white"
    if s < 0.12:
        if l < 0.3:
            return "dark-gray"
        if l < 0.6:
            return "gray"
        return "light-gray"
    if h < 15 or h >= 345:
        return "red"
    if h < 45:
        return "orange"
    if h < 65:
        return "yellow"
    if h < 165:
        return "green"
    if h < 200:
        return "cyan"
    if h < 260:
        return "blue"
    if h < 290:
        return "violet"
    if h < 345:
        return "magenta/pink"
    return "red"

def extract_palette(img_path, n_colors=8):
    img = Image.open(img_path).convert("RGB")
    print(f"Image size: {img.size}")
    img.thumbnail((400, 400), Image.LANCZOS)
    arr = np.array(img).reshape(-1, 3)

    from sklearn.cluster import KMeans
    km = KMeans(n_clusters=n_colors, random_state=42, n_init=10)
    km.fit(arr)
    centers = km.cluster_centers_.astype(int)
    counts = Counter(km.labels_)

    sorted_clusters = sorted(range(n_colors), key=lambda i: -counts[i])

    print(f"\n=== K-MEANS CLUSTERS (sorted by frequency) ===")
    palette = []
    for i in sorted_clusters:
        rgb = tuple(centers[i])
        h, s, l = rgb_to_hsl(rgb)
        cat = categorize(h, s, l)
        pct = counts[i] / len(arr) * 100
        palette.append((rgb, h, s, l, cat, pct))
        print(f"  {rgb_to_hex(rgb).upper()}  RGB{rgb}  HSL({h:.0f},{s*100:.0f}%,{l*100:.0f}%)  {cat:14s}  {pct:5.1f}%")

    print(f"\n=== COLOR CATEGORY DISTRIBUTION ===")
    cat_totals = {}
    for rgb, h, s, l, cat, pct in palette:
        cat_totals[cat] = cat_totals.get(cat, 0) + pct
    for cat, pct in sorted(cat_totals.items(), key=lambda x: -x[1]):
        print(f"  {cat:14s}  {pct:5.1f}%")

    print(f"\n=== IMAGE STATS ===")
    avg_rgb = arr.mean(axis=0).astype(int)
    h, s, l = rgb_to_hsl(avg_rgb)
    print(f"  Average:  {rgb_to_hex(avg_rgb).upper()}  HSL({h:.0f},{s*100:.0f}%,{l*100:.0f}%)")
    brightness = arr.mean()
    print(f"  Brightness: {brightness:.1f}/255 ({'BRIGHT' if brightness > 140 else 'MEDIUM' if brightness > 80 else 'DARK'})")

    print(f"\n=== SUGGESTED BRAND PALETTE ===")
    sorted_by_sat = sorted([p for p in palette if p[4] not in ['white','black','gray','dark-gray','light-gray']], key=lambda x: -x[2])
    sorted_by_light = sorted(palette, key=lambda x: -x[3])
    sorted_by_dark = sorted(palette, key=lambda x: x[3])

    primary = palette[0]
    accent = sorted_by_sat[0] if sorted_by_sat else primary
    dark = sorted_by_dark[0]
    light = sorted_by_light[0]

    print(f"  PRIMARY (most dominant):  {rgb_to_hex(primary[0]).upper()}  ({primary[4]})")
    print(f"  ACCENT (most saturated):  {rgb_to_hex(accent[0]).upper()}  ({accent[4]})")
    print(f"  DARK  (deepest):          {rgb_to_hex(dark[0]).upper()}  ({dark[4]})")
    print(f"  LIGHT (lightest):         {rgb_to_hex(light[0]).upper()}  ({light[4]})")

    print(f"\n=== TOP VIBRANT COLORS ===")
    vibrant = [p for p in palette if p[2] > 0.35 and p[3] > 0.25 and p[3] < 0.85]
    vibrant.sort(key=lambda x: -x[2])
    for v in vibrant[:6]:
        print(f"  {rgb_to_hex(v[0]).upper()}  HSL({v[1]:.0f},{v[2]*100:.0f}%,{v[3]*100:.0f}%)  {v[4]}")

if __name__ == "__main__":
    img_path = sys.argv[1] if len(sys.argv) > 1 else "/home/z/my-project/upload/Screenshot_33.jpg"
    n = int(sys.argv[2]) if len(sys.argv) > 2 else 8
    extract_palette(img_path, n)

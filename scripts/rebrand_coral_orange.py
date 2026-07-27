#!/usr/bin/env python3
"""
Re-brand dari palet magenta-orange-gold-purpleblack ke palet baru:
- Coral Red (FC7166) — ganti Magenta (DF2679)
- Vibrant Orange (FD8656) — ganti Orange lama (F17238)
- Golden Orange (F39F23) — ganti Gold (D4AF37)
- Pure Black (0E0F14) — ganti PurpleBlack (0B0710)
- Cream (FAEDE9) — sama dengan sebelumnya (FCF7F4)

Plus update semua accent colors yang relevan.
"""

import re
from pathlib import Path

REPLACEMENTS = [
    # === HEX CODES (case insensitive) ===
    # Primary: Magenta → Coral
    (r'#DF2679', '#FC7166'),
    (r'#df2679', '#FC7166'),
    (r'#F04E9A', '#FF8A80'),  # magenta-light → coral-light
    (r'#f04e9a', '#FF8A80'),
    (r'#B01A62', '#E54B40'),  # magenta-deep → coral-deep
    (r'#b01a62', '#E54B40'),

    # Secondary: Orange lama → Vibrant Orange
    (r'#F17238', '#FD8656'),
    (r'#f17238', '#FD8656'),
    (r'#FF8A52', '#FFA577'),  # orange-light lama → orange-light baru
    (r'#ff8a52', '#FFA577'),
    (r'#D85420', '#E56A1F'),  # orange-deep lama → orange-deep baru
    (r'#d85420', '#E56A1F'),

    # Accent: Gold (metallic) → Golden Orange (energetic)
    (r'#D4AF37', '#F39F23'),
    (r'#d4af37', '#F39F23'),
    (r'#E8C547', '#FFB938'),  # gold-light
    (r'#e8c547', '#FFB938'),
    (r'#A88A2A', '#C97D0E'),  # gold-deep
    (r'#a88a2a', '#C97D0E'),

    # Dark: PurpleBlack → Pure Black
    (r'#0B0710', '#0E0F14'),
    (r'#0b0710', '#0E0F14'),
    (r'#150F1E', '#181A22'),  # purple-dark → slate dark
    (r'#150f1e', '#181A22'),
    (r'#1F1428', '#1F2129'),  # secondary
    (r'#1f1428', '#1F2129'),
    (r'#2A1A38', '#252D3A'),  # accent dark
    (r'#2a1a38', '#252D3A'),
    (r'#2E1A2A', '#252D3A'),
    (r'#2e1a2a', '#252D3A'),

    # Plum variants (keep terracotta family)
    (r'#51343F', '#884D3E'),  # plum → terracotta
    (r'#51343f', '#884D3E'),
    (r'#7A4A5C', '#AD7868'),  # plum-light → rose-brown
    (r'#7a4a5c', '#AD7868'),

    # Cream (similar, sedikit perbedaan)
    (r'#F9EFEA', '#FAEDE9'),
    (r'#f9efea', '#FAEDE9'),

    # Coral accent (keep as peach)
    (r'#E8948F', '#C99789'),  # coral → dusty peach
    (r'#e8948f', '#C99789'),

    # === RGBA VALUES ===
    (r'rgba\(223, 38, 121', 'rgba(252, 113, 102'),  # magenta rgba → coral rgba
    (r'rgba\(241, 114, 56', 'rgba(253, 134, 86'),   # orange rgba → vibrant orange rgba
    (r'rgba\(212, 175, 55', 'rgba(243, 159, 35'),   # gold rgba → golden orange rgba
    (r'rgba\(11, 7, 16', 'rgba(14, 15, 20'),        # purpleblack rgba → black rgba
    (r'rgba\(21, 15, 30', 'rgba(24, 26, 34'),       # purple-dark rgba
    (r'rgba\(240, 78, 154', 'rgba(255, 138, 128'),  # magenta-light rgba
    (r'rgba\(224, 75, 64', 'rgba(229, 75, 64'),     # coral-deep (already correct format)
    (r'rgba\(81, 52, 63', 'rgba(136, 77, 62'),      # plum rgba → terracotta rgba
    (r'rgba\(249, 239, 234', 'rgba(250, 237, 233'), # cream rgba (similar)
]

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    original = content
    changes = 0
    for pattern, replacement in REPLACEMENTS:
        new_content, n = re.subn(pattern, replacement, content)
        if n > 0:
            changes += n
            content = new_content
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  ✓ {filepath}  ({changes} replacements)")
        return changes
    return 0

def main():
    src_dir = Path('/home/z/my-project/src')
    total = 0
    files_changed = 0
    for ext in ['*.tsx', '*.ts']:
        for filepath in src_dir.rglob(ext):
            n = process_file(str(filepath))
            if n > 0:
                total += n
                files_changed += 1
    print(f"\nDone. {files_changed} files changed, {total} replacements total.")

if __name__ == '__main__':
    main()

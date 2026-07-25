#!/usr/bin/env python3
"""
Re-map coral-rose palette to new vibrant magenta-orange-purpleblack palette.

Mapping:
- orange-* (coral salmon) -> pink-* (magenta vibrant) for primary actions
- stone-* (earthy dark)   -> purple-950/* (deep purple-black) for dark sections
- coral hex #F77258       -> magenta #DF2679
- flame hex #F86743       -> orange #F17238
- rose hex #E38B96        -> pink-400 #F04E9A
- terracotta #9A6458      -> plum #51343F
- charcoal #14161B        -> purpleblack #150F1E
- cream #FCF7F4           -> pure white #FFFFFF (we use #F9EFEA cream sections only)
"""

import os
import re
from pathlib import Path

REPLACEMENTS = [
    # === Tailwind class swaps ===
    # orange (was coral) -> pink (magenta vibrant)
    (r'\borange-50\b',  'pink-50'),
    (r'\borange-100\b', 'pink-100'),
    (r'\borange-200\b', 'pink-200'),
    (r'\borange-300\b', 'pink-300'),
    (r'\borange-400\b', 'pink-400'),
    (r'\borange-500\b', 'pink-500'),
    (r'\borange-600\b', 'pink-600'),
    (r'\borange-700\b', 'pink-700'),
    (r'\borange-800\b', 'pink-800'),
    (r'\borange-900\b', 'pink-900'),
    (r'\borange-950\b', 'pink-950'),

    # stone (was earthy dark) -> purple (purple-black dark)
    (r'\bstone-50\b',  'purple-50'),
    (r'\bstone-100\b', 'purple-100'),
    (r'\bstone-200\b', 'purple-200'),
    (r'\bstone-300\b', 'purple-300'),
    (r'\bstone-400\b', 'purple-400'),
    (r'\bstone-500\b', 'purple-500'),
    (r'\bstone-600\b', 'purple-600'),
    (r'\bstone-700\b', 'purple-700'),
    (r'\bstone-800\b', 'purple-800'),
    (r'\bstone-900\b', 'purple-900'),
    (r'\bstone-950\b', 'purple-950'),

    # === Hex code replacements ===
    (r'#F77258', '#DF2679'),  # coral -> magenta
    (r'#f77258', '#DF2679'),
    (r'#FB7A61', '#F04E9A'),  # coral-light -> magenta-light
    (r'#fb7a61', '#F04E9A'),
    (r'#F86743', '#F17238'),  # flame -> orange
    (r'#f86743', '#F17238'),
    (r'#E38B96', '#F04E9A'),  # dusty rose -> magenta-light
    (r'#e38b96', '#F04E9A'),
    (r'#C26873', '#B01A62'),  # rose-deep -> magenta-deep
    (r'#c26873', '#B01A62'),
    (r'#E7C7BE', '#FCE0EC'),  # blush -> light pink
    (r'#e7c7be', '#FCE0EC'),
    (r'#FCF7F4', '#FFFFFF'),  # cream -> pure white
    (r'#fcf7f4', '#FFFFFF'),
    (r'#9A6458', '#51343F'),  # terracotta -> plum
    (r'#9a6458', '#51343F'),
    (r'#563E3D', '#2E1A2A'),  # terra-deep -> dark plum
    (r'#563e3d', '#2E1A2A'),
    (r'#14161B', '#150F1E'),  # charcoal -> purpleblack
    (r'#14161b', '#150F1E'),
    (r'#393A4B', '#51343F'),  # slate-warm -> plum
    (r'#393a4b', '#51343F'),

    # Old rgba references
    (r'rgba\(247, 114, 88', 'rgba(223, 38, 121'),  # coral rgba -> magenta rgba
    (r'rgba\(248, 103, 67', 'rgba(241, 114, 56'),  # flame rgba -> orange rgba
    (r'rgba\(227, 139, 150', 'rgba(240, 78, 154'),  # rose rgba -> magenta-light rgba
    (r'rgba\(154, 100, 88', 'rgba(81, 52, 63'),    # terracotta rgba -> plum rgba
    (r'rgba\(20, 22, 27', 'rgba(21, 15, 30'),      # charcoal rgba -> purpleblack rgba
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

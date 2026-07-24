#!/usr/bin/env python3
"""
Re-map hardcoded Tailwind color classes to new coral-rose brand palette.

Mapping strategy:
- pink-*    -> orange-* (coral-adjacent) for backgrounds
- fuchsia-* -> orange-* (replace magenta with coral)
- violet-*  -> stone-* (replace purple with earthy dark)
- amber-400/500 -> orange-300/400 (warm earthy)
- Hex codes: #ec0a8b, #d6249e, #6b1f7a, #ff6a2c, #ffcb05 -> brand hex
"""

import os
import re
from pathlib import Path

# Mapping rules (applied in order)
REPLACEMENTS = [
    # Tailwind class swaps — pink -> orange (coral)
    (r'\bpink-50\b',  'orange-50'),
    (r'\bpink-100\b', 'orange-100'),
    (r'\bpink-200\b', 'orange-200'),
    (r'\bpink-300\b', 'orange-300'),
    (r'\bpink-400\b', 'orange-400'),
    (r'\bpink-500\b', 'orange-500'),
    (r'\bpink-600\b', 'orange-600'),
    (r'\bpink-700\b', 'orange-700'),
    (r'\bpink-800\b', 'orange-800'),
    (r'\bpink-900\b', 'orange-900'),
    (r'\bpink-950\b', 'orange-950'),

    # fuchsia -> orange (we drop magenta entirely)
    (r'\bfuchsia-50\b',  'orange-50'),
    (r'\bfuchsia-100\b', 'orange-100'),
    (r'\bfuchsia-200\b', 'orange-200'),
    (r'\bfuchsia-300\b', 'orange-300'),
    (r'\bfuchsia-400\b', 'orange-400'),
    (r'\bfuchsia-500\b', 'orange-500'),
    (r'\bfuchsia-600\b', 'orange-600'),
    (r'\bfuchsia-700\b', 'orange-700'),
    (r'\bfuchsia-800\b', 'orange-800'),
    (r'\bfuchsia-900\b', 'orange-900'),
    (r'\bfuchsia-950\b', 'orange-950'),

    # violet -> stone (earthy dark replacement)
    (r'\bviolet-50\b',  'stone-50'),
    (r'\bviolet-100\b', 'stone-100'),
    (r'\bviolet-200\b', 'stone-200'),
    (r'\bviolet-300\b', 'stone-300'),
    (r'\bviolet-400\b', 'stone-400'),
    (r'\bviolet-500\b', 'stone-500'),
    (r'\bviolet-600\b', 'stone-600'),
    (r'\bviolet-700\b', 'stone-700'),
    (r'\bviolet-800\b', 'stone-800'),
    (r'\bviolet-900\b', 'stone-900'),
    (r'\bviolet-950\b', 'stone-950'),

    # purple -> stone (earthy)
    (r'\bpurple-50\b',  'stone-50'),
    (r'\bpurple-100\b', 'stone-100'),
    (r'\bpurple-500\b', 'stone-500'),
    (r'\bpurple-600\b', 'stone-600'),
    (r'\bpurple-700\b', 'stone-700'),
    (r'\bpurple-800\b', 'stone-800'),
    (r'\bpurple-900\b', 'stone-900'),

    # amber -> orange (warmer, more coral)
    (r'\bamber-200\b', 'orange-200'),
    (r'\bamber-300\b', 'orange-300'),
    (r'\bamber-400\b', 'orange-400'),
    (r'\bamber-500\b', 'orange-500'),
    (r'\bamber-600\b', 'orange-600'),
    (r'\bamber-700\b', 'orange-700'),
    (r'\bamber-800\b', 'orange-800'),
    (r'\bamber-900\b', 'orange-900'),

    # Indigo (also forbidden)
    (r'\bindigo-50\b',  'stone-50'),
    (r'\bindigo-100\b', 'stone-100'),
    (r'\bindigo-500\b', 'stone-500'),
    (r'\bindigo-600\b', 'stone-600'),
    (r'\bindigo-700\b', 'stone-700'),

    # Hex code replacements (case insensitive)
    (r'#ec0a8b', '#F77258'),  # magenta -> coral
    (r'#EC0A8B', '#F77258'),
    (r'#d6249e', '#E38B96'),  # fuchsia -> dusty rose
    (r'#D6249E', '#E38B96'),
    (r'#b51d8a', '#C26873'),  # magenta-deep -> rose-deep
    (r'#B51D8A', '#C26873'),
    (r'#6b1f7a', '#9A6458'),  # violet -> terracotta
    (r'#6B1F7A', '#9A6458'),
    (r'#ff6a2c', '#F86743'),  # orange -> flame
    (r'#FF6A2C', '#F86743'),
    (r'#ffcb05', '#F77258'),  # yellow -> coral (drop yellow)
    (r'#FFCB05', '#F77258'),
    (r'#ff8a3d', '#F77258'),
    (r'#FF8A3D', '#F77258'),
    (r'#1a0822', '#14161B'),  # old ink -> new charcoal
    (r'#1A0822', '#14161B'),
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

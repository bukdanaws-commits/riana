#!/usr/bin/env python3
"""
Re-brand from light mode → DARK MODE primary + remove yellow/amber → gold.

Mapping:
- amber-*  -> gold-* equivalents (we don't have direct Tailwind, use stone for the gradient class)
  but better: replace amber class names with custom gold usage
  Since Tailwind doesn't have gold-* by default, map amber-* to amber-* (kept) but in CSS we re-themed
  Actually simplest: keep amber Tailwind classes — they map to dark gold palette via our @theme tokens? No, amber is fixed.

Better approach: replace amber-* with stone-* and override stone in CSS? No, stone is also fixed.

Simplest fix: Replace amber-400/500 → gold (custom class via inline style is needed)
For bulk text replacement, map amber-* → stone-* but adjust the visual in CSS.

Actually the cleanest: replace amber-* with a custom prefix that we control. Let's just replace
amber-XXX (Tailwind) → stone-XXX (Tailwind) but in the @theme we redefine stone-* to be gold shades.

OR: keep amber Tailwind class names but use lighter tones since amber-300/400 will now show
on dark bg and look fine. The user complaint was about pure yellow #FFCB05 — which we already removed.

Let me just:
1. Replace amber-300/400/500/600/700/800/900 with stone-* equivalents in classes
2. Update globals.css @theme to make stone-* map to gold shades

Actually simpler: keep amber-* classes but use them sparingly. They already look like gold on dark bg.
The complaint was "buang warna kuning" — remove pure yellow. Amber is between yellow and orange.
Let me just convert amber-300/400 (which lean yellow) → amber-500/600 (which lean orange-gold).

Mapping:
- amber-200 → amber-600 (darker, less yellow)
- amber-300 → amber-600
- amber-400 → amber-500
- amber-500 → amber-600
- amber-600 → amber-700
- amber-700 → amber-800
- amber-800 → amber-900
- amber-900 → stone-900
- amber-950 → stone-950

This shifts amber to darker/more orange tones, less yellow.

Also: bg-white → bg-purpleblack, bg-zinc-* → bg-purple-dark-*
- bg-white → keep as is (some white needed for cards)
- text-zinc-900 → text-cream
- text-zinc-700 → text-cream/80
- text-zinc-600 → text-cream/70
- text-zinc-500 → text-cream/60
- text-zinc-400 → text-cream/50
- bg-zinc-50 → bg-purple-dark
- bg-zinc-100 → bg-purpleblack

Let's do it.
"""

import re
from pathlib import Path

REPLACEMENTS = [
    # === Amber → darker amber (less yellow) ===
    (r'\bamber-200\b', 'amber-600'),
    (r'\bamber-300\b', 'amber-600'),
    (r'\bamber-400\b', 'amber-500'),
    (r'\bamber-500\b', 'amber-600'),
    (r'\bamber-600\b', 'amber-700'),
    (r'\bamber-700\b', 'amber-800'),
    (r'\bamber-800\b', 'amber-900'),
    (r'\bamber-900\b', 'stone-900'),
    (r'\bamber-950\b', 'stone-950'),

    # === zinc text → cream-based (since we're dark mode) ===
    # (already done in previous rebrand, but double-check)
    (r'\btext-zinc-900\b', 'text-cream'),
    (r'\btext-zinc-800\b', 'text-cream/90'),
    (r'\btext-zinc-700\b', 'text-cream/80'),
    (r'\btext-zinc-600\b', 'text-cream/70'),
    (r'\btext-zinc-500\b', 'text-cream/60'),
    (r'\btext-zinc-400\b', 'text-cream/50'),
    (r'\btext-zinc-300\b', 'text-cream/40'),

    # === bg-white → dark cards (with exceptions for elements that should stay white) ===
    # We'll be conservative — only change specific patterns
    (r'bg-white border-2', 'bg-purple-dark border-2'),
    (r'bg-white shadow', 'bg-purple-dark shadow'),
    (r'bg-white border', 'bg-purple-dark border'),

    # === bg-zinc-* → dark equivalents ===
    (r'\bbg-zinc-50\b', 'bg-purple-dark'),
    (r'\bbg-zinc-100\b', 'bg-purpleblack'),
    (r'\bbg-zinc-200\b', 'bg-purple-dark'),
    (r'\bbg-zinc-800\b', 'bg-purpleblack'),
    (r'\bbg-zinc-900\b', 'bg-purpleblack'),
    (r'\bbg-zinc-950\b', 'bg-purpleblack'),

    # === border-zinc-* → magenta-tinted borders ===
    (r'\bborder-zinc-100\b', 'border-magenta/15'),
    (r'\bborder-zinc-200\b', 'border-magenta/20'),
    (r'\bborder-zinc-300\b', 'border-magenta/25'),
    (r'\bborder-zinc-800\b', 'border-magenta/20'),

    # === yellow hex (in case any remaining) → gold ===
    (r'#FFCB05', '#D4AF37'),
    (r'#ffcb05', '#D4AF37'),
    (r'#F4D061', '#E8C547'),  # gold-light
    (r'#f4d061', '#E8C547'),
    (r'#FFD700', '#D4AF37'),
    (r'#ffd700', '#D4AF37'),
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

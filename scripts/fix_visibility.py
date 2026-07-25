#!/usr/bin/env python3
"""
FINAL DARK MODE FIX:
1. Replace all bg-white sections with dark backgrounds
2. Fix text colors that are too dark for dark bg (text-pink-800, text-zinc-900, etc.)
3. Make sure all text is visible (cream/light colored) on dark backgrounds
4. Replace pink-* Tailwind classes that don't show on dark bg with magenta equivalents
"""

import re
from pathlib import Path

REPLACEMENTS = [
    # === SECTION BACKGROUNDS: light → dark ===
    # Sections still using bg-white (problem!)
    (r'<section([^>]*?)\bbg-white\b', r'<section\1bg-brand-tech'),
    (r'<section([^>]*?)\bbg-zinc-50\b', r'<section\1bg-brand-tech'),
    (r'<section([^>]*?)\bbg-purple-dark\b', r'<section\1bg-brand-tech'),  # ensure consistent
    # Also fix any div with bg-white as section bg
    (r'className="relative py-4 lg:py-6 bg-white overflow-hidden"', 'className="relative py-4 lg:py-6 bg-brand-tech overflow-hidden"'),
    (r'className="relative py-4 lg:py-6 bg-zinc-50 overflow-hidden"', 'className="relative py-4 lg:py-6 bg-brand-tech overflow-hidden"'),

    # === CARD BACKGROUNDS in dark sections ===
    # white cards → dark cards
    (r'rounded-3xl bg-white border-2 border-zinc-100', 'rounded-3xl bg-purple-dark border border-magenta/20'),
    (r'rounded-2xl bg-white border-2 border-zinc-100', 'rounded-2xl bg-purple-dark border border-magenta/20'),
    (r'rounded-2xl bg-white border border-zinc-200', 'rounded-2xl bg-purple-dark border border-magenta/20'),
    (r'rounded-2xl bg-white shadow-lg', 'rounded-2xl bg-purple-dark shadow-soft border border-magenta/15'),
    (r'rounded-xl bg-white shadow-lg', 'rounded-xl bg-purple-dark shadow-soft border border-magenta/15'),
    (r'rounded-2xl bg-white/70 backdrop-blur-sm', 'rounded-2xl bg-purple-dark/70 backdrop-blur-sm border border-magenta/15'),
    (r'rounded-2xl bg-white/60 backdrop-blur-sm', 'rounded-2xl bg-purple-dark/60 backdrop-blur-sm border border-magenta/15'),

    # === TEXT COLOR FIXES (text that won't show on dark bg) ===
    # text-pink-800/700 (too dark) → text-magenta-light (visible)
    (r'\btext-pink-800\b', 'text-magenta-light'),
    (r'\btext-pink-700\b', 'text-magenta-light'),
    (r'\btext-pink-600\b', 'text-magenta-light'),
    (r'\btext-pink-500\b', 'text-magenta-light'),
    (r'\btext-pink-400\b', 'text-magenta-light'),
    (r'\btext-pink-300\b', 'text-magenta-light/80'),
    (r'\btext-pink-200\b', 'text-magenta-light/70'),
    (r'\btext-pink-100\b', 'text-magenta-light/60'),

    # text-amber-* (too dark, looks brown on dark) → text-gold-light
    (r'\btext-amber-800\b', 'text-gold-light'),
    (r'\btext-amber-700\b', 'text-gold-light'),
    (r'\btext-amber-600\b', 'text-gold-light'),
    (r'\btext-amber-500\b', 'text-gold-light'),
    (r'\btext-amber-400\b', 'text-gold-light'),
    (r'\btext-amber-300\b', 'text-gold-light/80'),
    (r'\btext-amber-950\b', 'text-purpleblack'),

    # text-rose-* → text-magenta-light
    (r'\btext-rose-700\b', 'text-magenta-light'),
    (r'\btext-rose-600\b', 'text-magenta-light'),
    (r'\btext-rose-500\b', 'text-magenta-light'),
    (r'\btext-rose-400\b', 'text-magenta-light'),

    # text-orange-700/600 (too dark on dark bg)
    (r'\btext-orange-700\b', 'text-orange-light'),
    (r'\btext-orange-600\b', 'text-orange-light'),

    # text-zinc-* (fallback if any)
    (r'\btext-zinc-900\b', 'text-cream'),
    (r'\btext-zinc-800\b', 'text-cream/90'),
    (r'\btext-zinc-700\b', 'text-cream/80'),
    (r'\btext-zinc-600\b', 'text-cream/70'),
    (r'\btext-zinc-500\b', 'text-cream/60'),
    (r'\btext-zinc-400\b', 'text-cream/50'),
    (r'\btext-zinc-300\b', 'text-cream/40'),
    (r'\btext-zinc-100\b', 'text-cream/30'),

    # fill colors
    (r'\bfill-pink-500\b', 'fill-magenta'),
    (r'\bfill-pink-600\b', 'fill-magenta'),
    (r'\bfill-amber-500\b', 'fill-gold'),
    (r'\bfill-amber-400\b', 'fill-gold-light'),

    # === BACKGROUND TINTS (light → dark) ===
    (r'\bbg-pink-50\b', 'bg-magenta/10'),
    (r'\bbg-pink-100\b', 'bg-magenta/15'),
    (r'\bbg-pink-200\b', 'bg-magenta/20'),
    (r'\bbg-amber-100\b', 'bg-gold/15'),
    (r'\bbg-amber-200\b', 'bg-gold/20'),
    (r'\bbg-amber-400\b', 'bg-gold'),
    (r'\bbg-orange-100\b', 'bg-orange-brand/15'),
    (r'\bbg-orange-50\b', 'bg-orange-brand/10'),
    (r'\bbg-violet-100\b', 'bg-plum/20'),
    (r'\bbg-violet-50\b', 'bg-plum/10'),
    (r'\bbg-stone-50\b', 'bg-purple-dark'),
    (r'\bbg-stone-100\b', 'bg-purple-dark'),

    # === BORDER TINTS (light → dark) ===
    (r'\bborder-pink-100\b', 'border-magenta/20'),
    (r'\bborder-pink-200\b', 'border-magenta/25'),
    (r'\bborder-pink-300\b', 'border-magenta/30'),
    (r'\bborder-amber-200\b', 'border-gold/30'),
    (r'\bborder-amber-300\b', 'border-gold/35'),
    (r'\bborder-orange-200\b', 'border-orange-brand/25'),

    # === PILL BADGES that use light bg + dark text ===
    # Active state in FAQ/Countdown etc
    (r'bg-white text-cream/80 border-magenta/20 hover:border-magenta/30', 'bg-magenta text-white border-magenta hover:bg-magenta-deep'),
    (r'bg-white text-cream/80', 'bg-magenta text-white'),
    (r'bg-white text-zinc-700', 'bg-magenta text-white'),
    (r'bg-white text-pink-600', 'bg-magenta text-white'),

    # FinalCTA: white bg button → keep but make it cream-friendly
    (r'bg-white text-pink-600 hover:bg-white/90', 'bg-cream text-magenta hover:bg-cream/90'),

    # === HOVER TINTS ===
    (r'hover:bg-pink-50\b', 'hover:bg-magenta/10'),
    (r'hover:bg-pink-100\b', 'hover:bg-magenta/15'),
    (r'hover:bg-amber-50\b', 'hover:bg-gold/10'),
    (r'hover:bg-violet-50\b', 'hover:bg-plum/10'),

    # Specific ZumbaStep gradient section
    (r'bg-gradient-to-br from-pink-50 via-white to-orange-50', 'bg-brand-tech'),
    (r'bg-gradient-to-br from-pink-50 via-purple-dark to-purpleblack', 'bg-brand-tech'),
    (r'bg-gradient-to-br from-pink-50 via-purple-dark', 'bg-brand-tech'),
    (r'from-pink-50 to-orange-50', 'from-purple-dark to-purpleblack'),
    (r'from-amber-50 to-orange-50', 'from-purple-dark to-purpleblack'),

    # WhyJoin card text-zinc-100 → text-cream/30 (for the big faded number)
    # Already handled above

    # Pink icon tint
    (r'text-pink-500 fill-pink-500', 'text-magenta fill-magenta'),
    (r'text-amber-500 fill-amber-500', 'text-gold fill-gold'),

    # WhyJoin text-zinc-100 (faded big number) → text-cream/15 (still subtle but visible)
    (r'text-5xl font-black text-zinc-100 group-hover:text-white/30', 'text-5xl font-black text-cream/15 group-hover:text-cream/30'),
    (r'text-5xl font-black text-pink-100', 'text-5xl font-black text-magenta/20'),

    # Pink gradient backgrounds (from-pink-500 to-pink-600 etc — already handled)
    (r'bg-gradient-to-br from-pink-500 to-pink-600', 'bg-gradient-to-br from-magenta to-magenta-deep'),
    (r'bg-pink-400 text-stone-950', 'bg-gold text-purpleblack'),

    # amber-400 used as accent → gold
    (r'\bbg-amber-400\b', 'bg-gold'),
    (r'\bbg-amber-500\b', 'bg-gold'),

    # StatusBadge in CitySchedule
    (r'bg-amber-100 text-pink-700', 'bg-gold/20 text-gold-light'),
    (r'bg-green-100 text-green-700', 'bg-green-500/20 text-green-400'),
    (r'bg-red-100 text-red-700', 'bg-red-500/20 text-red-400'),
    (r'bg-pink-100 text-pink-700', 'bg-magenta/20 text-magenta-light'),

    # Filter pills in CitySchedule (active/inactive states)
    (r'text-zinc-700 bg-white border-zinc-200 hover:border-zinc-300', 'text-cream/80 bg-purple-dark border-magenta/20 hover:border-magenta/40'),
    (r'text-zinc-700 bg-white border-magenta/20 hover:border-magenta/30', 'text-cream/80 bg-purple-dark border-magenta/20 hover:border-magenta/40'),

    # Count badge in pills
    (r'bg-zinc-100', 'bg-purpleblack'),
    (r'bg-white/20', 'bg-purpleblack/40'),

    # === SPECIAL: WHITE BACKGROUNDS IN CARDS (cards that need fix) ===
    # FAQ accordion trigger area, Partner tier cards etc
    (r'rounded-2xl bg-white/60 backdrop-blur-sm border border-white', 'rounded-2xl bg-purple-dark/60 backdrop-blur-sm border border-magenta/15'),
    (r'rounded-xl bg-white/15 backdrop-blur-md text-white', 'rounded-xl bg-purple-dark/40 backdrop-blur-md text-cream'),

    # Accordion icon container
    (r'rounded-lg bg-pink-100 group-data-\[state=open\]:bg-brand-gradient', 'rounded-lg bg-magenta/20 group-data-[state=open]:bg-brand-gradient'),

    # WhyJoin icon container
    (r'rounded-2xl bg-brand-gradient', 'rounded-2xl bg-brand-gradient'),  # already good

    # Testimonials bg
    (r'bg-gradient-to-br from-pink-50 via-purple-dark to-amber-50', 'bg-brand-tech'),
    (r'from-pink-50 via-purple-dark to-amber-50', 'from-purple-dark via-purpleblack to-purple-dark'),
    (r'from-pink-50 via-purple-dark', 'from-purple-dark'),

    # Avatar ring in Testimonials
    (r'border-purpleblack', 'border-purpleblack'),  # already good

    # FinalCTA CTA button (white bg with pink text)
    (r'bg-white text-pink-600 hover:bg-white/90', 'bg-cream text-magenta hover:bg-cream/90'),

    # WhyJoin card hover (from-pink-50 to-orange-50 should be dark)
    (r'rounded-2xl bg-white border-2 border-zinc-100 hover:border-transparent hover:shadow-2xl', 'rounded-2xl bg-purple-dark border border-magenta/20 hover:border-magenta hover:shadow-glow-pink'),
    (r'rounded-2xl bg-white border-2 border-magenta/20 hover:border-magenta hover:shadow-glow-pink', 'rounded-2xl bg-purple-dark border border-magenta/25 hover:border-magenta hover:shadow-glow-pink'),

    # Gallery cards (white text on dark already)
    # Partners tier card backgrounds
    (r'bg-white/5 backdrop-blur-md border border-white/10', 'bg-purple-dark/40 backdrop-blur-md border border-magenta/15'),

    # Special borders
    (r'border-purple-950', 'border-purpleblack'),

    # Text-pink-100 etc (very light)
    (r'\btext-purple-950\b', 'text-cream'),

    # FinalCTA secondary button (was white/5 backdrop-blur)
    (r'bg-white/5 backdrop-blur-md border-2 border-white/30 text-white', 'glass-card border-tech text-cream'),

    # CitySchedule city card hover bg
    (r'hover:bg-pink-50/40', 'hover:bg-magenta/10'),

    # Status badges text
    (r'text-stone-950', 'text-purpleblack'),

    # Removing remaining text-zinc references
    (r'\btext-stone-900\b', 'text-purpleblack'),
    (r'\btext-stone-800\b', 'text-cream'),
    (r'\btext-stone-700\b', 'text-cream/80'),
    (r'\btext-stone-600\b', 'text-cream/70'),
    (r'\btext-stone-500\b', 'text-cream/60'),

    # bg-stone-* (light gray) → dark
    (r'\bbg-stone-100\b', 'bg-purple-dark'),
    (r'\bbg-stone-200\b', 'bg-purple-dark'),
    (r'\bbg-stone-300\b', 'bg-purple-dark'),
    (r'\bbg-stone-400\b', 'bg-plum'),

    # === MIXED: gradient sections that should be dark ===
    (r'bg-gradient-to-br from-purple-dark via-purple-dark to-purpleblack', 'bg-brand-tech'),

    # === SPECIAL FIX: Hero stat icon container (was orange-* in light mode) ===
    # Already fixed via pink → magenta

    # Count badge in CitySchedule map legend (was bg-white/70)
    (r'bg-white/70 backdrop-blur-sm', 'bg-purpleblack/70 backdrop-blur-sm'),

    # WhyJoin big number text-zinc-100 → text-cream/15
    (r'text-5xl font-black text-zinc-100', 'text-5xl font-black text-cream/15'),

    # WhyJoin hover text colors (zinc-700 → cream)
    (r'group-hover:text-white/30', 'group-hover:text-cream/30'),

    # Accordion panel content text
    (r'text-zinc-600 leading-relaxed', 'text-cream/70 leading-relaxed'),
    (r'text-sm text-zinc-600 leading-relaxed', 'text-sm text-cream/70 leading-relaxed'),

    # FAQ accordion answer text
    (r'text-sm text-zinc-600', 'text-sm text-cream/70'),

    # === MAGENTA TAILWIND DEFAULT (pink-600, etc) → already mapped ===

    # === ZumbaStep text colors ===
    (r'text-zinc-900 group-hover:text-white', 'text-cream group-hover:text-white'),
    (r'text-zinc-600 group-hover:text-white/90', 'text-cream/70 group-hover:text-cream/90'),

    # AboutRoadshow text-zinc-900
    (r'text-zinc-900 mb-4', 'text-cream mb-4'),
    (r'text-zinc-600 leading-relaxed', 'text-cream/70 leading-relaxed'),
    (r'text-zinc-900 mb-2', 'text-cream mb-2'),

    # MeetRiana text
    (r'text-zinc-900 mb-4', 'text-cream mb-4'),

    # Partners gradient section
    (r'rounded-3xl bg-gradient-to-br from-zinc-900 via-purple-950 to-pink-950', 'rounded-3xl bg-gradient-to-br from-purpleblack via-purple-dark to-plum'),
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

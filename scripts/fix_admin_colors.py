#!/usr/bin/env python3
"""
Final dark mode fix untuk admin views:
- Replace all text-cream → text-white
- Replace all bg-purple-dark → bg-[#181A22]
- Replace all bg-purpleblack → bg-[#0E0F14]
- Replace all border-magenta → border-[#FC7166]
- Replace all text-magenta-light → text-[#FF8A80]
- Replace all text-gold-light → text-[#FFB938]
- Replace all text-cream/XX → text-white/XX
- Add variant to AdminCard calls
"""

import re
from pathlib import Path

REPLACEMENTS = [
    # Text colors — cream → white
    (r'\btext-cream/(\d+)\b', r'text-white/\1'),
    (r'\btext-cream\b', 'text-white'),
    (r'\bplaceholder:text-cream/(\d+)\b', r'placeholder:text-white/\1'),
    (r'\bplaceholder:text-cream\b', 'placeholder:text-white'),

    # Background — purple variants → pure dark
    (r'\bbg-purple-dark/(\d+)\b', r'bg-[#181A22]/\1'),
    (r'\bbg-purple-dark\b', 'bg-[#181A22]'),
    (r'\bbg-purpleblack/(\d+)\b', r'bg-[#0E0F14]/\1'),
    (r'\bbg-purpleblack\b', 'bg-[#0E0F14]'),

    # Border — magenta → coral hex
    (r'\bborder-magenta/(\d+)\b', r'border-[#FC7166]/\1'),
    (r'\bborder-magenta\b', 'border-[#FC7166]'),

    # Text accent colors
    (r'\btext-magenta-light\b', 'text-[#FF8A80]'),
    (r'\btext-magenta\b', 'text-[#FC7166]'),
    (r'\btext-gold-light\b', 'text-[#FFB938]'),
    (r'\btext-gold\b', 'text-[#F39F23]'),
    (r'\btext-orange-light\b', 'text-[#FFA577]'),
    (r'\btext-orange-brand\b', 'text-[#FD8656]'),

    # Hover text/bg
    (r'\bhover:text-magenta-light\b', 'hover:text-[#FF8A80]'),
    (r'\bhover:text-magenta\b', 'hover:text-[#FC7166]'),
    (r'\bhover:bg-magenta/(\d+)\b', r'hover:bg-[#FC7166]/\1'),
    (r'\bhover:bg-magenta\b', 'hover:bg-[#FC7166]'),
    (r'\bhover:text-gold-light\b', 'hover:text-[#FFB938]'),
    (r'\bhover:text-gold\b', 'hover:text-[#F39F23]'),
    (r'\bhover:bg-gold/(\d+)\b', r'hover:bg-[#F39F23]/\1'),
    (r'\bhover:bg-gold\b', 'hover:bg-[#F39F23]'),

    # Solid bg
    (r'\bbg-magenta/(\d+)\b', r'bg-[#FC7166]/\1'),
    (r'\bbg-magenta\b', 'bg-[#FC7166]'),
    (r'\bbg-gold/(\d+)\b', r'bg-[#F39F23]/\1'),
    (r'\bbg-gold\b', 'bg-[#F39F23]'),
    (r'\bbg-orange-brand/(\d+)\b', r'bg-[#FD8656]/\1'),
    (r'\bbg-orange-brand\b', 'bg-[#FD8656]'),

    # Shadow
    (r'\bshadow-glow-pink\b', 'shadow-[0_8px_24px_-8px_rgba(252,113,102,0.6)]'),
    (r'\bshadow-glow-gold\b', 'shadow-[0_8px_24px_-8px_rgba(243,159,35,0.6)]'),
    (r'\bshadow-glow-orange\b', 'shadow-[0_8px_24px_-8px_rgba(253,134,86,0.6)]'),

    # Fill
    (r'\bfill-magenta\b', 'fill-[#FC7166]'),
    (r'\bfill-gold\b', 'fill-[#F39F23]'),
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
    admin_dir = Path('/home/z/my-project/src/components/admin')
    total = 0
    files_changed = 0
    for ext in ['*.tsx', '*.ts']:
        for filepath in admin_dir.rglob(ext):
            n = process_file(str(filepath))
            if n > 0:
                total += n
                files_changed += 1
    print(f"\nDone. {files_changed} files changed, {total} replacements total.")

if __name__ == '__main__':
    main()

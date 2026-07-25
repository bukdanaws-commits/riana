#!/usr/bin/env python3
"""
Final dark mode polish: convert remaining light section classes to dark
"""

import re
from pathlib import Path

REPLACEMENTS = [
    # Section backgrounds
    (r'bg-gradient-to-br from-pink-50 via-white to-orange-50', 'bg-brand-tech'),
    (r'bg-gradient-to-br from-pink-50 via-purple-dark to-purpleblack', 'bg-brand-tech'),
    (r'bg-gradient-to-br from-pink-50 via-purple-dark', 'bg-brand-tech'),
    (r'bg-zinc-50', 'bg-purpleblack'),
    (r'from-zinc-50', 'from-purple-dark'),
    (r'via-zinc-50', 'via-purple-dark'),
    (r'to-zinc-50', 'to-purpleblack'),

    # Section text-zinc-* that may have slipped through
    (r'text-zinc-900', 'text-cream'),
    (r'text-zinc-700', 'text-cream/80'),
    (r'text-zinc-600', 'text-cream/70'),
    (r'text-zinc-500', 'text-cream/60'),

    # Card backgrounds in light sections
    (r'rounded-3xl bg-white border-2 border-pink-100', 'rounded-3xl bg-purple-dark border border-magenta/20'),
    (r'rounded-3xl bg-white border-2 border-zinc-100', 'rounded-3xl bg-purple-dark border border-magenta/20'),
    (r'rounded-2xl bg-white border-2 border-zinc-100', 'rounded-2xl bg-purple-dark border border-magenta/20'),
    (r'rounded-2xl bg-white border border-zinc-200', 'rounded-2xl bg-purple-dark border border-magenta/20'),
    (r'rounded-2xl bg-white shadow', 'rounded-2xl bg-purple-dark shadow'),
    (r'rounded-xl bg-white shadow', 'rounded-xl bg-purple-dark shadow'),

    # WhyJoin hover backgrounds
    (r'from-pink-50 to-orange-50', 'from-purple-dark to-purpleblack'),

    # Specific bg gradients
    (r'bg-gradient-to-br from-pink-50 via-white to-purpleblack', 'bg-brand-tech'),
    (r'bg-gradient-to-b from-white to-pink-50/50', 'bg-brand-tech'),

    # Borders
    (r'border-pink-100', 'border-magenta/20'),
    (r'border-pink-200', 'border-magenta/25'),
    (r'border-pink-300', 'border-magenta/30'),

    # Hover backgrounds
    (r'hover:bg-pink-50', 'hover:bg-magenta/10'),
    (r'hover:bg-pink-50/40', 'hover:bg-magenta/10'),
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

#!/usr/bin/env python3
"""
Reduce all section vertical padding from py-16/py-24 to py-4 (16px = 1rem).
User wants section spacing to be very tight (1rem).
"""

import re
from pathlib import Path

# Patterns: replace large padding with 1rem (py-4 = 16px)
REPLACEMENTS = [
    # Section main padding: py-16 lg:py-24 → py-4 lg:py-6 (still allow slight lg increase)
    (r'\bpy-16 lg:py-24\b', 'py-4 lg:py-6'),
    (r'\bpy-16 lg:py-20\b', 'py-4 lg:py-6'),
    (r'\bpy-20 lg:py-24\b', 'py-4 lg:py-6'),
    (r'\bpy-16\b', 'py-4'),
    (r'\bpy-20\b', 'py-4'),
    (r'\bpy-24\b', 'py-6'),

    # margin spacing
    (r'\bmb-12\b', 'mb-4'),
    (r'\bmb-10\b', 'mb-4'),
    (r'\bmb-8\b', 'mb-3'),
    (r'\bmb-6\b', 'mb-3'),
    (r'\bmb-16\b', 'mb-4'),

    # Space-y in content
    (r'\bspace-y-6\b', 'space-y-3'),
    (r'\bspace-y-8\b', 'space-y-4'),
    (r'\bspace-y-10\b', 'space-y-4'),

    # Gap
    (r'\bgap-10\b', 'gap-4'),
    (r'\bgap-12\b', 'gap-4'),
    (r'\bgap-8\b', 'gap-4'),
    (r'\bgap-6\b', 'gap-3'),
    (r'\bgap-14\b', 'gap-4'),

    # mt for sections
    (r'\bmt-12\b', 'mt-3'),
    (r'\bmt-10\b', 'mt-3'),
    (r'\bmt-8\b', 'mt-2'),

    # padding bottom inside sections
    (r'\bpb-16\b', 'pb-4'),
    (r'\bpb-24\b', 'pb-4'),
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

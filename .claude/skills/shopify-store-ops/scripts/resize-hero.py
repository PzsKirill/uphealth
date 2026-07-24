#!/usr/bin/env python
"""Resize/compress an image for the web with Pillow.

Usage:  python resize-hero.py <src> <dst.jpg> [max_width]
Example: python resize-hero.py "bluebanka.png" assets/hero-creatine.jpg 2400

Why Pillow and not `convert`: on Windows `convert` is the disk-format tool,
not ImageMagick. Pillow gives predictable JPEGs (~50-110KB for a hero banner).
"""
import sys, os
from PIL import Image

if len(sys.argv) < 3:
    print(__doc__); sys.exit(1)

src, dst = sys.argv[1], sys.argv[2]
max_w = int(sys.argv[3]) if len(sys.argv) > 3 else 2400

im = Image.open(src).convert("RGB")
if im.width > max_w:
    im = im.resize((max_w, round(im.height * max_w / im.width)), Image.LANCZOS)

os.makedirs(os.path.dirname(dst) or ".", exist_ok=True)
im.save(dst, "JPEG", quality=88, optimize=True, progressive=True)
print(f"{dst}: {im.size[0]}x{im.size[1]}  {os.path.getsize(dst)//1024} KB  "
      f"(aspect {im.width/im.height:.2f})")

# /// script
# requires-python = ">=3.11"
# dependencies = ["pillow>=11"]
# ///
"""v1.H — automatic art check before visual review.

Flags the failure modes seen in batch 3 (2026-11-06):
  band  — a flat, uniform strip along the top edge (the model drew a border /
          colour band despite "no borders"). The text sits near the top, so a
          band shows behind it.
  busy  — too much detail in the text zone (window bars, branches): the
          title is set centred at y≈155–270 of a 1080 square (top placement)
          or just above the signature (bottom placement).
  glare — a bright spot (moon, lamp) in a dark text zone: the light text
          collides with it.

Usage:
  uv run scripts/check_art.py <image> [<image> …]   # prints ✓ / ✗ per file
  (also imported by scripts/gen_batch.py)
"""

import sys
from pathlib import Path

from PIL import Image, ImageFilter, ImageStat

SIZE = 540                      # analyse at half of 1080 (fast, same geometry)
ZONES = {"top": (45, 50, 495, 175), "bottom": (45, 360, 495, 470)}  # x0, y0, x1, y1 at SIZE
# Calibrated 2026-11-06: accepted arts max 7.3 (misty-forest); batch-3 rejects 11.1 (rain-mugs bars), 14.2 (swing branch).
BUSY_MAX = 9.0
# Glare: zone median below DARK and ≥ GLARE_PX pixels above BRIGHT (stars are single, dimmer pixels).
DARK, BRIGHT, GLARE_PX = 100, 215, 25
BAND_MIN_ROWS = 6               # ≥ ~1% of height
BAND_ROW_STD = 3.0              # a band row is (almost) one colour across its width
BAND_EDGE = 18.0                # brightness jump where the band ends


def square(im: Image.Image) -> Image.Image:
    side = min(im.size)
    left, top = (im.width - side) // 2, (im.height - side) // 2
    return im.crop((left, top, left + side, top + side)).resize((SIZE, SIZE), Image.LANCZOS)


def band_rows(gray: Image.Image) -> int:
    """Rows from the top that form a flat band ending in a sharp edge; 0 if none."""
    rows = 0
    for y in range(SIZE // 5):
        if ImageStat.Stat(gray.crop((0, y, SIZE, y + 1))).stddev[0] > BAND_ROW_STD:
            break
        rows += 1
    if rows < BAND_MIN_ROWS or rows >= SIZE // 5:
        return 0
    above = ImageStat.Stat(gray.crop((0, rows - 3, SIZE, rows))).mean[0]
    below = ImageStat.Stat(gray.crop((0, rows + 2, SIZE, rows + 5))).mean[0]
    return rows if abs(above - below) >= BAND_EDGE else 0


def busyness(gray: Image.Image, zone: tuple[int, int, int, int]) -> float:
    edges = gray.filter(ImageFilter.GaussianBlur(1)).filter(ImageFilter.FIND_EDGES)
    return ImageStat.Stat(edges.crop(zone)).mean[0]


def glare(gray: Image.Image, zone: tuple[int, int, int, int]) -> int:
    crop = gray.crop(zone)
    if ImageStat.Stat(crop).median[0] >= DARK:
        return 0
    return sum(crop.histogram()[BRIGHT:])


def check(path: Path, placement: str | None = None) -> tuple[bool, str]:
    gray = square(Image.open(path).convert("RGB")).convert("L")
    zone = ZONES["bottom" if placement == "bottom" else "top"]
    problems = []
    if rows := band_rows(gray):
        problems.append(f"flat band at top ({rows * 1080 // SIZE}px)")
    if (b := busyness(gray, zone)) > BUSY_MAX:
        problems.append(f"busy text zone ({b:.1f} > {BUSY_MAX})")
    if (g := glare(gray, zone)) >= GLARE_PX:
        problems.append(f"bright spot in text zone ({g}px)")
    return (not problems, "; ".join(problems) or f"ok (busy {b:.1f})")


def main() -> None:
    if len(sys.argv) < 2:
        sys.exit("usage: uv run scripts/check_art.py <image> [<image> …]")
    bad = 0
    for arg in sys.argv[1:]:
        ok, why = check(Path(arg))
        bad += not ok
        print(f"{'✓' if ok else '✗'} {Path(arg).name}  {why}", flush=True)
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()

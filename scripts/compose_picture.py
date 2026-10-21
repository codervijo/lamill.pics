# /// script
# requires-python = ">=3.11"
# dependencies = ["pillow>=11"]
# ///
"""v1.H — typeset real Unicode text over textless art.

Mirrors the layout of src/lib/picture-export.ts (the in-browser download), so a
baked gallery WebP and a user's personalized PNG look the same.

Usage:
  uv run scripts/compose_picture.py <spec.json>

spec.json is a list of entries:
  {"art_src": "path/to/generated.png", "art_key": "lion",
   "category": "dp/attitude", "slug": "attitude-dp-lion-born-to-stand-out",
   "text": "Born to\\nstand out.", "subtitle": null,
   "tone": "light", "placement": null}

Writes src/assets/<art_key>.jpg (textless art, 1080², for the live text overlay)
and public/images/<category>/<slug>.webp (baked, indexable).
"""

import json
import math
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
FONTS = ROOT / "scripts" / "fonts"
SIZE = 1080
MAX_WIDTH = 900


def oklch_to_rgba(l: float, c: float, h: float, alpha: float = 1.0) -> tuple[int, int, int, int]:
    a, b = c * math.cos(math.radians(h)), c * math.sin(math.radians(h))
    l_, m_, s_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3, (l - 0.1055613458 * a - 0.0638541728 * b) ** 3, (l - 0.0894841775 * a - 1.2914855480 * b) ** 3
    rgb = (
        4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
        -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
        -0.0041960863 * l_ - 0.7034186147 * m_ + 1.7076147010 * s_,
    )
    def gamma(x: float) -> int:
        x = min(max(x, 0.0), 1.0)
        return round(255 * (12.92 * x if x <= 0.0031308 else 1.055 * x ** (1 / 2.4) - 0.055))
    return (*(gamma(x) for x in rgb), round(255 * alpha))


# Tokens from src/styles/global.css
PICTURE_DARK = oklch_to_rgba(0.28, 0.06, 160)
PICTURE_LIGHT = oklch_to_rgba(0.99, 0.006, 90)
PICTURE_SHADOW = oklch_to_rgba(0.2, 0.035, 160, 0.6)


def script_of(text: str) -> str:
    for ch in text:
        cp = ord(ch)
        if 0x0D00 <= cp <= 0x0D7F: return "ml"
        if 0x0600 <= cp <= 0x06FF or 0x0750 <= cp <= 0x077F: return "ar"
        if 0x0900 <= cp <= 0x097F: return "hi"
    return "latin"


def font(text: str, size: int, role: str) -> ImageFont.FreeTypeFont:
    name = {"ml": "NotoSansMalayalam", "ar": "NotoSansArabic", "hi": "NotoSansDevanagari"}.get(
        script_of(text), "Lora" if role == "title" else "DMSans")
    f = ImageFont.truetype(str(FONTS / f"{name}.ttf"), size, layout_engine=ImageFont.Layout.RAQM)
    weight = 500 if role == "title" else 400
    f.set_variation_by_axes([weight if ax["name"] in (b"Weight", "Weight") else ax["default"] for ax in f.get_variation_axes()])
    return f


def direction(text: str) -> str:
    return "rtl" if script_of(text) == "ar" else "ltr"


def wrap(text: str, f: ImageFont.FreeTypeFont) -> list[str]:
    lines: list[str] = []
    for paragraph in text.split("\n"):
        line = ""
        for word in paragraph.split():
            nxt = f"{line} {word}" if line else word
            if f.getlength(nxt, direction=direction(nxt)) > MAX_WIDTH and line:
                lines.append(line); line = word
            else:
                line = nxt
        if line: lines.append(line)
    return lines


def compose(entry: dict) -> None:
    art = Image.open(ROOT / entry["art_src"] if not Path(entry["art_src"]).is_absolute() else entry["art_src"]).convert("RGB")
    side = min(art.size)
    art = art.crop(((art.width - side) // 2, (art.height - side) // 2, (art.width + side) // 2, (art.height + side) // 2)).resize((SIZE, SIZE), Image.LANCZOS)

    text, subtitle = entry["text"], entry.get("subtitle")
    size = 82
    while size > 18:
        f = font(text, size, "title"); lines = wrap(text, f)
        if len(lines) <= 4 and all(f.getlength(l, direction=direction(l)) <= MAX_WIDTH for l in lines): break
        size -= 2
    line_height = size * 1.4
    base = 910 - len(lines) * line_height if entry.get("placement") == "bottom" else 155
    light = entry["tone"] == "light"
    fill = PICTURE_LIGHT if light else PICTURE_DARK

    layer = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    for i, line in enumerate(lines):
        d.text((540, base + i * line_height), line, font=f, fill=fill, anchor="mm", direction=direction(line))
    if subtitle:
        sf = font(subtitle, 30, "subtitle")
        d.text((540, base + len(lines) * line_height + 12), subtitle, font=sf, fill=fill, anchor="mm", direction=direction(subtitle))
    sig = font("LaMill Pics", 24, "subtitle")
    d.text((540, SIZE - SIZE * 0.035 - 12), "LaMill Pics", font=sig, fill=(*fill[:3], round(255 * 0.75)), anchor="mm")

    out = art.convert("RGBA")
    if light:
        shadow = Image.new("RGBA", (SIZE, SIZE), PICTURE_SHADOW)
        shadow.putalpha(layer.getchannel("A").point(lambda a: a * PICTURE_SHADOW[3] // 255).filter(ImageFilter.GaussianBlur(9)))
        out = Image.alpha_composite(out, shadow)
    out = Image.alpha_composite(out, layer).convert("RGB")

    art_out = ROOT / "src" / "assets" / f"{entry['art_key']}.jpg"
    art.save(art_out, "JPEG", quality=86, optimize=True)
    pic_out = ROOT / "public" / "images" / entry["category"] / f"{entry['slug']}.webp"
    pic_out.parent.mkdir(parents=True, exist_ok=True)
    out.save(pic_out, "WEBP", quality=82, method=6)
    print(f"✓ {pic_out.relative_to(ROOT)}  (art → {art_out.relative_to(ROOT)}, title {size}px, {len(lines)} line(s))", flush=True)


def main() -> None:
    if len(sys.argv) != 2:
        sys.exit("usage: uv run scripts/compose_picture.py <spec.json>")
    for entry in json.loads(Path(sys.argv[1]).read_text()):
        try:
            compose(entry)
        except Exception as e:  # keep going; report per picture
            print(f"✗ {entry.get('slug')}: {e}", flush=True)


if __name__ == "__main__":
    main()

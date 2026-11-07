# /// script
# requires-python = ">=3.11"
# dependencies = ["pillow>=11"]
# ///
"""v1.H — one command per batch: generate → check → compose.

Usage:
  uv run scripts/gen_batch.py <spec.json> [--dry-run] [--yes | --max-cost USD]
                                          [--only key1,key2] [--force] [--rerolls N]

Per picture in the spec (same format as scripts/compose_picture.py):
  1. art-raw/<art_key>.png exists and --force not given → ↷ reuse it (no spend)
  2. otherwise generate textless art via treg (`treg call … --await`), in parallel
  3. scripts/check_art.py: flat top band / busy text zone / glare → auto re-roll
     (up to --rerolls, default 1); still failing → ✗, left for visual review
  4. compose the picture (text over art) → src/assets + public/images
Review sheets are not built here: a cross-site one belongs in the shared
pipeline (imagemill, PRD v2).

A spec entry can give "prompt" (used as-is) or "scene" (the subject and layout
only); "scene" gets PROMPT_TAIL appended, which carries the composition rules
learned in batches 2–3 (docs/CLAUDE.md).

Spending gate: an estimate is printed before any paid call. Non-interactive runs
need --yes or --max-cost ≥ the worst case (every picture re-rolled the maximum).
Requires a signed-in treg CLI (`treg login`).
"""

import argparse
import json
import os
import subprocess
import sys
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

sys.dont_write_bytecode = True
sys.path.insert(0, str(Path(__file__).resolve().parent))
from check_art import check  # noqa: E402
from compose_picture import ROOT, compose  # noqa: E402

ENDPOINT = "replicate.image-gen.nano-banana-pro"
# treg catalog_get, 2026-11-06: $0.15 per image at 1K/2K (charged only on success).
PRICE_USD = 0.15
CONCURRENCY = 6
PROMPT_TAIL = (
    " The sky or background fills the whole upper part of the image right up to the top edge;"
    " keep the top third calm and plain, with no moon, lamps, window bars, branches or other detail in it."
    " One continuous photograph with no borders, frames, panels, color bands or split sections."
    " Square composition. Absolutely no text, letters, numbers, watermark, signature or logo anywhere."
)

RED, YELLOW, DIM, RESET = "\033[31m", "\033[33m", "\033[2m", "\033[0m"
if not sys.stdout.isatty():
    RED = YELLOW = DIM = RESET = ""


class AuthError(Exception):
    pass


def say(mark: str, key: str, msg: str) -> None:
    color = {"✗": RED, "↷": YELLOW}.get(mark, "")
    print(f"{color}{mark}{RESET} {key:<24} {msg}", flush=True)


def prompt_of(e: dict) -> str:
    if e.get("prompt"):
        return e["prompt"]
    if e.get("scene"):
        return e["scene"].rstrip() + PROMPT_TAIL
    raise ValueError("spec entry needs 'prompt' or 'scene'")


def generate(prompt: str, out: Path) -> None:
    body = {"input": {"prompt": prompt, "resolution": "2K", "aspect_ratio": "1:1", "output_format": "png"}}
    proc = subprocess.run(
        ["treg", "call", ENDPOINT, "--method", "POST", "--data", json.dumps(body), "--await", "--timeout", "600"],
        capture_output=True, text=True,
    )
    text = proc.stdout.strip() or proc.stderr.strip()
    if "invalid token" in text or "not signed in" in text:
        raise AuthError("treg CLI is not signed in — run: treg login")
    try:
        data = json.loads(proc.stdout)
    except json.JSONDecodeError:
        raise RuntimeError(f"no JSON from treg (exit {proc.returncode}): {text[:160]}")
    data = data.get("result", data) if isinstance(data, dict) else data
    output = data.get("output") if isinstance(data, dict) else None
    url = output[0] if isinstance(output, list) else output
    if not url:
        raise RuntimeError(f"no output URL (status {data.get('status') if isinstance(data, dict) else '?'}): {data.get('error') if isinstance(data, dict) else text[:160]}")
    tmp = out.with_suffix(".part")
    urllib.request.urlretrieve(url, tmp)
    tmp.replace(out)


def run_one(e: dict, force: bool, rerolls: int) -> tuple[str, str, int]:
    """Returns (mark, message, paid_generations)."""
    key = e["art_key"]
    raw = ROOT / e["art_src"]
    raw.parent.mkdir(parents=True, exist_ok=True)
    paid = 0
    if raw.exists() and not force:
        ok, why = check(raw, e.get("placement"))
        if not ok:
            return "✗", f"cached art fails check: {why} (re-run with --force --only {key})", 0
    else:
        for attempt in range(rerolls + 1):
            generate(prompt_of(e), raw)
            paid += 1
            ok, why = check(raw, e.get("placement"))
            if ok:
                break
            if attempt < rerolls:
                say("↷", key, f"re-roll: {why}")
        else:
            return "✗", f"still fails after {rerolls} re-roll(s): {why} — review by eye", paid
    compose(e)
    return "✓", f"{e['category']}/{e['slug']}.webp ({paid} generation(s))", paid


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("spec")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--yes", action="store_true")
    ap.add_argument("--max-cost", type=float)
    ap.add_argument("--only", help="comma-separated art keys")
    ap.add_argument("--force", action="store_true", help="regenerate even if art-raw/<key>.png exists")
    ap.add_argument("--rerolls", type=int, default=1)
    a = ap.parse_args()

    spec = Path(a.spec)
    entries = json.loads(spec.read_text())
    if a.only:
        keep = set(a.only.split(","))
        entries = [e for e in entries if e["art_key"] in keep]
        if missing := keep - {e["art_key"] for e in entries}:
            sys.exit(f"✗ --only: not in spec: {', '.join(sorted(missing))}")
    for e in entries:
        prompt_of(e)  # validate before any spend

    todo = [e for e in entries if a.force or not (ROOT / e["art_src"]).exists()]
    est, worst = len(todo) * PRICE_USD, len(todo) * (1 + a.rerolls) * PRICE_USD
    print(f"  {len(entries)} picture(s), {len(todo)} to generate · estimate ${est:.2f}, worst case ${worst:.2f} "
          f"(${PRICE_USD:.2f}/image, {ENDPOINT}, up to {a.rerolls} re-roll(s) each)", flush=True)
    if a.dry_run:
        for e in entries:
            say("↷", e["art_key"], "would generate" if e in todo else "cached art, would compose only")
        return
    if todo:
        if a.max_cost is not None and worst > a.max_cost:
            sys.exit(f"{RED}✗{RESET} worst case ${worst:.2f} exceeds --max-cost ${a.max_cost:.2f}; nothing spent")
        if not a.yes and a.max_cost is None:
            if not sys.stdin.isatty():
                sys.exit(f"{RED}✗{RESET} non-interactive run needs --yes or --max-cost; nothing spent")
            if input(f"  spend up to ${worst:.2f}? [y/N] ").strip().lower() != "y":
                sys.exit("↷ cancelled; nothing spent")

    paid = 0
    failed = 0
    with ThreadPoolExecutor(max_workers=CONCURRENCY) as pool:
        futures = {pool.submit(run_one, e, a.force, a.rerolls): e for e in entries}
        for f in as_completed(futures):
            key = futures[f]["art_key"]
            try:
                mark, msg, n = f.result()
            except AuthError as err:
                say("✗", key, str(err))
                for other in futures:
                    other.cancel()
                failed += 1
                continue
            except Exception as err:  # transient provider/network trouble: retry-able
                say("↷", key, f"{type(err).__name__}: {err} — re-run the same command to retry")
                failed += 1
                continue
            paid += n
            failed += mark == "✗"
            say(mark, key, msg)

    print(f"{'✓' if not failed else '↷'} done: {len(entries) - failed}/{len(entries)} composed, "
          f"{paid} paid generation(s) ≈ ${paid * PRICE_USD:.2f}", flush=True)
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    main()

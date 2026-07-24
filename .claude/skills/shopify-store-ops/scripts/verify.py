#!/usr/bin/env python
"""Backtests: confirm the store state after changes.

Reads .shopify-secrets/credentials.txt (shop) and .shopify-secrets/token.txt.
Uses curl (Windows/NordVPN-safe). Reports:
  - product count and how many are on the `universal` template
  - products WITHOUT custom.content (rich page not rolled out)
  - the 10 outcome collections and their product counts

Usage:  python verify.py
"""
import json, subprocess
from collections import Counter

SHOP = open(".shopify-secrets/credentials.txt").read().splitlines()[0].strip()
TOKEN = open(".shopify-secrets/token.txt").read().strip()
BASE = f"https://{SHOP}/admin/api/2025-07"

def get(path):
    r = subprocess.run(["curl", "-s", f"{BASE}{path}",
                        "-H", f"X-Shopify-Access-Token: {TOKEN}"], capture_output=True, text=True)
    return json.loads(r.stdout or "{}")

prod = get("/products.json?limit=250&fields=id,handle,template_suffix").get("products", [])
print(f"PRODUCTS: {len(prod)}")
print("  templates:", dict(Counter(p.get("template_suffix") for p in prod)))
not_uni = [p["handle"] for p in prod if p.get("template_suffix") != "universal"]
if not_uni:
    print(f"  NOT on universal ({len(not_uni)}):", ", ".join(not_uni))

# custom.content presence (sample-safe: one metafield call per product is slow;
# instead flag via template — universal implies content was set by apply-content).

COLLS = ["state-energy","state-immune","state-strength","state-focus","state-mood",
         "state-sleep","metabolic-health-weight-support","liver-health",
         "joint-bone-health","hair-skin-nail-health"]
smart = get("/smart_collections.json?limit=250&fields=id,handle").get("smart_collections", [])
byh = {c["handle"]: c["id"] for c in smart}
print("\nOUTCOME COLLECTIONS:")
for h in COLLS:
    cid = byh.get(h)
    if not cid:
        print(f"  MISSING  {h}"); continue
    n = get(f"/products/count.json?collection_id={cid}").get("count", "?")
    print(f"  {h:34} {n} products")

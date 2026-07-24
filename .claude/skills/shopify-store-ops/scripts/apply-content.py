#!/usr/bin/env python
"""Roll out rich product pages: set the custom.content JSON metafield and switch
each matched product to the `universal` template.

Reads:
  .shopify-secrets/credentials.txt  (line 1 = shop domain)
  .shopify-secrets/token.txt        (Admin API access token from mint-token.sh)
  product-content/*.json            (one payload per product handle)

Matching: exact handle (filename == product handle) first, then the ALIAS map
below for Supliful's renamed handles. Prints what matched and what didn't —
review before trusting it. Uses curl (Windows/NordVPN-safe), GraphQL productUpdate.

Usage:  python apply-content.py [--dry]
"""
import json, os, glob, subprocess, sys

DRY = "--dry" in sys.argv
ROOT = os.getcwd()
SHOP = open(".shopify-secrets/credentials.txt").read().splitlines()[0].strip()
TOKEN = open(".shopify-secrets/token.txt").read().strip()
PC = os.path.join(ROOT, "product-content")
BASE = f"https://{SHOP}/admin/api/2025-07"

# dev-store handle (== json filename)  ->  live-store (Supliful) handle
ALIAS = {
 "adaptogen-immunity": "adaptogen-immunity-drops-1",
 "whey-protein-chocolate": "advanced-100-whey-protein-isolate-chocolate",
 "whey-protein-vanilla": "advanced-100-whey-protein-isolate-vanilla-1",
 "bcaa-post-workout": "bcaa-post-workout-powder-honeydew-watermelon",
 "bcaa-shock-fruit-punch": "bcaa-shock-powder-fruit-punch",
 "colostrum": "colostrum-capsules", "coq10": "coq10-ubiquinone",
 "creatine-hydration": "creatine-hydration-powder",
 "energy-powder-lychee": "energy-powder-lychee-splash-energy",
 "fat-burner-mct": "fat-burner-with-mct",
 "collagen-creamer-vanilla": "grass-fed-collagen-creamer-vanilla",
 "collagen-peptides-chocolate": "grass-fed-collagen-peptides-powder-chocolate",
 "collagen-peptides": "grass-fed-hydrolyzed-collagen-peptides",
 "citrulline-arginine-stack": "l-citrulline-l-arginine-stack",
 "lions-mane": "lions-mane-mushroom",
 "mushroom-cognition": "mushroom-energy-cognition-drops",
 "nitric-oxide": "nitric-oxide-1",
 "nitric-shock-preworkout": "nitric-shock-pre-workout-powder-fruit-punch",
 "pure3-whey-chocolate": "pure3-100-whey-protein-isolate-chocolate",
 "resveratrol": "resveratrol-50-600mg",
 "mushroom-coffee": "vitality-mushroom-coffee-medium-roast",
 "vitamin-d3": "vitamin-d3-2-000-iu-1",
 "hydration-powder": "hydration-powder-lemonade-1",
 "energy-powder": "energy-powder-melon-creamsicle",
}

def curl(method, path, body=None):
    args = ["curl", "-s", "-X", method, f"{BASE}{path}",
            "-H", f"X-Shopify-Access-Token: {TOKEN}", "-H", "Content-Type: application/json"]
    if body is not None:
        open(".apply_body.json", "w", encoding="utf-8").write(json.dumps(body, ensure_ascii=False))
        args += ["--data-binary", "@.apply_body.json"]
    return json.loads(subprocess.run(args, capture_output=True, text=True).stdout or "{}")

prod = curl("GET", "/products.json?limit=250&fields=id,handle,title,template_suffix").get("products", [])
by = {p["handle"]: p for p in prod}
files = sorted(os.path.splitext(os.path.basename(f))[0] for f in glob.glob(os.path.join(PC, "*.json")))

tasks, missing = [], []
for h in files:
    p = by.get(h) or by.get(ALIAS.get(h, ""))
    (tasks.append((h, p)) if p else missing.append(h))

print(f"matched {len(tasks)} / {len(files)} json files; {len(missing)} without a product on the store")
for h in missing:
    print("  no product for:", h)
if DRY:
    for h, p in tasks:
        print(f"  would set {h} -> {p['handle']} (universal)")
    sys.exit(0)

Q = ("mutation($id:ID!,$ts:String,$mf:[MetafieldInput!]){productUpdate(input:"
     "{id:$id,templateSuffix:$ts,metafields:$mf}){userErrors{field message}}}")
ok = 0
for h, p in tasks:
    val = json.dumps(json.load(open(os.path.join(PC, h + ".json"), encoding="utf-8")), ensure_ascii=False)
    r = curl("POST", "/graphql.json", {"query": Q, "variables": {
        "id": f"gid://shopify/Product/{p['id']}", "ts": "universal",
        "mf": [{"namespace": "custom", "key": "content", "type": "json", "value": val}]}})
    ue = r.get("data", {}).get("productUpdate", {}).get("userErrors") or r.get("errors")
    print(f"  ERR {p['handle']}: {ue}" if ue else f"  ok  {p['handle']}")
    ok += 0 if ue else 1
print(f"\napplied {ok}/{len(tasks)}")
if os.path.exists(".apply_body.json"): os.remove(".apply_body.json")

#!/usr/bin/env bash
# Mint a 24h Admin API access token via the client-credentials grant.
#
# Usage:  bash mint-token.sh [credentials-file] > .shopify-secrets/token.txt
# Default credentials-file: .shopify-secrets/credentials.txt
#   line 1: <shop>.myshopify.com
#   line 2: <client_id>       (32-hex, from Dev Dashboard -> app -> Overview)
#   line 3: <client_secret>   (shpss_...)
#
# Prints ONLY the access token on success. On Windows this uses curl on purpose
# (Python TLS fails under NordVPN Threat Protection).
set -euo pipefail

CRED="${1:-.shopify-secrets/credentials.txt}"
[ -f "$CRED" ] || { echo "credentials file not found: $CRED" >&2; exit 1; }

SHOP=$(sed -n '1p' "$CRED" | tr -d '\r ')
CID=$(sed -n '2p'  "$CRED" | tr -d '\r ')
SECRET=$(sed -n '3p' "$CRED" | tr -d '\r ')

RESP=$(curl -s -X POST "https://$SHOP/admin/oauth/access_token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d grant_type=client_credentials \
  -d "client_id=$CID" \
  -d "client_secret=$SECRET")

# extract access_token without leaking the whole response
echo "$RESP" | python -c "
import json,sys
try:
    d=json.load(sys.stdin)
except Exception:
    sys.stderr.write('Non-JSON response (check app install / credentials).\n'); sys.exit(1)
if 'access_token' in d:
    print(d['access_token'])
else:
    sys.stderr.write('No token. scope=%s error=%s\n' % (d.get('scope','-'), d.get('errors') or d.get('error') or d)); sys.exit(1)
"
echo "Token minted (valid 24h)." >&2

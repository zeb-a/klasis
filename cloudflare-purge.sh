#!/bin/bash
set -euo pipefail

# Cloudflare Cache Purge Script
# Add this to your deploy process or run manually

# Get your Cloudflare API token from: https://dash.cloudflare.com/profile/api-tokens
# Required permissions: Zone:Zone:Edit, Zone:Cache:Purge

if [[ -f .cloudflare.env ]]; then
  source .cloudflare.env
fi

CLOUDFLARE_API_TOKEN="${CLOUDFLARE_API_TOKEN:-your-api-token-here}"
CLOUDFLARE_ZONE_ID="${CLOUDFLARE_ZONE_ID:-your-zone-id-here}"

if [[ "$CLOUDFLARE_API_TOKEN" == "your-api-token-here" ]]; then
  echo "Please set up .cloudflare.env with:"
  echo "CLOUDFLARE_API_TOKEN=your-actual-token"
  echo "CLOUDFLARE_ZONE_ID=your-actual-zone-id"
  echo ""
  echo "Get API token from: https://dash.cloudflare.com/profile/api-tokens"
  echo "Get Zone ID from: https://dash.cloudflare.com/klasiz.fun/overview"
  exit 1
fi

echo "Purging Cloudflare cache..."

# Purge everything
curl -X POST "https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/purge_cache" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}'

echo ""
echo "Cache purge complete!"
echo ""
echo "You can also purge specific files:"
echo "curl -X POST \"https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/purge_cache\" \\"
echo "  -H \"Authorization: Bearer ${CLOUDFLARE_API_TOKEN}\" \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  --data '{\"files\":[\"https://klasiz.fun/index.html\",\"https://klasiz.fun/assets/main.js\"]}'"

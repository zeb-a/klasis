#!/bin/bash
set -euo pipefail

# Check PocketBase Behaviors Collection Schema
SERVER_URL="${1:-http://localhost:3000}"
ADMIN_EMAIL="${2:-admin@example.com}"
ADMIN_PASSWORD="${3:-password123}"

echo "🔍 Checking PocketBase behaviors collection schema..."

# Login
LOGIN_RESPONSE=$(curl -s -X POST "$SERVER_URL/api/collections/_pb_users_auth_/auth-with-password" \
  -H "Content-Type: application/json" \
  -d "{\"identity\": \"$ADMIN_EMAIL\", \"password\": \"$ADMIN_PASSWORD\"}")

TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token')
if [ "$TOKEN" = "null" ]; then
  echo "❌ Login failed"
  exit 1
fi

echo "✅ Logged in"

# Get collection info
echo "📋 Behaviors Collection Schema:"
curl -s -X GET "$SERVER_URL/api/collections/behaviors" \
  -H "Authorization: Bearer $TOKEN" | jq '.schema'

echo ""
echo "📋 Behaviors Collection Rules:"
curl -s -X GET "$SERVER_URL/api/collections/behaviors" \
  -H "Authorization: Bearer $TOKEN" | jq '{listRule, viewRule, createRule, updateRule, deleteRule}'

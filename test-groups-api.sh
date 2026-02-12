#!/bin/bash

echo "================================================"
echo "Testing Group-Based Authorization"
echo "================================================"
echo ""
echo "To test, you need to:"
echo "1. Login to http://localhost:3000"
echo "2. Open browser DevTools (F12)"
echo "3. Go to Application > Local Storage > http://localhost:3000"
echo "4. Copy the 'okta-token-storage' access token value"
echo "5. Run: export ACCESS_TOKEN='your-token-here'"
echo "6. Then run this script with: ./test-groups-api.sh"
echo ""

if [ -z "$ACCESS_TOKEN" ]; then
    echo "❌ ACCESS_TOKEN not set"
    echo "Please set it first: export ACCESS_TOKEN='your-token'"
    exit 1
fi

echo "Testing API endpoints with your token..."
echo ""

echo "1️⃣  Testing GET /api/groups/me (should show your groups)"
echo "---------------------------------------------------"
curl -s -X GET http://localhost:5000/api/groups/me \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" | jq '.'
echo ""

echo "2️⃣  Testing GET /api/groups/check/Admins (check if you're an admin)"
echo "---------------------------------------------------"
curl -s -X GET http://localhost:5000/api/groups/check/Admins \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" | jq '.'
echo ""

echo "3️⃣  Testing GET /api/groups/admin-only (requires Admin group)"
echo "---------------------------------------------------"
curl -s -X GET http://localhost:5000/api/groups/admin-only \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" | jq '.'
echo ""

echo "4️⃣  Testing GET /api/groups/premium-only (requires Premium group)"
echo "---------------------------------------------------"
curl -s -X GET http://localhost:5000/api/groups/premium-only \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" | jq '.'
echo ""

echo "================================================"
echo "Test Complete!"
echo "================================================"

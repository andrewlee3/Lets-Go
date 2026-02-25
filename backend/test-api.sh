#!/bin/bash

# Start server in background
cd /Users/hwangheejung/company/aws-workshop-20260225/Lets-Go/backend
npm run dev > /dev/null 2>&1 &
SERVER_PID=$!

# Wait for server to start
sleep 3

echo "=== Testing Auth API Endpoints ==="
echo ""

# Test 1: Admin Login
echo "1. Admin Login (Valid Credentials)"
curl -s -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"storeId":"store1","username":"admin","password":"admin123"}' | jq '.'
echo ""

# Test 2: Admin Login (Invalid Credentials)
echo "2. Admin Login (Invalid Credentials)"
curl -s -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"storeId":"store1","username":"admin","password":"wrong"}' | jq '.'
echo ""

# Test 3: Table Setup
echo "3. Table Setup (Valid Credentials)"
RESPONSE=$(curl -s -X POST http://localhost:3000/api/customer/table/setup \
  -H "Content-Type: application/json" \
  -d '{"storeId":"store1","tableNumber":"1","tablePassword":"table123"}')
echo "$RESPONSE" | jq '.'
TOKEN=$(echo "$RESPONSE" | jq -r '.data.token')
echo ""

# Test 4: Auto Login
echo "4. Auto Login (Valid Token)"
curl -s -X POST http://localhost:3000/api/customer/table/auto-login \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

# Test 5: Auto Login (Invalid Token)
echo "5. Auto Login (Invalid Token)"
curl -s -X POST http://localhost:3000/api/customer/table/auto-login \
  -H "Authorization: Bearer invalid-token" | jq '.'
echo ""

# Kill server
kill $SERVER_PID
echo "=== Tests Complete ==="

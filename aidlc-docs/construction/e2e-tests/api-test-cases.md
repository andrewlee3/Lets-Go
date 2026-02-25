# API 테스트 케이스 (Backend 단독 테스트)

**프로젝트**: 테이블오더 서비스  
**생성일**: 2026-02-25  
**목적**: FE 없이 Backend API만 테스트 (Playwright MCP 또는 curl)

---

## 1. 인증 API 테스트

### AUTH-001: 관리자 로그인 성공
```bash
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"storeId":"store1","username":"admin","password":"admin123"}'
```
**예상 응답**: `200 { success: true, data: { token: "...", expiresIn: 57600 } }`

### AUTH-002: 관리자 로그인 실패
```bash
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"storeId":"store1","username":"admin","password":"wrong"}'
```
**예상 응답**: `401 { success: false, error: "Invalid credentials" }`

### AUTH-003: 테이블 설정
```bash
curl -X POST http://localhost:3000/api/customer/table/setup \
  -H "Content-Type: application/json" \
  -d '{"storeId":"store1","tableNumber":"1","tablePassword":"table123"}'
```
**예상 응답**: `200 { success: true, data: { token: "...", tableInfo: {...} } }`

---

## 2. 메뉴 API 테스트

### MENU-001: 전체 메뉴 조회
```bash
curl http://localhost:3000/api/customer/menus
```
**예상 응답**:
```json
{
  "success": true,
  "data": {
    "categories": [
      { "id": "cat-1", "name": "메인", "order": 1 },
      { "id": "cat-2", "name": "사이드", "order": 2 },
      ...
    ],
    "menus": [
      { "id": "menu-1", "name": "불고기 버거", "price": 8500, ... },
      ...
    ]
  }
}
```

### MENU-002: 카테고리별 메뉴 조회
```bash
curl "http://localhost:3000/api/customer/menus?categoryId=cat-1"
```
**예상 응답**: 해당 카테고리 메뉴만 반환

---

## 3. 주문 API 테스트

### ORDER-001: 주문 생성 (인증 필요)
```bash
# 먼저 테이블 토큰 획득
TOKEN=$(curl -s -X POST http://localhost:3000/api/customer/table/setup \
  -H "Content-Type: application/json" \
  -d '{"storeId":"store1","tableNumber":"1","tablePassword":"table123"}' \
  | jq -r '.data.token')

# 주문 생성
curl -X POST http://localhost:3000/api/customer/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "items": [
      {"menuId": "menu-1", "quantity": 2},
      {"menuId": "menu-6", "quantity": 1}
    ],
    "sessionId": "test-session-1"
  }'
```
**예상 응답**: `201 { success: true, data: { orderId: "...", orderNumber: "ORD-..." } }`

### ORDER-002: 주문 생성 실패 - 빈 items
```bash
curl -X POST http://localhost:3000/api/customer/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"items": [], "sessionId": "test"}'
```
**예상 응답**: `400 { success: false, error: "Order items cannot be empty" }`

### ORDER-003: 주문 생성 실패 - 인증 없음
```bash
curl -X POST http://localhost:3000/api/customer/orders \
  -H "Content-Type: application/json" \
  -d '{"items": [{"menuId": "menu-1", "quantity": 1}]}'
```
**예상 응답**: `401 { success: false, error: "No token provided" }`

### ORDER-004: 고객 주문 내역 조회
```bash
curl "http://localhost:3000/api/customer/orders?sessionId=test-session-1" \
  -H "Authorization: Bearer $TOKEN"
```
**예상 응답**: 해당 세션의 주문 목록

### ORDER-005: 관리자 주문 목록 조회
```bash
ADMIN_TOKEN=$(curl -s -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"storeId":"store1","username":"admin","password":"admin123"}' \
  | jq -r '.data.token')

curl http://localhost:3000/api/admin/orders \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```
**예상 응답**: `{ tables: [{ table: {...}, orders: [...], totalAmount: X, isDelayed: false }] }`

### ORDER-006: 주문 상태 변경
```bash
ORDER_ID="주문ID"

curl -X PATCH "http://localhost:3000/api/admin/orders/$ORDER_ID/status" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"status": "preparing"}'
```
**예상 응답**: `200 { success: true, data: { success: true } }`

### ORDER-007: 주문 삭제
```bash
curl -X DELETE "http://localhost:3000/api/admin/orders/$ORDER_ID" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```
**예상 응답**: `200 { success: true, data: { success: true } }`

---

## 4. 테이블 관리 API 테스트

### TABLE-001: 테이블 이용 완료
```bash
curl -X POST http://localhost:3000/api/admin/tables/table-1/complete \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```
**예상 응답**: `200 { success: true, data: { success: true } }`

### TABLE-002: 과거 주문 내역 조회
```bash
curl http://localhost:3000/api/admin/tables/table-1/history \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```
**예상 응답**: `{ sessions: [{ sessionId: "...", orders: [...], completedAt: "..." }] }`

---

## 5. SSE API 테스트

### SSE-001: 관리자 SSE 연결
```bash
curl -N http://localhost:3000/api/admin/sse/orders \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```
**예상**: SSE 스트림 연결, 이벤트 수신 대기

### SSE-002: 고객 SSE 연결
```bash
curl -N http://localhost:3000/api/customer/sse/orders \
  -H "Authorization: Bearer $TOKEN"
```
**예상**: SSE 스트림 연결, 주문 상태 변경 이벤트 수신

---

## 6. 전체 플로우 테스트 스크립트

```bash
#!/bin/bash
# test-full-flow.sh

BASE_URL="http://localhost:3000"

echo "=== 1. 관리자 로그인 ==="
ADMIN_TOKEN=$(curl -s -X POST $BASE_URL/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"storeId":"store1","username":"admin","password":"admin123"}' \
  | jq -r '.data.token')
echo "Admin Token: ${ADMIN_TOKEN:0:20}..."

echo ""
echo "=== 2. 테이블 설정 ==="
TABLE_TOKEN=$(curl -s -X POST $BASE_URL/api/customer/table/setup \
  -H "Content-Type: application/json" \
  -d '{"storeId":"store1","tableNumber":"1","tablePassword":"table123"}' \
  | jq -r '.data.token')
echo "Table Token: ${TABLE_TOKEN:0:20}..."

echo ""
echo "=== 3. 메뉴 조회 ==="
curl -s $BASE_URL/api/customer/menus | jq '.data.menus | length'
echo "개 메뉴"

echo ""
echo "=== 4. 주문 생성 ==="
ORDER_RESULT=$(curl -s -X POST $BASE_URL/api/customer/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TABLE_TOKEN" \
  -d '{
    "items": [{"menuId": "menu-1", "quantity": 2}],
    "sessionId": "test-session"
  }')
ORDER_ID=$(echo $ORDER_RESULT | jq -r '.data.orderId')
ORDER_NUM=$(echo $ORDER_RESULT | jq -r '.data.orderNumber')
echo "주문 번호: $ORDER_NUM"

echo ""
echo "=== 5. 관리자 주문 확인 ==="
curl -s $BASE_URL/api/admin/orders \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  | jq '.data.tables[0].orders | length'
echo "개 주문"

echo ""
echo "=== 6. 주문 상태 변경 ==="
curl -s -X PATCH "$BASE_URL/api/admin/orders/$ORDER_ID/status" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"status": "preparing"}' | jq '.success'

echo ""
echo "=== 7. 테이블 이용 완료 ==="
curl -s -X POST $BASE_URL/api/admin/tables/table-1/complete \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.success'

echo ""
echo "=== 테스트 완료 ==="
```

---

## 7. 동시성 테스트 스크립트

```bash
#!/bin/bash
# test-concurrency.sh

BASE_URL="http://localhost:3000"

echo "=== 10개 테이블 동시 주문 테스트 ==="

# 10개 테이블 토큰 획득
declare -a TOKENS
for i in {1..10}; do
  TOKENS[$i]=$(curl -s -X POST $BASE_URL/api/customer/table/setup \
    -H "Content-Type: application/json" \
    -d "{\"storeId\":\"store1\",\"tableNumber\":\"$i\",\"tablePassword\":\"table123\"}" \
    | jq -r '.data.token')
done

# 동시 주문 (백그라운드)
START_TIME=$(date +%s%3N)

for i in {1..10}; do
  curl -s -X POST $BASE_URL/api/customer/orders \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer ${TOKENS[$i]}" \
    -d "{\"items\":[{\"menuId\":\"menu-1\",\"quantity\":1}],\"sessionId\":\"session-$i\"}" &
done

# 모든 요청 완료 대기
wait

END_TIME=$(date +%s%3N)
DURATION=$((END_TIME - START_TIME))

echo "10개 동시 주문 완료: ${DURATION}ms"

# 결과 확인
ADMIN_TOKEN=$(curl -s -X POST $BASE_URL/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"storeId":"store1","username":"admin","password":"admin123"}' \
  | jq -r '.data.token')

ORDER_COUNT=$(curl -s $BASE_URL/api/admin/orders \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  | jq '[.data.tables[].orders | length] | add')

echo "생성된 주문 수: $ORDER_COUNT"
```

---

## 8. 테스트 체크리스트

### 인증
- [ ] AUTH-001: 관리자 로그인 성공
- [ ] AUTH-002: 관리자 로그인 실패
- [ ] AUTH-003: 테이블 설정

### 메뉴
- [ ] MENU-001: 전체 메뉴 조회
- [ ] MENU-002: 카테고리별 조회

### 주문
- [ ] ORDER-001: 주문 생성 성공
- [ ] ORDER-002: 주문 생성 실패 (빈 items)
- [ ] ORDER-003: 주문 생성 실패 (인증 없음)
- [ ] ORDER-004: 고객 주문 내역
- [ ] ORDER-005: 관리자 주문 목록
- [ ] ORDER-006: 상태 변경
- [ ] ORDER-007: 주문 삭제

### 테이블
- [ ] TABLE-001: 이용 완료
- [ ] TABLE-002: 과거 내역

### SSE
- [ ] SSE-001: 관리자 연결
- [ ] SSE-002: 고객 연결

### 동시성
- [ ] 10개 테이블 동시 주문
- [ ] 동시 상태 변경

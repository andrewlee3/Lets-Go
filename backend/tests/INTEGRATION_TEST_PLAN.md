# 통합 테스트 계획

**프로젝트**: 테이블오더 서비스  
**생성일**: 2026-02-25  
**목적**: Phase 2 통합 테스트 준비

---

## 테스트 범위

### 1. API 통합 테스트 (Backend)
모든 API 엔드포인트가 올바르게 동작하는지 검증

### 2. E2E 시나리오 테스트
실제 사용자 플로우를 시뮬레이션

### 3. SSE 실시간 이벤트 테스트
주문 상태 변경 시 실시간 알림 검증

---

## E2E 시나리오

### 시나리오 1: 고객 주문 플로우
```
1. 테이블 설정 (POST /api/customer/table/setup)
2. 메뉴 조회 (GET /api/customer/menus)
3. 주문 생성 (POST /api/customer/orders)
4. 주문 내역 확인 (GET /api/customer/orders)
5. SSE로 주문 상태 변경 수신
```

### 시나리오 2: 관리자 주문 관리 플로우
```
1. 관리자 로그인 (POST /api/admin/login)
2. 주문 목록 조회 (GET /api/admin/orders)
3. 주문 상태 변경 (PATCH /api/admin/orders/:id/status)
4. SSE로 상태 변경 브로드캐스트 확인
5. 주문 삭제 (DELETE /api/admin/orders/:id)
```

### 시나리오 3: 테이블 세션 관리 플로우
```
1. 관리자 로그인
2. 테이블 이용 완료 (POST /api/admin/tables/:id/complete)
3. 과거 내역 조회 (GET /api/admin/tables/:id/history)
4. 새 고객 테이블 설정
```

### 시나리오 4: 실시간 알림 플로우
```
1. 고객 SSE 연결 (GET /api/customer/sse/orders)
2. 관리자 SSE 연결 (GET /api/admin/sse/orders)
3. 고객이 주문 생성 → 관리자에게 new_order 이벤트
4. 관리자가 상태 변경 → 고객에게 order_status 이벤트
5. 관리자가 주문 삭제 → 관리자들에게 order_deleted 이벤트
```

---

## API 체크리스트

### Auth (BE-1) ✅
- [x] POST /api/admin/login
- [x] POST /api/customer/table/setup
- [x] POST /api/customer/table/auto-login

### Menu (BE-2)
- [ ] GET /api/customer/menus

### Order (BE-2)
- [ ] POST /api/customer/orders
- [ ] GET /api/customer/orders
- [ ] GET /api/admin/orders
- [ ] PATCH /api/admin/orders/:id/status
- [ ] DELETE /api/admin/orders/:id

### Table (BE-3) ✅
- [x] POST /api/admin/tables/:id/complete
- [x] GET /api/admin/tables/:id/history

### SSE (BE-3) ✅
- [x] GET /api/customer/sse/orders
- [x] GET /api/admin/sse/orders

---

## 테스트 데이터

### 기본 테스트 계정
```
Admin: store1 / admin / admin123
Table: store1 / 1 / table123
```

### 샘플 메뉴 (BE-2에서 생성)
- 5개 카테고리
- 총 20개 메뉴

---

## 실행 방법

```bash
# 전체 테스트
npm test

# 통합 테스트만
npm test -- tests/integration/

# E2E 테스트만
npm test -- tests/e2e/

# 특정 시나리오
npm test -- tests/e2e/order-flow.test.ts
```

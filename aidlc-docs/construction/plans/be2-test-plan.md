# Test Plan for BE-2 (Menu + Order)

**Unit**: BE-2  
**담당자**: 개발자 B  
**생성일**: 2026-02-25

---

## Unit Overview

**Stories**:
- US-1.1: 메뉴 조회
- US-1.3: 주문 생성
- US-1.4: 주문 내역 조회
- US-2.2: 실시간 주문 모니터링
- US-2.3: 주문 상태 변경
- US-2.5: 주문 삭제
- US-4.1: 샘플 메뉴 데이터

---

## Repository Layer Tests

### MenuRepository

#### findAllCategories()
- **TC-BE2-001**: 카테고리 목록 조회
  - Given: DB에 3개 카테고리 존재
  - When: findAllCategories() 호출
  - Then: 3개 카테고리가 order 순으로 반환됨
  - Story: US-1.1
  - Status: ⬜ Not Started

#### findAllMenus()
- **TC-BE2-002**: 전체 메뉴 조회
  - Given: DB에 5개 메뉴 존재
  - When: findAllMenus() 호출
  - Then: 5개 메뉴 반환됨
  - Story: US-1.1
  - Status: ⬜ Not Started

#### findMenusByCategory()
- **TC-BE2-003**: 카테고리별 메뉴 조회
  - Given: 카테고리 A에 3개 메뉴 존재
  - When: findMenusByCategory('A') 호출
  - Then: 3개 메뉴만 반환됨
  - Story: US-1.1
  - Status: ⬜ Not Started

#### findMenuById()
- **TC-BE2-004**: 메뉴 ID로 조회 - 존재
  - Given: ID가 'menu-1'인 메뉴 존재
  - When: findMenuById('menu-1') 호출
  - Then: 해당 메뉴 반환됨
  - Story: US-1.3
  - Status: ⬜ Not Started

- **TC-BE2-005**: 메뉴 ID로 조회 - 미존재
  - Given: ID가 'invalid'인 메뉴 없음
  - When: findMenuById('invalid') 호출
  - Then: null 반환됨
  - Story: US-1.3
  - Status: ⬜ Not Started

### OrderRepository

#### create()
- **TC-BE2-006**: 주문 생성
  - Given: 유효한 주문 데이터
  - When: create(orderData) 호출
  - Then: 주문이 생성되고 status='pending', orderNumber 자동 생성
  - Story: US-1.3
  - Status: ⬜ Not Started

#### findBySessionId()
- **TC-BE2-007**: 세션별 주문 조회
  - Given: 세션 'session-1'에 2개 주문 존재
  - When: findBySessionId('session-1') 호출
  - Then: 2개 주문이 최신순으로 반환됨
  - Story: US-1.4
  - Status: ⬜ Not Started

#### updateStatus()
- **TC-BE2-008**: 주문 상태 변경 - 성공
  - Given: ID가 'order-1'인 주문 존재 (status='pending')
  - When: updateStatus('order-1', 'preparing') 호출
  - Then: status가 'preparing'으로 변경됨
  - Story: US-2.3
  - Status: ⬜ Not Started

- **TC-BE2-009**: 주문 상태 변경 - 미존재
  - Given: ID가 'invalid'인 주문 없음
  - When: updateStatus('invalid', 'preparing') 호출
  - Then: null 반환됨
  - Story: US-2.3
  - Status: ⬜ Not Started

#### delete()
- **TC-BE2-010**: 주문 삭제 - 성공
  - Given: ID가 'order-1'인 주문 존재
  - When: delete('order-1') 호출
  - Then: true 반환, 주문 삭제됨
  - Story: US-2.5
  - Status: ⬜ Not Started

- **TC-BE2-011**: 주문 삭제 - 미존재
  - Given: ID가 'invalid'인 주문 없음
  - When: delete('invalid') 호출
  - Then: false 반환됨
  - Story: US-2.5
  - Status: ⬜ Not Started

---

## Service Layer Tests

### MenuService

#### getAllMenus()
- **TC-BE2-012**: 전체 메뉴 조회
  - Given: 3개 카테고리, 10개 메뉴 존재
  - When: getAllMenus() 호출
  - Then: { categories: 3개, menus: 10개 } 반환됨
  - Story: US-1.1
  - Status: ⬜ Not Started

#### initializeSampleMenus()
- **TC-BE2-013**: 샘플 메뉴 초기화 - 메뉴 없을 때
  - Given: DB에 메뉴 없음
  - When: initializeSampleMenus() 호출
  - Then: 5개 카테고리, 20개 메뉴 생성됨
  - Story: US-4.1
  - Status: ⬜ Not Started

- **TC-BE2-014**: 샘플 메뉴 초기화 - 메뉴 있을 때
  - Given: DB에 메뉴 존재
  - When: initializeSampleMenus() 호출
  - Then: 아무 동작 안함 (기존 데이터 유지)
  - Story: US-4.1
  - Status: ⬜ Not Started

### OrderService

#### createOrder()
- **TC-BE2-015**: 주문 생성 - 성공
  - Given: 유효한 메뉴 ID와 수량
  - When: createOrder(tableId, sessionId, items) 호출
  - Then: 주문 생성, totalAmount 계산됨
  - Story: US-1.3
  - Status: ⬜ Not Started

- **TC-BE2-016**: 주문 생성 - 빈 items
  - Given: items가 빈 배열
  - When: createOrder(tableId, sessionId, []) 호출
  - Then: ValidationError 발생
  - Story: US-1.3
  - Status: ⬜ Not Started

- **TC-BE2-017**: 주문 생성 - 유효하지 않은 menuId
  - Given: 존재하지 않는 menuId
  - When: createOrder() 호출
  - Then: ValidationError 발생
  - Story: US-1.3
  - Status: ⬜ Not Started

- **TC-BE2-018**: 주문 생성 - quantity < 1
  - Given: quantity가 0
  - When: createOrder() 호출
  - Then: ValidationError 발생
  - Story: US-1.3
  - Status: ⬜ Not Started

#### getOrdersBySession()
- **TC-BE2-019**: 세션별 주문 조회
  - Given: 세션에 3개 주문 존재
  - When: getOrdersBySession(sessionId) 호출
  - Then: 3개 주문 최신순 반환
  - Story: US-1.4
  - Status: ⬜ Not Started

#### updateOrderStatus()
- **TC-BE2-020**: 상태 변경 - 성공
  - Given: 존재하는 주문
  - When: updateOrderStatus(orderId, 'preparing') 호출
  - Then: 상태 변경된 주문 반환
  - Story: US-2.3
  - Status: ⬜ Not Started

- **TC-BE2-021**: 상태 변경 - 주문 없음
  - Given: 존재하지 않는 orderId
  - When: updateOrderStatus() 호출
  - Then: NotFoundError 발생
  - Story: US-2.3
  - Status: ⬜ Not Started

- **TC-BE2-022**: 상태 변경 - 잘못된 status
  - Given: 존재하는 주문
  - When: updateOrderStatus(orderId, 'invalid') 호출
  - Then: ValidationError 발생
  - Story: US-2.3
  - Status: ⬜ Not Started

#### deleteOrder()
- **TC-BE2-023**: 주문 삭제 - 성공
  - Given: 존재하는 주문
  - When: deleteOrder(orderId) 호출
  - Then: 삭제 완료 (void)
  - Story: US-2.5
  - Status: ⬜ Not Started

- **TC-BE2-024**: 주문 삭제 - 주문 없음
  - Given: 존재하지 않는 orderId
  - When: deleteOrder() 호출
  - Then: NotFoundError 발생
  - Story: US-2.5
  - Status: ⬜ Not Started

---

## Controller Layer Tests (Integration)

### MenuController

- **TC-BE2-025**: GET /api/customer/menus - 성공
  - Given: 메뉴 데이터 존재
  - When: GET /api/customer/menus 요청
  - Then: 200, { success: true, data: { categories, menus } }
  - Story: US-1.1
  - Status: ⬜ Not Started

- **TC-BE2-026**: GET /api/customer/menus?categoryId=xxx - 필터링
  - Given: 특정 카테고리 메뉴 존재
  - When: GET /api/customer/menus?categoryId=xxx 요청
  - Then: 200, 해당 카테고리 메뉴만 반환
  - Story: US-1.1
  - Status: ⬜ Not Started

### OrderController

- **TC-BE2-027**: POST /api/customer/orders - 성공
  - Given: 유효한 주문 데이터
  - When: POST /api/customer/orders 요청
  - Then: 201, { success: true, data: { orderId, orderNumber } }
  - Story: US-1.3
  - Status: ⬜ Not Started

- **TC-BE2-028**: POST /api/customer/orders - 빈 items
  - Given: items가 빈 배열
  - When: POST /api/customer/orders 요청
  - Then: 400, { success: false, error: 'validation error' }
  - Story: US-1.3
  - Status: ⬜ Not Started

- **TC-BE2-029**: GET /api/customer/orders - 성공
  - Given: 세션에 주문 존재
  - When: GET /api/customer/orders 요청
  - Then: 200, 주문 목록 반환
  - Story: US-1.4
  - Status: ⬜ Not Started

- **TC-BE2-030**: GET /api/admin/orders - 성공
  - Given: 매장에 주문 존재
  - When: GET /api/admin/orders 요청
  - Then: 200, { tables: TableWithOrders[] }
  - Story: US-2.2
  - Status: ⬜ Not Started

- **TC-BE2-031**: PATCH /api/admin/orders/:id/status - 성공
  - Given: 존재하는 주문
  - When: PATCH 요청 with { status: 'preparing' }
  - Then: 200, { success: true }
  - Story: US-2.3
  - Status: ⬜ Not Started

- **TC-BE2-032**: PATCH /api/admin/orders/:id/status - 404
  - Given: 존재하지 않는 주문
  - When: PATCH 요청
  - Then: 404, { success: false, error: 'not found' }
  - Story: US-2.3
  - Status: ⬜ Not Started

- **TC-BE2-033**: DELETE /api/admin/orders/:id - 성공
  - Given: 존재하는 주문
  - When: DELETE 요청
  - Then: 200, { success: true }
  - Story: US-2.5
  - Status: ⬜ Not Started

- **TC-BE2-034**: DELETE /api/admin/orders/:id - 404
  - Given: 존재하지 않는 주문
  - When: DELETE 요청
  - Then: 404, { success: false, error: 'not found' }
  - Story: US-2.5
  - Status: ⬜ Not Started

---

## Requirements Coverage

| Story | Test Cases | Status |
|-------|------------|--------|
| US-1.1 (메뉴 조회) | TC-BE2-001~005, 012, 025~026 | ⬜ Pending |
| US-1.3 (주문 생성) | TC-BE2-004~006, 015~018, 027~028 | ⬜ Pending |
| US-1.4 (주문 내역) | TC-BE2-007, 019, 029 | ⬜ Pending |
| US-2.2 (모니터링) | TC-BE2-030 | ⬜ Pending |
| US-2.3 (상태 변경) | TC-BE2-008~009, 020~022, 031~032 | ⬜ Pending |
| US-2.5 (주문 삭제) | TC-BE2-010~011, 023~024, 033~034 | ⬜ Pending |
| US-4.1 (샘플 메뉴) | TC-BE2-013~014 | ⬜ Pending |

---

## Test Summary

| Layer | Test Count |
|-------|------------|
| Repository | 11 |
| Service | 13 |
| Controller | 10 |
| **Total** | **34** |

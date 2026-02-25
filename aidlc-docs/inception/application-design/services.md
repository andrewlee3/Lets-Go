# Services

**프로젝트**: 테이블오더 서비스  
**생성일**: 2026-02-25

---

## 서비스 레이어 구조

```
┌─────────────────────────────────────────────────────────┐
│                    Controllers                          │
│  (AuthController, MenuController, OrderController, ...) │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│                     Services                            │
│  (AuthService, MenuService, OrderService, ...)          │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│                   Repositories                          │
│  (Database Access Layer - SQLite)                       │
└─────────────────────────────────────────────────────────┘
```

---

## 서비스 정의

### 1. AuthService
**책임**: 인증 및 권한 관리

| 기능 | 설명 |
|-----|------|
| 관리자 로그인 | 매장식별자 + 사용자명 + 비밀번호 검증 |
| 테이블 로그인 | 매장식별자 + 테이블번호 + 비밀번호 검증 |
| 토큰 관리 | JWT 생성 (16시간), 검증 |
| 로그인 제한 | 5회 실패 시 5분 잠금 |

**의존성**: bcrypt, jsonwebtoken

---

### 2. MenuService
**책임**: 메뉴 데이터 관리

| 기능 | 설명 |
|-----|------|
| 메뉴 조회 | 카테고리별 메뉴 목록 반환 |
| 메뉴 상세 | 단일 메뉴 정보 반환 |

**의존성**: MenuRepository

---

### 3. OrderService
**책임**: 주문 처리 및 관리

| 기능 | 설명 |
|-----|------|
| 주문 생성 | 장바구니 → 주문 변환, 주문번호 생성 |
| 주문 조회 | 세션별/매장별 주문 목록 |
| 상태 변경 | pending → preparing → completed |
| 주문 삭제 | 관리자 직권 삭제 |

**의존성**: OrderRepository, SSEService (이벤트 발행)

---

### 4. TableService
**책임**: 테이블 세션 라이프사이클 관리

| 기능 | 설명 |
|-----|------|
| 세션 생성 | 첫 주문 시 자동 생성 |
| 이용 완료 | 세션 종료, 주문 이력 이동 |
| 과거 내역 | 테이블별 과거 세션 조회 |

**의존성**: TableRepository, OrderRepository

---

### 5. SSEService
**책임**: 실시간 이벤트 스트리밍

| 기능 | 설명 |
|-----|------|
| 클라이언트 관리 | 연결 추가/제거 |
| 매장 브로드캐스트 | 관리자에게 신규 주문 알림 |
| 세션 브로드캐스트 | 고객에게 상태 변경 알림 |

**이벤트 타입**:
- `new_order`: 신규 주문 (관리자)
- `order_status`: 상태 변경 (고객 + 관리자)
- `order_deleted`: 주문 삭제 (관리자)

---

### 6. SeedService → MenuService로 통합
**책임**: 초기 데이터 생성 (MenuService에서 처리)

| 기능 | 설명 |
|-----|------|
| 메뉴 초기화 | 데이터 없을 시 5개 카테고리, 20개 메뉴 생성 |

**실행 시점**: getAllMenus() 호출 시 데이터 없으면 자동 생성

---

## 서비스 상호작용

### 주문 생성 플로우
```
1. OrderController.createOrder()
2. → OrderService.createOrder()
3.   → OrderRepository.save()
4.   → SSEService.broadcastToStore() // 관리자 알림
5. ← 주문번호 반환
```

### 상태 변경 플로우
```
1. OrderController.updateStatus()
2. → OrderService.updateOrderStatus()
3.   → OrderRepository.update()
4.   → SSEService.broadcastToSession() // 고객 알림
5.   → SSEService.broadcastToStore()   // 관리자 동기화
```

### 이용 완료 플로우
```
1. TableController.completeSession()
2. → TableService.completeTableSession()
3.   → OrderRepository.moveToHistory()
4.   → TableRepository.resetSession()
```

# Unit of Work

**프로젝트**: 테이블오더 서비스  
**생성일**: 2026-02-25  
**팀 구성**: Backend 3명, Frontend 1명

---

## Unit 구조

### Backend Units (3명 병렬)

| Unit | 담당 | 내용 | 예상 시간 |
|------|-----|------|----------|
| BE-1 | BE 개발자 1 | Auth + Shared Types | 1일 |
| BE-2 | BE 개발자 2 | Menu + Order | 1.5일 |
| BE-3 | BE 개발자 3 | Table + SSE | 1일 |

### Frontend Units (1명 순차)

| Unit | 담당 | 내용 | 예상 시간 |
|------|-----|------|----------|
| FE-1 | FE 개발자 | Customer (메뉴, 장바구니, 주문) | 2일 |
| FE-2 | FE 개발자 | Admin (대시보드, 모니터링) | 2일 |

---

## Unit 상세

### BE-1: Auth + Shared Types
**담당**: BE 개발자 1

**포함 항목:**
- Shared Types (packages/shared)
- AuthController, AuthService
- JWT 생성/검증
- 로그인 시도 제한 (5회/5분)
- bcrypt 비밀번호 해싱

**API:**
- POST /api/admin/login
- POST /api/customer/table/setup
- POST /api/customer/table/auto-login

**의존성**: 없음 (독립)

---

### BE-2: Menu + Order
**담당**: BE 개발자 2

**포함 항목:**
- MenuController, MenuService
- OrderController, OrderService
- 샘플 메뉴 초기화
- 주문 생성/조회/상태변경/삭제

**API:**
- GET /api/customer/menus
- POST /api/customer/orders
- GET /api/customer/orders
- GET /api/admin/orders
- PATCH /api/admin/orders/:id/status
- DELETE /api/admin/orders/:id

**의존성**: BE-1 (Shared Types, Auth 미들웨어)

---

### BE-3: Table + SSE
**담당**: BE 개발자 3

**포함 항목:**
- TableController, TableService
- SSEController, SSEService
- 테이블 이용 완료
- 과거 내역 조회
- 실시간 이벤트 브로드캐스트

**API:**
- POST /api/admin/tables/:id/complete
- GET /api/admin/tables/:id/history
- GET /api/customer/sse/orders
- GET /api/admin/sse/orders

**의존성**: BE-1 (Auth), BE-2 (Order 이벤트 발행)

---

### FE-1: Customer
**담당**: FE 개발자

**포함 항목:**
- MenuPage (카테고리 사이드바, 메뉴 카드)
- CartProvider, CartDrawer
- OrderHistoryPage
- AuthProvider
- useSSE hook
- TableSetupPage

**User Stories**: US-1.1 ~ US-1.5

**의존성**: BE-1, BE-2 API 필요

---

### FE-2: Admin
**담당**: FE 개발자

**포함 항목:**
- LoginPage
- DashboardPage (테이블 카드 그리드)
- TableCard (지연 주문 강조)
- OrderDetailModal
- TableHistoryModal
- AdminAuthProvider
- useAdminSSE hook

**User Stories**: US-2.1 ~ US-2.5, US-3.1 ~ US-3.3

**의존성**: BE-1, BE-2, BE-3 API 필요

---

## 병렬 진행 분석

```
Day 1:
┌─────────┐ ┌─────────┐ ┌─────────┐
│  BE-1   │ │  BE-2   │ │  BE-3   │
│ (Auth)  │ │ (Menu)  │ │ (Table) │
│         │ │ 시작가능 │ │ 대기    │
└────┬────┘ └────┬────┘ └────┬────┘
     │           │           │
     ▼           │           │
Day 1 완료       │           │
     │           │           │
     └─────┬─────┘           │
           ▼                 │
Day 1.5:  BE-2 완료          │
           │                 │
           └────────┬────────┘
                    ▼
Day 2:           BE-3 완료
                    │
┌───────────────────┴───────────────────┐
▼                                       ▼
FE-1 시작                            FE-2 대기
(BE-1, BE-2 완료 후)                 (BE-3 완료 후)
```

---

## 병렬 가능 여부

| Unit | 병렬 가능 | 조건 |
|------|----------|------|
| BE-1 | ✅ 즉시 시작 | - |
| BE-2 | ⚠️ 부분 병렬 | Shared Types 완료 후 (BE-1 Day 0.5) |
| BE-3 | ⚠️ 부분 병렬 | Auth 미들웨어 완료 후 (BE-1 Day 1) |
| FE-1 | ❌ 대기 | BE-1, BE-2 완료 후 |
| FE-2 | ❌ 대기 | FE-1 완료 후 (공통 컴포넌트 재사용) |

---

## 권장 일정

| Day | BE-1 | BE-2 | BE-3 | FE |
|-----|------|------|------|-----|
| 1 | Shared + Auth | Menu (Mock Auth) | SSE 구조 | API Contract 기반 타입 정의 |
| 2 | 완료 | Order | Table + SSE 연동 | Customer UI (Mock API) |
| 3 | 코드 리뷰 | 완료 | 완료 | Customer 연동 |
| 4 | 통합 테스트 지원 | 통합 테스트 지원 | 통합 테스트 지원 | Admin UI |
| 5 | - | - | - | Admin 연동 + 테스트 |

**총 예상**: 5일 (병렬 진행 시)

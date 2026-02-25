# Unit of Work

**프로젝트**: 테이블오더 서비스  
**생성일**: 2026-02-25  
**최종 수정**: 2026-02-25  
**팀 구성**: BE 3명, FE 1명 (총 4명 병렬 개발)

---

## 개발 전략

**Phase 1**: 4명 완전 병렬 개발 (TODO 주석으로 의존성 처리)  
**Phase 2**: 통합 (Shared Types 추출, Auth 적용, FE↔BE 연동)  
**Phase 3**: 통합 테스트

---

## Unit 구조

### Backend Units (3명 병렬)

| Unit | 담당자 | 내용 | 예상 시간 |
|------|-------|------|----------|
| BE-1 | 개발자 A | Auth 모듈 | 1일 |
| BE-2 | 개발자 B | Menu + Order | 1.5일 |
| BE-3 | 개발자 C | Table + SSE | 1일 |

### Frontend Units (1명, FE-1/FE-2 병렬 진행)

| Unit | 담당자 | 내용 | 예상 시간 |
|------|-------|------|----------|
| FE-1 | 개발자 D | Customer (메뉴, 장바구니, 주문) | 2일 |
| FE-2 | 개발자 D | Admin (대시보드, 모니터링) | 2일 |

---

## Unit 상세

### BE-1: Auth
**담당자**: 개발자 A

**포함 항목:**
- AuthController, AuthService
- JWT 생성/검증
- 로그인 시도 제한 (5회/5분)
- bcrypt 비밀번호 해싱

**API:**
- POST /api/admin/login
- POST /api/customer/table/setup
- POST /api/customer/table/auto-login

**의존성**: 없음 (독립)  
**완료 시**: BE-2, BE-3에 Auth 미들웨어 전달

---

### BE-2: Menu + Order
**담당자**: 개발자 B

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

**의존성**: `// TODO: [AUTH]` - BE-1 완료 시 적용

---

### BE-3: Table + SSE
**담당자**: 개발자 C

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

**의존성**: `// TODO: [AUTH]` - BE-1 완료 시 적용

---

### FE-1: Customer
**담당자**: 개발자 D

**포함 항목:**
- MenuPage (카테고리 사이드바, 메뉴 카드)
- CartProvider, CartDrawer
- OrderHistoryPage
- AuthProvider
- useSSE hook
- TableSetupPage

**User Stories**: US-1.1 ~ US-1.5

**의존성**: Mock API로 선개발 → Phase 2에서 연동

---

### FE-2: Admin
**담당자**: 개발자 D

**포함 항목:**
- LoginPage
- DashboardPage (테이블 카드 그리드)
- TableCard (지연 주문 강조)
- OrderDetailModal
- TableHistoryModal
- AdminAuthProvider
- useAdminSSE hook

**User Stories**: US-2.1 ~ US-2.5, US-3.1 ~ US-3.3

**의존성**: Mock API로 선개발 → Phase 2에서 연동

---

## 병렬 개발 구조

```
Phase 1 (4명 동시 진행)
┌─────────────────────────────────────────────────┐
│ 개발자 A: BE-1 (Auth)                            │
│ 개발자 B: BE-2 (Menu/Order) [TODO: AUTH]         │
│ 개발자 C: BE-3 (Table/SSE) [TODO: AUTH]          │
│ 개발자 D: FE-1 + FE-2 (Mock API)                 │
└─────────────────────────────────────────────────┘
                    │
                    ▼ BE-1 완료 시 Auth 적용
Phase 2 (통합)
┌─────────────────────────────────────────────────┐
│ - Shared Types 추출 (공통 타입 리팩토링)          │
│ - Auth 미들웨어 적용 (BE-2, BE-3)                │
│ - FE ↔ BE 연동                                  │
└─────────────────────────────────────────────────┘
                    │
                    ▼
Phase 3 (통합 테스트)
```

---

## 권장 일정

| Day | 개발자 A (BE-1) | 개발자 B (BE-2) | 개발자 C (BE-3) | 개발자 D (FE) |
|-----|----------------|----------------|----------------|---------------|
| 1 | Auth 개발 | Menu API | Table API | Customer UI |
| 2 | Auth 완료 → 전달 | Order API | SSE 연동 | Admin UI |
| 3 | 통합 지원 | Auth 적용 | Auth 적용 | FE↔BE 연동 |
| 4 | 통합 테스트 | 통합 테스트 | 통합 테스트 | 통합 테스트 |

**총 예상**: 4일 (완전 병렬 진행 시)

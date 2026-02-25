# TDD Code Generation Plan for FE-2 (Admin UI)

## Unit Context
- **Workspace Root**: `/Users/andrew/IdeaProjects/Lets-Go`
- **Project Type**: Greenfield (Frontend)
- **Code Location**: `frontend/`
- **Stories**: US-2.1 ~ US-2.5, US-3.2 ~ US-3.3

---

## Plan Step 0: Project Setup & Contract Skeleton Generation
- [x] 0.1 Next.js 프로젝트 초기화 (`frontend/`)
- [x] 0.2 공유 타입 정의 (`frontend/src/types/index.ts`)
- [x] 0.3 API 클라이언트 스켈레톤 (`frontend/src/api/admin.ts`)
- [x] 0.4 Context 스켈레톤 (`frontend/src/contexts/AdminAuthContext.tsx`)
- [x] 0.5 Hook 스켈레톤 (`frontend/src/hooks/useAdminSSE.ts`)
- [x] 0.6 Component 스켈레톤 생성
- [x] 0.7 테스트 환경 설정 (Jest + RTL)

---

## Plan Step 1: API Layer
- [x] 1.1 adminApi.login() - RED-GREEN-REFACTOR
- [x] 1.2 adminApi.getOrders() - RED-GREEN-REFACTOR
- [x] 1.3 adminApi.updateOrderStatus() - RED-GREEN-REFACTOR
- [x] 1.4 adminApi.deleteOrder() - RED-GREEN-REFACTOR
- [x] 1.5 adminApi.completeTable() - RED-GREEN-REFACTOR
- [x] 1.6 adminApi.getTableHistory() - RED-GREEN-REFACTOR

---

## Plan Step 2: Context Layer (AdminAuthContext)
- [x] 2.1 초기 상태 - RED-GREEN-REFACTOR (TC-FE2-001)
- [x] 2.2 login() - RED-GREEN-REFACTOR (TC-FE2-002, TC-FE2-003)
- [x] 2.3 logout() - RED-GREEN-REFACTOR (TC-FE2-004)
- [x] 2.4 세션 복원 - RED-GREEN-REFACTOR (TC-FE2-005)

---

## Plan Step 3: Hooks Layer (useAdminSSE)
- [x] 3.1 SSE 연결 - RED-GREEN-REFACTOR (TC-FE2-006)
- [x] 3.2 이벤트 핸들링 - RED-GREEN-REFACTOR (TC-FE2-007, TC-FE2-008)

---

## Plan Step 4: Components Layer

### LoginPage
- [x] 4.1 LoginPage 렌더링 - RED-GREEN-REFACTOR (TC-FE2-009)
- [x] 4.2 LoginPage 로그인 동작 - RED-GREEN-REFACTOR (TC-FE2-010, TC-FE2-011)

### DashboardPage
- [x] 4.3 DashboardPage 렌더링 - RED-GREEN-REFACTOR (TC-FE2-012)
- [x] 4.4 DashboardPage 모달 동작 - RED-GREEN-REFACTOR (TC-FE2-013)

### TableCard
- [x] 4.5 TableCard 렌더링 - RED-GREEN-REFACTOR (TC-FE2-014)
- [x] 4.6 TableCard 지연 강조 - RED-GREEN-REFACTOR (TC-FE2-015)

### OrderDetailModal
- [x] 4.7 OrderDetailModal 렌더링 - RED-GREEN-REFACTOR (TC-FE2-016)
- [x] 4.8 OrderDetailModal 상태 변경 - RED-GREEN-REFACTOR (TC-FE2-017)
- [x] 4.9 OrderDetailModal 삭제/완료 - RED-GREEN-REFACTOR (TC-FE2-018, TC-FE2-019)

### TableHistoryModal
- [x] 4.10 TableHistoryModal - RED-GREEN-REFACTOR (TC-FE2-020)

---

## Plan Step 5: Integration & Pages
- [x] 5.1 Admin 라우트 설정 (`/admin/login`, `/admin/dashboard`)
- [x] 5.2 인증 가드 (미인증 시 로그인 페이지로 리다이렉트)
- [x] 5.3 전체 통합 테스트 (29개 테스트 통과)

---

## Plan Step 6: Documentation
- [x] 6.1 README.md 업데이트
- [x] 6.2 코드 요약 문서 생성 (`aidlc-docs/construction/fe-2/code/`)

---

## Summary
- **Total Steps**: 6 Plan Steps
- **Total Sub-steps**: 25
- **Test Cases**: 20
- **Stories Covered**: US-2.1~US-2.5, US-3.2~US-3.3

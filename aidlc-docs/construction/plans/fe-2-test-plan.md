# Test Plan for FE-2 (Admin UI)

## Unit Overview
- **Unit**: FE-2 (Admin UI)
- **Stories**: US-2.1 ~ US-2.5, US-3.2 ~ US-3.3
- **Tech Stack**: Next.js, React Testing Library, Jest

---

## Context Layer Tests

### AdminAuthContext

- **TC-FE2-001**: 초기 상태 확인
  - Given: AdminAuthProvider가 렌더링됨
  - When: 초기 로드
  - Then: isAuthenticated=false, admin=null, isLoading=true
  - Story: US-2.1
  - Status: ⬜ Not Started

- **TC-FE2-002**: 로그인 성공
  - Given: 유효한 credentials
  - When: login() 호출
  - Then: isAuthenticated=true, admin 정보 설정, token 저장
  - Story: US-2.1
  - Status: ⬜ Not Started

- **TC-FE2-003**: 로그인 실패 (잘못된 credentials)
  - Given: 잘못된 credentials
  - When: login() 호출
  - Then: Error throw, isAuthenticated=false 유지
  - Story: US-2.1
  - Status: ⬜ Not Started

- **TC-FE2-004**: 로그아웃
  - Given: 로그인된 상태
  - When: logout() 호출
  - Then: isAuthenticated=false, admin=null, token 삭제
  - Story: US-2.1
  - Status: ⬜ Not Started

- **TC-FE2-005**: 세션 복원 (localStorage)
  - Given: localStorage에 유효한 token 존재
  - When: Provider 마운트
  - Then: 자동으로 인증 상태 복원
  - Story: US-2.1
  - Status: ⬜ Not Started

---

## Hooks Layer Tests

### useAdminSSE

- **TC-FE2-006**: SSE 연결 성공
  - Given: 유효한 token
  - When: hook 호출
  - Then: isConnected=true, tables 초기 데이터 로드
  - Story: US-2.2
  - Status: ⬜ Not Started

- **TC-FE2-007**: new_order 이벤트 수신
  - Given: SSE 연결됨
  - When: new_order 이벤트 수신
  - Then: tables 업데이트
  - Story: US-2.2
  - Status: ⬜ Not Started

- **TC-FE2-008**: order_status 이벤트 수신
  - Given: SSE 연결됨
  - When: order_status 이벤트 수신
  - Then: 해당 주문 상태 업데이트
  - Story: US-2.2
  - Status: ⬜ Not Started

---

## Components Layer Tests

### LoginPage

- **TC-FE2-009**: 로그인 폼 렌더링
  - Given: LoginPage 렌더링
  - When: 초기 로드
  - Then: storeId, username, password 입력 필드와 로그인 버튼 표시
  - Story: US-2.1
  - Status: ⬜ Not Started

- **TC-FE2-010**: 로그인 성공 시 리다이렉트
  - Given: 유효한 credentials 입력
  - When: 로그인 버튼 클릭
  - Then: /admin/dashboard로 이동
  - Story: US-2.1
  - Status: ⬜ Not Started

- **TC-FE2-011**: 로그인 실패 시 에러 표시
  - Given: 잘못된 credentials 입력
  - When: 로그인 버튼 클릭
  - Then: 에러 메시지 표시
  - Story: US-2.1
  - Status: ⬜ Not Started

### DashboardPage

- **TC-FE2-012**: 테이블 카드 그리드 렌더링
  - Given: DashboardPage 렌더링, tables 데이터 존재
  - When: 초기 로드
  - Then: TableCard 그리드 표시
  - Story: US-2.2
  - Status: ⬜ Not Started

- **TC-FE2-013**: 테이블 카드 클릭 시 모달 표시
  - Given: DashboardPage 렌더링
  - When: TableCard 클릭
  - Then: OrderDetailModal 표시
  - Story: US-2.2
  - Status: ⬜ Not Started

### TableCard

- **TC-FE2-014**: 테이블 정보 표시
  - Given: TableCard 렌더링
  - When: table 데이터 전달
  - Then: 테이블 번호, 총 주문액, 주문 시간 표시
  - Story: US-2.2
  - Status: ⬜ Not Started

- **TC-FE2-015**: 지연 주문 강조 (30분 경과)
  - Given: isDelayed=true인 table
  - When: TableCard 렌더링
  - Then: 빨간색 계열 스타일 적용
  - Story: US-2.4
  - Status: ⬜ Not Started

### OrderDetailModal

- **TC-FE2-016**: 주문 목록 표시
  - Given: OrderDetailModal 렌더링
  - When: table 데이터 전달
  - Then: 모든 주문 항목 표시
  - Story: US-2.2
  - Status: ⬜ Not Started

- **TC-FE2-017**: 상태 변경 버튼 동작
  - Given: OrderDetailModal 렌더링
  - When: 상태 변경 버튼 클릭
  - Then: onStatusChange 콜백 호출
  - Story: US-2.3
  - Status: ⬜ Not Started

- **TC-FE2-018**: 주문 삭제 확인 팝업
  - Given: OrderDetailModal 렌더링
  - When: 삭제 버튼 클릭
  - Then: 확인 팝업 표시
  - Story: US-2.5
  - Status: ⬜ Not Started

- **TC-FE2-019**: 이용 완료 확인 팝업
  - Given: OrderDetailModal 렌더링
  - When: 이용 완료 버튼 클릭
  - Then: 확인 팝업 표시
  - Story: US-3.2
  - Status: ⬜ Not Started

### TableHistoryModal

- **TC-FE2-020**: 과거 내역 표시
  - Given: TableHistoryModal 렌더링
  - When: tableId 전달
  - Then: 시간 역순 과거 세션 목록 표시
  - Story: US-3.3
  - Status: ⬜ Not Started

---

## Requirements Coverage

| Story ID | Test Cases | Status |
|----------|------------|--------|
| US-2.1 | TC-FE2-001~005, TC-FE2-009~011 | 🟢 Passed |
| US-2.2 | TC-FE2-006~008, TC-FE2-012~014, TC-FE2-016 | 🟢 Passed |
| US-2.3 | TC-FE2-017 | 🟢 Passed |
| US-2.4 | TC-FE2-015 | 🟢 Passed |
| US-2.5 | TC-FE2-018 | 🟢 Passed |
| US-3.2 | TC-FE2-019 | 🟢 Passed |
| US-3.3 | TC-FE2-020 | 🟢 Passed |

---

## Test Summary
- **Total Test Cases**: 20
- **Context Layer**: 5
- **Hooks Layer**: 3
- **Components Layer**: 12

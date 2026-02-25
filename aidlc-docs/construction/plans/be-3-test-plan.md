# Test Plan for BE-3 (Table + SSE)

**Unit**: BE-3  
**담당자**: 개발자 C  
**생성일**: 2026-02-25

---

## Unit Overview
- **Unit**: BE-3 (Table + SSE)
- **Stories**: US-2.2, US-2.3, US-3.2, US-3.3
- **Requirements**: 테이블 세션 관리, 실시간 이벤트 브로드캐스트

---

## Repository Layer Tests

### TableRepository

#### findById()
- **TC-BE3-001**: 존재하는 테이블 ID로 조회 시 테이블 반환
  - Given: DB에 테이블 (id: 'table-1') 존재
  - When: findById('table-1') 호출
  - Then: Table 객체 반환
  - Status: ⬜ Not Started

- **TC-BE3-002**: 존재하지 않는 테이블 ID로 조회 시 null 반환
  - Given: DB에 해당 테이블 없음
  - When: findById('non-existent') 호출
  - Then: null 반환
  - Status: ⬜ Not Started

#### updateSession()
- **TC-BE3-003**: 테이블 세션 업데이트 성공
  - Given: DB에 테이블 존재
  - When: updateSession('table-1', 'session-new') 호출
  - Then: 테이블의 currentSessionId가 'session-new'로 변경
  - Status: ⬜ Not Started

---

### SessionRepository

#### create()
- **TC-BE3-004**: 새 세션 생성 시 UUID 발급
  - Given: tableId 제공
  - When: create('table-1') 호출
  - Then: UUID 형식의 id를 가진 Session 반환
  - Status: ⬜ Not Started

#### findById()
- **TC-BE3-005**: 존재하는 세션 ID로 조회 시 세션 반환
  - Given: DB에 세션 존재
  - When: findById('session-1') 호출
  - Then: Session 객체 반환
  - Status: ⬜ Not Started

#### complete()
- **TC-BE3-006**: 세션 완료 처리 시 completedAt 설정
  - Given: DB에 활성 세션 존재
  - When: complete('session-1') 호출
  - Then: 세션의 completedAt이 현재 시간으로 설정
  - Status: ⬜ Not Started

#### findCompletedByTableId()
- **TC-BE3-007**: 테이블의 완료된 세션 목록 조회 (최신순)
  - Given: DB에 완료된 세션 2개 존재
  - When: findCompletedByTableId('table-1') 호출
  - Then: 최신순으로 정렬된 PastSession[] 반환
  - Status: ⬜ Not Started

---

## Service Layer Tests

### TableService

#### getTableById()
- **TC-BE3-008**: 존재하는 테이블 조회 성공
  - Given: tableRepo.findById가 Table 반환
  - When: getTableById('table-1') 호출
  - Then: Table 객체 반환
  - Story: US-3.2
  - Status: ⬜ Not Started

#### createSession()
- **TC-BE3-009**: 새 세션 생성 성공
  - Given: 테이블 존재
  - When: createSession('table-1') 호출
  - Then: 새 Session 생성, 테이블의 currentSessionId 업데이트
  - Story: US-3.1 (BE-1 연동)
  - Status: ⬜ Not Started

- **TC-BE3-010**: 존재하지 않는 테이블에 세션 생성 시 404 에러
  - Given: tableRepo.findById가 null 반환
  - When: createSession('non-existent') 호출
  - Then: AppError(404, 'Table not found') throw
  - Story: US-3.1 (BE-1 연동)
  - Status: ⬜ Not Started

#### completeTableSession()
- **TC-BE3-011**: 테이블 이용 완료 성공
  - Given: 테이블에 활성 세션 존재
  - When: completeTableSession('table-1') 호출
  - Then: 현재 세션 완료 (completedAt 설정), 테이블 currentSessionId = null
  - Story: US-3.2
  - Status: ⬜ Not Started

- **TC-BE3-012**: 존재하지 않는 테이블 완료 시 404 에러
  - Given: tableRepo.findById가 null 반환
  - When: completeTableSession('non-existent') 호출
  - Then: AppError(404, 'Table not found') throw
  - Story: US-3.2
  - Status: ⬜ Not Started

- **TC-BE3-013**: 활성 세션 없는 테이블 완료 시 400 에러
  - Given: 테이블의 currentSessionId가 null
  - When: completeTableSession('table-1') 호출
  - Then: AppError(400, 'No active session') throw
  - Story: US-3.2
  - Status: ⬜ Not Started

#### getTableHistory()
- **TC-BE3-014**: 테이블 과거 내역 조회 성공
  - Given: 테이블 존재, 완료된 세션 있음
  - When: getTableHistory('table-1') 호출
  - Then: PastSession[] 반환 (orders 포함)
  - Story: US-3.3
  - Status: ⬜ Not Started

- **TC-BE3-015**: 존재하지 않는 테이블 내역 조회 시 404 에러
  - Given: tableRepo.findById가 null 반환
  - When: getTableHistory('non-existent') 호출
  - Then: AppError(404, 'Table not found') throw
  - Story: US-3.3
  - Status: ⬜ Not Started

---

### SSEService

#### addClient() / removeClient()
- **TC-BE3-016**: 클라이언트 추가 및 제거
  - Given: SSEService 인스턴스
  - When: addClient() 후 removeClient() 호출
  - Then: 클라이언트 수가 1 증가 후 0으로 감소
  - Story: US-2.2
  - Status: ⬜ Not Started

#### broadcastToStore()
- **TC-BE3-017**: 매장 admin 클라이언트에게 이벤트 전송
  - Given: storeId='store-1'인 admin 클라이언트 연결됨
  - When: broadcastToStore('store-1', 'new_order', data) 호출
  - Then: 해당 클라이언트에게 SSE 이벤트 전송
  - Story: US-2.2
  - Status: ⬜ Not Started

#### broadcastToSession()
- **TC-BE3-018**: 세션 customer 클라이언트에게 이벤트 전송
  - Given: sessionId='session-1'인 customer 클라이언트 연결됨
  - When: broadcastToSession('session-1', 'order_status', data) 호출
  - Then: 해당 클라이언트에게 SSE 이벤트 전송
  - Story: US-2.3
  - Status: ⬜ Not Started

---

## Controller Layer Tests

### TableController

#### completeTable()
- **TC-BE3-019**: POST /api/admin/tables/:id/complete 성공
  - Given: 유효한 tableId
  - When: POST 요청
  - Then: 200 { success: true }
  - Story: US-3.2
  - Status: ⬜ Not Started

- **TC-BE3-020**: POST /api/admin/tables/:id/complete 404 에러
  - Given: 존재하지 않는 tableId
  - When: POST 요청
  - Then: 404 에러 응답
  - Story: US-3.2
  - Status: ⬜ Not Started

#### getTableHistory()
- **TC-BE3-021**: GET /api/admin/tables/:id/history 성공
  - Given: 유효한 tableId
  - When: GET 요청
  - Then: 200 { sessions: PastSession[] }
  - Story: US-3.3
  - Status: ⬜ Not Started

---

### SSEController

#### customerSSE()
- **TC-BE3-022**: GET /api/customer/sse/orders SSE 연결 성공
  - Given: 유효한 sessionId query
  - When: GET 요청
  - Then: SSE 스트림 연결, Content-Type: text/event-stream
  - Story: US-2.3
  - Status: ⬜ Not Started

#### adminSSE()
- **TC-BE3-023**: GET /api/admin/sse/orders SSE 연결 성공
  - Given: 유효한 storeId query
  - When: GET 요청
  - Then: SSE 스트림 연결, Content-Type: text/event-stream
  - Story: US-2.2
  - Status: ⬜ Not Started

---

## Requirements Coverage

| Story | Test Cases | Status |
|-------|------------|--------|
| US-2.2 | TC-BE3-016, TC-BE3-017, TC-BE3-023 | 🟢 Passed |
| US-2.3 | TC-BE3-018, TC-BE3-022 | 🟢 Passed |
| US-3.1 | TC-BE3-009, TC-BE3-010 | 🟢 Passed |
| US-3.2 | TC-BE3-008, TC-BE3-011~013, TC-BE3-019~020 | 🟢 Passed |
| US-3.3 | TC-BE3-014~015, TC-BE3-021 | 🟢 Passed |

---

## Test Summary

| Layer | Test Cases | Status |
|-------|------------|--------|
| Repository | 7 | 🟢 Passed |
| Service | 11 | 🟢 Passed |
| Controller | 5 | 🟢 Passed |
| **Total** | **23** | 🟢 Passed |

# TDD Code Generation Plan for BE-3 (Table + SSE)

**Unit**: BE-3  
**담당자**: 개발자 C  
**생성일**: 2026-02-25

---

## Unit Context
- **Workspace Root**: `/Users/go/Project/Lets-Go`
- **Project Type**: Greenfield (monolith)
- **Code Location**: `apps/backend/src/`
- **Test Location**: `apps/backend/tests/`
- **Stories**: US-2.2, US-2.3, US-3.2, US-3.3

---

## Plan Step 0: Project Structure & Contract Skeleton Generation
- [x] 0.1: 프로젝트 기본 구조 생성 (apps/backend/)
- [x] 0.2: 공통 유틸리티 생성 (response.ts, error.ts)
- [x] 0.3: 타입 정의 생성 (types/index.ts)
- [x] 0.4: Repository 스켈레톤 생성 (NotImplementedError)
- [x] 0.5: Service 스켈레톤 생성 (NotImplementedError)
- [x] 0.6: Controller 스켈레톤 생성 (NotImplementedError)
- [x] 0.7: Routes 스켈레톤 생성
- [x] 0.8: 컴파일 검증

---

## Plan Step 1: Repository Layer (TDD)

### TableRepository
- [x] 1.1: TableRepository.findById() - RED-GREEN-REFACTOR
  - [x] RED: TC-BE3-001, TC-BE3-002 테스트 작성
  - [x] GREEN: 최소 구현
  - [x] REFACTOR: 코드 개선
  - [x] VERIFY: 테스트 통과 확인

- [x] 1.2: TableRepository.updateSession() - RED-GREEN-REFACTOR
  - [x] RED: TC-BE3-003 테스트 작성
  - [x] GREEN: 최소 구현
  - [x] REFACTOR: 코드 개선
  - [x] VERIFY: 테스트 통과 확인

### SessionRepository
- [x] 1.3: SessionRepository.create() - RED-GREEN-REFACTOR
  - [x] RED: TC-BE3-004 테스트 작성
  - [x] GREEN: 최소 구현
  - [x] REFACTOR: 코드 개선
  - [x] VERIFY: 테스트 통과 확인

- [x] 1.4: SessionRepository.findById() - RED-GREEN-REFACTOR
  - [x] RED: TC-BE3-005 테스트 작성
  - [x] GREEN: 최소 구현
  - [x] REFACTOR: 코드 개선
  - [x] VERIFY: 테스트 통과 확인

- [x] 1.5: SessionRepository.complete() - RED-GREEN-REFACTOR
  - [x] RED: TC-BE3-006 테스트 작성
  - [x] GREEN: 최소 구현
  - [x] REFACTOR: 코드 개선
  - [x] VERIFY: 테스트 통과 확인

- [x] 1.6: SessionRepository.findCompletedByTableId() - RED-GREEN-REFACTOR
  - [x] RED: TC-BE3-007 테스트 작성
  - [x] GREEN: 최소 구현
  - [x] REFACTOR: 코드 개선
  - [x] VERIFY: 테스트 통과 확인

---

## Plan Step 2: Service Layer (TDD)

### TableService
- [x] 2.1: TableService.getTableById() - RED-GREEN-REFACTOR
  - [x] RED: TC-BE3-008 테스트 작성
  - [x] GREEN: 최소 구현
  - [x] REFACTOR: 코드 개선
  - [x] VERIFY: 테스트 통과 확인
  - Story: US-3.2

- [x] 2.2: TableService.createSession() - RED-GREEN-REFACTOR
  - [x] RED: TC-BE3-009, TC-BE3-010 테스트 작성
  - [x] GREEN: 최소 구현
  - [x] REFACTOR: 코드 개선
  - [x] VERIFY: 테스트 통과 확인
  - Story: US-3.1 (BE-1 연동)

- [x] 2.3: TableService.completeTableSession() - RED-GREEN-REFACTOR
  - [x] RED: TC-BE3-011, TC-BE3-012, TC-BE3-013 테스트 작성
  - [x] GREEN: 최소 구현
  - [x] REFACTOR: 코드 개선
  - [x] VERIFY: 테스트 통과 확인
  - Story: US-3.2

- [x] 2.4: TableService.getTableHistory() - RED-GREEN-REFACTOR
  - [x] RED: TC-BE3-014, TC-BE3-015 테스트 작성
  - [x] GREEN: 최소 구현
  - [x] REFACTOR: 코드 개선
  - [x] VERIFY: 테스트 통과 확인
  - Story: US-3.3

### SSEService
- [x] 2.5: SSEService.addClient/removeClient() - RED-GREEN-REFACTOR
  - [x] RED: TC-BE3-016 테스트 작성
  - [x] GREEN: 최소 구현
  - [x] REFACTOR: 코드 개선
  - [x] VERIFY: 테스트 통과 확인
  - Story: US-2.2

- [x] 2.6: SSEService.broadcastToStore() - RED-GREEN-REFACTOR
  - [x] RED: TC-BE3-017 테스트 작성
  - [x] GREEN: 최소 구현
  - [x] REFACTOR: 코드 개선
  - [x] VERIFY: 테스트 통과 확인
  - Story: US-2.2

- [x] 2.7: SSEService.broadcastToSession() - RED-GREEN-REFACTOR
  - [x] RED: TC-BE3-018 테스트 작성
  - [x] GREEN: 최소 구현
  - [x] REFACTOR: 코드 개선
  - [x] VERIFY: 테스트 통과 확인
  - Story: US-2.3

---

## Plan Step 3: Controller Layer (TDD)

### TableController
- [x] 3.1: TableController.completeTable() - RED-GREEN-REFACTOR
  - [x] RED: TC-BE3-019, TC-BE3-020 테스트 작성
  - [x] GREEN: 최소 구현
  - [x] REFACTOR: 코드 개선
  - [x] VERIFY: 테스트 통과 확인
  - Story: US-3.2

- [x] 3.2: TableController.getTableHistory() - RED-GREEN-REFACTOR
  - [x] RED: TC-BE3-021 테스트 작성
  - [x] GREEN: 최소 구현
  - [x] REFACTOR: 코드 개선
  - [x] VERIFY: 테스트 통과 확인
  - Story: US-3.3

### SSEController
- [x] 3.3: SSEController.customerSSE() - RED-GREEN-REFACTOR
  - [x] RED: TC-BE3-022 테스트 작성
  - [x] GREEN: 최소 구현
  - [x] REFACTOR: 코드 개선
  - [x] VERIFY: 테스트 통과 확인
  - Story: US-2.3

- [x] 3.4: SSEController.adminSSE() - RED-GREEN-REFACTOR
  - [x] RED: TC-BE3-023 테스트 작성
  - [x] GREEN: 최소 구현
  - [x] REFACTOR: 코드 개선
  - [x] VERIFY: 테스트 통과 확인
  - Story: US-2.2

---

## Plan Step 4: Routes & Integration
- [x] 4.1: Table Routes 연결
- [x] 4.2: SSE Routes 연결
- [x] 4.3: App에 라우터 등록
- [x] 4.4: 전체 테스트 실행 및 검증

---

## Plan Step 5: Documentation
- [x] 5.1: BE-3 코드 요약 문서 생성 (aidlc-docs/construction/be-3/code/)

---

## Progress Summary

| Step | Description | Status |
|------|-------------|--------|
| 0 | Project Structure & Skeleton | ✅ Complete |
| 1 | Repository Layer TDD | ✅ Complete |
| 2 | Service Layer TDD | ✅ Complete |
| 3 | Controller Layer TDD | ✅ Complete |
| 4 | Routes & Integration | ✅ Complete |
| 5 | Documentation | ✅ Complete |

---

## Story Completion Tracking

| Story | Related Steps | Status |
|-------|---------------|--------|
| US-2.2 | 2.5, 2.6, 3.4 | ✅ Complete |
| US-2.3 | 2.7, 3.3 | ✅ Complete |
| US-3.1 | 2.2 (BE-1 연동) | ✅ Complete |
| US-3.2 | 2.1, 2.3, 3.1 | ✅ Complete |
| US-3.3 | 2.4, 3.2 | ✅ Complete |

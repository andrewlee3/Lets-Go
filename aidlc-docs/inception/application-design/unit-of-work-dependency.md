# Unit of Work - Dependency

**프로젝트**: 테이블오더 서비스  
**생성일**: 2026-02-25  
**최종 수정**: 2026-02-25  
**팀 구성**: BE 3명, FE 1명 (총 4명)

---

## 개발 전략: 완전 병렬 개발

**핵심 결정사항:**
- Shared Types: Phase 2에서 추출 (리팩토링)
- Auth: Phase 1에서 병렬 개발, 완료 시 즉시 적용
- 각 Unit은 `// TODO: [AUTH]`, `// TODO: [SHARED]` 주석으로 의존성 표시

---

## 담당자 배정

| 담당자 | Unit | 역할 |
|-------|------|------|
| 개발자 A | BE-1 | Auth 모듈 |
| 개발자 B | BE-2 | Menu + Order |
| 개발자 C | BE-3 | Table + SSE |
| 개발자 D | FE-1 + FE-2 | Customer + Admin UI |

---

## Phase 1: 병렬 개발 (4명 동시)

```
개발자 A: BE-1 (Auth) ─────────────────────►
개발자 B: BE-2 (Menu/Order, TODO Auth) ────►
개발자 C: BE-3 (Table/SSE, TODO Auth) ─────►
개발자 D: FE-1 + FE-2 (Mock API) ──────────►
```

| Unit | 담당자 | 작업 내용 | TODO 처리 |
|------|-------|----------|----------|
| BE-1 | A | Auth 모듈 개발 | 완료 시 B, C에게 전달 |
| BE-2 | B | Menu/Order API | `// TODO: [AUTH]` 주석 |
| BE-3 | C | Table/SSE API | `// TODO: [AUTH]` 주석 |
| FE-1, FE-2 | D | UI 개발 (Mock API) | Mock 데이터 사용 |

**BE-1 Auth 완료 시**: BE-2, BE-3에 즉시 Auth 미들웨어 적용

---

## Phase 2: 통합

| 작업 | 담당 | 내용 |
|-----|------|------|
| Shared Types 추출 | 전원 | 공통 타입 리팩토링 |
| Auth 적용 | B, C | TODO → 실제 미들웨어 |
| FE ↔ BE 연동 | D | Mock → 실제 API |

---

## Phase 3: 통합 테스트

| 작업 | 담당 |
|-----|------|
| E2E 테스트 | 전원 |
| 버그 수정 | 해당 Unit 담당자 |

---

## TODO 주석 컨벤션

```go
// TODO: [AUTH] 인증 미들웨어 적용 필요
// TODO: [SHARED] 공통 타입으로 리팩토링 필요
```

---

## 의존성 매트릭스 (Phase 1 기준)

```
        BE-1  BE-2  BE-3  FE-1  FE-2
BE-1     -     
BE-2     -      -
BE-3     -      -      -
FE-1     -      -      -      -
FE-2     -      -      -      -      -

- = Phase 1에서는 의존성 없음 (TODO로 처리)
```

---

## 블로커 해소 전략

| 기존 블로커 | 해결 방법 |
|-----------|----------|
| Shared Types | Phase 2에서 추출 |
| Auth 미들웨어 | TODO 주석 → BE-1 완료 시 적용 |
| Backend API | FE는 Mock API로 선개발 |

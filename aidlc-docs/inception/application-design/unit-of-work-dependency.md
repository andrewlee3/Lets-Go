# Unit of Work - Dependency

**프로젝트**: 테이블오더 서비스  
**생성일**: 2026-02-25

---

## 의존성 매트릭스

```
        BE-1  BE-2  BE-3  FE-1  FE-2
BE-1     -     
BE-2    ✓      -
BE-3    ✓     ✓      -
FE-1    ✓     ✓            -
FE-2    ✓     ✓     ✓     ✓      -

✓ = 의존함
```

| Unit | 의존 대상 | 의존 내용 |
|------|----------|----------|
| BE-1 | 없음 | 독립 |
| BE-2 | BE-1 | Shared Types, Auth 미들웨어 |
| BE-3 | BE-1, BE-2 | Auth 미들웨어, Order 이벤트 |
| FE-1 | BE-1, BE-2 | Auth API, Menu API, Order API |
| FE-2 | BE-1, BE-2, BE-3, FE-1 | 모든 API + 공통 컴포넌트 |

---

## 개발 순서 (Critical Path)

```
Phase 1 (Day 1)
├── BE-1: Shared Types + Auth ──────────┐
├── BE-2: Menu (Shared Types 대기) ─────┼── 병렬
└── BE-3: SSE 구조 (Auth 대기) ─────────┘

Phase 2 (Day 2)
├── BE-2: Order (Auth 완료 후) ─────────┐
├── BE-3: Table + SSE 연동 ─────────────┼── 병렬
└── FE: Customer UI (Mock API) ─────────┘

Phase 3 (Day 3-4)
├── FE-1: Customer 연동 ────────────────┐
└── FE-2: Admin UI + 연동 ──────────────┘── 순차

Phase 4 (Day 5)
└── 통합 테스트
```

---

## 병렬 진행 가능 조합

| 조합 | 가능 여부 | 비고 |
|-----|----------|------|
| BE-1 + BE-2 + BE-3 | ⚠️ 부분 | BE-2, BE-3는 Shared Types 완료 후 |
| BE-1 + FE (Mock) | ✅ | FE는 Mock API로 UI 먼저 개발 |
| BE-2 + BE-3 | ✅ | BE-1 완료 후 완전 병렬 |
| FE-1 + FE-2 | ❌ | 순차 (공통 컴포넌트 재사용) |

---

## 블로커 (Blocker) 식별

| 블로커 | 영향 받는 Unit | 해결 방법 |
|-------|---------------|----------|
| Shared Types 미완료 | BE-2, BE-3 | BE-1 우선 완료 (0.5일) |
| Auth 미들웨어 미완료 | BE-2, BE-3 | BE-1 우선 완료 (1일) |
| Order API 미완료 | BE-3 (SSE 이벤트) | BE-2 Order 먼저 |
| Backend API 미완료 | FE-1, FE-2 | Mock API로 UI 선개발 |

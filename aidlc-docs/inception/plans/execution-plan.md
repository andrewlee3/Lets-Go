# Execution Plan

**프로젝트**: 테이블오더 서비스  
**최종 수정**: 2026-02-25  
**팀 구성**: BE 3명, FE 1명 (총 4명)

---

## 개발 전략

**4명 완전 병렬 개발 → 통합 → 테스트**

```
Phase 1: 병렬 개발 (4명 동시)
┌────────────────────────────────────────────┐
│ 개발자 A: BE-1 (Auth)                       │
│ 개발자 B: BE-2 (Menu/Order)                 │
│ 개발자 C: BE-3 (Table/SSE)                  │
│ 개발자 D: FE-1 + FE-2 (Mock API)            │
└──────────────────┬─────────────────────────┘
                   │
                   ▼
Phase 2: 통합
┌────────────────────────────────────────────┐
│ - Shared Types 추출                         │
│ - Auth 미들웨어 적용                         │
│ - FE ↔ BE 연동                              │
└──────────────────┬─────────────────────────┘
                   │
                   ▼
Phase 3: 통합 테스트
```

---

## Unit 구조

| Unit | 담당자 | 내용 |
|------|-------|------|
| BE-1 | 개발자 A | Auth 모듈 |
| BE-2 | 개발자 B | Menu + Order API |
| BE-3 | 개발자 C | Table + SSE API |
| FE-1, FE-2 | 개발자 D | Customer + Admin UI |

---

## 완료된 단계

- [x] Requirements Analysis
- [x] User Stories (14개, 57 AC)
- [x] Application Design
- [x] API Contract
- [x] Units Generation
- [ ] Code Generation
- [ ] Build and Test

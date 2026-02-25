# Execution Plan

**프로젝트**: 테이블오더 서비스  
**최종 수정**: 2026-02-25  
**팀 구성**: PM 1, BE 1, FE 1, QA 1

---

## 개발 전략

**API 명세 먼저 확정 → Backend/Frontend 병렬 개발**

```
┌─────────────────────────────────────┐
│ API Contract (완료)                  │
│ - Shared Types                      │
│ - API Endpoints (11개)              │
└──────────────┬──────────────────────┘
               │
      ┌────────┴────────┐
      ↓                 ↓
┌───────────┐    ┌───────────┐
│ Backend   │    │ Frontend  │
│ (BE 담당)  │    │ (FE 담당)  │
└─────┬─────┘    └─────┬─────┘
      │                │
      └────────┬───────┘
               ↓
        ┌───────────┐
        │ 통합/테스트 │
        │ (QA 담당)  │
        └───────────┘
```

---

## Unit 구조

| Unit | 담당 | 내용 |
|------|-----|------|
| Unit 1 | Backend 개발자 | Express API, SQLite, SSE |
| Unit 2 | Frontend 개발자 | Next.js (Customer + Admin) |

---

## 완료된 단계

- [x] Requirements Analysis
- [x] User Stories (14개, 57 AC)
- [x] Application Design
- [x] API Contract
- [ ] Units Generation (진행 중)
- [ ] Code Generation
- [ ] Build and Test

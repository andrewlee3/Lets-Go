# 세션 재개 컨텍스트

**마지막 작업 시간**: 2026-02-25T16:37:46+09:00

## 프로젝트 현황

### 완료된 Unit
| Unit | 담당 | 상태 | 테스트 |
|------|------|------|--------|
| BE-1 | Auth + Shared Types | ✅ 완료 | 20개 통과 |
| BE-3 | Table + SSE | ✅ 완료 | 21개 통과 |

### 미완료 Unit
| Unit | 담당 | 상태 | 참고 문서 |
|------|------|------|----------|
| BE-2 | Menu + Order | ⬜ 미시작 | `unit-of-work.md` |
| FE-1 | Customer UI | ⬜ 미시작 | `unit-of-work.md` |
| FE-2 | Admin UI | ⬜ 미시작 | `unit-of-work.md` |

## BE-2 작업 범위 (다음 작업 후보)

**담당**: Menu + Order API

**포함 항목**:
- MenuController, MenuService
- OrderController, OrderService
- 샘플 메뉴 초기화
- 주문 생성/조회/상태변경/삭제

**API**:
- GET /api/customer/menus
- POST /api/customer/orders
- GET /api/customer/orders
- GET /api/admin/orders
- PATCH /api/admin/orders/:id/status
- DELETE /api/admin/orders/:id

**의존성**: BE-1 Auth 완료됨 ✅

## 코드베이스 구조

```
backend/
├── src/
│   ├── controllers/
│   │   ├── auth.controller.ts    # BE-1
│   │   ├── table.controller.ts   # BE-3
│   │   └── sse.controller.ts     # BE-3
│   ├── services/
│   │   ├── auth.service.ts       # BE-1
│   │   ├── table.service.ts      # BE-3
│   │   └── sse.service.ts        # BE-3
│   ├── repositories/
│   │   ├── auth.repository.ts    # BE-1
│   │   ├── table.repository.ts   # BE-3
│   │   └── session.repository.ts # BE-3
│   ├── middlewares/
│   │   ├── auth.middleware.ts    # BE-3 (Auth 적용)
│   │   └── error.middleware.ts   # BE-1
│   ├── routes/
│   │   ├── index.ts              # 통합 라우터
│   │   ├── auth.routes.ts        # BE-1
│   │   ├── table.routes.ts       # BE-3
│   │   └── sse.routes.ts         # BE-3
│   ├── database/index.ts         # In-memory DB
│   └── types/index.ts            # 공유 타입
└── tests/
    ├── unit/
    │   ├── auth.service.test.ts
    │   ├── table.service.test.ts
    │   └── sse.service.test.ts
    └── integration/
        ├── auth.test.ts
        └── table-sse.test.ts
```

## 참고 문서

- 요구사항: `aidlc-docs/inception/requirements/requirements.md`
- User Stories: `aidlc-docs/inception/user-stories/stories.md`
- API Contract: `aidlc-docs/inception/application-design/api-contract.md`
- Coding Conventions: `aidlc-docs/inception/application-design/coding-conventions.md`
- Unit of Work: `aidlc-docs/inception/application-design/unit-of-work.md`

## 다음 세션 시작 방법

1. BE-2 진행 시: "BE-2 Unit의 Code Generation을 시작해줘"
2. FE-1 진행 시: "FE-1 Unit의 Code Generation을 시작해줘"
3. 전체 현황 확인: "현재 프로젝트 상태를 알려줘"

# TDD Code Generation Plan for BE-2 (Menu + Order)

**Unit**: BE-2  
**담당자**: 개발자 B  
**생성일**: 2026-02-25

---

## Unit Context

- **Workspace Root**: `/Users/andrew/IdeaProjects/Lets-Go`
- **Project Type**: Greenfield
- **Code Location**: `apps/backend/src/`
- **Test Location**: `apps/backend/tests/`

**Stories**:
- US-1.1: 메뉴 조회
- US-1.3: 주문 생성
- US-1.4: 주문 내역 조회
- US-2.2: 실시간 주문 모니터링
- US-2.3: 주문 상태 변경
- US-2.5: 주문 삭제
- US-4.1: 샘플 메뉴 데이터

---

## Plan Step 0: Project Setup & Contract Skeleton

- [x] 0.1: 프로젝트 구조 생성
  - `apps/backend/package.json`
  - `apps/backend/tsconfig.json`
  - `apps/backend/jest.config.js`
- [x] 0.2: 타입 정의 생성
  - `apps/backend/src/types/index.ts`
- [x] 0.3: 유틸리티 생성
  - `apps/backend/src/utils/response.ts`
  - `apps/backend/src/utils/errors.ts`
- [x] 0.4: Repository 스켈레톤 생성
  - `apps/backend/src/repositories/menu.repository.ts`
  - `apps/backend/src/repositories/order.repository.ts`
- [x] 0.5: Service 스켈레톤 생성
  - `apps/backend/src/services/menu.service.ts`
  - `apps/backend/src/services/order.service.ts`
- [x] 0.6: Controller 스켈레톤 생성
  - `apps/backend/src/controllers/menu.controller.ts`
  - `apps/backend/src/controllers/order.controller.ts`
- [x] 0.7: 컴파일 검증

---

## Plan Step 1: Repository Layer (TDD)

### MenuRepository

- [ ] 1.1: MenuRepository.findAllCategories() - RED-GREEN-REFACTOR
  - [ ] RED: TC-BE2-001 테스트 작성 → 실패 확인
  - [ ] GREEN: 최소 구현
  - [ ] REFACTOR: 코드 개선
  - [ ] VERIFY: 테스트 통과 확인
  - Story: US-1.1

- [ ] 1.2: MenuRepository.findAllMenus() - RED-GREEN-REFACTOR
  - [ ] RED: TC-BE2-002 테스트 작성 → 실패 확인
  - [ ] GREEN: 최소 구현
  - [ ] REFACTOR: 코드 개선
  - [ ] VERIFY: 테스트 통과 확인
  - Story: US-1.1

- [ ] 1.3: MenuRepository.findMenusByCategory() - RED-GREEN-REFACTOR
  - [ ] RED: TC-BE2-003 테스트 작성 → 실패 확인
  - [ ] GREEN: 최소 구현
  - [ ] REFACTOR: 코드 개선
  - [ ] VERIFY: 테스트 통과 확인
  - Story: US-1.1

- [ ] 1.4: MenuRepository.findMenuById() - RED-GREEN-REFACTOR
  - [ ] RED: TC-BE2-004, TC-BE2-005 테스트 작성 → 실패 확인
  - [ ] GREEN: 최소 구현
  - [ ] REFACTOR: 코드 개선
  - [ ] VERIFY: 테스트 통과 확인
  - Story: US-1.3

- [ ] 1.5: MenuRepository.createCategory() & createMenu() - RED-GREEN-REFACTOR
  - [ ] RED: 테스트 작성 → 실패 확인
  - [ ] GREEN: 최소 구현
  - [ ] REFACTOR: 코드 개선
  - [ ] VERIFY: 테스트 통과 확인
  - Story: US-4.1

- [ ] 1.6: MenuRepository.countMenus() - RED-GREEN-REFACTOR
  - [ ] RED: 테스트 작성 → 실패 확인
  - [ ] GREEN: 최소 구현
  - [ ] REFACTOR: 코드 개선
  - [ ] VERIFY: 테스트 통과 확인
  - Story: US-4.1

### OrderRepository

- [ ] 1.7: OrderRepository.create() - RED-GREEN-REFACTOR
  - [ ] RED: TC-BE2-006 테스트 작성 → 실패 확인
  - [ ] GREEN: 최소 구현
  - [ ] REFACTOR: 코드 개선
  - [ ] VERIFY: 테스트 통과 확인
  - Story: US-1.3

- [ ] 1.8: OrderRepository.findBySessionId() - RED-GREEN-REFACTOR
  - [ ] RED: TC-BE2-007 테스트 작성 → 실패 확인
  - [ ] GREEN: 최소 구현
  - [ ] REFACTOR: 코드 개선
  - [ ] VERIFY: 테스트 통과 확인
  - Story: US-1.4

- [ ] 1.9: OrderRepository.updateStatus() - RED-GREEN-REFACTOR
  - [ ] RED: TC-BE2-008, TC-BE2-009 테스트 작성 → 실패 확인
  - [ ] GREEN: 최소 구현
  - [ ] REFACTOR: 코드 개선
  - [ ] VERIFY: 테스트 통과 확인
  - Story: US-2.3

- [ ] 1.10: OrderRepository.delete() - RED-GREEN-REFACTOR
  - [ ] RED: TC-BE2-010, TC-BE2-011 테스트 작성 → 실패 확인
  - [ ] GREEN: 최소 구현
  - [ ] REFACTOR: 코드 개선
  - [ ] VERIFY: 테스트 통과 확인
  - Story: US-2.5

---

## Plan Step 2: Service Layer (TDD)

### MenuService

- [ ] 2.1: MenuService.getAllMenus() - RED-GREEN-REFACTOR
  - [ ] RED: TC-BE2-012 테스트 작성 → 실패 확인
  - [ ] GREEN: 최소 구현
  - [ ] REFACTOR: 코드 개선
  - [ ] VERIFY: 테스트 통과 확인
  - Story: US-1.1

- [ ] 2.2: MenuService.initializeSampleMenus() - RED-GREEN-REFACTOR
  - [ ] RED: TC-BE2-013, TC-BE2-014 테스트 작성 → 실패 확인
  - [ ] GREEN: 최소 구현
  - [ ] REFACTOR: 코드 개선
  - [ ] VERIFY: 테스트 통과 확인
  - Story: US-4.1

### OrderService

- [ ] 2.3: OrderService.createOrder() - RED-GREEN-REFACTOR
  - [ ] RED: TC-BE2-015~018 테스트 작성 → 실패 확인
  - [ ] GREEN: 최소 구현 (validation 포함)
  - [ ] REFACTOR: 코드 개선
  - [ ] VERIFY: 테스트 통과 확인
  - Story: US-1.3

- [ ] 2.4: OrderService.getOrdersBySession() - RED-GREEN-REFACTOR
  - [ ] RED: TC-BE2-019 테스트 작성 → 실패 확인
  - [ ] GREEN: 최소 구현
  - [ ] REFACTOR: 코드 개선
  - [ ] VERIFY: 테스트 통과 확인
  - Story: US-1.4

- [ ] 2.5: OrderService.updateOrderStatus() - RED-GREEN-REFACTOR
  - [ ] RED: TC-BE2-020~022 테스트 작성 → 실패 확인
  - [ ] GREEN: 최소 구현
  - [ ] REFACTOR: 코드 개선
  - [ ] VERIFY: 테스트 통과 확인
  - Story: US-2.3

- [ ] 2.6: OrderService.deleteOrder() - RED-GREEN-REFACTOR
  - [ ] RED: TC-BE2-023, TC-BE2-024 테스트 작성 → 실패 확인
  - [ ] GREEN: 최소 구현
  - [ ] REFACTOR: 코드 개선
  - [ ] VERIFY: 테스트 통과 확인
  - Story: US-2.5

---

## Plan Step 3: Controller Layer (TDD)

### MenuController

- [ ] 3.1: GET /api/customer/menus - RED-GREEN-REFACTOR
  - [ ] RED: TC-BE2-025, TC-BE2-026 테스트 작성 → 실패 확인
  - [ ] GREEN: 최소 구현
  - [ ] REFACTOR: 코드 개선
  - [ ] VERIFY: 테스트 통과 확인
  - Story: US-1.1

### OrderController

- [ ] 3.2: POST /api/customer/orders - RED-GREEN-REFACTOR
  - [ ] RED: TC-BE2-027, TC-BE2-028 테스트 작성 → 실패 확인
  - [ ] GREEN: 최소 구현
  - [ ] REFACTOR: 코드 개선
  - [ ] VERIFY: 테스트 통과 확인
  - Story: US-1.3

- [ ] 3.3: GET /api/customer/orders - RED-GREEN-REFACTOR
  - [ ] RED: TC-BE2-029 테스트 작성 → 실패 확인
  - [ ] GREEN: 최소 구현
  - [ ] REFACTOR: 코드 개선
  - [ ] VERIFY: 테스트 통과 확인
  - Story: US-1.4

- [ ] 3.4: GET /api/admin/orders - RED-GREEN-REFACTOR
  - [ ] RED: TC-BE2-030 테스트 작성 → 실패 확인
  - [ ] GREEN: 최소 구현
  - [ ] REFACTOR: 코드 개선
  - [ ] VERIFY: 테스트 통과 확인
  - Story: US-2.2

- [ ] 3.5: PATCH /api/admin/orders/:id/status - RED-GREEN-REFACTOR
  - [ ] RED: TC-BE2-031, TC-BE2-032 테스트 작성 → 실패 확인
  - [ ] GREEN: 최소 구현
  - [ ] REFACTOR: 코드 개선
  - [ ] VERIFY: 테스트 통과 확인
  - Story: US-2.3

- [ ] 3.6: DELETE /api/admin/orders/:id - RED-GREEN-REFACTOR
  - [ ] RED: TC-BE2-033, TC-BE2-034 테스트 작성 → 실패 확인
  - [ ] GREEN: 최소 구현
  - [ ] REFACTOR: 코드 개선
  - [ ] VERIFY: 테스트 통과 확인
  - Story: US-2.5

---

## Plan Step 4: Integration & Routes

- [ ] 4.1: 라우터 설정
  - `apps/backend/src/routes/menu.routes.ts`
  - `apps/backend/src/routes/order.routes.ts`
  - `apps/backend/src/routes/index.ts`

- [ ] 4.2: App 설정
  - `apps/backend/src/app.ts`
  - `apps/backend/src/index.ts`

- [ ] 4.3: DB 초기화 스크립트
  - `apps/backend/src/db/init.ts`
  - `apps/backend/src/db/schema.sql`

- [ ] 4.4: 전체 테스트 실행 및 검증

---

## Plan Summary

| Step | 내용 | 테스트 수 |
|------|------|----------|
| Step 0 | Project Setup | - |
| Step 1 | Repository Layer | 11 |
| Step 2 | Service Layer | 13 |
| Step 3 | Controller Layer | 10 |
| Step 4 | Integration | - |
| **Total** | | **34** |

---

## File Structure (예상)

```
apps/backend/
├── package.json
├── tsconfig.json
├── jest.config.js
├── src/
│   ├── index.ts
│   ├── app.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── response.ts
│   │   └── errors.ts
│   ├── repositories/
│   │   ├── menu.repository.ts
│   │   └── order.repository.ts
│   ├── services/
│   │   ├── menu.service.ts
│   │   └── order.service.ts
│   ├── controllers/
│   │   ├── menu.controller.ts
│   │   └── order.controller.ts
│   ├── routes/
│   │   ├── menu.routes.ts
│   │   ├── order.routes.ts
│   │   └── index.ts
│   └── db/
│       ├── init.ts
│       └── schema.sql
└── tests/
    ├── unit/
    │   ├── repositories/
    │   │   ├── menu.repository.test.ts
    │   │   └── order.repository.test.ts
    │   └── services/
    │       ├── menu.service.test.ts
    │       └── order.service.test.ts
    └── integration/
        ├── menu.controller.test.ts
        └── order.controller.test.ts
```

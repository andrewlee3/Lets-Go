# Backend Coding Conventions

**프로젝트**: 테이블오더 서비스  
**생성일**: 2026-02-25  
**목적**: BE 3명 병렬 개발 시 코드 스타일 통일

---

## 1. 프로젝트 구조

```
apps/backend/
├── src/
│   ├── index.ts              # 앱 진입점
│   ├── app.ts                # Express 앱 설정
│   ├── routes/
│   │   └── index.ts          # 라우터 통합
│   ├── controllers/          # 요청/응답 처리
│   │   └── auth.controller.ts
│   ├── services/             # 비즈니스 로직
│   │   └── auth.service.ts
│   ├── middlewares/          # 미들웨어
│   │   └── auth.middleware.ts
│   ├── repositories/         # DB 접근
│   │   └── user.repository.ts
│   ├── types/                # 타입 정의
│   │   └── index.ts
│   └── utils/                # 유틸리티
│       └── response.ts
├── tests/
│   ├── unit/
│   └── integration/
└── package.json
```

---

## 2. 파일 네이밍

| 유형 | 패턴 | 예시 |
|-----|------|------|
| Controller | `{domain}.controller.ts` | `auth.controller.ts` |
| Service | `{domain}.service.ts` | `order.service.ts` |
| Repository | `{domain}.repository.ts` | `menu.repository.ts` |
| Middleware | `{name}.middleware.ts` | `auth.middleware.ts` |
| Type | `{domain}.types.ts` 또는 `index.ts` | `order.types.ts` |
| Test | `{name}.test.ts` | `auth.service.test.ts` |

---

## 3. Controller 패턴

```typescript
// controllers/order.controller.ts
import { Request, Response, NextFunction } from 'express';
import { OrderService } from '../services/order.service';
import { sendSuccess, sendError } from '../utils/response';

export class OrderController {
  constructor(private orderService: OrderService) {}

  createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { tableId } = req.user!; // TODO: [AUTH] 인증 미들웨어 적용 필요
      const { items } = req.body;
      
      const order = await this.orderService.create(tableId, items);
      sendSuccess(res, 201, order);
    } catch (error) {
      next(error);
    }
  };
}
```

**규칙:**
- 클래스 기반, 생성자에서 Service 주입
- 메서드는 arrow function (this 바인딩)
- try-catch로 감싸고 에러는 next()로 전달
- 비즈니스 로직은 Service에 위임

---

## 4. Service 패턴

```typescript
// services/order.service.ts
import { OrderRepository } from '../repositories/order.repository';
import { CreateOrderDto, Order } from '../types';

export class OrderService {
  constructor(private orderRepo: OrderRepository) {}

  async create(tableId: number, items: CreateOrderDto['items']): Promise<Order> {
    // 비즈니스 로직
    const order = await this.orderRepo.create({
      tableId,
      items,
      status: 'pending',
      createdAt: new Date(),
    });
    
    return order;
  }
}
```

**규칙:**
- 클래스 기반, 생성자에서 Repository 주입
- 비즈니스 로직만 담당
- DB 접근은 Repository에 위임

---

## 5. Repository 패턴

```typescript
// repositories/order.repository.ts
import { Database } from 'better-sqlite3';
import { Order, CreateOrderData } from '../types';

export class OrderRepository {
  constructor(private db: Database) {}

  create(data: CreateOrderData): Order {
    const stmt = this.db.prepare(`
      INSERT INTO orders (table_id, status, created_at)
      VALUES (?, ?, ?)
    `);
    const result = stmt.run(data.tableId, data.status, data.createdAt.toISOString());
    
    return { id: result.lastInsertRowid as number, ...data };
  }
}
```

**규칙:**
- 클래스 기반, 생성자에서 DB 인스턴스 주입
- SQL 쿼리만 담당
- 비즈니스 로직 없음

---

## 6. 라우터 패턴

```typescript
// routes/order.routes.ts
import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
// TODO: [AUTH] import { authMiddleware } from '../middlewares/auth.middleware';

export const createOrderRoutes = (controller: OrderController): Router => {
  const router = Router();

  // TODO: [AUTH] router.use(authMiddleware);
  router.post('/', controller.createOrder);
  router.get('/', controller.getOrders);

  return router;
};
```

---

## 7. 응답 유틸리티

```typescript
// utils/response.ts
import { Response } from 'express';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const sendSuccess = <T>(res: Response, status: number, data: T): void => {
  res.status(status).json({ success: true, data });
};

export const sendError = (res: Response, status: number, message: string): void => {
  res.status(status).json({ success: false, error: message });
};
```

---

## 8. 에러 처리

```typescript
// middlewares/error.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

export class AppError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof AppError) {
    sendError(res, err.statusCode, err.message);
    return;
  }
  
  console.error(err);
  sendError(res, 500, 'Internal Server Error');
};
```

---

## 9. 타입 정의

```typescript
// types/order.types.ts
export interface Order {
  id: number;
  tableId: number;
  status: OrderStatus;
  items: OrderItem[];
  createdAt: Date;
}

export type OrderStatus = 'pending' | 'preparing' | 'completed';

export interface OrderItem {
  menuId: number;
  quantity: number;
  price: number;
}

export interface CreateOrderDto {
  items: { menuId: number; quantity: number }[];
}
```

**규칙:**
- interface 사용 (type alias는 union/intersection에만)
- DTO는 `{Action}{Domain}Dto` 패턴
- DB 엔티티와 API 응답 타입 분리

---

## 10. TODO 주석 컨벤션

```typescript
// TODO: [AUTH] 인증 미들웨어 적용 필요
// TODO: [SHARED] 공통 타입으로 리팩토링 필요
// TODO: [SSE] SSE 이벤트 발행 필요
```

| 태그 | 의미 | 담당 |
|-----|------|------|
| `[AUTH]` | Auth 미들웨어 적용 대기 | BE-1 완료 후 |
| `[SHARED]` | 공통 타입 추출 대기 | Phase 2 |
| `[SSE]` | SSE 이벤트 연동 대기 | BE-3 완료 후 |

---

## 11. 코드 스타일

### ESLint + Prettier 설정

```json
// .eslintrc.json
{
  "extends": ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  "rules": {
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-unused-vars": "error",
    "no-console": ["warn", { "allow": ["error"] }]
  }
}
```

```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

### 네이밍 규칙

| 유형 | 스타일 | 예시 |
|-----|-------|------|
| 클래스 | PascalCase | `OrderService` |
| 함수/메서드 | camelCase | `createOrder` |
| 변수 | camelCase | `orderItems` |
| 상수 | UPPER_SNAKE | `MAX_RETRY_COUNT` |
| 타입/인터페이스 | PascalCase | `OrderStatus` |
| 파일 | kebab-case 또는 dot notation | `order.service.ts` |

---

## 12. 의존성 주입 (DI) 패턴

```typescript
// index.ts (앱 진입점)
import Database from 'better-sqlite3';
import { OrderRepository } from './repositories/order.repository';
import { OrderService } from './services/order.service';
import { OrderController } from './controllers/order.controller';

// 의존성 생성
const db = new Database('database.sqlite');
const orderRepo = new OrderRepository(db);
const orderService = new OrderService(orderRepo);
const orderController = new OrderController(orderService);

// 라우터에 주입
app.use('/api/orders', createOrderRoutes(orderController));
```

---

## 13. 테스트 패턴

```typescript
// tests/unit/order.service.test.ts
import { OrderService } from '../../src/services/order.service';
import { OrderRepository } from '../../src/repositories/order.repository';

describe('OrderService', () => {
  let service: OrderService;
  let mockRepo: jest.Mocked<OrderRepository>;

  beforeEach(() => {
    mockRepo = {
      create: jest.fn(),
      findById: jest.fn(),
    } as any;
    service = new OrderService(mockRepo);
  });

  describe('create', () => {
    it('should create order with pending status', async () => {
      mockRepo.create.mockReturnValue({ id: 1, status: 'pending' } as any);
      
      const result = await service.create(1, [{ menuId: 1, quantity: 2 }]);
      
      expect(result.status).toBe('pending');
      expect(mockRepo.create).toHaveBeenCalled();
    });
  });
});
```

---

## 체크리스트

코드 작성 시 확인:

- [ ] Controller → Service → Repository 계층 분리
- [ ] 비즈니스 로직은 Service에만
- [ ] 에러는 next()로 전달
- [ ] 응답은 sendSuccess/sendError 사용
- [ ] TODO 태그 형식 준수
- [ ] 타입 명시적 선언
- [ ] ESLint/Prettier 통과

# Contract/Interface Definition for BE-3 (Table + SSE)

**Unit**: BE-3  
**담당자**: 개발자 C  
**생성일**: 2026-02-25

---

## Unit Context

### Stories Implemented
- **US-2.2**: 실시간 주문 모니터링 (SSE 부분)
- **US-2.3**: 주문 상태 변경 (SSE 브로드캐스트)
- **US-3.2**: 테이블 이용 완료
- **US-3.3**: 과거 주문 내역 조회

### Dependencies
- `// TODO: [AUTH]` - BE-1 완료 시 인증 미들웨어 적용

### Database Entities
- `tables` - 테이블 정보
- `sessions` - 테이블 세션
- `orders` - 주문 (조회용, BE-2 소유)

---

## Repository Layer

### TableRepository
```typescript
class TableRepository {
  constructor(db: Database)
  
  findById(id: string): Table | null
  // 테이블 ID로 조회
  
  updateSession(tableId: string, sessionId: string | null): void
  // 테이블의 현재 세션 업데이트
}
```

### SessionRepository
```typescript
class SessionRepository {
  constructor(db: Database)
  
  create(tableId: string): Session
  // 새 세션 생성, UUID 발급
  
  findById(id: string): Session | null
  // 세션 ID로 조회
  
  complete(sessionId: string): void
  // 세션 완료 처리 (completedAt 설정)
  
  findCompletedByTableId(tableId: string): PastSession[]
  // 테이블의 완료된 세션 목록 (최신순)
  // orders 테이블과 JOIN하여 PastSession 반환
}
```

### OrderRepository (조회 전용, BE-2 소유)
```typescript
// BE-3에서는 조회만 사용
class OrderRepository {
  findBySessionId(sessionId: string): Order[]
  // 세션의 주문 목록 조회 (PastSession 구성용)
}
```

---

## Service Layer

### TableService
```typescript
class TableService {
  constructor(
    tableRepo: TableRepository,
    sessionRepo: SessionRepository
  )
  
  getTableById(id: string): Promise<Table | null>
  // 테이블 조회
  // Returns: Table 또는 null
  
  createSession(tableId: string): Promise<Session>
  // 새 세션 생성 및 테이블에 연결
  // BE-1 (Auth)에서 테이블 초기 설정 시 호출
  // Raises: AppError(404) - 테이블 없음
  
  completeTableSession(tableId: string): Promise<void>
  // 테이블 이용 완료 처리
  // 1. 현재 세션 완료 처리 (completedAt 설정)
  // 2. 테이블의 currentSessionId를 null로 설정
  // (새 세션 생성은 BE-1에서 다음 고객 설정 시 처리)
  // Raises: AppError(404) - 테이블 없음
  // Raises: AppError(400) - 활성 세션 없음
  
  getTableHistory(tableId: string): Promise<PastSession[]>
  // 테이블 과거 세션 내역 조회
  // Returns: 완료된 세션 목록 (최신순, orders 포함)
  // Raises: AppError(404) - 테이블 없음
}
```

### SSEService
```typescript
interface SSEClient {
  id: string
  type: 'customer' | 'admin'
  storeId: string
  sessionId?: string
  response: Response
}

class SSEService {
  private clients: Map<string, SSEClient>
  
  addClient(client: SSEClient): void
  // SSE 클라이언트 등록
  
  removeClient(clientId: string): void
  // SSE 클라이언트 제거
  
  broadcastToStore(storeId: string, event: string, data: unknown): void
  // 매장의 모든 admin 클라이언트에게 이벤트 전송
  // Events: new_order, order_status, order_deleted
  
  broadcastToSession(sessionId: string, event: string, data: unknown): void
  // 특정 세션의 customer 클라이언트에게 이벤트 전송
  // Events: order_status
  
  getClientCount(): number
  // 연결된 클라이언트 수 반환 (테스트용)
}
```

---

## Controller Layer (API)

### TableController
```typescript
class TableController {
  constructor(tableService: TableService)
  
  // POST /api/admin/tables/:id/complete
  completeTable(req: Request, res: Response, next: NextFunction): Promise<void>
  // TODO: [AUTH] 인증 미들웨어 적용 필요
  // Success: 200 { success: true }
  // Error: 404 (테이블 없음), 400 (활성 세션 없음)
  
  // GET /api/admin/tables/:id/history
  getTableHistory(req: Request, res: Response, next: NextFunction): Promise<void>
  // TODO: [AUTH] 인증 미들웨어 적용 필요
  // Success: 200 { sessions: PastSession[] }
  // Error: 404 (테이블 없음)
}
```

### SSEController
```typescript
class SSEController {
  constructor(sseService: SSEService)
  
  // GET /api/customer/sse/orders
  customerSSE(req: Request, res: Response): void
  // TODO: [AUTH] 인증 미들웨어 적용 필요
  // SSE 스트림 연결 (sessionId 기반)
  // Events: order_status
  
  // GET /api/admin/sse/orders
  adminSSE(req: Request, res: Response): void
  // TODO: [AUTH] 인증 미들웨어 적용 필요
  // SSE 스트림 연결 (storeId 기반)
  // Events: new_order, order_status, order_deleted
}
```

---

## Shared Types (BE-3 관련)

```typescript
interface Table {
  id: string
  storeId: string
  tableNumber: string
  currentSessionId: string | null
}

interface Session {
  id: string
  tableId: string
  createdAt: string
  completedAt: string | null
}

interface PastSession {
  sessionId: string
  orders: Order[]
  totalAmount: number
  completedAt: string
}

// SSE Events
type SSEEventType = 'new_order' | 'order_status' | 'order_deleted'

interface OrderStatusEvent {
  orderId: string
  status: OrderStatus
}

interface OrderDeletedEvent {
  orderId: string
}
```

---

## Routes

```typescript
// routes/table.routes.ts
createTableRoutes(controller: TableController): Router
  // TODO: [AUTH] router.use(authMiddleware)
  // Base: /api/admin/tables
  POST /:id/complete -> controller.completeTable
  GET /:id/history -> controller.getTableHistory

// routes/sse.routes.ts
createSSERoutes(controller: SSEController): Router
  // TODO: [AUTH] 각 엔드포인트에 인증 적용
  // Base: /api
  GET /customer/sse/orders -> controller.customerSSE
  GET /admin/sse/orders -> controller.adminSSE
```

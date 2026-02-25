# API Contract

**프로젝트**: 테이블오더 서비스  
**생성일**: 2026-02-25  
**목적**: Backend/Frontend 병렬 개발을 위한 API 계약

---

## Shared Types

```typescript
// ============ Menu ============
interface Category {
  id: string
  name: string
  order: number
}

interface Menu {
  id: string
  name: string
  price: number
  description: string
  imageUrl: string
  categoryId: string
}

// ============ Order ============
type OrderStatus = 'pending' | 'preparing' | 'completed'

interface OrderItem {
  menuId: string
  menuName: string
  quantity: number
  unitPrice: number
}

interface Order {
  id: string
  orderNumber: string
  tableId: string
  sessionId: string
  items: OrderItem[]
  totalAmount: number
  status: OrderStatus
  createdAt: string  // ISO 8601
}

// ============ Table ============
interface Table {
  id: string
  storeId: string
  tableNumber: string
  currentSessionId: string | null
}

interface TableWithOrders {
  table: Table
  orders: Order[]
  totalAmount: number
  oldestOrderTime: string | null  // ISO 8601
  isDelayed: boolean  // 30분 경과 여부
}

interface PastSession {
  sessionId: string
  orders: Order[]
  totalAmount: number
  completedAt: string  // ISO 8601
}

// ============ Auth ============
interface TableInfo {
  tableId: string
  tableNumber: string
  storeId: string
  sessionId: string
}

interface AdminInfo {
  userId: string
  username: string
  storeId: string
}

interface AuthResponse {
  token: string
  expiresIn: number  // seconds
}
```

---

## API Endpoints

### Auth (인증)

```
POST /api/admin/login
  Request:  { storeId: string, username: string, password: string }
  Response: AuthResponse
  Error:    401 (invalid credentials), 429 (too many attempts)

POST /api/customer/table/setup
  Request:  { storeId: string, tableNumber: string, tablePassword: string }
  Response: AuthResponse & { tableInfo: TableInfo }
  Error:    401 (invalid credentials)

POST /api/customer/table/auto-login
  Headers:  Authorization: Bearer <token>
  Response: { valid: boolean, tableInfo: TableInfo }
  Error:    401 (invalid token)
```

### Menu (메뉴)

```
GET /api/customer/menus
  Query:    categoryId? (optional filter)
  Response: { categories: Category[], menus: Menu[] }
```

### Order (주문)

```
POST /api/customer/orders
  Headers:  Authorization: Bearer <token>
  Request:  { items: { menuId: string, quantity: number }[] }
  Response: { orderId: string, orderNumber: string }
  Error:    400 (invalid items), 401 (unauthorized)

GET /api/customer/orders
  Headers:  Authorization: Bearer <token>
  Response: Order[]

GET /api/admin/orders
  Headers:  Authorization: Bearer <token>
  Response: { tables: TableWithOrders[] }

PATCH /api/admin/orders/:id/status
  Headers:  Authorization: Bearer <token>
  Request:  { status: OrderStatus }
  Response: { success: boolean }
  Error:    404 (not found), 400 (invalid status)

DELETE /api/admin/orders/:id
  Headers:  Authorization: Bearer <token>
  Response: { success: boolean }
  Error:    404 (not found)
```

### Table (테이블 관리)

```
POST /api/admin/tables/:id/complete
  Headers:  Authorization: Bearer <token>
  Response: { success: boolean }
  Error:    404 (not found)

GET /api/admin/tables/:id/history
  Headers:  Authorization: Bearer <token>
  Response: { sessions: PastSession[] }
  Error:    404 (not found)
```

### SSE (실시간 이벤트)

```
GET /api/customer/sse/orders
  Headers:  Authorization: Bearer <token>
  Response: SSE stream
  Events:
    - order_status: { orderId: string, status: OrderStatus }

GET /api/admin/sse/orders
  Headers:  Authorization: Bearer <token>
  Response: SSE stream
  Events:
    - new_order: Order
    - order_status: { orderId: string, status: OrderStatus }
    - order_deleted: { orderId: string }
```

---

## 공통 규칙

- **인증**: `Authorization: Bearer <JWT token>` 헤더 사용
- **에러 응답**: `{ error: string, message: string }`
- **날짜 형식**: ISO 8601 (`2026-02-25T15:30:00Z`)
- **ID 형식**: UUID v4

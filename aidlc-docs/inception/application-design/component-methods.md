# Component Methods

**프로젝트**: 테이블오더 서비스  
**생성일**: 2026-02-25

---

## Backend - Controllers

### AuthController
```typescript
POST /api/admin/login
  Input: { storeId, username, password }
  Output: { token, expiresIn }

POST /api/customer/table/setup
  Input: { storeId, tableNumber, tablePassword }
  Output: { token, expiresIn }

POST /api/customer/table/auto-login
  Input: { token }
  Output: { valid, tableInfo }
```

### MenuController
```typescript
GET /api/customer/menus
  Input: (query) { categoryId? }
  Output: { categories: Category[], menus: Menu[] }

GET /api/customer/menus/:id
  Input: (param) { id }
  Output: Menu
```

### OrderController
```typescript
POST /api/customer/orders
  Input: { tableId, sessionId, items: OrderItem[] }
  Output: { orderId, orderNumber }

GET /api/customer/orders
  Input: (query) { sessionId }
  Output: Order[]

GET /api/admin/orders
  Input: (query) { storeId }
  Output: { tables: TableWithOrders[] }

PATCH /api/admin/orders/:id/status
  Input: { status: 'pending' | 'preparing' | 'completed' }
  Output: { success }

DELETE /api/admin/orders/:id
  Input: (param) { id }
  Output: { success }
```

### TableController
```typescript
POST /api/admin/tables/:id/complete
  Input: (param) { id }
  Output: { success }

GET /api/admin/tables/:id/history
  Input: (param) { id }
  Output: { sessions: PastSession[] }
```

### SSEController
```typescript
GET /api/customer/sse/orders
  Input: (query) { sessionId }
  Output: SSE stream (order status updates)

GET /api/admin/sse/orders
  Input: (query) { storeId }
  Output: SSE stream (new orders, status changes)
```

---

## Backend - Services

### AuthService
```typescript
validateAdminLogin(storeId, username, password): Promise<AdminUser | null>
validateTableLogin(storeId, tableNumber, password): Promise<Table | null>
generateToken(payload, expiresIn): string
verifyToken(token): TokenPayload | null
checkLoginAttempts(identifier): { allowed: boolean, remainingAttempts: number }
recordLoginAttempt(identifier, success): void
```

### MenuService
```typescript
getAllMenus(storeId): Promise<{ categories: Category[], menus: Menu[] }>
getMenuById(id): Promise<Menu | null>
initializeSampleMenus(storeId): Promise<void>  // 데이터 없을 시 샘플 생성
```

### OrderService
```typescript
createOrder(tableId, sessionId, items): Promise<Order>
getOrdersBySession(sessionId): Promise<Order[]>
getOrdersByStore(storeId): Promise<TableWithOrders[]>
updateOrderStatus(orderId, status): Promise<Order>
deleteOrder(orderId): Promise<void>
```

### TableService
```typescript
getTableById(id): Promise<Table | null>
completeTableSession(tableId): Promise<void>
getTableHistory(tableId): Promise<PastSession[]>
createSession(tableId): Promise<Session>
```

### SSEService
```typescript
addClient(clientId, response): void
removeClient(clientId): void
broadcastToStore(storeId, event, data): void
broadcastToSession(sessionId, event, data): void
```

---

## Frontend - Contexts

### CartProvider (Customer)
```typescript
// State
cart: CartItem[]
totalAmount: number

// Actions
addItem(menu: Menu): void
removeItem(menuId: string): void
updateQuantity(menuId: string, quantity: number): void
clearCart(): void
```

### AuthProvider (Customer)
```typescript
// State
isAuthenticated: boolean
tableInfo: TableInfo | null
token: string | null

// Actions
login(storeId, tableNumber, password): Promise<void>
autoLogin(): Promise<boolean>
logout(): void
```

### useSSE (Customer Hook)
```typescript
useSSE(sessionId: string): {
  connected: boolean
  onOrderStatusChange: (callback: (order: Order) => void) => void
}
```

### AdminAuthProvider (Admin)
```typescript
// State
isAuthenticated: boolean
adminInfo: AdminInfo | null
token: string | null

// Actions
login(storeId, username, password): Promise<void>
logout(): void
checkSession(): boolean
```

### useAdminSSE (Admin Hook)
```typescript
useAdminSSE(storeId: string): {
  connected: boolean
  onNewOrder: (callback: (order: Order) => void) => void
  onOrderUpdate: (callback: (order: Order) => void) => void
}
```

---

## Shared Types

```typescript
// Menu
interface Menu {
  id: string
  name: string
  price: number
  description: string
  imageUrl: string
  categoryId: string
}

interface Category {
  id: string
  name: string
  order: number
}

// Order
interface Order {
  id: string
  orderNumber: string
  tableId: string
  sessionId: string
  items: OrderItem[]
  totalAmount: number
  status: OrderStatus
  createdAt: Date
}

type OrderStatus = 'pending' | 'preparing' | 'completed'

interface OrderItem {
  menuId: string
  menuName: string
  quantity: number
  unitPrice: number
}

// Table
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
  oldestOrderTime: Date | null
  isDelayed: boolean
}
```

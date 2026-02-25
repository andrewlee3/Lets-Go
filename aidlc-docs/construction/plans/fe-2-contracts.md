# Contract/Interface Definition for FE-2 (Admin UI)

## Unit Context
- **Stories**: US-2.1 ~ US-2.5, US-3.2 ~ US-3.3
- **Dependencies**: Backend API (BE-1, BE-2, BE-3 완료)
- **Tech Stack**: Next.js, React, TypeScript

---

## Shared Types (from API Contract)

```typescript
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
  createdAt: string
}

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
  oldestOrderTime: string | null
  isDelayed: boolean
}

interface PastSession {
  sessionId: string
  orders: Order[]
  totalAmount: number
  completedAt: string
}

interface AdminInfo {
  userId: string
  username: string
  storeId: string
}

interface AuthResponse {
  token: string
  expiresIn: number
}
```

---

## Context Layer

### AdminAuthContext
**책임**: 관리자 인증 상태 관리

```typescript
interface AdminAuthContextValue {
  admin: AdminInfo | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (storeId: string, username: string, password: string) => Promise<void>
  logout: () => void
}
```

- `login(storeId, username, password) -> Promise<void>`: 관리자 로그인
  - Args: storeId (매장 식별자), username, password
  - Returns: void (성공 시 상태 업데이트)
  - Throws: Error (401 invalid credentials, 429 too many attempts)

- `logout() -> void`: 로그아웃 및 상태 초기화

---

## Hooks Layer

### useAdminSSE
**책임**: 관리자 SSE 연결 및 이벤트 수신

```typescript
interface UseAdminSSEReturn {
  tables: TableWithOrders[]
  isConnected: boolean
  error: Error | null
}

function useAdminSSE(token: string | null): UseAdminSSEReturn
```

- SSE Events:
  - `new_order`: 신규 주문 수신 → tables 업데이트
  - `order_status`: 상태 변경 → tables 업데이트
  - `order_deleted`: 주문 삭제 → tables 업데이트

---

## API Layer

### adminApi
**책임**: Admin API 호출

```typescript
// Auth
POST /api/admin/login
  login(storeId: string, username: string, password: string): Promise<AuthResponse>

// Orders
GET /api/admin/orders
  getOrders(token: string): Promise<{ tables: TableWithOrders[] }>

PATCH /api/admin/orders/:id/status
  updateOrderStatus(token: string, orderId: string, status: OrderStatus): Promise<void>

DELETE /api/admin/orders/:id
  deleteOrder(token: string, orderId: string): Promise<void>

// Tables
POST /api/admin/tables/:id/complete
  completeTable(token: string, tableId: string): Promise<void>

GET /api/admin/tables/:id/history
  getTableHistory(token: string, tableId: string): Promise<{ sessions: PastSession[] }>
```

---

## Components Layer

### LoginPage
**책임**: 관리자 로그인 화면 (US-2.1)

```typescript
interface LoginPageProps {}

// 내부 상태
- storeId: string
- username: string
- password: string
- error: string | null
- isLoading: boolean

// 동작
- 폼 제출 시 login() 호출
- 성공 시 /admin/dashboard로 이동
- 실패 시 에러 메시지 표시
```

### DashboardPage
**책임**: 주문 모니터링 대시보드 (US-2.2)

```typescript
interface DashboardPageProps {}

// 내부 상태
- selectedTable: TableWithOrders | null
- showOrderModal: boolean
- showHistoryModal: boolean

// 동작
- useAdminSSE로 실시간 테이블 데이터 수신
- TableCard 클릭 시 OrderDetailModal 표시
```

### TableCard
**책임**: 테이블 카드 컴포넌트 (US-2.2, US-2.4)

```typescript
interface TableCardProps {
  table: TableWithOrders
  onClick: () => void
}

// 표시 정보
- 테이블 번호
- 총 주문액
- 주문 시간 (oldestOrderTime)
- 지연 여부 (isDelayed → 빨간색 강조)
```

### OrderDetailModal
**책임**: 주문 상세 모달 (US-2.3, US-2.5)

```typescript
interface OrderDetailModalProps {
  table: TableWithOrders
  onClose: () => void
  onStatusChange: (orderId: string, status: OrderStatus) => void
  onDelete: (orderId: string) => void
  onComplete: () => void
  onShowHistory: () => void
}

// 동작
- 주문 목록 표시
- 상태 변경 버튼 (pending/preparing/completed)
- 주문 삭제 버튼 (확인 팝업)
- 이용 완료 버튼 (확인 팝업)
- 과거 내역 버튼
```

### TableHistoryModal
**책임**: 과거 주문 내역 모달 (US-3.3)

```typescript
interface TableHistoryModalProps {
  tableId: string
  onClose: () => void
}

// 동작
- getTableHistory() 호출
- 시간 역순 주문 목록 표시
```

---

## Story Mapping

| Component | Stories |
|-----------|---------|
| AdminAuthContext | US-2.1 |
| LoginPage | US-2.1 |
| DashboardPage | US-2.2 |
| TableCard | US-2.2, US-2.4 |
| OrderDetailModal | US-2.3, US-2.5, US-3.2 |
| TableHistoryModal | US-3.3 |
| useAdminSSE | US-2.2 |

# Contract/Interface Definition for BE-2 (Menu + Order)

**Unit**: BE-2  
**담당자**: 개발자 B  
**생성일**: 2026-02-25

---

## Unit Context

**Stories**:
- US-1.1: 메뉴 조회
- US-1.3: 주문 생성
- US-1.4: 주문 내역 조회
- US-2.2: 실시간 주문 모니터링 (주문 데이터 제공)
- US-2.3: 주문 상태 변경
- US-2.5: 주문 삭제
- US-4.1: 샘플 메뉴 데이터

**Dependencies**:
- `// TODO: [AUTH]` - BE-1 완료 후 인증 미들웨어 적용

**Database Entities**:
- Category
- Menu
- Order
- OrderItem

---

## Repository Layer

### MenuRepository

```typescript
class MenuRepository {
  constructor(db: Database) {}

  findAllCategories(): Category[]
  // Returns: 모든 카테고리 목록 (order 순 정렬)

  findAllMenus(): Menu[]
  // Returns: 모든 메뉴 목록

  findMenusByCategory(categoryId: string): Menu[]
  // Args: categoryId - 카테고리 ID
  // Returns: 해당 카테고리의 메뉴 목록

  findMenuById(id: string): Menu | null
  // Args: id - 메뉴 ID
  // Returns: 메뉴 또는 null

  createCategory(data: CreateCategoryData): Category
  // Args: data - { name, order }
  // Returns: 생성된 카테고리

  createMenu(data: CreateMenuData): Menu
  // Args: data - { name, price, description, imageUrl, categoryId }
  // Returns: 생성된 메뉴

  countMenus(): number
  // Returns: 전체 메뉴 수
}
```

### OrderRepository

```typescript
class OrderRepository {
  constructor(db: Database) {}

  create(data: CreateOrderData): Order
  // Args: data - { tableId, sessionId, items, totalAmount }
  // Returns: 생성된 주문 (status: 'pending')

  findById(id: string): Order | null
  // Args: id - 주문 ID
  // Returns: 주문 또는 null

  findBySessionId(sessionId: string): Order[]
  // Args: sessionId - 세션 ID
  // Returns: 해당 세션의 주문 목록 (최신순)

  findByStoreId(storeId: string): Order[]
  // Args: storeId - 매장 ID
  // Returns: 해당 매장의 활성 주문 목록

  updateStatus(id: string, status: OrderStatus): Order | null
  // Args: id - 주문 ID, status - 새 상태
  // Returns: 업데이트된 주문 또는 null
  // Raises: NotFoundError (주문 없음)

  delete(id: string): boolean
  // Args: id - 주문 ID
  // Returns: 삭제 성공 여부
}
```

---

## Service Layer

### MenuService

```typescript
class MenuService {
  constructor(menuRepo: MenuRepository) {}

  getAllMenus(): { categories: Category[], menus: Menu[] }
  // Returns: 카테고리와 메뉴 목록
  // Raises: -

  getMenusByCategory(categoryId: string): Menu[]
  // Args: categoryId - 카테고리 ID
  // Returns: 해당 카테고리 메뉴 목록
  // Raises: -

  initializeSampleMenus(): void
  // 메뉴가 없을 경우 샘플 데이터 생성
  // Returns: void
  // Raises: -
}
```

### OrderService

```typescript
class OrderService {
  constructor(orderRepo: OrderRepository, menuRepo: MenuRepository) {}

  createOrder(tableId: string, sessionId: string, items: CreateOrderItemDto[]): Order
  // Args: tableId, sessionId, items - [{ menuId, quantity }]
  // Returns: 생성된 주문
  // Raises: ValidationError (빈 items, 유효하지 않은 menuId, quantity < 1)

  getOrdersBySession(sessionId: string): Order[]
  // Args: sessionId - 세션 ID
  // Returns: 주문 목록 (최신순)
  // Raises: -

  getOrdersByStore(storeId: string): TableWithOrders[]
  // Args: storeId - 매장 ID
  // Returns: 테이블별 주문 정보
  // Raises: -

  updateOrderStatus(orderId: string, status: OrderStatus): Order
  // Args: orderId, status
  // Returns: 업데이트된 주문
  // Raises: NotFoundError, ValidationError (잘못된 status)

  deleteOrder(orderId: string): void
  // Args: orderId
  // Returns: void
  // Raises: NotFoundError
}
```

---

## Controller Layer (API)

### MenuController

```typescript
class MenuController {
  constructor(menuService: MenuService) {}

  getMenus = async (req: Request, res: Response, next: NextFunction): Promise<void>
  // GET /api/customer/menus
  // Query: categoryId? (optional)
  // Response: { success: true, data: { categories, menus } }
}
```

### OrderController

```typescript
class OrderController {
  constructor(orderService: OrderService) {}

  createOrder = async (req: Request, res: Response, next: NextFunction): Promise<void>
  // POST /api/customer/orders
  // Body: { items: [{ menuId, quantity }] }
  // Response: { success: true, data: { orderId, orderNumber } }
  // Error: 400 (validation), 401 (unauthorized)

  getCustomerOrders = async (req: Request, res: Response, next: NextFunction): Promise<void>
  // GET /api/customer/orders
  // Response: { success: true, data: Order[] }

  getAdminOrders = async (req: Request, res: Response, next: NextFunction): Promise<void>
  // GET /api/admin/orders
  // Response: { success: true, data: { tables: TableWithOrders[] } }

  updateOrderStatus = async (req: Request, res: Response, next: NextFunction): Promise<void>
  // PATCH /api/admin/orders/:id/status
  // Body: { status: OrderStatus }
  // Response: { success: true, data: { success: true } }
  // Error: 404 (not found), 400 (invalid status)

  deleteOrder = async (req: Request, res: Response, next: NextFunction): Promise<void>
  // DELETE /api/admin/orders/:id
  // Response: { success: true, data: { success: true } }
  // Error: 404 (not found)
}
```

---

## Types

```typescript
// ============ Category ============
interface Category {
  id: string;
  name: string;
  order: number;
}

interface CreateCategoryData {
  name: string;
  order: number;
}

// ============ Menu ============
interface Menu {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  categoryId: string;
}

interface CreateMenuData {
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  categoryId: string;
}

// ============ Order ============
type OrderStatus = 'pending' | 'preparing' | 'completed';

interface OrderItem {
  menuId: string;
  menuName: string;
  quantity: number;
  unitPrice: number;
}

interface Order {
  id: string;
  orderNumber: string;
  tableId: string;
  sessionId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
}

interface CreateOrderItemDto {
  menuId: string;
  quantity: number;
}

interface CreateOrderData {
  tableId: string;
  sessionId: string;
  items: OrderItem[];
  totalAmount: number;
}

// ============ TableWithOrders ============
interface TableWithOrders {
  table: {
    id: string;
    tableNumber: string;
  };
  orders: Order[];
  totalAmount: number;
  oldestOrderTime: string | null;
  isDelayed: boolean;
}
```

---

## Error Classes

```typescript
class AppError extends Error {
  constructor(statusCode: number, message: string) {}
}

class NotFoundError extends AppError {
  constructor(message: string) {
    super(404, message);
  }
}

class ValidationError extends AppError {
  constructor(message: string) {
    super(400, message);
  }
}
```

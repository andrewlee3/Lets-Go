// Shared Types (from API Contract)

export type OrderStatus = 'pending' | 'preparing' | 'completed'

export interface OrderItem {
  menuId: string
  menuName: string
  quantity: number
  unitPrice: number
}

export interface Order {
  id: string
  orderNumber: string
  tableId: string
  sessionId: string
  items: OrderItem[]
  totalAmount: number
  status: OrderStatus
  createdAt: string
}

export interface Table {
  id: string
  storeId: string
  tableNumber: string
  currentSessionId: string | null
}

export interface TableWithOrders {
  table: Table
  orders: Order[]
  totalAmount: number
  oldestOrderTime: string | null
  isDelayed: boolean
}

export interface PastSession {
  sessionId: string
  orders: Order[]
  totalAmount: number
  completedAt: string
}

export interface AdminInfo {
  userId: string
  username: string
  storeId: string
}

export interface AuthResponse {
  token: string
  expiresIn: number
}

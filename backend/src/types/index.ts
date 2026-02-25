// Shared Types
export interface AdminUser {
  id: string;
  storeId: string;
  username: string;
  passwordHash: string;
  createdAt: Date;
}

export interface Table {
  id: string;
  storeId: string;
  tableNumber: string;
  passwordHash: string;
  currentSessionId: string | null;
  createdAt: Date;
}

export interface Session {
  id: string;
  tableId: string;
  startedAt: Date;
  completedAt: Date | null;
}

export interface PastSession {
  sessionId: string;
  orders: Order[];
  totalAmount: number;
  completedAt: string;
}

export interface LoginAttempt {
  identifier: string;
  attempts: number;
  lastAttemptAt: Date;
}

// ============ BE-2: Menu Types ============
export interface Category {
  id: string;
  name: string;
  order: number;
}

export interface Menu {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  categoryId: string;
}

// ============ BE-2: Order Types ============
export type OrderStatus = 'pending' | 'preparing' | 'completed';

export interface OrderItem {
  menuId: string;
  menuName: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  tableId: string;
  sessionId: string;
  storeId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
}

export interface CreateOrderItemDto {
  menuId: string;
  quantity: number;
}

export interface TableWithOrders {
  table: { id: string; tableNumber: string };
  orders: Order[];
  totalAmount: number;
  oldestOrderTime: string | null;
  isDelayed: boolean;
}

// SSE Types
export interface SSEClient {
  id: string;
  type: 'customer' | 'admin';
  storeId: string;
  sessionId?: string;
  response: import('express').Response;
}

export type SSEEventType = 'new_order' | 'order_status' | 'order_deleted';

// Auth DTOs
export interface AdminLoginDto {
  storeId: string;
  username: string;
  password: string;
}

export interface TableSetupDto {
  storeId: string;
  tableNumber: string;
  tablePassword: string;
}

export interface AuthResponse {
  token: string;
  expiresIn: number;
}

export interface TableInfo {
  tableId: string;
  tableNumber: string;
  storeId: string;
  sessionId: string;
}

export interface TokenPayload {
  userId?: string;
  tableId?: string;
  storeId: string;
  type: 'admin' | 'table';
  sessionId?: string;
  iat?: number;
  exp?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

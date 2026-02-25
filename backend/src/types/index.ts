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

// Order Types (BE-2 소유, BE-3 조회용)
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
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
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

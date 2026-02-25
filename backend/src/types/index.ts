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

export interface LoginAttempt {
  identifier: string;
  attempts: number;
  lastAttemptAt: Date;
}

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
  iat?: number;
  exp?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

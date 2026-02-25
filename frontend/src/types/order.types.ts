// Order Types
export type OrderStatus = 'pending' | 'preparing' | 'completed';

export interface OrderItem {
  menuId: string;
  menuName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  tableId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  sessionId: string;
}

export interface CreateOrderRequest {
  items: OrderItem[];
  totalAmount: number;
}

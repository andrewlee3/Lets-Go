import type { Order, CreateOrderRequest } from '@/types/order.types';

// TODO: 백엔드 API 연동 시 실제 API 호출로 대체
// POST /api/customer/orders

export async function createOrder(request: CreateOrderRequest): Promise<Order> {
  // Mock: 주문 생성 시뮬레이션
  await new Promise((resolve) => setTimeout(resolve, 500));

  const orderId = `ORD-${Date.now()}`;
  const order: Order = {
    id: orderId,
    tableId: 'table-1', // Mock: 기본 테이블
    items: request.items,
    totalAmount: request.totalAmount,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  return order;
}

// TODO: 백엔드 API 연동 시 실제 API 호출로 대체
// GET /api/customer/orders

export async function getOrders(): Promise<Order[]> {
  // Mock: localStorage에서 주문 목록 가져오기
  await new Promise((resolve) => setTimeout(resolve, 300));

  const ordersJson = localStorage.getItem('orders');
  if (!ordersJson) {
    return [];
  }

  return JSON.parse(ordersJson) as Order[];
}

// Mock: localStorage에 주문 저장 (실제 API 연동 시 제거)
export function saveOrderToLocalStorage(order: Order): void {
  const ordersJson = localStorage.getItem('orders');
  const orders: Order[] = ordersJson ? JSON.parse(ordersJson) : [];
  orders.unshift(order);
  localStorage.setItem('orders', JSON.stringify(orders));
}

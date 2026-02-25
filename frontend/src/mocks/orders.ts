import type { Order } from '@/types/order.types';

// TODO: 백엔드 API 연동 시 이 파일 제거
// GET /api/customer/orders 엔드포인트로 대체

export const mockOrders: Order[] = [
  {
    id: 'order-1',
    tableId: 'table-1',
    items: [
      {
        menuId: 'menu-1',
        menuName: '아메리카노',
        quantity: 2,
        price: 4500,
      },
      {
        menuId: 'menu-9',
        menuName: '티라미수',
        quantity: 1,
        price: 6500,
      },
    ],
    totalAmount: 15500,
    status: 'completed',
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1시간 전
    sessionId: 'session-1',
  },
  {
    id: 'order-2',
    tableId: 'table-1',
    items: [
      {
        menuId: 'menu-2',
        menuName: '카페라떼',
        quantity: 1,
        price: 5000,
      },
    ],
    totalAmount: 5000,
    status: 'preparing',
    createdAt: new Date(Date.now() - 600000).toISOString(), // 10분 전
    sessionId: 'session-1',
  },
];

import { create } from 'zustand';
import type { Order } from '@/types/order.types';

interface OrderState {
  orders: Order[];
  addOrder: (order: Order) => void;
  clearOrders: () => void;
  // TODO: SSE 연동 시 실시간 업데이트 로직 추가
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  
  addOrder: (order) =>
    set((state) => ({
      orders: [order, ...state.orders],
    })),
  
  clearOrders: () => set({ orders: [] }),
  
  updateOrderStatus: (orderId, status) =>
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === orderId ? { ...order, status } : order
      ),
    })),
}));

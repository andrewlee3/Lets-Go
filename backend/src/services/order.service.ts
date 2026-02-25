import { OrderRepository } from '../repositories/order.repository';
import { MenuRepository } from '../repositories/menu.repository';
import { Order, CreateOrderItemDto, OrderStatus, TableWithOrders, OrderItem } from '../types';
import { AppError } from '../middlewares/error.middleware';
import { db } from '../database';
import { sseService } from './sse.service';

export class OrderService {
  constructor(
    private orderRepo: OrderRepository,
    private menuRepo: MenuRepository
  ) {}

  createOrder(tableId: string, sessionId: string, storeId: string, items: CreateOrderItemDto[]): Order {
    if (!items || items.length === 0) {
      throw new AppError(400, 'Order items cannot be empty');
    }

    const orderItems: OrderItem[] = [];
    let totalAmount = 0;

    for (const item of items) {
      if (item.quantity < 1) {
        throw new AppError(400, 'Quantity must be at least 1');
      }
      const menu = this.menuRepo.findMenuById(item.menuId);
      if (!menu) {
        throw new AppError(400, `Menu not found: ${item.menuId}`);
      }
      orderItems.push({
        menuId: menu.id,
        menuName: menu.name,
        quantity: item.quantity,
        unitPrice: menu.price,
      });
      totalAmount += menu.price * item.quantity;
    }

    const order = this.orderRepo.create({ tableId, sessionId, storeId, items: orderItems, totalAmount });
    
    // SSE: 새 주문 알림 (BE-3 연동)
    sseService.broadcastToStore(storeId, 'new_order', order);
    
    return order;
  }

  getOrdersBySession(sessionId: string): Order[] {
    return this.orderRepo.findBySessionId(sessionId);
  }

  getOrdersByStore(storeId: string): TableWithOrders[] {
    const orders = this.orderRepo.findByStoreId(storeId);
    const tableMap = new Map<string, Order[]>();

    for (const order of orders) {
      const list = tableMap.get(order.tableId) || [];
      list.push(order);
      tableMap.set(order.tableId, list);
    }

    const result: TableWithOrders[] = [];
    const now = Date.now();
    const DELAY_THRESHOLD = 30 * 60 * 1000; // 30분

    for (const [tableId, tableOrders] of tableMap) {
      // 테이블 정보 조회
      let tableNumber = tableId;
      for (const [, table] of db.tables) {
        if (table.id === tableId) {
          tableNumber = table.tableNumber;
          break;
        }
      }

      const totalAmount = tableOrders.reduce((sum, o) => sum + o.totalAmount, 0);
      const oldestOrder = tableOrders[tableOrders.length - 1];
      const oldestOrderTime = oldestOrder?.createdAt || null;
      const isDelayed = oldestOrderTime ? (now - new Date(oldestOrderTime).getTime()) > DELAY_THRESHOLD : false;

      result.push({
        table: { id: tableId, tableNumber },
        orders: tableOrders,
        totalAmount,
        oldestOrderTime,
        isDelayed,
      });
    }

    return result;
  }

  updateOrderStatus(orderId: string, status: OrderStatus): Order {
    const validStatuses: OrderStatus[] = ['pending', 'preparing', 'completed'];
    if (!validStatuses.includes(status)) {
      throw new AppError(400, `Invalid status: ${status}`);
    }

    const order = this.orderRepo.updateStatus(orderId, status);
    if (!order) {
      throw new AppError(404, 'Order not found');
    }

    // SSE: 상태 변경 알림 (BE-3 연동)
    sseService.broadcastToStore(order.storeId, 'order_status', { orderId, status });
    sseService.broadcastToSession(order.sessionId, 'order_status', { orderId, status });

    return order;
  }

  deleteOrder(orderId: string): void {
    const order = this.orderRepo.findById(orderId);
    if (!order) {
      throw new AppError(404, 'Order not found');
    }

    const deleted = this.orderRepo.delete(orderId);
    if (!deleted) {
      throw new AppError(404, 'Order not found');
    }

    // SSE: 삭제 알림 (BE-3 연동)
    sseService.broadcastToStore(order.storeId, 'order_deleted', { orderId });
  }
}

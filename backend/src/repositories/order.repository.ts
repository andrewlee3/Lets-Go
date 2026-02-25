import { db } from '../database';
import { Order, OrderItem, OrderStatus } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class OrderRepository {
  create(data: { tableId: string; sessionId: string; storeId: string; items: OrderItem[]; totalAmount: number }): Order {
    const id = uuidv4();
    const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`;
    const order: Order = {
      id,
      orderNumber,
      tableId: data.tableId,
      sessionId: data.sessionId,
      storeId: data.storeId,
      items: data.items,
      totalAmount: data.totalAmount,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    db.orders.set(id, order);
    return order;
  }

  findById(id: string): Order | null {
    return db.orders.get(id) || null;
  }

  findBySessionId(sessionId: string): Order[] {
    return Array.from(db.orders.values())
      .filter(o => o.sessionId === sessionId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  findByStoreId(storeId: string): Order[] {
    return Array.from(db.orders.values())
      .filter(o => o.storeId === storeId && o.status !== 'completed')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  updateStatus(id: string, status: OrderStatus): Order | null {
    const order = db.orders.get(id);
    if (!order) return null;
    order.status = status;
    db.orders.set(id, order);
    return order;
  }

  delete(id: string): boolean {
    return db.orders.delete(id);
  }
}

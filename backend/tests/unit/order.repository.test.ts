import { OrderRepository } from '../../src/repositories/order.repository';
import { db } from '../../src/database';

describe('OrderRepository', () => {
  const repo = new OrderRepository();

  beforeEach(() => {
    db.orders.clear();
  });

  it('should create order with pending status', () => {
    const order = repo.create({
      tableId: 't1', sessionId: 's1', storeId: 'store1',
      items: [{ menuId: 'm1', menuName: 'Burger', quantity: 2, unitPrice: 8000 }],
      totalAmount: 16000
    });
    expect(order.status).toBe('pending');
    expect(order.orderNumber).toBeDefined();
  });

  it('should find orders by session', () => {
    repo.create({ tableId: 't1', sessionId: 's1', storeId: 'store1', items: [], totalAmount: 10000 });
    repo.create({ tableId: 't1', sessionId: 's1', storeId: 'store1', items: [], totalAmount: 20000 });
    repo.create({ tableId: 't1', sessionId: 's2', storeId: 'store1', items: [], totalAmount: 30000 });
    expect(repo.findBySessionId('s1')).toHaveLength(2);
  });

  it('should update status', () => {
    const order = repo.create({ tableId: 't1', sessionId: 's1', storeId: 'store1', items: [], totalAmount: 10000 });
    const updated = repo.updateStatus(order.id, 'preparing');
    expect(updated?.status).toBe('preparing');
  });

  it('should delete order', () => {
    const order = repo.create({ tableId: 't1', sessionId: 's1', storeId: 'store1', items: [], totalAmount: 10000 });
    expect(repo.delete(order.id)).toBe(true);
    expect(repo.findById(order.id)).toBeNull();
  });
});

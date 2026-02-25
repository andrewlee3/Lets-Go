import { OrderService } from '../../src/services/order.service';
import { OrderRepository } from '../../src/repositories/order.repository';
import { MenuRepository } from '../../src/repositories/menu.repository';
import { db } from '../../src/database';

describe('OrderService', () => {
  const orderRepo = new OrderRepository();
  const menuRepo = new MenuRepository();
  const service = new OrderService(orderRepo, menuRepo);

  beforeEach(() => {
    db.categories.clear();
    db.menus.clear();
    db.orders.clear();
    db.menus.set('m1', { id: 'm1', name: 'Burger', price: 8000, description: '', imageUrl: '', categoryId: 'c1' });
    db.menus.set('m2', { id: 'm2', name: 'Pizza', price: 12000, description: '', imageUrl: '', categoryId: 'c1' });
  });

  it('should create order with calculated total', () => {
    const order = service.createOrder('t1', 's1', 'store1', [
      { menuId: 'm1', quantity: 2 },
      { menuId: 'm2', quantity: 1 }
    ]);
    expect(order.totalAmount).toBe(28000);
  });

  it('should throw error for empty items', () => {
    expect(() => service.createOrder('t1', 's1', 'store1', [])).toThrow('Order items cannot be empty');
  });

  it('should throw error for invalid menuId', () => {
    expect(() => service.createOrder('t1', 's1', 'store1', [{ menuId: 'invalid', quantity: 1 }])).toThrow();
  });

  it('should update order status', () => {
    const order = service.createOrder('t1', 's1', 'store1', [{ menuId: 'm1', quantity: 1 }]);
    const updated = service.updateOrderStatus(order.id, 'preparing');
    expect(updated.status).toBe('preparing');
  });

  it('should delete order', () => {
    const order = service.createOrder('t1', 's1', 'store1', [{ menuId: 'm1', quantity: 1 }]);
    service.deleteOrder(order.id);
    expect(orderRepo.findById(order.id)).toBeNull();
  });
});

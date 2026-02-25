import { SSEService } from '../../src/services/sse.service';
import { SSEClient } from '../../src/types';

describe('SSEService', () => {
  let service: SSEService;

  beforeEach(() => {
    service = new SSEService();
  });

  describe('addClient / removeClient', () => {
    it('should add and remove client', () => {
      const mockRes = { write: jest.fn() } as any;
      const client: SSEClient = { id: 'client-1', type: 'admin', storeId: 'store-1', response: mockRes };

      service.addClient(client);
      expect(service.getClientCount()).toBe(1);

      service.removeClient('client-1');
      expect(service.getClientCount()).toBe(0);
    });
  });

  describe('broadcastToStore', () => {
    it('should broadcast to store admin clients', () => {
      const mockRes = { write: jest.fn() } as any;
      const client: SSEClient = { id: 'client-1', type: 'admin', storeId: 'store-1', response: mockRes };
      service.addClient(client);

      service.broadcastToStore('store-1', 'new_order', { orderId: 'order-1' });

      expect(mockRes.write).toHaveBeenCalledWith(expect.stringContaining('event: new_order'));
      expect(mockRes.write).toHaveBeenCalledWith(expect.stringContaining('"orderId":"order-1"'));
    });

    it('should not broadcast to other stores', () => {
      const mockRes = { write: jest.fn() } as any;
      const client: SSEClient = { id: 'client-1', type: 'admin', storeId: 'store-2', response: mockRes };
      service.addClient(client);

      service.broadcastToStore('store-1', 'new_order', { orderId: 'order-1' });

      expect(mockRes.write).not.toHaveBeenCalled();
    });
  });

  describe('broadcastToSession', () => {
    it('should broadcast to session customer clients', () => {
      const mockRes = { write: jest.fn() } as any;
      const client: SSEClient = { id: 'client-1', type: 'customer', storeId: 'store-1', sessionId: 'session-1', response: mockRes };
      service.addClient(client);

      service.broadcastToSession('session-1', 'order_status', { orderId: 'order-1', status: 'preparing' });

      expect(mockRes.write).toHaveBeenCalledWith(expect.stringContaining('event: order_status'));
      expect(mockRes.write).toHaveBeenCalledWith(expect.stringContaining('"status":"preparing"'));
    });
  });
});

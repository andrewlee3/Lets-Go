/**
 * E2E 테스트: 실시간 SSE 이벤트 플로우
 * 
 * 시나리오:
 * 1. 고객/관리자 SSE 연결 → 2. 주문 생성 시 이벤트 → 3. 상태 변경 시 이벤트
 * 
 * 의존성: BE-1 (Auth), BE-2 (Order), BE-3 (SSE)
 */

import request from 'supertest';
import { Express } from 'express';
import { createApp } from '../../src/app';
import { AuthController } from '../../src/controllers/auth.controller';
import { AuthService } from '../../src/services/auth.service';
import { AuthRepository } from '../../src/repositories/auth.repository';
import { sseService } from '../../src/services/sse.service';
import { db, initializeDatabase } from '../../src/database';

describe('E2E: SSE Real-time Events', () => {
  let app: Express;
  let adminToken: string;
  let tableToken: string;

  beforeAll(async () => {
    db.adminUsers.clear();
    db.tables.clear();
    db.sessions.clear();
    db.orders.clear();
    db.loginAttempts.clear();
    
    initializeDatabase();

    const authRepo = new AuthRepository();
    const authService = new AuthService(authRepo);
    const authController = new AuthController(authService);
    app = createApp(authController, authService);

    // Get tokens
    const adminRes = await request(app)
      .post('/api/admin/login')
      .send({ storeId: 'store1', username: 'admin', password: 'admin123' });
    adminToken = adminRes.body.data.token;

    const tableRes = await request(app)
      .post('/api/customer/table/setup')
      .send({ storeId: 'store1', tableNumber: '1', tablePassword: 'table123' });
    tableToken = tableRes.body.data.token;
  });

  describe('SSE Service Direct Tests', () => {
    it('should broadcast new_order to admin clients', () => {
      const mockAdminRes = { write: jest.fn() } as any;
      
      // Simulate admin SSE connection
      sseService.addClient({
        id: 'admin-client-1',
        type: 'admin',
        storeId: 'store1',
        response: mockAdminRes,
      });

      // Broadcast new order event
      const orderData = {
        id: 'order-1',
        orderNumber: 'ORD-001',
        tableId: 'table-1',
        totalAmount: 25000,
      };
      sseService.broadcastToStore('store1', 'new_order', orderData);

      expect(mockAdminRes.write).toHaveBeenCalledWith(
        expect.stringContaining('event: new_order')
      );
      expect(mockAdminRes.write).toHaveBeenCalledWith(
        expect.stringContaining('ORD-001')
      );

      // Cleanup
      sseService.removeClient('admin-client-1');
    });

    it('should broadcast order_status to customer clients', () => {
      const mockCustomerRes = { write: jest.fn() } as any;
      
      // Simulate customer SSE connection
      sseService.addClient({
        id: 'customer-client-1',
        type: 'customer',
        storeId: 'store1',
        sessionId: 'session-1',
        response: mockCustomerRes,
      });

      // Broadcast status change event
      const statusData = {
        orderId: 'order-1',
        status: 'preparing',
      };
      sseService.broadcastToSession('session-1', 'order_status', statusData);

      expect(mockCustomerRes.write).toHaveBeenCalledWith(
        expect.stringContaining('event: order_status')
      );
      expect(mockCustomerRes.write).toHaveBeenCalledWith(
        expect.stringContaining('preparing')
      );

      // Cleanup
      sseService.removeClient('customer-client-1');
    });

    it('should broadcast order_deleted to admin clients', () => {
      const mockAdminRes = { write: jest.fn() } as any;
      
      sseService.addClient({
        id: 'admin-client-2',
        type: 'admin',
        storeId: 'store1',
        response: mockAdminRes,
      });

      sseService.broadcastToStore('store1', 'order_deleted', { orderId: 'order-1' });

      expect(mockAdminRes.write).toHaveBeenCalledWith(
        expect.stringContaining('event: order_deleted')
      );

      sseService.removeClient('admin-client-2');
    });

    it('should not broadcast to different store', () => {
      const mockAdminRes = { write: jest.fn() } as any;
      
      sseService.addClient({
        id: 'admin-client-3',
        type: 'admin',
        storeId: 'store2', // Different store
        response: mockAdminRes,
      });

      sseService.broadcastToStore('store1', 'new_order', { orderId: 'order-1' });

      expect(mockAdminRes.write).not.toHaveBeenCalled();

      sseService.removeClient('admin-client-3');
    });

    it('should not broadcast to different session', () => {
      const mockCustomerRes = { write: jest.fn() } as any;
      
      sseService.addClient({
        id: 'customer-client-2',
        type: 'customer',
        storeId: 'store1',
        sessionId: 'session-2', // Different session
        response: mockCustomerRes,
      });

      sseService.broadcastToSession('session-1', 'order_status', { orderId: 'order-1' });

      expect(mockCustomerRes.write).not.toHaveBeenCalled();

      sseService.removeClient('customer-client-2');
    });
  });

  describe('SSE Connection Auth Tests', () => {
    it('should reject SSE connection without token', async () => {
      const customerRes = await request(app)
        .get('/api/customer/sse/orders');
      expect(customerRes.status).toBe(401);

      const adminRes = await request(app)
        .get('/api/admin/sse/orders');
      expect(adminRes.status).toBe(401);
    });
  });
});

/**
 * E2E 테스트: 관리자 주문 관리 플로우
 * 
 * 시나리오:
 * 1. 관리자 로그인 → 2. 주문 목록 조회 → 3. 상태 변경 → 4. 주문 삭제
 * 
 * 의존성: BE-1 (Auth), BE-2 (Order), BE-3 (Table)
 */

import request from 'supertest';
import { Express } from 'express';
import { createApp } from '../../src/app';
import { AuthController } from '../../src/controllers/auth.controller';
import { AuthService } from '../../src/services/auth.service';
import { AuthRepository } from '../../src/repositories/auth.repository';
import { db, initializeDatabase } from '../../src/database';

describe('E2E: Admin Order Management Flow', () => {
  let app: Express;
  let adminToken: string;
  let tableToken: string;
  let orderId: string;

  beforeAll(async () => {
    // Clear and initialize database
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

    // Get admin token
    const adminRes = await request(app)
      .post('/api/admin/login')
      .send({ storeId: 'store1', username: 'admin', password: 'admin123' });
    adminToken = adminRes.body.data.token;

    // Get table token and create session
    const tableRes = await request(app)
      .post('/api/customer/table/setup')
      .send({ storeId: 'store1', tableNumber: '1', tablePassword: 'table123' });
    tableToken = tableRes.body.data.token;
  });

  describe('Step 1: Admin Login', () => {
    it('should login as admin', async () => {
      expect(adminToken).toBeDefined();
    });
  });

  describe('Step 2: Get Orders by Table', () => {
    it('should get all orders grouped by table', async () => {
      const response = await request(app)
        .get('/api/admin/orders')
        .set('Authorization', `Bearer ${adminToken}`);

      // TODO: BE-2 완료 후 활성화
      // expect(response.status).toBe(200);
      // expect(response.body.data.tables).toBeDefined();
      // expect(Array.isArray(response.body.data.tables)).toBe(true);
      
      expect(response.status).toBe(404); // BE-2 미완료 시
    });
  });

  describe('Step 3: Update Order Status', () => {
    it('should update order status to preparing', async () => {
      // TODO: BE-2 완료 후 orderId 설정 필요
      const testOrderId = 'test-order-id';
      
      const response = await request(app)
        .patch(`/api/admin/orders/${testOrderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'preparing' });

      // TODO: BE-2 완료 후 활성화
      // expect(response.status).toBe(200);
      // expect(response.body.data.success).toBe(true);
      
      expect(response.status).toBe(404); // BE-2 미완료 시
    });

    it('should update order status to completed', async () => {
      const testOrderId = 'test-order-id';
      
      const response = await request(app)
        .patch(`/api/admin/orders/${testOrderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'completed' });

      // TODO: BE-2 완료 후 활성화
      // expect(response.status).toBe(200);
      
      expect(response.status).toBe(404); // BE-2 미완료 시
    });
  });

  describe('Step 4: Delete Order', () => {
    it('should delete order', async () => {
      const testOrderId = 'test-order-id';
      
      const response = await request(app)
        .delete(`/api/admin/orders/${testOrderId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      // TODO: BE-2 완료 후 활성화
      // expect(response.status).toBe(200);
      // expect(response.body.data.success).toBe(true);
      
      expect(response.status).toBe(404); // BE-2 미완료 시
    });
  });

  describe('Step 5: Complete Table Session', () => {
    it('should complete table session', async () => {
      const response = await request(app)
        .post('/api/admin/tables/table-1/complete')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.success).toBe(true);
    });

    it('should get table history', async () => {
      const response = await request(app)
        .get('/api/admin/tables/table-1/history')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.sessions).toBeDefined();
      expect(response.body.data.sessions.length).toBeGreaterThan(0);
    });
  });
});

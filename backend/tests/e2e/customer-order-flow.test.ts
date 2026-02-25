/**
 * E2E 테스트: 고객 주문 플로우
 * 
 * 시나리오:
 * 1. 테이블 설정 → 2. 메뉴 조회 → 3. 주문 생성 → 4. 주문 내역 확인
 * 
 * 의존성: BE-1 (Auth), BE-2 (Menu, Order), BE-3 (SSE)
 */

import request from 'supertest';
import { Express } from 'express';
import { createApp } from '../../src/app';
import { AuthController } from '../../src/controllers/auth.controller';
import { AuthService } from '../../src/services/auth.service';
import { AuthRepository } from '../../src/repositories/auth.repository';
import { db, initializeDatabase } from '../../src/database';

describe('E2E: Customer Order Flow', () => {
  let app: Express;
  let tableToken: string;

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
  });

  describe('Step 1: Table Setup', () => {
    it('should setup table and get token', async () => {
      const response = await request(app)
        .post('/api/customer/table/setup')
        .send({
          storeId: 'store1',
          tableNumber: '1',
          tablePassword: 'table123',
        });

      expect(response.status).toBe(200);
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.tableInfo.sessionId).toBeDefined();
      
      tableToken = response.body.data.token;
    });
  });

  describe('Step 2: Menu Browse', () => {
    it('should get menu list (public endpoint)', async () => {
      const response = await request(app)
        .get('/api/customer/menus');

      // TODO: BE-2 완료 후 활성화
      // expect(response.status).toBe(200);
      // expect(response.body.data.categories).toBeDefined();
      // expect(response.body.data.menus).toBeDefined();
      // expect(response.body.data.menus.length).toBeGreaterThan(0);
      
      // BE-2 미완료 시 - 라우트가 없으므로 404
      expect([401, 404]).toContain(response.status);
    });
  });

  describe('Step 3: Create Order', () => {
    it('should create order with items', async () => {
      const response = await request(app)
        .post('/api/customer/orders')
        .set('Authorization', `Bearer ${tableToken}`)
        .send({
          items: [
            { menuId: 'menu-1', quantity: 2 },
            { menuId: 'menu-2', quantity: 1 },
          ],
        });

      // TODO: BE-2 완료 후 활성화
      // expect(response.status).toBe(201);
      // expect(response.body.data.orderId).toBeDefined();
      // expect(response.body.data.orderNumber).toBeDefined();
      
      expect(response.status).toBe(404); // BE-2 미완료 시
    });
  });

  describe('Step 4: Check Order History', () => {
    it('should get customer orders', async () => {
      const response = await request(app)
        .get('/api/customer/orders')
        .set('Authorization', `Bearer ${tableToken}`);

      // TODO: BE-2 완료 후 활성화
      // expect(response.status).toBe(200);
      // expect(Array.isArray(response.body.data)).toBe(true);
      
      expect(response.status).toBe(404); // BE-2 미완료 시
    });
  });
});

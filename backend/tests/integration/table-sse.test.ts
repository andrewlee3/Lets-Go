import request from 'supertest';
import { Express } from 'express';
import { createApp } from '../../src/app';
import { AuthController } from '../../src/controllers/auth.controller';
import { AuthService } from '../../src/services/auth.service';
import { AuthRepository } from '../../src/repositories/auth.repository';
import { db, initializeDatabase } from '../../src/database';

describe('Table & SSE Integration Tests', () => {
  let app: Express;
  let authService: AuthService;
  let adminToken: string;
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
    authService = new AuthService(authRepo);
    const authController = new AuthController(authService);
    app = createApp(authController, authService);

    // Get admin token
    const adminRes = await request(app)
      .post('/api/admin/login')
      .send({ storeId: 'store1', username: 'admin', password: 'admin123' });
    adminToken = adminRes.body.data.token;

    // Get table token (creates session)
    const tableRes = await request(app)
      .post('/api/customer/table/setup')
      .send({ storeId: 'store1', tableNumber: '1', tablePassword: 'table123' });
    tableToken = tableRes.body.data.token;
  });

  describe('POST /api/admin/tables/:id/complete', () => {
    it('should complete table session with valid admin token', async () => {
      const response = await request(app)
        .post('/api/admin/tables/table-1/complete')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should return 401 without token', async () => {
      const response = await request(app)
        .post('/api/admin/tables/table-1/complete');

      expect(response.status).toBe(401);
    });

    it('should return 403 with table token', async () => {
      const response = await request(app)
        .post('/api/admin/tables/table-1/complete')
        .set('Authorization', `Bearer ${tableToken}`);

      expect(response.status).toBe(403);
    });

    it('should return 400 when no active session', async () => {
      const response = await request(app)
        .post('/api/admin/tables/table-1/complete')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/admin/tables/:id/history', () => {
    it('should return table history with valid admin token', async () => {
      const response = await request(app)
        .get('/api/admin/tables/table-1/history')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.sessions).toBeDefined();
      expect(Array.isArray(response.body.data.sessions)).toBe(true);
    });

    it('should return 404 for non-existent table', async () => {
      const response = await request(app)
        .get('/api/admin/tables/non-existent/history')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/customer/sse/orders', () => {
    it('should return 401 without token', async () => {
      const response = await request(app)
        .get('/api/customer/sse/orders');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/admin/sse/orders', () => {
    it('should return 401 without token', async () => {
      const response = await request(app)
        .get('/api/admin/sse/orders');

      expect(response.status).toBe(401);
    });
  });
});

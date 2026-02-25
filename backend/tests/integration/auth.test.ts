import request from 'supertest';
import { Express } from 'express';
import { createApp } from '../../src/app';
import { AuthController } from '../../src/controllers/auth.controller';
import { AuthService } from '../../src/services/auth.service';
import { AuthRepository } from '../../src/repositories/auth.repository';
import { db, initializeDatabase } from '../../src/database';

describe('Auth Integration Tests', () => {
  let app: Express;
  let authRepo: AuthRepository;
  let authService: AuthService;
  let authController: AuthController;

  beforeAll(() => {
    // Clear and initialize database
    db.adminUsers.clear();
    db.tables.clear();
    db.sessions.clear();
    db.loginAttempts.clear();
    
    initializeDatabase();

    authRepo = new AuthRepository();
    authService = new AuthService(authRepo);
    authController = new AuthController(authService);
    app = createApp(authController);
  });

  beforeEach(() => {
    // Clear login attempts before each test
    db.loginAttempts.clear();
  });

  describe('POST /api/admin/login', () => {
    it('should login successfully with valid credentials', async () => {
      const response = await request(app)
        .post('/api/admin/login')
        .send({
          storeId: 'store1',
          username: 'admin',
          password: 'admin123',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('expiresIn');
    });

    it('should fail with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/admin/login')
        .send({
          storeId: 'store1',
          username: 'admin',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid credentials');
    });

    it('should fail with missing fields', async () => {
      const response = await request(app)
        .post('/api/admin/login')
        .send({
          storeId: 'store1',
          username: 'admin',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Missing required fields');
    });

    it('should block after 5 failed attempts', async () => {
      // Make 5 failed attempts
      for (let i = 0; i < 5; i++) {
        await request(app)
          .post('/api/admin/login')
          .send({
            storeId: 'store1',
            username: 'testuser',
            password: 'wrongpassword',
          });
      }

      // 6th attempt should be blocked
      const response = await request(app)
        .post('/api/admin/login')
        .send({
          storeId: 'store1',
          username: 'testuser',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(429);
      expect(response.body.error).toContain('Too many login attempts');
    });
  });

  describe('POST /api/customer/table/setup', () => {
    it('should setup table successfully with valid credentials', async () => {
      const response = await request(app)
        .post('/api/customer/table/setup')
        .send({
          storeId: 'store1',
          tableNumber: '1',
          tablePassword: 'table123',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('tableInfo');
      expect(response.body.data.tableInfo).toHaveProperty('tableId');
      expect(response.body.data.tableInfo).toHaveProperty('sessionId');
    });

    it('should fail with invalid table credentials', async () => {
      const response = await request(app)
        .post('/api/customer/table/setup')
        .send({
          storeId: 'store1',
          tableNumber: '1',
          tablePassword: 'wrongpassword',
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/customer/table/auto-login', () => {
    it('should validate valid token', async () => {
      // First, get a token
      const setupResponse = await request(app)
        .post('/api/customer/table/setup')
        .send({
          storeId: 'store1',
          tableNumber: '1',
          tablePassword: 'table123',
        });

      const token = setupResponse.body.data.token;

      // Then validate it
      const response = await request(app)
        .post('/api/customer/table/auto-login')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.valid).toBe(true);
    });

    it('should reject invalid token', async () => {
      const response = await request(app)
        .post('/api/customer/table/auto-login')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should reject missing authorization header', async () => {
      const response = await request(app)
        .post('/api/customer/table/auto-login');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});

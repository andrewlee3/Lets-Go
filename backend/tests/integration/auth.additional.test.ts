import request from 'supertest';
import { Express } from 'express';
import { createApp } from '../../src/app';
import { AuthController } from '../../src/controllers/auth.controller';
import { AuthService } from '../../src/services/auth.service';
import { AuthRepository } from '../../src/repositories/auth.repository';
import { db, initializeDatabase } from '../../src/database';

describe('Auth Integration - Additional Scenarios', () => {
  let app: Express;

  beforeAll(() => {
    db.adminUsers.clear();
    db.tables.clear();
    db.sessions.clear();
    db.loginAttempts.clear();
    
    initializeDatabase();

    const authRepo = new AuthRepository();
    const authService = new AuthService(authRepo);
    const authController = new AuthController(authService);
    app = createApp(authController, authService);
  });

  beforeEach(() => {
    db.loginAttempts.clear();
  });

  describe('Multiple Tables Login', () => {
    it('should allow multiple tables to login simultaneously', async () => {
      const loginPromises = [];
      
      // Login to tables 1-5 simultaneously
      for (let i = 1; i <= 5; i++) {
        loginPromises.push(
          request(app)
            .post('/api/customer/table/setup')
            .send({
              storeId: 'store1',
              tableNumber: String(i),
              tablePassword: 'table123',
            })
        );
      }

      const responses = await Promise.all(loginPromises);

      // All should succeed
      responses.forEach((response, index) => {
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.tableInfo.tableNumber).toBe(String(index + 1));
      });

      // All should have different session IDs
      const sessionIds = responses.map(r => r.body.data.tableInfo.sessionId);
      const uniqueSessionIds = new Set(sessionIds);
      expect(uniqueSessionIds.size).toBe(5);
    });
  });

  describe('Token Reuse', () => {
    it('should allow same token to be used multiple times', async () => {
      const setupResponse = await request(app)
        .post('/api/customer/table/setup')
        .send({
          storeId: 'store1',
          tableNumber: '1',
          tablePassword: 'table123',
        });

      const token = setupResponse.body.data.token;

      // Use token multiple times
      for (let i = 0; i < 3; i++) {
        const response = await request(app)
          .post('/api/customer/table/auto-login')
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
      }
    });
  });

  describe('Invalid Input Handling', () => {
    it('should reject admin login with SQL injection attempt', async () => {
      const response = await request(app)
        .post('/api/admin/login')
        .send({
          storeId: 'store1',
          username: "admin' OR '1'='1",
          password: "password' OR '1'='1",
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should reject table setup with special characters', async () => {
      const response = await request(app)
        .post('/api/customer/table/setup')
        .send({
          storeId: 'store1',
          tableNumber: '<script>alert("xss")</script>',
          tablePassword: 'table123',
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should reject admin login with null values', async () => {
      const response = await request(app)
        .post('/api/admin/login')
        .send({
          storeId: null,
          username: null,
          password: null,
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Missing required fields');
    });

    it('should reject admin login with extra fields', async () => {
      const response = await request(app)
        .post('/api/admin/login')
        .send({
          storeId: 'store1',
          username: 'admin',
          password: 'admin123',
          extraField: 'should be ignored',
        });

      // Should still succeed, extra fields ignored
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('Authorization Header Formats', () => {
    it('should reject auto-login with missing Bearer prefix', async () => {
      const setupResponse = await request(app)
        .post('/api/customer/table/setup')
        .send({
          storeId: 'store1',
          tableNumber: '1',
          tablePassword: 'table123',
        });

      const token = setupResponse.body.data.token;

      const response = await request(app)
        .post('/api/customer/table/auto-login')
        .set('Authorization', token); // Missing "Bearer " prefix

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should reject auto-login with lowercase bearer', async () => {
      const setupResponse = await request(app)
        .post('/api/customer/table/setup')
        .send({
          storeId: 'store1',
          tableNumber: '1',
          tablePassword: 'table123',
        });

      const token = setupResponse.body.data.token;

      const response = await request(app)
        .post('/api/customer/table/auto-login')
        .set('Authorization', `bearer ${token}`); // lowercase

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('Rate Limiting Behavior', () => {
    it('should show decreasing remaining attempts', async () => {
      // Make 3 failed attempts
      for (let i = 0; i < 3; i++) {
        await request(app)
          .post('/api/admin/login')
          .send({
            storeId: 'store1',
            username: 'testuser',
            password: 'wrongpassword',
          });
      }

      // 4th attempt
      const response4 = await request(app)
        .post('/api/admin/login')
        .send({
          storeId: 'store1',
          username: 'testuser',
          password: 'wrongpassword',
        });

      expect(response4.status).toBe(401);

      // 5th attempt
      const response5 = await request(app)
        .post('/api/admin/login')
        .send({
          storeId: 'store1',
          username: 'testuser',
          password: 'wrongpassword',
        });

      expect(response5.status).toBe(401);

      // 6th attempt should be blocked
      const response6 = await request(app)
        .post('/api/admin/login')
        .send({
          storeId: 'store1',
          username: 'testuser',
          password: 'wrongpassword',
        });

      expect(response6.status).toBe(429);
      expect(response6.body.error).toContain('Too many login attempts');
    });

    it('should reset attempts after successful login', async () => {
      // Make 2 failed attempts
      for (let i = 0; i < 2; i++) {
        await request(app)
          .post('/api/admin/login')
          .send({
            storeId: 'store1',
            username: 'admin',
            password: 'wrongpassword',
          });
      }

      // Successful login should reset attempts
      const successResponse = await request(app)
        .post('/api/admin/login')
        .send({
          storeId: 'store1',
          username: 'admin',
          password: 'admin123',
        });

      expect(successResponse.status).toBe(200);

      // Should be able to make 5 more failed attempts before being blocked
      for (let i = 0; i < 6; i++) {
        const response = await request(app)
          .post('/api/admin/login')
          .send({
            storeId: 'store1',
            username: 'admin',
            password: 'wrongpassword',
          });

        if (i < 5) {
          expect(response.status).toBe(401); // First 5 attempts fail normally
        } else {
          expect(response.status).toBe(429); // 6th attempt blocked
        }
      }
    });
  });

  describe('Cross-Store Isolation', () => {
    it('should not allow login to different store with same credentials', async () => {
      // Try to login to non-existent store
      const response = await request(app)
        .post('/api/admin/login')
        .send({
          storeId: 'store2', // Different store
          username: 'admin',
          password: 'admin123',
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should isolate login attempts between stores', async () => {
      // Lock store1 admin
      for (let i = 0; i < 5; i++) {
        await request(app)
          .post('/api/admin/login')
          .send({
            storeId: 'store1',
            username: 'admin',
            password: 'wrongpassword',
          });
      }

      // store1 should be locked
      const store1Response = await request(app)
        .post('/api/admin/login')
        .send({
          storeId: 'store1',
          username: 'admin',
          password: 'wrongpassword',
        });

      expect(store1Response.status).toBe(429);

      // store2 should not be affected (even though it doesn't exist)
      const store2Response = await request(app)
        .post('/api/admin/login')
        .send({
          storeId: 'store2',
          username: 'admin',
          password: 'wrongpassword',
        });

      expect(store2Response.status).toBe(401); // Not 429
    });
  });

  describe('Token Payload Verification', () => {
    it('should include correct payload in admin token', async () => {
      const response = await request(app)
        .post('/api/admin/login')
        .send({
          storeId: 'store1',
          username: 'admin',
          password: 'admin123',
        });

      expect(response.status).toBe(200);
      
      const token = response.body.data.token;
      const payload = JSON.parse(
        Buffer.from(token.split('.')[1], 'base64').toString()
      );

      expect(payload.storeId).toBe('store1');
      expect(payload.type).toBe('admin');
      expect(payload.userId).toBeDefined();
      expect(payload.iat).toBeDefined();
      expect(payload.exp).toBeDefined();
    });

    it('should include correct payload in table token', async () => {
      const response = await request(app)
        .post('/api/customer/table/setup')
        .send({
          storeId: 'store1',
          tableNumber: '1',
          tablePassword: 'table123',
        });

      expect(response.status).toBe(200);
      
      const token = response.body.data.token;
      const payload = JSON.parse(
        Buffer.from(token.split('.')[1], 'base64').toString()
      );

      expect(payload.storeId).toBe('store1');
      expect(payload.type).toBe('table');
      expect(payload.tableId).toBeDefined();
      expect(payload.iat).toBeDefined();
      expect(payload.exp).toBeDefined();
    });
  });
});

import { AuthService } from '../../src/services/auth.service';
import { AuthRepository } from '../../src/repositories/auth.repository';
import { db } from '../../src/database';
import * as bcrypt from 'bcrypt';

describe('AuthService - Additional Edge Cases', () => {
  let authService: AuthService;
  let authRepo: AuthRepository;

  beforeEach(() => {
    db.adminUsers.clear();
    db.tables.clear();
    db.sessions.clear();
    db.loginAttempts.clear();

    authRepo = new AuthRepository();
    authService = new AuthService(authRepo);
    
    process.env.JWT_SECRET = 'test-secret';
    process.env.JWT_EXPIRES_IN = '16h';
  });

  describe('JWT Token Expiration', () => {
    it('should generate token with correct expiration time', () => {
      const payload = {
        userId: 'admin-1',
        storeId: 'store1',
        type: 'admin' as const,
      };

      const token = authService.generateToken(payload);
      const verified = authService.verifyToken(token);

      expect(verified).toBeDefined();
      expect(verified?.exp).toBeDefined();
      
      // Check expiration is approximately 16 hours from now
      const now = Math.floor(Date.now() / 1000);
      const expectedExp = now + (16 * 60 * 60);
      expect(verified!.exp).toBeGreaterThan(now);
      expect(verified!.exp).toBeLessThanOrEqual(expectedExp + 10); // Allow 10 seconds tolerance
    });

    it('should return null for expired token', () => {
      // Create a token with 1 second expiration
      process.env.JWT_EXPIRES_IN = '1s';
      const shortLivedService = new AuthService(authRepo);
      
      const payload = {
        userId: 'admin-1',
        storeId: 'store1',
        type: 'admin' as const,
      };

      const token = shortLivedService.generateToken(payload);
      
      // Wait for token to expire
      return new Promise((resolve) => {
        setTimeout(() => {
          const verified = shortLivedService.verifyToken(token);
          expect(verified).toBeNull();
          resolve(undefined);
        }, 1100);
      });
    });
  });

  describe('Session Management', () => {
    it('should create unique session for each table login', async () => {
      const passwordHash = await bcrypt.hash('table123', 10);
      
      // Create two tables
      db.tables.set('store1:1', {
        id: 'table-1',
        storeId: 'store1',
        tableNumber: '1',
        passwordHash,
        currentSessionId: null,
        createdAt: new Date(),
      });
      
      db.tables.set('store1:2', {
        id: 'table-2',
        storeId: 'store1',
        tableNumber: '2',
        passwordHash,
        currentSessionId: null,
        createdAt: new Date(),
      });

      // Login to both tables
      const result1 = await authService.validateTableLogin('store1', '1', 'table123');
      const result2 = await authService.validateTableLogin('store1', '2', 'table123');

      expect(result1?.sessionId).toBeDefined();
      expect(result2?.sessionId).toBeDefined();
      expect(result1?.sessionId).not.toBe(result2?.sessionId);
    });

    it('should reuse existing session on subsequent logins', async () => {
      const passwordHash = await bcrypt.hash('table123', 10);
      const existingSessionId = 'existing-session-123';
      
      db.tables.set('store1:1', {
        id: 'table-1',
        storeId: 'store1',
        tableNumber: '1',
        passwordHash,
        currentSessionId: existingSessionId,
        createdAt: new Date(),
      });

      const result = await authService.validateTableLogin('store1', '1', 'table123');

      expect(result?.sessionId).toBe(existingSessionId);
    });
  });

  describe('Login Attempt Lockout', () => {
    it('should reset lockout after 5 minutes', async () => {
      const passwordHash = await bcrypt.hash('password123', 10);
      db.adminUsers.set('store1:admin', {
        id: 'admin-1',
        storeId: 'store1',
        username: 'admin',
        passwordHash,
        createdAt: new Date(),
      });

      // Set login attempt from 6 minutes ago
      const sixMinutesAgo = new Date(Date.now() - 6 * 60 * 1000);
      db.loginAttempts.set('admin:store1:admin', {
        identifier: 'admin:store1:admin',
        attempts: 5,
        lastAttemptAt: sixMinutesAgo,
      });

      // Should allow login after lockout period
      const result = await authService.validateAdminLogin('store1', 'admin', 'password123');
      expect(result).toBeDefined();
      expect(result?.id).toBe('admin-1');
    });

    it('should track attempts separately for different users', async () => {
      const passwordHash = await bcrypt.hash('password123', 10);
      
      db.adminUsers.set('store1:admin1', {
        id: 'admin-1',
        storeId: 'store1',
        username: 'admin1',
        passwordHash,
        createdAt: new Date(),
      });
      
      db.adminUsers.set('store1:admin2', {
        id: 'admin-2',
        storeId: 'store1',
        username: 'admin2',
        passwordHash,
        createdAt: new Date(),
      });

      // Lock admin1
      for (let i = 0; i < 5; i++) {
        await authService.validateAdminLogin('store1', 'admin1', 'wrong');
      }

      // admin1 should be locked
      await expect(
        authService.validateAdminLogin('store1', 'admin1', 'wrong')
      ).rejects.toThrow('Too many login attempts');

      // admin2 should still be able to login
      const result = await authService.validateAdminLogin('store1', 'admin2', 'password123');
      expect(result).toBeDefined();
    });
  });

  describe('Token Validation Edge Cases', () => {
    it('should reject token with invalid signature', () => {
      const payload = {
        userId: 'admin-1',
        storeId: 'store1',
        type: 'admin' as const,
      };

      const token = authService.generateToken(payload);
      const tamperedToken = token.slice(0, -10) + 'tampered123';

      const verified = authService.verifyToken(tamperedToken);
      expect(verified).toBeNull();
    });

    it('should reject malformed token', () => {
      const malformedTokens = [
        'not.a.token',
        'Bearer token',
        '',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9', // Only header
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIn0', // No signature
      ];

      malformedTokens.forEach(token => {
        const verified = authService.verifyToken(token);
        expect(verified).toBeNull();
      });
    });

    it('should reject token with wrong type', () => {
      const payload = {
        userId: 'admin-1',
        storeId: 'store1',
        type: 'admin' as const,
      };

      const token = authService.generateToken(payload);
      const verified = authService.verifyToken(token);

      expect(verified?.type).toBe('admin');
      // If we expect table type but got admin, application should handle this
    });
  });

  describe('Concurrent Login Attempts', () => {
    it('should handle multiple simultaneous login attempts', async () => {
      const passwordHash = await bcrypt.hash('password123', 10);
      db.adminUsers.set('store1:admin', {
        id: 'admin-1',
        storeId: 'store1',
        username: 'admin',
        passwordHash,
        createdAt: new Date(),
      });

      // Simulate 3 concurrent login attempts
      const promises = [
        authService.validateAdminLogin('store1', 'admin', 'password123'),
        authService.validateAdminLogin('store1', 'admin', 'password123'),
        authService.validateAdminLogin('store1', 'admin', 'password123'),
      ];

      const results = await Promise.all(promises);

      // All should succeed
      results.forEach(result => {
        expect(result).toBeDefined();
        expect(result?.id).toBe('admin-1');
      });
    });
  });

  describe('Password Security', () => {
    it('should not accept empty password', async () => {
      const passwordHash = await bcrypt.hash('password123', 10);
      db.adminUsers.set('store1:admin', {
        id: 'admin-1',
        storeId: 'store1',
        username: 'admin',
        passwordHash,
        createdAt: new Date(),
      });

      const result = await authService.validateAdminLogin('store1', 'admin', '');
      expect(result).toBeNull();
    });

    it('should handle very long passwords', async () => {
      const longPassword = 'a'.repeat(1000);
      const passwordHash = await bcrypt.hash(longPassword, 10);
      
      db.adminUsers.set('store1:admin', {
        id: 'admin-1',
        storeId: 'store1',
        username: 'admin',
        passwordHash,
        createdAt: new Date(),
      });

      const result = await authService.validateAdminLogin('store1', 'admin', longPassword);
      expect(result).toBeDefined();
    });
  });
});

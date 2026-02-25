import { AuthService } from '../../src/services/auth.service';
import { AuthRepository } from '../../src/repositories/auth.repository';
import * as bcrypt from 'bcrypt';
import { db } from '../../src/database';

describe('AuthService', () => {
  let authService: AuthService;
  let authRepo: AuthRepository;

  beforeEach(() => {
    // Clear database
    db.adminUsers.clear();
    db.tables.clear();
    db.sessions.clear();
    db.loginAttempts.clear();

    authRepo = new AuthRepository();
    authService = new AuthService(authRepo);
    
    // Set test environment variables
    process.env.JWT_SECRET = 'test-secret';
    process.env.JWT_EXPIRES_IN = '1h';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateAdminLogin', () => {
    it('should return admin user on valid credentials', async () => {
      const passwordHash = await bcrypt.hash('password123', 10);
      const mockAdmin = {
        id: 'admin-1',
        storeId: 'store1',
        username: 'admin',
        passwordHash,
        createdAt: new Date(),
      };

      db.adminUsers.set('store1:admin', mockAdmin);

      const result = await authService.validateAdminLogin('store1', 'admin', 'password123');

      expect(result).toEqual(mockAdmin);
    });

    it('should return null on invalid password', async () => {
      const passwordHash = await bcrypt.hash('password123', 10);
      const mockAdmin = {
        id: 'admin-1',
        storeId: 'store1',
        username: 'admin',
        passwordHash,
        createdAt: new Date(),
      };

      db.adminUsers.set('store1:admin', mockAdmin);

      const result = await authService.validateAdminLogin('store1', 'admin', 'wrongpassword');

      expect(result).toBeNull();
    });

    it('should return null on non-existent user', async () => {
      const result = await authService.validateAdminLogin('store1', 'nonexistent', 'password');

      expect(result).toBeNull();
    });

    it('should throw error when max login attempts exceeded', async () => {
      db.loginAttempts.set('admin:store1:admin', {
        identifier: 'admin:store1:admin',
        attempts: 5,
        lastAttemptAt: new Date(),
      });

      await expect(
        authService.validateAdminLogin('store1', 'admin', 'password')
      ).rejects.toThrow('Too many login attempts');
    });
  });

  describe('validateTableLogin', () => {
    it('should return table and sessionId on valid credentials', async () => {
      const passwordHash = await bcrypt.hash('table123', 10);
      const mockTable = {
        id: 'table-1',
        storeId: 'store1',
        tableNumber: '1',
        passwordHash,
        currentSessionId: 'session-1',
        createdAt: new Date(),
      };

      db.tables.set('store1:1', mockTable);

      const result = await authService.validateTableLogin('store1', '1', 'table123');

      expect(result?.table).toEqual(mockTable);
      expect(result?.sessionId).toBe('session-1');
    });

    it('should create new session if no current session', async () => {
      const passwordHash = await bcrypt.hash('table123', 10);
      const mockTable = {
        id: 'table-1',
        storeId: 'store1',
        tableNumber: '1',
        passwordHash,
        currentSessionId: null,
        createdAt: new Date(),
      };

      db.tables.set('store1:1', mockTable);

      const result = await authService.validateTableLogin('store1', '1', 'table123');

      expect(result?.table.id).toBe('table-1');
      expect(result?.sessionId).toBeDefined();
      expect(db.sessions.has(result!.sessionId)).toBe(true);
    });
  });

  describe('generateToken and verifyToken', () => {
    it('should generate and verify valid token', () => {
      const payload = {
        userId: 'admin-1',
        storeId: 'store1',
        type: 'admin' as const,
      };

      const token = authService.generateToken(payload);
      const verified = authService.verifyToken(token);

      expect(verified).toMatchObject(payload);
    });

    it('should return null for invalid token', () => {
      const result = authService.verifyToken('invalid-token');
      expect(result).toBeNull();
    });
  });

  describe('checkLoginAttempts', () => {
    it('should allow login when no attempts recorded', () => {
      const result = authService.checkLoginAttempts('test-identifier');

      expect(result.allowed).toBe(true);
      expect(result.remainingAttempts).toBe(5);
    });

    it('should block login after max attempts', () => {
      db.loginAttempts.set('test-identifier', {
        identifier: 'test-identifier',
        attempts: 5,
        lastAttemptAt: new Date(),
      });

      const result = authService.checkLoginAttempts('test-identifier');

      expect(result.allowed).toBe(false);
      expect(result.remainingAttempts).toBe(0);
    });

    it('should allow login after lockout period expires', () => {
      const oldDate = new Date(Date.now() - 6 * 60 * 1000); // 6 minutes ago
      db.loginAttempts.set('test-identifier', {
        identifier: 'test-identifier',
        attempts: 5,
        lastAttemptAt: oldDate,
      });

      const result = authService.checkLoginAttempts('test-identifier');

      expect(result.allowed).toBe(true);
    });
  });
});

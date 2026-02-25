import { TableService } from '../../src/services/table.service';
import { TableRepository } from '../../src/repositories/table.repository';
import { SessionRepository } from '../../src/repositories/session.repository';
import { AppError } from '../../src/middlewares/error.middleware';
import { db } from '../../src/database';
import * as bcrypt from 'bcrypt';

describe('TableService', () => {
  let service: TableService;
  let tableRepo: TableRepository;
  let sessionRepo: SessionRepository;

  beforeEach(() => {
    // Clear database
    db.tables.clear();
    db.sessions.clear();
    db.orders.clear();

    // Create test table
    const passwordHash = bcrypt.hashSync('test123', 10);
    db.tables.set('store1:1', {
      id: 'table-1',
      storeId: 'store1',
      tableNumber: '1',
      passwordHash,
      currentSessionId: null,
      createdAt: new Date(),
    });

    tableRepo = new TableRepository();
    sessionRepo = new SessionRepository();
    service = new TableService(tableRepo, sessionRepo);
  });

  describe('getTableById', () => {
    it('should return table when exists', () => {
      const result = service.getTableById('table-1');
      expect(result).not.toBeNull();
      expect(result?.id).toBe('table-1');
    });

    it('should return null when not exists', () => {
      const result = service.getTableById('non-existent');
      expect(result).toBeNull();
    });
  });

  describe('createSession', () => {
    it('should create session and update table', () => {
      const session = service.createSession('table-1');
      
      expect(session.id).toBeDefined();
      expect(session.tableId).toBe('table-1');
      
      const table = service.getTableById('table-1');
      expect(table?.currentSessionId).toBe(session.id);
    });

    it('should throw 404 when table not found', () => {
      expect(() => service.createSession('non-existent')).toThrow(AppError);
    });
  });

  describe('completeTableSession', () => {
    it('should complete session and clear table session', () => {
      // Create session first
      const session = service.createSession('table-1');
      
      // Complete session
      service.completeTableSession('table-1');
      
      const table = service.getTableById('table-1');
      expect(table?.currentSessionId).toBeNull();
      
      const completedSession = sessionRepo.findById(session.id);
      expect(completedSession?.completedAt).not.toBeNull();
    });

    it('should throw 404 when table not found', () => {
      expect(() => service.completeTableSession('non-existent')).toThrow(AppError);
    });

    it('should throw 400 when no active session', () => {
      expect(() => service.completeTableSession('table-1')).toThrow(AppError);
    });
  });

  describe('getTableHistory', () => {
    it('should return past sessions', () => {
      // Create and complete a session
      service.createSession('table-1');
      service.completeTableSession('table-1');
      
      const history = service.getTableHistory('table-1');
      
      expect(history).toHaveLength(1);
      expect(history[0].completedAt).toBeDefined();
    });

    it('should throw 404 when table not found', () => {
      expect(() => service.getTableHistory('non-existent')).toThrow(AppError);
    });
  });
});

import { AdminUser, Table, LoginAttempt } from '../types';
import { db } from '../database';

export class AuthRepository {
  findAdminByStoreAndUsername(storeId: string, username: string): AdminUser | undefined {
    const key = `${storeId}:${username}`;
    return db.adminUsers.get(key);
  }

  findTableByStoreAndNumber(storeId: string, tableNumber: string): Table | undefined {
    const key = `${storeId}:${tableNumber}`;
    return db.tables.get(key);
  }

  getLoginAttempt(identifier: string): LoginAttempt | undefined {
    return db.loginAttempts.get(identifier);
  }

  recordLoginAttempt(identifier: string, success: boolean): void {
    const existing = this.getLoginAttempt(identifier);
    
    if (success) {
      // Reset attempts on success
      if (existing) {
        db.loginAttempts.delete(identifier);
      }
      return;
    }

    // Increment attempts on failure
    if (existing) {
      db.loginAttempts.set(identifier, {
        identifier,
        attempts: existing.attempts + 1,
        lastAttemptAt: new Date(),
      });
    } else {
      db.loginAttempts.set(identifier, {
        identifier,
        attempts: 1,
        lastAttemptAt: new Date(),
      });
    }
  }

  createSession(tableId: string, sessionId: string): void {
    db.sessions.set(sessionId, {
      id: sessionId,
      tableId,
      startedAt: new Date(),
      completedAt: null,
    });

    // Update table's current session
    for (const [key, table] of db.tables.entries()) {
      if (table.id === tableId) {
        db.tables.set(key, {
          ...table,
          currentSessionId: sessionId,
        });
        break;
      }
    }
  }
}

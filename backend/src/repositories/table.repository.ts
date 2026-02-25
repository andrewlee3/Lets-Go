import { db } from '../database';
import { Table, Session, PastSession, Order } from '../types';

export class TableRepository {
  findById(id: string): Table | null {
    for (const table of db.tables.values()) {
      if (table.id === id) {
        return table;
      }
    }
    return null;
  }

  findByStoreId(storeId: string): Table[] {
    const tables: Table[] = [];
    for (const table of db.tables.values()) {
      if (table.storeId === storeId) {
        tables.push(table);
      }
    }
    return tables;
  }

  updateSession(tableId: string, sessionId: string | null): void {
    for (const [key, table] of db.tables.entries()) {
      if (table.id === tableId) {
        table.currentSessionId = sessionId;
        db.tables.set(key, table);
        return;
      }
    }
  }
}

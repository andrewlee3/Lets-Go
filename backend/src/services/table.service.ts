import { TableRepository } from '../repositories/table.repository';
import { SessionRepository } from '../repositories/session.repository';
import { Table, Session, PastSession } from '../types';
import { AppError } from '../middlewares/error.middleware';

export class TableService {
  constructor(
    private tableRepo: TableRepository,
    private sessionRepo: SessionRepository
  ) {}

  getTableById(id: string): Table | null {
    return this.tableRepo.findById(id);
  }

  getTablesByStoreId(storeId: string): Table[] {
    return this.tableRepo.findByStoreId(storeId);
  }

  createSession(tableId: string): Session {
    const table = this.tableRepo.findById(tableId);
    if (!table) {
      throw new AppError(404, 'Table not found');
    }
    const session = this.sessionRepo.create(tableId);
    this.tableRepo.updateSession(tableId, session.id);
    return session;
  }

  completeTableSession(tableId: string): void {
    const table = this.tableRepo.findById(tableId);
    if (!table) {
      throw new AppError(404, 'Table not found');
    }
    if (!table.currentSessionId) {
      throw new AppError(400, 'No active session');
    }
    this.sessionRepo.complete(table.currentSessionId);
    this.tableRepo.updateSession(tableId, null);
  }

  getTableHistory(tableId: string): PastSession[] {
    const table = this.tableRepo.findById(tableId);
    if (!table) {
      throw new AppError(404, 'Table not found');
    }
    return this.sessionRepo.findCompletedByTableId(tableId);
  }
}

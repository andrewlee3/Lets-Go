import * as bcrypt from 'bcrypt';

// In-memory database
interface Database {
  adminUsers: Map<string, any>;
  tables: Map<string, any>;
  sessions: Map<string, any>;
  loginAttempts: Map<string, any>;
}

export const db: Database = {
  adminUsers: new Map(),
  tables: new Map(),
  sessions: new Map(),
  loginAttempts: new Map(),
};

export const initializeDatabase = (): void => {
  // Create default admin user for testing (store1, admin, admin123)
  const adminId = 'admin-1';
  const storeId = 'store1';
  const username = 'admin';
  const password = 'admin123';
  
  const adminKey = `${storeId}:${username}`;
  if (!db.adminUsers.has(adminKey)) {
    const passwordHash = bcrypt.hashSync(password, 10);
    db.adminUsers.set(adminKey, {
      id: adminId,
      storeId,
      username,
      passwordHash,
      createdAt: new Date(),
    });
    console.log('Default admin user created: store1/admin/admin123');
  }

  // Create default table for testing (store1, table-1, password: table123)
  const tableId = 'table-1';
  const tableNumber = '1';
  const tablePassword = 'table123';
  
  const tableKey = `${storeId}:${tableNumber}`;
  if (!db.tables.has(tableKey)) {
    const tablePasswordHash = bcrypt.hashSync(tablePassword, 10);
    db.tables.set(tableKey, {
      id: tableId,
      storeId,
      tableNumber,
      passwordHash: tablePasswordHash,
      currentSessionId: null,
      createdAt: new Date(),
    });
    console.log('Default table created: store1/table-1/table123');
  }
};


import * as bcrypt from 'bcrypt';
import { Category, Menu, Order } from '../types';

// In-memory database
interface Database {
  adminUsers: Map<string, any>;
  tables: Map<string, any>;
  sessions: Map<string, any>;
  orders: Map<string, Order>;
  loginAttempts: Map<string, any>;
  // BE-2: Menu
  categories: Map<string, Category>;
  menus: Map<string, Menu>;
}

export const db: Database = {
  adminUsers: new Map(),
  tables: new Map(),
  sessions: new Map(),
  orders: new Map(),
  loginAttempts: new Map(),
  // BE-2
  categories: new Map(),
  menus: new Map(),
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

  // Create default tables for testing (store1, table 1-10, password: table123)
  const tablePassword = 'table123';
  const tablePasswordHash = bcrypt.hashSync(tablePassword, 10);
  
  for (let i = 1; i <= 10; i++) {
    const tableId = `table-${i}`;
    const tableNumber = String(i);
    const tableKey = `${storeId}:${tableNumber}`;
    
    if (!db.tables.has(tableKey)) {
      db.tables.set(tableKey, {
        id: tableId,
        storeId,
        tableNumber,
        passwordHash: tablePasswordHash,
        currentSessionId: null,
        createdAt: new Date(),
      });
    }
  }
  console.log('Default tables created: store1/1-10/table123');

  // BE-2: Initialize sample menus
  if (db.menus.size === 0) {
    initializeSampleMenus();
  }
};

// BE-2: Sample menu data (US-4.1)
function initializeSampleMenus(): void {
  const categories = [
    { id: 'cat-1', name: '메인', order: 1 },
    { id: 'cat-2', name: '사이드', order: 2 },
    { id: 'cat-3', name: '음료', order: 3 },
    { id: 'cat-4', name: '디저트', order: 4 },
  ];

  const menus: Menu[] = [
    { id: 'menu-1', name: '불고기 버거', price: 8500, description: '달콤한 불고기 패티', imageUrl: '/images/bulgogi.jpg', categoryId: 'cat-1' },
    { id: 'menu-2', name: '치즈 버거', price: 7500, description: '고소한 치즈', imageUrl: '/images/cheese.jpg', categoryId: 'cat-1' },
    { id: 'menu-3', name: '새우 버거', price: 8000, description: '바삭한 새우 패티', imageUrl: '/images/shrimp.jpg', categoryId: 'cat-1' },
    { id: 'menu-4', name: '감자튀김', price: 3000, description: '바삭바삭', imageUrl: '/images/fries.jpg', categoryId: 'cat-2' },
    { id: 'menu-5', name: '치즈스틱', price: 3500, description: '쭉쭉 늘어나는', imageUrl: '/images/cheesestick.jpg', categoryId: 'cat-2' },
    { id: 'menu-6', name: '콜라', price: 2000, description: '시원한 콜라', imageUrl: '/images/cola.jpg', categoryId: 'cat-3' },
    { id: 'menu-7', name: '사이다', price: 2000, description: '청량한 사이다', imageUrl: '/images/cider.jpg', categoryId: 'cat-3' },
    { id: 'menu-8', name: '아이스크림', price: 1500, description: '달콤한 바닐라', imageUrl: '/images/icecream.jpg', categoryId: 'cat-4' },
  ];

  categories.forEach(cat => db.categories.set(cat.id, cat));
  menus.forEach(menu => db.menus.set(menu.id, menu));

  console.log(`Sample menus initialized: ${categories.length} categories, ${menus.length} menus`);
}


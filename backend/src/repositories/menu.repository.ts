import { db } from '../database';
import { Category, Menu } from '../types';

export class MenuRepository {
  findAllCategories(): Category[] {
    return Array.from(db.categories.values()).sort((a, b) => a.order - b.order);
  }

  findAllMenus(): Menu[] {
    return Array.from(db.menus.values());
  }

  findMenusByCategory(categoryId: string): Menu[] {
    return Array.from(db.menus.values()).filter(m => m.categoryId === categoryId);
  }

  findMenuById(id: string): Menu | null {
    return db.menus.get(id) || null;
  }

  countMenus(): number {
    return db.menus.size;
  }
}

import { MenuService } from '../../src/services/menu.service';
import { MenuRepository } from '../../src/repositories/menu.repository';
import { db } from '../../src/database';

describe('MenuService', () => {
  const menuRepo = new MenuRepository();
  const service = new MenuService(menuRepo);

  beforeEach(() => {
    db.categories.clear();
    db.menus.clear();
    db.categories.set('c1', { id: 'c1', name: 'Main', order: 1 });
    db.categories.set('c2', { id: 'c2', name: 'Drink', order: 2 });
    db.menus.set('m1', { id: 'm1', name: 'Burger', price: 8000, description: 'Tasty', imageUrl: '/img.jpg', categoryId: 'c1' });
    db.menus.set('m2', { id: 'm2', name: 'Cola', price: 2000, description: 'Fresh', imageUrl: '/img.jpg', categoryId: 'c2' });
  });

  describe('getAllMenus', () => {
    it('should return categories and menus', () => {
      const result = service.getAllMenus();
      expect(result.categories).toHaveLength(2);
      expect(result.menus).toHaveLength(2);
    });
  });

  describe('getMenusByCategory', () => {
    it('should return menus for specific category', () => {
      const result = service.getMenusByCategory('c1');
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Burger');
    });
  });
});

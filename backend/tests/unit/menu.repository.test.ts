import { MenuRepository } from '../../src/repositories/menu.repository';
import { db } from '../../src/database';

describe('MenuRepository', () => {
  beforeEach(() => {
    db.categories.clear();
    db.menus.clear();
    db.categories.set('c1', { id: 'c1', name: 'Main', order: 1 });
    db.categories.set('c2', { id: 'c2', name: 'Drink', order: 2 });
    db.menus.set('m1', { id: 'm1', name: 'Burger', price: 8000, description: 'Tasty', imageUrl: '/img.jpg', categoryId: 'c1' });
    db.menus.set('m2', { id: 'm2', name: 'Cola', price: 2000, description: 'Fresh', imageUrl: '/img.jpg', categoryId: 'c2' });
  });

  const repo = new MenuRepository();

  it('should return categories ordered by order field', () => {
    const result = repo.findAllCategories();
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('Main');
  });

  it('should return all menus', () => {
    expect(repo.findAllMenus()).toHaveLength(2);
  });

  it('should return menus by category', () => {
    const result = repo.findMenusByCategory('c1');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Burger');
  });

  it('should find menu by id', () => {
    expect(repo.findMenuById('m1')?.name).toBe('Burger');
    expect(repo.findMenuById('invalid')).toBeNull();
  });

  it('should count menus', () => {
    expect(repo.countMenus()).toBe(2);
  });
});

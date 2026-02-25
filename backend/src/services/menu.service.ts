import { MenuRepository } from '../repositories/menu.repository';
import { Category, Menu } from '../types';

export class MenuService {
  constructor(private menuRepo: MenuRepository) {}

  getAllMenus(): { categories: Category[]; menus: Menu[] } {
    return {
      categories: this.menuRepo.findAllCategories(),
      menus: this.menuRepo.findAllMenus(),
    };
  }

  getMenusByCategory(categoryId: string): Menu[] {
    return this.menuRepo.findMenusByCategory(categoryId);
  }
}

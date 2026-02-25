import { Request, Response, NextFunction } from 'express';
import { MenuService } from '../services/menu.service';
import { sendSuccess } from '../utils/response';

export class MenuController {
  constructor(private menuService: MenuService) {}

  getMenus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { categoryId } = req.query;
      if (categoryId && typeof categoryId === 'string') {
        const menus = this.menuService.getMenusByCategory(categoryId);
        sendSuccess(res, 200, { menus });
      } else {
        const data = this.menuService.getAllMenus();
        sendSuccess(res, 200, data);
      }
    } catch (error) {
      next(error);
    }
  };
}

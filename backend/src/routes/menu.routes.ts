import { Router } from 'express';
import { MenuController } from '../controllers/menu.controller';

export const createMenuRoutes = (controller: MenuController): Router => {
  const router = Router();
  router.get('/', controller.getMenus);
  return router;
};

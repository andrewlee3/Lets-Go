import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

export const createAuthRoutes = (controller: AuthController): Router => {
  const router = Router();

  router.post('/admin/login', controller.adminLogin);
  router.post('/customer/table/setup', controller.tableSetup);
  router.post('/customer/table/auto-login', controller.autoLogin);

  return router;
};

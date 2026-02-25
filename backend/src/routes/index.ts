import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { createAuthRoutes } from './auth.routes';

export const createRoutes = (authController: AuthController): Router => {
  const router = Router();

  router.use('/api', createAuthRoutes(authController));

  return router;
};

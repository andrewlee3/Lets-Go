import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { TableController } from '../controllers/table.controller';
import { SSEController } from '../controllers/sse.controller';
import { AuthService } from '../services/auth.service';
import { TableService } from '../services/table.service';
import { sseService } from '../services/sse.service';
import { TableRepository } from '../repositories/table.repository';
import { SessionRepository } from '../repositories/session.repository';
import { createAuthRoutes } from './auth.routes';
import { createTableRoutes } from './table.routes';
import { createSSERoutes } from './sse.routes';
import { createAuthMiddleware, requireAdmin } from '../middlewares/auth.middleware';

export const createRoutes = (authController: AuthController, authService: AuthService): Router => {
  const router = Router();

  // Repositories
  const tableRepo = new TableRepository();
  const sessionRepo = new SessionRepository();

  // Services
  const tableService = new TableService(tableRepo, sessionRepo);

  // Controllers
  const tableController = new TableController(tableService);
  const sseController = new SSEController(sseService);

  // Middleware
  const authMiddleware = createAuthMiddleware(authService);

  // Auth routes (public)
  router.use('/api', createAuthRoutes(authController));

  // Table routes (admin only)
  const tableRoutes = createTableRoutes(tableController);
  router.use('/api/admin/tables', authMiddleware, requireAdmin, tableRoutes);

  // SSE routes (authenticated)
  const sseRoutes = createSSERoutes(sseController);
  router.use('/api', authMiddleware, sseRoutes);

  return router;
};

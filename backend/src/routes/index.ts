import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { TableController } from '../controllers/table.controller';
import { SSEController } from '../controllers/sse.controller';
import { MenuController } from '../controllers/menu.controller';
import { OrderController } from '../controllers/order.controller';
import { AuthService } from '../services/auth.service';
import { TableService } from '../services/table.service';
import { MenuService } from '../services/menu.service';
import { OrderService } from '../services/order.service';
import { sseService } from '../services/sse.service';
import { TableRepository } from '../repositories/table.repository';
import { SessionRepository } from '../repositories/session.repository';
import { MenuRepository } from '../repositories/menu.repository';
import { OrderRepository } from '../repositories/order.repository';
import { createAuthRoutes } from './auth.routes';
import { createTableRoutes } from './table.routes';
import { createSSERoutes } from './sse.routes';
import { createMenuRoutes } from './menu.routes';
import { createCustomerOrderRoutes, createAdminOrderRoutes } from './order.routes';
import { createAuthMiddleware, requireAdmin, requireTable } from '../middlewares/auth.middleware';

export const createRoutes = (authController: AuthController, authService: AuthService): Router => {
  const router = Router();

  // Repositories
  const tableRepo = new TableRepository();
  const sessionRepo = new SessionRepository();
  const menuRepo = new MenuRepository();
  const orderRepo = new OrderRepository();

  // Services
  const tableService = new TableService(tableRepo, sessionRepo);
  const menuService = new MenuService(menuRepo);
  const orderService = new OrderService(orderRepo, menuRepo);

  // Controllers
  const tableController = new TableController(tableService);
  const sseController = new SSEController(sseService);
  const menuController = new MenuController(menuService);
  const orderController = new OrderController(orderService);

  // Middleware
  const authMiddleware = createAuthMiddleware(authService);

  // Auth routes (public)
  router.use('/api', createAuthRoutes(authController));

  // BE-2: Menu routes (public - no auth required)
  router.use('/api/customer/menus', createMenuRoutes(menuController));

  // BE-2: Customer order routes (table auth required)
  router.use('/api/customer/orders', authMiddleware, requireTable, createCustomerOrderRoutes(orderController));

  // BE-2: Admin order routes (admin auth required)
  router.use('/api/admin/orders', authMiddleware, requireAdmin, createAdminOrderRoutes(orderController));

  // BE-3: Table routes (admin only)
  router.use('/api/admin/tables', authMiddleware, requireAdmin, createTableRoutes(tableController));

  // BE-3: SSE routes (authenticated)
  router.use('/api', authMiddleware, createSSERoutes(sseController));

  return router;
};

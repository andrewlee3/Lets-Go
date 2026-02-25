import { Router } from 'express';
import { SSEController } from '../controllers/sse.controller';

export const createSSERoutes = (controller: SSEController): Router => {
  const router = Router();

  router.get('/customer/sse/orders', controller.customerSSE);
  router.get('/admin/sse/orders', controller.adminSSE);

  return router;
};

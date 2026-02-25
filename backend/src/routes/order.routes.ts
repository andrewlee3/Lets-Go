import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';

export const createCustomerOrderRoutes = (controller: OrderController): Router => {
  const router = Router();
  router.post('/', controller.createOrder);
  router.get('/', controller.getCustomerOrders);
  return router;
};

export const createAdminOrderRoutes = (controller: OrderController): Router => {
  const router = Router();
  router.get('/', controller.getAdminOrders);
  router.patch('/:id/status', controller.updateOrderStatus);
  router.delete('/:id', controller.deleteOrder);
  return router;
};

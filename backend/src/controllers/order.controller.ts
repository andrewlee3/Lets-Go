import { Request, Response, NextFunction } from 'express';
import { OrderService } from '../services/order.service';
import { sendSuccess } from '../utils/response';

export class OrderController {
  constructor(private orderService: OrderService) {}

  // POST /api/customer/orders (requires table auth)
  createOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = (req as any).user;
      const { items, sessionId } = req.body;
      const order = this.orderService.createOrder(
        user.tableId!,
        sessionId || user.sessionId,
        user.storeId,
        items
      );
      sendSuccess(res, 201, { orderId: order.id, orderNumber: order.orderNumber });
    } catch (error) {
      next(error);
    }
  };

  // GET /api/customer/orders (requires table auth)
  getCustomerOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = (req as any).user;
      const sessionId = (req.query.sessionId as string) || user.sessionId;
      const orders = this.orderService.getOrdersBySession(sessionId);
      sendSuccess(res, 200, orders);
    } catch (error) {
      next(error);
    }
  };

  // GET /api/admin/orders (requires admin auth)
  getAdminOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = (req as any).user;
      const tables = this.orderService.getOrdersByStore(user.storeId);
      sendSuccess(res, 200, { tables });
    } catch (error) {
      next(error);
    }
  };

  // PATCH /api/admin/orders/:id/status (requires admin auth)
  updateOrderStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      this.orderService.updateOrderStatus(id, status);
      sendSuccess(res, 200, { success: true });
    } catch (error) {
      next(error);
    }
  };

  // DELETE /api/admin/orders/:id (requires admin auth)
  deleteOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      this.orderService.deleteOrder(id);
      sendSuccess(res, 200, { success: true });
    } catch (error) {
      next(error);
    }
  };
}

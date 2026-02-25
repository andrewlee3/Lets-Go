import { Router } from 'express';
import { TableController } from '../controllers/table.controller';

export const createTableRoutes = (controller: TableController): Router => {
  const router = Router();

  router.post('/:id/complete', controller.completeTable);
  router.get('/:id/history', controller.getTableHistory);

  return router;
};

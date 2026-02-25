import { Request, Response, NextFunction } from 'express';
import { TableService } from '../services/table.service';
import { sendSuccess } from '../utils/response';

export class TableController {
  constructor(private tableService: TableService) {}

  // POST /api/admin/tables/:id/complete
  completeTable = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      this.tableService.completeTableSession(id);
      sendSuccess(res, 200, { success: true });
    } catch (error) {
      next(error);
    }
  };

  // GET /api/admin/tables/:id/history
  getTableHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const sessions = this.tableService.getTableHistory(id);
      sendSuccess(res, 200, { sessions });
    } catch (error) {
      next(error);
    }
  };
}

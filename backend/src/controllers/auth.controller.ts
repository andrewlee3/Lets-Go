import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { sendSuccess, sendError } from '../utils/response';
import { AdminLoginDto, TableSetupDto, AuthResponse, TableInfo } from '../types';

export class AuthController {
  constructor(private authService: AuthService) {}

  adminLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { storeId, username, password } = req.body as AdminLoginDto;

      if (!storeId || !username || !password) {
        sendError(res, 400, 'Missing required fields');
        return;
      }

      const admin = await this.authService.validateAdminLogin(storeId, username, password);

      if (!admin) {
        sendError(res, 401, 'Invalid credentials');
        return;
      }

      const token = this.authService.generateToken({
        userId: admin.id,
        storeId: admin.storeId,
        type: 'admin',
      });

      const response: AuthResponse = {
        token,
        expiresIn: this.authService.getExpiresInSeconds(),
      };

      sendSuccess(res, 200, response);
    } catch (error) {
      if (error instanceof Error && error.message.includes('Too many login attempts')) {
        sendError(res, 429, error.message);
        return;
      }
      next(error);
    }
  };

  tableSetup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { storeId, tableNumber, tablePassword } = req.body as TableSetupDto;

      if (!storeId || !tableNumber || !tablePassword) {
        sendError(res, 400, 'Missing required fields');
        return;
      }

      const result = await this.authService.validateTableLogin(storeId, tableNumber, tablePassword);

      if (!result) {
        sendError(res, 401, 'Invalid credentials');
        return;
      }

      const { table, sessionId } = result;

      const token = this.authService.generateToken({
        tableId: table.id,
        storeId: table.storeId,
        type: 'table',
      });

      const tableInfo: TableInfo = {
        tableId: table.id,
        tableNumber: table.tableNumber,
        storeId: table.storeId,
        sessionId,
      };

      const response = {
        token,
        expiresIn: this.authService.getExpiresInSeconds(),
        tableInfo,
      };

      sendSuccess(res, 200, response);
    } catch (error) {
      if (error instanceof Error && error.message.includes('Too many login attempts')) {
        sendError(res, 429, error.message);
        return;
      }
      next(error);
    }
  };

  autoLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        sendError(res, 401, 'Missing or invalid authorization header');
        return;
      }

      const token = authHeader.substring(7);
      const payload = this.authService.verifyToken(token);

      if (!payload || payload.type !== 'table') {
        sendError(res, 401, 'Invalid token');
        return;
      }

      // TODO: [SHARED] Fetch table info from repository
      const tableInfo: TableInfo = {
        tableId: payload.tableId!,
        tableNumber: 'unknown', // Will be fetched from DB
        storeId: payload.storeId,
        sessionId: 'unknown', // Will be fetched from DB
      };

      sendSuccess(res, 200, { valid: true, tableInfo });
    } catch (error) {
      next(error);
    }
  };
}

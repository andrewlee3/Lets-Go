import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { sendError } from '../utils/response';

export const createAuthMiddleware = (authService: AuthService) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      sendError(res, 401, 'No token provided');
      return;
    }

    const token = authHeader.substring(7);
    const payload = authService.verifyToken(token);

    if (!payload) {
      sendError(res, 401, 'Invalid token');
      return;
    }

    // Attach payload to request
    (req as any).user = payload;
    next();
  };
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  const user = (req as any).user;
  
  if (!user || user.type !== 'admin') {
    sendError(res, 403, 'Admin access required');
    return;
  }
  
  next();
};

export const requireTable = (req: Request, res: Response, next: NextFunction): void => {
  const user = (req as any).user;
  
  if (!user || user.type !== 'table') {
    sendError(res, 403, 'Table access required');
    return;
  }
  
  next();
};

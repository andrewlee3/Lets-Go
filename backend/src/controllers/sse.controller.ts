import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { SSEService } from '../services/sse.service';
import { TokenPayload } from '../types';

export class SSEController {
  constructor(private sseService: SSEService) {}

  // GET /api/customer/sse/orders
  customerSSE = (req: Request, res: Response): void => {
    const user = (req as any).user as TokenPayload;
    const clientId = uuidv4();

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    this.sseService.addClient({
      id: clientId,
      type: 'customer',
      storeId: user.storeId,
      sessionId: user.sessionId,
      response: res,
    });

    // Send initial connection message
    res.write(`event: connected\ndata: ${JSON.stringify({ clientId })}\n\n`);

    req.on('close', () => {
      this.sseService.removeClient(clientId);
    });
  };

  // GET /api/admin/sse/orders
  adminSSE = (req: Request, res: Response): void => {
    const user = (req as any).user as TokenPayload;
    const clientId = uuidv4();

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    this.sseService.addClient({
      id: clientId,
      type: 'admin',
      storeId: user.storeId,
      response: res,
    });

    // Send initial connection message
    res.write(`event: connected\ndata: ${JSON.stringify({ clientId })}\n\n`);

    req.on('close', () => {
      this.sseService.removeClient(clientId);
    });
  };
}

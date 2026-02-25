import { SSEClient } from '../types';

export class SSEService {
  private clients: Map<string, SSEClient> = new Map();

  addClient(client: SSEClient): void {
    this.clients.set(client.id, client);
  }

  removeClient(clientId: string): void {
    this.clients.delete(clientId);
  }

  broadcastToStore(storeId: string, event: string, data: unknown): void {
    this.clients.forEach((client) => {
      if (client.type === 'admin' && client.storeId === storeId) {
        client.response.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
      }
    });
  }

  broadcastToSession(sessionId: string, event: string, data: unknown): void {
    this.clients.forEach((client) => {
      if (client.type === 'customer' && client.sessionId === sessionId) {
        client.response.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
      }
    });
  }

  getClientCount(): number {
    return this.clients.size;
  }
}

// Singleton instance for global access
export const sseService = new SSEService();

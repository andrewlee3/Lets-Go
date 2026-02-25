import { v4 as uuidv4 } from 'uuid';
import { db } from '../database';
import { Session, PastSession, Order } from '../types';

export class SessionRepository {
  create(tableId: string): Session {
    const session: Session = {
      id: uuidv4(),
      tableId,
      startedAt: new Date(),
      completedAt: null,
    };
    db.sessions.set(session.id, session);
    return session;
  }

  findById(id: string): Session | null {
    return db.sessions.get(id) || null;
  }

  complete(sessionId: string): void {
    const session = db.sessions.get(sessionId);
    if (session) {
      session.completedAt = new Date();
      db.sessions.set(sessionId, session);
    }
  }

  findCompletedByTableId(tableId: string): PastSession[] {
    const pastSessions: PastSession[] = [];
    
    for (const session of db.sessions.values()) {
      if (session.tableId === tableId && session.completedAt) {
        // Get orders for this session
        const orders: Order[] = [];
        if (db.orders) {
          for (const order of db.orders.values()) {
            if (order.sessionId === session.id) {
              orders.push(order);
            }
          }
        }
        
        const totalAmount = orders.reduce((sum, o) => sum + o.totalAmount, 0);
        
        pastSessions.push({
          sessionId: session.id,
          orders,
          totalAmount,
          completedAt: session.completedAt.toISOString(),
        });
      }
    }
    
    // Sort by completedAt descending
    pastSessions.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
    
    return pastSessions;
  }
}

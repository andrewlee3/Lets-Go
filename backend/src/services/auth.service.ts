import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { AuthRepository } from '../repositories/auth.repository';
import { AdminUser, Table, TokenPayload, TableInfo } from '../types';

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutes

export class AuthService {
  private jwtSecret: string;
  private jwtExpiresIn: string;

  constructor(private authRepo: AuthRepository) {
    this.jwtSecret = process.env.JWT_SECRET || 'default-secret-key';
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '16h';
  }

  async validateAdminLogin(
    storeId: string,
    username: string,
    password: string
  ): Promise<AdminUser | null> {
    const identifier = `admin:${storeId}:${username}`;
    
    // Check login attempts
    const attemptsCheck = this.checkLoginAttempts(identifier);
    if (!attemptsCheck.allowed) {
      throw new Error(`Too many login attempts. Try again in ${Math.ceil(attemptsCheck.remainingTime! / 60000)} minutes.`);
    }

    const admin = this.authRepo.findAdminByStoreAndUsername(storeId, username);
    
    if (!admin) {
      this.authRepo.recordLoginAttempt(identifier, false);
      return null;
    }

    const isValid = await bcrypt.compare(password, admin.passwordHash);
    
    if (!isValid) {
      this.authRepo.recordLoginAttempt(identifier, false);
      return null;
    }

    this.authRepo.recordLoginAttempt(identifier, true);
    return admin;
  }

  async validateTableLogin(
    storeId: string,
    tableNumber: string,
    tablePassword: string
  ): Promise<{ table: Table; sessionId: string } | null> {
    const identifier = `table:${storeId}:${tableNumber}`;
    
    // Check login attempts
    const attemptsCheck = this.checkLoginAttempts(identifier);
    if (!attemptsCheck.allowed) {
      throw new Error(`Too many login attempts. Try again in ${Math.ceil(attemptsCheck.remainingTime! / 60000)} minutes.`);
    }

    const table = this.authRepo.findTableByStoreAndNumber(storeId, tableNumber);
    
    if (!table) {
      this.authRepo.recordLoginAttempt(identifier, false);
      return null;
    }

    const isValid = await bcrypt.compare(tablePassword, table.passwordHash);
    
    if (!isValid) {
      this.authRepo.recordLoginAttempt(identifier, false);
      return null;
    }

    this.authRepo.recordLoginAttempt(identifier, true);

    // Create new session if no current session
    let sessionId = table.currentSessionId;
    if (!sessionId) {
      sessionId = uuidv4();
      this.authRepo.createSession(table.id, sessionId);
    }

    return { table, sessionId };
  }

  generateToken(payload: Omit<TokenPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload, this.jwtSecret, { expiresIn: this.jwtExpiresIn } as jwt.SignOptions);
  }

  verifyToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, this.jwtSecret) as TokenPayload;
    } catch (error) {
      return null;
    }
  }

  checkLoginAttempts(identifier: string): { 
    allowed: boolean; 
    remainingAttempts: number;
    remainingTime?: number;
  } {
    const attempt = this.authRepo.getLoginAttempt(identifier);
    
    if (!attempt) {
      return { allowed: true, remainingAttempts: MAX_LOGIN_ATTEMPTS };
    }

    const timeSinceLastAttempt = Date.now() - attempt.lastAttemptAt.getTime();
    
    if (attempt.attempts >= MAX_LOGIN_ATTEMPTS) {
      if (timeSinceLastAttempt < LOCKOUT_DURATION_MS) {
        return { 
          allowed: false, 
          remainingAttempts: 0,
          remainingTime: LOCKOUT_DURATION_MS - timeSinceLastAttempt
        };
      }
      // Lockout expired, reset
      return { allowed: true, remainingAttempts: MAX_LOGIN_ATTEMPTS };
    }

    return { 
      allowed: true, 
      remainingAttempts: MAX_LOGIN_ATTEMPTS - attempt.attempts 
    };
  }

  getExpiresInSeconds(): number {
    const match = this.jwtExpiresIn.match(/^(\d+)([smhd])$/);
    if (!match) return 16 * 60 * 60; // default 16 hours
    
    const value = parseInt(match[1]);
    const unit = match[2];
    
    switch (unit) {
      case 's': return value;
      case 'm': return value * 60;
      case 'h': return value * 60 * 60;
      case 'd': return value * 24 * 60 * 60;
      default: return 16 * 60 * 60;
    }
  }
}

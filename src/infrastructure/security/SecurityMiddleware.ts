import { Request, Response, NextFunction } from 'express';
import { JWTManager } from './JWTManager';
import { JWTAccessTokenPayload, UserRole, Permission } from '../../domain/iam/IAMTypes';
import { authRepository } from '../repositories/AuthRepository';

// Extend Express Request interface to carry authenticated user payload
export interface AuthenticatedRequest extends Request {
  user?: JWTAccessTokenPayload;
  sessionId?: string;
  ipAddress?: string;
}

// In-memory Rate Limiting Store
interface RateLimitBucket {
  tokens: number;
  lastRefill: number;
}
const rateLimitMap = new Map<string, RateLimitBucket>();

export class SecurityMiddleware {
  /**
   * Enterprise Rate Limiting Middleware (Token Bucket Algorithm)
   * Max 100 requests per minute per IP for standard routes, 10 per minute for auth routes
   */
  public static rateLimiter(maxRequests = 100, windowMs = 60000) {
    return (req: Request, res: Response, next: NextFunction) => {
      const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
      const key = `${clientIp}:${req.path}`;
      const now = Date.now();

      let bucket = rateLimitMap.get(key);
      if (!bucket) {
        bucket = { tokens: maxRequests, lastRefill: now };
        rateLimitMap.set(key, bucket);
      }

      // Refill tokens based on elapsed time
      const elapsed = now - bucket.lastRefill;
      if (elapsed > windowMs) {
        bucket.tokens = maxRequests;
        bucket.lastRefill = now;
      }

      if (bucket.tokens > 0) {
        bucket.tokens--;
        res.setHeader('X-RateLimit-Limit', maxRequests.toString());
        res.setHeader('X-RateLimit-Remaining', bucket.tokens.toString());
        return next();
      }

      res.status(429).json({
        error: 'Too Many Requests',
        message: 'Rate limit exceeded. Please wait before making more requests.',
        retryAfterSeconds: Math.ceil((windowMs - elapsed) / 1000),
      });
    };
  }

  /**
   * Enterprise Security Headers Middleware (Helmet Equivalent)
   */
  public static securityHeaders(req: Request, res: Response, next: NextFunction) {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  }

  /**
   * Anti-XSS & SQL Injection Input Sanitization
   */
  public static sanitizeInput(req: Request, res: Response, next: NextFunction) {
    const sanitize = (val: any): any => {
      if (typeof val === 'string') {
        // Strip script tags, suspicious HTML tags, and SQL injection tokens
        return val
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/javascript:/gi, '')
          .replace(/--/g, '&#45;&#45;')
          .replace(/;/g, '&#59;');
      }
      if (typeof val === 'object' && val !== null) {
        for (const k of Object.keys(val)) {
          val[k] = sanitize(val[k]);
        }
      }
      return val;
    };

    if (req.body) req.body = sanitize(req.body);
    if (req.query) req.query = sanitize(req.query);
    next();
  }

  /**
   * JWT Authentication Middleware
   */
  public static async authenticateJWT(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Missing or malformed Bearer token' });
    }

    const token = authHeader.split(' ')[1];

    // Check token blacklist
    const isBlacklisted = await authRepository.isTokenBlacklisted(token);
    if (isBlacklisted) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Token has been revoked or logged out' });
    }

    const payload = JWTManager.verify<JWTAccessTokenPayload>(token);
    if (!payload || payload.type !== 'ACCESS') {
      return res.status(401).json({ error: 'Unauthorized', message: 'Invalid or expired access token' });
    }

    // Verify Session is active
    const session = await authRepository.findSessionById(payload.sessionId);
    if (!session || session.isRevoked) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Session has expired or been terminated' });
    }

    req.user = payload;
    req.sessionId = payload.sessionId;
    req.ipAddress = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1') as string;

    next();
  }

  /**
   * Role-Based Access Control (RBAC) Guard
   */
  public static requireRoles(...allowedRoles: UserRole[]) {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      if (!allowedRoles.includes(req.user.role) && req.user.role !== 'SUPER_ADMIN') {
        return res.status(403).json({
          error: 'Forbidden',
          message: `Access denied. Requires one of roles: [${allowedRoles.join(', ')}]`,
        });
      }

      next();
    };
  }

  /**
   * Granular Permission Guard
   */
  public static requirePermissions(...requiredPermissions: Permission[]) {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      if (req.user.role === 'SUPER_ADMIN') return next();

      const userPerms = req.user.permissions || [];
      const hasAll = requiredPermissions.every((p) => userPerms.includes(p));

      if (!hasAll) {
        return res.status(403).json({
          error: 'Forbidden',
          message: `Insufficient privileges. Required permissions: [${requiredPermissions.join(', ')}]`,
        });
      }

      next();
    };
  }
}

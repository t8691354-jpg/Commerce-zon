import crypto from 'crypto';
import { JWTAccessTokenPayload, JWTRefreshTokenPayload, UserRole, Permission } from '../../domain/iam/IAMTypes';
import { appConfig } from '../config/appConfig';

export class JWTManager {
  private static get secretKey(): string {
    return process.env.JWT_SECRET || 'commercezon-enterprise-super-secret-jwt-key-2026-sha256';
  }

  private static base64UrlEncode(str: string): string {
    return Buffer.from(str)
      .toString('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }

  private static base64UrlDecode(str: string): string {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    return Buffer.from(base64, 'base64').toString('utf8');
  }

  /**
   * Signs a JWT payload using HMAC-SHA256
   */
  public static sign(payload: Record<string, any>, expiresInSeconds: number): string {
    const header = { alg: 'HS256', typ: 'JWT' };
    const now = Math.floor(Date.now() / 1000);
    const completePayload = {
      ...payload,
      iat: now,
      exp: now + expiresInSeconds,
    };

    const encodedHeader = this.base64UrlEncode(JSON.stringify(header));
    const encodedPayload = this.base64UrlEncode(JSON.stringify(completePayload));
    const dataToSign = `${encodedHeader}.${encodedPayload}`;

    const signature = crypto
      .createHmac('sha256', this.secretKey)
      .update(dataToSign)
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    return `${dataToSign}.${signature}`;
  }

  /**
   * Verifies and decodes a JWT token string
   */
  public static verify<T = any>(token: string): T | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const [encodedHeader, encodedPayload, signature] = parts;
      const dataToSign = `${encodedHeader}.${encodedPayload}`;

      const expectedSignature = crypto
        .createHmac('sha256', this.secretKey)
        .update(dataToSign)
        .digest('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');

      const sigBuf = Buffer.from(signature);
      const expectedBuf = Buffer.from(expectedSignature);

      if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
        return null;
      }

      const payload = JSON.parse(this.base64UrlDecode(encodedPayload)) as any;
      const now = Math.floor(Date.now() / 1000);

      if (payload.exp && payload.exp < now) {
        return null; // Expired
      }

      return payload as T;
    } catch {
      return null;
    }
  }

  /**
   * Creates an Enterprise Access Token (15 Minutes Expiration)
   */
  public static createAccessToken(
    userId: string,
    username: string,
    email: string,
    role: UserRole,
    permissions: Permission[],
    sessionId: string
  ): string {
    const payload: Omit<JWTAccessTokenPayload, 'iat' | 'exp'> = {
      sub: userId,
      username,
      email,
      role,
      permissions,
      sessionId,
      type: 'ACCESS',
    };
    // 15 Minutes = 900 Seconds
    return this.sign(payload, 900);
  }

  /**
   * Creates an Enterprise Refresh Token (7 Days Expiration)
   */
  public static createRefreshToken(userId: string, sessionId: string, tokenFamily: string): string {
    const payload: Omit<JWTRefreshTokenPayload, 'iat' | 'exp'> = {
      sub: userId,
      sessionId,
      tokenFamily,
      type: 'REFRESH',
    };
    // 7 Days = 604,800 Seconds
    return this.sign(payload, 604800);
  }
}

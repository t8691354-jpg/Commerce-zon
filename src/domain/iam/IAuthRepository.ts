import { UserIdentity, UserSession, SecurityAuditEvent, SecurityAlert, EntityId } from './IAMTypes';

export interface IAuthRepository {
  findUserById(id: EntityId): Promise<UserIdentity | null>;
  findUserByEmail(email: string): Promise<UserIdentity | null>;
  findUserByUsername(username: string): Promise<UserIdentity | null>;
  findUserByPhone(phone: string): Promise<UserIdentity | null>;
  createUser(user: UserIdentity): Promise<UserIdentity>;
  updateUser(user: UserIdentity): Promise<UserIdentity>;
  
  // Sessions
  createSession(session: UserSession): Promise<UserSession>;
  findSessionById(sessionId: string): Promise<UserSession | null>;
  findActiveSessionsByUserId(userId: string): Promise<UserSession[]>;
  updateSession(session: UserSession): Promise<UserSession>;
  revokeSession(sessionId: string): Promise<boolean>;
  revokeAllSessionsByUserId(userId: string, exceptSessionId?: string): Promise<number>;

  // Token Revocation / Blacklist
  addTokenToBlacklist(jtiOrSignature: string, expiresAt?: number): Promise<void>;
  isTokenBlacklisted(jtiOrSignature: string): Promise<boolean>;

  // Audit Logs & Security Alerts
  recordAuditEvent(event: SecurityAuditEvent): Promise<void>;
  getAuditEvents(limit?: number): Promise<SecurityAuditEvent[]>;
  recordSecurityAlert(alert: SecurityAlert): Promise<void>;
  getSecurityAlerts(): Promise<SecurityAlert[]>;
  getAllUsers(): Promise<UserIdentity[]>;
}

import { UserIdentity, UserSession, SecurityAuditEvent, SecurityAlert, EntityId, Permission } from '../../domain/iam/IAMTypes';
import { IAuthRepository } from '../../domain/iam/IAuthRepository';
import { PasswordHasher } from '../security/PasswordHasher';

export class AuthRepository implements IAuthRepository {
  private users: Map<string, UserIdentity> = new Map();
  private sessions: Map<string, UserSession> = new Map();
  private tokenBlacklist: Set<string> = new Set();
  private auditEvents: SecurityAuditEvent[] = [];
  private securityAlerts: SecurityAlert[] = [];

  constructor() {
    this.seedDefaultUsers();
  }

  private seedDefaultUsers() {
    const defaultAccounts = [
      {
        id: 'usr-superadmin-01',
        username: 'superadmin',
        email: 'superadmin@commercezon.com',
        fullName: 'Executive Super Administrator',
        role: 'SUPER_ADMIN' as const,
        pass: 'SuperAdmin@2026!',
        customPermissions: Object.values(Permission),
      },
      {
        id: 'usr-admin-01',
        username: 'admin',
        email: 'admin@commercezon.com',
        fullName: 'Operations Administrator',
        role: 'ADMIN' as const,
        pass: 'AdminPass@2026!',
        customPermissions: [
          Permission.VIEW_PRODUCTS,
          Permission.EDIT_PRODUCT,
          Permission.DELETE_PRODUCT,
          Permission.MODERATE_PRODUCTS,
          Permission.VIEW_ORDERS,
          Permission.MANAGE_ORDERS,
          Permission.REFUND_ORDERS,
          Permission.VIEW_WAREHOUSES,
          Permission.MANAGE_STOCK,
          Permission.VIEW_WALLET,
          Permission.ACCESS_AI_TOOLS,
          Permission.VIEW_USERS,
          Permission.SUSPEND_USERS,
          Permission.VIEW_AUDIT_LOGS,
          Permission.VIEW_SECURITY_ALERTS,
        ],
      },
      {
        id: 'usr-seller-01',
        username: 'apexseller',
        email: 'seller@apex.com',
        fullName: 'Apex Hardware Store Merchant',
        role: 'SELLER' as const,
        pass: 'SellerPass@2026!',
        customPermissions: [
          Permission.VIEW_PRODUCTS,
          Permission.CREATE_PRODUCT,
          Permission.EDIT_PRODUCT,
          Permission.VIEW_ORDERS,
          Permission.VIEW_WAREHOUSES,
          Permission.VIEW_WALLET,
          Permission.ACCESS_AI_TOOLS,
        ],
      },
      {
        id: 'usr-buyer-01',
        username: 'alexbuyer',
        email: 'buyer@enterprise.com',
        fullName: 'Alex Buyer',
        role: 'CUSTOMER' as const,
        pass: 'Customer@2026!',
        customPermissions: [
          Permission.VIEW_PRODUCTS,
          Permission.VIEW_ORDERS,
          Permission.VIEW_WALLET,
          Permission.TOPUP_WALLET,
          Permission.ACCESS_AI_TOOLS,
        ],
      },
      {
        id: 'usr-warehouse-01',
        username: 'whmanager',
        email: 'warehouse@fba.com',
        fullName: 'Dallas FBA Logistics Manager',
        role: 'WAREHOUSE_MANAGER' as const,
        pass: 'Warehouse@2026!',
        customPermissions: [
          Permission.VIEW_PRODUCTS,
          Permission.VIEW_ORDERS,
          Permission.DISPATCH_DELIVERY,
          Permission.VIEW_WAREHOUSES,
          Permission.MANAGE_STOCK,
          Permission.TRANSFER_INVENTORY,
        ],
      },
      {
        id: 'usr-support-01',
        username: 'supportrep',
        email: 'support@commercezon.com',
        fullName: 'Tier-2 Customer Support Specialist',
        role: 'CUSTOMER_SUPPORT' as const,
        pass: 'Support@2026!',
        customPermissions: [
          Permission.VIEW_PRODUCTS,
          Permission.VIEW_ORDERS,
          Permission.REFUND_ORDERS,
          Permission.VIEW_USERS,
        ],
      },
      {
        id: 'usr-finance-01',
        username: 'financelead',
        email: 'finance@commercezon.com',
        fullName: 'Global Finance Director',
        role: 'FINANCE' as const,
        pass: 'Finance@2026!',
        customPermissions: [
          Permission.VIEW_ORDERS,
          Permission.REFUND_ORDERS,
          Permission.VIEW_WALLET,
          Permission.PAYOUT_MERCHANT,
          Permission.AUDIT_FINANCE,
          Permission.VIEW_AUDIT_LOGS,
        ],
      },
    ];

    for (const acc of defaultAccounts) {
      const salt = PasswordHasher.generateSalt();
      const passwordHash = PasswordHasher.hashPassword(acc.pass, salt);

      const user: UserIdentity = {
        id: acc.id,
        username: acc.username,
        email: acc.email,
        fullName: acc.fullName,
        role: acc.role,
        customPermissions: acc.customPermissions,
        status: 'ACTIVE',
        isEmailVerified: true,
        isPhoneVerified: true,
        passwordHash,
        passwordSalt: salt,
        passwordHistory: [passwordHash],
        mfaConfig: {
          isEnabled: acc.role === 'SUPER_ADMIN' || acc.role === 'ADMIN',
          mfaType: 'TOTP_AUTHENTICATOR',
          secretKey: 'JBSWY3DPEHPK3PXP', // Base32 test secret
          backupCodes: ['1234-5678', '8765-4321', '9988-7766'],
        },
        failedLoginAttempts: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      this.users.set(user.id, user);
    }
  }

  async findUserById(id: EntityId): Promise<UserIdentity | null> {
    const user = this.users.get(id);
    return user ? { ...user } : null;
  }

  async findUserByEmail(email: string): Promise<UserIdentity | null> {
    const lower = email.toLowerCase().trim();
    for (const u of this.users.values()) {
      if (u.email.toLowerCase() === lower) return { ...u };
    }
    return null;
  }

  async findUserByUsername(username: string): Promise<UserIdentity | null> {
    const lower = username.toLowerCase().trim();
    for (const u of this.users.values()) {
      if (u.username.toLowerCase() === lower) return { ...u };
    }
    return null;
  }

  async findUserByPhone(phone: string): Promise<UserIdentity | null> {
    for (const u of this.users.values()) {
      if (u.phone && u.phone === phone) return { ...u };
    }
    return null;
  }

  async createUser(user: UserIdentity): Promise<UserIdentity> {
    this.users.set(user.id, { ...user });
    return { ...user };
  }

  async updateUser(user: UserIdentity): Promise<UserIdentity> {
    this.users.set(user.id, { ...user, updatedAt: new Date().toISOString() });
    return { ...user };
  }

  async createSession(session: UserSession): Promise<UserSession> {
    this.sessions.set(session.sessionId, { ...session });
    return { ...session };
  }

  async findSessionById(sessionId: string): Promise<UserSession | null> {
    const sess = this.sessions.get(sessionId);
    return sess ? { ...sess } : null;
  }

  async findActiveSessionsByUserId(userId: string): Promise<UserSession[]> {
    const active: UserSession[] = [];
    const now = new Date().toISOString();
    for (const s of this.sessions.values()) {
      if (s.userId === userId && !s.isRevoked && s.expiresAt > now) {
        active.push({ ...s });
      }
    }
    return active;
  }

  async updateSession(session: UserSession): Promise<UserSession> {
    this.sessions.set(session.sessionId, { ...session });
    return { ...session };
  }

  async revokeSession(sessionId: string): Promise<boolean> {
    const sess = this.sessions.get(sessionId);
    if (sess) {
      sess.isRevoked = true;
      this.sessions.set(sessionId, sess);
      return true;
    }
    return false;
  }

  async revokeAllSessionsByUserId(userId: string, exceptSessionId?: string): Promise<number> {
    let count = 0;
    for (const s of this.sessions.values()) {
      if (s.userId === userId && s.sessionId !== exceptSessionId && !s.isRevoked) {
        s.isRevoked = true;
        this.sessions.set(s.sessionId, s);
        count++;
      }
    }
    return count;
  }

  async addTokenToBlacklist(jtiOrSignature: string, expiresAt?: number): Promise<void> {
    this.tokenBlacklist.add(jtiOrSignature);
  }

  async isTokenBlacklisted(jtiOrSignature: string): Promise<boolean> {
    return this.tokenBlacklist.has(jtiOrSignature);
  }

  async recordAuditEvent(event: SecurityAuditEvent): Promise<void> {
    this.auditEvents.unshift({ ...event });
  }

  async getAuditEvents(limit = 100): Promise<SecurityAuditEvent[]> {
    return this.auditEvents.slice(0, limit);
  }

  async recordSecurityAlert(alert: SecurityAlert): Promise<void> {
    this.securityAlerts.unshift({ ...alert });
  }

  async getSecurityAlerts(): Promise<SecurityAlert[]> {
    return [...this.securityAlerts];
  }

  async getAllUsers(): Promise<UserIdentity[]> {
    return Array.from(this.users.values()).map((u) => ({ ...u }));
  }
}

export const authRepository = new AuthRepository();

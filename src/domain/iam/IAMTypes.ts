/**
 * Amazon-Level Enterprise Identity & Access Management (IAM) Domain Models
 * Clean Architecture & Domain-Driven Design (DDD) Types
 */

export type EntityId = string;

// Enterprise User Roles (Extensible Multi-Tenant Matrix)
export type UserRole =
  | 'CUSTOMER'
  | 'SELLER'
  | 'WAREHOUSE_MANAGER'
  | 'DELIVERY_STAFF'
  | 'CUSTOMER_SUPPORT'
  | 'FINANCE'
  | 'MODERATOR'
  | 'ADMIN'
  | 'SUPER_ADMIN';

// Granular Permissions Matrix
export enum Permission {
  // Catalog & Products
  VIEW_PRODUCTS = 'catalog:view',
  CREATE_PRODUCT = 'catalog:create',
  EDIT_PRODUCT = 'catalog:edit',
  DELETE_PRODUCT = 'catalog:delete',
  MODERATE_PRODUCTS = 'catalog:moderate',

  // Orders & Fulfillment
  VIEW_ORDERS = 'orders:view',
  MANAGE_ORDERS = 'orders:manage',
  REFUND_ORDERS = 'orders:refund',
  DISPATCH_DELIVERY = 'orders:dispatch',

  // Inventory & Warehouses
  VIEW_WAREHOUSES = 'warehouses:view',
  MANAGE_STOCK = 'warehouses:stock_manage',
  TRANSFER_INVENTORY = 'warehouses:transfer',

  // Wallet & Payments
  VIEW_WALLET = 'wallet:view',
  TOPUP_WALLET = 'wallet:topup',
  PAYOUT_MERCHANT = 'wallet:payout',
  AUDIT_FINANCE = 'wallet:audit',

  // AI Services
  ACCESS_AI_TOOLS = 'ai:access',
  MANAGE_AI_MODELS = 'ai:manage',

  // IAM & User Management
  VIEW_USERS = 'iam:users_view',
  MANAGE_USER_ROLES = 'iam:roles_manage',
  SUSPEND_USERS = 'iam:users_suspend',

  // Platform & Security
  VIEW_AUDIT_LOGS = 'security:audit_view',
  MANAGE_SETTINGS = 'platform:settings_manage',
  VIEW_SECURITY_ALERTS = 'security:alerts_view',
}

// User Account Status
export type AccountStatus =
  | 'PENDING_VERIFICATION'
  | 'ACTIVE'
  | 'MFA_REQUIRED'
  | 'SUSPENDED'
  | 'LOCKED_BRUTE_FORCE'
  | 'DEACTIVATED';

// Session Information & Device Fingerprinting
export interface UserSession {
  sessionId: string;
  userId: string;
  ipAddress: string;
  userAgent: string;
  deviceType: 'Desktop' | 'Mobile' | 'Tablet' | 'Unknown';
  locationCity?: string;
  locationCountry?: string;
  isCurrentSession?: boolean;
  createdAt: string;
  lastActiveAt: string;
  expiresAt: string;
  isRevoked: boolean;
}

// Multi-Factor Authentication (MFA) Credentials
export interface MFAConfig {
  isEnabled: boolean;
  mfaType: 'TOTP_AUTHENTICATOR' | 'EMAIL_OTP' | 'SMS_OTP';
  secretKey?: string; // Base32 TOTP secret
  qrCodeUri?: string;
  phoneNumber?: string;
  backupCodes: string[];
  lastVerifiedAt?: string;
}

// User Security Profile & Identity State
export interface UserIdentity {
  id: EntityId;
  username: string;
  email: string;
  phone?: string;
  fullName: string;
  role: UserRole;
  customPermissions: Permission[];
  status: AccountStatus;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  passwordHash: string;
  passwordSalt: string;
  passwordHistory: string[]; // Hash of last 3 passwords
  mfaConfig: MFAConfig;
  failedLoginAttempts: number;
  lockoutUntil?: string;
  lastLoginAt?: string;
  lastLoginIp?: string;
  createdAt: string;
  updatedAt: string;
}

// JWT Token Payload
export interface JWTAccessTokenPayload {
  sub: string; // User ID
  username: string;
  email: string;
  role: UserRole;
  permissions: Permission[];
  sessionId: string;
  type: 'ACCESS';
  iat: number;
  exp: number;
}

export interface JWTRefreshTokenPayload {
  sub: string;
  sessionId: string;
  tokenFamily: string; // Used for Refresh Token Rotation
  type: 'REFRESH';
  iat: number;
  exp: number;
}

// Security Audit Event
export interface SecurityAuditEvent {
  id: string;
  eventType:
    | 'LOGIN_SUCCESS'
    | 'LOGIN_FAILED'
    | 'LOGOUT'
    | 'PASSWORD_RESET_REQUESTED'
    | 'PASSWORD_CHANGED'
    | 'MFA_ENABLED'
    | 'MFA_VERIFIED'
    | 'ROLE_UPDATED'
    | 'ACCOUNT_LOCKED'
    | 'TOKEN_REVOKED'
    | 'UNAUTHORIZED_ACCESS_ATTEMPT'
    | 'RATE_LIMIT_EXCEEDED';
  actorId: string;
  actorEmail?: string;
  ipAddress: string;
  userAgent: string;
  details: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  timestamp: string;
}

// Security Anomaly Alert
export interface SecurityAlert {
  id: string;
  title: string;
  userId: string;
  riskScore: number; // 0 - 100
  reason: 'SUSPICIOUS_IP' | 'BRUTE_FORCE' | 'IMPOSSIBLE_TRAVEL' | 'REVOKED_TOKEN_REUSE';
  details: string;
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED';
  timestamp: string;
}

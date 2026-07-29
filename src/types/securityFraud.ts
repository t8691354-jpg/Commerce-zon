export type UserRoleType =
  | 'Super Admin'
  | 'Admin'
  | 'Finance Admin'
  | 'Operations Admin'
  | 'Security Admin'
  | 'Warehouse Admin'
  | 'Seller'
  | 'Buyer'
  | 'Affiliate'
  | 'Supplier'
  | 'Delivery Partner'
  | 'Customer Support';

export type AccountType = 'Buyer' | 'Seller' | 'Affiliate' | 'Supplier' | 'Delivery Partner' | 'Warehouse Staff' | 'Admin';

export type FraudType =
  | 'Fake Account'
  | 'Fake Seller'
  | 'Fake Buyer'
  | 'Fake Review'
  | 'Fake Order'
  | 'Fake Coupon'
  | 'Coupon Abuse'
  | 'Return Fraud'
  | 'Chargeback Abuse'
  | 'Multi-Account Abuse'
  | 'Bot Activity'
  | 'Card Testing'
  | 'Account Takeover';

export type SeverityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface SecurityKpi {
  id: string;
  label: string;
  value: string | number;
  changePct: number;
  isPositive: boolean;
  status: 'Healthy' | 'Warning' | 'Critical';
  description: string;
}

export interface UserAccountSecurity {
  id: string;
  name: string;
  email: string;
  role: UserRoleType;
  accountType: AccountType;
  mfaStatus: 'TOTP App' | 'SMS OTP' | 'Email OTP' | 'Disabled';
  status: 'Active' | 'Locked' | 'Suspended' | 'Pending Verification';
  riskScore: number; // 0-100
  lastLoginIp: string;
  lastLoginCountry: string;
  lastLoginTime: string;
  activeSessionsCount: number;
  failedAttempts: number;
}

export interface ActiveSession {
  sessionId: string;
  userId: string;
  userName: string;
  deviceType: 'Desktop Mac' | 'iPhone iOS' | 'Android App' | 'Windows PC' | 'Linux Workstation';
  browser: string;
  ipAddress: string;
  country: string;
  loginTime: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface FraudDetectionCase {
  caseId: string;
  fraudType: FraudType;
  severity: SeverityLevel;
  entityName: string;
  entityId: string;
  riskScore: number; // 0-100
  confidenceScorePct: number;
  detectionReason: string;
  recommendedAction: 'Block Account' | 'Challenge MFA' | 'Cancel Order' | 'Manual Review' | 'Allow';
  status: 'Flagged' | 'Under Investigation' | 'Blocked' | 'Dismissed';
  timestamp: string;
}

export interface ApiSecurityMetric {
  endpoint: string;
  requestsPerMin: number;
  rateLimitHits: number;
  invalidTokenErrors: number;
  avgLatencyMs: number;
  signingStatus: 'Valid HMAC' | 'Failed Sig' | 'N/A';
  health: 'Optimal' | 'Degraded' | 'Throttled';
}

export interface IncidentRecord {
  id: string;
  title: string;
  severity: SeverityLevel;
  category: 'Account Takeover' | 'DDoS Attempt' | 'API Scraping Bot' | 'Payment Fraud Cluster' | 'Data Breach Attempt';
  status: 'Open' | 'Investigating' | 'Mitigated' | 'Resolved';
  assignedTo: string;
  createdAt: string;
  rootCause: string;
  timelineEventsCount: number;
}

export interface AuditLogSecurity {
  id: string;
  user: string;
  role: string;
  action: string;
  ipAddress: string;
  location: string;
  authMethod: string;
  timestamp: string;
  status: 'SUCCESS' | 'BLOCKED' | 'FLAGGED';
}

export interface ComplianceFrameworkStatus {
  framework: 'GDPR' | 'CCPA' | 'PCI-DSS v4.0' | 'SOC 2 Type II' | 'ISO 27001';
  complianceScorePct: number;
  status: 'Compliant' | 'Audit in Progress' | 'Action Required';
  lastAuditDate: string;
  openFindings: number;
  keyRequirement: string;
}

export interface DisasterRecoveryStatus {
  service: string;
  regionPrimary: string;
  regionSecondary: string;
  replicationLagMs: number;
  pitrWindowHours: number;
  status: 'Synchronized' | 'Replicating' | 'Failover Ready';
  lastBackupTime: string;
}

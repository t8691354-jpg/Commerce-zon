import { AuditLog } from '../../types/domain';
import { IAuditLogRepository } from '../../domain/admin/IAuditLogRepository';
import { MOCK_AUDIT_LOGS } from '../../data/mockData';

export class AuditLogRepository implements IAuditLogRepository {
  private logs: AuditLog[] = [...MOCK_AUDIT_LOGS];

  async findAll(): Promise<AuditLog[]> {
    return [...this.logs];
  }

  async create(logData: Omit<AuditLog, 'id' | 'timestamp'>): Promise<AuditLog> {
    const newLog: AuditLog = {
      ...logData,
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
    };
    this.logs.unshift(newLog);
    if (this.logs.length > 100) this.logs.pop();
    return { ...newLog };
  }

  async findByDomain(domain: AuditLog['domain']): Promise<AuditLog[]> {
    return this.logs.filter((l) => l.domain === domain);
  }
}

export const auditLogRepository = new AuditLogRepository();

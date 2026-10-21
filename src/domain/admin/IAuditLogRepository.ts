import { AuditLog } from '../../types/domain';

export interface IAuditLogRepository {
  findAll(): Promise<AuditLog[]>;
  create(log: Omit<AuditLog, 'id' | 'timestamp'>): Promise<AuditLog>;
  findByDomain(domain: AuditLog['domain']): Promise<AuditLog[]>;
}

import { AuditLog } from '../../types/domain';
import { IAuditLogRepository } from '../../domain/admin/IAuditLogRepository';
import { auditLogRepository } from '../../infrastructure/repositories/AuditLogRepository';
import { logger } from '../../infrastructure/logging/Logger';

export class AuditService {
  constructor(private repo: IAuditLogRepository = auditLogRepository) {}

  async getAllLogs(): Promise<AuditLog[]> {
    return this.repo.findAll();
  }

  async recordEvent(
    actorType: AuditLog['actorType'],
    actorId: string,
    action: string,
    domain: AuditLog['domain'],
    details: string
  ): Promise<AuditLog> {
    logger.audit(`[${domain}] ${actorType}:${actorId} -> ${action}`, 'AuditService', { details });
    return this.repo.create({
      actorType,
      actorId,
      action,
      domain,
      details,
    });
  }
}

export const auditService = new AuditService();

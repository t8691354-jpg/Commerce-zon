import { authRepository, AuthRepository } from '../../infrastructure/repositories/AuthRepository';
import { UserIdentity, UserRole, Permission, SecurityAuditEvent, SecurityAlert } from '../../domain/iam/IAMTypes';

export class IAMService {
  private repo: AuthRepository = authRepository;

  async getAllUsers(): Promise<UserIdentity[]> {
    return this.repo.getAllUsers();
  }

  async getUserById(id: string): Promise<UserIdentity | null> {
    return this.repo.findUserById(id);
  }

  async updateUserRole(
    actorUserId: string,
    targetUserId: string,
    newRole: UserRole,
    ipAddress = '127.0.0.1'
  ): Promise<UserIdentity> {
    const targetUser = await this.repo.findUserById(targetUserId);
    if (!targetUser) throw new Error('Target user not found');

    const oldRole = targetUser.role;
    targetUser.role = newRole;
    await this.repo.updateUser(targetUser);

    await this.repo.recordAuditEvent({
      id: `audit-${Date.now()}`,
      eventType: 'ROLE_UPDATED',
      actorId: actorUserId,
      actorEmail: targetUser.email,
      ipAddress,
      userAgent: 'Admin Management Suite',
      details: `Role updated from ${oldRole} to ${newRole} for user ${targetUser.username}`,
      severity: 'WARNING',
      timestamp: new Date().toISOString(),
    });

    return targetUser;
  }

  async updateUserPermissions(
    actorUserId: string,
    targetUserId: string,
    permissions: Permission[],
    ipAddress = '127.0.0.1'
  ): Promise<UserIdentity> {
    const targetUser = await this.repo.findUserById(targetUserId);
    if (!targetUser) throw new Error('Target user not found');

    targetUser.customPermissions = permissions;
    await this.repo.updateUser(targetUser);

    await this.repo.recordAuditEvent({
      id: `audit-${Date.now()}`,
      eventType: 'ROLE_UPDATED',
      actorId: actorUserId,
      actorEmail: targetUser.email,
      ipAddress,
      userAgent: 'Admin Management Suite',
      details: `Permissions updated (${permissions.length} active permissions) for user ${targetUser.username}`,
      severity: 'INFO',
      timestamp: new Date().toISOString(),
    });

    return targetUser;
  }

  async setUserStatus(
    actorUserId: string,
    targetUserId: string,
    status: UserIdentity['status'],
    ipAddress = '127.0.0.1'
  ): Promise<UserIdentity> {
    const targetUser = await this.repo.findUserById(targetUserId);
    if (!targetUser) throw new Error('Target user not found');

    targetUser.status = status;
    await this.repo.updateUser(targetUser);

    if (status === 'SUSPENDED' || status === 'DEACTIVATED') {
      await this.repo.revokeAllSessionsByUserId(targetUserId);
    }

    await this.repo.recordAuditEvent({
      id: `audit-${Date.now()}`,
      eventType: 'ROLE_UPDATED',
      actorId: actorUserId,
      actorEmail: targetUser.email,
      ipAddress,
      userAgent: 'Admin Management Suite',
      details: `User account status set to ${status} for ${targetUser.email}`,
      severity: 'CRITICAL',
      timestamp: new Date().toISOString(),
    });

    return targetUser;
  }

  async getAuditLogs(limit = 100): Promise<SecurityAuditEvent[]> {
    return this.repo.getAuditEvents(limit);
  }

  async getSecurityAlerts(): Promise<SecurityAlert[]> {
    return this.repo.getSecurityAlerts();
  }
}

export const iamService = new IAMService();

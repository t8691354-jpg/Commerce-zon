export interface UserEntity {
  id: string;
  email: string;
  fullName: string;
  role: 'BUYER' | 'SELLER' | 'WAREHOUSE_STAFF' | 'ADMIN' | 'SUPER_ADMIN';
  status: 'ACTIVE' | 'PENDING_VERIFICATION' | 'SUSPENDED' | 'DEACTIVATED';
  createdAt: string;
}

export interface IUserRepository {
  findAll(): Promise<UserEntity[]>;
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  create(user: Omit<UserEntity, 'id' | 'createdAt'>): Promise<UserEntity>;
  updateStatus(id: string, status: UserEntity['status']): Promise<UserEntity | null>;
}

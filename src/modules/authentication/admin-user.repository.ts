import { Knex } from 'knex';
import { BaseRepository } from '@/databases/repository/BaseRepository';
import { IAdminUser } from './entities/IAdminUser';

export class AdminUserRepository extends BaseRepository<IAdminUser> {
  constructor(transaction: Knex.Transaction | null) {
    super('admin_users', transaction);
  }

  public findByUsername(username: string) {
    return this.getQuery()
      .first<IAdminUser>('*')
      .where('username', '=', username);
  }
}

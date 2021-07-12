import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserPermissionsUtil } from '../../../lib/UserPermissions';

export interface IAuthorizedUser {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  discordId: string;
  permissions: number;
};

export interface IUser extends IAuthorizedUser {
  username: string;
  discriminator: string;
  image?: string;
};

@Entity()
export class AuthorizedUser implements IAuthorizedUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  discordId: string;

  @Column('int', { default: 1 })
  permissions: number;

  hasPermission(permission: number): boolean {
    return UserPermissionsUtil.hasPermission(this.permissions, permission);
  }

  canManageOwnGuildBlacklists(): boolean {
    return UserPermissionsUtil.canManageOwnGuildBlacklists(this.permissions);
  }

  canManageGlobalBlacklists(): boolean {
    return UserPermissionsUtil.canManageGlobalBlacklists(this.permissions);
  }

  canManageAuthorizedUsers(): boolean {
    return UserPermissionsUtil.canManageAuthorizedUsers(this.permissions);
  }

  toJSON(): IAuthorizedUser {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      discordId: this.discordId,
      permissions: this.permissions
    };
  }
}

import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import {
  IModelWithSnowflakeID,
  ModelWithSnowflakeID,
} from '../../common/ModelWithSnowflakeID';

import { UserPermissionsUtil } from '../../../lib/UserPermissions';
import { GroupMember, IGroupMember } from '../groups/GroupMember';

import omit from '../../../lib/omit';

export interface IAuthorizedUser extends IModelWithSnowflakeID {
  createdAt: Date;
  updatedAt: Date;
  discordId: string;
  permissions: number;
  name: string;
  discriminator: string;
  image?: string;
  hideThumbnails: boolean;
  memberships?: Partial<IGroupMember>[];
}

@Entity()
export class AuthorizedUser
  extends ModelWithSnowflakeID
  implements IAuthorizedUser
{
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('varchar')
  discordId: string;

  @Column('int', { default: 1 })
  permissions: number;

  @Column('varchar')
  name: string;

  @Column('varchar')
  discriminator: string;

  @Column({ type: 'varchar', nullable: true })
  image?: string;

  @Column('bool', { default: false })
  hideThumbnails: boolean;

  @OneToMany(() => GroupMember, (member) => member.user)
  memberships: Partial<GroupMember>[];

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

  canManageGuildMonitoredKeywords(): boolean {
    return UserPermissionsUtil.canManageGuildMonitoredKeywords(
      this.permissions,
    );
  }

  canCreateGroups(): boolean {
    return UserPermissionsUtil.canCreateGroups(this.permissions);
  }

  toJSON(): IAuthorizedUser {
    return {
      id: this.id.toString(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      discordId: this.discordId,
      permissions: this.permissions,
      name: this.name,
      discriminator: this.discriminator,
      image: this.image,
      hideThumbnails: this.hideThumbnails,
      memberships: this.memberships?.map((m) => omit(m.toJSON(), 'user')),
    };
  }
}

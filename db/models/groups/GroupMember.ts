import { Column, Entity, ManyToOne } from 'typeorm';
import {
  IModelWithSnowflakeID,
  ModelWithSnowflakeID,
} from '../../common/ModelWithSnowflakeID';

import { AuthorizedUser, IAuthorizedUser } from '../auth/AuthorizedUser';
import { Group, IGroup } from './Group';
import { GroupMemberPermissionsUtil } from '../../../lib/GroupMemberPermissions';

import omit from '../../../lib/omit';

export interface IGroupMember extends IModelWithSnowflakeID {
  user: Partial<IAuthorizedUser>;
  group: Partial<IGroup>;
  permissions: number;
}

@Entity()
export class GroupMember extends ModelWithSnowflakeID implements IGroupMember {
  @ManyToOne(() => AuthorizedUser, (user) => user.memberships, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: Partial<AuthorizedUser>;

  @ManyToOne(() => Group, (group) => group.members, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  group: Partial<Group>;

  @Column('int', { default: 1 })
  permissions: number;

  canViewGroupBlacklists() {
    return GroupMemberPermissionsUtil.canViewGroupBlacklists(this.permissions);
  }

  canManageGroupEntries() {
    return GroupMemberPermissionsUtil.canManageGroupEntries(this.permissions);
  }

  canSeeApiKey() {
    return GroupMemberPermissionsUtil.canSeeApiKey(this.permissions);
  }

  canManageGroupGuilds() {
    return GroupMemberPermissionsUtil.canManageGroupGuilds(this.permissions);
  }

  canManageGroupMembers() {
    return GroupMemberPermissionsUtil.canManageGroupMembers(this.permissions);
  }

  toJSON() {
    return {
      id: this.id.toString(),
      user: this.user && omit(this.user, 'memberships').toJSON(),
      group: this.group && omit(this.group, 'members').toJSON(),
      permissions: this.permissions,
    };
  }
}

import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AuthorizedUser, IAuthorizedUser } from '../auth/AuthorizedUser';
import { Group, IGroup } from './Group';
import { GroupMemberPermissionsUtil } from '../../../lib/GroupMemberPermissions';

import omit from 'lodash.omit';

export interface IGroupMember {
  id: string;
  user: Partial<IAuthorizedUser>;
  group: Partial<IGroup>;
  permissions: number;
};

@Entity()
export class GroupMember implements IGroupMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => AuthorizedUser, user => user.memberships)
  user: Partial<AuthorizedUser>;

  @ManyToOne(() => Group, group => group.members)
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
      id: this.id,
      user: this.user && omit(this.user, 'memberships').toJSON(),
      group: this.group && omit(this.group, 'members').toJSON(),
      permissions: this.permissions,
    };
  }
}

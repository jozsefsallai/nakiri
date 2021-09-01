import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AuthorizedUser, IAuthorizedUser } from '../auth/AuthorizedUser';
import { Group, IGroup } from './Group';

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

  toJSON() {
    return {
      id: this.id,
      user: this.user.toJSON(),
      group: this.group.toJSON(),
      permissions: this.permissions,
    };
  }
}

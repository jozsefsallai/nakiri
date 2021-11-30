import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import {
  IModelWithSnowflakeID,
  ModelWithSnowflakeID,
} from '../../common/ModelWithSnowflakeID';

import { AuthorizedGuild, IAuthorizedGuild } from '../auth/AuthorizedGuild';
import { AuthorizedUser, IAuthorizedUser } from '../auth/AuthorizedUser';
import { GroupMember, IGroupMember } from './GroupMember';

import omit from '../../../lib/omit';

export interface IGroup extends IModelWithSnowflakeID {
  createdAt: Date;
  updatedAt: Date;
  name: string;
  description?: string;
  apiKey: string;
  creator: Partial<IAuthorizedUser>;
  members?: Partial<IGroupMember>[];
  guilds?: Partial<IAuthorizedGuild>[];
  myPermissions?: number;
  isCreator?: boolean;
}

@Entity()
export class Group extends ModelWithSnowflakeID implements IGroup {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('varchar')
  name: string;

  @Column({ type: 'varchar', nullable: true })
  description?: string;

  @Column('varchar')
  apiKey: string;

  @ManyToOne(() => AuthorizedUser, {
    onUpdate: 'CASCADE',
  })
  creator: Partial<AuthorizedUser>;

  @OneToMany(() => GroupMember, (member) => member.group)
  members: Partial<GroupMember>[];

  @ManyToMany(() => AuthorizedGuild, (guild) => guild.groups, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  guilds: Partial<AuthorizedGuild>[];

  toJSON(): IGroup {
    return {
      id: this.id.toString(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      name: this.name,
      description: this.description,
      apiKey: this.apiKey,
      creator: this.creator && omit(this.creator, 'memberships').toJSON(),
      members: this.members?.map((m) => omit(m, 'group').toJSON()),
      guilds: this.guilds?.map((g) => omit(g, 'groups').toJSON()),
    };
  }
}

import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { AuthorizedGuild, IAuthorizedGuild } from '../auth/AuthorizedGuild';
import { AuthorizedUser, IAuthorizedUser } from '../auth/AuthorizedUser';
import { GroupMember, IGroupMember } from './GroupMember';

import omit from 'lodash.omit';

export interface IGroup {
  id: string;
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
};

@Entity()
export class Group implements IGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  apiKey: string;

  @ManyToOne(() => AuthorizedUser)
  creator: Partial<AuthorizedUser>;

  @OneToMany(() => GroupMember, member => member.group)
  members: Partial<GroupMember>[];

  @ManyToMany(() => AuthorizedGuild, guild => guild.groups)
  guilds: Partial<AuthorizedGuild>[];

  toJSON(): IGroup {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      name: this.name,
      description: this.description,
      apiKey: this.apiKey,
      creator: omit(this.creator.toJSON(), 'groups'),
      members: this.members.map(m => omit(m.toJSON(), 'group')),
      guilds: this.guilds.map(g => omit(g.toJSON(), 'groups')),
    };
  }
}

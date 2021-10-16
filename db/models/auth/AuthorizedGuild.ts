import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Group, IGroup } from '../groups/Group';

import omit from '../../../lib/omit';

export interface IAuthorizedGuild {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  key: string;
  guildId: string;
  groups?: Partial<IGroup>[];
}

@Entity()
export class AuthorizedGuild implements IAuthorizedGuild {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  key: string;

  @Column()
  guildId: string;

  @ManyToMany(() => Group, (group) => group.guilds)
  @JoinTable()
  groups: Partial<Group>[];

  toJSON(): IAuthorizedGuild {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      key: this.key,
      guildId: this.guildId,
      groups: this.groups?.map((g) => omit(g, 'guilds').toJSON()),
    };
  }
}

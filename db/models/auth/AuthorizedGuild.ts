import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  UpdateDateColumn,
} from 'typeorm';
import {
  IModelWithSnowflakeID,
  ModelWithSnowflakeID,
} from '../../common/ModelWithSnowflakeID';

import { Group, IGroup } from '../groups/Group';

import omit from '../../../lib/omit';

export interface IAuthorizedGuild extends IModelWithSnowflakeID {
  createdAt: Date;
  updatedAt: Date;
  key: string;
  guildId: string;
  groups?: Partial<IGroup>[];
}

@Entity()
export class AuthorizedGuild
  extends ModelWithSnowflakeID
  implements IAuthorizedGuild
{
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('varchar')
  key: string;

  @Column('varchar')
  guildId: string;

  @ManyToMany(() => Group, (group) => group.guilds, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable()
  groups: Partial<Group>[];

  toJSON(): IAuthorizedGuild {
    return {
      id: this.id.toString(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      key: this.key,
      guildId: this.guildId,
      groups: this.groups?.map((g) => omit(g, 'guilds').toJSON()),
    };
  }
}

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';

import { Group, IGroup } from '../models/groups/Group';
import { Severity } from './Severity';
import {
  IModelWithSnowflakeID,
  ModelWithSnowflakeID,
} from './ModelWithSnowflakeID';

export interface IGuildRestrictableBlacklist extends IModelWithSnowflakeID {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  guildId?: string;
  group?: IGroup;
  severity: Severity;
}

export class GuildRestrictableBlacklist
  extends ModelWithSnowflakeID
  implements IGuildRestrictableBlacklist
{
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column('varchar', { nullable: true, default: null })
  guildId?: string;

  @ManyToOne(() => Group, {
    nullable: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  group?: Group;

  @Column({ type: 'enum', enum: Severity, default: Severity.MEDIUM })
  severity: Severity;

  toJSON(): IGuildRestrictableBlacklist {
    return {
      id: this.id.toString(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
      guildId: this.guildId,
      group: this.group ? this.group.toJSON() : null,
      severity: this.severity,
    };
  }
}

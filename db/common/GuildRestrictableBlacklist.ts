import { Column, CreateDateColumn, DeleteDateColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Group, IGroup } from '../models/groups/Group';

export interface IGuildRestrictableBlacklist {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  guildId?: string;
  group?: IGroup;
};

export class GuildRestrictableBlacklist implements IGuildRestrictableBlacklist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column('varchar', { nullable: true, default: null })
  guildId?: string;

  @ManyToOne(() => Group, { nullable: true })
  group?: Group;

  toJSON(): IGuildRestrictableBlacklist {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
      guildId: this.guildId,
      group: this.group ? this.group.toJSON() : null,
    };
  }
}

import { Column, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export interface IGuildRestrictableBlacklist {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  guildId?: string;
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

  toJSON(): IGuildRestrictableBlacklist {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
      guildId: this.guildId
    };
  }
}

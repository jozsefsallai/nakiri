import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export interface IGuildRestrictableBlacklist {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  guildId?: string;
};

export class GuildRestrictableBlacklist implements IGuildRestrictableBlacklist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('varchar', { nullable: true, default: null })
  guildId?: string;

  toJSON(): IGuildRestrictableBlacklist {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      guildId: this.guildId
    };
  }
}

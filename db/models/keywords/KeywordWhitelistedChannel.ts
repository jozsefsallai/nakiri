import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export interface IKeywordWhitelistedChannel {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  channelId: string;
  guildId: string;
};

@Entity()
export class KeywordWhitelistedChannel implements IKeywordWhitelistedChannel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  channelId: string;

  @Column()
  guildId: string;

  toJSON(): IKeywordWhitelistedChannel {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      channelId: this.channelId,
      guildId: this.guildId
    };
  }
}

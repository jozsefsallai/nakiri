import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { KeywordSearchResult } from './KeywordSearchResult';

export interface IMonitoredKeyword {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  keyword: string;
  guildId: string;
  webhookUrl: string;
};

@Entity()
export class MonitoredKeyword implements IMonitoredKeyword {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  keyword: string;

  @Column()
  guildId: string;

  @Column()
  webhookUrl: string;

  @OneToMany(() => KeywordSearchResult, keywordSearchResult => keywordSearchResult.keyword)
  results: Partial<KeywordSearchResult[]>;

  toJSON(): IMonitoredKeyword {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      keyword: this.keyword,
      guildId: this.guildId,
      webhookUrl: this.webhookUrl
    };
  }
}

import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import {
  IModelWithSnowflakeID,
  ModelWithSnowflakeID,
} from '../../common/ModelWithSnowflakeID';

import { KeywordSearchResult } from './KeywordSearchResult';

export interface IMonitoredKeyword extends IModelWithSnowflakeID {
  createdAt: Date;
  updatedAt: Date;
  keyword: string;
  guildId: string;
  webhookUrl: string;
}

@Entity()
export class MonitoredKeyword
  extends ModelWithSnowflakeID
  implements IMonitoredKeyword
{
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

  @OneToMany(
    () => KeywordSearchResult,
    (keywordSearchResult) => keywordSearchResult.keyword,
  )
  results: Partial<KeywordSearchResult[]>;

  toJSON(): IMonitoredKeyword {
    return {
      id: this.id.toString(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      keyword: this.keyword,
      guildId: this.guildId,
      webhookUrl: this.webhookUrl,
    };
  }
}

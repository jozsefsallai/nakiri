import { Column, CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';
import {
  IModelWithSnowflakeID,
  ModelWithSnowflakeID,
} from '../../common/ModelWithSnowflakeID';

export interface IKeywordWhitelistedChannel extends IModelWithSnowflakeID {
  createdAt: Date;
  updatedAt: Date;
  channelId: string;
  guildId: string;
}

@Entity()
export class KeywordWhitelistedChannel
  extends ModelWithSnowflakeID
  implements IKeywordWhitelistedChannel
{
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('varchar')
  channelId: string;

  @Column('varchar')
  guildId: string;

  toJSON(): IKeywordWhitelistedChannel {
    return {
      id: this.id.toString(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      channelId: this.channelId,
      guildId: this.guildId,
    };
  }
}

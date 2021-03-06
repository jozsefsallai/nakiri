import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import {
  IModelWithSnowflakeID,
  ModelWithSnowflakeID,
} from '../../common/ModelWithSnowflakeID';

import { IMonitoredKeyword, MonitoredKeyword } from './MonitoredKeyword';

export interface IKeywordSearchResult extends IModelWithSnowflakeID {
  createdAt: Date;
  updatedAt: Date;
  keyword?: Partial<IMonitoredKeyword>;
  title: string;
  videoId: string;
  thumbnailUrl?: string | null;
  uploadDate: Date;
  uploader: string;
  uploaderName: string;
}

@Entity()
export class KeywordSearchResult
  extends ModelWithSnowflakeID
  implements IKeywordSearchResult
{
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(
    () => MonitoredKeyword,
    (monitoredKeyword) => monitoredKeyword.results,
    {
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  )
  keyword: Partial<MonitoredKeyword>;

  @Column('varchar')
  title: string;

  @Column('varchar')
  videoId: string;

  @Column({ type: 'varchar', nullable: true, default: null })
  thumbnailUrl?: string | null;

  @Column('datetime')
  uploadDate: Date;

  @Column('varchar')
  uploader: string;

  @Column('varchar')
  uploaderName: string;

  toJSON(): IKeywordSearchResult {
    return {
      id: this.id.toString(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      keyword: this.keyword,
      title: this.title,
      videoId: this.videoId,
      thumbnailUrl: this.thumbnailUrl,
      uploadDate: this.uploadDate,
      uploader: this.uploader,
      uploaderName: this.uploaderName,
    };
  }
}

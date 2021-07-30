import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { IMonitoredKeyword, MonitoredKeyword } from './MonitoredKeyword';

export interface IKeywordSearchResult {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  keyword?: Partial<IMonitoredKeyword>;
  title: string;
  url: string;
  thumbnailUrl?: string | null;
  uploadDate: Date;
  uploader: string;
};

@Entity()
export class KeywordSearchResult implements IKeywordSearchResult {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => MonitoredKeyword, monitoredKeyword => monitoredKeyword.results)
  keyword: Partial<MonitoredKeyword>;

  @Column()
  title: string;

  @Column()
  url: string;

  @Column({ nullable: true, default: null })
  thumbnailUrl?: string | null;

  @Column('datetime')
  uploadDate: Date;

  @Column()
  uploader: string;

  toJSON(): IKeywordSearchResult {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      keyword: this.keyword,
      title: this.title,
      url: this.url,
      thumbnailUrl: this.thumbnailUrl,
      uploadDate: this.uploadDate,
      uploader: this.uploader
    };
  }
}

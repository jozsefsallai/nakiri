import { Column, Entity } from 'typeorm';
import {
  GuildRestrictableBlacklist,
  IGuildRestrictableBlacklist,
} from '../../common/GuildRestrictableBlacklist';
import { ProcessingState } from '../../common/ProcessingState';

export interface IYouTubeVideoID extends IGuildRestrictableBlacklist {
  videoId: string;
  status: ProcessingState;
  title?: string;
  description?: string;
  thumbnailUrl?: string;
  uploadDate?: Date;
  uploaderId?: string;
  uploaderName?: string;
}

@Entity()
export class YouTubeVideoID
  extends GuildRestrictableBlacklist
  implements IYouTubeVideoID
{
  @Column('varchar')
  videoId: string;

  @Column({
    type: 'enum',
    enum: ProcessingState,
    default: ProcessingState.QUEUED,
  })
  status: ProcessingState;

  @Column({ type: 'varchar', nullable: true, default: null })
  title?: string;

  @Column({ type: 'text', nullable: true, default: null })
  description?: string;

  @Column({ type: 'varchar', nullable: true, default: null })
  thumbnailUrl?: string;

  @Column({ type: 'datetime', nullable: true, default: null })
  uploadDate?: Date;

  @Column({ type: 'varchar', nullable: true, default: null })
  uploaderId?: string;

  @Column({ type: 'varchar', nullable: true, default: null })
  uploaderName?: string;

  toJSON(): IYouTubeVideoID {
    return {
      ...super.toJSON(),
      videoId: this.videoId,
      status: this.status,
      title: this.title,
      description: this.description,
      thumbnailUrl: this.thumbnailUrl,
      uploadDate: this.uploadDate,
      uploaderId: this.uploaderId,
      uploaderName: this.uploaderName,
    };
  }
}

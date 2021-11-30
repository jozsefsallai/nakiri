import { Column, Entity } from 'typeorm';
import {
  GuildRestrictableBlacklist,
  IGuildRestrictableBlacklist,
} from '../../common/GuildRestrictableBlacklist';
import { ProcessingState } from '../../common/ProcessingState';

export interface IYouTubeChannelID extends IGuildRestrictableBlacklist {
  channelId: string;
  status: ProcessingState;
  name?: string;
  description?: string;
  publishedAt?: Date;
  thumbnailUrl?: string;
}

@Entity()
export class YouTubeChannelID
  extends GuildRestrictableBlacklist
  implements IYouTubeChannelID
{
  @Column('varchar')
  channelId: string;

  @Column({
    type: 'enum',
    enum: ProcessingState,
    default: ProcessingState.QUEUED,
  })
  status: ProcessingState;

  @Column({ type: 'varchar', nullable: true, default: null })
  name?: string;

  @Column({ type: 'text', nullable: true, default: null })
  description?: string;

  @Column({ type: 'datetime', nullable: true, default: null })
  publishedAt?: Date;

  @Column({ type: 'varchar', nullable: true, default: null })
  thumbnailUrl?: string;

  toJSON(): IYouTubeChannelID {
    return {
      ...super.toJSON(),
      channelId: this.channelId,
      status: this.status,
      name: this.name,
      description: this.description,
      publishedAt: this.publishedAt,
      thumbnailUrl: this.thumbnailUrl,
    };
  }
}

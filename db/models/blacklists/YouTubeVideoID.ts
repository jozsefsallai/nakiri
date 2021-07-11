import { Column, Entity } from 'typeorm';
import {
  GuildRestrictableBlacklist,
  IGuildRestrictableBlacklist
} from '../../common/GuildRestrictableBlacklist';

export interface IYouTubeVideoID extends IGuildRestrictableBlacklist {
  videoId: string;
};

@Entity()
export class YouTubeVideoID extends GuildRestrictableBlacklist implements IYouTubeVideoID {
  @Column()
  videoId: string;

  toJSON(): IYouTubeVideoID {
    return {
      ...super.toJSON(),
      videoId: this.videoId
    };
  }
}

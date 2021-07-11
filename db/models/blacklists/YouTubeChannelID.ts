import { Column, Entity } from 'typeorm';
import {
  GuildRestrictableBlacklist,
  IGuildRestrictableBlacklist
} from '../../common/GuildRestrictableBlacklist';

export interface IYouTubeChannelID extends IGuildRestrictableBlacklist {
  channelId: string;
};

@Entity()
export class YouTubeChannelID extends GuildRestrictableBlacklist implements IYouTubeChannelID {
  @Column()
  channelId: string;

  toJSON(): IYouTubeChannelID {
    return {
      ...super.toJSON(),
      channelId: this.channelId
    };
  }
}

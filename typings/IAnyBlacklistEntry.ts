import { IDiscordGuild } from '@/db/models/blacklists/DiscordGuild';
import { ILinkPattern } from '@/db/models/blacklists/LinkPattern';
import { IPhrase } from '@/db/models/blacklists/Phrase';
import { IYouTubeChannelID } from '@/db/models/blacklists/YouTubeChannelID';
import { IYouTubeVideoID } from '@/db/models/blacklists/YouTubeVideoID';

export type IAnyBlacklistEntry =
  | IDiscordGuild
  | ILinkPattern
  | IPhrase
  | IYouTubeChannelID
  | IYouTubeVideoID;

export type IAnyBlacklistName =
  | 'discordGuildID'
  | 'linkPattern'
  | 'phrase'
  | 'youtubeChannelID'
  | 'youtubeVideoID';

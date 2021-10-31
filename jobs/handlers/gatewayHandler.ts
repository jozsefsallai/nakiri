import { IDiscordGuild } from '@/db/models/blacklists/DiscordGuild';
import { ILinkPattern } from '@/db/models/blacklists/LinkPattern';
import { IPhrase } from '@/db/models/blacklists/Phrase';
import { IYouTubeChannelID } from '@/db/models/blacklists/YouTubeChannelID';
import { IYouTubeVideoID } from '@/db/models/blacklists/YouTubeVideoID';

import {
  BlacklistEntryAddedNotification,
  BlacklistEntryRemovedNotification,
} from '@/gateway/typings/notifications';
import {
  IAnyBlacklistEntry,
  IAnyBlacklistName,
} from '@/typings/IAnyBlacklistEntry';

import { ProcessCallbackFunction } from 'bull';

import { v4 as uuid } from 'uuid';

export interface GatewayBlacklistNotificationJob {
  event: 'entryAdded' | 'entryRemoved';
  blacklist: IAnyBlacklistName;
  entry: IAnyBlacklistEntry;
}

const getValue = (
  blacklist: IAnyBlacklistName,
  entry: IAnyBlacklistEntry,
): string => {
  switch (blacklist) {
    case 'youtubeVideoID':
      return (entry as IYouTubeVideoID).videoId;
    case 'youtubeChannelID':
      return (entry as IYouTubeChannelID).channelId;
    case 'linkPattern':
      return (entry as ILinkPattern).pattern;
    case 'discordGuildID':
      return (entry as IDiscordGuild).blacklistedId;
    case 'phrase':
      return (entry as IPhrase).content;
  }
};

const handler: ProcessCallbackFunction<GatewayBlacklistNotificationJob> =
  async (
    job,
  ): Promise<
    Omit<
      BlacklistEntryAddedNotification | BlacklistEntryRemovedNotification,
      'notificationId'
    >
  > => {
    return {
      value: getValue(job.data.blacklist, job.data.entry),
      blacklist: job.data.blacklist,
      kind: job.data.blacklist === 'linkPattern' ? 'regex' : 'substring',
      global: !job.data.entry.group,
      guild: job.data.entry.group && job.data.entry.guildId,
      metadata: job.data.entry,
    };
  };

export default handler;

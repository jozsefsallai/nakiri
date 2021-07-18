import db from '@/services/db';
import { YouTubeChannelID, IYouTubeChannelID } from '@/db/models/blacklists/YouTubeChannelID';
import { FindConditions, IsNull } from 'typeorm';

export const getYouTubeChannelIDs = async (guildId?: string, strict?: boolean): Promise<IYouTubeChannelID[]> => {
  await db.prepare();
  const youTubeChannelIDRepository = db.getRepository(YouTubeChannelID);

  const where: FindConditions<YouTubeChannelID>[] = [];

  if (!strict) {
    where.push({ guildId: IsNull() }); // global blacklist (if strict mode is disabled)
  }

  if (guildId) {
    where.push({ guildId }); // guild-specific blacklist
  }

  const channelIDs = await youTubeChannelIDRepository.find({ where });

  return channelIDs.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
};

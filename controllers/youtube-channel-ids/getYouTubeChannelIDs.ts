import db from '@/services/db';
import { YouTubeChannelID } from '@/db/models/blacklists/YouTubeChannelID';
import { FindConditions, IsNull } from 'typeorm';

export const getYouTubeChannelIDs = async (
  guildId?: string,
  strict?: boolean,
  skip?: number,
  take?: number,
) => {
  await db.prepare();
  const youTubeChannelIDRepository = db.getRepository(YouTubeChannelID);

  const where: FindConditions<YouTubeChannelID>[] = [];

  if (!guildId || (guildId && !strict)) {
    where.push({ guildId: IsNull() }); // global blacklist (if strict mode is disabled)
  }

  if (guildId) {
    where.push({ guildId }); // guild-specific blacklist
  }

  const totalCount = await youTubeChannelIDRepository.count({ where });
  const channelIDs = await youTubeChannelIDRepository.find({
    where,
    skip,
    take,
    order: { createdAt: 'DESC' },
  });

  return { totalCount, channelIDs };
};

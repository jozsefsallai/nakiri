import db from '@/services/db';
import { YouTubeChannelID, IYouTubeChannelID } from '@/db/models/blacklists/YouTubeChannelID';
import { IsNull } from 'typeorm';

export const getYouTubeChannelIDs = async (guildId?: string): Promise<IYouTubeChannelID[]> => {
  await db.prepare();
  const youTubeChannelIDRepository = db.getRepository(YouTubeChannelID);

  const channelIDs = await youTubeChannelIDRepository.find({ where: [
    { guildId: IsNull() },
    { guildId }
  ] });

  return channelIDs.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
};

import db from '@/services/db';
import { YouTubeVideoID, IYouTubeVideoID } from '@/db/models/blacklists/YouTubeVideoID';
import { FindConditions, IsNull } from 'typeorm';

export const getYouTubeVideoIDs = async (guildId?: string, strict?: boolean): Promise<IYouTubeVideoID[]> => {
  await db.prepare();
  const youTubeVideoIDRepository = db.getRepository(YouTubeVideoID);

  const where: FindConditions<YouTubeVideoID>[] = [];

  if (!strict) {
    where.push({ guildId: IsNull() }); // global blacklist (if strict mode is disabled)
  }

  if (guildId) {
    where.push({ guildId }); // guild-specific blacklist
  }

  const videoIDs = await youTubeVideoIDRepository.find({ where });

  return videoIDs.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
};

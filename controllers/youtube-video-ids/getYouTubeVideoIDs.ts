import db from '@/services/db';
import { YouTubeVideoID } from '@/db/models/blacklists/YouTubeVideoID';
import { FindConditions, IsNull } from 'typeorm';

export const getYouTubeVideoIDs = async (guildId?: string, strict?: boolean, skip?: number, take?: number) => {
  await db.prepare();
  const youTubeVideoIDRepository = db.getRepository(YouTubeVideoID);

  const where: FindConditions<YouTubeVideoID>[] = [];

  if (!guildId || (guildId && !strict)) {
    where.push({ guildId: IsNull() }); // global blacklist (if strict mode is disabled)
  }

  if (guildId) {
    where.push({ guildId }); // guild-specific blacklist
  }

  const totalCount = await youTubeVideoIDRepository.count({ where });
  const videoIDs = await youTubeVideoIDRepository.find({ where, skip, take, order: { createdAt: 'DESC' } });

  return { videoIDs, totalCount };
};

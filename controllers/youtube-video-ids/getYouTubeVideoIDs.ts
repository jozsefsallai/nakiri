import db from '@/services/db';
import { YouTubeVideoID, IYouTubeVideoID } from '@/db/models/blacklists/YouTubeVideoID';
import { IsNull } from 'typeorm';

export const getYouTubeVideoIDs = async (guildId?: string): Promise<IYouTubeVideoID[]> => {
  await db.prepare();
  const youTubeVideoIDRepository = db.getRepository(YouTubeVideoID);

  const videoIDs = await youTubeVideoIDRepository.find({ where: [
    { guildId: IsNull() }, // global videoIDs
    { guildId }            // guild-specific videoIDs
  ] });

  return videoIDs.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
};

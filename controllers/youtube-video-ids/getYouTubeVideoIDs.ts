import db from '@/services/db';
import { YouTubeVideoID } from '@/db/models/blacklists/YouTubeVideoID';

import { IBlacklistGetterParams } from '@/typings/IBlacklistGetterParams';
import buildFindConditions from '@/lib/buildFindConditions';

export const getYouTubeVideoIDs = async ({
  groupId,
  guildId,
  strict,
  skip,
  take,
}: IBlacklistGetterParams) => {
  await db.prepare();
  const youTubeVideoIDRepository = db.getRepository(YouTubeVideoID);

  const where = buildFindConditions<YouTubeVideoID>(groupId, guildId, strict);

  const totalCount = await youTubeVideoIDRepository.count({
    where,
    relations: ['group'],
  });
  const videoIDs = await youTubeVideoIDRepository.find({
    where,
    skip,
    take,
    order: { createdAt: 'DESC' },
    relations: ['group'],
  });

  return { videoIDs, totalCount };
};

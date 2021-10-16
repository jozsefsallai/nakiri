import db from '@/services/db';
import { YouTubeChannelID } from '@/db/models/blacklists/YouTubeChannelID';
import { FindConditions, IsNull } from 'typeorm';

import { IBlacklistGetterParams } from '@/typings/IBlacklistGetterParams';
import buildFindConditions from '@/lib/buildFindConditions';

export const getYouTubeChannelIDs = async ({
  groupId,
  guildId,
  strict,
  skip,
  take,
}: IBlacklistGetterParams) => {
  await db.prepare();
  const youTubeChannelIDRepository = db.getRepository(YouTubeChannelID);

  const where = buildFindConditions<YouTubeChannelID>(groupId, guildId, strict);

  const totalCount = await youTubeChannelIDRepository.count({
    where,
    relations: ['group'],
  });

  const channelIDs = await youTubeChannelIDRepository.find({
    where,
    skip,
    take,
    order: { createdAt: 'DESC' },
    relations: ['group'],
  });

  return { totalCount, channelIDs };
};

import db from '@/services/db';
import { YouTubeChannelID } from '@/db/models/blacklists/YouTubeChannelID';
import { FindConditions, LessThanOrEqual } from 'typeorm';
import { decodeSnowflake, encodeSnowflake } from '@/lib/snowflake';

import { IBlacklistGetterParams } from '@/typings/IBlacklistGetterParams';
import buildFindConditions from '@/lib/buildFindConditions';

export const getYouTubeChannelIDs = async ({
  groupId,
  guildId,
  strict,
  skip,
  take,
  cursor,
}: IBlacklistGetterParams) => {
  await db.prepare();
  const youTubeChannelIDRepository = db.getRepository(YouTubeChannelID);

  const additionalConditions: FindConditions<YouTubeChannelID> | undefined =
    typeof cursor !== 'undefined' &&
      cursor !== '0' && {
        id: LessThanOrEqual(decodeSnowflake(cursor)),
      };

  const where = buildFindConditions<YouTubeChannelID>(
    groupId,
    guildId,
    strict,
    additionalConditions,
  );

  const totalCount = await youTubeChannelIDRepository.count({
    where,
    relations: ['group'],
  });

  const channelIDs = await youTubeChannelIDRepository.find({
    where,
    skip,
    take: take + Number(!!cursor),
    order: { createdAt: 'DESC' },
    relations: ['group'],
  });

  const nextCursor: string | undefined =
    (cursor &&
      channelIDs.length === take + 1 &&
      encodeSnowflake(channelIDs.pop().id)) ||
    null;

  return { channelIDs, totalCount, nextCursor };
};

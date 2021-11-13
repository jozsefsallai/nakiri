import db from '@/services/db';
import { YouTubeVideoID } from '@/db/models/blacklists/YouTubeVideoID';

import { IBlacklistGetterParams } from '@/typings/IBlacklistGetterParams';
import buildFindConditions from '@/lib/buildFindConditions';
import { FindConditions, LessThanOrEqual } from 'typeorm';
import { decodeSnowflake, encodeSnowflake } from '@/lib/snowflake';

export const getYouTubeVideoIDs = async ({
  groupId,
  guildId,
  strict,
  skip,
  take,
  cursor,
}: IBlacklistGetterParams) => {
  await db.prepare();
  const youTubeVideoIDRepository = db.getRepository(YouTubeVideoID);

  const additionalConditions: FindConditions<YouTubeVideoID> | undefined =
    typeof cursor !== 'undefined' &&
      cursor !== '0' && {
        id: LessThanOrEqual(decodeSnowflake(cursor)),
      };

  const where = buildFindConditions<YouTubeVideoID>(
    groupId,
    guildId,
    strict,
    additionalConditions,
  );

  const totalCount = await youTubeVideoIDRepository.count({
    where,
    relations: ['group'],
  });

  const videoIDs = await youTubeVideoIDRepository.find({
    where,
    skip,
    take: take + Number(!!cursor),
    order: { createdAt: 'DESC' },
    relations: ['group'],
  });

  const nextCursor: string | undefined =
    (cursor &&
      videoIDs.length === take + 1 &&
      encodeSnowflake(videoIDs.pop().id)) ||
    null;

  return { videoIDs, totalCount, nextCursor };
};

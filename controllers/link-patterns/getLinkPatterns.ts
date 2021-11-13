import db from '@/services/db';
import { LinkPattern } from '@/db/models/blacklists/LinkPattern';
import { FindConditions, LessThanOrEqual } from 'typeorm';
import { decodeSnowflake, encodeSnowflake } from '@/lib/snowflake';

import { IBlacklistGetterParams } from '@/typings/IBlacklistGetterParams';
import buildFindConditions from '@/lib/buildFindConditions';

export const getLinkPatterns = async ({
  groupId,
  guildId,
  strict,
  skip,
  take,
  cursor,
}: IBlacklistGetterParams) => {
  await db.prepare();
  const linkPatternRepository = db.getRepository(LinkPattern);

  const additionalConditions: FindConditions<LinkPattern> | undefined =
    typeof cursor !== 'undefined' &&
      cursor !== '0' && {
        id: LessThanOrEqual(decodeSnowflake(cursor)),
      };

  const where = buildFindConditions<LinkPattern>(
    groupId,
    guildId,
    strict,
    additionalConditions,
  );

  const totalCount = await linkPatternRepository.count({
    where,
    relations: ['group'],
  });

  const patterns = await linkPatternRepository.find({
    where,
    skip,
    take: take + Number(!!cursor),
    order: { createdAt: 'DESC' },
    relations: ['group'],
  });

  const nextCursor: string | undefined =
    (cursor &&
      patterns.length === take + 1 &&
      encodeSnowflake(patterns.pop().id)) ||
    null;

  return { patterns, totalCount, nextCursor };
};

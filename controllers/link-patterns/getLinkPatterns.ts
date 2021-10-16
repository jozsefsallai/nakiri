import db from '@/services/db';
import { LinkPattern } from '@/db/models/blacklists/LinkPattern';
import { FindConditions, IsNull } from 'typeorm';

import { IBlacklistGetterParams } from '@/typings/IBlacklistGetterParams';
import buildFindConditions from '@/lib/buildFindConditions';

export const getLinkPatterns = async ({
  groupId,
  guildId,
  strict,
  skip,
  take,
}: IBlacklistGetterParams) => {
  await db.prepare();
  const linkPatternRepository = db.getRepository(LinkPattern);

  const where = buildFindConditions<LinkPattern>(groupId, guildId, strict);

  const totalCount = await linkPatternRepository.count({
    where,
    relations: ['group'],
  });
  const patterns = await linkPatternRepository.find({
    where,
    skip,
    take,
    order: { createdAt: 'DESC' },
    relations: ['group'],
  });

  return { patterns, totalCount };
};

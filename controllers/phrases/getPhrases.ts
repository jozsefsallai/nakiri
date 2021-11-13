import db from '@/services/db';
import { Phrase } from '@/db/models/blacklists/Phrase';

import { IBlacklistGetterParams } from '@/typings/IBlacklistGetterParams';
import buildFindConditions from '@/lib/buildFindConditions';
import { FindConditions, LessThanOrEqual } from 'typeorm';
import { decodeSnowflake, encodeSnowflake } from '@/lib/snowflake';

export const getPhrases = async ({
  groupId,
  guildId,
  strict,
  skip,
  take,
  cursor,
}: IBlacklistGetterParams) => {
  await db.prepare();
  const phrasesRepository = db.getRepository(Phrase);

  const additionalConditions: FindConditions<Phrase> | undefined =
    typeof cursor !== 'undefined' &&
      cursor !== '0' && {
        id: LessThanOrEqual(decodeSnowflake(cursor)),
      };

  const where = buildFindConditions<Phrase>(
    groupId,
    guildId,
    strict,
    additionalConditions,
  );

  const totalCount = await phrasesRepository.count({
    where,
    relations: ['group'],
  });

  const phrases = await phrasesRepository.find({
    where,
    skip,
    take: take + Number(!!cursor),
    order: { createdAt: 'DESC' },
    relations: ['group'],
  });

  const nextCursor: string | undefined =
    (cursor &&
      phrases.length === take + 1 &&
      encodeSnowflake(phrases.pop().id)) ||
    null;

  return { phrases, totalCount, nextCursor };
};

import db from '@/services/db';
import { Phrase } from '@/db/models/blacklists/Phrase';

import { IBlacklistGetterParams } from '@/typings/IBlacklistGetterParams';
import buildFindConditions from '@/lib/buildFindConditions';

export const getPhrases = async ({
  groupId,
  guildId,
  strict,
  skip,
  take,
}: IBlacklistGetterParams) => {
  await db.prepare();
  const phrasesRepository = db.getRepository(Phrase);

  const where = buildFindConditions<Phrase>(groupId, guildId, strict);

  const totalCount = await phrasesRepository.count({
    where,
    relations: ['group'],
  });
  const phrases = await phrasesRepository.find({
    where,
    skip,
    take,
    order: { createdAt: 'DESC' },
    relations: ['group'],
  });

  return { phrases, totalCount };
};

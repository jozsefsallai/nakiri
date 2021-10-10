import db from '@/services/db';
import { LinkPattern } from '@/db/models/blacklists/LinkPattern';
import { FindConditions, IsNull } from 'typeorm';

export const getLinkPatterns = async (
  guildId?: string,
  strict?: boolean,
  skip?: number,
  take?: number,
) => {
  await db.prepare();
  const linkPatternRepository = db.getRepository(LinkPattern);

  const where: FindConditions<LinkPattern>[] = [];

  if (!guildId || (guildId && !strict)) {
    where.push({ guildId: IsNull() }); // global blacklist (if strict mode is disabled)
  }

  if (guildId) {
    where.push({ guildId }); // guild-specific blacklist
  }

  const totalCount = await linkPatternRepository.count({ where });
  const patterns = await linkPatternRepository.find({
    where,
    skip,
    take,
    order: { createdAt: 'DESC' },
  });

  return { patterns, totalCount };
};

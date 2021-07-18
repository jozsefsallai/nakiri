import db from '@/services/db';
import { LinkPattern, ILinkPattern } from '@/db/models/blacklists/LinkPattern';
import { FindConditions, IsNull } from 'typeorm';

export const getLinkPatterns = async (guildId?: string, strict?: boolean): Promise<ILinkPattern[]> => {
  await db.prepare();
  const linkPatternRepository = db.getRepository(LinkPattern);

  const where: FindConditions<LinkPattern>[] = [];

  if (!strict) {
    where.push({ guildId: IsNull() }); // global blacklist (if strict mode is disabled)
  }

  if (guildId) {
    where.push({ guildId }); // guild-specific blacklist
  }

  const linkPatterns = await linkPatternRepository.find({ where });

  return linkPatterns.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
};

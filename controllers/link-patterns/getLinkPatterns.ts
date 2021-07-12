import db from '@/services/db';
import { LinkPattern, ILinkPattern } from '@/db/models/blacklists/LinkPattern';
import { IsNull } from 'typeorm';

export const getLinkPatterns = async (guildId?: string): Promise<ILinkPattern[]> => {
  await db.prepare();
  const linkPatternRepository = db.getRepository(LinkPattern);

  const linkPatterns = await linkPatternRepository.find({ where: [
    { guildId: IsNull() },
    { guildId }
  ] });

  return linkPatterns.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
};

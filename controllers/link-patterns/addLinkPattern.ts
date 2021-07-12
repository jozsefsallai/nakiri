import db from '@/services/db';
import { LinkPattern } from '@/db/models/blacklists/LinkPattern';
import { FindConditions, IsNull } from 'typeorm';
import { APIError } from '@/lib/errors';
import { isValidRegex } from '@/lib/commonValidators';

export class LinkPatternCreationError extends APIError {
  constructor(statusCode: number, code: string) {
    super(statusCode, code);
    this.name = 'LinkPatternCreationError';
  }
}

export const addLinkPattern = async (pattern: string, guildId?: string) => {
  await db.prepare();
  const linkPatternRepository = db.getRepository(LinkPattern);

  pattern = pattern.trim();
  if (!isValidRegex(pattern)) {
    throw new LinkPatternCreationError(400, 'INVALID_REGEX_PATTERN');
  }

  const where: FindConditions<LinkPattern>[] = [
    { pattern, guildId: IsNull() }
  ];

  if (guildId) {
    where.push({ pattern, guildId });
  }

  const count = await linkPatternRepository.count({ where });

  if (count > 0) {
    throw new LinkPatternCreationError(400, 'PATTERN_ALREADY_EXISTS');
  }

  const entry = new LinkPattern();
  entry.pattern = pattern;

  if (guildId) {
    entry.guildId = guildId;
  }

  await linkPatternRepository.insert(entry);
};

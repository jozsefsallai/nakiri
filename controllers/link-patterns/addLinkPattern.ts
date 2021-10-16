import db from '@/services/db';
import { LinkPattern } from '@/db/models/blacklists/LinkPattern';
import { FindConditions, IsNull } from 'typeorm';
import { APIError } from '@/lib/errors';
import { isValidRegex } from '@/lib/commonValidators';

import buildFindConditions from '@/lib/buildFindConditions';
import { IBlacklistAddParams } from '@/typings/IBlacklistAddParams';
import { GroupMember } from '@/db/models/groups/GroupMember';
import { Group } from '@/db/models/groups/Group';

export class LinkPatternCreationError extends APIError {
  constructor(statusCode: number, code: string) {
    super(statusCode, code);
    this.name = 'LinkPatternCreationError';
  }
}

export const addLinkPattern = async ({
  pattern,
  groupId,
  guildId,
}: IBlacklistAddParams<'pattern'>) => {
  await db.prepare();
  const linkPatternRepository = db.getRepository(LinkPattern);

  pattern = pattern.trim();
  if (!isValidRegex(pattern)) {
    throw new LinkPatternCreationError(400, 'INVALID_REGEX_PATTERN');
  }

  const where = buildFindConditions<LinkPattern>(groupId, guildId, false, {
    pattern,
  });

  const count = await linkPatternRepository.count({
    where,
    relations: ['group'],
  });

  if (count > 0) {
    throw new LinkPatternCreationError(400, 'PATTERN_ALREADY_EXISTS');
  }

  const entry = new LinkPattern();
  entry.pattern = pattern;

  if (groupId) {
    const membershipsRepository = db.getRepository(GroupMember);

    const membership = await membershipsRepository.findOne({
      where: {
        group: { id: groupId },
      },
      relations: ['group'],
    });

    if (!membership) {
      throw new LinkPatternCreationError(404, 'GROUP_NOT_FOUND');
    }

    entry.group = membership.group as Group;

    if (guildId) {
      entry.guildId = guildId;
    }
  }

  await linkPatternRepository.insert(entry);
};

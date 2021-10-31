import db from '@/services/db';
import { Phrase } from '@/db/models/blacklists/Phrase';
import { APIError } from '@/lib/errors';

import buildFindConditions from '@/lib/buildFindConditions';
import { IBlacklistAddParams } from '@/typings/IBlacklistAddParams';
import { GroupMember } from '@/db/models/groups/GroupMember';
import { Group } from '@/db/models/groups/Group';
import { Severity } from '@/db/common/Severity';

import { queueGatewayMessage } from '@/jobs/queue';

export class PhraseCreationError extends APIError {
  constructor(statusCode: number, code: string) {
    super(statusCode, code);
    this.name = 'PhraseCreationError';
  }
}

export const addPhrase = async ({
  content,
  groupId,
  guildId,
  severity,
  gateway,
}: IBlacklistAddParams<'content'>) => {
  await db.prepare();
  const phraseRepository = db.getRepository(Phrase);

  content = content.trim();

  if (content.length < 2) {
    throw new PhraseCreationError(400, 'PHRASE_TOO_SHORT');
  }

  const where = buildFindConditions<Phrase>(groupId, guildId, false, {
    content,
  });

  const count = await phraseRepository.count({
    where,
    relations: ['group'],
  });

  if (count > 0) {
    throw new PhraseCreationError(400, 'PHRASE_ALREADY_EXISTS');
  }

  if (typeof severity !== 'undefined' && !(severity in Severity)) {
    throw new PhraseCreationError(400, 'INVALID_SEVERITY');
  }

  const entry = new Phrase();
  entry.content = content;
  entry.severity = severity ?? Severity.MEDIUM;

  if (groupId) {
    const membershipRepository = db.getRepository(GroupMember);

    const membership = await membershipRepository.findOne({
      where: {
        group: { id: groupId },
      },
      relations: ['group'],
    });

    if (!membership) {
      throw new PhraseCreationError(404, 'GROUP_NOT_FOUND');
    }

    entry.group = membership.group as Group;

    if (guildId) {
      entry.guildId = guildId;
    }
  }

  await phraseRepository.insert(entry);

  if (gateway) {
    await queueGatewayMessage(gateway, {
      event: 'entryAdded',
      blacklist: 'phrase',
      entry,
    });
  }
};

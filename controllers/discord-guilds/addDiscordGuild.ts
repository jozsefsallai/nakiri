import db from '@/services/db';

import { DiscordGuild } from '@/db/models/blacklists/DiscordGuild';
import { APIError } from '@/lib/errors';

import buildFindConditions from '@/lib/buildFindConditions';
import { IBlacklistAddParams } from '@/typings/IBlacklistAddParams';
import { GroupMember } from '@/db/models/groups/GroupMember';
import { Group } from '@/db/models/groups/Group';
import { Severity } from '@/db/common/Severity';

import { queueGatewayMessage } from '@/jobs/queue';

export class DiscordGuildCreationError extends APIError {
  constructor(statusCode: number, code: string) {
    super(statusCode, code);
    this.name = 'DiscordGuildCreationError';
  }
}

export const addDiscordGuild = async (
  name: string,
  {
    blacklistedId,
    guildId,
    groupId,
    severity,
    gateway,
  }: IBlacklistAddParams<'blacklistedId'>,
) => {
  await db.prepare();
  const discordGuildsRepository = db.getRepository(DiscordGuild);

  const where = buildFindConditions<DiscordGuild>(groupId, guildId, false, {
    blacklistedId,
  });

  const count = await discordGuildsRepository.count({
    where,
    relations: ['group'],
  });

  if (count > 0) {
    throw new DiscordGuildCreationError(400, 'ID_ALREADY_EXISTS');
  }

  if (typeof severity !== 'undefined' && !(severity in Severity)) {
    throw new DiscordGuildCreationError(400, 'INVALID_SEVERITY');
  }

  const entry = new DiscordGuild();
  entry.blacklistedId = blacklistedId;
  entry.severity = severity ?? Severity.MEDIUM;

  if (name) {
    entry.name = name;
  }

  if (groupId) {
    const membershipsRepository = db.getRepository(GroupMember);

    const membership = await membershipsRepository.findOne({
      where: {
        group: { id: groupId },
      },
      relations: ['group'],
    });

    if (!membership) {
      throw new DiscordGuildCreationError(404, 'GROUP_NOT_FOUND');
    }

    entry.group = membership.group as Group;

    if (guildId) {
      entry.guildId = guildId;
    }
  }

  await discordGuildsRepository.insert(entry);

  if (gateway) {
    await queueGatewayMessage(gateway, {
      event: 'entryAdded',
      blacklist: 'discordGuildID',
      entry,
    });
  }
};

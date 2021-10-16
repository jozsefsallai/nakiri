import db from '@/services/db';
import { FindConditions, IsNull } from 'typeorm';

import { YouTubeChannelID } from '@/db/models/blacklists/YouTubeChannelID';
import { APIError } from '@/lib/errors';
import { isValidYouTubeChannelID } from '@/lib/commonValidators';

import { collectChannelMetadata } from '@/jobs/queue';

import buildFindConditions from '@/lib/buildFindConditions';
import { IBlacklistAddParams } from '@/typings/IBlacklistAddParams';
import { GroupMember } from '@/db/models/groups/GroupMember';
import { Group } from '@/db/models/groups/Group';

export class YouTubeChannelIDCreationError extends APIError {
  constructor(statusCode: number, code: string) {
    super(statusCode, code);
    this.name = 'YouTubeChannelIDCreationError';
  }
}

export const addYouTubeChannelID = async ({
  channelId,
  groupId,
  guildId,
}: IBlacklistAddParams<'channelId'>) => {
  await db.prepare();
  const youTubeChannelIDRepository = db.getRepository(YouTubeChannelID);

  channelId = channelId.trim();
  if (!isValidYouTubeChannelID(channelId)) {
    throw new YouTubeChannelIDCreationError(400, 'INVALID_CHANNEL_ID');
  }

  const where = buildFindConditions<YouTubeChannelID>(groupId, guildId, false, {
    channelId,
  });

  const count = await youTubeChannelIDRepository.count({
    where,
    relations: ['group'],
  });

  if (count > 0) {
    throw new YouTubeChannelIDCreationError(400, 'ID_ALREADY_EXISTS');
  }

  const entry = new YouTubeChannelID();
  entry.channelId = channelId;

  if (groupId) {
    const membershipsRepository = db.getRepository(GroupMember);

    const membership = await membershipsRepository.findOne({
      where: {
        group: { id: groupId },
      },
      relations: ['group'],
    });

    if (!membership) {
      throw new YouTubeChannelIDCreationError(404, 'GROUP_NOT_FOUND');
    }

    entry.group = membership.group as Group;

    if (guildId) {
      entry.guildId = guildId;
    }
  }

  await youTubeChannelIDRepository.insert(entry);

  collectChannelMetadata.add({ entry });
};

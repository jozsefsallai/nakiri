import db from '@/services/db';

import { YouTubeVideoID } from '@/db/models/blacklists/YouTubeVideoID';
import { APIError } from '@/lib/errors';
import { isValidYouTubeVideoID } from '@/lib/commonValidators';

import { collectVideoMetadata } from '@/jobs/queue';
import buildFindConditions from '@/lib/buildFindConditions';
import { IBlacklistAddParams } from '@/typings/IBlacklistAddParams';
import { GroupMember } from '@/db/models/groups/GroupMember';
import { Group } from '@/db/models/groups/Group';

export class YouTubeVideoIDCreationError extends APIError {
  constructor(statusCode: number, code: string) {
    super(statusCode, code);
    this.name = 'YouTubeVideoIDCreationError';
  }
}

export const addYouTubeVideoID = async ({
  videoId,
  groupId,
  guildId,
}: IBlacklistAddParams<'videoId'>) => {
  await db.prepare();
  const youTubeVideoIDRepository = db.getRepository(YouTubeVideoID);

  videoId = videoId.trim();
  if (!isValidYouTubeVideoID(videoId)) {
    throw new YouTubeVideoIDCreationError(400, 'INVALID_VIDEO_ID');
  }

  const where = buildFindConditions<YouTubeVideoID>(groupId, guildId, false, {
    videoId,
  });

  const count = await youTubeVideoIDRepository.count({
    where,
    relations: ['group'],
  });

  if (count > 0) {
    throw new YouTubeVideoIDCreationError(400, 'ID_ALREADY_EXISTS');
  }

  const entry = new YouTubeVideoID();
  entry.videoId = videoId;

  if (groupId) {
    const membershipsRepository = db.getRepository(GroupMember);

    const membership = await membershipsRepository.findOne({
      where: {
        group: { id: groupId },
      },
      relations: ['group'],
    });

    if (!membership) {
      throw new YouTubeVideoIDCreationError(404, 'GROUP_NOT_FOUND');
    }

    entry.group = membership.group as Group;

    if (guildId) {
      entry.guildId = guildId;
    }
  }

  await youTubeVideoIDRepository.insert(entry);

  collectVideoMetadata.add({ entry });
};

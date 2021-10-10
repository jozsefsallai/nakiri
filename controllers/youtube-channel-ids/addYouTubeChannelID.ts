import db from '@/services/db';
import { FindConditions, IsNull } from 'typeorm';

import { YouTubeChannelID } from '@/db/models/blacklists/YouTubeChannelID';
import { APIError } from '@/lib/errors';
import { isValidYouTubeChannelID } from '@/lib/commonValidators';

import { collectChannelMetadata } from '@/jobs/queue';

export class YouTubeChannelIDCreationError extends APIError {
  constructor(statusCode: number, code: string) {
    super(statusCode, code);
    this.name = 'YouTubeChannelIDCreationError';
  }
}

export const addYouTubeChannelID = async (
  channelId: string,
  guildId?: string,
) => {
  await db.prepare();
  const youTubeChannelIDRepository = db.getRepository(YouTubeChannelID);

  channelId = channelId.trim();
  if (!isValidYouTubeChannelID(channelId)) {
    throw new YouTubeChannelIDCreationError(400, 'INVALID_CHANNEL_ID');
  }

  const where: FindConditions<YouTubeChannelID>[] = [
    { channelId, guildId: IsNull() },
  ];

  if (guildId) {
    where.push({ channelId, guildId });
  }

  const count = await youTubeChannelIDRepository.count({ where });

  if (count > 0) {
    throw new YouTubeChannelIDCreationError(400, 'ID_ALREADY_EXISTS');
  }

  const entry = new YouTubeChannelID();
  entry.channelId = channelId;

  if (guildId) {
    entry.guildId = guildId;
  }

  await youTubeChannelIDRepository.insert(entry);

  collectChannelMetadata.add({ entry });
};

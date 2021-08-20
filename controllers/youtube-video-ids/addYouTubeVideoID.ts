import db from '@/services/db';
import { FindConditions, IsNull } from 'typeorm';

import { YouTubeVideoID } from '@/db/models/blacklists/YouTubeVideoID';
import { APIError } from '@/lib/errors';
import { isValidYouTubeVideoID } from '@/lib/commonValidators';

import { collectVideoMetadata } from '@/jobs/queue';

export class YouTubeVideoIDCreationError extends APIError {
  constructor(statusCode: number, code: string) {
    super(statusCode, code);
    this.name = 'YouTubeVideoIDCreationError';
  }
}

export const addYouTubeVideoID = async (videoId: string, guildId?: string) => {
  await db.prepare();
  const youTubeVideoIDRepository = db.getRepository(YouTubeVideoID);

  videoId = videoId.trim();
  if (!isValidYouTubeVideoID(videoId)) {
    throw new YouTubeVideoIDCreationError(400, 'INVALID_VIDEO_ID');
  }

  const where: FindConditions<YouTubeVideoID>[] = [
    { videoId, guildId: IsNull() }
  ];

  if (guildId) {
    where.push({ videoId, guildId });
  }

  const count = await youTubeVideoIDRepository.count({ where });

  if (count > 0) {
    throw new YouTubeVideoIDCreationError(400, 'ID_ALREADY_EXISTS');
  }

  const entry = new YouTubeVideoID();
  entry.videoId = videoId;

  if (guildId) {
    entry.guildId = guildId;
  }

  await youTubeVideoIDRepository.insert(entry);

  collectVideoMetadata.add({ entry });
};

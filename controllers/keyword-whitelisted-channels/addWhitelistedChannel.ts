import db from '@/services/db';

import { KeywordWhitelistedChannel } from '@/db/models/keywords/KeywordWhitelistedChannel';
import { APIError } from '@/lib/errors';
import { isValidYouTubeChannelID } from '@/lib/commonValidators';

export class AddKeywordWhitelistedChannelError extends APIError {
  constructor(statusCode: number, code: string) {
    super(statusCode, code);
    this.name = 'AddKeywordWhitelistedChannelError';
  }
}

export const addWhitelistedChannel = async (channelId: string, guildId: string) => {
  if (!isValidYouTubeChannelID(channelId)) {
    throw new AddKeywordWhitelistedChannelError(400, 'INVALID_CHANNEL_ID');
  }

  await db.prepare();
  const keywordWhitelistedChannelsRepository = db.getRepository(KeywordWhitelistedChannel);

  const count = await keywordWhitelistedChannelsRepository.count({ channelId, guildId });
  if (count > 0) {
    throw new AddKeywordWhitelistedChannelError(400, 'CHANNEL_ALREADY_WHITELISTED');
  }

  const keywordWhitelistedChannel = new KeywordWhitelistedChannel();
  keywordWhitelistedChannel.channelId = channelId;
  keywordWhitelistedChannel.guildId = guildId;
  await keywordWhitelistedChannelsRepository.insert(keywordWhitelistedChannel);
};

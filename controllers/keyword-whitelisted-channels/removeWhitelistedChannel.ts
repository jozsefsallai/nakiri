import db from '@/services/db';

import { KeywordWhitelistedChannel } from '@/db/models/keywords/KeywordWhitelistedChannel';
import { APIError } from '@/lib/errors';

export class RemoveKeywordWhitelistedChannelError extends APIError {
  constructor(statusCode: number, code: string) {
    super(statusCode, code);
    this.name = 'RemoveKeywordWhitelistedChannelError';
  }
}

export const removeWhitelistedChannel = async (id: string, guildId: string) => {
  await db.prepare();
  const keywordWhitelistedChannelsRepository = db.getRepository(KeywordWhitelistedChannel);

  const entry = await keywordWhitelistedChannelsRepository.findOne({ id, guildId });
  if (!entry) {
    throw new RemoveKeywordWhitelistedChannelError(404, 'WHITELISTED_CHANNEL_NOT_FOUND');
  }

  await keywordWhitelistedChannelsRepository.delete({ id });
};

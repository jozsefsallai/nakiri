import db from '@/services/db';

import {
  IKeywordWhitelistedChannel,
  KeywordWhitelistedChannel,
} from '@/db/models/keywords/KeywordWhitelistedChannel';

export const getWhitelistedChannels = async (
  guildId: string,
): Promise<IKeywordWhitelistedChannel[]> => {
  await db.prepare();
  const keywordWhitelistedChannelsRepository = db.getRepository(
    KeywordWhitelistedChannel,
  );

  const channels = await keywordWhitelistedChannelsRepository.find({ guildId });
  return channels.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

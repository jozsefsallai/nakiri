import db from '@/services/db';

import { IKeywordSearchResult, KeywordSearchResult } from '@/db/models/keywords/KeywordSearchResult';
import { MonitoredKeyword } from '@/db/models/keywords/MonitoredKeyword';
import { Session } from 'next-auth';
import { APIError } from '@/lib/errors';
import { fetchGuilds } from '../guilds/fetchGuilds';
import { FindConditions } from 'typeorm';

export class GetKeywordSearchResultsError extends APIError {
  constructor(statusCode: number, code: string) {
    super(statusCode, code);
    this.name = 'GetKeywordSearchResultsError';
  }
}

export const getKeywordSearchResults = async (session: Session, id: string, skip?: number, take?: number) => {
  await db.prepare();

  const monitoredKeywordsRepository = db.getRepository(MonitoredKeyword);
  const keywordSearchResultsRepository = db.getRepository(KeywordSearchResult);

  const entry = await monitoredKeywordsRepository.findOne({ id });
  if (!entry) {
    throw new GetKeywordSearchResultsError(404, 'ENTRY_NOT_FOUND');
  }

  const guilds = await fetchGuilds(session);
  if (!guilds.some(g => g.id === entry.guildId)) {
    throw new GetKeywordSearchResultsError(403, 'CANNOT_ACCESS_ENTRY_FROM_THIS_GUILD');
  }

  const where: FindConditions<KeywordSearchResult> = {
    keyword: entry,
  };

  const totalCount = await keywordSearchResultsRepository.count({ where });
  const keywordSearchResults = await keywordSearchResultsRepository.find({ where, skip, take });

  return { keywordSearchResults, totalCount };
};

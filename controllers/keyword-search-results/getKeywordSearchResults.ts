import db from '@/services/db';

import { KeywordSearchResult } from '@/db/models/keywords/KeywordSearchResult';
import { MonitoredKeyword } from '@/db/models/keywords/MonitoredKeyword';
import { Session } from 'next-auth';
import { APIError } from '@/lib/errors';
import { FindConditions } from 'typeorm';

export class GetKeywordSearchResultsError extends APIError {
  constructor(statusCode: number, code: string) {
    super(statusCode, code);
    this.name = 'GetKeywordSearchResultsError';
  }
}

export const getKeywordSearchResults = async (
  session: Session,
  id: string,
  skip?: number,
  take?: number,
) => {
  await db.prepare();

  const monitoredKeywordsRepository = db.getRepository(MonitoredKeyword);
  const keywordSearchResultsRepository = db.getRepository(KeywordSearchResult);

  const entry = await monitoredKeywordsRepository.findOne({ id });
  if (!entry) {
    throw new GetKeywordSearchResultsError(404, 'ENTRY_NOT_FOUND');
  }

  const where: FindConditions<KeywordSearchResult> = {
    keyword: entry,
  };

  const totalCount = await keywordSearchResultsRepository.count({ where });
  const keywordSearchResults = await keywordSearchResultsRepository.find({
    where,
    skip,
    take,
    order: { createdAt: 'DESC' },
  });

  return { keywordSearchResults, totalCount };
};

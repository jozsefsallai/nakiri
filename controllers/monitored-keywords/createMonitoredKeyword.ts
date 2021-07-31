import db from '@/services/db';

import { MonitoredKeyword } from '@/db/models/keywords/MonitoredKeyword';
import { APIError } from '@/lib/errors';
import { CreateMonitoredKeywordAPIRequest } from '@/services/apis/monitored-keywords/MonitoredKeywordsAPIService';
import { isValidUrl } from '@/lib/commonValidators';

export class MonitoredKeywordCreationError extends APIError {
  constructor(statusCode: number, code: string) {
    super(statusCode, code);
    this.name = 'MonitoredKeywordCreationError';
  }
}

export const createMonitoredKeyword = async ({ keyword, guildId, webhookUrl }: CreateMonitoredKeywordAPIRequest) => {
  if (!isValidUrl(webhookUrl)) {
    throw new MonitoredKeywordCreationError(400, 'INVALID_WEBHOOK_URL');
  }

  await db.prepare();
  const monitoredKeywordsRepository = db.getRepository(MonitoredKeyword);

  const count = await monitoredKeywordsRepository.count({ keyword, guildId });
  if (count > 0) {
    throw new MonitoredKeywordCreationError(400, 'KEYWORD_ALREADY_EXISTS');
  }

  const monitoredKeyword = new MonitoredKeyword();
  monitoredKeyword.keyword = keyword;
  monitoredKeyword.guildId = guildId;
  monitoredKeyword.webhookUrl = webhookUrl;

  await monitoredKeywordsRepository.insert(monitoredKeyword);
};

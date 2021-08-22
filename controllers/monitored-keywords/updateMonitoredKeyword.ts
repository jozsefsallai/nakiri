import db from '@/services/db';

import { MonitoredKeyword } from '@/db/models/keywords/MonitoredKeyword';
import { APIError } from '@/lib/errors';
import { UpdateMonitoredKeywordAPIRequest } from '@/services/apis/monitored-keywords/MonitoredKeywordsAPIService';

import { isValidUrl } from '@/lib/commonValidators';

import { Session } from 'next-auth';
import { getUser } from '../users/getUser';
import { User } from '@/lib/User';

import { fetchGuilds } from '../guilds/fetchGuilds';

export class MonitoredKeywordUpdateError extends APIError {
  constructor(statusCode: number, code: string) {
    super(statusCode, code);
    this.name = 'MonitoredKeywordUpdateError';
  }
}

export const updateMonitoredKeyword = async (session: Session, id: string, { keyword, guildId, webhookUrl }: UpdateMonitoredKeywordAPIRequest) => {
  await db.prepare();
  const monitoredKeywordRepository = db.getRepository(MonitoredKeyword);

  const loggedInUser = await getUser(session);
  if (!loggedInUser) {
    throw new MonitoredKeywordUpdateError(401, 'UNAUTHORIZED');
  }

  const user = new User(loggedInUser);
  if (!user.canManageGuildMonitoredKeywords()) {
    throw new MonitoredKeywordUpdateError(403, 'CANNOT_MANAGE_GUILD_MONITORED_KEYWORDS');
  }

  const userGuilds = await fetchGuilds(session);
  const guild = userGuilds.find(guild => guild.id === guildId);

  if (!guild) {
    throw new MonitoredKeywordUpdateError(404, 'CANNOT_UPDATE_ENTRY_FROM_THIS_GUILD');
  }

  const entry = await monitoredKeywordRepository.findOne({ id });
  if (!entry) {
    throw new MonitoredKeywordUpdateError(404, 'ENTRY_NOT_FOUND');
  }

  if (!isValidUrl(webhookUrl)) {
    throw new MonitoredKeywordUpdateError(400, 'INVALID_WEBHOOK_URL');
  }

  if (keyword) {
    entry.keyword = keyword;
  }

  if (webhookUrl) {
    entry.webhookUrl = webhookUrl;
  }

  await monitoredKeywordRepository.save(entry);

  return entry;
};

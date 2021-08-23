import db from '@/services/db';

import { MonitoredKeyword } from '@/db/models/keywords/MonitoredKeyword';
import { APIError } from '@/lib/errors';

import { Session } from 'next-auth';
import { getUser } from '../users/getUser';
import { User } from '@/lib/User';

import { fetchGuilds } from '../guilds/fetchGuilds';

export class MonitoredKeywordDeletionError extends APIError {
  constructor(statusCode: number, code: string) {
    super(statusCode, code);
    this.name = 'MonitoredKeywordDeletionError';
  }
}

export const deleteMonitoredKeyword = async (session: Session, id: string) => {
  await db.prepare();
  const monitoredKeywordRepository = db.getRepository(MonitoredKeyword);

  const loggedInUser = await getUser(session);
  if (!loggedInUser) {
    throw new MonitoredKeywordDeletionError(401, 'UNAUTHORIZED');
  }

  const user = new User(loggedInUser);
  if (!user.canManageGuildMonitoredKeywords()) {
    throw new MonitoredKeywordDeletionError(403, 'CANNOT_MANAGE_GUILD_MONITORED_KEYWORDS');
  }

  const entry = await monitoredKeywordRepository.findOne({ id });
  if (!entry) {
    throw new MonitoredKeywordDeletionError(404, 'ENTRY_NOT_FOUND');
  }

  const userGuilds = await fetchGuilds(session);
  const guild = userGuilds.find(guild => guild.id === entry.guildId);

  if (!guild) {
    throw new MonitoredKeywordDeletionError(404, 'CANNOT_DELETE_ENTRY_FROM_THIS_GUILD');
  }

  await monitoredKeywordRepository.delete({ id });
};

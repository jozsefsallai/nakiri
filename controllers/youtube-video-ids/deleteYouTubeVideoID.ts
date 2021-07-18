import db from '@/services/db';
import { YouTubeVideoID } from '@/db/models/blacklists/YouTubeVideoID';
import { Session } from 'next-auth';
import { APIError } from '@/lib/errors';
import { User } from '@/lib/User';
import { getUser } from '../users/getUser';
import { fetchGuilds } from '../guilds/fetchGuilds';

export class YouTubeVideoIDDeletionError extends APIError {
  constructor(statusCode: number, code: string) {
    super(statusCode, code);
    this.name = 'YouTubeVideoIDDeletionError';
  }
}

export const deleteYouTubeVideoID = async (session: Session, id: string) => {
  await db.prepare();
  const youTubeVideoIDRepository = db.getRepository(YouTubeVideoID);

  const entry = await youTubeVideoIDRepository.findOne({ id });
  if (!entry) {
    throw new YouTubeVideoIDDeletionError(404, 'ENTRY_NOT_FOUND');
  }

  const loggedInUser = await getUser(session);
  if (!loggedInUser) {
    throw new YouTubeVideoIDDeletionError(401, 'UNAUTHORIZED');
  }

  const user = new User(loggedInUser);

  if (entry.guildId) {
    if (!user.canManageOwnGuildBlacklists()) {
      throw new YouTubeVideoIDDeletionError(403, 'CANNOT_MANAGE_OWN_BLACKLISTS');
    }

    const userGuilds = await fetchGuilds(session);
    const guild = userGuilds.find(g => g.id === entry.guildId);

    if (!guild) {
      throw new YouTubeVideoIDDeletionError(403, 'CANNOT_DELETE_ENTRY_FROM_THIS_GUILD');
    }
  }

  if (!entry.guildId && !user.canManageGlobalBlacklists()) {
    throw new YouTubeVideoIDDeletionError(403, 'CANNOT_MANAGE_GLOBAL_BLACKLISTS');
  }

  await youTubeVideoIDRepository.delete({ id });
};

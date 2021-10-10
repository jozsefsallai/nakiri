import db from '@/services/db';
import { YouTubeChannelID } from '@/db/models/blacklists/YouTubeChannelID';
import { Session } from 'next-auth';
import { APIError } from '@/lib/errors';
import { User } from '@/lib/User';
import { getUser } from '../users/getUser';
import { fetchGuilds } from '../guilds/fetchGuilds';

export class YouTubeChannelIDDeletionError extends APIError {
  constructor(statusCode: number, code: string) {
    super(statusCode, code);
    this.name = 'YouTubeChannelIDDeletionError';
  }
}

export const deleteYouTubeChannelID = async (session: Session, id: string) => {
  await db.prepare();
  const youTubeChannelIDRepository = db.getRepository(YouTubeChannelID);

  const entry = await youTubeChannelIDRepository.findOne({ id });
  if (!entry) {
    throw new YouTubeChannelIDDeletionError(404, 'ENTRY_NOT_FOUND');
  }

  const loggedInUser = await getUser(session);
  if (!loggedInUser) {
    throw new YouTubeChannelIDDeletionError(401, 'UNAUTHORIZED');
  }

  const user = new User(loggedInUser);

  if (entry.guildId) {
    if (!user.canManageOwnGuildBlacklists()) {
      throw new YouTubeChannelIDDeletionError(
        403,
        'CANNOT_MANAGE_OWN_BLACKLISTS',
      );
    }

    const userGuilds = await fetchGuilds(session);
    const guild = userGuilds.find((g) => g.id === entry.guildId);

    if (!guild) {
      throw new YouTubeChannelIDDeletionError(
        403,
        'CANNOT_DELETE_ENTRY_FROM_THIS_GUILD',
      );
    }
  }

  if (!entry.guildId && !user.canManageGlobalBlacklists()) {
    throw new YouTubeChannelIDDeletionError(
      403,
      'CANNOT_MANAGE_GLOBAL_BLACKLISTS',
    );
  }

  await youTubeChannelIDRepository.delete({ id });
};

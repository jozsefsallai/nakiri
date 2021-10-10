import db from '@/services/db';
import { LinkPattern } from '@/db/models/blacklists/LinkPattern';
import { Session } from 'next-auth';
import { APIError } from '@/lib/errors';
import { User } from '@/lib/User';
import { getUser } from '../users/getUser';
import { fetchGuilds } from '../guilds/fetchGuilds';

export class LinkPatternDeletionError extends APIError {
  constructor(statusCode: number, code: string) {
    super(statusCode, code);
    this.name = 'LinkPatternDeletionError';
  }
}

export const deleteLinkPattern = async (session: Session, id: string) => {
  await db.prepare();
  const linkPatternRepository = db.getRepository(LinkPattern);

  const entry = await linkPatternRepository.findOne({ id });
  if (!entry) {
    throw new LinkPatternDeletionError(404, 'ENTRY_NOT_FOUND');
  }

  const loggedInUser = await getUser(session);
  if (!loggedInUser) {
    throw new LinkPatternDeletionError(401, 'UNAUTHORIZED');
  }

  const user = new User(loggedInUser);

  if (entry.guildId) {
    if (!user.canManageOwnGuildBlacklists()) {
      throw new LinkPatternDeletionError(403, 'CANNOT_MANAGE_OWN_BLACKLISTS');
    }

    const userGuilds = await fetchGuilds(session);
    const guild = userGuilds.find((g) => g.id === entry.guildId);

    if (!guild) {
      throw new LinkPatternDeletionError(
        403,
        'CANNOT_DELETE_ENTRY_FROM_THIS_GUILD',
      );
    }
  }

  if (!entry.guildId && !user.canManageGlobalBlacklists()) {
    throw new LinkPatternDeletionError(403, 'CANNOT_MANAGE_GLOBAL_BLACKLISTS');
  }

  await linkPatternRepository.delete({ id });
};

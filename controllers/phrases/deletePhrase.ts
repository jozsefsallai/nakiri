import db from '@/services/db';
import { Phrase } from '@/db/models/blacklists/Phrase';
import { Session } from 'next-auth';
import { APIError } from '@/lib/errors';
import { User } from '@/lib/User';
import { getUser } from '../users/getUser';
import { fetchGuilds } from '../guilds/fetchGuilds';

export class PhraseDeletionError extends APIError {
  constructor(statusCode: number, code: string) {
    super(statusCode, code);
    this.name = 'PhraseDeletionError';
  }
}

export const deletePhrase = async (session: Session, id: string) => {
  await db.prepare();
  const phraseRepository = db.getRepository(Phrase);

  const entry = await phraseRepository.findOne({ id });
  if (!entry) {
    throw new PhraseDeletionError(404, 'ENTRY_NOT_FOUND');
  }

  const loggedInUser = await getUser(session);
  if (!loggedInUser) {
    throw new PhraseDeletionError(401, 'UNAUTHORIZED');
  }

  const user = new User(loggedInUser);

  if (entry.guildId) {
    if (!user.canManageOwnGuildBlacklists()) {
      throw new PhraseDeletionError(403, 'CANNOT_MANAGE_OWN_BLACKLISTS');
    }

    const userGuilds = await fetchGuilds(session);
    const guild = userGuilds.find((g) => g.id === entry.guildId);

    if (!guild) {
      throw new PhraseDeletionError(403, 'CANNOT_DELETE_ENTRY_FROM_THIS_GUILD');
    }
  }

  if (!entry.guildId && !user.canManageGlobalBlacklists()) {
    throw new PhraseDeletionError(403, 'CANNOT_MANAGE_GLOBAL_BLACKLISTS');
  }

  await phraseRepository.delete({ id });
};

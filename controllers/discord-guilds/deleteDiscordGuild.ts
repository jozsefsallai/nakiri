import db from '@/services/db';
import { DiscordGuild } from '@/db/models/blacklists/DiscordGuild';
import { Session } from 'next-auth';
import { APIError } from '@/lib/errors';
import { User } from '@/lib/User';
import { getUser } from '../users/getUser';
import { fetchGuilds } from '../guilds/fetchGuilds';

export class DiscordGuildDeletionError extends APIError {
  constructor(statusCode: number, code: string) {
    super(statusCode, code);
    this.name = 'DiscordGuildDeletionError';
  }
}

export const deleteDiscordGuild = async (session: Session, id: string) => {
  await db.prepare();
  const discordGuildRepository = db.getRepository(DiscordGuild);

  const entry = await discordGuildRepository.findOne({ id });
  if (!entry) {
    throw new DiscordGuildDeletionError(404, 'ENTRY_NOT_FOUND');
  }

  const loggedInUser = await getUser(session);
  if (!loggedInUser) {
    throw new DiscordGuildDeletionError(401, 'UNAUTHORIZED');
  }

  const user = new User(loggedInUser);

  if (entry.guildId) {
    if (!user.canManageOwnGuildBlacklists()) {
      throw new DiscordGuildDeletionError(403, 'CANNOT_MANAGE_OWN_BLACKLISTS');
    }

    const userGuilds = await fetchGuilds(session);
    const guild = userGuilds.find((g) => g.id === entry.guildId);

    if (!guild) {
      throw new DiscordGuildDeletionError(
        403,
        'CANNOT_DELETE_ENTRY_FROM_THIS_GUILD',
      );
    }
  }

  if (!entry.guildId && !user.canManageGlobalBlacklists()) {
    throw new DiscordGuildDeletionError(403, 'CANNOT_MANAGE_GLOBAL_BLACKLISTS');
  }

  await discordGuildRepository.delete({ id });
};

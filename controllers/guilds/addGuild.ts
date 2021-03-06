import { AuthorizedGuild } from '@/db/models/auth/AuthorizedGuild';
import { APIError } from '@/lib/errors';
import db from '@/services/db';
import { Session } from 'next-auth';
import { fetchGuilds } from './fetchGuilds';

export class AddGuildError extends APIError {
  constructor(statusCode: number, code: string) {
    super(statusCode, code);
    this.name = 'AddGuildError';
  }
}

export const addGuild = async (
  session: Session,
  guildId: string,
): Promise<void> => {
  const userGuilds = await fetchGuilds(session, true);
  const targetGuild = userGuilds.find((guild) => guild.id === guildId);

  if (!targetGuild) {
    throw new AddGuildError(401, 'CANNOT_MANAGE_GUILD');
  }

  await db.prepare();
  const guildRepository = db.getRepository(AuthorizedGuild);

  const count = await guildRepository.count({ guildId });
  if (count > 0) {
    throw new AddGuildError(400, 'GUILD_ALREADY_ADDED');
  }

  const entry = new AuthorizedGuild();
  entry.guildId = guildId;
  await guildRepository.insert(entry);
};

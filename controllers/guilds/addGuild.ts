import { Key } from '@/db/models/auth/Key';
import { APIError } from '@/lib/errors';
import db from '@/services/db';
import { Session } from 'next-auth';
import { fetchGuilds } from './fetchGuilds';
import { v4 as uuid } from 'uuid';

export class AddGuildError extends APIError {
  constructor(statusCode: number, code: string) {
    super(statusCode, code);
    this.name = 'AddGuildError';
  }
}

export const addGuild = async (session: Session, guildId: string): Promise<string> => {
  const userGuilds = await fetchGuilds(session, true);
  const targetGuild = userGuilds.find(guild => guild.id === guildId);

  if (!targetGuild) {
    throw new AddGuildError(401, 'CANNOT_MANAGE_GUILD');
  }

  await db.prepare();
  const keyRepository = db.getRepository(Key);

  const count = await keyRepository.count({ guildId });
  if (count > 0) {
    throw new AddGuildError(400, 'GUILD_ALREADY_ADDED');
  }

  let key = '';

  do {
    key = uuid();
  } while((await keyRepository.count({ key })) !== 0);

  const entry = new Key();
  entry.key = key;
  entry.guildId = guildId;
  await keyRepository.insert(entry);

  return key;
};

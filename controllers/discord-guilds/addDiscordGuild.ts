import db from '@/services/db';
import { FindConditions, IsNull } from 'typeorm';

import { DiscordGuild } from '@/db/models/blacklists/DiscordGuild';
import { APIError } from '@/lib/errors';

export class DiscordGuildCreationError extends APIError {
  constructor(statusCode: number, code: string) {
    super(statusCode, code);
    this.name = 'DiscordGuildCreationError';
  }
}

export const addDiscordGuild = async (blacklistedId: string, name?: string, guildId?: string) => {
  await db.prepare();
  const discordGuildsRepository = db.getRepository(DiscordGuild);

  const where: FindConditions<DiscordGuild>[] = [
    { blacklistedId, guildId: IsNull() }
  ];

  if (guildId) {
    where.push({ blacklistedId, guildId });
  }

  const count = await discordGuildsRepository.count({ where });

  if (count > 0) {
    throw new DiscordGuildCreationError(400, 'ID_ALREADY_EXISTS');
  }

  const entry = new DiscordGuild();
  entry.blacklistedId = blacklistedId;

  if (name) {
    entry.name = name;
  }

  if (guildId) {
    entry.guildId = guildId;
  }

  await discordGuildsRepository.insert(entry);
};

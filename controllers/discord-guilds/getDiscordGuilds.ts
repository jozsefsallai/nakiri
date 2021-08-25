import db from '@/services/db';
import { DiscordGuild } from '@/db/models/blacklists/DiscordGuild';
import { FindConditions, IsNull } from 'typeorm';

export const getDiscordGuilds = async (guildId?: string, strict?: boolean, skip?: number, take?: number) => {
  await db.prepare();
  const discordGuildRepository = db.getRepository(DiscordGuild);

  const where: FindConditions<DiscordGuild>[] = [];

  if (!strict) {
    where.push({ guildId: IsNull() }); // global blacklist (if strict mode is disabled)
  }

  if (guildId) {
    where.push({ guildId }); // guild-specific blacklist
  }

  const totalCount = await discordGuildRepository.count({ where });
  const discordGuilds = await discordGuildRepository.find({ where, skip, take, order: { updatedAt: 'DESC' } });

  return { discordGuilds, totalCount };
};

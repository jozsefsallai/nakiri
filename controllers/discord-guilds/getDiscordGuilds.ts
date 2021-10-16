import db from '@/services/db';
import { DiscordGuild } from '@/db/models/blacklists/DiscordGuild';
import { FindConditions, IsNull } from 'typeorm';

import { IBlacklistGetterParams } from '@/typings/IBlacklistGetterParams';
import buildFindConditions from '@/lib/buildFindConditions';

export const getDiscordGuilds = async ({
  groupId,
  guildId,
  strict,
  skip,
  take,
}: IBlacklistGetterParams) => {
  await db.prepare();
  const discordGuildRepository = db.getRepository(DiscordGuild);

  const where = buildFindConditions<DiscordGuild>(groupId, guildId, strict);

  const totalCount = await discordGuildRepository.count({
    where,
    relations: ['group'],
  });
  const discordGuilds = await discordGuildRepository.find({
    where,
    skip,
    take,
    order: { createdAt: 'DESC' },
    relations: ['group'],
  });

  return { discordGuilds, totalCount };
};

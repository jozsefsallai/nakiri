import db from '@/services/db';
import { DiscordGuild } from '@/db/models/blacklists/DiscordGuild';
import { FindConditions, LessThanOrEqual } from 'typeorm';
import { decodeSnowflake, encodeSnowflake } from '@/lib/snowflake';

import { IBlacklistGetterParams } from '@/typings/IBlacklistGetterParams';
import buildFindConditions from '@/lib/buildFindConditions';

export const getDiscordGuilds = async ({
  groupId,
  guildId,
  strict,
  skip,
  take,
  cursor,
}: IBlacklistGetterParams) => {
  await db.prepare();
  const discordGuildRepository = db.getRepository(DiscordGuild);

  const additionalConditions: FindConditions<DiscordGuild> | undefined =
    typeof cursor !== 'undefined' &&
      cursor !== '0' && {
        id: LessThanOrEqual(decodeSnowflake(cursor)),
      };

  const where = buildFindConditions<DiscordGuild>(
    groupId,
    guildId,
    strict,
    additionalConditions,
  );

  const totalCount = await discordGuildRepository.count({
    where,
    relations: ['group'],
  });

  const discordGuilds = await discordGuildRepository.find({
    where,
    skip,
    take: take + Number(!!cursor),
    order: { createdAt: 'DESC' },
    relations: ['group'],
  });

  const nextCursor: string | undefined =
    (cursor &&
      discordGuilds.length === take + 1 &&
      encodeSnowflake(discordGuilds.pop().id)) ||
    null;

  return { discordGuilds, totalCount, nextCursor };
};

import { IGuild } from '@/controllers/guilds/IGuild';
import { IAuthorizedGuild } from '@/db/models/auth/AuthorizedGuild';

export const mapGuildMetadata = (
  guilds: IGuild[],
  rawGuild: IAuthorizedGuild,
): IGuild | null => {
  const targetGuild = guilds.find((g) => g.id === rawGuild.guildId);
  return targetGuild || null;
};

export const bulkMapGuildMetadata = (
  guilds: IGuild[],
  rawGuilds: IAuthorizedGuild[],
): IGuild[] => {
  const guildsWithMetadata = rawGuilds.map((g) => mapGuildMetadata(guilds, g));
  return guildsWithMetadata.filter((g) => g !== null);
};

import { AuthorizedGuild } from '@/db/models/auth/AuthorizedGuild';
import { Group, IGroup } from '@/db/models/groups/Group';
import { GroupMember } from '@/db/models/groups/GroupMember';
import { APIError } from '@/lib/errors';
import db from '@/services/db';
import { Session } from 'next-auth';
import { fetchGuilds } from '../guilds/fetchGuilds';
import { getUser } from '../users/getUser';

export class UpdateGroupError extends APIError {
  constructor(statusCode: number, code: string) {
    super(statusCode, code);
    this.name = 'UpdateGroupError';
  }
}

export const addGuildToGroup = async (session: Session, id: string, guildId: string): Promise<IGroup> => {
  await db.prepare();

  const groupMembersRepository = db.getRepository(GroupMember);
  const groupsRepository = db.getRepository(Group);
  const authorizedGuildsRepository = db.getRepository(AuthorizedGuild);

  const user = await getUser(session);

  const membership = await groupMembersRepository.findOne({
    where: {
      group: {
        id,
      },
      user
    },
    relations: ['group', 'user', 'group.guilds']
  });

  if (!membership) {
    throw new UpdateGroupError(404, 'GROUP_NOT_FOUND');
  }

  if (!membership.canManageGroupGuilds()) {
    throw new UpdateGroupError(403, 'CANNOT_MANAGE_GUILDS_IN_THIS_GROUP');
  }

  const guilds = await fetchGuilds(session, true)
    .then(guilds => guilds.filter(guild => guild.id === guildId));

  if (guilds.length === 0) {
    throw new UpdateGroupError(403, 'CANNOT_MANAGE_GUILD');
  }

  const guild = await authorizedGuildsRepository.findOne({ guildId });
  if (!guild) {
    throw new UpdateGroupError(404, 'GUILD_NOT_AUTHORIZED');
  }

  if (membership.group.guilds.find(guild => guild.guildId === guildId)) {
    throw new UpdateGroupError(400, 'GUILD_ALREADY_IN_GROUP');
  }

  membership.group.guilds.push(guild);
  await groupsRepository.save(membership.group);

  return membership.group.toJSON();
};

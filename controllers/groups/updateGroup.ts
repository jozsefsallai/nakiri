import { AuthorizedGuild } from '@/db/models/auth/AuthorizedGuild';
import { AuthorizedUser } from '@/db/models/auth/AuthorizedUser';
import { Group, IGroup } from '@/db/models/groups/Group';
import { GroupMember } from '@/db/models/groups/GroupMember';
import { APIError } from '@/lib/errors';
import { GroupMemberPermissions } from '@/lib/GroupMemberPermissions';
import db from '@/services/db';
import { Session } from 'next-auth';
import { fetchGuilds } from '../guilds/fetchGuilds';
import { getUser } from '../users/getUser';

export class UpdateGroupError extends APIError {
  data?: any;

  constructor(statusCode: number, code: string, data?: any) {
    super(statusCode, code);
    this.name = 'UpdateGroupError';
    this.data = data;
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

export const addUserToGroup = async (session: Session, groupId: string, discordId: string, permissionsList: number[]): Promise<IGroup> => {
  await db.prepare();

  const groupMembersRepository = db.getRepository(GroupMember);
  const groupsRepository = db.getRepository(Group);
  const authorizedUsersRepository = db.getRepository(AuthorizedUser);

  const user = await getUser(session);

  const membership = await groupMembersRepository.findOne({
    where: {
      group: {
        id: groupId,
      },
      user
    },
    relations: ['group', 'user', 'group.members', 'group.members.user']
  });

  if (!membership) {
    throw new UpdateGroupError(404, 'GROUP_NOT_FOUND');
  }

  if (!membership.canManageGroupMembers()) {
    throw new UpdateGroupError(403, 'CANNOT_MANAGE_MEMBERS_IN_THIS_GROUP');
  }

  const targetUser = await authorizedUsersRepository.findOne({ discordId });
  if (!targetUser) {
    throw new UpdateGroupError(404, 'USER_NOT_AUTHORIZED');
  }

  const targetMembership = await groupMembersRepository.count({
    where: {
      group: membership.group,
      user: targetUser
    },
    relations: ['group', 'user', 'group.members']
  });

  if (targetMembership > 0) {
    throw new UpdateGroupError(400, 'USER_ALREADY_IN_GROUP');
  }

  const forbiddenPermissions = [];
  permissionsList.forEach(permission => {
    if (!(permission in GroupMemberPermissions)) {
      forbiddenPermissions.push(permission);
    }
  });

  if (forbiddenPermissions.length > 0) {
    throw new UpdateGroupError(400, 'FORBIDDEN_PERMISSIONS', {
      forbiddenPermissions
    });
  }

  const permissions = permissionsList.reduce((a, b) => a + b);

  const newMembership = new GroupMember();
  newMembership.group = membership.group;
  newMembership.user = targetUser;
  newMembership.permissions = permissions;

  await groupMembersRepository.insert(newMembership);

  membership.group.members.push(newMembership);
  await groupsRepository.save(membership.group);

  return membership.group.toJSON();
};

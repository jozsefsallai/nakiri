import db from '@/services/db';

import { IGroup } from '@/db/models/groups/Group';
import { GroupMember } from '@/db/models/groups/GroupMember';
import { Session } from 'next-auth';

import { getUser } from '@/controllers/users/getUser';
import { APIError } from '@/lib/errors';
import { fetchGuilds } from '../guilds/fetchGuilds';

export class GetGroupError extends APIError {
  constructor(statusCode: number, code: string) {
    super(statusCode, code);
    this.name = 'GetGroupError';
  }
}

export const getGroups = async (session: Session): Promise<IGroup[]> => {
  await db.prepare();

  const groupMembersRepository = db.getRepository(GroupMember);
  const user = await getUser(session);

  const memberships = await groupMembersRepository.find({
    where: {
      user,
    },
    relations: ['user', 'group', 'group.creator', 'group.guilds'],
  });

  const groups = memberships
    .map((membership) => {
      const group = Object.assign({}, membership.group) as IGroup;
      group.myPermissions = membership.permissions;
      group.isCreator = group.creator.id === user.id;

      if (!membership.canSeeApiKey()) {
        delete group.apiKey;
      }

      return group as IGroup;
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  return groups;
};

export const getGroup = async (
  id: string,
  session: Session,
): Promise<IGroup> => {
  const guilds = await fetchGuilds(session, true).then((guilds) =>
    guilds.map((guild) => guild.id),
  );

  await db.prepare();

  const groupMembersRepository = db.getRepository(GroupMember);
  const user = await getUser(session);

  const membership = await groupMembersRepository.findOne({
    where: {
      group: {
        id,
      },
      user,
    },
    relations: [
      'user',
      'group',
      'group.creator',
      'group.guilds',
      'group.members',
      'group.members.user',
    ],
  });

  if (!membership) {
    throw new GetGroupError(404, 'GROUP_NOT_FOUND');
  }

  const group = Object.assign({}, membership.group) as IGroup;

  group.myPermissions = membership.permissions;
  group.isCreator = group.creator.id === user.id;

  if (!membership.canSeeApiKey()) {
    delete group.apiKey;
  }

  group.guilds = group.guilds.filter((guild) => guilds.includes(guild.guildId));

  return group;
};

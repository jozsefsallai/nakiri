import db from '@/services/db';
import { Group } from '@/db/models/groups/Group';
import { GroupMember } from '@/db/models/groups/GroupMember';
import { AuthorizedUser } from '@/db/models/auth/AuthorizedUser';
import { ALL_PERMISSIONS } from '@/lib/GroupMemberPermissions';

import { CreateGroupAPIRequest } from '@/services/apis/groups/GroupsAPIService';

import { APIError } from '@/lib/errors';
import { Session } from 'next-auth';

import { v4 as uuid } from 'uuid';

export class GroupCreationError extends APIError {
  constructor(statusCode: number, code: string) {
    super(statusCode, code);
    this.name = 'GroupCreationError';
  }
}

export const createGroup = async (session: Session, { name, description }: CreateGroupAPIRequest) => {
  if (!name?.length) {
    throw new GroupCreationError(400, 'GROUP_NAME_NOT_PROVIDED');
  }

  await db.prepare();
  const groupsRepository = db.getRepository(Group);
  const authorizedUsersRepository = db.getRepository(AuthorizedUser);
  const groupMembersRepository = db.getRepository(GroupMember);

  const authorizedUser = await authorizedUsersRepository.findOne({ discordId: session.user.id });

  const group = new Group();
  group.name = name;
  group.description = description;
  group.creator = authorizedUser;

  let apiKey = '';

  do {
    apiKey = uuid();
  } while (await groupsRepository.count({ apiKey }) !== 0);

  group.apiKey = apiKey;

  const finalGroup = await groupsRepository.save(group);

  const member = new GroupMember();
  member.user = authorizedUser;
  member.permissions = ALL_PERMISSIONS;
  member.group = finalGroup;

  await groupMembersRepository.save(member);
};

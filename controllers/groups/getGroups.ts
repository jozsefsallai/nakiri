import db from '@/services/db';

import { IGroup } from '@/db/models/groups/Group';
import { GroupMember } from '@/db/models/groups/GroupMember';
import { Session } from 'next-auth';

import { getUser } from '@/controllers/users/getUser';

export const getGroups = async (session: Session): Promise<IGroup[]> => {
  await db.prepare();

  const groupMembersRepository = db.getRepository(GroupMember);
  const user = await getUser(session);

  const memberships = await groupMembersRepository.find({
    where: {
      user
    },
    relations: ['user', 'group', 'group.creator'],
  });

  const groups = memberships.map(membership => {
    const group = Object.assign({}, membership.group) as IGroup;
    group.myPermissions = membership.permissions;
    group.isCreator = group.creator.id === user.id;

    if (!membership.canSeeApiKey()) {
      delete group.apiKey;
    }

    return group as IGroup;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return groups;
};

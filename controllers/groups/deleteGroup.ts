import { Group } from '@/db/models/groups/Group';
import { APIError } from '@/lib/errors';
import db from '@/services/db';
import { Session } from 'next-auth';
import { getUser } from '../users/getUser';

export class DeleteGroupError extends APIError {
  constructor(statusCode: number, code: string) {
    super(statusCode, code);
    this.name = 'DeleteGroupError';
  }
}

export const deleteGroup = async (session: Session, id: string) => {
  await db.prepare();

  const groupsRepository = db.getRepository(Group);
  const user = await getUser(session);

  const group = await groupsRepository.findOne({
    where: {
      id,
      creator: user,
    },
    relations: ['creator'],
  });

  if (!group) {
    throw new DeleteGroupError(404, 'GROUP_NOT_FOUND');
  }

  await groupsRepository.delete(id);
};

import { Session } from 'next-auth';

import db from '@/services/db';
import { AuthorizedUser } from '@/db/models/auth/AuthorizedUser';
import { IUser } from '@/lib/User';

export const getUser = async (session: Session): Promise<IUser | null> => {
  await db.prepare();
  const authorizedUserRepository = db.getRepository(AuthorizedUser);

  const authorizedUser = await authorizedUserRepository.findOne({
    discordId: session.user.id,
  });
  if (!authorizedUser) {
    return null;
  }

  return {
    ...session.user,
    ...authorizedUser,
  };
};

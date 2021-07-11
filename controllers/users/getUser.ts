import db from '@/services/db';
import { AuthorizedUser, IUser } from '@/db/models/auth/AuthorizedUser';
import { Session } from 'next-auth';

export const getUser = async (session: Session): Promise<IUser | null> => {
  await db.prepare();
  const authorizedUserRepository = db.getRepository(AuthorizedUser);

  const authorizedUser = await authorizedUserRepository.findOne({ discordId: session.user.id });
  if (!authorizedUser) {
    return null;
  }

  return {
    ...session.user,
    ...authorizedUser
  };
};

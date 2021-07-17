import { AuthorizedUser } from '@/db/models/auth/AuthorizedUser';
import db from '@/services/db';

export const getUsers = async (): Promise<AuthorizedUser[]> => {
  await db.prepare();
  const authorizedUserRepository = db.getRepository(AuthorizedUser);

  return authorizedUserRepository.find({ order: { createdAt: 'DESC' } });
};

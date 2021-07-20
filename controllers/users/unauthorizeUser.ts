import db from '@/services/db';
import { AuthorizedUser } from '@/db/models/auth/AuthorizedUser';
import { APIError } from '@/lib/errors';

export class UnauthorizeUserError extends APIError {
  constructor(statusCode: number, code: string) {
    super(statusCode, code);
    this.name = 'UnauthorizeUserError';
  }
}

export const unauthorizeUser = async (id: string) => {
  await db.prepare();
  const authorizedUserRepository = db.getRepository(AuthorizedUser);

  const user = await authorizedUserRepository.findOne({ id });
  if (!user) {
    throw new UnauthorizeUserError(404, 'USER_NOT_FOUND');
  }

  await authorizedUserRepository.delete({ id });
};

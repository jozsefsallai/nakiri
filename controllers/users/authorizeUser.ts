import db from '@/services/db';
import { AuthorizedUser } from '@/db/models/auth/AuthorizedUser';
import { APIError } from '@/lib/errors';
import { UserPermissions } from '@/lib/UserPermissions';

export class AuthorizedUserCreationError extends APIError {
  data?: any;

  constructor(statusCode: number, code: string, data?: any) {
    super(statusCode, code);
    this.name = 'AuthorizedUserCreationError';
    this.data = data;
  }
}

export const authorizeUser = async (discordId: string, permissionsList: number[]) => {
  await db.prepare();
  const authorizedUserRepository = db.getRepository(AuthorizedUser);

  const count = await authorizedUserRepository.count({ discordId });
  if (count > 0) {
    throw new AuthorizedUserCreationError(400, 'USER_ALREADY_AUTHORIZED');
  }

  const forbiddenPermissions = [];
  permissionsList.forEach(permission => {
    if (!(permission in UserPermissions)) {
      forbiddenPermissions.push(permission);
    }
  });

  if (forbiddenPermissions.length > 0) {
    throw new AuthorizedUserCreationError(400, 'FORBIDDEN_PERMISSIONS', {
      forbiddenPermissions
    });
  }

  const permissions = permissionsList.reduce((a, b) => a + b);

  const entry = new AuthorizedUser();
  entry.discordId = discordId;
  entry.permissions = permissions;

  await authorizedUserRepository.insert(entry);
};

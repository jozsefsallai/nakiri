import db from '@/services/db';
import {
  AuthorizedUser,
  IAuthorizedUser,
} from '@/db/models/auth/AuthorizedUser';
import { UserPermissions } from '@/lib/UserPermissions';
import { APIError } from '@/lib/errors';
import { Session } from 'next-auth';
import { UpdateUserAPIRequest } from '@/services/apis/users/UsersAPIService';

export class UserUpdateError extends APIError {
  data?: any;

  constructor(statusCode: number, code: string, data?: any) {
    super(statusCode, code);
    this.name = 'UserUpdateError';
    this.data = data;
  }
}

export const updateUser = async (
  session: Session,
  attributes: UpdateUserAPIRequest,
): Promise<IAuthorizedUser> => {
  await db.prepare();
  const authorizedUserRepository = db.getRepository(AuthorizedUser);

  const user = await authorizedUserRepository.findOne({
    discordId: session.user.id,
  });

  if (typeof attributes.hideThumbnails !== 'undefined') {
    user.hideThumbnails = attributes.hideThumbnails;
  }

  await authorizedUserRepository.save(user);
  return user;
};

export const updateUserPermissions = async (
  id: string,
  permissionsList: number[],
): Promise<IAuthorizedUser> => {
  await db.prepare();
  const authorizedUserRepository = db.getRepository(AuthorizedUser);

  const user = await authorizedUserRepository.findOne({ id });
  if (!user) {
    throw new UserUpdateError(404, 'USER_NOT_FOUND');
  }

  const forbiddenPermissions = [];
  permissionsList.forEach((permission) => {
    if (!(permission in UserPermissions)) {
      forbiddenPermissions.push(permission);
    }
  });

  if (forbiddenPermissions.length > 0) {
    throw new UserUpdateError(400, 'FORBIDDEN_PERMISSIONS', {
      forbiddenPermissions,
    });
  }

  const permissions = permissionsList.reduce((a, b) => a + b);

  user.permissions = permissions;
  await authorizedUserRepository.save(user);

  return user.toJSON();
};

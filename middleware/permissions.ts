import { NextApiHandler } from 'next';
import { getSession } from 'next-auth/client';

import db from '@/services/db';
import { AuthorizedUser } from '@/db/models/auth/AuthorizedUser';
import { UserPermissions } from '@/lib/UserPermissions';

export const ensureUserHasPermissions = (callback: NextApiHandler, permissions: number[]): NextApiHandler => {
  return async (req, res) => {
    const session = await getSession({ req });

    await db.prepare();
    const authorizedUserRepository = db.getRepository(AuthorizedUser);

    const targetUser = await authorizedUserRepository.findOne({ discordId: session.user.id });
    if (!targetUser) {
      return res.status(401).json({
        ok: false,
        error: 'UNAUTHORIZED'
      });
    }

    const missingPermissions = [];

    permissions.forEach(permission => {
      if (!targetUser.hasPermission(permission)) {
        missingPermissions.push(permissions);
      }
    });

    if (missingPermissions.length > 0) {
      return res.status(401).json({
        ok: false,
        error: 'INSUFFICIENT_PERMISSIONS',
        missingPermissions: missingPermissions
          .map(permission => UserPermissions[permission])
      });
    }

    return callback(req, res);
  };
};

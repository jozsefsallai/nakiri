import { NextApiHandler } from 'next';
import { getSession } from 'next-auth/client';

import db from '@/services/db';
import { AuthorizedUser } from '@/db/models/auth/AuthorizedUser';
import { AuthorizedGuild } from '@/db/models/auth/AuthorizedGuild';
import { UserPermissions } from '@/lib/UserPermissions';

import firstOf from '@/lib/firstOf';

export const ensureUserHasPermissions = (
  callback: NextApiHandler,
  permissions: number[],
): NextApiHandler => {
  return async (req, res) => {
    const session = await getSession({ req });

    await db.prepare();
    const authorizedUserRepository = db.getRepository(AuthorizedUser);

    const targetUser = await authorizedUserRepository.findOne({
      discordId: session.user.id,
    });
    if (!targetUser) {
      return res.status(401).json({
        ok: false,
        error: 'UNAUTHORIZED',
      });
    }

    const missingPermissions = [];

    permissions.forEach((permission) => {
      if (!targetUser.hasPermission(permission)) {
        missingPermissions.push(permissions);
      }
    });

    if (missingPermissions.length > 0) {
      return res.status(401).json({
        ok: false,
        error: 'INSUFFICIENT_PERMISSIONS',
        missingPermissions: missingPermissions.map(
          (permission) => UserPermissions[permission],
        ),
      });
    }

    return callback(req, res);
  };
};

export const ensureHasAccessToGuild = (
  callback: NextApiHandler,
): NextApiHandler => {
  return async (req, res) => {
    const guildId = firstOf(req.query.guild);
    const key = req.headers.authorization;

    if (!guildId || !key) {
      // TODO: for now we'll only do this for API keys. Users can still use the
      // web UI to access endpoints protected by this middleware. Once we
      // implement a better way to cache the guilds a user has access to, we
      // probably want to perform this check for all requests.
      //
      // I trust the users of the app to not misuse these endpoints.
      //
      // tbh I don't know why I'm even doing this at all, the target userbase
      // is trustworthy enough to not abuse the API lmao; still cool to have ig.
      return callback(req, res);
    }

    await db.prepare();
    const guildRepository = db.getRepository(AuthorizedGuild);

    const count = await guildRepository.count({ guildId, key });
    if (count === 0) {
      return res.status(401).json({
        ok: false,
        error: 'ACCESS_TO_GUILD_DENIED',
      });
    }

    return callback(req, res);
  };
};

import { NextApiHandler } from 'next';
import { getSession } from 'next-auth/client';

import db from '@/services/db';
import { AuthorizedUser } from '@/db/models/auth/AuthorizedUser';
import { UserPermissions } from '@/lib/UserPermissions';

import firstOf from '@/lib/firstOf';
import { getUser } from '@/controllers/users/getUser';
import { Group } from '@/db/models/groups/Group';
import { GroupMember } from '@/db/models/groups/GroupMember';
import { fetchGuilds } from '@/controllers/guilds/fetchGuilds';
import { FindConditions } from 'typeorm';

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

export const ensureHasAccessToResource = (
  callback: NextApiHandler,
): NextApiHandler => {
  return async (req, res) => {
    const groupId = firstOf(req.query.group);
    const guildId = firstOf(req.query.guild);

    const key = req.headers.authorization;

    if (!groupId && !key) {
      return callback(req, res);
    }

    const session = await getSession({ req });
    const user = session && (await getUser(session));

    await db.prepare();

    if (user) {
      const membershipsRepository = db.getRepository(GroupMember);
      const membership = await membershipsRepository.findOne({
        where: {
          group: {
            id: groupId,
          },
          user,
        },
        relations: ['group', 'user'],
      });

      if (membership) {
        if (guildId) {
          const userGuilds = await fetchGuilds(session, true);
          const guild = await userGuilds.find((guild) => guild.id === guildId);

          if (guild) {
            return callback(req, res);
          }
        } else {
          return callback(req, res);
        }
      }
    }

    if (key) {
      const groupsRepository = db.getRepository(Group);

      const where: FindConditions<Group> = groupId
        ? { id: groupId, apiKey: key }
        : { apiKey: key };

      const group = await groupsRepository.findOne({
        where,
      });

      if (group) {
        if (!groupId) {
          req.query.group = group.id;
        }

        return callback(req, res);
      }
    }

    return res.status(401).json({
      ok: false,
      error: 'ACCESS_TO_GUILD_DENIED',
    });
  };
};

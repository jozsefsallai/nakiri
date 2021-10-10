import { NextApiHandler } from 'next';
import { getSession } from 'next-auth/client';

import db from '@/services/db';
import { AuthorizedGuild } from '@/db/models/auth/AuthorizedGuild';

export const ensureAuthenticated = (
  callback: NextApiHandler,
  strict: boolean = false,
): NextApiHandler => {
  return async (req, res) => {
    let hasApiKey = false;
    let isLoggedIn = false;

    if (!strict && req.headers.authorization?.length > 0) {
      await db.prepare();

      const guildRepository = db.getRepository(AuthorizedGuild);
      const key = req.headers.authorization!;

      hasApiKey = (await guildRepository.count({ key })) === 1;
    }

    const session = await getSession({ req });
    isLoggedIn = session && !!session.user;

    if (!hasApiKey && !isLoggedIn) {
      return res.status(401).json({
        ok: false,
        error: 'NOT_AUTHENTICATED',
      });
    }

    return callback(req, res);
  };
};

export const ensureAnonymous = (callback: NextApiHandler): NextApiHandler => {
  return async (req, res) => {
    const session = await getSession({ req });

    if (session) {
      return res.status(400).json({
        ok: false,
        error: 'NOT_ANONYMOUS',
      });
    }

    return callback(req, res);
  };
};

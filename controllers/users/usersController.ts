import { NextApiHandler } from 'next';
import { getSession } from 'next-auth/client';
import { authorizeUser } from './authorizeUser';
import { getUser } from './getUser';

export const get: NextApiHandler = async (req, res) => {
  const session = await getSession({ req });
  const user = await getUser(session);

  if (user === null) {
    return res.status(500).json({
      ok: false,
      error: 'USER_IDENTIFICATION_FAILED'
    });
  }

  return res.json({
    ok: true,
    user
  });
};

export const authorize: NextApiHandler = async (req, res) => {
  const discordId: string | undefined = req.body.discordId;
  const permissions: number[] | undefined = req.body.permissions;

  if (typeof discordId === 'undefined') {
    return res.status(400).json({
      ok: false,
      error: 'MISSING_DISCORD_ID'
    });
  }

  if (typeof permissions === 'undefined' || permissions.length === 0) {
    return res.status(400).json({
      ok: false,
      error: 'MISSING_PERMISSIONS'
    });
  }

  try {
    await authorizeUser(discordId, permissions);
    return res.json({ ok: true });
  } catch (err) {
    if (err.name === 'AuthorizedUserCreationError') {
      return res.status(err.statusCode).json({
        ok: false,
        error: err.code,
        ...(err.data && { data: err.data })
      });
    }

    console.error(err);

    return res.status(500).json({
      ok: false,
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
};

import { NextApiHandler } from 'next';
import { getSession } from 'next-auth/client';
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

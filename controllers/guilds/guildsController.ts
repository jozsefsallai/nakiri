import { NextApiHandler } from 'next';
import { getSession } from 'next-auth/client';
import { fetchGuilds } from './fetchGuilds';

export const all: NextApiHandler = async (req, res) => {
  const session = await getSession({ req })

  try {
    const guilds = await fetchGuilds(session, true);
    return res.json({ ok: true, guilds });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      ok: false,
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
};

export const index: NextApiHandler = async (req, res) => {
  const session = await getSession({ req });

  try {
    const guilds = await fetchGuilds(session);
    return res.json({ ok: true, guilds });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      ok: false,
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
};

import { NextApiHandler } from 'next';
import { getSession } from 'next-auth/client';
import { addGuild } from './addGuild';
import { fetchGuilds } from './fetchGuilds';

import { handleError } from '@/lib/errors';
import firstOf from '@/lib/firstOf';

export const all: NextApiHandler = async (req, res) => {
  const session = await getSession({ req });

  try {
    const guilds = await fetchGuilds(session, true, false);
    return res.json({ ok: true, guilds });
  } catch (err) {
    handleError(err);

    return res.status(500).json({
      ok: false,
      error: 'INTERNAL_SERVER_ERROR',
    });
  }
};

export const index: NextApiHandler = async (req, res) => {
  const session = await getSession({ req });
  const skipCache = firstOf(req.query.skipCache) === 'true';

  try {
    const guilds = await fetchGuilds(session, false, !skipCache);
    return res.json({ ok: true, guilds });
  } catch (err) {
    handleError(err);

    return res.status(500).json({
      ok: false,
      error: 'INTERNAL_SERVER_ERROR',
    });
  }
};

export const insert: NextApiHandler = async (req, res) => {
  const session = await getSession({ req });

  const guildId = req.body.guildId?.trim();

  if (typeof guildId === 'undefined' || guildId.length === 0) {
    return res.status(400).json({
      ok: false,
      error: 'GUILD_ID_NOT_PROVIDED',
    });
  }

  try {
    await addGuild(session, guildId);
    return res.json({ ok: true });
  } catch (err) {
    if (err.name === 'AddGuildError') {
      return res.status(err.statusCode).json({
        ok: false,
        error: err.code,
      });
    }

    handleError(err);

    return res.status(500).json({
      ok: false,
      error: 'INTERNAL_SERVER_ERROR',
    });
  }
};

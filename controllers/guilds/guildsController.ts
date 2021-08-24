import { NextApiHandler } from 'next';
import { getSession } from 'next-auth/client';
import { addGuild } from './addGuild';
import { fetchGuilds } from './fetchGuilds';

import { captureException } from '@sentry/nextjs';

export const all: NextApiHandler = async (req, res) => {
  const session = await getSession({ req });

  try {
    const guilds = await fetchGuilds(session, true);
    return res.json({ ok: true, guilds });
  } catch (err) {
    captureException(err);

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
    captureException(err);

    return res.status(500).json({
      ok: false,
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
};

export const insert: NextApiHandler = async (req, res) => {
  const session = await getSession({ req });

  const guildId = req.body.guildId?.trim();

  if (typeof guildId === 'undefined' || guildId.length === 0) {
    return res.status(400).json({
      ok: false,
      error: 'GUILD_ID_NOT_PROVIDED'
    });
  }

  try {
    const key = await addGuild(session, guildId);
    return res.json({ ok: true, key });
  } catch (err) {
    if (err.name === 'AddGuildError') {
      return res.status(err.statusCode).json({
        ok: false,
        error: err.code
      });
    }

    captureException(err);

    return res.status(500).json({
      ok: false,
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
};

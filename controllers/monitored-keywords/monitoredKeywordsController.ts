import { NextApiHandler } from 'next';

import { createMonitoredKeyword } from './createMonitoredKeyword';
import { getMonitoredKeywords } from './getMonitoredKeywords';
import { updateMonitoredKeyword } from './updateMonitoredKeyword';
import { getSession } from 'next-auth/client';
import { deleteMonitoredKeyword } from './deleteMonitoredKeyword';

import firstOf from '@/lib/firstOf';

export const index: NextApiHandler = async (req, res) => {
  const guild = firstOf(req.query.guild);

  const entries = await getMonitoredKeywords(guild);

  return res.json({
    ok: true,
    entries
  });
};

export const create: NextApiHandler = async (req, res) => {
  const keyword: string | undefined = req.body.keyword?.trim();
  const guildId: string | undefined = req.body.guildId?.trim();
  const webhookUrl: string | undefined = req.body.webhookUrl?.trim();

  if (!keyword) {
    return res.status(400).json({
      ok: false,
      error: 'KEYWORD_NOT_PROVIDED'
    });
  }

  if (!guildId) {
    return res.status(400).json({
      ok: false,
      error: 'GUILD_NOT_PROVIDED'
    });
  }

  if (!webhookUrl) {
    return res.status(400).json({
      ok: false,
      error: 'WEBHOOK_URL_NOT_PROVIDED'
    });
  }

  try {
    await createMonitoredKeyword({ keyword, guildId, webhookUrl });
    return res.json({ ok: true });
  } catch (err) {
    if (err.name === 'MonitoredKeywordCreationError') {
      return res.status(err.statusCode).json({
        ok: false,
        error: err.code
      });
    }

    return res.status(500).json({
      ok: false,
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
};

export const update: NextApiHandler = async (req, res) => {
  const id = req.query.id as string;

  const keyword: string | undefined = req.body.keyword?.trim();
  const guildId: string | undefined = req.body.guildId?.trim();
  const webhookUrl: string | undefined = req.body.webhookUrl?.trim();

  const session = await getSession({ req });

  try {
    const entry = await updateMonitoredKeyword(session, id, { keyword, guildId, webhookUrl });
    return res.json({ ok: true, entry });
  } catch (err) {
    if (err.name === 'MonitoredKeywordUpdateError') {
      return res.status(err.statusCode).json({
        ok: false,
        error: err.code
      });
    }

    return res.status(500).json({
      ok: false,
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
};

export const destroy: NextApiHandler = async (req, res) => {
  const id = req.query.id as string;

  const session = await getSession({ req });

  try {
    await deleteMonitoredKeyword(session, id);
    return res.json({ ok: true });
  } catch (err) {
    if (err.name === 'MonitoredKeywordDeletionError') {
      return res.status(err.statusCode).json({
        ok: false,
        error: err.code
      });
    }

    return res.status(500).json({
      ok: false,
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
};

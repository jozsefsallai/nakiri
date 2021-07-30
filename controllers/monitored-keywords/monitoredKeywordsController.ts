import { NextApiHandler } from 'next';

import { createMonitoredKeyword } from './createMonitoredKeyword';
import { getMonitoredKeywords } from './getMonitoredKeywords';

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

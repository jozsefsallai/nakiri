import { NextApiHandler } from 'next';

import { addWhitelistedChannel } from './addWhitelistedChannel';
import { getWhitelistedChannels } from './getWhitelistedChannels';
import { removeWhitelistedChannel } from './removeWhitelistedChannel';

import firstOf from '@/lib/firstOf';

import { handleError } from '@/lib/errors';

export const index: NextApiHandler = async (req, res) => {
  const guild = firstOf(req.query.guild);

  const channels = await getWhitelistedChannels(guild);

  return res.json({
    ok: true,
    channels,
  });
};

export const create: NextApiHandler = async (req, res) => {
  const channelId: string | undefined = req.body.channelId?.trim();
  const guildId: string | undefined = firstOf(req.query.guild);

  if (!channelId) {
    return res.status(400).json({
      ok: false,
      error: 'MISSING_CHANNEL_ID',
    });
  }

  try {
    await addWhitelistedChannel(channelId, guildId);
    return res.json({ ok: true });
  } catch (err) {
    if (err.name === 'AddKeywordWhitelistedChannelError') {
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

export const destroy: NextApiHandler = async (req, res) => {
  const guildId = firstOf(req.query.guild);
  const id = firstOf(req.query.id);

  try {
    await removeWhitelistedChannel(id, guildId);
    return res.json({ ok: true });
  } catch (err) {
    if (err.name === 'RemoveKeywordWhitelistedChannelError') {
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

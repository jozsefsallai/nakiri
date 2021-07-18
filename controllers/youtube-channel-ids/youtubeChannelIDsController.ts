import { NextApiHandler } from 'next';

import firstOf from '@/lib/firstOf';

import { getYouTubeChannelIDs } from './getYouTubeChannelIDs';
import { addYouTubeChannelID } from './addYouTubeChannelID';
import { getSession } from 'next-auth/client';
import { deleteYouTubeChannelID } from './deleteYouTubeChannelID';

export const index: NextApiHandler = async (req, res) => {
  const strict = firstOf(req.query.strict) === 'true';
  const channelIDs = await getYouTubeChannelIDs(firstOf(req.query.guild), strict);
  const compact = firstOf(req.query.compact) !== 'false';

  if (compact) {
    return res.json({
      ok: true,
      channelIDs: channelIDs.map(entry => entry.channelId)
    });
  }

  return res.json({
    ok: true,
    channelIDs
  });
};

export const create: NextApiHandler = async (req, res) => {
  const guildId = firstOf(req.query.guild);
  const channelId: string | undefined = req.body.channelID;

  if (typeof channelId === 'undefined') {
    return res.status(400).json({
      ok: false,
      error: 'MISSING_CHANNEL_ID'
    });
  }

  try {
    await addYouTubeChannelID(channelId, guildId);
    return res.json({ ok: true });
  } catch (err) {
    if (err.name === 'YouTubeChannelIDCreationError') {
      return res.status(err.statusCode).json({
        ok: false,
        error: err.code
      });
    }

    console.error(err);

    return res.status(500).json({
      ok: false,
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
};

export const destroy: NextApiHandler = async (req, res) => {
  const id = firstOf(req.query.id);
  const session = await getSession({ req });

  try {
    await deleteYouTubeChannelID(session, id);
    return res.json({ ok: true });
  } catch (err) {
    if (err.name === 'YouTubeChannelIDDeletionError') {
      return res.status(err.statusCode).json({
        ok: false,
        error: err.code
      });
    }

    console.error(err);

    return res.status(500).json({
      ok: false,
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
};

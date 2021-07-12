import { NextApiHandler } from 'next';

import firstOf from '@/lib/firstOf';

import { getYouTubeVideoIDs } from './getYouTubeVideoIDs';
import { addYouTubeVideoID } from './addYouTubeVideoID';

export const index: NextApiHandler = async (req, res) => {
  const videoIDs = await getYouTubeVideoIDs(firstOf(req.query.guild));
  const compact = firstOf(req.query.compact) !== 'false';

  if (compact) {
    return res.json({
      ok: true,
      videoIDs: videoIDs.map(entry => entry.videoId)
    });
  }

  return res.json({
    ok: true,
    videoIDs
  });
};

export const create: NextApiHandler = async (req, res) => {
  const guildId = firstOf(req.query.guild);
  const videoID: string | undefined = req.body.videoID;

  if (typeof videoID === 'undefined') {
    return res.status(400).json({
      ok: false,
      error: 'MISSING_VIDEO_ID'
    });
  }

  try {
    await addYouTubeVideoID(videoID, guildId);
    return res.json({ ok: true });
  } catch (err) {
    if (err.name === 'YouTubeVideoIDCreationError') {
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

import { NextApiHandler } from 'next';

import { getPagination, hasNextPages, hasPreviousPages } from 'next-api-paginate';

import firstOf from '@/lib/firstOf';

import { getYouTubeVideoIDs } from './getYouTubeVideoIDs';
import { addYouTubeVideoID } from './addYouTubeVideoID';
import { getSession } from 'next-auth/client';
import { deleteYouTubeVideoID } from './deleteYouTubeVideoID';

export const index: NextApiHandler = async (req, res) => {
  const strict = firstOf(req.query.strict) === 'true';
  const compact = firstOf(req.query.compact) !== 'false';

  const { page, limit } = getPagination(req);

  const skip = limit !== Infinity ? (page - 1) * limit : undefined;
  const take = limit !== Infinity ? limit : undefined;

  const { videoIDs, totalCount } = await getYouTubeVideoIDs(firstOf(req.query.guild), strict, skip, take);
  const pageCount = limit !== Infinity ? Math.ceil(totalCount / limit) : 1;

  const pagination = {
    page,
    limit,
    pageCount,
    totalCount,
    hasPrevious: hasPreviousPages(req),
    hasNext: hasNextPages(req)(pageCount)
  };

  if (compact) {
    return res.json({
      ok: true,
      pagination,
      videoIDs: videoIDs.map(entry => entry.videoId)
    });
  }

  return res.json({
    ok: true,
    pagination,
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

export const destroy: NextApiHandler = async (req, res) => {
  const id = firstOf(req.query.id);
  const session = await getSession({ req });

  try {
    await deleteYouTubeVideoID(session, id);
    return res.json({ ok: true });
  } catch (err) {
    if (err.name === 'YouTubeVideoIDDeletionError') {
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

import { NextApiHandler } from 'next';

import { getPagination, hasNextPages, hasPreviousPages } from 'next-api-paginate';

import firstOf from '@/lib/firstOf';

import { getYouTubeChannelIDs } from './getYouTubeChannelIDs';
import { addYouTubeChannelID } from './addYouTubeChannelID';
import { getSession } from 'next-auth/client';
import { deleteYouTubeChannelID } from './deleteYouTubeChannelID';

import { captureException } from '@sentry/nextjs';

export const index: NextApiHandler = async (req, res) => {
  const strict = firstOf(req.query.strict) === 'true';
  const compact = firstOf(req.query.compact) !== 'false';

  const { page, limit } = getPagination(req);

  const skip = limit !== Infinity ? (page - 1) * limit : undefined;
  const take = limit !== Infinity ? limit : undefined;

  const { channelIDs, totalCount } = await getYouTubeChannelIDs(firstOf(req.query.guild), strict, skip, take);
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
      channelIDs: channelIDs.map(entry => entry.channelId)
    });
  }

  return res.json({
    ok: true,
    pagination,
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

    captureException(err);

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

    captureException(err);

    return res.status(500).json({
      ok: false,
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
};

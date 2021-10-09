import { NextApiHandler } from 'next';

import {
  getPagination,
  hasNextPages,
  hasPreviousPages,
} from 'next-api-paginate';

import firstOf from '@/lib/firstOf';

import { getDiscordGuilds } from './getDiscordGuilds';
import { addDiscordGuild } from './addDiscordGuild';
import { getSession } from 'next-auth/client';
import { deleteDiscordGuild } from './deleteDiscordGuild';

import { handleError } from '@/lib/errors';

export const index: NextApiHandler = async (req, res) => {
  const strict = firstOf(req.query.strict) === 'true';
  const compact = firstOf(req.query.compact) !== 'false';

  const { page, limit } = getPagination(req);

  const skip = limit !== Infinity ? (page - 1) * limit : undefined;
  const take = limit !== Infinity ? limit : undefined;

  const { discordGuilds, totalCount } = await getDiscordGuilds(
    firstOf(req.query.guild),
    strict,
    skip,
    take,
  );
  const pageCount = limit !== Infinity ? Math.ceil(totalCount / limit) : 1;

  const pagination = {
    page,
    limit,
    pageCount,
    totalCount,
    hasPrevious: hasPreviousPages(req),
    hasNext: hasNextPages(req)(pageCount),
  };

  if (compact) {
    return res.json({
      ok: true,
      pagination,
      discordGuilds: discordGuilds.map((entry) => entry.blacklistedId),
    });
  }

  return res.json({
    ok: true,
    pagination,
    discordGuilds,
  });
};

export const create: NextApiHandler = async (req, res) => {
  const guildId = firstOf(req.query.guild);
  const id: string | undefined = req.body.id;
  const name: string | undefined = req.body.name;

  if (typeof id === 'undefined') {
    return res.status(400).json({
      ok: false,
      error: 'MISSING_VIDEO_ID',
    });
  }

  try {
    await addDiscordGuild(id, name, guildId);
    return res.json({ ok: true });
  } catch (err) {
    if (err.name === 'DiscordGuildCreationError') {
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
  const id = firstOf(req.query.id);
  const session = await getSession({ req });

  try {
    await deleteDiscordGuild(session, id);
    return res.json({ ok: true });
  } catch (err) {
    if (err.name === 'DiscordGuildDeletionError') {
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

import { NextApiHandler } from 'next';

import {
  getPagination,
  hasNextPages,
  hasPreviousPages,
} from 'next-api-paginate';

import firstOf from '@/lib/firstOf';

import { getLinkPatterns } from './getLinkPatterns';
import { addLinkPattern } from './addLinkPattern';
import { deleteLinkPattern } from './deleteLinkPattern';
import { getSession } from 'next-auth/client';

import { handleError } from '@/lib/errors';

export const index: NextApiHandler = async (req, res) => {
  const strict = firstOf(req.query.strict) === 'true';
  const compact = firstOf(req.query.compact) !== 'false';

  const { page, limit } = getPagination(req);

  const skip = limit !== Infinity ? (page - 1) * limit : undefined;
  const take = limit !== Infinity ? limit : undefined;

  const { patterns, totalCount } = await getLinkPatterns({
    groupId: firstOf(req.query.group),
    guildId: firstOf(req.query.guild),
    strict,
    skip,
    take,
  });
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
      patterns: patterns.map((entry) => entry.pattern),
    });
  }

  return res.json({
    ok: true,
    pagination,
    patterns,
  });
};

export const create: NextApiHandler = async (req, res) => {
  const guildId = firstOf(req.query.guild);
  const groupId = firstOf(req.query.group);
  const pattern: string | undefined = req.body.pattern;
  const severity: number | undefined =
    req.body.severity && parseInt(req.body.severity, 10);

  if (typeof pattern === 'undefined') {
    return res.status(400).json({
      ok: false,
      error: 'MISSING_REGEX_PATTERN',
    });
  }

  try {
    await addLinkPattern({
      pattern,
      guildId,
      groupId,
      severity,
    });
    return res.json({ ok: true });
  } catch (err) {
    if (err.name === 'LinkPatternCreationError') {
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
    await deleteLinkPattern(session, id);
    return res.json({ ok: true });
  } catch (err) {
    if (err.name === 'LinkPatternDeletionError') {
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

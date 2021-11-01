import { NextApiHandler } from 'next';

import {
  getPagination,
  hasNextPages,
  hasPreviousPages,
} from 'next-api-paginate';

import firstOf from '@/lib/firstOf';

import { getPhrases } from './getPhrases';
import { addPhrase } from './addPhrase';
import { deletePhrase } from './deletePhrase';
import { getSession } from 'next-auth/client';

import { handleError } from '@/lib/errors';

export const index: NextApiHandler = async (req, res) => {
  const strict = firstOf(req.query.strict) === 'true';
  const compact = firstOf(req.query.compact) !== 'false';

  const { page, limit } = getPagination(req);

  const skip = limit !== Infinity ? (page - 1) * limit : undefined;
  const take = limit !== Infinity ? limit : undefined;

  const { phrases, totalCount } = await getPhrases({
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
      phrases: phrases.map((entry) => entry.content),
    });
  }

  return res.json({
    ok: true,
    pagination,
    phrases,
  });
};

export const create: NextApiHandler = async (req, res) => {
  const guildId = firstOf(req.query.guild);
  const groupId = firstOf(req.query.group);
  const content: string | undefined = req.body.content;
  const severity: number | undefined =
    req.body.severity && parseInt(req.body.severity, 10);

  if (typeof content === 'undefined') {
    return res.status(400).json({
      ok: false,
      error: 'MISSING_PHRASE_CONTENT',
    });
  }

  try {
    await addPhrase({
      content,
      guildId,
      groupId,
      severity,
      gateway: req.gateway,
    });
    return res.json({ ok: true });
  } catch (err) {
    if (err.name === 'PhraseCreationError') {
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
    await deletePhrase(session, id, req.gateway);
    return res.json({ ok: true });
  } catch (err) {
    if (err.name === 'PhraseDeletionError') {
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

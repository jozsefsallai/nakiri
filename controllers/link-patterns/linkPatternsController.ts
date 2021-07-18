import { NextApiHandler } from 'next';

import firstOf from '@/lib/firstOf';

import { getLinkPatterns } from './getLinkPatterns';
import { addLinkPattern } from './addLinkPattern';
import { deleteLinkPattern } from './deleteLinkPattern';
import { getSession } from 'next-auth/client';

export const index: NextApiHandler = async (req, res) => {
  const strict = firstOf(req.query.strict) === 'true';
  const patterns = await getLinkPatterns(firstOf(req.query.guild), strict);
  const compact = firstOf(req.query.compact) !== 'false';

  if (compact) {
    return res.json({
      ok: true,
      patterns: patterns.map(entry => entry.pattern)
    });
  }

  return res.json({
    ok: true,
    patterns
  });
};

export const create: NextApiHandler = async (req, res) => {
  const guildId = firstOf(req.query.guild);
  const pattern: string | undefined = req.body.pattern;

  if (typeof pattern === 'undefined') {
    return res.status(400).json({
      ok: false,
      error: 'MISSING_REGEX_PATTERN'
    });
  }

  try {
    await addLinkPattern(pattern, guildId);
    return res.json({ ok: true });
  } catch (err) {
    if (err.name === 'LinkPatternCreationError') {
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
    await deleteLinkPattern(session, id);
    return res.json({ ok: true });
  } catch (err) {
    if (err.name === 'LinkPatternDeletionError') {
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

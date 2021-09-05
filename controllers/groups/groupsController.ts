import { NextApiHandler } from 'next';
import { getSession } from 'next-auth/client';

import { getGroups } from './getGroups';
import { createGroup } from './createGroup';

import firstOf from '@/lib/firstOf';

import { captureException } from '@sentry/nextjs';

export const index: NextApiHandler = async (req, res) => {
  const session = await getSession({ req });

  try {
    const groups = await getGroups(session);
    return res.json({
      ok: true,
      groups,
    });
  } catch (err) {
    captureException(err);
    return res.status(500).json({
      ok: false,
      error: 'INTERNAL_SERVER_ERROR',
    });
  }
};

export const create: NextApiHandler = async (req, res) => {
  const session = await getSession({ req });

  try {
    const group = await createGroup(session, req.body);
    return res.json({
      ok: true,
      group,
    });
  } catch (err) {
    if (err.name === 'GroupCreationError') {
      return res.status(err.statusCode).json({
        ok: false,
        error: err.code,
      });
    }

    captureException(err);
    return res.status(500).json({
      ok: false,
      error: 'INTERNAL_SERVER_ERROR',
    });
  }
};

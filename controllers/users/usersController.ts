import firstOf from '@/lib/firstOf';
import { NextApiHandler } from 'next';
import { getSession } from 'next-auth/client';
import { authorizeUser } from './authorizeUser';
import { getDiscordUser } from './getDiscordUser';
import { getUser } from './getUser';
import { getUsers } from './getUsers';
import { unauthorizeUser } from './unauthorizeUser';
import { updateUserPermissions } from './updateUser';

import { captureException } from '@sentry/nextjs';

export const get: NextApiHandler = async (req, res) => {
  const session = await getSession({ req });
  const user = await getUser(session);

  if (user === null) {
    return res.status(500).json({
      ok: false,
      error: 'USER_IDENTIFICATION_FAILED'
    });
  }

  return res.json({
    ok: true,
    user
  });
};

export const getData: NextApiHandler = async (req, res) => {
  const discordId = firstOf(req.query.id)?.trim();

  if (typeof discordId === 'undefined' || discordId.length === 0) {
    return res.status(400).json({
      ok: false,
      error: 'MISSING_DISCORD_ID'
    });
  }

  try {
    const data = await getDiscordUser(discordId);
    return res.json({
      ok: true,
      data
    });
  } catch (err) {
    captureException(err);

    return res.status(500).json({
      ok: false,
      error: 'FAILED_TO_FETCH_USER_DATA'
    });
  }
};

export const index: NextApiHandler = async (req, res) => {
  try {
    const users = await getUsers();
    return res.json({ ok: true, users });
  } catch (err) {
    captureException(err);

    return res.status(500).json({
      ok: false,
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
};

export const authorize: NextApiHandler = async (req, res) => {
  const discordId: string | undefined = req.body.discordId;
  const permissions: number[] | undefined = req.body.permissions;

  if (typeof discordId === 'undefined') {
    return res.status(400).json({
      ok: false,
      error: 'MISSING_DISCORD_ID'
    });
  }

  if (typeof permissions === 'undefined' || permissions.length === 0) {
    return res.status(400).json({
      ok: false,
      error: 'MISSING_PERMISSIONS'
    });
  }

  try {
    await authorizeUser(discordId, permissions);
    return res.json({ ok: true });
  } catch (err) {
    if (err.name === 'AuthorizedUserCreationError') {
      return res.status(err.statusCode).json({
        ok: false,
        error: err.code,
        ...(err.data && { data: err.data })
      });
    }

    captureException(err);

    return res.status(500).json({
      ok: false,
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
};

export const updatePermissions: NextApiHandler = async (req, res) => {
  const id = firstOf(req.query.id);
  const permissions: number[] = req.body.permissions;

  if (typeof permissions === 'undefined' || permissions.length === 0) {
    return res.status(400).json({
      ok: false,
      error: 'MISSING_PERMISSIONS'
    });
  }

  try {
    const user = await updateUserPermissions(id, permissions);
    return res.json({ ok: true, user });
  } catch (err) {
    if (err.name === 'UserUpdateError') {
      return res.status(err.statusCode).json({
        ok: false,
        error: err.code,
        ...(err.data && { data: err.data })
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

  try {
    await unauthorizeUser(id);
    return res.json({ ok: true });
  } catch (err) {
    if (err.name === 'UnauthorizeUserError') {
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

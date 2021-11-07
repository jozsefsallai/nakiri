import { NextApiHandler } from 'next';
import { getSession } from 'next-auth/client';

import { getGroup, getGroups } from './getGroups';
import { createGroup } from './createGroup';

import firstOf from '@/lib/firstOf';

import { handleError } from '@/lib/errors';
import {
  addGuildToGroup,
  addUserToGroup,
  removeGuildFromGroup,
  removeUserFromGroup,
  updateGroupDetails,
} from './updateGroup';
import { deleteGroup } from './deleteGroup';

export const index: NextApiHandler = async (req, res) => {
  const session = await getSession({ req });

  try {
    const groups = await getGroups(session);
    return res.json({
      ok: true,
      groups,
    });
  } catch (err) {
    handleError(err);
    return res.status(500).json({
      ok: false,
      error: 'INTERNAL_SERVER_ERROR',
    });
  }
};

export const get: NextApiHandler = async (req, res) => {
  const id = firstOf(req.query.id);
  const session = await getSession({ req });

  try {
    const group = await getGroup(id, session);
    return res.json({
      ok: true,
      group,
    });
  } catch (err) {
    if (err.name === 'GetGroupError') {
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

    handleError(err);
    return res.status(500).json({
      ok: false,
      error: 'INTERNAL_SERVER_ERROR',
    });
  }
};

export const addGuild: NextApiHandler = async (req, res) => {
  const id = firstOf(req.query.id);
  const session = await getSession({ req });
  const guildId = req.body.guildId;

  if (!guildId) {
    return res.status(400).json({
      ok: false,
      error: 'GUILD_NOT_PROVIDED',
    });
  }

  try {
    const group = await addGuildToGroup(session, id, guildId);
    return res.json({
      ok: true,
      group,
    });
  } catch (err) {
    if (err.name === 'UpdateGroupError') {
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

export const addMember: NextApiHandler = async (req, res) => {
  const groupId = firstOf(req.query.id);
  const session = await getSession({ req });
  const discordId = req.body.discordId;
  const permissions: number[] | undefined = req.body.permissions;

  if (!discordId) {
    return res.status(400).json({
      ok: false,
      error: 'MISSING_DISCORD_ID',
    });
  }

  if (typeof permissions === 'undefined' || permissions.length === 0) {
    return res.status(400).json({
      ok: false,
      error: 'MISSING_PERMISSIONS',
    });
  }

  try {
    const group = await addUserToGroup(
      session,
      groupId,
      discordId,
      permissions,
    );
    return res.json({
      ok: true,
      group,
    });
  } catch (err) {
    if (err.name === 'UpdateGroupError') {
      return res.status(err.statusCode).json({
        ok: false,
        error: err.code,
        ...(err.data && { data: err.data }),
      });
    }

    handleError(err);

    return res.status(500).json({
      ok: false,
      error: 'INTERNAL_SERVER_ERROR',
    });
  }
};

export const removeGuild: NextApiHandler = async (req, res) => {
  const id = firstOf(req.query.id);
  const guildId = firstOf(req.query.guildId);
  const session = await getSession({ req });

  try {
    const group = await removeGuildFromGroup(session, id, guildId);
    return res.json({
      ok: true,
      group,
    });
  } catch (err) {
    if (err.name === 'UpdateGroupError') {
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

export const removeMember: NextApiHandler = async (req, res) => {
  const groupId = firstOf(req.query.id);
  const discordId = firstOf(req.query.mid);
  const session = await getSession({ req });

  try {
    const group = await removeUserFromGroup(session, groupId, discordId);
    return res.json({
      ok: true,
      group,
    });
  } catch (err) {
    if (err.name === 'UpdateGroupError') {
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

export const update: NextApiHandler = async (req, res) => {
  const id = firstOf(req.query.id);
  const session = await getSession({ req });

  const { name, description } = req.body;

  try {
    const group = await updateGroupDetails(session, id, {
      name,
      description,
    });

    return res.json({
      ok: true,
      group,
    });
  } catch (err) {
    if (err.name === 'UpdateGroupError') {
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
    await deleteGroup(session, id);
    return res.json({
      ok: true,
    });
  } catch (err) {
    if (err.name === 'DeleteGroupError') {
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

import db from '@/services/db';
import Redis from '@/services/redis';

import { GatewayContext } from '../client';
import { ReconnectRequest } from '../typings/requests';
import { ReconnectResponse } from '../typings/responses';

import { Group } from '@/db/models/groups/Group';

const handler = async (ctx: GatewayContext<ReconnectRequest>) => {
  const { client, apiKey, sessionId } = ctx;

  if (!apiKey) {
    return client.emit<ReconnectResponse>('reconnect', {
      ok: false,
      error: 'API_KEY_NOT_PROVIDED',
    });
  }

  if (!sessionId) {
    return client.emit<ReconnectResponse>('reconnect', {
      ok: false,
      error: 'SESSION_ID_NOT_PROVIDED',
    });
  }

  const sessionKey = `gatewaySession:${sessionId}`;

  const redis = Redis.getInstance();
  const entry = await redis.get(sessionKey);

  if (!entry) {
    return client.emit<ReconnectResponse>('reconnect', {
      ok: false,
      error: 'INVALID_SESSION',
    });
  }

  if (entry !== apiKey) {
    return client.emit<ReconnectResponse>('reconnect', {
      ok: false,
      error: 'API_KEY_DOES_NOT_MATCH_PREVIOUS_SESSION',
    });
  }

  const connection = await db.getTemporaryNamedConnection('gateway');
  const groupsRepository = connection.getRepository(Group);

  const group = await groupsRepository.findOne({ apiKey });
  if (!group) {
    return client.emit<ReconnectResponse>('reconnect', {
      ok: false,
      error: 'INVALID_API_KEY',
    });
  }

  client.setSessionId(sessionId);
  client.setGroup(group);

  await redis.persist(sessionKey);

  return client.emit<ReconnectResponse>('reconnect', {
    ok: true,
  });
};

export default handler;

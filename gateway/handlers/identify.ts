import db from '@/services/db';
import Redis from '@/services/redis';
import { v4 as uuid } from 'uuid';

import { GatewayContext } from '../client';
import { IdentifyRequest } from '../typings/requests';
import { IdentifyResponse } from '../typings/responses';

import { Group } from '@/db/models/groups/Group';

const handler = async (ctx: GatewayContext<IdentifyRequest>) => {
  const { client, apiKey } = ctx;

  if (!apiKey) {
    return client.emit<IdentifyResponse>('identify', {
      ok: false,
      error: 'API_KEY_NOT_PROVIDED',
    });
  }

  const connection = await db.getTemporaryNamedConnection('gateway');
  const groupsRepository = connection.getRepository(Group);

  const group = await groupsRepository.findOne({ apiKey });
  if (!group) {
    return client.emit<IdentifyResponse>('identify', {
      ok: false,
      error: 'INVALID_API_KEY',
    });
  }

  client.setGroup(group);

  const redis = Redis.getInstance();

  let sessionId = uuid();
  while ((await redis.countPrefix(`gatewaySession:${sessionId}`)) > 0) {
    sessionId = uuid();
  }

  await redis.set(`gatewaySession:${sessionId}`, apiKey);
  client.setSessionId(sessionId);

  return client.emit<IdentifyResponse>('identify', {
    ok: true,
    data: {
      sessionId,
    },
  });
};

export default handler;

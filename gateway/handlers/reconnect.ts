import Redis from '@/services/redis';

import { GatewayContext } from '../client';
import { ReconnectRequest } from '../typings/requests';
import { ReconnectResponse } from '../typings/responses';

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

  const redis = Redis.getInstance();
  const entry = await redis.get(`gatewaySession:${sessionId}`);

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

  client.setSessionId(sessionId);
  return client.emit<ReconnectResponse>('reconnect', {
    ok: true,
  });
};

export default handler;

import { handleError } from '@/lib/errors';
import Redis from '@/services/redis';

import { GatewayContext } from '../client';
import {
  GatewayClientACK,
  NotificationQueueEntry,
} from '../typings/notifications';
import { GatewayResponse } from '../typings/responses';

const handler = async (ctx: GatewayContext<GatewayClientACK>) => {
  const { client, notificationId } = ctx;

  if (!notificationId) {
    return client.emit<GatewayResponse>('ack', {
      ok: false,
      error: 'NOTIFICATION_ID_NOT_PROVIDED',
    });
  }

  if (!client.isAuthenticated) {
    return client.emit<GatewayResponse & GatewayClientACK>('ack', {
      ok: false,
      error: 'NOT_AUTHENTICATED',
      notificationId,
    });
  }

  const redis = Redis.getInstance();

  const key = `gatewayNotification:${notificationId}`;

  const notification = await redis.get<NotificationQueueEntry>(key);
  if (!notification || typeof notification !== 'object') {
    return client.emit<GatewayResponse & GatewayClientACK>('ack', {
      ok: false,
      error: 'NOTIFICATION_NOT_FOUND',
      notificationId,
    });
  }

  if (notification.sessionId !== client.getSessionId()) {
    return client.emit<GatewayResponse & GatewayClientACK>('ack', {
      ok: false,
      error: 'UNAUTHORIZED_TO_ACK_NOTIFICATION',
      notificationId,
    });
  }

  try {
    await redis.delete(key);

    return client.emit<GatewayResponse & GatewayClientACK>('ack', {
      ok: true,
      notificationId,
    });
  } catch (e) {
    handleError(e);
    return client.emit<GatewayResponse & GatewayClientACK>('ack', {
      ok: false,
      error: 'UNKNOWN_ERROR',
      notificationId,
    });
  }
};

export default handler;

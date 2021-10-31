import { Server as HTTPServer } from 'http';
import { Server } from 'ws';

import Redis from '@/services/redis';
import { v4 as uuid } from 'uuid';

import { GatewayClient } from './client';

import { IdentifyRequest, ReconnectRequest } from './typings/requests';
import {
  GatewayClientACK,
  GatewayNotification,
  NotificationQueueEntry,
} from './typings/notifications';

import ackHandler from './handlers/ack';
import reverseHandler, { IReverseRequest } from './handlers/reverse';
import identifyHandler from './handlers/identify';
import reconnectHandler from './handlers/reconnect';

export class Gateway {
  private wss: Server;
  private clients: GatewayClient[] = [];
  private pingInterval: NodeJS.Timeout;

  constructor(server: HTTPServer) {
    this.wss = new Server({
      server,
      path: '/gateway',
    });

    this.wss.on('connection', (ws) => {
      const client = new GatewayClient(ws);
      this.clients.push(client);

      client.on<GatewayClientACK>('ack', ackHandler);

      client.on<IReverseRequest>('reverseMessage', reverseHandler);
      client.on<IdentifyRequest>('identify', identifyHandler);
      client.on<ReconnectRequest>('reconnect', reconnectHandler);
    });

    this.pingInterval = setInterval(() => {
      this.clients.forEach((client) => {
        if (!client.isAlive) {
          client.terminate();
          this.clients = this.clients.filter((c) => c !== client);
          return;
        }

        client.isAlive = false;
        client.ping();
      });
    }, 30000);

    this.wss.on('close', () => {
      clearInterval(this.pingInterval);
    });
  }

  async emit<T extends GatewayNotification>(
    event: string,
    data: T,
    condition?: (client: GatewayClient) => boolean,
  ): Promise<void> {
    const redis = Redis.getInstance();

    for await (const client of this.clients) {
      if (
        !client.isAlive ||
        !client.isAuthenticated ||
        (condition && !condition(client))
      ) {
        continue;
      }

      let notificationId = uuid();

      while (await redis.countPrefix(`gatewayNotification:${notificationId}`)) {
        notificationId = uuid();
      }

      client.emit(event, {
        notificationId,
        ...data,
      });

      const queueData: NotificationQueueEntry = {
        sessionId: client.getSessionId(),
        event,
        data,
      };

      await redis.set(`gatewayNotification:${notificationId}`, queueData);
    }
  }
}

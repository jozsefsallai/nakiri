import { Server } from 'ws';

import Redis from '@/services/redis';
import { v4 as uuid } from 'uuid';
import {
  clearIntervalAsync,
  setIntervalAsync,
  SetIntervalAsyncTimer,
} from 'set-interval-async/dynamic';

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
  private pingInterval: SetIntervalAsyncTimer;
  private port: number;

  constructor(port: number) {
    this.wss = new Server({ port });

    this.port = port;

    this.wss.on('connection', (ws) => {
      const client = new GatewayClient(ws);
      this.clients.push(client);

      client.on<GatewayClientACK>('ack', ackHandler);

      client.on<IReverseRequest>('reverseMessage', reverseHandler);
      client.on<IdentifyRequest>('identify', identifyHandler);
      client.on<ReconnectRequest>('reconnect', reconnectHandler);
    });

    this.wss.on('error', (error) => {
      console.error(error);
    });

    this.pingInterval = setIntervalAsync(async () => {
      for await (const client of this.clients) {
        if (!client.isAlive) {
          await client.terminate();
          this.clients = this.clients.filter((c) => c !== client);
          return;
        }

        client.isAlive = false;
        client.ping();
      }
    }, 30000);

    this.wss.on('close', async () => {
      await clearIntervalAsync(this.pingInterval);
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

  getPort(): number {
    return this.port;
  }
}

import WebSocket from 'ws';

import { Group } from '@/db/models/groups/Group';
import { handleError } from '@/lib/errors';
import Redis from '@/services/redis';
import { Gateway } from '.';

export type GatewayContext<T> = {
  gateway: Gateway;
  client: GatewayClient;
} & T;

type GatewayEventHandler<T> = (ctx: GatewayContext<T>) => void | Promise<void>;

interface GatewayEventHandlers {
  [key: string]: GatewayEventHandler<any>;
}

type GatewayEvent = [string, any];

const noop = () => {};

export class GatewayClient {
  private gateway: Gateway;

  private ws: WebSocket;
  isAlive: boolean;
  private handlers: GatewayEventHandlers = {};

  private sessionId?: string;
  private group?: Group;

  constructor(ws: WebSocket, gateway: Gateway) {
    this.gateway = gateway;

    this.ws = ws;
    this.isAlive = true;

    this.ws.on('message', async (message) => {
      let ctx: GatewayEvent;

      try {
        ctx = JSON.parse(message.toString());
      } catch (_) {
        return this.emit('gatewayError', {
          code: 'INVALID_JSON',
        });
      }

      const [event, data] = ctx;

      try {
        const handler = this.handlers[event];

        if (!handler) {
          return this.emit('gatewayError', {
            code: 'UNKNOWN_EVENT',
            event,
          });
        }

        await handler({ client: this, gateway: this.gateway, ...data });
      } catch (err) {
        handleError(err);

        this.emit('gatewayError', {
          code: 'UNKNOWN_ERROR',
          event,
          error: err.message,
        });
      }
    });

    this.ws.on('pong', () => {
      this.isAlive = true;
    });
  }

  getSessionId(): string | undefined {
    return this.sessionId;
  }

  setSessionId(sessionId: string) {
    this.sessionId = sessionId;
  }

  get isAuthenticated(): boolean {
    return !!this.sessionId;
  }

  getGroup(): Group | undefined {
    return this.group;
  }

  setGroup(group: Group) {
    this.group = group;
  }

  on<T = any>(event: string, handler: GatewayEventHandler<T>): void {
    this.handlers[event] = handler;
  }

  emit<T = any>(event: string, data: T): void {
    this.ws.send(JSON.stringify([event, data]));
  }

  private async setSessionTTL() {
    if (!this.sessionId) {
      return;
    }

    const redis = Redis.getInstance();
    await redis.expire(`gatewaySession:${this.sessionId}`, 60 * 60);
  }

  ping() {
    this.ws.ping(noop);
  }

  async terminate() {
    // persist session for an hour after the client disconnects
    await this.setSessionTTL();

    this.ws.terminate();
  }

  socket(): WebSocket {
    return this.ws;
  }
}

import WebSocket from 'ws';

import { Group } from '@/db/models/groups/Group';
import { handleError } from '@/lib/errors';

export type GatewayContext<T> = {
  client: GatewayClient;
} & T;

type GatewayEventHandler<T> = (ctx: GatewayContext<T>) => void | Promise<void>;

interface GatewayEventHandlers {
  [key: string]: GatewayEventHandler<any>;
}

type GatewayEvent = [string, any];

const noop = () => {};

export class GatewayClient {
  private ws: WebSocket;
  isAlive: boolean;
  private handlers: GatewayEventHandlers = {};

  private sessionId?: string;
  private group?: Group;

  constructor(ws: WebSocket) {
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

        await handler({ client: this, ...data });
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

  ping() {
    this.ws.ping(noop);
  }

  terminate() {
    this.ws.terminate();
  }

  socket(): WebSocket {
    return this.ws;
  }
}

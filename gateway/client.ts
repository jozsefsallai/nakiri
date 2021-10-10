import WebSocket from 'ws';

type GatewayEventHandler<T> = (data: T) => void | Promise<void>;

interface GatewayEventHandlers {
  [key: string]: GatewayEventHandler<any>;
}

type GatewayEvent = [string, any];

const noop = () => {};

export class GatewayClient {
  private ws: WebSocket;
  isAlive: boolean;
  private handlers: GatewayEventHandlers = {};

  constructor(ws: WebSocket) {
    this.ws = ws;
    this.isAlive = true;

    this.ws.on('message', async (message) => {
      try {
        const [event, data]: GatewayEvent = JSON.parse(message.toString());
        const handler = this.handlers[event];
        if (handler) {
          await handler(data);
        }
      } catch (err) {
        this.emit('error', {
          code: 'INVALID_JSON',
        });
      }
    });

    this.ws.on('pong', () => {
      this.isAlive = true;
    });
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

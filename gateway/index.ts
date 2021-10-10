import { Server as HTTPServer } from 'http';
import { Server } from 'ws';
import { GatewayClient } from './client';

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

      client.on<{ message: string }>('reverseMessage', (message) => {
        client.emit('messageReversed', {
          message: message.message.split('').reverse().join(''),
        });
      });
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

  emit<T = any>(event: string, data: T) {
    this.clients.forEach((client) => {
      if (client.isAlive) {
        client.emit(event, data);
      }
    });
  }
}

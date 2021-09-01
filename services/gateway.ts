import { Server as HTTPServer } from 'http';
import { Server } from 'ws';

export class Gateway {
  private wss: Server;

  constructor(server: HTTPServer) {
    this.wss = new Server({
      server,
      path: '/gateway'
    });

    this.wss.on('connection', ws => {
      ws.on('message', message => {
        const reversed = message.toString().split('').reverse().join('');
        ws.send(reversed);
      });
    });
  }

  send(message: string) {
    this.wss.clients.forEach(client => {
      client.send(message);
    });
  }
}

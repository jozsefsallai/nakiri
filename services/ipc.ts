import { Gateway } from '@/gateway';
import { queueGatewayMessage } from '@/jobs/queue';
import ipc from 'node-ipc';

type IPCAction = 'videoDeleted' | 'channelDeleted';

interface IPCMessage<T = any> {
  action: IPCAction;
  data: T;
}

class IPCServer {
  private gateway: Gateway;

  constructor(gateway: Gateway) {
    this.gateway = gateway;
    this.bootstrap();
  }

  private bootstrap() {
    ipc.config.appspace = 'nakiri_';
    ipc.config.id = 'nakiriapi.sock';
    ipc.config.retry = 1500;
    ipc.config.silent = true;

    ipc.serve(() => {
      ipc.server.on('message', this.handleMessage.bind(this));
      console.log(` > Started IPC server on ${ipc.server['path']}`);
    });
  }

  private async handleMessage(message: IPCMessage) {
    switch (message.action) {
      case 'videoDeleted':
        queueGatewayMessage(this.gateway, {
          event: 'entryRemoved',
          blacklist: 'youtubeVideoID',
          entry: message.data,
        });

        break;
      case 'channelDeleted':
        queueGatewayMessage(this.gateway, {
          event: 'entryRemoved',
          blacklist: 'youtubeChannelID',
          entry: message.data,
        });

        break;
    }
  }

  start() {
    ipc.server.start();
  }
}

export default IPCServer;

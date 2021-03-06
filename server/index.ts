import express from 'express';
import * as http from 'http';
import next from 'next';
import { Gateway } from '@/gateway';

import middleware from './core/middleware';
import routes from './core/routes';
import boot from './core/boot';

import IPCServer from '@/services/ipc';

import getPort from 'get-port';
import config from '@/config';

export default async function server() {
  const dev = process.env.NODE_ENV !== 'production';

  const nextApp = next({
    dev,
    hostname: config.app.domain,
    port: config.app.port || parseInt(process.env.APP_PORT, 10) || 3000,
  });
  const nextHandler = nextApp.getRequestHandler();

  await nextApp.prepare();

  const port = parseInt(process.env.APP_PORT, 10) || 3000;
  const gatewayPort: number = await getPort({ port: port + 100 });

  const app = express();
  const server = new http.Server(app);
  const gateway = new Gateway(gatewayPort);

  middleware(app, server, gateway);
  routes(app, nextHandler);
  boot(server, port, gateway);

  const ipc = new IPCServer(gateway);
  ipc.start();
}

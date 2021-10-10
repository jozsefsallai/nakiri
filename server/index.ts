import express from 'express';
import * as http from 'http';
import next from 'next';
import { Gateway } from '@/gateway';

import middleware from './core/middleware';
import routes from './core/routes';
import boot from './core/boot';

export default async function server() {
  const dev = process.env.NODE_ENV !== 'production';

  const nextApp = next({ dev });
  const nextHandler = nextApp.getRequestHandler();

  await nextApp.prepare();

  const app = express();
  const server = new http.Server(app);
  const gateway = new Gateway(server);

  middleware(app, gateway);
  routes(app, nextHandler);
  boot(server);
}

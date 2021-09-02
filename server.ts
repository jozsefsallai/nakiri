import express from 'express';
import cookieParser from 'cookie-parser';
import next from 'next';
import * as http from 'http';
import { Gateway } from './services/gateway';

const port = parseInt(process.env.APP_PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

(async () => {
  await nextApp.prepare();

  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  const server = new http.Server(app);
  const gateway = new Gateway(server);

  app.all('*', (req, res) => {
    (req as any).gateway = gateway;
    return nextHandler(req, res);
  });

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
})().catch(err => {
  console.error(err);
  process.exit(1);
});

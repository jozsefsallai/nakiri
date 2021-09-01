import express from 'express';
import next from 'next';
import * as http from 'http';
import { Gateway } from './services/gateway';

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

(async () => {
  await nextApp.prepare();

  const app = express();
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

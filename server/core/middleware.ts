import config from '@/config';
import express, { Express } from 'express';
import { Server } from 'http';
import { Gateway } from '@/gateway';
import cookieParser from 'cookie-parser';
import { createProxyMiddleware } from 'http-proxy-middleware';

export default function middleware(
  app: Express,
  server: Server,
  gateway: Gateway,
) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser(config.app.cookieSecret));

  const gatewayMiddleware = createProxyMiddleware('/gateway', {
    target: `http://localhost:${gateway.getPort()}`,
    changeOrigin: true,
    ws: true,
    logLevel: 'error',
    onProxyReqWs: (_proxyReq, _req, socket) => {
      socket.on('error', (error) => {
        console.error('Gateway error:', error);
      });
    },
  });

  app.use(gatewayMiddleware);
  server.on('upgrade', gatewayMiddleware.upgrade);

  app.use((req, res, next) => {
    (req as any).gateway = gateway;
    next();
  });

  app.use((req, res, next) => {
    res.setHeader('X-Ayame', 'Konnakiri! Hope you are doing Great');
    next();
  });
}

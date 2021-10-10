import config from '@/config';
import express, { Express } from 'express';
import { Gateway } from '@/gateway';
import cookieParser from 'cookie-parser';

export default function middleware(app: Express, gateway: Gateway) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser(config.app.cookieSecret));

  app.use((req, res, next) => {
    (req as any).gateway = gateway;
    next();
  });

  app.use((req, res, next) => {
    res.setHeader('X-Ayame', 'Konnakiri! Hope you are doing Great');
    next();
  });
}

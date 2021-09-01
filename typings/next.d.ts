import { NextApiRequest as DefaultNextApiRequest } from 'next';
import { Gateway } from '../services/gateway';

declare module 'next' {
  interface NextApiRequest extends DefaultNextApiRequest {
    gateway: Gateway;
  }
}

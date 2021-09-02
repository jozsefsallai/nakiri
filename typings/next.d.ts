import { NextApiRequest as DefaultNextApiRequest } from 'next';
import { Gateway } from '../gateway';

declare module 'next' {
  interface NextApiRequest extends DefaultNextApiRequest {
    gateway: Gateway;
  }
}

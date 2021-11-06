import { Gateway } from '../gateway';

declare global {
  var __gateway: Gateway | undefined;
}

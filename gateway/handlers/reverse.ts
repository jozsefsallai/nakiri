import { GatewayContext } from '../client';

export interface IReverseRequest {
  message: string;
}

export interface IReverseResponse {
  message: string;
}

const handler = (ctx: GatewayContext<IReverseRequest>) => {
  ctx.client.emit<IReverseResponse>('messageReversed', {
    message: ctx.message.split('').reverse().join(''),
  });
};

export default handler;

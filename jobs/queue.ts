import Queue from 'bull';
import config from '@/config';

import videoMetadataHandler, { IVideoMetadataRequest } from '@/jobs/handlers/videoMetadataHandler';
import channelMetadataHandler, { IChannelMetadataRequest } from '@/jobs/handlers/channelMetadataHandler';
import gatewayHandler, { IGatewayRequest } from '@/jobs/handlers/gatewayHandler';

import { Gateway } from '@/gateway';

const collectVideoMetadata = new Queue<IVideoMetadataRequest>('collect video metadata', config.redis.buildRedisUrl(1));
const collectChannelMetadata = new Queue<IChannelMetadataRequest>('collect channel metadata', config.redis.buildRedisUrl(1));
const sendGatewayMessage = new Queue<IGatewayRequest>('send gateway message', config.redis.buildRedisUrl(1));

collectVideoMetadata.process(videoMetadataHandler);
collectChannelMetadata.process(channelMetadataHandler);
sendGatewayMessage.process(gatewayHandler);

let gateway: Gateway;

const queueGatewayMessage = async (_gateway: Gateway, request: IGatewayRequest) => {
  gateway = _gateway;
  await sendGatewayMessage.add(request);
};

sendGatewayMessage.on('completed', (job, result) => {
  gateway.emit('dummy', result);
});

export {
  collectVideoMetadata,
  collectChannelMetadata,
  queueGatewayMessage,
};

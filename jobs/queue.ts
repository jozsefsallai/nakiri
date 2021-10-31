import Queue from 'bull';
import config from '@/config';

import videoMetadataHandler, {
  IVideoMetadataRequest,
} from '@/jobs/handlers/videoMetadataHandler';
import channelMetadataHandler, {
  IChannelMetadataRequest,
} from '@/jobs/handlers/channelMetadataHandler';
import gatewayHandler, {
  GatewayBlacklistNotificationJob,
} from '@/jobs/handlers/gatewayHandler';

import { Gateway } from '@/gateway';

const collectVideoMetadata = new Queue<IVideoMetadataRequest>(
  'collect video metadata',
  config.redis.buildRedisUrl(1),
);
const collectChannelMetadata = new Queue<IChannelMetadataRequest>(
  'collect channel metadata',
  config.redis.buildRedisUrl(1),
);
const sendGatewayMessage = new Queue<GatewayBlacklistNotificationJob>(
  'send gateway message',
  config.redis.buildRedisUrl(1),
);

collectVideoMetadata.process(videoMetadataHandler);
collectChannelMetadata.process(channelMetadataHandler);
sendGatewayMessage.process(gatewayHandler);

let gateway: Gateway;

const queueGatewayMessage = async (
  _gateway: Gateway,
  request: GatewayBlacklistNotificationJob,
) => {
  gateway = _gateway;
  await sendGatewayMessage.add(request);
};

sendGatewayMessage.on('completed', async (job, result) => {
  await gateway.emit(job.data.event, result, (client) => {
    if (!job.data.entry.group) {
      return true;
    }

    return client.getGroup().id === job.data.entry.group.id;
  });
});

export { collectVideoMetadata, collectChannelMetadata, queueGatewayMessage };

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
import analysisHandler, {
  IAnalysisRequest,
} from '@/jobs/handlers/analysisHandler';

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
const queueAnalysis = new Queue<IAnalysisRequest>(
  'queue message for analysis',
  config.redis.buildRedisUrl(1),
);

collectVideoMetadata.process(videoMetadataHandler);
collectChannelMetadata.process(channelMetadataHandler);
sendGatewayMessage.process(gatewayHandler);
queueAnalysis.process(analysisHandler);

const setQueueGateway = async (gateway: Gateway) => {
  // Lord forgive me
  if (!global.__gateway) {
    global.__gateway = gateway;
  }

  return Promise.resolve();
};

const queueGatewayMessage = async (
  _gateway: Gateway,
  request: GatewayBlacklistNotificationJob,
) => {
  await setQueueGateway(_gateway);
  await sendGatewayMessage.add(request);
};

const queueAnalysisMessage = async (
  _gateway: Gateway,
  request: IAnalysisRequest,
) => {
  await setQueueGateway(_gateway);
  await queueAnalysis.add(request);
};

sendGatewayMessage.on('completed', async (job, result) => {
  await global.__gateway.emit(job.data.event, result, (client) => {
    if (!job.data.entry.group) {
      return true;
    }

    return client.getGroup().id === job.data.entry.group.id;
  });
});

export {
  collectVideoMetadata,
  collectChannelMetadata,
  queueAnalysisMessage,
  queueGatewayMessage,
  setQueueGateway,
};

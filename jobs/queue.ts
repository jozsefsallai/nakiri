import Queue from 'bull';
import config from '@/config';

import videoMetadataHandler, { IVideoMetadataRequest } from '@/jobs/handlers/videoMetadataHandler';
import channelMetadataHandler, { IChannelMetadataRequest } from '@/jobs/handlers/channelMetadataHandler';

const collectVideoMetadata = new Queue<IVideoMetadataRequest>('collect video metadata', config.redis.buildRedisUrl(1));
const collectChannelMetadata = new Queue<IChannelMetadataRequest>('collect channel metadata', config.redis.buildRedisUrl(1));

collectVideoMetadata.process(videoMetadataHandler);
collectChannelMetadata.process(channelMetadataHandler);

export {
  collectVideoMetadata,
  collectChannelMetadata,
};

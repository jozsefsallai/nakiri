import { ProcessCallbackFunction } from 'bull';
import { IYouTubeChannelID } from '@/db/models/blacklists/YouTubeChannelID';

export interface IChannelMetadataRequest {
  entry: IYouTubeChannelID;
};

const handler: ProcessCallbackFunction<IChannelMetadataRequest> = (job, done) => {
  const { entry } = job.data;

  if (process.env.NODE_ENV !== 'production') {
    console.log('received channel metadata request for entry', entry);
  }

  // TODO: fetch metadata from entry.channelId

  done();
};

export default handler;

import { ProcessCallbackFunction } from 'bull';
import { IYouTubeVideoID } from '@/db/models/blacklists/YouTubeVideoID';

export interface IVideoMetadataRequest {
  entry: IYouTubeVideoID;
};

const handler: ProcessCallbackFunction<IVideoMetadataRequest> = (job, done) => {
  const { entry } = job.data;

  if (process.env.NODE_ENV !== 'production') {
    console.log('received video metadata request for entry', entry);
  }

  // TODO: fetch metadata from entry.videoId

  done();
};

export default handler;

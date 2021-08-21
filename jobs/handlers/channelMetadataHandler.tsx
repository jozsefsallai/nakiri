import { ProcessCallbackFunction } from 'bull';

import config from '@/config';

import db from '@/services/db';
import { YouTubeChannelID, IYouTubeChannelID } from '@/db/models/blacklists/YouTubeChannelID';
import { ProcessingState } from '@/db/common/ProcessingState';

import { YouTubeAPIService } from '@/services/youtube';

export interface IChannelMetadataRequest {
  entry: IYouTubeChannelID;
};

const handler: ProcessCallbackFunction<IChannelMetadataRequest> = async (job, done) => {
  if (!config.youtube?.apiKey) {
    return done();
  }

  const youtube = new YouTubeAPIService(config.youtube.apiKey);

  const connection = await db.getTemporaryNamedConnection('channel-metadata-handler');
  const youTubeChannelIDRepository = connection.getRepository(YouTubeChannelID);

  const { entry } = job.data;

  if (process.env.NODE_ENV !== 'production') {
    console.log(`[${job.queue.name}] <- received channel metadata request for entry`, { id: entry.id, channelId: entry.channelId });
  }

  entry.status = ProcessingState.PENDING;
  await youTubeChannelIDRepository.save(entry);

  const metadata = await youtube.getChannelMetadata(entry.channelId);
  if (!metadata) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[${job.queue.name}] -> data fetching failed for entry`, { id: entry.id, channelId: entry.channelId });
    }

    entry.status = ProcessingState.FAILED;
    await youTubeChannelIDRepository.save(entry);

    return done();
  }

  entry.name = metadata.name;
  entry.description = metadata.description;
  entry.thumbnailUrl = metadata.thumbnailUrl;
  entry.publishedAt = metadata.publishedAt;
  entry.status = ProcessingState.DONE;

  await youTubeChannelIDRepository.save(entry);

  if (process.env.NODE_ENV !== 'production') {
    console.log(`[${job.queue.name}] -> fetched channel metadata for entry`, { id: entry.id, channelId: entry.channelId });
  }

  done();
};

export default handler;

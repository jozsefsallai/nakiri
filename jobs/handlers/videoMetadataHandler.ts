import { ProcessCallbackFunction } from 'bull';

import config from '@/config';

import db from '@/services/db';
import { YouTubeVideoID, IYouTubeVideoID } from '@/db/models/blacklists/YouTubeVideoID';
import { ProcessingState } from '@/db/common/ProcessingState';

import { YouTubeAPIService } from '@/services/youtube';

export interface IVideoMetadataRequest {
  entry: IYouTubeVideoID;
};

const handler: ProcessCallbackFunction<IVideoMetadataRequest> = async (job, done) => {
  if (!config.youtube?.apiKey) {
    return done();
  }

  const youtube = new YouTubeAPIService(config.youtube.apiKey);

  const connection = await db.getTemporaryNamedConnection('video-metadata-handler');
  const youTubeVideoIDRepository = connection.getRepository(YouTubeVideoID);

  const { entry } = job.data;

  if (process.env.NODE_ENV !== 'production') {
    console.log(`[${job.queue.name}] <- received video metadata request for entry`, { id: entry.id, videoId: entry.videoId });
  }

  entry.status = ProcessingState.PENDING;
  await youTubeVideoIDRepository.save(entry);

  const metadata = await youtube.getVideoMetadata(entry.videoId);
  if (!metadata) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[${job.queue.name}] -> data fetching failed for entry`, { id: entry.id, videoId: entry.videoId });
    }

    entry.status = ProcessingState.FAILED;
    await youTubeVideoIDRepository.save(entry);

    return done();
  }

  entry.title = metadata.title;
  entry.description = metadata.description;
  entry.thumbnailUrl = metadata.thumbnailUrl;
  entry.uploadDate = metadata.uploadDate;
  entry.uploaderId = metadata.uploaderId;
  entry.uploaderName = metadata.uploaderName;
  entry.status = ProcessingState.DONE;

  await youTubeVideoIDRepository.save(entry);

  if (process.env.NODE_ENV !== 'production') {
    console.log(`[${job.queue.name}] -> fetched video metadata for entry`, { id: entry.id, videoId: entry.videoId });
  }

  done();
};

export default handler;

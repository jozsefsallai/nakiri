import axios from 'axios';

export interface YouTubeVideoData {
  title: string;
  description?: string;
  thumbnailUrl?: string;
  uploadDate: Date;
  uploaderId: string;
  uploaderName: string;
};

export interface YouTubeChannelData {
  name: string;
  description?: string;
  publishedAt: Date;
  thumbnailUrl?: string;
};

export class YouTubeAPIService {
  static VIDEO_DATA_API_URL = 'https://www.googleapis.com/youtube/v3/videos?id=:videoId&key=:apiKey&part=snippet';
  static CHANNEL_DATA_API_URL = 'https://www.googleapis.com/youtube/v3/channels?id=:channelId&key=:apiKey&part=snippet';
  static CHANNEL_SEARCH_API_URL = 'https://www.googleapis.com/youtube/v3/search?q=:handle&part=snippet&type=channel&key=:apiKey';

  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getVideoMetadata(videoId: string): Promise<YouTubeVideoData | null> {
    const url = this.makeVideoDataAPIUrl(videoId);
    const response = await axios.get(url);
    const data = response.data;
    if (data?.items?.length === 0) {
      return null;
    }

    const video = data.items[0];
    const { publishedAt, channelId, title, description, thumbnails, channelTitle } = video.snippet;
    const metadata: YouTubeVideoData = {
      title,
      description,
      thumbnailUrl: thumbnails?.lenght > 0 && thumbnails.pop().url,
      uploadDate: new Date(publishedAt),
      uploaderId: channelId,
      uploaderName: channelTitle
    };

    return metadata;
  }

  async getChannelMetadata(channelId: string): Promise<YouTubeChannelData | null> {
    const url = this.makeChannelDataAPIUrl(channelId);
    const response = await axios.get(url);
    const data = response.data;
    if (data?.items?.length === 0) {
      return null;
    }

    const channel = data.items[0];

    const { publishedAt, description, thumbnails, title } = channel.snippet;
    const metadata: YouTubeChannelData = {
      name: title,
      description,
      publishedAt: new Date(publishedAt),
      thumbnailUrl: thumbnails?.length > 0 && thumbnails.pop().url
    };

    return metadata;
  }

  async getChannelIDForVideoID(videoId: string): Promise<string | null> {
    const url = this.makeVideoDataAPIUrl(videoId);
    const response = await axios.get(url);
    const data = response.data;
    return data.items[0]?.snippet?.channelId || null;
  }

  async getChannelIDForCustomURLHandle(handle: string): Promise<string | null> {
    const url = this.makeChannelSearchAPIUrl(handle);
    const response = await axios.get(url);
    const data = response.data;
    return data.items[0]?.snippet?.channelId || null;
  }

  private makeVideoDataAPIUrl(videoId: string): string {
    return YouTubeAPIService.VIDEO_DATA_API_URL
      .replace(':videoId', videoId)
      .replace(':apiKey', this.apiKey);
  }

  private makeChannelDataAPIUrl(channelId: string): string {
    return YouTubeAPIService.CHANNEL_DATA_API_URL
      .replace(':channelId', channelId)
      .replace(':apiKey', this.apiKey);
  }

  private makeChannelSearchAPIUrl(handle: string): string {
    return YouTubeAPIService.CHANNEL_SEARCH_API_URL
      .replace(':handle', handle)
      .replace(':apiKey', this.apiKey);
  }
}

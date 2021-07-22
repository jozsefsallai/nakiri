import axios from 'axios';

export class YouTubeAPIService {
  static VIDEO_DATA_API_URL = 'https://www.googleapis.com/youtube/v3/videos?id=:videoId&key=:apiKey&part=snippet';
  static CHANNEL_SEARCH_API_URL = 'https://www.googleapis.com/youtube/v3/search?q=:handle&part=snippet&type=channel&key=:apiKey';

  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
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

  private makeChannelSearchAPIUrl(handle: string): string {
    return YouTubeAPIService.CHANNEL_SEARCH_API_URL
      .replace(':handle', handle)
      .replace(':apiKey', this.apiKey);
  }
}

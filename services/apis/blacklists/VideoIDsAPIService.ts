import axiosService, { APIResponse } from '@/services/axios';

import { IYouTubeVideoID } from '@/db/models/blacklists/YouTubeVideoID';

export interface GetVideoIDsAPIResponse extends APIResponse {
  videoIDs: IYouTubeVideoID[];
};

export interface AddVideoIDAPIRequest {
  videoID: string;
  guild?: string;
};

export interface AddVideoIDAPIResponse extends APIResponse {
};

export class VideoIDsAPIService {
  static GET_VIDEO_IDS_URL = '/api/lists/youtube/videos?compact=false';

  static ADD_VIDEO_ID_URL = '/api/lists/youtube/videos';
  static ADD_VIDEO_ID_WITH_GUILD_URL = '/api/lists/youtube/videos?guild=:guild';

  public async getVideoIDs(): Promise<GetVideoIDsAPIResponse> {
    return axiosService.get(VideoIDsAPIService.GET_VIDEO_IDS_URL)
      .then(res => res.data);
  }

  public async addVideoID({ videoID, guild }: AddVideoIDAPIRequest): Promise<AddVideoIDAPIResponse> {
    const url = this.makeAddVideoIDURL(guild);
    return axiosService.post(url, { videoID }).then(res => res.data);
  }

  private makeAddVideoIDURL(guild?: string): string {
    if (guild) {
      return VideoIDsAPIService.ADD_VIDEO_ID_WITH_GUILD_URL.replace(':guild', guild);
    }

    return VideoIDsAPIService.ADD_VIDEO_ID_URL;
  }
}

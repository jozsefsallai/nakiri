import axiosService, { APIResponse } from '@/services/axios';

import { IYouTubeVideoID } from '@/db/models/blacklists/YouTubeVideoID';

export interface GetVideoIDsAPIRequest {
  guild?: string;
  page?: number;
  limit?: number;
};

export interface GetVideoIDsAPIResponse extends APIResponse {
  videoIDs: IYouTubeVideoID[];
};

export interface AddVideoIDAPIRequest {
  videoID: string;
  guild?: string;
};

export interface AddVideoIDAPIResponse extends APIResponse {
};

export interface DeleteVideoIDAPIResponse extends APIResponse {
};

export class VideoIDsAPIService {
  static GET_VIDEO_IDS_URL = '/api/lists/youtube/videos?compact=false&page=:page&limit=:limit';
  static GET_VIDEO_IDS_WITH_GUILD_URL = '/api/lists/youtube/videos?compact=false&guild=:guild&strict=true&page=:page&limit=:limit';

  static ADD_VIDEO_ID_URL = '/api/lists/youtube/videos';
  static ADD_VIDEO_ID_WITH_GUILD_URL = '/api/lists/youtube/videos?guild=:guild';

  static DELETE_VIDEO_ID_URL = '/api/lists/youtube/videos/:id';

  public async getVideoIDs({ guild, page, limit }: GetVideoIDsAPIRequest): Promise<GetVideoIDsAPIResponse> {
    const url = this.makeGetVideoIDsURL(guild, page, limit);
    return axiosService.get(url).then(res => res.data);
  }

  public async addVideoID({ videoID, guild }: AddVideoIDAPIRequest): Promise<AddVideoIDAPIResponse> {
    const url = this.makeAddVideoIDURL(guild);
    return axiosService.post(url, { videoID }).then(res => res.data);
  }

  public async deleteVideoID(videoID: string): Promise<DeleteVideoIDAPIResponse> {
    const url = this.makeDeleteVideoIDURL(videoID);
    return axiosService.delete(url).then(res => res.data);
  }

  private makeGetVideoIDsURL(guild?: string, page?: number, limit?: number): string {
    const url = guild
      ? VideoIDsAPIService.GET_VIDEO_IDS_WITH_GUILD_URL.replace(':guild', guild)
      : VideoIDsAPIService.GET_VIDEO_IDS_URL;

    return url
      .replace(':page', (page ?? 1).toString())
      .replace(':limit', (limit ?? 25).toString());
  }

  private makeAddVideoIDURL(guild?: string): string {
    if (guild) {
      return VideoIDsAPIService.ADD_VIDEO_ID_WITH_GUILD_URL.replace(':guild', guild);
    }

    return VideoIDsAPIService.ADD_VIDEO_ID_URL;
  }

  private makeDeleteVideoIDURL(videoID: string): string {
    return VideoIDsAPIService.DELETE_VIDEO_ID_URL.replace(':id', videoID);
  }
}

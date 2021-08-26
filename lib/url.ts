import axios from 'axios';

import parse from 'url-parse';

export const YOUTUBE_REGEX = /(https?:\/\/)?(www\.)?(youtube|youtu|youtube-nocookie)\.(com|be)\/(watch\?v=|embed\/|v\/|.+\?v=)?(?<id>[A-Za-z0-9\-=_]{11})/g;
export const YOUTUBE_CHANNEL_REGEX = /(https?:\/\/)?(?:www\.)?youtube.com\/(?:(?:(?:channel\/(?<cid>UC.*?)(?:[^a-zA-Z0-9-_]|$)))|(?:(?:c\/)?(?<chandle>.*?))(?:[^a-zA-Z0-9-_]|$))/g;
export const DISCORD_INVITE_REGEX = /discord((app)?.(com\/invite|gg))\/(?<id>[A-Za-z0-9-_]+)/g;
export const LINK_REGEX = /(https?:\/\/)?([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/g;

export interface YouTubeChannelMatch {
  id?: string;
  handle?: string;
};

export class URLUtils {
  url: string | null;

  constructor(url: string) {
    this.url = url;
  }

  private handleYouTubeCase() {
    const parsedUrl = parse(this.url);

    if (parsedUrl.hostname !== 'consent.youtube.com') {
      return;
    }

    const continueParam = parsedUrl.query.continue;

    if (!continueParam) {
      return;
    }

    this.url = continueParam;
  }

  async prepare() {
    try {
      if (!this.url.startsWith('http')) {
        this.url = `http://${this.url}`;
      }

      const response = await axios.get(this.url);
      if (response?.request?.res?.responseUrl) {
        this.url = response.request.res.responseUrl;
      }

      this.handleYouTubeCase();
    } catch (err) {
      this.url = null;
    }
  }

  public isYouTubeVideo(): boolean {
    const result = this.url && YOUTUBE_REGEX.test(this.url);
    YOUTUBE_REGEX.lastIndex = 0;
    return result;
  }

  public isYouTubeChannel(): boolean {
    const handle = this.url && YOUTUBE_CHANNEL_REGEX.exec(this.url)?.groups?.chandle;
    YOUTUBE_CHANNEL_REGEX.lastIndex = 0;
    return handle && handle !== 'watch';
  }

  public isDiscordInvite(): boolean {
    const result = this.url && DISCORD_INVITE_REGEX.test(this.url);
    DISCORD_INVITE_REGEX.lastIndex = 0;
    return result;
  }

  static extractYouTubeID(content: string): string | null {
    const match = YOUTUBE_REGEX.exec(content);
    YOUTUBE_REGEX.lastIndex = 0;

    if (!match || !match.groups?.id) {
      return null;
    }

    return match.groups.id;
  }

  static extractYouTubeIDs(content: string): string[] {
    const matches = content.matchAll(YOUTUBE_REGEX);
    return Array.from(matches)
      .filter(match => match.groups?.id)
      .map(match => match.groups.id);
  }

  static extractYouTubeChannel(content: string): YouTubeChannelMatch | null {
    const match = YOUTUBE_CHANNEL_REGEX.exec(content);
    YOUTUBE_CHANNEL_REGEX.lastIndex = 0;

    if (!match || !match.groups?.cid) {
      return null;
    }

    return {
      id: match.groups.cid,
      handle: match.groups.chandle
    };
  }

  static extractYouTubeChannels(content: string): YouTubeChannelMatch[] {
    const matches = content.matchAll(YOUTUBE_CHANNEL_REGEX);
    return Array.from(matches)
      .filter(match => match.groups?.cid)
      .map(match => {
        return {
          id: match.groups.cid,
          handle: match.groups.chandle
        };
      });
  }

  static extractDiscordInvite(content: string): string | null {
    const match = DISCORD_INVITE_REGEX.exec(content);
    DISCORD_INVITE_REGEX.lastIndex = 0;

    if (!match || !match.groups?.id) {
      return null;
    }

    return match.groups.id;
  }

  static extractDiscordInvites(content: string): string[] {
    const matches = content.matchAll(DISCORD_INVITE_REGEX);
    return Array.from(matches)
      .filter(m => m.groups?.id)
      .map(m => m.groups.id);
  }

  static extractLinks(content: string): string[] {
    const matches = content.matchAll(LINK_REGEX);
    return Array.from(matches).map(match => match[0]);
  }
}

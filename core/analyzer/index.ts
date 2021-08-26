import { IAnalyzerOptions } from './IAnalyzerOptions';

import config from '@/config';
import db from '@/services/db';
import { FindConditions, IsNull, Repository } from 'typeorm';

import { YouTubeVideoID } from '@/db/models/blacklists/YouTubeVideoID';
import { YouTubeChannelID } from '@/db/models/blacklists/YouTubeChannelID';
import { LinkPattern } from '@/db/models/blacklists/LinkPattern';
import { DiscordGuild } from '@/db/models/blacklists/DiscordGuild';

import { YouTubeAPIService } from '@/services/youtube';
import { DiscordAPIService } from '@/services/discord';
import { URLUtils, YouTubeChannelMatch } from '@/lib/url';

import { addYouTubeVideoID } from '@/controllers/youtube-video-ids/addYouTubeVideoID';

export interface AnalyzerResult {
  options: IAnalyzerOptions;
  problematic: boolean;
  problematicVideoIDs: string[];
  problematicChannelIDs: string[];
  problematicDiscordInvites: string[];
  problematicLinks: string[];
};

interface LinkAnalysisResults {
  problematicLinks: string[];
  problematicVideoIDs: string[];
  problematicChannelIDs: string[];
  problematicDiscordInvites: string[];
};

export class Analyzer {
  private content: string;

  private analyzeYouTubeVideoIDs: boolean;
  private analyzeYouTubeChannelIDs: boolean;
  private analyzeYouTubeChannelHandles: boolean;
  private analyzeDiscordInvites: boolean;
  private analyzeLinks: boolean;
  private followRedirects: boolean;
  private preemptiveVideoIDAnalysis: boolean;
  private greedy: boolean;
  private guildId?: string;
  private strictGuildCheck: boolean;

  private youTubeAPI?: YouTubeAPIService;
  private discordAPI?: DiscordAPIService;

  private youTubeVideoIDRepository: Repository<YouTubeVideoID>;
  private youTubeChannelIDRepository: Repository<YouTubeChannelID>;
  private discordGuildRepository: Repository<DiscordGuild>;
  private linkPatternRepository: Repository<LinkPattern>;

  constructor(content: string, options: IAnalyzerOptions) {
    this.content = content;

    this.analyzeYouTubeVideoIDs = options.analyzeYouTubeVideoIDs ?? true;
    this.analyzeYouTubeChannelIDs = options.analyzeYouTubeChannelIDs ?? true;
    this.analyzeYouTubeChannelHandles = options.analyzeYouTubeChannelHandles ?? true;
    this.analyzeDiscordInvites = options.analyzeDiscordInvites ?? true;
    this.analyzeLinks = options.analyzeLinks ?? true;
    this.followRedirects = options.followRedirects ?? true;
    this.preemptiveVideoIDAnalysis = options.preemptiveVideoIDAnalysis ?? true;
    this.greedy = options.greedy ?? false;
    this.guildId = options.guildId;
    this.strictGuildCheck = options.strictGuildCheck ?? false;

    if (this.preemptiveVideoIDAnalysis && config.youtube?.apiKey) {
      this.youTubeAPI = new YouTubeAPIService(config.youtube.apiKey);
    }

    if (this.analyzeDiscordInvites) {
      this.discordAPI = new DiscordAPIService();
    }
  }

  public async prepare() {
    await db.prepare();
    this.youTubeVideoIDRepository = db.getRepository(YouTubeVideoID);
    this.youTubeChannelIDRepository = db.getRepository(YouTubeChannelID);
    this.linkPatternRepository = db.getRepository(LinkPattern);
    this.discordGuildRepository = db.getRepository(DiscordGuild);
  }

  private _makeFindConditions<T = YouTubeVideoID | YouTubeChannelID | DiscordGuild>(id: string, fieldName: 'videoId' | 'channelId' | 'blacklistedId'): FindConditions<T>[] {
    const conditions: FindConditions<YouTubeVideoID | YouTubeChannelID | DiscordGuild>[] = [];

    const baseCondition = { [`${fieldName}`]: id };

    if (this.guildId) {
      conditions.push({ ...baseCondition, guildId: this.guildId });

      if (this.strictGuildCheck) {
        return conditions;
      }
    }

    conditions.push({ ...baseCondition, guildId: IsNull() });
    return conditions;
  }

  private async getVideoUploader(videoId: string): Promise<YouTubeChannelID | null> {
    if (!this.preemptiveVideoIDAnalysis || !this.youTubeAPI) {
      return null;
    }

    const channelId = await this.youTubeAPI.getChannelIDForVideoID(videoId);
    if (!channelId) {
      return null;
    }

    const where = this._makeFindConditions<YouTubeChannelID>(channelId, 'channelId');
    const entry = await this.youTubeChannelIDRepository.findOne({ where });

    if (!entry) {
      return null;
    }

    return entry;
  }

  private async checkChannelHandle(handle: string): Promise<boolean> {
    if (!this.analyzeYouTubeChannelHandles || !this.youTubeAPI) {
      return false;
    }

    const channelId = await this.youTubeAPI.getChannelIDForCustomURLHandle(handle);
    if (!channelId) {
      return false;
    }

    const where = this._makeFindConditions<YouTubeChannelID>(channelId, 'channelId');
    const entry = await this.youTubeChannelIDRepository.findOne({ where });
    return !!entry;
  }

  private async handleYouTubeVideos(videoIDs: string[]): Promise<string[]> {
    if (!this.analyzeYouTubeVideoIDs) {
      return [];
    }

    const problematicIDs = [];

    for await (const videoId of videoIDs) {
      const where = this._makeFindConditions<YouTubeVideoID>(videoId, 'videoId');
      const entry = await this.youTubeVideoIDRepository.findOne({ where });

      if (entry) {
        problematicIDs.push(videoId);

        if (!this.greedy) {
          break;
        }

        continue;
      }

      const videoUploader = await this.getVideoUploader(videoId);
      if (videoUploader) {
        problematicIDs.push(videoId);

        try {
          await addYouTubeVideoID(videoId, videoUploader.guildId);
        } catch (_) {}

        if (!this.greedy) {
          break;
        }
      }
    }

    return problematicIDs;
  }

  private async handleYouTubeChannels(channels: YouTubeChannelMatch[]): Promise<string[]> {
    if (!this.analyzeYouTubeChannelIDs) {
      return [];
    }

    const problematicIDs = [];

    for await (const channel of channels) {
      const { id, handle } = channel;

      if (id) {
        const where = this._makeFindConditions<YouTubeChannelID>(id, 'channelId');
        const entry = await this.youTubeChannelIDRepository.findOne({ where });

        if (entry) {
          problematicIDs.push(id);

          if (!this.greedy) {
            break;
          }
        }

        continue;
      }

      if (handle) {
        const isBlacklisted = await this.checkChannelHandle(handle);
        if (isBlacklisted) {
          problematicIDs.push(handle);

          if (!this.greedy) {
            break;
          }
        }
      }
    }

    return problematicIDs;
  }

  private async handleDiscordInvites(invites: string[]): Promise<string[]> {
    if (!this.analyzeDiscordInvites) {
      return [];
    }

    const problemaicInvites = [];

    for await (const invite of invites) {
      const inviteData = await this.discordAPI.getInvite(invite);
      if (!inviteData || !inviteData.guild) {
        continue;
      }

      const where = this._makeFindConditions<DiscordGuild>(inviteData.guild.id, 'blacklistedId');
      const entry = this.discordGuildRepository.findOne({ where });

      if (entry) {
        problemaicInvites.push(invite);

        if (!this.greedy) {
          break;
        }
      }
    }

    return problemaicInvites;
  }

  private checkLink(link: string, patterns: RegExp[]): boolean {
    let found = false;

    for (const pattern of patterns) {
      if (pattern.test(link)) {
        found = true;
      }

      pattern.lastIndex = 0; // might not even need to do this

      if (found) {
        break;
      }
    }

    return found;
  }

  private async handleLinks(links: string[]): Promise<LinkAnalysisResults> {
    const problematicLinks = [];
    const problematicVideoIDs = [];
    const problematicChannelIDs = [];
    const problematicDiscordInvites = [];

    let patterns = [];
    if (this.analyzeLinks) {
      // TODO: optimize/cache this
      const where: FindConditions<LinkPattern>[] = !this.guildId
        ? [{ guildId: IsNull() }]
        : this.strictGuildCheck
          ? [ { guildId: this.guildId } ]
          : [ { guildId: IsNull() }, { guildId: this.guildId } ];

      const allEntries = await this.linkPatternRepository.find({ where });
      patterns = allEntries.map(entry => new RegExp(entry.pattern, 'gm'));
    }

    for (const link of links) {
      if (patterns.length && this.checkLink(link, patterns)) {
        problematicLinks.push(link);

        if (!this.greedy) {
          break;
        }

        continue;
      }

      if (this.followRedirects) {
        const urldata = new URLUtils(link);
        await urldata.prepare();

        if (urldata.isYouTubeVideo()) {
          const videoId = URLUtils.extractYouTubeID(urldata.url);
          const result = await this.handleYouTubeVideos([ videoId ]);

          if (result.length && !problematicVideoIDs.includes(videoId)) {
            problematicVideoIDs.push(videoId);

            if (!this.greedy) {
              break;
            }
          }

          continue;
        }

        if (urldata.isYouTubeChannel()) {
          const channel = URLUtils.extractYouTubeChannel(urldata.url);

          const result = await this.handleYouTubeChannels([ channel ]);

          if (result.length && !problematicChannelIDs.includes(result[0])) {
            problematicChannelIDs.push(result[0]);

            if (!this.greedy) {
              break;
            }
          }

          continue;
        }

        if (urldata.isDiscordInvite()) {
          const invite = URLUtils.extractDiscordInvite(urldata.url);

          const result = await this.handleDiscordInvites([ invite ]);

          if (result.length && !problematicDiscordInvites.includes(invite)) {
            problematicDiscordInvites.push(invite);

            if (!this.greedy) {
              break;
            }
          }
        }
      }
    }

    return {
      problematicLinks,
      problematicVideoIDs,
      problematicChannelIDs,
      problematicDiscordInvites,
    };
  }

  public async analyze(): Promise<AnalyzerResult> {
    await this.prepare();

    const result: AnalyzerResult = {
      options: {
        analyzeYouTubeVideoIDs: this.analyzeYouTubeVideoIDs,
        analyzeYouTubeChannelIDs: this.analyzeYouTubeChannelIDs,
        analyzeYouTubeChannelHandles: this.analyzeYouTubeChannelHandles,
        analyzeDiscordInvites: this.analyzeDiscordInvites,
        analyzeLinks: this.analyzeLinks,
        followRedirects: this.followRedirects,
        preemptiveVideoIDAnalysis: this.preemptiveVideoIDAnalysis,
        greedy: this.greedy,
        guildId: this.guildId,
        strictGuildCheck: this.strictGuildCheck
      },

      problematic: false,

      problematicVideoIDs: [],
      problematicChannelIDs: [],
      problematicDiscordInvites: [],
      problematicLinks: []
    };

    const videoIDs = URLUtils.extractYouTubeIDs(this.content);
    const problematicVideoIDs = await this.handleYouTubeVideos(videoIDs);
    result.problematicVideoIDs.push(...problematicVideoIDs);

    if (problematicVideoIDs.length && !this.greedy) {
      result.problematic = true;
      return result;
    }

    const channelIDs = URLUtils.extractYouTubeChannels(this.content);
    const problematicChannelIDs = await this.handleYouTubeChannels(channelIDs);
    result.problematicChannelIDs.push(...problematicChannelIDs);

    if (problematicChannelIDs.length && !this.greedy) {
      result.problematic = true;
      return result;
    }

    const discordInvites = URLUtils.extractDiscordInvites(this.content);
    const problematicDiscordInvites = await this.handleDiscordInvites(discordInvites);
    result.problematicDiscordInvites.push(...problematicDiscordInvites);

    if (problematicDiscordInvites.length && !this.greedy) {
      result.problematic = true;
      return result;
    }

    const links = URLUtils.extractLinks(this.content);
    const problematicLinksResult = await this.handleLinks(links);
    result.problematicLinks.push(...problematicLinksResult.problematicLinks);
    result.problematicVideoIDs.push(...problematicLinksResult.problematicVideoIDs.filter(id => !result.problematicVideoIDs.includes(id)));
    result.problematicChannelIDs.push(...problematicLinksResult.problematicChannelIDs.filter(id => !result.problematicChannelIDs.includes(id)));
    result.problematicDiscordInvites.push(...problematicLinksResult.problematicDiscordInvites.filter(id => !result.problematicDiscordInvites.includes(id)));

    result.problematic = result.problematicVideoIDs.length > 0
      || result.problematicChannelIDs.length > 0
      || result.problematicDiscordInvites.length > 0
      || result.problematicLinks.length > 0;

    return result;
  }
}

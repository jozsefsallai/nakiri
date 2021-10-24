// Type definitions for messages coming FROM the gateway server TO a websocket
// client IN RESPONSE TO a gateway request.

import { AnalyzerResult } from '@/core/analyzer';
import { IDiscordGuild } from '@/db/models/blacklists/DiscordGuild';
import { ILinkPattern } from '@/db/models/blacklists/LinkPattern';
import { IPhrase } from '@/db/models/blacklists/Phrase';
import { IYouTubeChannelID } from '@/db/models/blacklists/YouTubeChannelID';
import { IYouTubeVideoID } from '@/db/models/blacklists/YouTubeVideoID';

import { APIPaginationData } from '@/services/axios';

// Fields all gateway responses should have.
export interface GatewayResponse<T = any> {
  requestId?: string;
  ok: boolean;
  error?: string;
  data?: T;
}

// Gateway response for the 'identify' event.
//   client.on('identify', (response: IdentifyResponse))
export type IdentifyResponse = GatewayResponse<{
  sessionId: string;
}>;

// Gateway response for the 'reconnect' event.
//   client.on('reconnected', (response: ReconnectResponse))
export type ReconnectResponse = GatewayResponse;

// Fields all blacklist responses should implement.
export type GetBlacklistEntriesResponse<
  T extends any,
  U extends string,
> = GatewayResponse<
  {
    pagination: APIPaginationData;
    compact: boolean;
  } & {
    [key in U]: (T | string)[];
  }
>;

export type GetYouTubeVideoIDsResponse = GetBlacklistEntriesResponse<
  IYouTubeVideoID,
  'videos'
>;

export type GetYouTubeChannelIDsResponse = GetBlacklistEntriesResponse<
  IYouTubeChannelID,
  'channels'
>;

export type GetLinkPatternsResponse = GetBlacklistEntriesResponse<
  ILinkPattern,
  'linkPatterns'
>;

export type GetBlacklistedGuildsResponse = GetBlacklistEntriesResponse<
  IDiscordGuild,
  'guilds'
>;

export type GetBlacklistedPhrasesResponse = GetBlacklistEntriesResponse<
  IPhrase,
  'phrases'
>;

export type AnalysisResponse = GatewayResponse<{
  content: string;
  results: AnalyzerResult;
}>;

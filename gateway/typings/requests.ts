// Type definitions for messages coming FROM websocket clients TO the gateway
// server.

import { IAnalyzerOptions } from '@/core/analyzer/IAnalyzerOptions';

// Interface all request types should extend.
export interface GatewayRequest {
  requestId?: string;
}

// Used to authenticate the Websocket client using an API key.
//   client.on('identify', (data: IdentifyRequest))
export interface IdentifyRequest extends GatewayRequest {
  apiKey: string;
}

// Used to reconnnect to the Websocket server after a connection dropped.
//   client.on('reconnect', (data: ReconnectRequest))
export interface ReconnectRequest extends IdentifyRequest {
  sessionId: string;
}

// Interface all guild-restrictable requests should extend.
export interface GuildRestrictableRequest extends GatewayRequest {
  guildId?: string;
  strict?: boolean; // if true, only the provided guild's entries will be returned
}

// Interface all blacklist requests should extend.
export interface GetBlacklistEntriesRequest extends GuildRestrictableRequest {
  limit?: number;
  page?: number;
  compact?: boolean;
}

// Used to request a list of blacklisted video IDs.
//   client.on('getYouTubeVideoIDs', (data: GetYouTubeVideoIDsRequest))
export interface GetYouTubeVideoIDsRequest extends GetBlacklistEntriesRequest {}

// Used to request a list of blacklisted channel IDs.
//   client.on('getYouTubeChannelIDs', (data: GetYouTubeChannelIDsRequest))
export interface GetYouTubeChannelIDsRequest
  extends GetBlacklistEntriesRequest {}

// Used to request a list of blacklisted link patterns.
//   client.on('getLinkPatterns', (data: GetLinkPatternsRequest))
export interface GetLinkPatternsRequest extends GetBlacklistEntriesRequest {}

// Used to request a list of blacklisted Discord guild IDs.
//   client.on('getGuildIDs', (data: GetBlacklistedGuildsRequest))
export interface GetBlacklistedGuildsRequest extends GuildRestrictableRequest {}

// Used to request a list of blacklisted phrases.
//   client.on('getPhrases', (data: GetPhrasesRequest))
export interface GetBlacklistedPhrasesRequest
  extends GuildRestrictableRequest {}

// Used to request the analysis of a message.
//   client.on('analysisRequested', (data: AnalysisRequest))
export interface AnalysisRequest extends GatewayRequest {
  content: string;
  options: IAnalyzerOptions;
}

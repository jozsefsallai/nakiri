export interface IAnalyzerOptions {
  analyzeYouTubeVideoIDs?: boolean;
  analyzeYouTubeChannelIDs?: boolean;
  analyzeYouTubeChannelHandles?: boolean;
  analyzeLinks?: boolean;
  followRedirects?: boolean;
  preemptiveVideoIDAnalysis?: boolean;
  greedy?: boolean;
  guildId?: string;
  strictGuildCheck?: boolean;
};

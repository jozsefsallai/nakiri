export interface IAnalyzerOptions {
  analyzeYouTubeVideoIDs?: boolean;
  analyzeYouTubeChannelIDs?: boolean;
  analyzeYouTubeChannelHandles?: boolean;
  analyzeDiscordInvites?: boolean;
  analyzeLinks?: boolean;
  analyzePhrases?: boolean;
  phraseAnalysisThreshold?: number;
  followRedirects?: boolean;
  preemptiveVideoIDAnalysis?: boolean;
  greedy?: boolean;
  guildId?: string;
  strictGuildCheck?: boolean;
  strictGroupCheck?: boolean;
}

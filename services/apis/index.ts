import { GuildsAPIService } from './guilds/GuildsAPIService';
import { UsersAPIService } from './users/UsersAPIService';

import { VideoIDsAPIService } from './blacklists/VideoIDsAPIService';
import { ChannelIDsAPIService } from './blacklists/ChannelIDsAPIService';
import { LinkPatternsAPIService } from './blacklists/LinkPatternsAPIService';

import { MonitoredKeywordsAPIService } from './monitored-keywords/MonitoredKeywordsAPIService';
import { KeywordWhitelistedChannelsAPIService } from './monitored-keywords/KeywordWhitelistedChannels';
import { KeywordSearchResultsAPIService } from './monitored-keywords/KeywordSearchResultsAPIService';

class APIService {
  public users = new UsersAPIService();
  public guilds = new GuildsAPIService();

  public videoIDs = new VideoIDsAPIService();
  public channelIDs = new ChannelIDsAPIService();
  public patterns = new LinkPatternsAPIService();

  public monitoredKeywords = new MonitoredKeywordsAPIService();
  public keywordWhitelistedChannels = new KeywordWhitelistedChannelsAPIService();
  public keywordSearchResults = new KeywordSearchResultsAPIService();
};

const apiService = new APIService();
export default apiService;

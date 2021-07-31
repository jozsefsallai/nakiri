import { GuildsAPIService } from './guilds/GuildsAPIService';
import { UsersAPIService } from './users/UsersAPIService';

import { VideoIDsAPIService } from './blacklists/VideoIDsAPIService';
import { ChannelIDsAPIService } from './blacklists/ChannelIDsAPIService';
import { LinkPatternsAPIService } from './blacklists/LinkPatternsAPIService';
import { MonitoredKeywordsAPIService } from './monitored-keywords/MonitoredKeywordsAPIService';

class APIService {
  public users = new UsersAPIService();
  public guilds = new GuildsAPIService();

  public videoIDs = new VideoIDsAPIService();
  public channelIDs = new ChannelIDsAPIService();
  public patterns = new LinkPatternsAPIService();

  public monitoredKeywords = new MonitoredKeywordsAPIService();
};

const apiService = new APIService();
export default apiService;

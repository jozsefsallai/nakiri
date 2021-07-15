import { GuildsAPIService } from './guilds/GuildsAPIService';
import { UsersAPIService } from './users/UsersAPIService';

class APIService {
  public users = new UsersAPIService();
  public guilds = new GuildsAPIService();
};

const apiService = new APIService();
export default apiService;

import { UsersAPIService } from './users/UsersAPIService';

class APIService {
  public users = new UsersAPIService();
};

const apiService = new APIService();
export default apiService;

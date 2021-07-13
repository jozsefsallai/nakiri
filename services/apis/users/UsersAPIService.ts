import axiosService from '@/services/axios';
import { APIResponse } from '@/services/axios';

import { IUser } from '@/lib/User';

export interface GetLoggedInUserAPIResponse extends APIResponse {
  user: IUser;
};

export class UsersAPIService {
  static GET_LOGGED_IN_USER_URL = '/api/users/me';

  public async getLoggedInUser(headers?: any): Promise<GetLoggedInUserAPIResponse> {
    return axiosService.get(UsersAPIService.GET_LOGGED_IN_USER_URL, { headers })
      .then(res => res.data);
  }
}

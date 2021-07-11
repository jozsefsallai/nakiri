import axiosService from '@/services/axios';
import { APIResponse } from '@/services/axios';

import { IUser } from '@/db/models/auth/AuthorizedUser';

export interface GetLoggedInUserAPIResponse extends APIResponse {
  user: IUser;
};

export class UsersAPIService {
  static GET_LOGGED_IN_USER_URL = '/api/users/me';

  public async getLoggedInUser(): Promise<GetLoggedInUserAPIResponse> {
    return axiosService.get(UsersAPIService.GET_LOGGED_IN_USER_URL)
      .then(res => res.data);
  }
}

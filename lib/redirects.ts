import apiService from '@/services/apis';
import { UserPermissions, UserPermissionsUtil } from './UserPermissions';

export const redirectIfAnonmyous = async (req, res): Promise<boolean> => {
  try {
    await apiService.users.getLoggedInUser(req.headers);
    return false;
  } catch (_) {
    res.writeHead(302, {
      location: '/manage/login'
    });
    res.end();

    return true;
  }
};

export const redirectIfAuthenticated = async (req, res): Promise<boolean> => {
  try {
    await apiService.users.getLoggedInUser(req.headers);

    res.writeHead(302, {
      location: '/manage/home'
    });
    res.end();

    return true;
  } catch (_) {
    return false;
  }
};

export const redirectIfDoesNotHavePermission = async (req, res, permission: UserPermissions): Promise<boolean> => {
  try {
    const { user } = await apiService.users.getLoggedInUser(req.headers);

    if (!UserPermissionsUtil.hasPermission(user.permissions, permission)) {
      res.writeHead(302, {
        location: '/manage/home'
      });
      res.end();

      return true;
    }

    return false;
  } catch (_) {
    res.writeHead(302, {
      location: '/manage/login'
    });
    res.end();

    return false;
  }
};

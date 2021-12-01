import { NextRequest, NextResponse } from 'next/server';

import apiService from '@/services/apis';
import { UserPermissions, UserPermissionsUtil } from './UserPermissions';

const getHeadersObject = (req: NextRequest) => {
  return Object.fromEntries(req.headers.entries());
};

export const redirectIfAnonymous = async (
  req: NextRequest,
): Promise<Response | undefined> => {
  try {
    await apiService.users.getLoggedInUser(getHeadersObject(req));
    NextResponse.next();
  } catch (err) {
    console.log(err);
    return NextResponse.redirect('/manage/login', 302);
  }
};

export const redirectIfAuthenticated = async (
  req: NextRequest,
): Promise<Response | undefined> => {
  try {
    await apiService.users.getLoggedInUser(getHeadersObject(req));
    return Response.redirect('/manage/guilds', 302);
  } catch (_) {
    NextResponse.next();
  }
};

export const redirectIfDoesNotHavePermission = async (
  req: NextRequest,
  permission: UserPermissions,
): Promise<Response | undefined> => {
  try {
    const { user } = await apiService.users.getLoggedInUser(
      getHeadersObject(req),
    );

    if (!UserPermissionsUtil.hasPermission(user.permissions, permission)) {
      return Response.redirect('/manage/guilds', 302);
    }

    NextResponse.next();
  } catch (_) {
    return Response.redirect('/manage/login', 302);
  }
};

export const redirectIfDoesNotHaveOneOfPermissions = async (
  req: NextRequest,
  permissions: UserPermissions[],
): Promise<Response | undefined> => {
  try {
    const { user } = await apiService.users.getLoggedInUser(
      getHeadersObject(req),
    );

    const userPermissions = permissions.filter((permission) =>
      UserPermissionsUtil.hasPermission(user.permissions, permission),
    );

    if (userPermissions.length === 0) {
      return Response.redirect('/manage/guilds', 302);
    }

    NextResponse.next();
  } catch (_) {
    return Response.redirect('/manage/login', 302);
  }
};

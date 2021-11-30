import { NextRequest, NextResponse } from 'next/server';

import apiService from '@/services/apis';
import { UserPermissions, UserPermissionsUtil } from './UserPermissions';

export const redirectIfAnonymous = async (
  req: NextRequest,
): Promise<Response | undefined> => {
  try {
    await apiService.users.getLoggedInUser(req.headers);
    NextResponse.next();
  } catch (err) {
    return NextResponse.redirect('/manage/login', 302);
  }
};

export const redirectIfAuthenticated = async (
  req: NextRequest,
): Promise<Response | undefined> => {
  try {
    await apiService.users.getLoggedInUser(req.headers);
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
    const { user } = await apiService.users.getLoggedInUser(req.headers);

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
    const { user } = await apiService.users.getLoggedInUser(req.headers);

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

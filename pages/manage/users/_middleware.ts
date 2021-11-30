import { redirectIfDoesNotHavePermission } from '@/lib/redirects';
import { UserPermissions } from '@/lib/UserPermissions';
import { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  return redirectIfDoesNotHavePermission(
    req,
    UserPermissions.MANAGE_AUTHORIZED_USERS,
  );
}

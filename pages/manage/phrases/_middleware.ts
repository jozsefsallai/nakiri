import { redirectIfDoesNotHaveOneOfPermissions } from '@/lib/redirects';
import { UserPermissions } from '@/lib/UserPermissions';
import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  if (req.page.name !== 'new') {
    NextResponse.next();
  }

  return redirectIfDoesNotHaveOneOfPermissions(req, [
    UserPermissions.MANAGE_GLOBAL_BLACKLISTS,
    UserPermissions.MANAGE_OWN_GUILD_BLACKLISTS,
  ]);
}

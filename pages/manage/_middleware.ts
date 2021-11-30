import { redirectIfAnonymous, redirectIfAuthenticated } from '@/lib/redirects';
import { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  if (req.page.name === 'login') {
    return redirectIfAuthenticated(req);
  }

  return redirectIfAnonymous(req);
}

import { redirectIfAnonymous, redirectIfAuthenticated } from '@/lib/redirects';
import { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  if (req.page.name === '/manage/login') {
    return redirectIfAuthenticated(req);
  }

  return redirectIfAnonymous(req);
}

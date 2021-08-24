import bar from 'next-bar';
import { withSentry } from '@sentry/nextjs';

import * as usersController from '@/controllers/users/usersController';

import { ensureAuthenticated } from '@/middleware/auth';
import { ensureUserHasPermissions } from '@/middleware/permissions';

import { UserPermissions } from '@/lib/UserPermissions';

export default bar({
  post: withSentry(
    ensureAuthenticated(
      ensureUserHasPermissions(
        usersController.authorize,
        [ UserPermissions.MANAGE_AUTHORIZED_USERS ]
      ), true
    )
  )
});
